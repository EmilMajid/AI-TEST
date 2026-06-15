'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, ShieldCheck, UserCheck, Key, Save, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Mock Data for Global Settings
const defaultGlobalSettings = [
  { id: 'basicStats', name: 'İlkin Təhlil (Descriptive Stats)', isFree: true, desc: 'Tələbənin ümumi balı, doğrusu və s.' },
  { id: 'itemAnalysis', name: 'Sual Analizi (Item Analysis)', isFree: false, desc: 'Çətinlik dərəcəsi və distractor analizi' },
  { id: 'behaviorAnalysis', name: 'Davranış Analizi (Behavior)', isFree: false, desc: 'Suala sərf olunan vaxt və drop-out rateləri' },
  { id: 'clusterAnalysis', name: 'Seqmentasiya (AI Profiling)', isFree: false, desc: 'Tələbənin öyrənmə profilinin vizual təyini' },
  { id: 'bloomAnalysis', name: 'Bloom Taksonomiyası', isFree: false, desc: 'Koqnitiv səviyyə üzrə bacarıqların xəritəsi' },
]

// Mock Data for Users
const mockUsers = [
  { id: 1, name: 'Aysel Məmmədova (Valideyn)', email: 'aysel.valideyn@gmail.com', hasVip: false, customOverrides: [] },
  { id: 2, name: 'Rəşad Əliyev (Valideyn)', email: 'aliyev.r@mail.ru', hasVip: true, customOverrides: ['itemAnalysis'] },
  { id: 3, name: 'Nigar Həsənova (Valideyn)', email: 'nhasanova@edu.az', hasVip: false, customOverrides: ['bloomAnalysis', 'behaviorAnalysis'] },
]

