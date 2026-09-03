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
import { Mail, Send, User, Reply, Clock, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getUserUniqueId } from "@/lib/profile-utils"

interface Message {
    id: number
    senderId: string
    receiverId: string
    subject: string
    content: string
    isRead: boolean
    createdAt: string
    sender: {
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
            const session = localStorage.getItem("session")
            const token = session ? JSON.parse(session).access_token : null

            const response = await fetch(`/api/messages?type=${activeTab}`, {
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            })
            const data = await response.json()

            if (data.success) {
                setMessages(data.messages)
            }
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
            const session = localStorage.getItem("session")
            const token = session ? JSON.parse(session).access_token : null

            const response = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify(newMessage)
            })

            if (response.ok) {
                toast({
                    title: "Uğurlu",
                    description: "Mesaj göndərildi",
                })
                setIsComposeOpen(false)
                setNewMessage({ receiverId: "", subject: "", content: "" })
                if (activeTab === "sent") loadMessages()
            }
        } catch (error) {
            toast({
                title: "Xəta",
                description: "Mesaj göndərilərkən xəta baş verdi",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Mail className="h-6 w-6" />
                    Mesajlar
                </h2>
                <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Send className="h-4 w-4 mr-2" />
                            Yeni Mesaj
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Yeni Mesaj</DialogTitle>
                            <DialogDescription>
                                Mesaj göndərmək istədiyiniz şəxsi seçin
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
                                        value={newMessage.receiverId.startsWith("@") ? newMessage.receiverId : ""}
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
                                    className="min-h-[100px]"
                                />
                            </div>
                            <Button onClick={handleSendMessage} className="w-full">
                                Göndər
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="inbox">Gələnlər</TabsTrigger>
                    <TabsTrigger value="sent">Göndərilənlər</TabsTrigger>
                </TabsList>

                <TabsContent value="inbox" className="space-y-4">
                    {messages.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-8 text-gray-500">
                                <Mail className="h-12 w-12 mb-2 opacity-50" />
                                <p>Gələn mesaj yoxdur</p>
                            </CardContent>
                        </Card>
                    ) : (
                        messages.map((message) => (
                            <Card key={message.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{message.sender.firstName} {message.sender.lastName}</p>
                                                <p className="text-xs text-gray-500 capitalize">{message.sender.role}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {new Date(message.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold mb-1">{message.subject}</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="sent" className="space-y-4">
                    {messages.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-8 text-gray-500">
                                <Send className="h-12 w-12 mb-2 opacity-50" />
                                <p>Göndərilən mesaj yoxdur</p>
                            </CardContent>
                        </Card>
                    ) : (
                        messages.map((message) => (
                            <Card key={message.id}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                <User className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Siz</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {new Date(message.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold mb-1">{message.subject}</h4>
                                    <p className="text-sm text-gray-600">{message.content}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
