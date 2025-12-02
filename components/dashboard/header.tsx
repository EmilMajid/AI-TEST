"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function DashboardHeader({ profile }: any) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div>
          <h1 className="text-2xl font-bold">
            {profile.account_type === "student" ? "Tələbə Paneli" : "Valideyn Paneli"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {profile.first_name} {profile.last_name}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Çıxış
        </Button>
      </div>
    </header>
  )
}
