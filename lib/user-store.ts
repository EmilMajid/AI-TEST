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
const REAL_FILE = getStoragePath("testai_real_users.json")
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
  /** "real" = testai.az vasitəsilə qeydiyyatdan keçmiş | "mock" = test/demo məlumatı | "admin" = xüsusi admin statusu */
  source?: "mock" | "real" | "admin"
}

/** Real istifadəçiləri ayrı diskə yaz */
function loadRealUsersFromDisk(): StoredUser[] {
  try {
    if (fs.existsSync(REAL_FILE)) {
      const data = fs.readFileSync(REAL_FILE, "utf-8")
      return JSON.parse(data) || []
    }
  } catch (err) {}
  return []
}

function saveRealUserToDisk(user: StoredUser) {
  try {
    const existing = loadRealUsersFromDisk()
    const key = (user.email || String(user.id)).toLowerCase()
    const idx = existing.findIndex(u => (u.email || String(u.id)).toLowerCase() === key)
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...user }
    } else {
      existing.push(user)
    }
    fs.writeFileSync(REAL_FILE, JSON.stringify(existing, null, 2), "utf-8")
  } catch (err) {}
}

/** Heristik yoxlama: istifadəçi mock/demo-durmu? */
export function isMockUser(u: StoredUser): boolean {
  if (u.source === "real" || u.source === "admin") return false
  if (u.source === "mock") return true

  const id = String(u.id || "")
  const email = (u.email || "").toLowerCase()

  // Admin: xüsusi status
  if (u.accountType === "admin" || u.role === "admin") return false
  // Timestamp ID (13 rəqəm) → real qeydiyyat
  if (/^\d{13}$/.test(id)) return false
  // Məlum mock email domenləri
  if (email.endsWith("@test.com") || email.endsWith("@example.com") || email.endsWith("@edu.az")) return true
  // Məlum mock ID prefiksləri
  if (/^(parent|teacher|director|student)-[a-z]/.test(id)) return true

  return false
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

export function getAllUsers(opts?: { includesMock?: boolean }): StoredUser[] {
  const includeMock = opts?.includesMock !== false // default: true
  const diskUsers = loadFromDisk()
  const realUsers = loadRealUsersFromDisk()
  const map = new Map<string, StoredUser>()

  // 1. Base MOCK_USERS — etiketlə
  for (const u of MOCK_USERS) {
    if (isAyazTarget(u)) continue
    const key = (u.email || String(u.id)).toLowerCase()
    if (deletedUserIds.has(key) || deletedUserIds.has(String(u.id).toLowerCase())) continue

    // Admin xüsusi status alır
    const srcTag: StoredUser["source"] =
      u.accountType === "admin" || u.role === "admin" ? "admin" : "mock"

    map.set(key, {
      ...u,
      isBlocked: (u as any).isBlocked ?? false,
      status: (u as any).status || "active",
      source: srcTag,
    } as StoredUser)
  }

  // 2. Real users faylı (.data/testai_real_users.json)
  for (const u of realUsers) {
    if (isAyazTarget(u)) continue
    const key = (u.email || String(u.id)).toLowerCase()
    if (deletedUserIds.has(key) || deletedUserIds.has(String(u.id).toLowerCase())) continue
    map.set(key, { ...map.get(key), ...u, source: u.source || "real" })
  }

  // 3. Disk users (mövcud fayl — qarışıq, köhnə)
  for (const u of diskUsers) {
    if (isAyazTarget(u)) continue
    const key = (u.email || String(u.id)).toLowerCase()
    if (deletedUserIds.has(key) || deletedUserIds.has(String(u.id).toLowerCase())) continue
    if (u.firstName === "Demo" || u.school?.includes("Demo") || String(u.id).startsWith("user-")) {
      continue
    }
    // Əgər artıq real faylda varsa üstünlük realadır
    if (map.has(key) && map.get(key)?.source === "real") continue
    map.set(key, { ...map.get(key), ...u })
  }

  // 4. In-memory users
  for (const u of inMemoryUsers) {
    if (isAyazTarget(u)) continue
    const key = (u.email || String(u.id)).toLowerCase()
    if (deletedUserIds.has(key) || deletedUserIds.has(String(u.id).toLowerCase())) continue
    if (u.firstName === "Demo" || u.school?.includes("Demo") || String(u.id).startsWith("user-")) {
      continue
    }
    map.set(key, { ...map.get(key), ...u })
  }

  // 5. Rüfət + Ayaz sabit fallback (real istifadəçilər)
  const rufatKey = "r.h.rzayev@gmail.com"
  const ayazKey = "ayaz.rzayev.309@testai.az"
  let rufatUser = map.get(rufatKey) || map.get("parent-rufat")
  let ayazUser = map.get(ayazKey) || map.get("student-ayaz-309")

  if (!rufatUser && !deletedUserIds.has(rufatKey)) {
    rufatUser = {
      id: "parent-rufat",
      email: "r.h.rzayev@gmail.com",
      password: "Rufat-141181",
      accountType: "parent",
      firstName: "Rüfət",
      lastName: "Rzayev",
      fatherName: "Həsən",
      school: "309 saylı məktəb",
      region: "Bakı",
      role: "parent",
      status: "active",
      isBlocked: false,
      source: "real",
    }
    map.set(rufatKey, rufatUser)
  } else if (rufatUser) {
    if (!rufatUser.source) rufatUser.source = "real"
    rufatUser.password = "Rufat-141181"
  }

  if (!ayazUser && !deletedUserIds.has(ayazKey)) {
    ayazUser = {
      id: "student-ayaz-309",
      email: "ayaz.rzayev.309@testai.az",
      password: "Ayaz-020813",
      accountType: "student",
      firstName: "Ayaz",
      lastName: "Rzayev",
      fatherName: "Rüfət",
      school: "309 saylı məktəb",
      class: "8",
      region: "Bakı",
      role: "student",
      parentId: rufatUser?.id || "parent-rufat",
      parentEmail: "r.h.rzayev@gmail.com",
      status: "active",
      isBlocked: false,
      source: "real",
    }
    map.set(ayazKey, ayazUser)
  } else if (ayazUser && rufatUser) {
    ayazUser.parentId = rufatUser.id
    ayazUser.parentEmail = rufatUser.email
    if (!ayazUser.fatherName) ayazUser.fatherName = "Rüfət"
    if (!ayazUser.source) ayazUser.source = "real"
    if (ayazUser.class === "5") ayazUser.class = "8"
    ayazUser.password = "Ayaz-020813"
  }

  const allList = Array.from(map.values())

  // includesMock: false olduqda yalnız real + admin qaytarılır
  if (!includeMock) {
    return allList.filter(u => u.source === "real" || u.source === "admin")
  }

  return allList
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

  // Real istifadəçidirsə mock massivə əlavə etmə, yalnız real fayla yaz
  if (userWithStatus.source === "real") {
    saveRealUserToDisk(userWithStatus)
  } else {
    const mockIdx = MOCK_USERS.findIndex(
      (u) => (u.email && u.email.toLowerCase() === emailKey) || String(u.id) === String(user.id)
    )
    if (mockIdx >= 0) {
      MOCK_USERS[mockIdx] = { ...MOCK_USERS[mockIdx], ...userWithStatus } as any
    } else {
      MOCK_USERS.push(userWithStatus as any)
    }
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
    const emailPrefixMatch = Boolean(u.email && u.email.toLowerCase().split("@")[0] === cleanInput.replace("@", ""))
    const userUid = getUserUniqueId(u as any).toLowerCase()
    const idMatch = userUid === cleanId || userUid.replace("@", "") === cleanInput.replace("@", "")
    const rawIdMatch = String(u.id).toLowerCase() === cleanInput
    const fullNameMatch = `${u.firstName || ""} ${u.lastName || ""}`.trim().toLowerCase() === cleanInput
    return emailMatch || emailPrefixMatch || idMatch || rawIdMatch || fullNameMatch
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
  },
  {
    id: 3,
    parentId: "parent-rufat",
    parentEmail: "r.h.rzayev@gmail.com",
    studentId: "student-ayaz-309",
    relationshipType: "parent",
    status: "active",
    linkedAt: "2024-01-01T00:00:00.000Z",
    student: {
      id: "student-ayaz-309",
      firstName: "Ayaz",
      lastName: "Rzayev",
      fatherName: "Rüfət",
      email: "ayaz.rzayev.309@testai.az",
      uniqueId: "@ayaz.rzayev.309",
      class: "8",
      school: "309 saylı məktəb"
    }
  }
]

const DELETED_LINKS_FILE = path.join(process.cwd(), ".data", "testai_deleted_links.json")

function loadDeletedLinksFromDisk(): Set<string> {
  const set = new Set<string>()
  try {
    if (fs.existsSync(DELETED_LINKS_FILE)) {
      const raw = fs.readFileSync(DELETED_LINKS_FILE, "utf-8").replace(/^\uFEFF/, "")
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) {
        arr.forEach((item: string) => set.add(String(item).toLowerCase()))
      }
    }
  } catch (e) {}
  return set
}

