import fs from "fs"
import path from "path"
import os from "os"
import { MOCK_USERS } from "@/lib/mock-data"
import { getUserUniqueId } from "@/lib/profile-utils"

function getStoragePath(filename: string): string {
  try {
    const localDir = path.join(process.cwd(), ".data")
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true })
    }
    return path.join(localDir, filename)
  } catch (e) {
    return path.join(os.tmpdir(), filename)
  }
}

const TMP_FILE = getStoragePath("testai_registered_users.json")
const LINKS_FILE = getStoragePath("testai_student_links.json")

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
  parentId?: string | number
  parentEmail?: string
  isBlocked?: boolean
  status?: "active" | "blocked" | "inactive"
}

// Global in-memory cache
const inMemoryUsers: StoredUser[] = []

// Set of explicitly deleted user identifiers
const deletedUserIds = new Set<string>()

export function isAyazTarget(u: any): boolean {
  if (!u) return false
  const idStr = String(u.id || "").toLowerCase().trim()
  // Only target the specific old test dummy IDs if any
  if (idStr === "student-ayaz-161-test" || idStr === "student-ayaz-309-test") return true
  return false
}

function loadFromDisk(): StoredUser[] {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const data = fs.readFileSync(TMP_FILE, "utf-8")
      const parsed: StoredUser[] = JSON.parse(data) || []
      return parsed.filter(u => !isAyazTarget(u))
    }
  } catch (err) {
    // Ignore read errors
  }
  return []
}

function saveToDisk(users: StoredUser[]) {
  try {
    const clean = users.filter(u => !isAyazTarget(u))
    fs.writeFileSync(TMP_FILE, JSON.stringify(clean, null, 2), "utf-8")
  } catch (err) {
    // Ignore write errors
  }
}

export function getAllUsers(): StoredUser[] {
  const diskUsers = loadFromDisk()
  const map = new Map<string, StoredUser>()

  // 1. Base MOCK_USERS
  for (const u of MOCK_USERS) {
    if (isAyazTarget(u)) continue
    const key = (u.email || String(u.id)).toLowerCase()
    if (deletedUserIds.has(key) || deletedUserIds.has(String(u.id).toLowerCase())) continue
    map.set(key, { ...u, isBlocked: (u as any).isBlocked ?? false, status: (u as any).status || "active" } as StoredUser)
  }

  // 2. Disk users (ignore corrupted demo entries, auto-created user-* entries, or deleted users)
  for (const u of diskUsers) {
    if (isAyazTarget(u)) continue
    const key = (u.email || String(u.id)).toLowerCase()
    if (deletedUserIds.has(key) || deletedUserIds.has(String(u.id).toLowerCase())) continue
    if (u.firstName === "Demo" || u.school?.includes("Demo") || String(u.id).startsWith("user-")) {
      continue
    }
    map.set(key, { ...map.get(key), ...u })
  }

  // 3. In-memory users
  for (const u of inMemoryUsers) {
    if (isAyazTarget(u)) continue
    const key = (u.email || String(u.id)).toLowerCase()
    if (deletedUserIds.has(key) || deletedUserIds.has(String(u.id).toLowerCase())) continue
    if (u.firstName === "Demo" || u.school?.includes("Demo") || String(u.id).startsWith("user-")) {
      continue
    }
    map.set(key, { ...map.get(key), ...u })
  }

  return Array.from(map.values())
}

export function saveUser(user: StoredUser): StoredUser {
  if (isAyazTarget(user)) {
    return user
  }

  const emailKey = (user.email || String(user.id)).toLowerCase()
  deletedUserIds.delete(emailKey)
  deletedUserIds.delete(String(user.id).toLowerCase())

  const userWithStatus: StoredUser = {
    ...user,
    isBlocked: user.isBlocked ?? false,
    status: user.status || (user.isBlocked ? "blocked" : "active")
  }

  const existingIndex = inMemoryUsers.findIndex(
    (u) => (u.email && u.email.toLowerCase() === emailKey) || String(u.id) === String(user.id)
  )
  if (existingIndex >= 0) {
    inMemoryUsers[existingIndex] = { ...inMemoryUsers[existingIndex], ...userWithStatus }
  } else {
    inMemoryUsers.push(userWithStatus)
  }

  const mockIdx = MOCK_USERS.findIndex(
    (u) => (u.email && u.email.toLowerCase() === emailKey) || String(u.id) === String(user.id)
  )
  if (mockIdx >= 0) {
    MOCK_USERS[mockIdx] = { ...MOCK_USERS[mockIdx], ...userWithStatus } as any
  } else {
    MOCK_USERS.push(userWithStatus as any)
  }

  try {
    saveToDisk(getAllUsers())
  } catch (e) {}

  return userWithStatus
}

