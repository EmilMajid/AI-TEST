'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { subjectsByClass, getTextbooks } from '@/lib/education-data'
import { Button } from '@/components/ui/button'
import { X, Loader2 } from 'lucide-react'

export interface FilterState {
    class?: string
    subject?: string
    textbook?: string
    topic?: string
}

interface TestBankFiltersProps {
    onFilterChange: (filters: FilterState) => void
    className?: string
}

export function TestBankFilters({ onFilterChange, className }: TestBankFiltersProps) {
    const [selectedClass, setSelectedClass] = useState<string>("")
    const [selectedSubject, setSelectedSubject] = useState<string>("")
    const [selectedTextbook, setSelectedTextbook] = useState<string>("")
    const [selectedTopic, setSelectedTopic] = useState<string>("")

    // Data State
    const [textbookOptions, setTextbookOptions] = useState<any[]>([])
    const [topicOptions, setTopicOptions] = useState<string[]>([])
    const [loadingTopics, setLoadingTopics] = useState(false)
    const [allClassTopics, setAllClassTopics] = useState<Record<string, any[]>>({})

    // Derived state for available options
    const availableSubjects = selectedClass ? subjectsByClass[selectedClass] || [] : []

    // 1. Fetch Textbooks when Class or Subject changes
    useEffect(() => {
        if (selectedClass && selectedSubject) {
            const books = getTextbooks(selectedClass, selectedSubject)
            setTextbookOptions(books)
        } else {
            setTextbookOptions([])
        }
        // Don't auto-reset textbook here to allow controlled updates, 
        // but if subject changes, textbook usually becomes invalid.
    }, [selectedClass, selectedSubject])

    // 2. Fetch All Topics for the Class (Optimized: Fetch once per class change)
    useEffect(() => {
        async function fetchTopics() {
            if (!selectedClass) return
            setLoadingTopics(true)
            try {
                const res = await fetch(`/api/textbooks/topics?class=${selectedClass}`)
                const data = await res.json()
                if (data.success) {
                    setAllClassTopics(data.topics)
                }
            } catch (err) {
                console.error("Failed to fetch topics", err)
            } finally {
                setLoadingTopics(false)
            }
        }

        if (selectedClass) {
            fetchTopics()
        } else {
            setAllClassTopics({})
        }
    }, [selectedClass])

    // 3. Update Topic Options when Subject Changes
    useEffect(() => {
        if (selectedSubject && allClassTopics[selectedSubject]) {
            // Flatten the groups to get a simple list of topics
            // specific structure: TopicGroup[] -> { chapter, topics: Topic[] }
            const groups = allClassTopics[selectedSubject]
            const flatTopics = groups.flatMap((g: any) => g.topics.map((t: any) => t.title))
            setTopicOptions(flatTopics)
        } else {
            setTopicOptions([])
        }
    }, [selectedSubject, allClassTopics])

    // 4. Update Parent
    useEffect(() => {
        onFilterChange({
            class: selectedClass || undefined,
            subject: selectedSubject || undefined,
            textbook: selectedTextbook || undefined,
            topic: selectedTopic || undefined
        })
    }, [selectedClass, selectedSubject, selectedTextbook, selectedTopic, onFilterChange])

    const clearFilters = () => {
        setSelectedClass("")
        setSelectedSubject("")
        setSelectedTextbook("")
        setSelectedTopic("")
    }

    return (
        <Card className={className}>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Filtrlər</CardTitle>
                {(selectedClass || selectedSubject) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-slate-500">
                        <X className="h-4 w-4 mr-2" />
                        Təmizlə
                    </Button>
                )}
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Class Selector */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Sinif</label>
                    <Select value={selectedClass} onValueChange={(val) => {
                        setSelectedClass(val)
                        setSelectedSubject("")
                        setSelectedTextbook("")
                        setSelectedTopic("")
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Bütün siniflər" />
                        </SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(c => (
                                <SelectItem key={c} value={c.toString()}>{c}-ci sinif</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Subject Selector */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Fənn</label>
                    <Select
                        value={selectedSubject}
                        onValueChange={(val) => {
                            setSelectedSubject(val)
                            setSelectedTextbook("")
                            setSelectedTopic("")
                        }}
                        disabled={!selectedClass}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={selectedClass ? "Bütün fənlər" : "Əvvəlcə sinif seçin"} />
                        </SelectTrigger>
                        <SelectContent>
                            {availableSubjects.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Textbook Selector */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Dərslik</label>
                    <Select
                        value={selectedTextbook}
                        onValueChange={setSelectedTextbook}
                        disabled={!selectedSubject || textbookOptions.length === 0}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={
                                !selectedSubject ? "-" :
                                    textbookOptions.length === 0 ? "Tapılmadı" :
                                        "Dərslik seçin"
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            {textbookOptions.map(t => (
                                <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Topic Selector */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center justify-between">
                        Mövzu
                        {loadingTopics && <Loader2 className="h-3 w-3 animate-spin text-slate-400" />}
                    </label>
                    <Select
                        value={selectedTopic}
                        onValueChange={setSelectedTopic}
                        disabled={!selectedSubject || topicOptions.length === 0}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={
                                !selectedSubject ? "-" :
                                    loadingTopics ? "Yüklənir..." :
                                        topicOptions.length === 0 ? "Mövzu yoxdur" :
                                            "Mövzu seçin"
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            {topicOptions.map((t, i) => (
                                <SelectItem key={`${t}-${i}`} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}
