export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"

const DISC_FILE = path.join(process.cwd(), "data", "discussion_textbooks.json")

function loadDiscussionBooks() {
  if (fs.existsSync(DISC_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DISC_FILE, "utf-8"))
    } catch (e) {
      console.error("Error reading discussion textbooks:", e)
    }
  }
  return []
}

function saveDiscussionBooks(books: any[]) {
  const dir = path.dirname(DISC_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DISC_FILE, JSON.stringify(books, null, 2), "utf-8")
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get("grade")
    const status = searchParams.get("status")

    let books = loadDiscussionBooks()

    if (grade && grade !== "all") {
      books = books.filter((b: any) => String(b.grade) === String(grade))
    }

    if (status && status !== "all") {
      books = books.filter((b: any) => b.status === status)
    }

    // Return books along with overall stats
    const allBooks = loadDiscussionBooks()
    const stats = {
      total: allBooks.length,
      grade7: allBooks.filter((b: any) => String(b.grade) === "7").length,
      grade8: allBooks.filter((b: any) => String(b.grade) === "8").length,
      grade9: allBooks.filter((b: any) => String(b.grade) === "9").length,
      ragIndexedCount: allBooks.filter((b: any) => b.ragIndexed).length,
      promotedCount: allBooks.filter((b: any) => b.status === "promoted").length,
      discussionCount: allBooks.filter((b: any) => b.status === "discussion").length,
    }

    return NextResponse.json({
      success: true,
      stats,
      textbooks: books,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, grade, subject, part, pdfUrl, topics, targetOfficialId } = body

    if (!title || !grade || !subject) {
      return NextResponse.json(
        { success: false, error: "Dərslik adı, sinif və fənn tələb olunur" },
        { status: 400 }
      )
    }

    const books = loadDiscussionBooks()
    const bookId = id || `trims-disc-${Date.now()}`
    const existingIndex = books.findIndex((b: any) => b.id === bookId)

    const updatedBook = {
      id: bookId,
      trimsId: body.trimsId || "",
      title,
      officialTitle: body.officialTitle || title,
      grade: String(grade),
      subject,
      part: part || "Tam dərslik",
      status: body.status || "discussion",
      targetOfficialId: targetOfficialId || "",
      pdfUrl: pdfUrl || "",
      coverUrl: body.coverUrl || "",
      trimsUrl: body.trimsUrl || "",
      publisher: body.publisher || "Azərbaycan Respublikası Elm və Təhsil Nazirliyi",
      ragIndexed: !!body.ragIndexed,
      ragChunkCount: body.ragChunkCount || 0,
      testCount: body.testCount || 0,
      topics: Array.isArray(topics) ? topics : (typeof topics === "string" ? topics.split("\n").filter(Boolean) : []),
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      books[existingIndex] = { ...books[existingIndex], ...updatedBook }
    } else {
      books.push(updatedBook)
    }

    saveDiscussionBooks(books)

    return NextResponse.json({
      success: true,
      message: "Müzakirə dərsliyi uğurla yadda saxlanıldı",
      textbook: updatedBook,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
