'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Save } from 'lucide-react'

// Hardcoded list of textbooks we care about. 
// In a real app, we'd fetch this from `data/textbooks.json` or API.
const SUBJECTS = [
    { id: 'azerbaycan-tarixi', name: 'Azərbaycan tarixi 8' },
    { id: 'informatika', name: 'İnformatika 8' },
    { id: 'texnologiya', name: 'Texnologiya 8' },
    { id: 'musiqi', name: 'Musiqi 8' },
    { id: 'tesviri-incesenet', name: 'Təsviri İncəsənət 8' },
    { id: 'hayat-bilgisi', name: 'Həyat Bilgisi 8' },
    { id: 'ortaq-turk-tarixi', name: 'Ortaq Türk Tarixi 8' },
    { id: 'alman-dili-esas', name: 'Alman dili (Əsas)' },
    { id: 'fransiz-dili-esas', name: 'Fransız dili (Əsas)' },
    { id: 'rus-dili-esas', name: 'Rus dili (Əsas)' },
]

export default function AdminTopicsPage() {
    const [selectedSubject, setSelectedSubject] = useState<string>("")
    const [topics, setTopics] = useState<any[]>([])
    const [jsonText, setJsonText] = useState<string>("") // For manual editing
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    // Load correct topics based on selection
    useEffect(() => {
        if (!selectedSubject) return

        async function loadTopics() {
            setLoading(true)
            try {
                const res = await fetch('/api/admin/topics') // Gets all
                const data = await res.json()

                if (data[selectedSubject]) {
                    setTopics(data[selectedSubject])
                    setJsonText(JSON.stringify(data[selectedSubject], null, 2))
                } else {
                    setTopics([])
                    setJsonText("[]")
                }
            } catch (err) {
                console.error(err)
                toast({ title: "Xəta", description: "Məlumatları yükləmək mümkün olmadı", variant: "destructive" })
            } finally {
                setLoading(false)
            }
        }

        loadTopics()
    }, [selectedSubject, toast])

    const handleSave = async () => {
        if (!selectedSubject) return
        setSaving(true)

        try {
            // Validate JSON
            let dataToSave
            try {
                dataToSave = JSON.parse(jsonText)
            } catch (e) {
                toast({ title: "Səhv JSON", description: "Format düzgün deyil. Vergülləri və mötərizələri yoxlayın.", variant: "destructive" })
                setSaving(false)
                return
            }

            const res = await fetch('/api/admin/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: selectedSubject,
                    topics: dataToSave
                })
            })

            if (res.ok) {
                toast({ title: "Uğurlu", description: "Mövzular yadda saxlanıldı", className: "bg-green-600 text-white" })
            } else {
                throw new Error("Save failed")
            }
        } catch (err) {
            toast({ title: "Xəta", description: "Yadda saxlamaq mümkün olmadı", variant: "destructive" })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Mövzu İdarəetməsi</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left: Subject Selection */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Dərslik Seçimi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                            <SelectTrigger>
                                <SelectValue placeholder="Fənn seçin..." />
                            </SelectTrigger>
                            <SelectContent>
                                {SUBJECTS.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {selectedSubject && (
                            <div className="mt-4 p-4 bg-slate-100 rounded text-sm text-slate-600">
                                Seçilmiş dərslik üçün mövzuları sağ tərəfdə redaktə edin və yadda saxlayın.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Right: Editor */}
                <Card className="md:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            {selectedSubject ? SUBJECTS.find(s => s.id === selectedSubject)?.name : "Redaktor"}
                        </CardTitle>
                        {selectedSubject && (
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Yadda Saxla
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
                        ) : selectedSubject ? (
                            <div className="space-y-2">
                                <p className="text-sm text-slate-500 mb-2">
                                    JSON formatında birbaşa redaktə edin. Strukturu pozmamağa çalışın:
                                    <code className="bg-slate-200 px-1 rounded ml-1">{"[{ chapter: '...', topics: [...] }]"}</code>
                                </p>
                                <Textarea
                                    value={jsonText}
                                    onChange={(e) => setJsonText(e.target.value)}
                                    className="font-mono text-sm min-h-[500px]"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-slate-400">
                                Sol tərəfdən fənn seçin
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
