export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { getAuthContext } from "@/lib/auth-utils"
import { errorResponse } from "@/lib/error-handler"
import { MOCK_USERS } from "@/lib/mock-data"
import { getUserUniqueId } from "@/lib/profile-utils"

// Persistent mock messages in process RAM
let mockMessages: any[] = [
    {
        id: 1,
        senderId: "admin-main",
        senderUniqueId: "@super.admin",
        receiverId: "student-gunay",
        receiverUniqueId: "@gunay.rzayeva.161",
        subject: "Xoş gəlmisiniz! 🎓",
        content: "Salam! Platformamıza xoş gəlmisiniz. Burada dərslikləriniz üzrə bütün testləri həll edə və biliklərinizi yoxlaya bilərsiniz.",
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        sender: {
            firstName: "Admin",
            lastName: "Sistem",
            role: "admin"
        },
        receiver: {
            firstName: "Günay",
            lastName: "Rzayeva",
            role: "student"
        }
    }
]

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get("type") || "inbox"
        const paramUserId = searchParams.get("userId")
        const paramUniqueId = searchParams.get("uniqueId")

        let userId: any = null
        let userEmail: string = ""
        let userRole: string = ""

        const authContext = await getAuthContext(request)
        if (authContext) {
            userId = authContext.user.id
            userEmail = authContext.user.email
            userRole = authContext.user.role || authContext.user.accountType
        } else if (paramUserId) {
            userId = paramUserId
        }

        // Find user in mock database to check their alternative IDs
        const userObj = MOCK_USERS.find(u => 
            (userId && String(u.id).toLowerCase() === String(userId).toLowerCase()) || 
            (userEmail && u.email.toLowerCase() === userEmail.toLowerCase())
        )
        const uniqueId = paramUniqueId || (userObj ? getUserUniqueId(userObj) : "")

        const cleanUniqueId = uniqueId ? uniqueId.toLowerCase() : ""
        const cleanNoAt = cleanUniqueId.replace("@", "")

        const isUserMatch = (targetId: any) => {
            if (!targetId) return false
            const t = String(targetId).toLowerCase()
            if (userId && (t === String(userId).toLowerCase() || t === String(userObj?.id).toLowerCase())) return true
            if (userEmail && t === userEmail.toLowerCase()) return true
            if (cleanUniqueId && (t === cleanUniqueId || t === cleanNoAt)) return true
            return false
        }

        const messages = mockMessages.filter(m => {
            if (type === "inbox") {
                return isUserMatch(m.receiverId) || isUserMatch(m.receiverUniqueId)
            } else {
                return isUserMatch(m.senderId) || isUserMatch(m.senderUniqueId)
            }
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        return NextResponse.json({
            success: true,
            messages
        })

    } catch (error) {
        return errorResponse(error)
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { receiverId, subject, content, senderId, senderName, senderRole, senderUniqueId } = body

        if (!receiverId || !subject || !content) {
            return NextResponse.json({ error: "Bütün sahələri doldurun" }, { status: 400 })
        }

        let effectiveSenderId = senderId || "user-current"
        let effectiveSender = {
            firstName: senderName || "İstifadəçi",
            lastName: "",
            role: senderRole || "student"
        }

        const authContext = await getAuthContext(request)
        if (authContext) {
            effectiveSenderId = authContext.user.id
            const foundSender = MOCK_USERS.find(u => 
                String(u.id) === String(authContext.user.id) || 
                u.email.toLowerCase() === authContext.user.email.toLowerCase()
            )
            if (foundSender) {
                effectiveSender = {
                    firstName: foundSender.firstName,
                    lastName: foundSender.lastName,
                    role: foundSender.role || foundSender.accountType
                }
            }
        }

        // Find receiver details from MOCK_USERS if possible
        const cleanRecv = String(receiverId || "").trim().toLowerCase()
        const foundReceiver = MOCK_USERS.find(u => {
            if (String(u.id).toLowerCase() === cleanRecv) return true
            if (u.email && u.email.toLowerCase() === cleanRecv) return true
            const uId = getUserUniqueId(u).toLowerCase()
            return uId === cleanRecv || uId.replace("@", "") === cleanRecv.replace("@", "")
        })

        const resolvedSenderUniqueId = senderUniqueId || 
            (MOCK_USERS.find(u => String(u.id) === String(effectiveSenderId)) 
                ? getUserUniqueId(MOCK_USERS.find(u => String(u.id) === String(effectiveSenderId))) 
                : "")

        const newMessage = {
            id: Date.now(),
            senderId: effectiveSenderId,
            senderUniqueId: resolvedSenderUniqueId,
            receiverId: foundReceiver ? foundReceiver.id : receiverId,
            receiverUniqueId: foundReceiver ? getUserUniqueId(foundReceiver) : (cleanRecv.startsWith("@") ? cleanRecv : `@${cleanRecv}`),
            subject: subject.trim(),
            content: content.trim(),
            isRead: false,
            createdAt: new Date().toISOString(),
            sender: effectiveSender,
            receiver: foundReceiver ? {
                firstName: foundReceiver.firstName,
                lastName: foundReceiver.lastName,
                role: foundReceiver.role || foundReceiver.accountType
            } : {
                firstName: receiverId,
                lastName: "",
                role: "student"
            }
        }

        mockMessages.push(newMessage)

        return NextResponse.json({
            success: true,
            message: "Mesaj göndərildi",
            data: newMessage
        }, { status: 201 })

    } catch (error) {
        return errorResponse(error)
    }
}
