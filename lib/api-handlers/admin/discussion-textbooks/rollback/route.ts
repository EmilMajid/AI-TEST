export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"

const DISC_FILE = path.join(process.cwd(), "data", "discussion_textbooks.json")
const TEXTBOOKS_FILE = path.join(process.cwd(), "data", "textbooks.json")
const ARCHIVED_FILE = path.join(process.cwd(), "data", "archived_textbooks.json")
const BACKUP_DIR = path.join(process.cwd(), "data", "backups")

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { backupFile, discussionBookId } = body

    if (!backupFile) {
      return NextResponse.json(
        { success: false, error: "Bərpa üçün ehtiyat nüsxə faylı (backupFile) tələb olunur" },
        { status: 400 }
      )
    }

    const backupFilePath = path.join(BACKUP_DIR, path.basename(backupFile))
    if (!fs.existsSync(backupFilePath)) {
      return NextResponse.json(
        { success: false, error: `Ehtiyat nüsxə faylı tapılmadı: ${backupFile}` },
        { status: 404 }
      )
    }

    // 1. Restore textbooks.json from backup
    const backupContent = fs.readFileSync(backupFilePath, "utf-8")
    // Validate that it's valid JSON
    JSON.parse(backupContent)
    fs.writeFileSync(TEXTBOOKS_FILE, backupContent, "utf-8")

    // 2. Revert discussion textbook status
    if (fs.existsSync(DISC_FILE)) {
      try {
        const discussionBooks = JSON.parse(fs.readFileSync(DISC_FILE, "utf-8"))
        let updated = false

        for (let i = 0; i < discussionBooks.length; i++) {
          if (
            (discussionBookId && discussionBooks[i].id === discussionBookId) ||
            discussionBooks[i].lastBackupFile === backupFile
          ) {
            discussionBooks[i].status = "discussion"
            delete discussionBooks[i].promotedAt
            delete discussionBooks[i].promotedToId
            updated = true
          }
        }

        if (updated) {
          fs.writeFileSync(DISC_FILE, JSON.stringify(discussionBooks, null, 2), "utf-8")
        }
      } catch (e) {
        console.error("Error reverting discussion status:", e)
      }
    }

    // 3. Remove corresponding record from archived_textbooks.json
    if (fs.existsSync(ARCHIVED_FILE)) {
      try {
        let archived = JSON.parse(fs.readFileSync(ARCHIVED_FILE, "utf-8"))
        archived = archived.filter((item: any) => item.backupFile !== backupFile)
        fs.writeFileSync(ARCHIVED_FILE, JSON.stringify(archived, null, 2), "utf-8")
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      message: "Əvvəlki rəsmi dərsliklər bazası və statuslar uğurla bərpa edildi (Rollback tamamlandı)! 🔄",
      restoredFrom: backupFile,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
