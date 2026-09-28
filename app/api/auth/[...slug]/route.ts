import { NextRequest, NextResponse } from "next/server"
import * as completeProfile from "@/lib/api-handlers/auth/complete-profile/route"
import * as google from "@/lib/api-handlers/auth/google/route"
import * as googleCallback from "@/lib/api-handlers/auth/google/callback/route"
import * as login from "@/lib/api-handlers/auth/login/route"
import * as profileWarning from "@/lib/api-handlers/auth/profile-warning/route"
import * as register from "@/lib/api-handlers/auth/register/route"
import * as setGrade from "@/lib/api-handlers/auth/set-grade/route"

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const path = (params.slug || []).join("/")
  if (path === "google" && google.GET) return google.GET(req)
  if (path === "google/callback" && googleCallback.GET) return googleCallback.GET(req)
  if (path === "profile-warning" && profileWarning.GET) return profileWarning.GET(req)
  return NextResponse.json({ error: "Auth endpoint not found" }, { status: 404 })
}

export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const path = (params.slug || []).join("/")
  if (path === "login" && login.POST) return login.POST(req)
  if (path === "register" && register.POST) return register.POST(req)
  if (path === "complete-profile" && completeProfile.POST) return completeProfile.POST(req)
  if (path === "profile-warning" && profileWarning.POST) return profileWarning.POST(req)
  if (path === "set-grade" && setGrade.POST) return setGrade.POST(req)
  return NextResponse.json({ error: "Auth endpoint not found" }, { status: 404 })
}
