"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/main-layout"
import { ProfileAvatar } from "@/components/profile-avatar"
import { ImageUpload } from "@/components/image-upload"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "@/hooks/use-theme"
import {
    getCurrentUser,
    updateProfileImage,
    removeProfileImage,
    logout,
    getRoleLabel,
    getDashboardPath,
    getUserUniqueId,
    type UserData
} from "@/lib/profile-utils"
import { ArrowLeft, User, Mail, School, MapPin, LogOut, Save, Trash2, Fingerprint, Copy } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
    const router = useRouter()
    const { toast } = useToast()
    const { theme, getThemeClasses } = useTheme()
    const themeClasses = getThemeClasses()
    const [userData, setUserData] = useState<UserData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [tempImage, setTempImage] = useState<string | null>(null)

    useEffect(() => {
        const user = getCurrentUser()
        if (!user) {
            router.push("/login")
            return
        }
        setUserData(user)
        setTempImage(user.profileImage || null)
        setIsLoading(false)
    }, [router])

    const handleImageChange = (base64Image: string | null) => {
        setTempImage(base64Image)
    }

    const handleSaveImage = () => {
        setIsSaving(true)
        try {
            if (tempImage) {
                const success = updateProfileImage(tempImage)
                if (success) {
                    setUserData(getCurrentUser())
                    toast({
                        title: "Uğurlu! ✅",
                        description: "Profil şəkliniz yeniləndi",
                    })
                } else {
                    throw new Error("Failed to update image")
                }
            } else {
                const success = removeProfileImage()
                if (success) {
                    setUserData(getCurrentUser())
                    toast({
                        title: "Uğurlu! ✅",
                        description: "Profil şəkli silindi",
                    })
                } else {
                    throw new Error("Failed to remove image")
                }
            }
        } catch (error) {
            toast({
                title: "Xəta",
                description: "Şəkil yenilənərkən xəta baş verdi",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleRemoveImage = () => {
        setTempImage(null)
    }

    const handleLogout = () => {
        logout()
        router.push("/login")
        toast({
            title: "Çıxış edildi",
            description: "Təhlükəsiz çıxış edildi",
        })
    }

    const handleError = (error: string) => {
        toast({
            title: "Xəta",
            description: error,
            variant: "destructive",
        })
    }

    if (isLoading || !userData) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </MainLayout>
        )
    }

    const dashboardPath = getDashboardPath(userData.accountType)
    const roleLabel = getRoleLabel(userData.accountType, userData.role)
    const hasImageChanged = tempImage !== (userData.profileImage || null)

    return (
        <MainLayout>
            <div className={`min-h-screen bg-gradient-to-br ${theme.gradient}`}>
                {/* Header */}
                <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <Link href={dashboardPath}>
                                <Button variant="ghost" className="gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Geri
                                </Button>
                            </Link>
                            <div className="flex flex-col items-center">
                                <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
                                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 mt-0.5 select-all" title="Sizin Şəxsi ID Kodunuz">
                                    ID: {getUserUniqueId(userData)}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                Çıxış
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left Column - Profile Image */}
                        <div className="md:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-center">Profil Şəkli</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col items-center">
                                        <ProfileAvatar
                                            firstName={userData.firstName}
                                            lastName={userData.lastName}
                                            profileImage={tempImage || undefined}
                                            size="xl"
                                        />
                                        <div className="mt-3 text-center">
                                            <p className="text-xs text-muted-foreground">Şəxsi ID Kodu</p>
                                            <span className="inline-block mt-0.5 px-3 py-1 bg-primary/10 text-primary font-mono text-xs font-bold rounded-lg border border-primary/20 select-all" title="Sizin Şəxsi ID Kodunuz">
                                                {getUserUniqueId(userData)}
                                            </span>
                                        </div>
                                    </div>

                                    <ImageUpload
                                        currentImage={tempImage || undefined}
                                        onImageChange={handleImageChange}
                                        onError={handleError}
                                    />

                                    {hasImageChanged && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleSaveImage}
                                                disabled={isSaving}
                                                className={`flex-1 ${themeClasses.primary}`}
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                {isSaving ? "Saxlanılır..." : "Yadda saxla"}
                                            </Button>
                                            {tempImage && (
                                                <Button
                                                    variant="outline"
                                                    onClick={handleRemoveImage}
                                                    disabled={isSaving}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - User Information */}
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Şəxsi Məlumatlar</CardTitle>
                                    <CardDescription>Sizin hesab məlumatlarınız</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Unikal Şagird ID Bloku */}
                                    <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                                                <Fingerprint className="h-4 w-4" />
                                                Şəxsi Unikal ID Kodu
                                            </div>
                                            <p className="text-[11px] text-muted-foreground">
                                                Bu kod sizin sistemdəki unikal ünvanınızdır (Mesajlaşma və valideyn nəzarəti üçün).
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm font-bold text-primary bg-white px-3 py-1.5 rounded-lg border border-primary/30 shadow-xs select-all">
                                                {getUserUniqueId(userData)}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="h-8 px-2.5 text-xs gap-1"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(getUserUniqueId(userData))
                                                    toast({
                                                        title: "Kopyalandı! 📋",
                                                        description: "Şəxsi ID kodunuz kopyalandı",
                                                    })
                                                }}
                                                title="ID Kodu Kopyala"
                                            >
                                                <Copy className="h-3.5 w-3.5" />
                                                Kopyala
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">Ad</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="firstName"
                                                    value={userData.firstName}
                                                    disabled
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Soyad</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="lastName"
                                                    value={userData.lastName}
                                                    disabled
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={userData.email}
                                                disabled
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="school">Məktəb</Label>
                                        <div className="relative">
                                            <School className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="school"
                                                value={userData.school}
                                                disabled
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="region">Region</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="region"
                                                value={userData.region}
                                                disabled
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Hesab növü</p>
                                            <p className="text-sm text-gray-500">{roleLabel}</p>
                                        </div>
                                        <Badge variant="secondary" className={themeClasses.secondary}>
                                            {userData.accountType === "student" && userData.class
                                                ? `${userData.class}-ci sinif`
                                                : roleLabel}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Account Actions */}
                            <Card className="border-red-200 bg-red-50/50">
                                <CardHeader>
                                    <CardTitle className="text-red-900">Hesab Tənzimləmələri</CardTitle>
                                    <CardDescription className="text-red-700">
                                        Hesabınızdan təhlükəsiz çıxış edin
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        variant="destructive"
                                        className="w-full gap-2"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Hesabdan çıxış et
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </MainLayout>
    )
}
