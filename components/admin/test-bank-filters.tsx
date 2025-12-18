'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { subjectsByClass } from '@/lib/education-data'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

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

    // Derived state for available options
    const availableSubjects = selectedClass ? subjectsByClass[selectedClass] || [] : []

    // Update parent when local state changes
    useEffect(() => {
        onFilterChange({
            class: selectedClass || undefined,
            subject: selectedSubject || undefined
        })
    }, [selectedClass, selectedSubject, onFilterChange])

    const clearFilters = () => {
        setSelectedClass("")
        setSelectedSubject("")
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
                        setSelectedSubject("") // Reset subject when class changes
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
                        onValueChange={setSelectedSubject}
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

                {/* Placeholders for Textbook and Topic (Future Implementation) */}
                <div className="space-y-2 opacity-50 pointer-events-none">
                    <label className="text-sm font-medium">Dərslik (Tezliklə)</label>
                    <Select disabled>
                        <SelectTrigger>
                            <SelectValue placeholder="-" />
                        </SelectTrigger>
                    </Select>
                </div>

                <div className="space-y-2 opacity-50 pointer-events-none">
                    <label className="text-sm font-medium">Mövzu (Tezliklə)</label>
                    <Select disabled>
                        <SelectTrigger>
                            <SelectValue placeholder="-" />
                        </SelectTrigger>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}
