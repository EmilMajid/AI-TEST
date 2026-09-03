"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, User, Reply, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getUserUniqueId, getCurrentUser } from "@/lib/profile-utils"

interface Message {
    id: number | string
    senderId: string
    senderUniqueId?: string
    receiverId: string
    receiverUniqueId?: string
    subject: string
    content: string
    isRead: boolean
    createdAt: string
    sender: {
        firstName: string
        lastName: string
        role: string
    }
    receiver?: {
        firstName: string
        lastName: string
        role: string
    }
}

interface MessagesTabProps {
    userId: number
    userRole: string
}

export function MessagesTab({ userId, userRole }: MessagesTabProps) {
    const { toast } = useToast()
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [activeTab, setActiveTab] = useState("inbox")
    const [isComposeOpen, setIsComposeOpen] = useState(false)
    const [availableUsers, setAvailableUsers] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState({
        receiverId: "",
        subject: "",
        content: ""
    })

    useEffect(() => {
        loadMessages()
        loadUsers()
    }, [activeTab])

    const loadMessages = async () => {
        try {
            setIsLoading(true)
            const user = getCurrentUser()
            const currentUniqueId = getUserUniqueId(user)
            const session = localStorage.getItem("session")
            const token = session ? JSON.parse(session).access_token : null

            // 1. Read from local persistent storage (permanent backup)
            let localList: any[] = []
            try {
                const stored = localStorage.getItem("testai_messages_v2")
                if (stored) localList = JSON.parse(stored)
            } catch (e) {
                console.error("Local message read error:", e)
            }

            // 2. Fetch from API
            let serverList: any[] = []
            try {
                const response = await fetch(`/api/messages?type=${activeTab}&userId=${userId}&uniqueId=${encodeURIComponent(currentUniqueId)}`, {
                    headers: token ? { "Authorization": `Bearer ${token}` } : {}
                })
                const data = await response.json()
                if (data.success && Array.isArray(data.messages)) {
                    serverList = data.messages
                }
            } catch (error) {
                console.warn("Server messages load warning:", error)
            }

            // 3. Match messages for current user
            const isMatch = (target: any) => {
                if (!target) return false
                const t = String(target).toLowerCase()
                const uId = currentUniqueId.toLowerCase()
                const noAt = uId.replace("@", "")
                return t === String(userId).toLowerCase() || 
                       t === uId || 
                       t === noAt || 
                       (user?.email && t === user.email.toLowerCase())
            }

            const filteredLocal = localList.filter((m: any) => {
                if (activeTab === "inbox") {
                    return isMatch(m.receiverId) || isMatch(m.receiverUniqueId)
                } else {
                    return isMatch(m.senderId) || isMatch(m.senderUniqueId)
                }
            })

            // Combine and deduplicate
            const combinedMap = new Map<string | number, Message>()
            for (const m of serverList) combinedMap.set(m.id, m)
            for (const m of filteredLocal) combinedMap.set(m.id, m)

            const finalMessages = Array.from(combinedMap.values()).sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )

            setMessages(finalMessages)
        } catch (error) {
            console.error("Load messages error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadUsers = async () => {
        try {
            const session = localStorage.getItem("session")
            const token = session ? JSON.parse(session).access_token : null

            const response = await fetch("/api/users", {
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            })
            const data = await response.json()

            if (data.success) {
                setAvailableUsers(data.users)
            }
        } catch (error) {
            console.error("Load users error:", error)
        }
    }

    const handleSendMessage = async () => {
        if (!newMessage.receiverId || !newMessage.subject || !newMessage.content) {
            toast({
                title: "Xəta",
                description: "Bütün sahələri doldurun",
                variant: "destructive",
            })
            return
        }

        try {
            setIsSending(true)
            const user = getCurrentUser()
            const senderUniqueId = getUserUniqueId(user)
            const session = localStorage.getItem("session")
            const token = session ? JSON.parse(session).access_token : null

            // Find selected recipient
            const cleanRecv = newMessage.receiverId.trim()
            const foundRecv = availableUsers.find(u => 
                String(u.id) === cleanRecv || 
                getUserUniqueId(u).toLowerCase() === cleanRecv.toLowerCase() ||
                getUserUniqueId(u).toLowerCase().replace("@", "") === cleanRecv.toLowerCase().replace("@", "")
            )

            const newMsgObj: Message = {
                id: Date.now(),
                senderId: String(userId),
                senderUniqueId: senderUniqueId,
                receiverId: foundRecv ? String(foundRecv.id) : cleanRecv,
                receiverUniqueId: foundRecv ? getUserUniqueId(foundRecv) : (cleanRecv.startsWith("@") ? cleanRecv : `@${cleanRecv}`),
                subject: newMessage.subject.trim(),
                content: newMessage.content.trim(),
                isRead: false,
                createdAt: new Date().toISOString(),
                sender: {
                    firstName: user?.firstName || "İstifadəçi",
                    lastName: user?.lastName || "",
                    role: userRole || "student"
                },
                receiver: foundRecv ? {
                    firstName: foundRecv.firstName,
                    lastName: foundRecv.lastName,
                    role: foundRecv.role || foundRecv.accountType
                } : {
                    firstName: cleanRecv,
                    lastName: "",
                    role: "student"
                }
            }

            // 1. Save immediately to localStorage (never lost!)
            try {
                const stored = localStorage.getItem("testai_messages_v2")
                const list = stored ? JSON.parse(stored) : []
                list.push(newMsgObj)
                localStorage.setItem("testai_messages_v2", JSON.stringify(list))
            } catch (e) {
                console.error("Local save error:", e)
            }

            // 2. Send to API for backend sync
            try {
                await fetch("/api/messages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({
                        receiverId: newMsgObj.receiverId,
                        receiverUniqueId: newMsgObj.receiverUniqueId,
                        subject: newMsgObj.subject,
                        content: newMsgObj.content,
                        senderId: userId,
                        senderName: user ? `${user.firstName} ${user.lastName}` : "İstifadəçi",
                        senderRole: userRole,
                        senderUniqueId: senderUniqueId
                    })
                })
            } catch (err) {
                console.warn("API sync error, saved locally:", err)
            }

            toast({
                title: "Mesaj göndərildi! ✉️",
                description: "Mesajınız qeydə alındı və çatdırıldı.",
            })

            setIsComposeOpen(false)
            setNewMessage({ receiverId: "", subject: "", content: "" })

            if (activeTab === "sent") {
                loadMessages()
            } else {
                setActiveTab("sent")
            }

        } catch (error) {
            toast({
                title: "Xəta",
                description: "Mesaj göndərilərkən xəta baş verdi",
                variant: "destructive",
            })
        } finally {
            setIsSending(false)
        }
    }

    const handleReply = (message: Message) => {
        const targetId = message.senderUniqueId || message.senderId
        setNewMessage({
            receiverId: targetId,
            subject: message.subject.startsWith("Cavab:") ? message.subject : `Cavab: ${message.subject}`,
            content: `\n\n--- [${message.sender.firstName} ${message.sender.lastName} yazmışdı]: ---\n${message.content}`
        })
        setIsComposeOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Daxili Mesajlar</h2>
                    <p className="text-muted-foreground text-sm">
                        Digər şagirdlər, müəllimlər və valideynlərlə birbaşa Unikal ID vasitəsilə əlaqə saxlayın.
                    </p>
                </div>
                <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Send className="h-4 w-4" />
                            Yeni Mesaj
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Yeni Mesaj Yaz</DialogTitle>
                            <DialogDescription>
                                Mesaj göndərmək istədiyiniz şəxsi seçin və ya Unikal ID-sini daxil edin
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Kimə (Siyahıdan seçin və ya Unikal ID yazın)</Label>
                                <Select
                                    onValueChange={(val) => setNewMessage({ ...newMessage, receiverId: val })}
                                    value={newMessage.receiverId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Siyahıdan seçin..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableUsers.map(user => {
                                            const roleStr = user.accountType === 'admin' ? 'Admin' : user.accountType === 'student' ? 'Şagird' : user.accountType === 'teacher' ? 'Müəllim' : user.accountType === 'director' ? 'Direktor' : 'Valideyn'
                                            const uId = getUserUniqueId(user)
                                            return (
                                                <SelectItem key={user.id} value={String(user.id)}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{user.firstName} {user.lastName}</span>
                                                        <span className="text-xs font-mono text-primary font-semibold">{uId}</span>
                                                        <span className="text-xs text-muted-foreground">({roleStr})</span>
                                                    </div>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2 pt-1">
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">və ya ID ilə:</span>
                                    <Input
                                        placeholder="Məs: @murad.mecidli.161"
                                        value={newMessage.receiverId.startsWith("@") ? newMessage.receiverId : (availableUsers.find(u => u.id == newMessage.receiverId) ? "" : newMessage.receiverId)}
                                        onChange={(e) => setNewMessage({ ...newMessage, receiverId: e.target.value })}
                                        className="h-8 font-mono text-xs"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Mövzu</Label>
                                <Input
                                    value={newMessage.subject}
                                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                                    placeholder="Mövzu daxil edin"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Mesaj</Label>
                                <Textarea
                                    value={newMessage.content}
                                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                                    placeholder="Mesajınızı yazın..."
                                    className="min-h-[120px]"
                                />
                            </div>
                            <Button onClick={handleSendMessage} disabled={isSending} className="w-full">
                                {isSending ? "Göndərilir..." : "Göndər"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="inbox" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Gələnlər ({messages.length})
                    </TabsTrigger>
                    <TabsTrigger value="sent" className="gap-2">
                        <Send className="h-4 w-4" />
                        Göndərilənlər
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="inbox" className="space-y-4">
                    {isLoading ? (
                        <div className="p-8 text-center text-muted-foreground">Yüklənir...</div>
                    ) : messages.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10 text-gray-500">
                                <Mail className="h-12 w-12 mb-2 opacity-40" />
                                <p className="font-medium">Gələn mesaj yoxdur</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Sizə göndərilən bütün mesajlar burada görünəcək.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        messages.map((message) => (
                            <Card key={message.id} className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
                                <CardContent className="p-4 sm:p-5">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                {message.sender.firstName?.[0] || "U"}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold text-sm text-gray-900">
                                                        {message.sender.firstName} {message.sender.lastName}
                                                    </p>
                                                    {message.senderUniqueId && (
                                                        <span className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                                            {message.senderUniqueId}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 capitalize">{message.sender.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 flex items-center">
                                                <Clock className="h-3.5 w-3.5 mr-1" />
                                                {new Date(message.createdAt).toLocaleString()}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 text-xs gap-1"
                                                onClick={() => handleReply(message)}
                                            >
                                                <Reply className="h-3.5 w-3.5" />
                                                Cavabla
                                            </Button>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-base mb-1 text-gray-900">{message.subject}</h4>
                                    <p className="text-sm text-gray-700 whitespace-pre-line bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                                        {message.content}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="sent" className="space-y-4">
                    {isLoading ? (
                        <div className="p-8 text-center text-muted-foreground">Yüklənir...</div>
                    ) : messages.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10 text-gray-500">
                                <Send className="h-12 w-12 mb-2 opacity-40" />
                                <p className="font-medium">Göndərilən mesaj yoxdur</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Göndərdiyiniz mesajlar daimi olaraq burada saxlanılacaq.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        messages.map((message) => (
                            <Card key={message.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4 sm:p-5">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                                                <Send className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs text-gray-500">Kimə:</span>
                                                    <p className="font-semibold text-sm text-gray-900">
                                                        {message.receiver?.firstName ? `${message.receiver.firstName} ${message.receiver?.lastName || ''}` : message.receiverId}
                                                    </p>
                                                    {message.receiverUniqueId && (
                                                        <span className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                                            {message.receiverUniqueId}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 flex items-center">
                                            <Clock className="h-3.5 w-3.5 mr-1" />
                                            {new Date(message.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-base mb-1 text-gray-900">{message.subject}</h4>
                                    <p className="text-sm text-gray-700 whitespace-pre-line bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                                        {message.content}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
