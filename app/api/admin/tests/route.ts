import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const offlinePath = path.join(dataDir, "offline_tests.json");
const textbooksPath = path.join(dataDir, "textbooks.json");

function getSubjectKey(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes("riyaziyyat")) return "Riyaziyyat";
  if (t.includes("informatika")) return "İnformatika";
  if (t.includes("biologiya")) return "Biologiya";
  if (t.includes("fizika")) return "Fizika";
  if (t.includes("kimya")) return "Kimya";
  if (t.includes("azərbaycan dili")) return "Azərbaycan dili";
  if (t.includes("ədəbiyyat")) return "Ədəbiyyat";
  if (t.includes("azərbaycan tarixi")) return "Azərbaycan tarixi";
  if (t.includes("ümumi tarix")) return "Ümumi tarix";
  if (t.includes("ingilis") || t.includes("english")) return "İngilis dili";
  if (t.includes("rus") || t.includes("русский")) return "Rus dili";
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get("grade");
    const subject = searchParams.get("subject"); // Book title like "Riyaziyyat 7"
    const topic = searchParams.get("topic");

    const tbData = JSON.parse(fs.readFileSync(textbooksPath, "utf8"));
    const dbData = JSON.parse(fs.readFileSync(offlinePath, "utf8"));

    // Step 1: No params -> Return Grades
    if (!grade) {
      const grades = Object.keys(tbData);
      return NextResponse.json({ success: true, type: "grades", data: grades });
    }

    // Step 2: Grade provided, no subject -> Return Subjects (Books)
    if (grade && !subject) {
      const books = tbData[grade] || [];
      const subjects = books.map((b: any) => ({
        title: b.title,
        cover: b.coverBase64 || null,
        description: b.description || ""
      }));
      return NextResponse.json({ success: true, type: "subjects", data: subjects });
    }

    // Step 3: Grade & Subject provided, no topic -> Return Topics with question counts
    if (grade && subject && !topic) {
      const subjKey = getSubjectKey(subject);
      if (!subjKey || !dbData[subjKey]) {
        return NextResponse.json({ success: true, type: "topics", data: [] });
      }

      const topicsList = dbData[subjKey].map((t: any) => ({
        topic_key: t.topic_key,
        questionCount: t.questions ? t.questions.length : 0
      }));

      return NextResponse.json({ success: true, type: "topics", data: topicsList });
    }

    // Step 4: Grade, Subject & Topic provided -> Return exact Questions
    if (grade && subject && topic) {
      const subjKey = getSubjectKey(subject);
      if (!subjKey || !dbData[subjKey]) {
        return NextResponse.json({ success: false, message: "Baza tapılmadı" });
      }

      const topicObj = dbData[subjKey].find((t: any) => t.topic_key === topic);
      if (!topicObj) {
        return NextResponse.json({ success: false, message: "Bu mövzu üzrə test tapılmadı" });
      }

      return NextResponse.json({ success: true, type: "questions", data: topicObj.questions });
    }

    return NextResponse.json({ success: false, message: "Invalid parameters" });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
