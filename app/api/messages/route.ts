import { type NextRequest, NextResponse } from "next/server"
import { requireAuth, logApiAccess } from "@/lib/auth-utils"
import { errorResponse, AppError, ErrorCode } from "@/lib/error-handler"

// Mock messages for demo mode
let mockMessages: any[] = [
    {
        id: 1,
        senderId: "admin",
        receiverId: "parent-1",
        subject: "Xoş gəlmisiniz!",
        content: "Platformamıza xoş gəlmisiniz. Hər hansı sualınız olarsa, bizimlə əlaqə saxlayın.",
        isRead: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        sender: {
            firstName: "Admin",
            lastName: "",
            role: "admin"
        }
    }
]

const isDemoMode = true; // Forced for full mock mode

export async function GET(request: NextRequest) {
    try {
        const auth = await requireAuth(request)
        if (auth instanceof NextResponse) return auth

        const { searchParams } = new URL(request.url)
        const type = searchParams.get("type") || "inbox" // inbox or sent

        if (isDemoMode) {
            const messages = mockMessages.filter(m =>
                type === "inbox" ? m.receiverId === auth.user.id : m.senderId === auth.user.id
            ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

            return NextResponse.json({
                success: true,
                messages
            })
        }

        // Production logic would go here (using Prisma/Supabase)
        return NextResponse.json({ success: true, messages: [] })

    } catch (error) {
        return errorResponse(error)
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = await requireAuth(request)
        if (auth instanceof NextResponse) return auth

        const body = await request.json()
        const { receiverId, subject, content } = body

        if (isDemoMode) {
            const newMessage = {
                id: mockMessages.length + 1,
                senderId: auth.user.id,
                receiverId,
                subject,
                content,
                isRead: false,
                createdAt: new Date().toISOString(),
                sender: {
                    firstName: "İstifadəçi",
                    lastName: "",
                    role: auth.user.role || auth.user.accountType
                }
            }
            mockMessages.push(newMessage)

            return NextResponse.json({
                success: true,
                message: "Mesaj göndərildi",
                data: newMessage
            }, { status: 201 })
        }

        // Production logic would go here
        return NextResponse.json({ success: true, message: "Mesaj göndərildi" }, { status: 201 })

    } catch (error) {
        return errorResponse(error)
    }
}
