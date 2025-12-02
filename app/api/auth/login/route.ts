import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { generateAccessToken } from "@/lib/jwt"

const loginSchema = z.object({
  email: z.string().email("Düzgün email daxil edin"),
  password: z.string().min(1, "Şifrə daxil edin"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check for demo mode
    const isDemoMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("demo") || process.env.NODE_ENV === "development"

    if (isDemoMode) {
      // Mock Data for the specific scenario
      const mockUsers = [
        {
          id: "parent-1",
          email: "emil.mecidov@example.com",
          password: "password123",
          accountType: "parent",
          firstName: "Emil",
          lastName: "Məcidov",
          fatherName: "Hacıağa",
          role: "parent",
        },
        {
          id: "student-1",
          email: "emil.mecidov@example.com",
          password: "password123",
          accountType: "student",
          firstName: "İnci",
          lastName: "Məcidzadə",
          fatherName: "Emil",
          school: "161 saylı məktəb",
          class: "6",
          region: "Bakı, Yasamal",
          role: "student",
        },
        {
          id: "student-2",
          email: "emil.mecidov@example.com",
          password: "password123",
          accountType: "student",
          firstName: "Emilia",
          lastName: "Məcidzadə",
          fatherName: "Emil",
          school: "161 saylı məktəb",
          class: "2",
          region: "Bakı, Yasamal",
          role: "student",
        },
        {
          id: "student-ali",
          email: "ali.velizade@example.com",
          password: "password123",
          accountType: "student",
          firstName: "Əli",
          lastName: "Vəlizadə",
          fatherName: "Vəli",
          school: "161 saylı məktəb",
          class: "8",
          region: "Bakı, Yasamal",
          role: "student",
        }
      ];

      const { action, email, password, role, userId } = body;

      console.log(`[Demo Auth] Action: ${action}, Email: ${email}, Role: ${role}, UserId: ${userId}`);

      // ACTION: LOOKUP
      if (action === "lookup") {
        // Filter users by email and role (if provided)
        // Note: In a real app, we might just look up by email, but here we want to support the specific flow
        let foundUsers = mockUsers.filter(u => u.email.toLowerCase() === email.toLowerCase());

        if (role) {
          foundUsers = foundUsers.filter(u => u.accountType === role);
        }

        // If no users found in mock list, but it's a generic demo login, create a dummy one
        if (foundUsers.length === 0 && isDemoMode) {
          return NextResponse.json({
            success: true,
            users: [{
              id: "demo-" + Date.now(),
              firstName: "Demo",
              lastName: "İstifadəçi",
              accountType: role || "student",
              email: email
            }]
          });
        }

        return NextResponse.json({
          success: true,
          users: foundUsers.map(u => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            fatherName: u.fatherName,
            accountType: u.accountType,
            school: u.school,
            class: u.class,
            region: u.region
          }))
        });
      }

      // ACTION: LOGIN
      if (action === "login") {
        let user;

        if (userId) {
          user = mockUsers.find(u => u.id === userId && u.password === password);
        } else {
          // Fallback for direct login (legacy or single user)
          user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
          // If multiple users exist for this email and no userId specified, default to the first one or fail? 
          // For safety, if multiple exist, we should require userId. But for generic demo, we allow it.
        }

        // Generic demo user fallback
        if (!user && isDemoMode && password) {
          const fallbackRole = role || "student"
          const isStudent = fallbackRole === "student"

          user = {
            id: "demo-user-" + Date.now(),
            email: email,
            accountType: fallbackRole,
            firstName: "Demo",
            lastName: "İstifadəçi",
            school: "Demo Məktəb",
            class: isStudent ? (email.includes("8") ? "8" : "11") : undefined,
            role: fallbackRole,
          }
        }

        if (!user) {
          return NextResponse.json({ error: "Şifrə yanlışdır" }, { status: 401 });
        }

        // Generate valid JWT for demo
        const token = generateAccessToken({
          id: Number(user.id.replace(/\D/g, '')) || 123, // Mock ID as number
          email: user.email,
          accountType: user.accountType,
          role: user.role || undefined
        })

        return NextResponse.json({
          success: true,
          message: "Demo rejimində uğurlu giriş",
          user: {
            id: user.id,
            email: user.email,
            accountType: user.accountType,
            firstName: user.firstName,
            lastName: user.lastName,
            school: user.school,
            class: user.class,
            role: user.role,
          },
          session: {
            access_token: token,
            refresh_token: "demo-refresh-token",
            expires_in: 3600,
            token_type: "bearer",
            user: {
              id: user.id,
              email: user.email,
            }
          },
        })
      }

      return NextResponse.json({ error: "Yanlış sorğu" }, { status: 400 });
    }

    // Real Supabase Auth (unchanged for now, as this feature is demo-focused)
    const supabase = await createClient()
    const { email, password } = loginSchema.parse(body) // Use schema only for direct login

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: "Email və ya şifrə səhvdir" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("account_type, first_name, last_name, school, class, role")
      .eq("id", data.user.id)
      .single()

    return NextResponse.json({
      success: true,
      message: "Uğurlu giriş",
      user: {
        id: data.user.id,
        email: data.user.email,
        accountType: profile?.account_type,
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        school: profile?.school,
        class: profile?.class,
        role: profile?.role,
      },
      session: data.session,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Giriş zamanı xəta baş verdi" }, { status: 500 })
  }
}