function saveDeletedLinksToDisk(set: Set<string>) {
  try {
    fs.writeFileSync(DELETED_LINKS_FILE, JSON.stringify(Array.from(set), null, 2), "utf-8")
  } catch (e) {}
}

const deletedLinkIds = loadDeletedLinksFromDisk()

let inMemoryLinks: StudentLink[] = [...DEFAULT_LINKS]

export function loadLinksFromDisk(): StudentLink[] {
  try {
    if (fs.existsSync(LINKS_FILE)) {
      const raw = fs.readFileSync(LINKS_FILE, "utf-8")
      const data = raw.replace(/^\uFEFF/, "")
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const map = new Map<string, StudentLink>()
        for (const l of DEFAULT_LINKS) {
          const lId = String(l.id).toLowerCase()
          const sId = String(l.studentId).toLowerCase()
          const sEmail = (l.student?.email || "").toLowerCase()
          if (!deletedLinkIds.has(lId) && !deletedLinkIds.has(sId) && (!sEmail || !deletedLinkIds.has(sEmail))) {
            map.set(lId, l)
          }
        }
        for (const l of parsed) {
          const lId = String(l.id).toLowerCase()
          const sId = String(l.studentId).toLowerCase()
          const sEmail = (l.student?.email || "").toLowerCase()
          if (!deletedLinkIds.has(lId) && !deletedLinkIds.has(sId) && (!sEmail || !deletedLinkIds.has(sEmail))) {
            map.set(lId, l)
          }
        }
        inMemoryLinks = Array.from(map.values())
        return inMemoryLinks
      }
    }
  } catch (err) {
    // Ignore read errors
  }
  return inMemoryLinks.filter((l) => {
    const lId = String(l.id).toLowerCase()
    const sId = String(l.studentId).toLowerCase()
    const sEmail = (l.student?.email || "").toLowerCase()
    return !deletedLinkIds.has(lId) && !deletedLinkIds.has(sId) && (!sEmail || !deletedLinkIds.has(sEmail))
  })
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

