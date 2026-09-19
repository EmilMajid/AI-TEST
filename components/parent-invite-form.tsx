"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Loader2, XCircle } from "lucide-react"

interface Props {
  prefillEmail?: string
  relationshipHint?: string
  onClose: () => void
  onSuccess: () => void
}

export function ParentInviteForm({ prefillEmail, relationshipHint, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState(prefillEmail || "")
  const [rel, setRel] = useState<"father" | "mother" | "guardian" | "">(
    (relationshipHint as any) || ""
  )
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)
  const [step, setStep] = useState<1 | 2>(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rel) {
      setStatus({ ok: false, msg: "Əlaqə növü seçin" })
      return
    }
    setLoading(true)
    setStatus(null)
    try {
      const session = localStorage.getItem("session")
      const token = session ? JSON.parse(session).access_token : null
      const res = await fetch("/api/parent-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ parentEmail: email.trim(), relationshipType: rel }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus({ ok: true, msg: data.message || "Dəvət göndərildi!" })
        setStep(2)
        setTimeout(onSuccess, 2000)
      } else {
        setStatus({ ok: false, msg: data.error || "Xəta baş verdi" })
      }
    } catch (e: any) {
      setStatus({ ok: false, msg: e.message || "Şəbəkə xətası" })
    } finally {
      setLoading(false)
    }
  }

  if (step === 2) {
    return (
      <div className="text-center py-4">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <p className="font-semibold text-green-800">{status?.msg}</p>
        <p className="text-xs text-gray-500 mt-1">Valideyn 24 saat ərzində linki açmalıdır.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Valideynin emaili</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="valideyn@gmail.com"
          required
          disabled={loading}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Bu şəxs kimdir?</label>
        <div className="space-y-2">
          {(["father", "mother", "guardian"] as const).map((val) => (
            <label key={val} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="rel"
                value={val}
                checked={rel === val}
                onChange={() => setRel(val)}
                className="accent-blue-600"
              />
              {val === "father" ? "Atam" : val === "mother" ? "Anam" : "Qəyyumum / Qanuni Nümayəndəm"}
            </label>
          ))}
        </div>
      </div>

      {status && !status.ok && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs flex items-center gap-2">
          <XCircle className="h-4 w-4 shrink-0" />
          {status.msg}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex-1">
          Ləğv et
        </Button>
        <Button
          type="submit"
          disabled={loading || !rel}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Göndərilir...
            </>
          ) : (
            "Dəvət Göndər"
          )}
        </Button>
      </div>
    </form>
  )
}
