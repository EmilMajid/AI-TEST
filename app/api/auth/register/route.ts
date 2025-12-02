import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { userRegistrationSchema, parentRegistrationSchema } from "@/lib/validations"
import { generateAccessToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountType, ...restBody } = body

    // Validate data
    const validatedData =
      accountType === "student" ? userRegistrationSchema.parse(restBody) : parentRegistrationSchema.parse(restBody)

    // Check for demo mode
    const isDemoMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("demo") || process.env.NODE_ENV === "development"

    if (isDemoMode) {
      console.log("[Demo Mode] Mocking registration for:", validatedData.email)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate consistent ID
      const mockId = Date.now()

      // Generate valid JWT for demo
      const token = generateAccessToken({
        id: mockId,
        email: validatedData.email,
        accountType: accountType,
        role: accountType === "student" ? undefined : (validatedData as any).role
      })

      return NextResponse.json(
        {
          success: true,
          message: "Demo rejimində istifadəçi uğurla yaradıldı",
          user: {
            id: mockId,
            email: validatedData.email,
            accountType: accountType,
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            role: accountType === "student" ? undefined : (validatedData as any).role,
            class: accountType === "student" ? (validatedData as any).class : undefined,
            school: validatedData.school,
            birthDate: validatedData.birthDate,
          },
          session: {
            access_token: token,
            refresh_token: "demo-refresh-token",
            expires_in: 3600,
            token_type: "bearer",
            user: {
              id: mockId,
              email: validatedData.email,
            }
          }
        },
        { status: 201 },
      )
    }

    const supabase = await createClient()

    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", validatedData.email)
      .single()

    // In demo mode, we allow duplicate emails for testing multi-user login
    if (existingUser && !isDemoMode) {
      return NextResponse.json({ error: "Bu email ünvanı artıq qeydiyyatdan keçib" }, { status: 400 })
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true,
    })

    if (authError) {
      console.error("[v0] Auth creation error:", authError)
      return NextResponse.json({ error: authError.message || "Auth user yaradılması zamanı xəta" }, { status: 400 })
    }

    const profileData = {
      id: authData.user.id,
      email: validatedData.email,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      father_name: validatedData.fatherName,
      region: validatedData.region,
      school: validatedData.school,
      birth_date: validatedData.birthDate,
      account_type: accountType,
      class: accountType === "student" ? (validatedData as any).class : null,
      role: accountType === "student" ? null : (validatedData as any).role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { error: profileError } = await supabase.from("profiles").insert([profileData])

    if (profileError) {
      console.error("[v0] Profile creation error:", profileError)
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: profileError.message || "Profil yaradılması zamanı xəta" }, { status: 400 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "İstifadəçi uğurla yaradıldı",
        user: {
          id: authData.user.id,
          email: authData.user.email,
          accountType: accountType,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Registration error:", error)
    const message = error instanceof Error ? error.message : "Qeydiyyat zamanı xəta baş verdi"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
