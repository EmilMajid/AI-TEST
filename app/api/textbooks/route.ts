import { type NextRequest, NextResponse } from "next/server"
import { getTextbooks } from "@/lib/education-data"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const studentClass = searchParams.get("class")
    const subject = searchParams.get("subject")

    if (!studentClass || !subject) {
        return NextResponse.json({ error: "Class and subject are required" }, { status: 400 })
    }

    const textbooks = getTextbooks(studentClass, subject)

    return NextResponse.json({
        success: true,
        textbooks
    })
}
