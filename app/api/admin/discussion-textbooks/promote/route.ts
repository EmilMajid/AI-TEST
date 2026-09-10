export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"

const DISC_FILE = path.join(process.cwd(), "data", "discussion_textbooks.json")
const TEXTBOOKS_FILE = path.join(process.cwd(), "data", "textbooks.json")
const ARCHIVED_FILE = path.join(process.cwd(), "data", "archived_textbooks.json")
const BACKUP_DIR = path.join(process.cwd(), "data", "backups")
const DISC_CHUNKS_FILE = path.join(process.cwd(), "data", "textbook-chunks-discussion.jsonl")
const MAIN_CHUNKS_FILE = path.join(process.cwd(), "data", "textbook-chunks.jsonl")

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { discussionBookId, targetOfficialId, replaceAction = "replace", operatorName = "Admin" } = body

    if (!discussionBookId) {
      return NextResponse.json(
        { success: false, error: "Dərslik ID-si (discussionBookId) tələb olunur" },
        { status: 400 }
      )
    }

    // 1. Load discussion books
    if (!fs.existsSync(DISC_FILE)) {
      return NextResponse.json({ success: false, error: "Müzakirə dərslikləri bazası tapılmadı" }, { status: 404 })
    }
    const discussionBooks = JSON.parse(fs.readFileSync(DISC_FILE, "utf-8"))
    const discBookIndex = discussionBooks.findIndex((b: any) => b.id === discussionBookId)
    if (discBookIndex === -1) {
      return NextResponse.json({ success: false, error: "Müzakirə dərsliyi tapılmadı" }, { status: 404 })
    }
    const discBook = discussionBooks[discBookIndex]

    // 2. Load active textbooks
    if (!fs.existsSync(TEXTBOOKS_FILE)) {
      return NextResponse.json({ success: false, error: "Rəsmi dərsliklər bazası tapılmadı" }, { status: 404 })
    }
    const activeTextbooks = JSON.parse(fs.readFileSync(TEXTBOOKS_FILE, "utf-8"))
    const grade = String(discBook.grade)
    if (!activeTextbooks[grade]) {
      activeTextbooks[grade] = []
    }

    // 3. Create timestamped atomic backup of textbooks.json
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true })
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupFileName = `textbooks_backup_${timestamp}.json`
    const backupFilePath = path.join(BACKUP_DIR, backupFileName)
    fs.writeFileSync(backupFilePath, JSON.stringify(activeTextbooks, null, 2), "utf-8")

    // 4. Determine target book to replace or add alongside
    const targetId = targetOfficialId || discBook.targetOfficialId
    let existingIndex = -1
    let archivedRecord: any = null

    if (targetId && targetId !== "new") {
      existingIndex = activeTextbooks[grade].findIndex((b: any) => b.id === targetId)
    }

    // Prepare new official textbook entry
    const newOfficialId = targetId && targetId !== "new" && replaceAction === "replace"
      ? targetId
      : `${discBook.subject.toLowerCase().replace(/\s+/g, "-")}-${grade}-${discBook.trimsId || Date.now()}`

    const cleanTitle = discBook.title.replace(/\s*\(Layihə\)/gi, "").trim()
    const topicsFormatted = Array.isArray(discBook.topics)
      ? discBook.topics.join("\n")
      : (typeof discBook.topics === "string" ? discBook.topics : "")

    const newOfficialEntry = {
      id: newOfficialId,
      title: cleanTitle,
      subject: discBook.subject,
      type: "pdf",
      path: discBook.pdfUrl || "",
      e_derslik_id: discBook.trimsId || "",
      topics: topicsFormatted,
      source: "trims_promoted",
      promotedAt: new Date().toISOString(),
      originalDiscussionId: discBook.id,
    }

    // 5. If replacing, archive the old textbook
    if (existingIndex >= 0 && replaceAction === "replace") {
      const oldBook = activeTextbooks[grade][existingIndex]
      archivedRecord = {
        ...oldBook,
        grade,
        archivedAt: new Date().toISOString(),
        replacedByDiscussionId: discBook.id,
        newOfficialId,
        backupFile: backupFileName,
        operator: operatorName,
      }

      // Save to archived_textbooks.json
      let archivedList = []
      if (fs.existsSync(ARCHIVED_FILE)) {
        try {
          archivedList = JSON.parse(fs.readFileSync(ARCHIVED_FILE, "utf-8"))
        } catch (e) {}
      }
      archivedList.unshift(archivedRecord)
      fs.writeFileSync(ARCHIVED_FILE, JSON.stringify(archivedList, null, 2), "utf-8")

      // Replace in active array
      activeTextbooks[grade][existingIndex] = newOfficialEntry
    } else {
      // Add as new entry
      activeTextbooks[grade].push(newOfficialEntry)
    }

    // Save active textbooks
    fs.writeFileSync(TEXTBOOKS_FILE, JSON.stringify(activeTextbooks, null, 2), "utf-8")

    // 6. Update discussion book status to "promoted"
    discussionBooks[discBookIndex] = {
      ...discBook,
      status: "promoted",
      promotedAt: new Date().toISOString(),
      promotedToId: newOfficialId,
      lastBackupFile: backupFileName,
    }
    fs.writeFileSync(DISC_FILE, JSON.stringify(discussionBooks, null, 2), "utf-8")

    // 7. Sync chunks if any exist in textbook-chunks-discussion.jsonl
    let syncedChunksCount = 0
    if (fs.existsSync(DISC_CHUNKS_FILE)) {
      try {
        const content = fs.readFileSync(DISC_CHUNKS_FILE, "utf-8")
        const lines = content.split("\n").filter(Boolean)
        const matchedChunks: string[] = []

        for (const line of lines) {
          try {
            const chunk = JSON.parse(line)
            if (chunk.book_id === discBook.id || chunk.trims_id === discBook.trimsId) {
              const promotedChunk = {
                ...chunk,
                book_id: newOfficialId,
                type: "promoted_trims",
                promotedAt: new Date().toISOString(),
              }
              matchedChunks.push(JSON.stringify(promotedChunk))
            }
          } catch (e) {}
        }

        if (matchedChunks.length > 0 && fs.existsSync(MAIN_CHUNKS_FILE)) {
          fs.appendFileSync(MAIN_CHUNKS_FILE, "\n" + matchedChunks.join("\n") + "\n", "utf-8")
          syncedChunksCount = matchedChunks.length
        }
      } catch (err) {
        console.error("Error migrating discussion chunks:", err)
      }
    }

    return NextResponse.json({
      success: true,
      message: `"${discBook.title}" uğurla rəsmi tədris dərsliklərinə əlavə edildi və əvəzləndi! 🎉`,
      promotedBook: newOfficialEntry,
      archivedBook: archivedRecord,
      backupFile: backupFileName,
      syncedChunksCount,
      rollbackToken: backupFileName,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
