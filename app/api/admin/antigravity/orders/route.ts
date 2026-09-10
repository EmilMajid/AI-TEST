export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const ORDERS_FILE = path.join(process.cwd(), "data", "antigravity_orders.json")

export interface AntigravityOrder {
  id: string
  createdAt: string
  grade: string
  textbook: string
  topics: string[]
  questionCount: number
  difficulty: string
  bloomLevel?: string
  questionType?: string
  notes?: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  account: {
    githubUsername: string
    repoOwner: string
    repoName: string
    branch: string
    operatorName?: string
    operatorRole?: string
  }
  executionResult?: {
    completedAt?: string
    generatedCount?: number
    commitSha?: string
    error?: string
  }
}

function loadOrders(): AntigravityOrder[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"))
      if (Array.isArray(data)) return data
    }
  } catch (e) {
    console.error("Error loading orders:", e)
  }
  return []
}

function saveOrders(orders: AntigravityOrder[]) {
  try {
    const dir = path.dirname(ORDERS_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8")
  } catch (e) {
    console.error("Error saving orders:", e)
  }
}

export async function GET(request: NextRequest) {
  try {
    const orders = loadOrders()
    return NextResponse.json({ success: true, orders })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { grade, textbook, topics, questionCount, difficulty, notes, account, questionType, bloomLevel } = body

    if (!grade || !textbook || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json(
        { success: false, error: "Sinif, dərslik və ən azı bir mövzu seçilməlidir" },
        { status: 400 }
      )
    }

    const orders = loadOrders()
    const newOrder: AntigravityOrder = {
      id: `ORD-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${String(orders.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      grade: String(grade),
      textbook,
      topics,
      questionCount: Number(questionCount) || 20,
      difficulty: difficulty || "orta",
      bloomLevel: bloomLevel || "qarışıq",
      questionType: questionType || "standart",
      notes: notes || "",
      status: "pending",
      account: {
        githubUsername: account?.githubUsername || "EmilMajid",
        repoOwner: account?.repoOwner || "EmilMajid",
        repoName: account?.repoName || "AI-TEST",
        branch: account?.branch || "main",
        operatorName: account?.operatorName || "Emil Məcidzadə",
        operatorRole: account?.operatorRole || "Baş Administrator",
      },
    }

    orders.unshift(newOrder)
    saveOrders(orders)

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: `Sifariş #${newOrder.id} uğurla Antigravity növbəsinə əlavə edildi! 🚀`,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Sifariş ID tələb olunur" }, { status: 400 })
    }

    let orders = loadOrders()
    orders = orders.filter((o) => o.id !== id)
    saveOrders(orders)

    return NextResponse.json({ success: true, message: "Sifariş silindi" })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