export function blockUser(idOrEmail: string | number, isBlocked: boolean = true): StoredUser | null {
  const clean = String(idOrEmail).trim().toLowerCase()
  const all = getAllUsers()

  const target = all.find((u) => {
    const uId = getUserUniqueId(u).toLowerCase()
    return (
      String(u.id).toLowerCase() === clean ||
      (u.email && u.email.toLowerCase() === clean) ||
      uId === clean ||
      uId.replace("@", "") === clean.replace("@", "")
    )
  })

  if (!target) return null

  target.isBlocked = isBlocked
  target.status = isBlocked ? "blocked" : "active"

  // In-memory update
  const memIdx = inMemoryUsers.findIndex((u) => String(u.id) === String(target.id) || (u.email && u.email.toLowerCase() === target.email.toLowerCase()))
  if (memIdx >= 0) {
    inMemoryUsers[memIdx].isBlocked = isBlocked
    inMemoryUsers[memIdx].status = target.status
  } else {
    inMemoryUsers.push({ ...target })
  }

  // Mock users update
  const mockIdx = MOCK_USERS.findIndex((u) => String(u.id) === String(target.id) || (u.email && u.email.toLowerCase() === target.email.toLowerCase()))
  if (mockIdx >= 0) {
    (MOCK_USERS[mockIdx] as any).isBlocked = isBlocked
    ;(MOCK_USERS[mockIdx] as any).status = target.status
  }

  try {
    saveToDisk(getAllUsers())
  } catch (e) {}

  return target
}

export function deleteUser(idOrEmail: string | number): boolean {
  const clean = String(idOrEmail).trim().toLowerCase()
  deletedUserIds.add(clean)

  // 1. Remove from inMemoryUsers
  for (let i = inMemoryUsers.length - 1; i >= 0; i--) {
    const u = inMemoryUsers[i]
    const uId = getUserUniqueId(u).toLowerCase()
    if (
      String(u.id).toLowerCase() === clean ||
      (u.email && u.email.toLowerCase() === clean) ||
      uId === clean ||
      uId.replace("@", "") === clean.replace("@", "")
    ) {
      deletedUserIds.add(String(u.id).toLowerCase())
      if (u.email) deletedUserIds.add(u.email.toLowerCase())
      inMemoryUsers.splice(i, 1)
    }
  }

  // 2. Remove from MOCK_USERS
  for (let i = MOCK_USERS.length - 1; i >= 0; i--) {
    const u = MOCK_USERS[i]
    const uId = getUserUniqueId(u as any).toLowerCase()
    if (
      String(u.id).toLowerCase() === clean ||
      (u.email && u.email.toLowerCase() === clean) ||
      uId === clean ||
      uId.replace("@", "") === clean.replace("@", "")
    ) {
      deletedUserIds.add(String(u.id).toLowerCase())
      if (u.email) deletedUserIds.add(u.email.toLowerCase())
      MOCK_USERS.splice(i, 1)
    }
  }

  // 3. Remove from disk users
  const disk = loadFromDisk()
  const cleanDisk = disk.filter((u) => {
    const uId = getUserUniqueId(u).toLowerCase()
    const match =
      String(u.id).toLowerCase() === clean ||
      (u.email && u.email.toLowerCase() === clean) ||
      uId === clean ||
      uId.replace("@", "") === clean.replace("@", "")
    return !match
  })
  saveToDisk(cleanDisk)

  // 4. Remove links associated with this user
  const links = loadLinksFromDisk()
  const cleanLinks = links.filter((l) => {
    const match =
      String(l.studentId).toLowerCase() === clean ||
      String(l.parentId).toLowerCase() === clean ||
      (l.parentEmail && l.parentEmail.toLowerCase() === clean) ||
      (l.student.email && l.student.email.toLowerCase() === clean) ||
      (l.student.id && String(l.student.id).toLowerCase() === clean)
    return !match
  })
  saveLinksToDisk(cleanLinks)

  return true
}

