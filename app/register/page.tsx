"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ArrowLeft, Loader2, Info, MapPin, Users, GraduationCap, Lock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  userRegistrationSchema,
  parentRegistrationSchema,
  type UserRegistrationData,
  type ParentRegistrationData,
} from "@/lib/validations"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "@/hooks/use-theme"
import ThemeSelector from "@/components/theme-selector"
import RegionBackground from "@/components/region-background"
import RegionFactsModal from "@/components/region-facts-modal"
import { getRegionInfo } from "@/lib/region-symbols"
import { hasSubRegions, getSubRegions } from "@/lib/region-hierarchy"
import { AdBanner } from "@/components/ads/ad-banner"

const regions = [
  "Bakı",
  "Gəncə",
  "Sumqayıt",
  "Mingəçevir",
  "Naftalan",
  "Şirvan",
  "Şəki",
  "Yevlax",
  "Abşeron",
  "Ağcabədi",
  "Ağdam",
  "Ağdaş",
  "Ağstafa",
  "Ağsu",
  "Astara",
  "Balakən",
  "Bərdə",
  "Beyləqan",
  "Biləsuvar",
  "Cəbrayıl",
  "Cəlilabad",
  "Culfa",
  "Daşkəsən",
  "Füzuli",
  "Gədəbəy",
  "Goranboy",
  "Göyçay",
  "Göygöl",
  "Hacıqabul",
  "İmişli",
  "İsmayıllı",
  "Kəlbəcər",
  "Kürdəmir",
  "Laçın",
  "Lerik",
  "Masallı",
  "Neftçala",
  "Oğuz",
  "Ordubad",
  "Qax",
  "Qazax",
  "Qəbələ",
  "Qobustan",
  "Quba",
  "Qubadlı",
  "Qusar",
  "Saatlı",
  "Sabirabad",
  "Şabran",
  "Şahbuz",
  "Şəmkir",
  "Şərur",
  "Şuşa",
  "Tərtər",
  "Tovuz",
  "Ucar",
  "Xaçmaz",
  "Xankəndi",
  "Xızı",
  "Xocalı",
  "Xocavənd",
  "Yardımlı",
  "Zəngilan",
  "Zaqatala",
  "Zərdab",
]

const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]