export default function AccessControlPage() {
  const [globalSettings, setGlobalSettings] = useState<any[]>([])
  const [usersDb, setUsersDb] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    fetch(`/api/admin/access-control?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setGlobalSettings(data.globalSettings || [])
        setUsersDb(data.users || [])
        setLoading(false)
      })
  }, [])
  
  const handleGlobalToggle = (id: string) => {
    setGlobalSettings(prev => prev.map(s => s.id === id ? { ...s, isFree: !s.isFree } : s))
  }

  const saveGlobalSettings = async () => {
    try {
      await fetch('/api/admin/access-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'global', globalSettings })
      })
      alert("Ümumi qaydalar uğurla yadda saxlanıldı!")
    } catch(err) {
      alert("Xəta baş verdi!")
    }
  }

  const handleUserSearch = () => {
    const found = usersDb.find(u => u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.name.toLowerCase().includes(searchQuery.toLowerCase()))
    if (found) {
      setSelectedUser({...found})
    } else {
      setSelectedUser(null)
      alert("İstifadəçi tapılmadı! (Məsələn: aysel.valideyn@gmail.com)")
    }
  }

  const handleUserVipToggle = () => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, hasVip: !selectedUser.hasVip })
    }
  }

  const handleUserOverrideToggle = (moduleId: string) => {
    if (!selectedUser) return;
    const hasOverride = selectedUser.customOverrides.includes(moduleId)
    let newOverrides = [...selectedUser.customOverrides]
    if (hasOverride) {
      newOverrides = newOverrides.filter((id: string) => id !== moduleId)
    } else {
      newOverrides.push(moduleId)
    }
    setSelectedUser({ ...selectedUser, customOverrides: newOverrides })
  }

  const saveUserChanges = async () => {
    try {
      await fetch('/api/admin/access-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'user', user: selectedUser })
      })
      // Update local db state so future searches reflect the change
      setUsersDb(prev => prev.map(u => u.id === selectedUser.id ? selectedUser : u))
      alert(`Dəyişikliklər ${selectedUser.name} üçün uğurla yadda saxlanıldı!`)
    } catch(err) {
      alert("Xəta baş verdi!")
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Yüklənir...</div>

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-blue-600" />
          Mərkəzi İcazə İdarəetməsi (Access Control)
        </h1>
        <p className="text-slate-500 mt-2">
          Platformadakı analitika modullarının pulsuz (Free) və ödənişli (Premium) olmasını tənzimləyin və ya spesifik istifadəçilərə xüsusi VIP imtiyazlar verin.
        </p>
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-3xl mb-8">
          <TabsTrigger value="global" className="py-3">🌐 Qlobal Qaydalar</TabsTrigger>
          <TabsTrigger value="users" className="py-3">👤 Fərdi İmtiyazlar (Overrides)</TabsTrigger>
          <TabsTrigger value="parents" className="py-3">👨‍👩‍👦 Valideyn İcazələri</TabsTrigger>
        </TabsList>

        {/* GLOBAL TAB */}
        <TabsContent value="global">
          <Card>
            <CardHeader className="border-b pb-6">
              <CardTitle>Bütün Sistem üçün Standart Qaydalar</CardTitle>
              <CardDescription>
                Bu ayarlar bütün platforma və istifadəçilərə tətbiq ediləcək əsas (default) qaydalardır. "Ödənişsiz" olaraq işarələnən modullar hər kəsə açıq olacaq.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {globalSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-slate-800">{setting.name}</h4>
                      <p className="text-sm text-slate-500">{setting.desc}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium ${setting.isFree ? 'text-green-600' : 'text-slate-400'}`}>
                        {setting.isFree ? 'Açıq (Free)' : 'Kilidli (Premium)'}
                      </span>
                      <Switch 
                        checked={setting.isFree}
                        onCheckedChange={() => handleGlobalToggle(setting.id)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end pt-4">
                  <Button className="flex items-center gap-2" onClick={saveGlobalSettings}>
                    <Save size={16} /> Ümumi Qaydaları Yadda Saxla
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USER SPECIFIC TAB */}
        <TabsContent value="users">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>İstifadəçi Axtarışı</CardTitle>
              <CardDescription>Email və ya ad ilə istifadəçini tapıb ona xüsusi imtiyazlar (override) verin.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input 
                    placeholder="Məsələn: aysel.valideyn@gmail.com" 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()}
                  />
                </div>
                <Button onClick={handleUserSearch} variant="secondary">Axtar</Button>
              </div>
            </CardContent>
          </Card>

          {selectedUser && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
              <div className="md:col-span-1">
                <Card className="h-full border-blue-200 shadow-sm">
                  <CardHeader className="bg-blue-50/50 pb-4 border-b">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                      <UserCheck size={24} />
                    </div>
                    <CardTitle className="text-xl">{selectedUser.name}</CardTitle>
                    <CardDescription>{selectedUser.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div>
                        <p className="font-bold text-amber-900 flex items-center gap-1">
                          <Key size={16} /> VIP Status
                        </p>
                        <p className="text-xs text-amber-700/80 mt-1">Bütün platformanı pulsuz edir</p>
                      </div>
                      <Switch 
                        checked={selectedUser.hasVip}
                        onCheckedChange={handleUserVipToggle}
                        className="data-[state=checked]:bg-amber-500"
                      />
                    </div>
                    
                    {selectedUser.hasVip && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-100/50 p-3 rounded">
                        <AlertCircle size={16} /> Bu istifadəçi hazırda VIP-dir. Bütün premium məhdudiyyətlər ləğv edilib.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Əlahiddə Modul İcazələri</CardTitle>
                    <CardDescription>VIP statusu vermədən sadəcə spesifik modulları bu istifadəçi üçün aça bilərsiniz.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {globalSettings.map(setting => {
                      // If it's globally free, user already has it
                      if (setting.isFree) {
                        return (
                          <div key={setting.id} className="flex items-center justify-between p-3 border rounded bg-slate-50/50 opacity-60">
                            <span>{setting.name}</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Onsuz da Açıqdır (Global)</Badge>
                          </div>
                        )
                      }
                      
                      const hasOverride = selectedUser.customOverrides.includes(setting.id)
                      const isOverriddenByVip = selectedUser.hasVip
                      
                      return (
                        <div key={setting.id} className="flex items-center justify-between p-3 border rounded hover:bg-slate-50 transition-colors">
                          <div>
                            <p className="font-medium">{setting.name}</p>
                            {hasOverride && !isOverriddenByVip && (
                              <p className="text-xs text-blue-600 font-medium">Bu istifadəçiyə xüsusi icazə verilib</p>
                            )}
                          </div>
                          <Switch 
                            checked={hasOverride || isOverriddenByVip}
                            disabled={isOverriddenByVip} // If VIP, toggle is disabled and forced true
                            onCheckedChange={() => handleUserOverrideToggle(setting.id)}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>
                      )
                    })}
                    
                    <div className="flex justify-end pt-6 border-t mt-4">
                      <Button onClick={saveUserChanges} className="bg-slate-900 hover:bg-slate-800">
                        Dəyişiklikləri Təsdiqlə
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        {/* PARENTS TAB */}
        <TabsContent value="parents">
          <Card>
            <CardHeader>
              <CardTitle>Valideyn Paylaşım İdarəetməsi</CardTitle>
              <CardDescription>Valideynlərin öz övladlarının nəticələrini hansı səviyyədə görəcəyini tənzimləyin.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, parentName: "Aysel Məmmədova", studentName: "Əli Məmmədov", access: "full" },
                  { id: 2, parentName: "Rəşad Əliyev", studentName: "Aynur Əliyeva", access: "partial" },
                ].map(link => (
                  <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                    <div>
                      <p className="font-medium text-slate-900">{link.parentName}</p>
                      <p className="text-sm text-slate-500">Şagird: {link.studentName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        className="bg-white border rounded-md px-3 py-1.5 text-sm"
                        defaultValue={link.access}
                        onChange={(e) => alert(`İcazə ${e.target.value} olaraq dəyişdirildi (Demo)`)}
                      >
                        <option value="full">Tam İcazə (Bütün nəticələr)</option>
                        <option value="partial">Qismən (Yalnız ümumi bal)</option>
                        <option value="blocked">Bloklanmış</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
