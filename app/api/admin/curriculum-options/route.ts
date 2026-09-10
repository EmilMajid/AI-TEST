export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get("grade") || "2"
    const sourceType = searchParams.get("sourceType") || "official"

    // If discussion textbooks requested
    if (sourceType === "discussion") {
      const discPath = path.join(process.cwd(), "data", "discussion_textbooks.json")
      if (!fs.existsSync(discPath)) {
        return NextResponse.json({ success: false, textbooks: [] }, { status: 404 })
      }

      const allDiscBooks = JSON.parse(fs.readFileSync(discPath, "utf-8"))
      const availableGrades = Array.from(
        new Set(allDiscBooks.map((b: any) => String(b.grade)))
      ).sort((a: any, b: any) => Number(a) - Number(b))

      const gradeBooks = allDiscBooks.filter((b: any) => String(b.grade) === String(grade))

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
          trimsId: b.trimsId,
          title: b.title,
          subject: b.subject,
          part: b.part,
          isDiscussion: true,
          ragIndexed: b.ragIndexed,
          topics: topicList,
        }
      })

      return NextResponse.json({
        success: true,
        grade,
        sourceType: "discussion",
        availableGrades,
        textbooks: formattedBooks,
      })
    }

    // Default: official textbooks
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
      sourceType: "official",
      availableGrades: Object.keys(allTextbooks).sort((a, b) => Number(a) - Number(b)),
      textbooks: formattedBooks,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 })
  }
}