export function purgeSpecificAyazProfiles() {
  // Purge from MOCK_USERS
  for (let i = MOCK_USERS.length - 1; i >= 0; i--) {
    if (isAyazTarget(MOCK_USERS[i])) {
      MOCK_USERS.splice(i, 1)
    }
  }

  // Purge from inMemoryUsers
  for (let i = inMemoryUsers.length - 1; i >= 0; i--) {
    if (isAyazTarget(inMemoryUsers[i])) {
      inMemoryUsers.splice(i, 1)
    }
  }

  // Purge from disk users
  const disk = loadFromDisk()
  const cleanDisk = disk.filter((u) => !isAyazTarget(u))
  saveToDisk(cleanDisk)

  // Purge from links
  const links = loadLinksFromDisk()
  const cleanLinks = links.filter((l) => !isAyazTarget(l.student) && !isAyazTarget({ id: l.studentId, email: l.student?.email }))
  saveLinksToDisk(cleanLinks)
}

// Automatically execute purge on load
try {
  purgeSpecificAyazProfiles()
} catch (e) {}

export function findUsers(query: { emailOrId?: string; role?: string }): StoredUser[] {
  const users = getAllUsers()
  const cleanInput = (query.emailOrId || "").trim().toLowerCase()
  if (!cleanInput) return []
  const cleanId = cleanInput.startsWith("@") ? cleanInput : `@${cleanInput}`

  let matches = users.filter((u) => {
    const emailMatch = Boolean(u.email && u.email.toLowerCase() === cleanInput)
    const userUid = getUserUniqueId(u as any).toLowerCase()
    const idMatch = userUid === cleanId || userUid.replace("@", "") === cleanInput.replace("@", "")
    const rawIdMatch = String(u.id).toLowerCase() === cleanInput
    const fullNameMatch = `${u.firstName || ""} ${u.lastName || ""}`.trim().toLowerCase() === cleanInput
    return emailMatch || idMatch || rawIdMatch || fullNameMatch
  })

  if (query.role) {
    matches = matches.filter(
      (u) => u.accountType === query.role || u.role === query.role
    )
  }

  return matches
}

export interface LinkedStudentDetails {
  id: string | number
  firstName: string
  lastName: string
  fatherName?: string
  email?: string
  uniqueId?: string
  class?: string
  school?: string
}

export interface StudentLink {
  id: number | string
  parentId: string | number
  parentEmail?: string
  studentId: string | number
  relationshipType: string
  status: "active" | "inactive"
  linkedAt: string
  student: LinkedStudentDetails
}

const DEFAULT_LINKS: StudentLink[] = [
  {
    id: 1,
    parentId: "parent-1",
    parentEmail: "emil@example.com",
    studentId: "student-1",
    relationshipType: "parent",
    status: "active",
    linkedAt: "2024-01-01T00:00:00.000Z",
    student: {
      id: "student-1",
      firstName: "İnci",
      lastName: "Məcidzadə",
      email: "inci.mecidzade@example.com",
      class: "6",
      school: "161 saylı məktəb"
    }
  },
  {
    id: 2,
    parentId: "parent-1",
    parentEmail: "emil@example.com",
    studentId: "student-2",
    relationshipType: "parent",
    status: "active",
    linkedAt: "2024-01-01T00:00:00.000Z",
    student: {
      id: "student-2",
      firstName: "Emilia",
      lastName: "Məcidzadə",
      email: "emilia.mecidzade@example.com",
      class: "2",
      school: "161 saylı məktəb"
    }
  }
]

let inMemoryLinks: StudentLink[] = [...DEFAULT_LINKS]

