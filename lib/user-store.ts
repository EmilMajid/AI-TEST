import fs from "fs"
import path from "path"
import { MOCK_USERS } from "@/lib/mock-data"
import { getUserUniqueId } from "@/lib/profile-utils"

const TMP_FILE = path.join("/tmp", "testai_registered_users.json")

export interface StoredUser {
  id: string | number
  email: string
  password?: string
  accountType: string // "parent" | "student" | "teacher" | "director" | "admin"
  firstName: string
  lastName: string
  fatherName?: string
  school?: string
  class?: string
  region?: string
  role?: string
  createdAt?: string
}

// Global in-memory cache
const inMemoryUsers: StoredUser[] = []

function loadFromDisk(): StoredUser[] {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const data = fs.readFileSync(TMP_FILE, "utf-8")
      return JSON.parse(data) || []
    }
  } catch (err) {
    // Ignore read errors
  }
  return []
}

function saveToDisk(users: StoredUser[]) {
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(users, null, 2), "utf-8")
  } catch (err) {
    // Ignore write errors
  }
}

export function getAllUsers(): StoredUser[] {
  const diskUsers = loadFromDisk()
  const map = new Map<string, StoredUser>()

  // 1. Base MOCK_USERS
  for (const u of MOCK_USERS) {
    const key = (u.email || String(u.id)).toLowerCase()
    map.set(key, u as StoredUser)
  }

  // 2. Disk users
  for (const u of diskUsers) {
    const key = (u.email || String(u.id)).toLowerCase()
    map.set(key, { ...map.get(key), ...u })
  }

  // 3. In-memory users
  for (const u of inMemoryUsers) {
    const key = (u.email || String(u.id)).toLowerCase()
    map.set(key, { ...map.get(key), ...u })
  }

  return Array.from(map.values())
}

export function saveUser(user: StoredUser): StoredUser {
  const emailKey = (user.email || String(user.id)).toLowerCase()

  const existingIndex = inMemoryUsers.findIndex(
    (u) => (u.email && u.email.toLowerCase() === emailKey) || String(u.id) === String(user.id)
  )
  if (existingIndex >= 0) {
    inMemoryUsers[existingIndex] = { ...inMemoryUsers[existingIndex], ...user }
  } else {
    inMemoryUsers.push(user)
  }

  const mockIdx = MOCK_USERS.findIndex(
    (u) => (u.email && u.email.toLowerCase() === emailKey) || String(u.id) === String(user.id)
  )
  if (mockIdx >= 0) {
    MOCK_USERS[mockIdx] = { ...MOCK_USERS[mockIdx], ...user } as any
  } else {
    MOCK_USERS.push(user as any)
  }

  try {
    saveToDisk(getAllUsers())
  } catch (e) {}

  return user
}

export function findUsers(query: { emailOrId?: string; role?: string }): StoredUser[] {
  const users = getAllUsers()
  const cleanInput = (query.emailOrId || "").trim().toLowerCase()
  const cleanId = cleanInput.startsWith("@") ? cleanInput : `@${cleanInput}`

  let matches = users.filter((u) => {
    const emailMatch = u.email && u.email.toLowerCase() === cleanInput
    const userUid = getUserUniqueId(u).toLowerCase()
    const idMatch = userUid === cleanId || userUid.replace("@", "") === cleanInput.replace("@", "")
    return emailMatch || idMatch
  })

  if (query.role) {
    const roleMatches = matches.filter(
      (u) => u.accountType === query.role || u.role === query.role
    )
    if (roleMatches.length > 0) {
      matches = roleMatches
    }
  }

  return matches
}
