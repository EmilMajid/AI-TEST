export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"

const ACCOUNTS_FILE = path.join(process.cwd(), "data", "antigravity_accounts.json")

export interface AntigravityAccountProfile {
  id: string
  label: string
  accountEmail: string
  apiKey: string
  model: string
  agentRole: string
  isDefault?: boolean
  createdAt?: string
}

interface AccountsData {
  activeAccountId: string
  accounts: AntigravityAccountProfile[]
}

const DEFAULT_ACCOUNTS: AntigravityAccountProfile[] = [
  {
    id: "ag-gemini-31-pro",
    label: "Gemini 3.1 Pro (Əsas Agent Modeli)",
    accountEmail: "emilinpoctu@gmail.com",
    apiKey: "",
    model: "gemini-3.1-pro",
    agentRole: "Dərin Mühakimə & Kurikulum Baş Metodisti",
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "ag-gemini-38-flash",
    label: "Gemini 3.8 Flash (Ultra Sürət & Performans)",
    accountEmail: "emilinpoctu@gmail.com",
    apiKey: "",
    model: "gemini-3.8-flash",
    agentRole: "Sürətli Test İstehsalatı Agenti",
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "ag-claude-sonnet-46",
    label: "Claude Sonnet 4.6 (thinking)",
    accountEmail: "emilinpoctu@gmail.com",
    apiKey: "",
    model: "claude-sonnet-4.6-thinking",
    agentRole: "Dərin Refaktorinq & Analitik Sual Eksperti",
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "ag-gpt-oss",
    label: "GPT-OSS-120b (Açıq Mənbəli)",
    accountEmail: "emilinpoctu@gmail.com",
    apiKey: "",
    model: "gpt-oss-120b",
    agentRole: "Sərbəst Mühakimə & Kodlaşdırma",
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
]

function loadAccountsData(): AccountsData {
  try {
    if (fs.existsSync(ACCOUNTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, "utf-8"))
      if (Array.isArray(data.accounts) && data.accounts.length > 0) {
        return {
          activeAccountId: data.activeAccountId || data.accounts[0].id,
          accounts: data.accounts,
        }
      }
    }
  } catch (e) {
    console.error("[Antigravity Accounts Load Error]:", e)
  }

  // Fallback / Initial write
  const initialData: AccountsData = {
    activeAccountId: DEFAULT_ACCOUNTS[0].id,
    accounts: DEFAULT_ACCOUNTS,
  }
  saveAccountsData(initialData)
  return initialData
}

function saveAccountsData(data: AccountsData) {
  try {
    const dir = path.dirname(ACCOUNTS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(data, null, 2), "utf-8")
  } catch (e) {
    console.error("[Antigravity Accounts Save Error]:", e)
  }
}

// GET: Hesabların siyahısını və aktiv hesabı qaytarır
export async function GET() {
  const data = loadAccountsData()
  const activeAccount = data.accounts.find((a) => a.id === data.activeAccountId) || data.accounts[0]
  return NextResponse.json({
    success: true,
    activeAccountId: data.activeAccountId,
    activeAccount,
    accounts: data.accounts,
  })
}

// POST: Hesab dəyişmə, yeni hesab əlavə etmə və ya silmə
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    const data = loadAccountsData()

    // 1. Hesabı dəyiş (Switch active account)
    if (action === "switch") {
      const { id } = body
      const target = data.accounts.find((a) => a.id === id)
      if (!target) {
        return NextResponse.json({ success: false, error: "Göstərilən Antigravity hesabı tapılmadı" }, { status: 404 })
      }
      data.activeAccountId = id
      saveAccountsData(data)
      return NextResponse.json({
        success: true,
        message: `Google Antigravity hesabı dəyişdirildi: ${target.label} (${target.accountEmail})`,
        activeAccountId: id,
        activeAccount: target,
        accounts: data.accounts,
      })
    }

    // 2. Yeni hesab əlavə et və ya mövcud hesabı yenilə (Save / Update)
    if (action === "save") {
      const { account, makeActive = true } = body
      if (!account || !account.accountEmail) {
        return NextResponse.json({ success: false, error: "Google hesabı e-poçt ünvanı mütləqdir" }, { status: 400 })
      }

      const email = account.accountEmail.trim()
      const label = (account.label || "").trim() || `Google Antigravity (${email})`
      const model = account.model || "gemini-1.5-pro-latest"
      const agentRole = (account.agentRole || "").trim() || "Kurikulum və DİM Baş Metodisti"
      const apiKey = (account.apiKey || "").trim()

      const existingIndex = account.id ? data.accounts.findIndex((a) => a.id === account.id) : -1

      if (existingIndex >= 0) {
        // Yenilə
        data.accounts[existingIndex] = {
          ...data.accounts[existingIndex],
          label,
          accountEmail: email,
          apiKey,
          model,
          agentRole,
        }
        if (makeActive) {
          data.activeAccountId = data.accounts[existingIndex].id
        }
      } else {
        // Yeni hesab yarat
        const newId = `ag-${Date.now()}`
        const newAccount: AntigravityAccountProfile = {
          id: newId,
          label,
          accountEmail: email,
          apiKey,
          model,
          agentRole,
          createdAt: new Date().toISOString(),
        }
        data.accounts.unshift(newAccount)
        if (makeActive) {
          data.activeAccountId = newId
        }
      }

      saveAccountsData(data)
      const active = data.accounts.find((a) => a.id === data.activeAccountId) || data.accounts[0]

      return NextResponse.json({
        success: true,
        message: `Google Antigravity hesabı uğurla saxlanıldı və aktiv edildi: ${email}`,
        activeAccountId: data.activeAccountId,
        activeAccount: active,
        accounts: data.accounts,
      })
    }

    // 3. Hesabı sil (Delete)
    if (action === "delete") {
      const { id } = body
      if (data.accounts.length <= 1) {
        return NextResponse.json({ success: false, error: "Ən azı bir Google Antigravity hesabı sistemdə qalmalıdır" }, { status: 400 })
      }
      data.accounts = data.accounts.filter((a) => a.id !== id)
      if (data.activeAccountId === id) {
        data.activeAccountId = data.accounts[0].id
      }
      saveAccountsData(data)
      const active = data.accounts.find((a) => a.id === data.activeAccountId) || data.accounts[0]

      return NextResponse.json({
        success: true,
        message: "Google Antigravity hesabı silindi",
        activeAccountId: data.activeAccountId,
        activeAccount: active,
        accounts: data.accounts,
      })
    }

    return NextResponse.json({ success: false, error: "Naməlum əməliyyat" }, { status: 400 })
  } catch (err: any) {
    console.error("[Antigravity Account Action Error]:", err)
    return NextResponse.json({ success: false, error: err?.message || "Daxili server xətası" }, { status: 500 })
  }
}
