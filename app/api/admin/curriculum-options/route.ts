export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get("grade") || "2"

    const textbooksPath = path.join(process.cwd(), "data", "textbooks.json")
    if (!fs.existsSync(textbooksPath)) {
      return NextResponse.json({ success: false, textbooks: [] }, { status: 404 })
    }

    const allTextbooks = JSON.parse(fs.readFileSync(textbooksPath, "utf-8"))
    const gradeBooks = allTextbooks[grade] || []

    const formattedBooks = gradeBooks.map((b: any) => {
      let topicList: string[] = []
      if (typeof b.topics === "string") {
        topicList = b.topics
          .split("\n")
          .map((t: string) => t.trim())
          .filter((t: string) => t.length > 0 && !t.startsWith("---"))
      } else if (Array.isArray(b.topics)) {
        topicList = b.topics
      }

      return {
        id: b.id,
        title: b.title,
        subject: b.subject,
        topics: topicList,
      }
    })

    return NextResponse.json({
      success: true,
      grade,
      availableGrades: Object.keys(allTextbooks).sort((a, b) => Number(a) - Number(b)),
      textbooks: formattedBooks,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 })
  }
}
