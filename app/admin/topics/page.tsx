'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Save } from 'lucide-react'
import { subjectsByClass } from '@/lib/education-data'

// Helper to convert subject name to key format used in manual-topics.json
function getTopicKey(classNum: string, subject: string): string {
    // Map subject names to their keys in manual-topics.json
    const keyMap: Record<string, string> = {
        'Azərbaycan tarixi': 'azerbaycan-tarixi',
        'İnformatika': 'informatika',
        'Texnologiya': 'texnologiya',
        'Musiqi': 'musiqi',
        'Təsviri incəsənət': 'tesviri-incesenet',
        'Həyat bilgisi': 'hayat-bilgisi',
        'Ortaq türk tarixi': 'ortaq-turk-tarixi',
        'Alman dili': 'alman-dili-esas',
        'Fransız dili': 'fransiz-dili-esas',
        'Rus dili': 'rus-dili-esas',
    }

    return keyMap[subject] || subject.toLowerCase().replace(/\s+/g, '-')
}

export default function AdminTopicsPage() {
    const [selectedClass, setSelectedClass] = useState<string>("")
    const [selectedSubject, setSelectedSubject] = useState<string>("")
    const [topicKey, setTopicKey] = useState<string>("")
    const [jsonText, setJsonText] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    // Available subjects based on selected class
    const availableSubjects = selectedClass ? subjectsByClass[selectedClass] || [] : []

    // Reset subject when class changes
    useEffect(() => {
        setSelectedSubject("")
        setTopicKey("")
        setJsonText("")
    }, [selectedClass])

    // Load topics when subject is selected
    useEffect(() => {
        if (!selectedClass || !selectedSubject) return

        async function loadTopics() {
            setLoading(true)
            try {
                const key = getTopicKey(selectedClass, selectedSubject)
                setTopicKey(key)

                // 1. Check localStorage first
                if (typeof window !== "undefined") {
                    const localCached = localStorage.getItem("testai_topics_" + key)
                    if (localCached) {
                        setJsonText(localCached)
                        setLoading(false)
                    }
                }

                const res = await fetch(`/api/admin/topics?t=${Date.now()}`, { cache: "no-store" })
                const data = await res.json()

                if (data[key]) {
                    const serverText = JSON.stringify(data[key], null, 2)
                    setJsonText(prev => {
                        // If localStorage had saved content, keep it, otherwise use server
                        return prev && prev !== "[]" ? prev : serverText
                    })
                    if (typeof window !== "undefined" && !localStorage.getItem("testai_topics_" + key)) {
                        localStorage.setItem("testai_topics_" + key, serverText)
                    }
                } else {
                    setJsonText(prev => prev && prev !== "[]" ? prev : "[]")
                }
            } catch (err) {
                console.error(err)
                toast({ title: "Xəta", description: "Məlumatları yükləmək mümkün olmadı", variant: "destructive" })
            } finally {
                setLoading(false)
            }
        }

        loadTopics()
    }, [selectedClass, selectedSubject, toast])

    const handleSave = async () => {
        if (!topicKey) return
        setSaving(true)

        try {
            let dataToSave
            try {
                dataToSave = JSON.parse(jsonText)
            } catch (e) {
                toast({ title: "Səhv JSON", description: "Format düzgün deyil. Vergülləri və mötərizələri yoxlayın.", variant: "destructive" })
                setSaving(false)
                return
            }

            // 1. Immediately cache in localStorage
            if (typeof window !== "undefined") {
                localStorage.setItem("testai_topics_" + topicKey, jsonText)
            }

            const res = await fetch('/api/admin/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: topicKey,
                    topics: dataToSave
                })
            })

            if (res.ok) {
                toast({ title: "Uğurlu! ✅", description: "Mövzular yadda saxlanıldı", className: "bg-green-600 text-white" })
            } else {
                toast({ title: "Yadda saxlanıldı (Lokal) ✅", description: "Mövzular brauzerdə uğurla saxlanıldı" })
            }
        } catch (err) {
            toast({ title: "Yadda saxlanıldı (Lokal) ✅", description: "Mövzular brauzerdə saxlanıldı" })
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
                {/* Left: Cascading Selectors */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Seçim</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Class Selector */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Sinif</label>
                            <Select onValueChange={setSelectedClass} value={selectedClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sinif seçin..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(c => (
                                        <SelectItem key={c} value={c.toString()}>{c}-ci sinif</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Subject Selector */}
                        {selectedClass && (
                            <div>
                                <label className="text-sm font-medium mb-2 block">Fənn</label>
                                <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Fənn seçin..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableSubjects.map(s => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {selectedSubject && (
                            <div className="mt-4 p-4 bg-slate-100 rounded text-sm text-slate-600">
                                <strong>{selectedClass}-ci sinif</strong><br />
                                <strong>{selectedSubject}</strong><br />
                                Mövzuları sağ tərəfdə redaktə edin.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Right: Editor */}
                <Card className="md:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            {selectedSubject ? `${selectedSubject} (${selectedClass}-ci sinif)` : "Redaktor"}
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
                                Sol tərəfdən sinif və fənn seçin
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
