"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { regionSymbols, type RegionInfo } from "@/lib/region-symbols"
import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"

interface RegionModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (region: string) => void
}

export function RegionModal({ isOpen, onClose, onSelect }: RegionModalProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredRegions, setFilteredRegions] = useState<RegionInfo[]>([])

    useEffect(() => {
        const regions = Object.values(regionSymbols)
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            setFilteredRegions(
                regions.filter((r) => r.name.toLowerCase().includes(query))
            )
        } else {
            setFilteredRegions(regions)
        }
    }, [searchQuery])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <MapPin className="h-6 w-6 text-primary" />
                        Regionunuzu Seçin
                    </DialogTitle>
                    <DialogDescription>
                        Zəhmət olmasa, yaşadığınız və ya təhsil aldığınız regionu seçin. Bu məlumat sizə daha uyğun məzmun təqdim etmək üçün istifadə olunacaq.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 border-b">
                    <input
                        type="text"
                        placeholder="Region axtar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredRegions.map((region) => (
                            <button
                                key={region.name}
                                onClick={() => onSelect(region.name)}
                                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                            >
                                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                    {region.symbol}
                                </span>
                                <span className="font-medium text-gray-900 text-center">{region.name}</span>
                                <span className="text-xs text-gray-500 text-center mt-1">{region.description}</span>
                            </button>
                        ))}
                    </div>

                    {filteredRegions.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            Heç bir region tapılmadı
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
