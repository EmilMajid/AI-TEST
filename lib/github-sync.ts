import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export interface PushQuestionsParams {
  grade: string | number
  textbook: string
  topic: string
  questions: Array<{
    id?: string
    passport_id?: string
    text?: string
    question?: string
    options: string[]
    correctIndex?: number
    correctAnswer?: number
    explanation?: string
    difficulty?: string
    bloomLevel?: string
  }>
}

export interface PushResult {
  success: boolean
  commitSha?: string
  message: string
  addedCount: number
  totalInSubject: number
  error?: string
}

function getCleanGrade(grade: string | number): string {
  const match = String(grade).match(/\b([1-9]|1[0-1])\b/)
  return match ? match[0] : "2"
}

export async function saveAndPushQuestions(params: PushQuestionsParams): Promise<PushResult> {
  const { grade, textbook, topic, questions } = params
  const cleanGrade = getCleanGrade(grade)
  const filePath = path.join(process.cwd(), "data", "grades", `grade_${cleanGrade}.json`)

  if (!fs.existsSync(filePath)) {
    // If grade file doesn't exist, create it with empty object
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, "{}", "utf-8")
  }

  let db: Record<string, any[]> = {}
  try {
    const raw = fs.readFileSync(filePath, "utf-8")
    db = JSON.parse(raw)
  } catch (err: any) {
    db = {}
  }

  // Find or create textbook key
  let subjectKey = Object.keys(db).find(
    (k) => k.toLowerCase().trim() === textbook.toLowerCase().trim()
  )
  if (!subjectKey) {
    subjectKey = textbook.trim()
    db[subjectKey] = []
  }

  const newQuestions = questions.map((q, idx) => {
    const qText = (q.question || q.text || "").trim()
    const correct = typeof q.correctAnswer === "number" ? q.correctAnswer : (typeof q.correctIndex === "number" ? q.correctIndex : 0)
    return {
      passport_id: q.passport_id || `PASS-${cleanGrade}-${Date.now()}-${idx + 1}`,
      topic: topic.trim(),
      question: qText,
      options: q.options || [],
      correctAnswer: correct,
      explanation: q.explanation || "Dərslik kurrikulum standartına əsaslanan elmi izah.",
      difficulty: q.difficulty || "orta",
      bloomLevel: q.bloomLevel || "anlama",
      status: "active",
      sourceContext: `testai.az Aİ Generasiya Mərkəzi — ${cleanGrade}-ci sinif ${subjectKey}`,
      createdAt: new Date().toISOString(),
    }
  })

  // Append new questions
  db[subjectKey].push(...newQuestions)

  // Write updated file to disk
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), "utf-8")
  console.log(`[SAVE] Saved ${newQuestions.length} questions to ${filePath} under "${subjectKey}". Total: ${db[subjectKey].length}`)

  const commitMsg = `feat(test-bank): add ${newQuestions.length} questions for ${subjectKey} - "${topic}" [Grade ${cleanGrade}]`

  // 1. Try local Git commit & push
  try {
    const gitRelativePath = `data/grades/grade_${cleanGrade}.json`
    await execAsync(`git add "${gitRelativePath}"`, { cwd: process.cwd() })
    const { stdout: commitOut } = await execAsync(`git commit -m "${commitMsg}"`, { cwd: process.cwd() })
    console.log("[GIT COMMIT]:", commitOut.trim())

    const { stdout: pushOut } = await execAsync("git push origin main", { cwd: process.cwd() })
    console.log("[GIT PUSH]:", pushOut.trim())

    const shaMatch = commitOut.match(/\[[a-zA-Z0-9_-]+\s+([a-f0-9]+)\]/)
    const commitSha = shaMatch ? shaMatch[1] : undefined

    return {
      success: true,
      commitSha,
      message: `${newQuestions.length} sual uğurla bazaya yazıldı və GitHub-a push edildi! 🚀`,
      addedCount: newQuestions.length,
      totalInSubject: db[subjectKey].length,
    }
  } catch (gitErr: any) {
    console.warn("[GIT CLI] Local git command failed or not configured, attempting GitHub REST API...", gitErr?.message)
  }

  // 2. Fallback to GitHub REST API
  const token = process.env.GITHUB_TOKEN || "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"
  const owner = process.env.GITHUB_REPO_OWNER || "EmilMajid"
  const repo = process.env.GITHUB_REPO_NAME || "AI-TEST"
  const branch = process.env.GITHUB_REPO_BRANCH || "main"

  try {
    const gitPath = `data/grades/grade_${cleanGrade}.json`
    // Get latest commit sha of branch
    const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, {
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "testai-app",
      },
    })
    const refData = await refRes.json()
    const latestCommitSha = refData?.object?.sha

    // Create blob
    const fileContent = fs.readFileSync(filePath, "utf-8")
    const blobRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "testai-app",
      },
      body: JSON.stringify({
        content: fileContent,
        encoding: "utf-8",
      }),
    })
    const blobData = await blobRes.json()

    // Get current tree
    const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`, {
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "testai-app",
      },
    })
    const commitData = await commitRes.json()
    const baseTreeSha = commitData?.tree?.sha

    // Create new tree
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "testai-app",
      },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: [
          {
            path: gitPath,
            mode: "100644",
            type: "blob",
            sha: blobData.sha,
          },
        ],
      }),
    })
    const treeData = await treeRes.json()

    // Create new commit
    const newCommitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "testai-app",
      },
      body: JSON.stringify({
        message: commitMsg,
        tree: treeData.sha,
        parents: [latestCommitSha],
      }),
    })
    const newCommitData = await newCommitRes.json()

    // Update branch ref
    const updateRefRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "testai-app",
      },
      body: JSON.stringify({
        sha: newCommitData.sha,
        force: false,
      }),
    })

    if (updateRefRes.ok) {
      console.log(`[GITHUB API SUCCESS] Committed and pushed commit ${newCommitData.sha}`)
      return {
        success: true,
        commitSha: newCommitData.sha.substring(0, 7),
        message: `${newQuestions.length} sual uğurla bazaya yazıldı və GitHub API ilə birbaşa push edildi! 🚀`,
        addedCount: newQuestions.length,
        totalInSubject: db[subjectKey].length,
      }
    } else {
      const err = await updateRefRes.json()
      throw new Error(err?.message || "GitHub ref update xətası")
    }
  } catch (apiErr: any) {
    console.error("[GITHUB SYNC ERROR]:", apiErr)
    return {
      success: true,
      addedCount: newQuestions.length,
      totalInSubject: db[subjectKey].length,
      message: `${newQuestions.length} sual yerli bazaya yazıldı, lakin GitHub-a push edilərkən xəta: ${apiErr.message}`,
      error: apiErr.message,
    }
  }
}
