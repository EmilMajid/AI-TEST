export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { errorResponse } from "@/lib/error-handler"

// Mock users for demo mode
const mockUsers = [
    { id: "admin", firstName: "Admin", lastName: "", email: "admin@testai.az", accountType: "admin", role: "admin" },
    { id: "parent-1", firstName: "Emil", lastName: "Məcidov", email: "emil@example.com", accountType: "parent", role: "parent" },
    { id: "student-1", firstName: "İnci", lastName: "Məcidzadə", email: "inci@example.com", accountType: "student", class: "10" },
    { id: "student-2", firstName: "Emilia", lastName: "Məcidzadə", email: "emilia@example.com", accountType: "student", class: "8" },
    { id: "student-ali", firstName: "Əli", lastName: "Vəlizadə", email: "ali8@example.com", accountType: "student", class: "8" },
    { id: "teacher-1", firstName: "Leyla", lastName: "Həsənova", email: "leyla@example.com", accountType: "teacher", role: "teacher" },
    { id: "director-1", firstName: "Rəşad", lastName: "Məmmədov", email: "rashad@example.com", accountType: "director", role: "director" },
]

const isDemoMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("demo") || process.env.NODE_ENV === "development"

export async function GET(request: NextRequest) {
    try {
        const auth = await requireAuth(request)
        if (auth instanceof NextResponse) return auth

        if (isDemoMode) {
            // Return all users except the current user
            const currentUserId = String(auth.user.id)
            const users = mockUsers
                .filter(u => u.id !== currentUserId)
                .map(u => ({
                    id: u.id,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    email: u.email,
                    accountType: u.accountType,
                    role: u.role || u.accountType,
                    class: u.class
                }))

            return NextResponse.json({
                success: true,
                users
            })
        }

        // Production logic would go here (using Prisma/Supabase)
        return NextResponse.json({ success: true, users: [] })

    } catch (error) {
        return errorResponse(error)
    }
}
