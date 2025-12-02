"use server"

import { createClient } from "./server"

export async function saveTestResult(
  userId: string,
  testData: {
    title: string
    subject: string
    grade: number
    difficulty: string
    questions: any[]
    userAnswers: any[]
    score: number
    bloomDistribution: any
    timeSpent: number
  },
) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from("test_results").insert([
      {
        user_id: userId,
        test_title: testData.title,
        subject: testData.subject,
        grade: testData.grade,
        difficulty: testData.difficulty,
        questions: testData.questions,
        user_answers: testData.userAnswers,
        score: testData.score,
        bloom_distribution: testData.bloomDistribution,
        time_spent: testData.timeSpent,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) throw new Error(error.message)
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Save test result error:", error)
    throw error
  }
}

export async function getUserResults(userId: string, limit = 50) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("test_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Get user results error:", error)
    throw error
  }
}

export async function linkStudentToParent(studentId: string, parentEmail: string) {
  const supabase = await createClient()

  try {
    // Get parent user ID from email
    const { data: parentUser, error: parentError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", parentEmail)
      .single()

    if (parentError) throw new Error("Parent user not found")

    // Create link
    const { data, error } = await supabase.from("parent_student_links").insert([
      {
        parent_id: parentUser.id,
        student_id: studentId,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) throw new Error(error.message)
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Link student error:", error)
    throw error
  }
}

export async function getLinkedStudents(parentId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("parent_student_links")
      .select("student_id, profiles(*)")
      .eq("parent_id", parentId)

    if (error) throw new Error(error.message)
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Get linked students error:", error)
    throw error
  }
}