export function deleteLink(linkId: string | number, studentId?: string | number, studentEmail?: string, studentName?: string): boolean {
  const cleanId = String(linkId).trim().toLowerCase()
  deletedLinkIds.add(cleanId)

  if (studentId) {
    deletedLinkIds.add(String(studentId).trim().toLowerCase())
  }
  if (studentEmail) {
    deletedLinkIds.add(studentEmail.trim().toLowerCase())
  }
  if (studentName) {
    deletedLinkIds.add(`name:${studentName.trim().toLowerCase()}`)
  }

  const currentLinks = loadLinksFromDisk()
  const linkToDelete = currentLinks.find(
    (l) =>
      String(l.id).toLowerCase() === cleanId ||
      String(l.studentId).toLowerCase() === cleanId ||
      (l.student?.email && l.student.email.toLowerCase() === cleanId) ||
      (l.student?.uniqueId && l.student.uniqueId.toLowerCase() === cleanId)
  )

  const studentIdToDelete = linkToDelete ? String(linkToDelete.studentId).toLowerCase() : cleanId
  deletedLinkIds.add(studentIdToDelete)

  if (linkToDelete?.id) {
    deletedLinkIds.add(String(linkToDelete.id).toLowerCase())
  }
  if (linkToDelete?.student?.email) {
    deletedLinkIds.add(linkToDelete.student.email.toLowerCase())
  }
  if (linkToDelete?.student?.firstName && linkToDelete?.student?.lastName) {
    deletedLinkIds.add(`name:${linkToDelete.student.firstName.trim().toLowerCase()} ${linkToDelete.student.lastName.trim().toLowerCase()}`)
  }

  saveDeletedLinksToDisk(deletedLinkIds)

  const updated = currentLinks.filter((l) => {
    const lId = String(l.id).toLowerCase()
    const sId = String(l.studentId).toLowerCase()
    const sEmail = (l.student?.email || "").toLowerCase()
    const sName = `${l.student?.firstName || ""} ${l.student?.lastName || ""}`.trim().toLowerCase()
    if (lId === cleanId || lId === studentIdToDelete) return false
    if (sId === cleanId || sId === studentIdToDelete) return false
    if (linkToDelete?.student?.email && sEmail === linkToDelete.student.email.toLowerCase()) return false
    if (deletedLinkIds.has(lId) || deletedLinkIds.has(sId)) return false
    if (sEmail && deletedLinkIds.has(sEmail)) return false
    if (sName && deletedLinkIds.has(`name:${sName}`)) return false
    return true
  })

  saveLinksToDisk(updated)

  try {
    const allUsers = getAllUsers()
    const targetStudent = allUsers.find(
      (u) =>
        String(u.id).toLowerCase() === cleanId ||
        String(u.id).toLowerCase() === studentIdToDelete ||
        (linkToDelete?.student?.email && u.email && u.email.toLowerCase() === linkToDelete.student.email.toLowerCase())
    )
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

  const isRufatParent = cleanEmail === "r.h.rzayev@gmail.com" || parentIdStr === "parent-rufat"

  const matched = links.filter((l) => {
    if (isAyazTarget(l.student) || isAyazTarget({ id: l.studentId, email: l.student?.email })) return false
    if (l.status !== "active") return false
    const lId = String(l.id).toLowerCase()
    const sId = String(l.studentId).toLowerCase()
    const sEmail = (l.student?.email || "").toLowerCase()
    const sName = `${l.student?.firstName || ""} ${l.student?.lastName || ""}`.trim().toLowerCase()

    if (deletedLinkIds.has(lId) || deletedLinkIds.has(sId)) return false
    if (sEmail && deletedLinkIds.has(sEmail)) return false
    if (sName && deletedLinkIds.has(`name:${sName}`)) return false

    if (parentIdStr && String(l.parentId) === parentIdStr) return true
    if (cleanEmail && l.parentEmail && l.parentEmail.toLowerCase() === cleanEmail) return true
    if (isRufatParent && (String(l.studentId) === "student-ayaz-309" || sEmail === "ayaz.rzayev.309@testai.az")) return true
    return false
  })

  // Deduplicate strictly by student normalized full name or email
  const dedupMap = new Map<string, StudentLink>()
  for (const l of matched) {
    const sName = `${l.student?.firstName || ''} ${l.student?.lastName || ''}`.trim().toLowerCase().replace(/\s+/g, ' ')
    const sEmail = (l.student?.email || '').trim().toLowerCase()
    // Prioritize name-based key if present, so identical student names never appear twice
    const key = sName ? `name:${sName}` : (sEmail ? `email:${sEmail}` : `id:${String(l.studentId || l.id).toLowerCase()}`)

    if (!dedupMap.has(key) || l.student?.class === "8" || l.student?.school?.includes("309")) {
      if (sName.includes("ayaz") && sName.includes("rzayev") && l.student) {
        l.student.class = "8"
        l.student.school = "309 saylı məktəb"
      }
      dedupMap.set(key, l)
    }
  }

  return Array.from(dedupMap.values())
}



