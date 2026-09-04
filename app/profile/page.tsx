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
    updateUserData,
    updateProfileImage,
    removeProfileImage,
    logout,
    getRoleLabel,
    getDashboardPath,
    getUserUniqueId,
    type UserData
} from "@/lib/profile-utils"
import { ArrowLeft, User, Mail, School, MapPin, LogOut, Save, Trash2, Fingerprint, Copy, Pencil, GraduationCap, ArrowRight, Plus } from "lucide-react"
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
    const [isEditing, setIsEditing] = useState(false)
    const [isSavingProfile, setIsSavingProfile] = useState(false)
    const [linkedStudents, setLinkedStudents] = useState<any[]>([])
    const [isLoadingStudents, setIsLoadingStudents] = useState(false)
    const [profileForm, setProfileForm] = useState({
        firstName: "",
        lastName: "",
        fatherName: "",
        school: "",
        region: "",
        class: "",
    })

    const loadParentStudents = async (parentId: number | string, email?: string) => {
        try {
            setIsLoadingStudents(true)
            if (email) {
                try {
                    const cached = localStorage.getItem("linked_students_" + email.toLowerCase()) || localStorage.getItem(`linked_students_${parentId}`)
                    if (cached) {
                        const parsed = JSON.parse(cached)
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setLinkedStudents(parsed)
                        }
                    }
                } catch (e) {}
            }
            const session = localStorage.getItem("session")
            const token = session ? JSON.parse(session).access_token : null
            const emailQuery = email ? `&email=${encodeURIComponent(email)}` : ""
            const res = await fetch(`/api/students/link?parentId=${encodeURIComponent(parentId)}${emailQuery}`, {
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            })
            const data = await res.json()
            let list = data.success && data.links ? data.links : []
            if (list.length > 0 && email) {
                try {
                    localStorage.setItem("linked_students_" + email.toLowerCase(), JSON.stringify(list))
                } catch (e) {}
            } else if (list.length === 0 && email) {
                try {
                    const cached = localStorage.getItem("linked_students_" + email.toLowerCase())
                    if (cached) {
                        const parsed = JSON.parse(cached)
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            list = parsed
                        }
                    }
                } catch (e) {}
            }
            setLinkedStudents(list)
        } catch (e) {
            console.error("Error loading linked students in profile:", e)
        } finally {
            setIsLoadingStudents(false)
        }
    }

    useEffect(() => {
        const user = getCurrentUser()
        if (!user) {
            router.push("/login")
            return
        }
        setUserData(user)
        setTempImage(user.profileImage || null)
        setProfileForm({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            fatherName: (user as any).fatherName || "",
            school: user.school || "",
            region: user.region || "",
            class: user.class || "5",
        })
        setIsLoading(false)

        if (user.accountType === "parent" || user.role === "parent" || user.accountType === "teacher" || user.accountType === "director") {
            loadParentStudents(user.id, user.email)
        }
    }, [router])

    const handleStartEdit = () => {
        if (!userData) return
        setProfileForm({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            fatherName: userData.fatherName || "",
            school: userData.school || "",
            region: userData.region || "",
            class: userData.class || "5",
        })
        setIsEditing(true)
    }

    const handleCancelEdit = () => {
        if (!userData) return
        setProfileForm({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            fatherName: userData.fatherName || "",
            school: userData.school || "",
            region: userData.region || "",
            class: userData.class || "5",
        })
        setIsEditing(false)
    }

    const handleSaveProfile = async () => {
        if (!userData) return
        if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
            toast({
                title: "Xəta",
                description: "Ad və Soyad daxil edilməlidir",
                variant: "destructive",
            })
            return
        }

        setIsSavingProfile(true)
        try {
            const session = localStorage.getItem("session")
            const token = session ? JSON.parse(session).access_token : null

            const updatedData: Partial<UserData> = {
                firstName: profileForm.firstName.trim(),
                lastName: profileForm.lastName.trim(),
                fatherName: profileForm.fatherName.trim(),
                school: profileForm.school.trim(),
                region: profileForm.region.trim(),
                class: profileForm.class ? profileForm.class.trim() : userData.class,
            }

            // Call backend PUT /api/users
            await fetch("/api/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    id: userData.id,
                    email: userData.email,
                    ...updatedData,
                }),
            })

            // Update local storage and state
            updateUserData(updatedData)
            const refreshedUser = getCurrentUser()
            if (refreshedUser) {
                setUserData(refreshedUser)
            }

            setIsEditing(false)
            toast({
                title: "Uğurlu! ✅",
                description: "Profil məlumatlarınız uğurla yeniləndi",
            })
        } catch (error) {
            toast({
                title: "Xəta",
                description: "Profil məlumatları saxlanılarkən xəta baş verdi",
                variant: "destructive",
            })
        } finally {
            setIsSavingProfile(false)
        }
    }

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
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <div>
                                        <CardTitle>Şəxsi Məlumatlar</CardTitle>
                                        <CardDescription>Sizin hesab məlumatlarınız</CardDescription>
                                    </div>
                                    {!isEditing ? (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleStartEdit}
                                            className="gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Redaktə et
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleCancelEdit}
                                                disabled={isSavingProfile}
                                            >
                                                Ləğv et
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={handleSaveProfile}
                                                disabled={isSavingProfile}
                                                className={themeClasses.primary}
                                            >
                                                <Save className="h-4 w-4 mr-1.5" />
                                                {isSavingProfile ? "Saxlanılır..." : "Yadda saxla"}
                                            </Button>
                                        </div>
                                    )}
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
                                            <Label htmlFor="firstName">Ad *</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="firstName"
                                                    value={isEditing ? profileForm.firstName : userData.firstName}
                                                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="pl-10"
                                                    placeholder="Adınız"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Soyad *</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="lastName"
                                                    value={isEditing ? profileForm.lastName : userData.lastName}
                                                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="pl-10"
                                                    placeholder="Soyadınız"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fatherName">Ata adı</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="fatherName"
                                                    value={isEditing ? profileForm.fatherName : (userData.fatherName || "")}
                                                    onChange={(e) => setProfileForm({ ...profileForm, fatherName: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="pl-10"
                                                    placeholder="Ata adı"
                                                />
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
                                                    className="pl-10 bg-gray-50 text-gray-500 cursor-not-allowed"
                                                    title="Email hesaba giriş açarı olduğu üçün dəyişdirilə bilməz"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="school">Məktəb</Label>
                                            <div className="relative">
                                                <School className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="school"
                                                    value={isEditing ? profileForm.school : userData.school}
                                                    onChange={(e) => setProfileForm({ ...profileForm, school: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="pl-10"
                                                    placeholder="Məktəb nömrəsi və ya adı"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="region">Region / Rayon</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="region"
                                                    value={isEditing ? profileForm.region : (userData.region || "")}
                                                    onChange={(e) => setProfileForm({ ...profileForm, region: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="pl-10"
                                                    placeholder="Məs: Bakı, Sumqayıt..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {userData.accountType === "student" && (
                                        <div className="space-y-2">
                                            <Label htmlFor="class">Sinif</Label>
                                            {isEditing ? (
                                                <select
                                                    id="class"
                                                    value={profileForm.class}
                                                    onChange={(e) => setProfileForm({ ...profileForm, class: e.target.value })}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((c) => (
                                                        <option key={c} value={String(c)}>
                                                            {c}-ci sinif
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <Input
                                                    id="class"
                                                    value={userData.class ? `${userData.class}-ci sinif` : "-"}
                                                    disabled
                                                    className="bg-gray-50 text-gray-700"
                                                />
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Hesab növü</p>
                                            <p className="text-sm text-gray-500">{roleLabel}</p>
                                        </div>
                                        <Badge variant="secondary" className={themeClasses.secondary}>
                                            {userData.accountType === "student" && (isEditing ? profileForm.class : userData.class)
                                                ? `${isEditing ? profileForm.class : userData.class}-ci sinif`
                                                : roleLabel}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Əlaqəli Şagirdlər Bloku (Valideynlər və Nəzarətçilər üçün) */}
                            {(userData.accountType === "parent" || userData.role === "parent" || userData.accountType === "teacher" || userData.accountType === "director") && (
                                <Card className="border-blue-100">
                                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg flex items-center gap-2 text-blue-950">
                                                <GraduationCap className="h-5 w-5 text-blue-600" />
                                                Əlaqəli Şagirdlər / Övladlar
                                            </CardTitle>
                                            <CardDescription>
                                                Hesabınıza bağlı olan və nəzarət etdiyiniz şagirdlər
                                            </CardDescription>
                                        </div>
                                        <Link href="/parent-dashboard">
                                            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                İdarəetmə Paneli
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                    </CardHeader>
                                    <CardContent>
                                        {isLoadingStudents ? (
                                            <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                Şagirdlər yüklənir...
                                            </div>
                                        ) : linkedStudents.length === 0 ? (
                                            <div className="py-6 text-center text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                                <p className="text-sm font-medium">Hələ şagird əlavə edilməyib</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Şagird əlavə edərək onun test nəticələrinə və inkişafına nəzarət edə bilərsiniz.
                                                </p>
                                                <Link href="/parent-dashboard">
                                                    <Button size="sm" className={`mt-3 gap-1.5 ${themeClasses.primary}`}>
                                                        <Plus className="h-3.5 w-3.5" />
                                                        Şagird Əlavə Et
                                                    </Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {linkedStudents.map((student: any) => (
                                                    <div
                                                        key={student.id}
                                                        className="p-3.5 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                                    >
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-sm text-gray-900">
                                                                    {student.studentName || `${student.firstName} ${student.lastName}`}
                                                                </span>
                                                                {(student.studentClass || student.class) && (
                                                                    <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                                                                        {student.studentClass || student.class}-ci sinif
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-3">
                                                                {(student.studentSchool || student.school) && <span>🏫 {student.studentSchool || student.school}</span>}
                                                                {student.fatherName && <span>Ata adı: {student.fatherName}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-xs font-bold text-primary bg-white px-2.5 py-1 rounded-md border border-primary/20 select-all">
                                                                {student.studentEmail?.includes("@testai.az")
                                                                    ? `@${student.studentEmail.replace("@testai.az", "")}`
                                                                    : (student.studentEmail || `@id`)}
                                                            </span>
                                                            <Link href="/parent-dashboard">
                                                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700">
                                                                    Bax
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

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