const roles = [
  { value: "parent", label: "Valideyn", icon: "👨‍👩‍👧‍👦", restricted: false },
  { value: "teacher", label: "Müəllim (Tezliklə)", icon: "👨‍🏫", restricted: true },
  { value: "director", label: "Məktəb Direktoru (Tezliklə)", icon: "👔", restricted: true },
]

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { theme, updateTheme, getThemeClasses } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedSubRegion, setSelectedSubRegion] = useState("")
  const [registrationType, setRegistrationType] = useState<"student" | "parent">("student")

  const themeClasses = getThemeClasses()
  const selectedRegionInfo = getRegionInfo(selectedRegion)
  const subRegions = getSubRegions(selectedRegion)
  const showSubRegions = hasSubRegions(selectedRegion)

  // Student form
  const studentForm = useForm<UserRegistrationData>({
    resolver: zodResolver(userRegistrationSchema),
  })

  // Parent form
  const parentForm = useForm<ParentRegistrationData>({
    resolver: zodResolver(parentRegistrationSchema),
    defaultValues: {
      role: "parent",
      region: "Bakı",
      school: "161 saylı məktəb",
    },
  })

  const onStudentSubmit = async (data: UserRegistrationData) => {
    setIsLoading(true)

    try {
      const submissionData = {
        ...data,
        accountType: "student",
        fullLocation: selectedSubRegion ? `${data.region}, ${selectedSubRegion}` : data.region,
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Qeydiyyat zamanı xəta baş verdi")
      }

      updateTheme({ region: data.region })

      toast({
        title: "Uğurlu qeydiyyat! 🎉",
        description: "Şagird hesabınız yaradıldı. İndi giriş edə bilərsiniz.",
      })

      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: result.user.id,
          accountType: "student",
          firstName: data.firstName,
          lastName: data.lastName,
          fatherName: data.fatherName,
          region: data.region,
          subRegion: selectedSubRegion,
          fullLocation: submissionData.fullLocation,
          school: data.school,
          class: data.class,
          email: data.email,
          theme: theme.colorScheme,
        }),
      )

      if (result.session) {
        localStorage.setItem("session", JSON.stringify(result.session))
      }

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Xəta",
        description: error instanceof Error ? error.message : "Qeydiyyat zamanı xəta baş verdi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onParentSubmit = async (data: ParentRegistrationData) => {
    if (data.role === "teacher" || data.role === "director") {
      toast({
        title: "Müvəqqəti Məhdudiyyət 🚧",
        description: "Müəllim və Direktor qeydiyyatı hazırda texniki təkmilləşdirmə mərhələsindədir. Çox tezliklə istifadəyə veriləcək.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const submissionData = {
        ...data,
        accountType: "parent",
        fullLocation: selectedSubRegion ? `${data.region}, ${selectedSubRegion}` : data.region,
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Qeydiyyat zamanı xəta baş verdi")
      }

      updateTheme({ region: data.region })

      toast({
        title: "Uğurlu qeydiyyat! 🎉",
        description: `${roles.find((r) => r.value === data.role)?.label} hesabınız yaradıldı. İndi giriş edə bilərsiniz.`,
      })

      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: result.user.id,
          accountType: "parent",
          role: data.role,
          firstName: data.firstName,
          lastName: data.lastName,
          fatherName: data.fatherName,
          region: data.region,
          subRegion: selectedSubRegion,
          fullLocation: submissionData.fullLocation,
          school: data.school,
          email: data.email,
          theme: theme.colorScheme,
          linkedStudents: [],
        }),
      )

      if (result.session) {
        localStorage.setItem("session", JSON.stringify(result.session))
      }

      router.push("/parent-dashboard")
    } catch (error) {
      toast({
        title: "Xəta",
        description: error instanceof Error ? error.message : "Qeydiyyat zamanı xəta baş verdi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region)
    setSelectedSubRegion("")
    studentForm.setValue("region", region, { shouldValidate: true })
    parentForm.setValue("region", region, { shouldValidate: true })
    updateTheme({ region })
  }

  const handleSubRegionChange = (subRegion: string) => {
    setSelectedSubRegion(subRegion)
  }

  const handleThemeChange = (colorScheme: string) => {
    updateTheme({ colorScheme })
  }

  const getSubRegionTypeLabel = (type: string) => {
    switch (type) {
      case "district":
        return "rayon"
      case "village":
        return "kənd"
      case "settlement":
        return "qəsəbə"
      default:
        return ""
    }
  }

  return (
    <RegionBackground region={selectedRegion} theme={theme.colorScheme}>
      <div className="min-h-screen py-8 px-3 sm:px-6 flex justify-center items-start">
        <div className="w-full max-w-[1600px] mx-auto flex justify-center items-start gap-6">
          
          {/* Sol Reklam Bloku */}
          <aside className="hidden xl:block w-[230px] xl:w-[260px] shrink-0 sticky top-6">
            <AdBanner
              slot="register-sidebar-left"
              format="vertical"
              refreshKey="reg-left"
              label="Tövsiyə Olunan Təhsil"
            />
          </aside>

          {/* Mərkəzi Qeydiyyat Sahəsi */}
          <main className="w-full flex-1 max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/60 shadow-sm">
              <Link href="/" className={`flex items-center ${themeClasses.text} hover:opacity-80 font-semibold text-sm`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ana səhifə
              </Link>

              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 p-1 rounded-2xl bg-white shadow-md border-2 border-primary/20 overflow-hidden">
                  <Image
                    src="/logo.jpg"
                    alt="TESTAI.AZ Logo"
                    fill
                    className="object-contain rounded-xl p-0.5"
                    priority
                  />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">TESTAI.AZ</h1>
                </div>
              </div>

              <Link href="/login" className="text-sm font-bold text-primary hover:underline">
                Artıq hesabınız var? Giriş
              </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Theme Selector */}
              <div className="lg:col-span-1">
                <ThemeSelector selectedTheme={theme.colorScheme} onThemeChange={handleThemeChange} />
              </div>

              {/* Registration Form */}
              <div className="lg:col-span-2">
              <Card className="backdrop-blur-sm bg-white/95">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Qeydiyyat</CardTitle>
                  <CardDescription className="text-center">
                    Platformaya qoşulmaq üçün hesab növünü seçin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={registrationType}
                    onValueChange={(v) => {
                      const type = v as "student" | "parent"
                      setRegistrationType(type)
                      if (type === "parent") {
                        if (selectedRegion) parentForm.setValue("region", selectedRegion, { shouldValidate: true })
                        if (!parentForm.getValues("role")) parentForm.setValue("role", "parent", { shouldValidate: true })
                      } else {
                        if (selectedRegion) studentForm.setValue("region", selectedRegion, { shouldValidate: true })
                      }
                    }}
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="student">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Şagird
                      </TabsTrigger>
                      <TabsTrigger value="parent">
                        <Users className="h-4 w-4 mr-2" />
                        Valideyn/Müəllim
                      </TabsTrigger>
                    </TabsList>

                    {/* Student Registration */}
                    <TabsContent value="student">
                      <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-6">
                        {/* Personal Information */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">Ad *</Label>
                            <Input
                              id="firstName"
                              {...studentForm.register("firstName")}
                              placeholder="Adınızı daxil edin"
                              className={studentForm.formState.errors.firstName ? "border-red-500" : ""}
                            />
                            {studentForm.formState.errors.firstName && (
                              <p className="text-red-500 text-sm mt-1">
                                {studentForm.formState.errors.firstName.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="lastName">Soyad *</Label>
                            <Input
                              id="lastName"
                              {...studentForm.register("lastName")}
                              placeholder="Soyadınızı daxil edin"
                              className={studentForm.formState.errors.lastName ? "border-red-500" : ""}
                            />
                            {studentForm.formState.errors.lastName && (
                              <p className="text-red-500 text-sm mt-1">
                                {studentForm.formState.errors.lastName.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="fatherName">Ata adı *</Label>
                          <Input
                            id="fatherName"
                            {...studentForm.register("fatherName")}
                            placeholder="Ata adınızı daxil edin"
                            className={studentForm.formState.errors.fatherName ? "border-red-500" : ""}
                          />
                          {studentForm.formState.errors.fatherName && (
                            <p className="text-red-500 text-sm mt-1">
                              {studentForm.formState.errors.fatherName.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="birthDate">Doğum tarixi *</Label>
                          <Input
                            id="birthDate"
                            type="date"
                            {...studentForm.register("birthDate")}
                            className={studentForm.formState.errors.birthDate ? "border-red-500" : ""}
                          />
                          {studentForm.formState.errors.birthDate && (
                            <p className="text-red-500 text-sm mt-1">
                              {studentForm.formState.errors.birthDate.message}
                            </p>
                          )}
                        </div>

                        {/* Location and School */}
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="region">Yaşadığınız ərazi *</Label>
                            <Select onValueChange={handleRegionChange}>
                              <SelectTrigger className={studentForm.formState.errors.region ? "border-red-500" : ""}>
                                <SelectValue placeholder="Şəhər/rayon seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {regions.map((region) => {
                                  const regionInfo = getRegionInfo(region)
                                  const hasSubRegionsFlag = hasSubRegions(region)
                                  return (
                                    <SelectItem key={region} value={region}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">{regionInfo?.symbol}</span>
                                        <div className="flex flex-col">
                                          <div className="flex items-center gap-1">
                                            <span>{region}</span>
                                            {hasSubRegionsFlag && <MapPin className="h-3 w-3 text-blue-500" />}
                                          </div>
                                          <span className="text-xs text-gray-500">{regionInfo?.description}</span>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                            {studentForm.formState.errors.region && (
                              <p className="text-red-500 text-sm mt-1">{studentForm.formState.errors.region.message}</p>
                            )}
                          </div>

                          {showSubRegions && (
                            <div>
                              <Label htmlFor="subRegion">Dəqiq ünvan {selectedRegion && `(${selectedRegion})`}</Label>
                              <Select onValueChange={handleSubRegionChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Rayon/kənd seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                  {subRegions.map((subRegion) => (
                                    <SelectItem key={subRegion.name} value={subRegion.name}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">{subRegion.symbol}</span>
                                        <div className="flex flex-col">
                                          <span>{subRegion.name}</span>
                                          <span className="text-xs text-gray-500">
                                            {getSubRegionTypeLabel(subRegion.type)}
                                          </span>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {selectedRegion && selectedRegionInfo && (
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{selectedRegionInfo.symbol}</span>
                                <div className="flex flex-col">
                                  <p className="text-sm text-gray-600">
                                    <strong>
                                      {selectedSubRegion ? `${selectedRegion}, ${selectedSubRegion}` : selectedRegion}
                                    </strong>
                                  </p>
                                  <p className="text-xs text-gray-500">{selectedRegionInfo.description}</p>
                                </div>
                              </div>
                              <RegionFactsModal region={selectedRegion}>
                                <Button variant="outline" size="sm" type="button">
                                  <Info className="h-4 w-4 mr-1" />
                                  Ətraflı
                                </Button>
                              </RegionFactsModal>
                            </div>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="school">Məktəb *</Label>
                          <Input
                            id="school"
                            {...studentForm.register("school")}
                            placeholder="Məktəbinizin adını daxil edin"
                            className={studentForm.formState.errors.school ? "border-red-500" : ""}
                          />
                          {studentForm.formState.errors.school && (
                            <p className="text-red-500 text-sm mt-1">{studentForm.formState.errors.school.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="class">Sinif *</Label>
                          <Select onValueChange={(value) => studentForm.setValue("class", value)}>
                            <SelectTrigger className={studentForm.formState.errors.class ? "border-red-500" : ""}>
                              <SelectValue placeholder="Sinifinizi seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {classes.map((cls) => (
                                <SelectItem key={cls} value={cls}>
                                  {cls}-ci sinif
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {studentForm.formState.errors.class && (
                            <p className="text-red-500 text-sm mt-1">{studentForm.formState.errors.class.message}</p>
                          )}
                        </div>

                        {/* Account Information */}
                        <div>
                          <Label htmlFor="email">E-mail *</Label>
                          <Input
                            id="email"
                            type="email"
                            {...studentForm.register("email")}
                            placeholder="E-mail ünvanınızı daxil edin"
                            className={studentForm.formState.errors.email ? "border-red-500" : ""}
                          />
                          {studentForm.formState.errors.email && (
                            <p className="text-red-500 text-sm mt-1">{studentForm.formState.errors.email.message}</p>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="password">Şifrə *</Label>
                            <Input
                              id="password"
                              type="password"
                              {...studentForm.register("password")}
                              placeholder="Şifrənizi daxil edin"
                              className={studentForm.formState.errors.password ? "border-red-500" : ""}
                            />
                            {studentForm.formState.errors.password && (
                              <p className="text-red-500 text-sm mt-1">
                                {studentForm.formState.errors.password.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword">Şifrəni təkrarla *</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              {...studentForm.register("confirmPassword")}
                              placeholder="Şifrənizi təkrar daxil edin"
                              className={studentForm.formState.errors.confirmPassword ? "border-red-500" : ""}
                            />
                            {studentForm.formState.errors.confirmPassword && (
                              <p className="text-red-500 text-sm mt-1">
                                {studentForm.formState.errors.confirmPassword.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <Button type="submit" className={`w-full ${themeClasses.primary}`} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Qeydiyyat edilir...
                            </>
                          ) : (
                            "Şagird olaraq qeydiyyatdan keç"
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    {/* Parent/Teacher Registration */}
                    <TabsContent value="parent">
                      <form onSubmit={parentForm.handleSubmit(onParentSubmit)} className="space-y-6">
                        {/* Role Selection */}
                        <div>
                          <Label htmlFor="role">Rol *</Label>
                          <Select
                            value={parentForm.watch("role") || "parent"}
                            onValueChange={(value) => parentForm.setValue("role", value as any, { shouldValidate: true })}
                          >
                            <SelectTrigger className={parentForm.formState.errors.role ? "border-red-500" : ""}>
                              <SelectValue placeholder="Rolunuzu seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  <div className="flex items-center gap-2">
                                    <span>{role.icon}</span>
                                    <span>{role.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {parentForm.watch("role") && (parentForm.watch("role") === "teacher" || parentForm.watch("role") === "director") && (
                            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2 animate-in fade-in">
                              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                              <span>Müəllim və Direktor qeydiyyatı hazırda texniki hazırlıq mərhələsindədir. Çox tezliklə aktiv olacaq.</span>
                            </div>
                          )}
                          {parentForm.formState.errors.role && (
                            <p className="text-red-500 text-sm mt-1">{parentForm.formState.errors.role.message}</p>
                          )}
                        </div>

                        {/* Personal Information */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="parent-firstName">Ad *</Label>
                            <Input
                              id="parent-firstName"
                              {...parentForm.register("firstName")}
                              placeholder="Adınızı daxil edin"
                              className={parentForm.formState.errors.firstName ? "border-red-500" : ""}
                            />
                            {parentForm.formState.errors.firstName && (
                              <p className="text-red-500 text-sm mt-1">
                                {parentForm.formState.errors.firstName.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="parent-lastName">Soyad *</Label>
                            <Input
                              id="parent-lastName"
                              {...parentForm.register("lastName")}
                              placeholder="Soyadınızı daxil edin"
                              className={parentForm.formState.errors.lastName ? "border-red-500" : ""}
                            />
                            {parentForm.formState.errors.lastName && (
                              <p className="text-red-500 text-sm mt-1">
                                {parentForm.formState.errors.lastName.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="parent-fatherName">Ata adı *</Label>
                          <Input
                            id="parent-fatherName"
                            {...parentForm.register("fatherName")}
                            placeholder="Ata adınızı daxil edin"
                            className={parentForm.formState.errors.fatherName ? "border-red-500" : ""}
                          />
                          {parentForm.formState.errors.fatherName && (
                            <p className="text-red-500 text-sm mt-1">
                              {parentForm.formState.errors.fatherName.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="parent-birthDate">Doğum tarixi</Label>
                          <Input
                            id="parent-birthDate"
                            type="date"
                            {...parentForm.register("birthDate")}
                            className={parentForm.formState.errors.birthDate ? "border-red-500" : ""}
                          />
                          {parentForm.formState.errors.birthDate && (
                            <p className="text-red-500 text-sm mt-1">
                              {parentForm.formState.errors.birthDate.message}
                            </p>
                          )}
                        </div>

                        {/* Location */}
                        <div>
                          <Label htmlFor="parent-region">Yaşadığınız ərazi *</Label>
                          <Select 
                            value={parentForm.watch("region") || selectedRegion} 
                            onValueChange={handleRegionChange}
                          >
                            <SelectTrigger className={parentForm.formState.errors.region ? "border-red-500" : ""}>
                              <SelectValue placeholder="Şəhər/rayon seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {regions.map((region) => {
                                const regionInfo = getRegionInfo(region)
                                return (
                                  <SelectItem key={region} value={region}>
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">{regionInfo?.symbol}</span>
                                      <span>{region}</span>
                                    </div>
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                          {parentForm.formState.errors.region && (
                            <p className="text-red-500 text-sm mt-1">{parentForm.formState.errors.region.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="parent-school">Məktəb (Uşağın oxuduğu məktəb)</Label>
                          <Input
                            id="parent-school"
                            {...parentForm.register("school")}
                            placeholder="Məsələn: 161 saylı məktəb"
                            className={parentForm.formState.errors.school ? "border-red-500" : ""}
                          />
                          {parentForm.formState.errors.school && (
                            <p className="text-red-500 text-sm mt-1">{parentForm.formState.errors.school.message}</p>
                          )}
                        </div>

                        {/* Account Information */}
                        <div>
                          <Label htmlFor="parent-email">E-mail *</Label>
                          <Input
                            id="parent-email"
                            type="email"
                            {...parentForm.register("email")}
                            placeholder="E-mail ünvanınızı daxil edin"
                            className={parentForm.formState.errors.email ? "border-red-500" : ""}
                          />
                          {parentForm.formState.errors.email && (
                            <p className="text-red-500 text-sm mt-1">{parentForm.formState.errors.email.message}</p>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="parent-password">Şifrə *</Label>
                            <Input
                              id="parent-password"
                              type="password"
                              {...parentForm.register("password")}
                              placeholder="Şifrənizi daxil edin"
                              className={parentForm.formState.errors.password ? "border-red-500" : ""}
                            />
                            {parentForm.formState.errors.password && (
                              <p className="text-red-500 text-sm mt-1">
                                {parentForm.formState.errors.password.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="parent-confirmPassword">Şifrəni təkrarla *</Label>
                            <Input
                              id="parent-confirmPassword"
                              type="password"
                              {...parentForm.register("confirmPassword")}
                              placeholder="Şifrənizi təkrar daxil edin"
                              className={parentForm.formState.errors.confirmPassword ? "border-red-500" : ""}
                            />
                            {parentForm.formState.errors.confirmPassword && (
                              <p className="text-red-500 text-sm mt-1">
                                {parentForm.formState.errors.confirmPassword.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <Button type="submit" className={`w-full ${themeClasses.primary}`} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Qeydiyyat edilir...
                            </>
                          ) : (
                            "Valideyn/Müəllim olaraq qeydiyyatdan keç"
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Artıq hesabınız var?{" "}
                      <Link href="/login" className={`${themeClasses.text} hover:opacity-80`}>
                        Giriş edin
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Sağ Reklam Bloku */}
        <aside className="hidden xl:block w-[230px] xl:w-[260px] shrink-0 sticky top-6">
          <AdBanner
            slot="register-sidebar-right"
            format="vertical"
            refreshKey="reg-right"
            label="Sponsorlu Elanlar"
          />
        </aside>

      </div>
    </div>
  </RegionBackground>
  )
}
