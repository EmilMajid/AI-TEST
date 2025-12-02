'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Upload, File, Trash2, Loader2 } from 'lucide-react'

interface PDFDocument {
  id: string
  name: string
  uploadedAt: string
  size: number
}

export function PDFManager() {
  const { toast } = useToast()
  const [files, setFiles] = useState<PDFDocument[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/rag/ingest', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      
      setFiles(prev => [...prev, {
        id: data.data?.id || Date.now().toString(),
        name: selectedFile.name,
        uploadedAt: new Date().toISOString(),
        size: selectedFile.size,
      }])

      setSelectedFile(null)
      toast({
        title: 'Uğurlu',
        description: 'Dərslik yükləndi',
      })
    } catch (error) {
      toast({
        title: 'Xəta',
        description: 'Yüklənmə uğursuz oldu',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Delete failed')

      setFiles(prev => prev.filter(f => f.id !== id))
      toast({
        title: 'Silindi',
        description: 'Dərslik silindi',
      })
    } catch (error) {
      toast({
        title: 'Xəta',
        description: 'Silmə uğursuz oldu',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Dərsliklərim
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>PDF Faylı Seç</Label>
          <Input
            type="file"
            accept=".pdf"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            disabled={uploading}
          />
        </div>

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Yüklənir...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Yüklə
            </>
          )}
        </Button>

        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Yüklənmiş Dərsiklər ({files.length})</h4>
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(file.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
