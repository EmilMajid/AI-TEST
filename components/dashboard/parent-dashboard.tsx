"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Plus } from "lucide-react"

export function ParentDashboard({ userId, profile }: any) {
  const [linkedStudents, setLinkedStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchLinkedStudents()
  }, [])

  async function fetchLinkedStudents() {
    const { data } = await supabase
      .from("parent_student_links")
      .select(`
        *,
        student_id: profiles!parent_student_links_student_id_fkey(
          id,
          first_name,
          last_name,
          class
        )
      `)
      .eq("parent_id", userId)
      .eq("status", "active")

    if (data) {
      setLinkedStudents(data)
    }
    setLoading(false)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold">Bağlı Tələbələr</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tələbə Əlavə Et
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {linkedStudents.map((link) => (
          <Card key={link.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {link.student_id?.first_name} {link.student_id?.last_name}
              </CardTitle>
              <CardDescription>{link.student_id?.class}. Sinif</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Nəticələri Gör
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {linkedStudents.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">Hələ heç bir tələbə əlavə edilməyib</p>
            <Button>Tələbə Əlavə Et</Button>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
