"use client"

import { useState, useRef, ChangeEvent, DragEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { validateImageFile, fileToBase64, formatFileSize } from "@/lib/image-utils"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
    currentImage?: string
    onImageChange: (base64Image: string | null) => void
    onError?: (error: string) => void
    className?: string
}

export function ImageUpload({
    currentImage,
    onImageChange,
    onError,
    className
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | undefined>(currentImage)
    const [isDragging, setIsDragging] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFile = async (file: File) => {
        setIsProcessing(true)

        // Validate file
        const validation = validateImageFile(file)
        if (!validation.valid) {
            onError?.(validation.error || "Invalid file")
            setIsProcessing(false)
            return
        }

        try {
            // Convert to base64
            const base64 = await fileToBase64(file)
            setPreview(base64)
            onImageChange(base64)
        } catch (error) {
            onError?.("Şəkil yüklənərkən xəta baş verdi")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFile(file)
        }
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            handleFile(file)
        }
    }

    const handleRemove = () => {
        setPreview(undefined)
        onImageChange(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className={cn("space-y-4", className)}>
            <Card
                className={cn(
                    "border-2 border-dashed transition-colors cursor-pointer",
                    isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400",
                    isProcessing && "opacity-50 pointer-events-none"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <CardContent className="p-6">
                    {preview ? (
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemove()
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="rounded-full bg-primary/10 p-4 mb-4">
                                {isProcessing ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                                ) : (
                                    <Upload className="h-8 w-8 text-primary" />
                                )}
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                                Şəkil yükləyin
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                                Sürüyüb buraxın və ya klikləyin
                            </p>
                            <p className="text-xs text-gray-400">
                                JPG, PNG və ya WebP • Maksimum 2MB
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInput}
                className="hidden"
            />

            {preview && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>Şəkil yükləndi</span>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemove}
                        className="text-red-600 hover:text-red-700"
                    >
                        Sil
                    </Button>
                </div>
            )}
        </div>
    )
}
