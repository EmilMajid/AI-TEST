export const dynamic = "force-dynamic"
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const offlinePath = path.join(process.cwd(), "data", "offline_tests.json");
const textbooksPath = path.join(process.cwd(), "data", "textbooks.json");

function getSubjectKeys(title: string, keys: string[]): string[] {
  const t = title.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i");
  let matchedKeys = keys.filter(k => k === title || k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i") === t || t.includes(k.toLowerCase()) || k.toLowerCase().includes(t));
  
  if (matchedKeys.length === 0) {
      if (t.includes("riyaziyyat")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("riyaziyyat"));
      else if (t.includes("informatika") || t.includes("nformatika")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("informatika") || k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("nformatika"));
      else if (t.includes("biologiya")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("biologiya"));
      else if (t.includes("fizika")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("fizika"));
      else if (t.includes("kimya")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("kimya"));
      else if (t.includes("azərbaycan dili")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("azərbaycan dili"));
      else if (t.includes("ədəbiyyat")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("ədəbiyyat"));
      else if (t.includes("tarix")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("tarix"));
      else if (t.includes("ingilis") || t.includes("english")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("ingilis") || k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("english"));
      else if (t.includes("rus") || t.includes("русский")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("rus") || k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("русский"));
      else if (t.includes("fransız") || t.includes("fransiz")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("fransız") || k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("fransiz"));
      else if (t.includes("alman")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("alman"));
      else if (t.includes("coğrafiya")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("coğrafiya"));
      else if (t.includes("musiqi")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("musiqi"));
      else if (t.includes("təsviri")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("təsviri"));
      else if (t.includes("texnologiya")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("texnologiya"));
      else if (t.includes("təbiət")) matchedKeys = keys.filter(k => k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").includes("təbiət"));
  }
  return matchedKeys;
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

    // Prepare unified questions for the subject
    let subjectQuestions: any[] = [];
    if (subject) {
        const matchedKeys = getSubjectKeys(subject, Object.keys(dbData));
        matchedKeys.forEach(k => {
           const val = dbData[k];
           if (Array.isArray(val)) {
               val.forEach((item: any) => {
                   if (item.questions && Array.isArray(item.questions)) {
                       item.questions.forEach((q: any) => {
                           if (!q.topic && item.topic_key) q.topic = item.topic_key;
                           subjectQuestions.push(q);
                       });
                   } else if (item.question) {
                       subjectQuestions.push(item);
                   }
               });
           } else if (val && typeof val === "object") {
               Object.entries(val).forEach(([topicName, questions]: [string, any]) => {
                   if (Array.isArray(questions)) {
                       questions.forEach((q: any) => {
                           if (!q.topic) q.topic = topicName;
                           subjectQuestions.push(q);
                       });
                   } else if (questions && typeof questions === "object" && questions.question) {
                       if (!questions.topic) questions.topic = topicName;
                       subjectQuestions.push(questions);
                   }
               });
           }
        });
    }

    // Step 3: Grade & Subject provided, no topic -> Return Topics with question counts
    if (grade && subject && !topic) {
      if (subjectQuestions.length === 0) {
        return NextResponse.json({ success: true, type: "topics", data: [] });
      }

      // Group by topic
      const topicCounts: Record<string, number> = {};
      subjectQuestions.forEach(q => {
          const tName = q.topic || "Digər";
          topicCounts[tName] = (topicCounts[tName] || 0) + 1;
      });

      const topicsList = Object.keys(topicCounts).map(tName => ({
        topic_key: tName,
        questionCount: topicCounts[tName]
      }));

      return NextResponse.json({ success: true, type: "topics", data: topicsList });
    }

    // Step 4: Grade, Subject & Topic provided -> Return exact Questions
    if (grade && subject && topic) {
      if (subjectQuestions.length === 0) {
        return NextResponse.json({ success: false, message: "Baza tapılmadı" });
      }

      const topicQuestions = subjectQuestions.filter(q => q.topic === topic);
      if (topicQuestions.length === 0) {
        return NextResponse.json({ success: false, message: "Bu mövzu üzrə test tapılmadı" });
      }

      return NextResponse.json({ success: true, type: "questions", data: topicQuestions });
    }

    return NextResponse.json({ success: false, message: "Invalid parameters" });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
