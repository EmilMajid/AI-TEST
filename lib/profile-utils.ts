/**
 * Client-side profile management utilities
 */

export interface UserData {
    id: number
    email: string
    firstName: string
    lastName: string
    school: string
    region: string
    accountType: 'student' | 'parent'
    class?: string
    role?: 'parent' | 'teacher' | 'director'
    profileImage?: string
}

/**
 * Get current user data from localStorage
 */
export function getCurrentUser(): UserData | null {
    try {
        const userData = localStorage.getItem('userData')
        if (!userData) return null
        return JSON.parse(userData)
    } catch (error) {
        console.error('Error getting user data:', error)
        return null
    }
}

/**
 * Update user data in localStorage
 */
export function updateUserData(updates: Partial<UserData>): boolean {
    try {
        const currentUser = getCurrentUser()
        if (!currentUser) return false

        const updatedUser = { ...currentUser, ...updates }
        localStorage.setItem('userData', JSON.stringify(updatedUser))
        return true
    } catch (error) {
        console.error('Error updating user data:', error)
        return false
    }
}

/**
 * Update user profile image
 */
export function updateProfileImage(base64Image: string): boolean {
    return updateUserData({ profileImage: base64Image })
}

/**
 * Remove user profile image
 */
export function removeProfileImage(): boolean {
    return updateUserData({ profileImage: undefined })
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return getCurrentUser() !== null
}

/**
 * Secure logout - clear all user data from localStorage
 */
export function logout(): void {
    try {
        // Clear all authentication-related data
        localStorage.removeItem('userData')
        localStorage.removeItem('session')
        localStorage.removeItem('userTheme')
        localStorage.removeItem('currentTest')

        // Clear any other user-specific data
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && (key.startsWith('user_') || key.startsWith('test_'))) {
                keysToRemove.push(key)
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
        console.error('Error during logout:', error)
    }
}

/**
 * Get user role label in Azerbaijani
 */
export function getRoleLabel(accountType?: string, role?: string): string {
    if (accountType === 'student') {
        return 'Şagird'
    }

    switch (role) {
        case 'parent':
            return 'Valideyn'
        case 'teacher':
            return 'Müəllim'
        case 'director':
            return 'Direktor'
        default:
            return accountType === 'parent' ? 'Valideyn' : 'İstifadəçi'
    }
}

/**
 * Get dashboard path for user role
 */
export function getDashboardPath(accountType?: string): string {
    if (accountType === 'parent' || accountType === 'teacher' || accountType === 'director') {
        return '/parent-dashboard'
    }
    return '/dashboard'
}

/**
 * Generate or retrieve meaningful unique student/user ID
 * Example: @gunay.rzayeva.161
 */
export function getUserUniqueId(user?: Partial<UserData> | null): string {
    if (!user) return "@id"
    if ((user as any).uniqueId) return (user as any).uniqueId

    const norm = (s: string) =>
        (s || "")
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/i̇/g, "i")
            .replace(/ı/g, "i")
            .replace(/ğ/g, "g")
            .replace(/ö/g, "o")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ç/g, "c")
            .replace(/ə/g, "e")
            .replace(/[^a-z0-9]/g, "")

    const first = norm(user.firstName || "")
    const last = norm(user.lastName || "")
    const schoolNum = String(user.school || "").match(/\d+/)?.[0] || ""
    const classNum = String(user.class || "").match(/\d+/)?.[0] || ""

    const parts = [first, last].filter(Boolean)
    if (schoolNum) parts.push(schoolNum)
    else if (classNum) parts.push(classNum)
    else if (user.id) parts.push(String(user.id).slice(-3))

    const base = parts.join(".")
    return base ? `@${base}` : `@user.${user.id || "1"}`
}