export function loadLinksFromDisk(): StudentLink[] {
  try {
    if (fs.existsSync(LINKS_FILE)) {
      const data = fs.readFileSync(LINKS_FILE, "utf-8")
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const map = new Map<string, StudentLink>()
        for (const l of DEFAULT_LINKS) {
          map.set(String(l.id), l)
        }
        for (const l of parsed) {
          map.set(String(l.id), l)
        }
        inMemoryLinks = Array.from(map.values())
        return inMemoryLinks
      }
    }
  } catch (err) {
    // Ignore read errors
  }
  return inMemoryLinks
}

export function saveLinksToDisk(links: StudentLink[]) {
  try {
    inMemoryLinks = links
    fs.writeFileSync(LINKS_FILE, JSON.stringify(links, null, 2), "utf-8")
  } catch (err) {
    // Ignore write errors
  }
}

export function saveLink(link: StudentLink): StudentLink {
  const currentLinks = loadLinksFromDisk()
  const idx = currentLinks.findIndex(
    (l) =>
      String(l.id) === String(link.id) ||
      (String(l.parentId) === String(link.parentId) && String(l.studentId) === String(link.studentId)) ||
      (link.parentEmail &&
        l.parentEmail &&
        l.parentEmail.toLowerCase() === link.parentEmail.toLowerCase() &&
        String(l.studentId) === String(link.studentId))
  )

  if (idx >= 0) {
    currentLinks[idx] = { ...currentLinks[idx], ...link }
  } else {
    currentLinks.push(link)
  }

  saveLinksToDisk(currentLinks)
  return link
}

export function deleteLink(linkId: string | number): boolean {
  const currentLinks = loadLinksFromDisk()
  const linkToDelete = currentLinks.find(
    (l) => String(l.id) === String(linkId) || String(l.studentId) === String(linkId)
  )
  const studentIdToDelete = linkToDelete ? linkToDelete.studentId : linkId

  const updated = currentLinks.filter(
    (l) => String(l.id) !== String(linkId) && String(l.studentId) !== String(linkId)
  )
  saveLinksToDisk(updated)

  try {
    const allUsers = getAllUsers()
    const targetStudent = allUsers.find((u) => String(u.id) === String(studentIdToDelete))
    if (targetStudent) {
      delete targetStudent.parentId
      delete targetStudent.parentEmail
      saveUser(targetStudent)
    }
  } catch (e) {}

  return true
}

export function getLinksForParent(parentId?: string | number, parentEmail?: string): StudentLink[] {
  const links = loadLinksFromDisk()
  const cleanEmail = (parentEmail || "").trim().toLowerCase()
  const parentIdStr = parentId !== undefined && parentId !== null ? String(parentId) : ""

  const matched = links.filter((l) => {
    if (isAyazTarget(l.student) || isAyazTarget({ id: l.studentId, email: l.student?.email })) return false
    if (l.status !== "active") return false
    if (parentIdStr && String(l.parentId) === parentIdStr) return true
    if (cleanEmail && l.parentEmail && l.parentEmail.toLowerCase() === cleanEmail) return true
    return false
  })

  try {
    const allUsers = getAllUsers()
    const relatedStudents = allUsers.filter((u) => {
      if (isAyazTarget(u)) return false
      if (u.accountType !== "student") return false
      if (parentIdStr && String(u.parentId) === parentIdStr) return true
      if (cleanEmail && u.parentEmail && u.parentEmail.toLowerCase() === cleanEmail) return true
      return false
    })

    for (const s of relatedStudents) {
      const alreadyLinked = matched.some((m) => String(m.studentId) === String(s.id))
      if (!alreadyLinked) {
        const uId = getUserUniqueId(s as any)
        const relLink: StudentLink = {
          id: `rel-${s.id}`,
          parentId: parentIdStr || "parent-1",
          parentEmail: cleanEmail || undefined,
          studentId: s.id,
          relationshipType: "parent",
          status: "active",
          linkedAt: s.createdAt || new Date().toISOString(),
          student: {
            id: s.id,
            firstName: s.firstName,
            lastName: s.lastName,
            fatherName: s.fatherName,
            email: s.email,
            uniqueId: uId,
            class: s.class || "5",
            school: s.school || "Məktəb",
          }
        }
        matched.push(relLink)
        saveLink(relLink)
      }
    }
  } catch (e) {}

  return matched
}

