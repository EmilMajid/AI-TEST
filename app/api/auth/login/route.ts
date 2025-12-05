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

    // Check if we should use demo mode (development OR invalid/missing Supabase config)
    const isDemoMode =
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo")

    if (isDemoMode) {
      console.log("[Demo Mode] Using mock authentication - no Supabase connection")
      // Mock Data for testing - all passwords are "test123"
      const mockUsers = [
        // Parents
        {
          id: "parent-1",
          email: "emil.mecidov@example.com",
          password: "test123",
          accountType: "parent",
          firstName: "Emil",
          lastName: "Məcidov",
          fatherName: "Hacıağa",
          school: "161 saylı məktəb",
          region: "Bakı",
          role: "parent",
        },
        {
          id: "parent-2",
          email: "aysel.aliyeva@test.com",
          password: "test123",
          accountType: "parent",
          firstName: "Aysel",
          lastName: "Əliyeva",
          fatherName: "Əli",
          school: "23 saylı məktəb",
          region: "Gəncə",
          role: "parent",
        },
        // Teachers
        {
          id: "teacher-1",
          email: "nigar.huseynova@test.com",
          password: "test123",
          accountType: "parent",
          firstName: "Nigar",
          lastName: "Hüseynova",
          fatherName: "Hüseyn",
          school: "161 saylı məktəb",
          region: "Bakı",
          role: "teacher",
        },
        {
          id: "teacher-2",
          email: "ramiz.mammadov@test.com",
          password: "test123",
          accountType: "parent",
          firstName: "Ramiz",
          lastName: "Məmmədov",
          fatherName: "Məmməd",
          school: "45 saylı məktəb",
          region: "Sumqayıt",
          role: "teacher",
        },
        // Directors
        {
          id: "director-1",
          email: "farid.qasimov@test.com",
          password: "test123",
          accountType: "parent",
          firstName: "Farid",
          lastName: "Qasımov",
          fatherName: "Qasım",
          school: "161 saylı məktəb",
          region: "Bakı",
          role: "director",
        },
        // Students
        {
          id: "student-1",
          email: "inci.mecidzade@test.com",
          password: "test123",
          accountType: "student",
          firstName: "İnci",
          lastName: "Məcidzadə",
          fatherName: "Emil",
          school: "161 saylı məktəb",
          class: "6",
          region: "Bakı",
          role: "student",
        },
        {
          id: "student-2",
          email: "emilia.mecidzade@test.com",
          password: "test123",
          accountType: "student",
          firstName: "Emilia",
          lastName: "Məcidzadə",
          fatherName: "Emil",
          school: "161 saylı məktəb",
          class: "2",
          region: "Bakı",
          role: "student",
        },
        {
          id: "student-3",
          email: "ali.velizade@test.com",
          password: "test123",
          accountType: "student",
          firstName: "Əli",
          lastName: "Vəlizadə",
          fatherName: "Vəli",
          school: "161 saylı məktəb",
          class: "8",
          region: "Bakı",
          role: "student",
        },
        {
          id: "student-4",
          email: "leyla.hasanova@test.com",
          password: "test123",
          accountType: "student",
          firstName: "Leyla",
          lastName: "Həsənova",
          fatherName: "Həsən",
          school: "23 saylı məktəb",
          class: "9",
          region: "Gəncə",
          role: "student",
        },
        {
          id: "student-5",
          email: "murad.ibrahimov@test.com",
          password: "test123",
          accountType: "student",
          firstName: "Murad",
          lastName: "İbrahimov",
          fatherName: "İbrahim",
          school: "45 saylı məktəb",
          class: "10",
          region: "Sumqayıt",
          role: "student",
        },
        {
          id: "student-6",
          email: "gunay.rzayeva@test.com",
          password: "test123",
          accountType: "student",
          firstName: "Günay",
          lastName: "Rzayeva",
          fatherName: "Rza",
          school: "12 saylı məktəb",
          class: "7",
          region: "Şəki",
          role: "student",
        },
        {
          id: "student-7",
          email: "elvin.quliyev@test.com",
          password: "test123",
          accountType: "student",
          firstName: "Elvin",
          lastName: "Quliyev",
          fatherName: "Qulu",
          school: "34 saylı məktəb",
          class: "11",
          region: "Mingəçevir",
          role: "student",
        },
        {
          id: "student-8",
          email: "sevinc.ismayilova@test.com",
          password: "test123",
          accountType: "student",
          firstName: "Sevinc",
          lastName: "İsmayılova",
          fatherName: "İsmayıl",
          school: "5 saylı məktəb",
          class: "8",
          region: "Lənkəran",
          role: "student",
        },
      ];

      const { action, email, password, role, userId } = body;

      console.log(`[Demo Auth] Action: ${action}, Email: ${email}, Role: ${role}, UserId: ${userId}`);

      // ACTION: LOOKUP
      if (action === "lookup") {
        // Filter users by email and role (if provided)
        // Note: In a real app, we might just look up by email, but here we want to support the specific flow
        let foundUsers = mockUsers.filter(u => u.email.toLowerCase() === email.toLowerCase());

        if (role) {
          // For mock users, we can just filter by role property as we set it for everyone
          foundUsers = foundUsers.filter(u => u.role === role);
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
            region: "Bakı",
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
            region: user.region,
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

    // Real Supabase Auth - Handle action-based flow
    // Try to connect to Supabase, fall back to demo mode if unavailable
    try {
      const supabase = await createClient()
      const { action, email, password, role, userId } = body

      // ACTION: LOOKUP
      if (action === "lookup") {
        try {
          // Query profiles table for users with this email
          let query = supabase
            .from("profiles")
            .select("id, email, first_name, last_name, father_name, account_type, school, class, role, region")
            .eq("email", email.toLowerCase())

          // Filter by role if provided
          // Filter by role if provided
          if (role) {
            if (role === 'student') {
              query = query.eq("account_type", "student")
            } else {
              // For parent, teacher, director - check the role column
              query = query.eq("role", role)
            }
          }

          const { data: profiles, error } = await query

          if (error) {
            console.error("Profile lookup error:", error)
            throw error // Will trigger demo mode fallback
          }

          if (!profiles || profiles.length === 0) {
            return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 })
          }

          return NextResponse.json({
            success: true,
            users: profiles.map(p => ({
              id: p.id,
              firstName: p.first_name,
              lastName: p.last_name,
              fatherName: p.father_name,
              accountType: p.account_type,
              school: p.school,
              class: p.class,
              region: p.region,
              role: p.role
            }))
          })
        } catch (err) {
          console.error("Lookup error:", err)
          throw err // Will trigger demo mode fallback
        }
      }

      // ACTION: LOGIN
      if (action === "login") {
        try {
          // Validate credentials with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (authError) {
            return NextResponse.json({ error: "Email və ya şifrə səhvdir" }, { status: 401 })
          }

          // Get user profile
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id, email, first_name, last_name, father_name, account_type, school, class, role, region")
            .eq("id", userId || authData.user.id)
            .single()

          if (profileError || !profile) {
            console.error("Profile fetch error:", profileError)
            return NextResponse.json({ error: "Profil məlumatları tapılmadı" }, { status: 404 })
          }

          return NextResponse.json({
            success: true,
            message: "Uğurlu giriş",
            user: {
              id: profile.id,
              email: profile.email,
              accountType: profile.account_type,
              firstName: profile.first_name,
              lastName: profile.last_name,
              fatherName: profile.father_name,
              school: profile.school,
              class: profile.class,
              role: profile.role,
              region: profile.region,
            },
            session: authData.session,
          })
        } catch (err) {
          console.error("Login error:", err)
          throw err // Will trigger demo mode fallback
        }
      }

      // Fallback for old-style direct login (no action specified)
      if (!action && email && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          return NextResponse.json({ error: "Email və ya şifrə səhvdir" }, { status: 401 })
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("account_type, first_name, last_name, father_name, school, class, role, region")
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
            fatherName: profile?.father_name,
            school: profile?.school,
            class: profile?.class,
            role: profile?.role,
            region: profile?.region,
          },
          session: data.session,
        })
      }

      return NextResponse.json({ error: "Yanlış sorğu" }, { status: 400 })
    } catch (supabaseError) {
      // Supabase connection failed - fall back to demo mode
      console.log("[Demo Mode] Supabase unavailable, using demo mode:", supabaseError)

      const { action, email, password, role, userId } = body
      // Same mock users as above - all passwords are "test123"
      const mockUsers = [
        {
          id: "parent-1",
          email: "emil.mecidov@example.com",
          password: "test123",
          accountType: "parent",
          firstName: "Emil",
          lastName: "Məcidov",
          fatherName: "Hacıağa",
          school: "161 saylı məktəb",
          region: "Bakı",
          role: "parent",
        },
        {
          id: "parent-2",
          email: "aysel.aliyeva@test.com",
          password: "test123",
          accountType: "parent",
          firstName: "Aysel",
          lastName: "Əliyeva",
          fatherName: "Əli",
          school: "23 saylı məktəb",
          region: "Gəncə",
          role: "parent",
        },
        {
          id: "teacher-1",
          email: "nigar.huseynova@test.com",
          password: "test123",
          accountType: "parent",
          firstName: "Nigar",
          lastName: "Hüseynova",
          fatherName: "Hüseyn",
          school: "161 saylı məktəb",
          region: "Bakı",
          role: "teacher",
        },
        {
          id: "teacher-2",
          email: "ramiz.mammadov@test.com",
          password: "test123",
          accountType: "parent",
          firstName: "Ramiz",
          lastName: "Məmmədov",
          fatherName: "Məmməd",
          school: "45 saylı məktəb",
          region: "Sumqayıt",
          role: "teacher",
        },
        {
          id: "director-1",
          email: "farid.qasimov@test.com",
          password: "test123",
          accountType: "parent",
          firstName: "Farid",
          lastName: "Qasımov",
          fatherName: "Qasım",
          school: "161 saylı məktəb",
          region: "Bakı",
          role: "director",
        },
        {
          id: "student-1",
          email: "inci.mecidzade@test.com",
          password: "test123",
          accountType: "student",
          firstName: "İnci",
          lastName: "Məcidzadə",
          fatherName: "Emil",
          school: "161 saylı məktəb",
          class: "6",
          region: "Bakı",
          role: "student",
        },
        {
          id: "student-2",
          email: "emilia.mecidzade@test.com",
          password: "test123",
          accountType: "student",
          firstName: "Emilia",
          lastName: "Məcidzadə",
          fatherName: "Emil",
          school: "161 saylı məktəb",
          class: "2",
          region: "Bakı",
          role: "student",
        },
        {
          id: "student-3",
          email: "ali.velizade@test.com",
          password: "test123",
          accountType: "student",
          firstName: "Əli",
          lastName: "Vəlizadə",
          fatherName: "Vəli",
          school: "161 saylı məktəb",
          class: "8",
          region: "Bakı",
          role: "student",
        },
        {
          id: "student-4",
          email: "leyla.hasanova@test.com",
          password: "test123",
          accountType: "student",
          firstName: "Leyla",
          lastName: "Həsənova",
          fatherName: "Həsən",
          school: "23 saylı məktəb",
          class: "9",
          region: "Gəncə",
          role: "student",
        },
        {
          id: "student-5",
          email: "murad.ibrahimov@test.com",
          password: "test123",
          accountType: "student",
          firstName: "Murad",
          lastName: "İbrahimov",
          fatherName: "İbrahim",
          school: "45 saylı məktəb",
          class: "10",
          region: "Sumqayıt",
          role: "student",
        },
        {
          id: "student-6",
          email: "gunay.rzayeva@test.com",
          password: "test123",
          accountType: "student",
          firstName: "Günay",
          lastName: "Rzayeva",
          fatherName: "Rza",
          school: "12 saylı məktəb",
          class: "7",
          region: "Şəki",
          role: "student",
        },
        {
          id: "student-7",
          email: "elvin.quliyev@test.com",
          password: "test123",
          accountType: "student",
          firstName: "Elvin",
          lastName: "Quliyev",
          fatherName: "Qulu",
          school: "34 saylı məktəb",
          class: "11",
          region: "Mingəçevir",
          role: "student",
        },
        {
          id: "student-8",
          email: "sevinc.ismayilova@test.com",
          password: "test123",
          accountType: "student",
          firstName: "Sevinc",
          lastName: "İsmayılova",
          fatherName: "İsmayıl",
          school: "5 saylı məktəb",
          class: "8",
          region: "Lənkəran",
          role: "student",
        },
      ]

      // ACTION: LOOKUP (Demo)
      if (action === "lookup") {
        console.log("[Demo Lookup] Email:", email, "Role:", role)
        let foundUsers = mockUsers.filter(u => u.email.toLowerCase() === email.toLowerCase())
        console.log("[Demo Lookup] Users with email:", foundUsers.length)
        if (role) {
          // For mock users, we can just filter by role property as we set it for everyone
          foundUsers = foundUsers.filter(u => u.role === role)
          console.log("[Demo Lookup] Users after role filter:", foundUsers.length)
        }

        if (foundUsers.length === 0) {
          // Create a generic demo user
          return NextResponse.json({
            success: true,
            users: [{
              id: "demo-" + Date.now(),
              firstName: "Demo",
              lastName: "İstifadəçi",
              accountType: role || "student",
              email: email,
              school: "Demo Məktəb",
              class: "8",
              region: "Bakı"
            }]
          })
        }

        console.log("[Demo Lookup] Returning users:", foundUsers.map(u => u.email + " - " + u.role))
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
        })
      }

      // ACTION: LOGIN (Demo)
      if (action === "login") {
        console.log("[Demo Login] UserId:", userId, "Password provided:", !!password)
        let user = mockUsers.find(u => u.id === userId && u.password === password)
        console.log("[Demo Login] User found:", !!user)

        if (!user && password) {
          console.log("[Demo Login] No user found, creating fallback demo user")
          // Generic demo user fallback
          const fallbackRole = role || "student"
          user = {
            id: "demo-user-" + Date.now(),
            email: email,
            accountType: fallbackRole,
            firstName: "Demo",
            lastName: "İstifadəçi",
            fatherName: "Demo",
            school: "Demo Məktəb",
            class: "8",
            region: "Bakı",
            role: fallbackRole,
            password: password,
          }
        }

        if (!user) {
          console.log("[Demo Login] No user after fallback, returning error")
          return NextResponse.json({ error: "Şifrə yanlışdır" }, { status: 401 })
        }

        const token = generateAccessToken({
          id: Number(user.id.replace(/\D/g, '')) || 123,
          email: user.email,
          accountType: user.accountType,
          role: user.role || undefined
        })

        console.log("[Demo Login] Returning successful login for:", user.email)
        return NextResponse.json({
          success: true,
          message: "Demo rejimində uğurlu giriş",
          user: {
            id: user.id,
            email: user.email,
            accountType: user.accountType,
            firstName: user.firstName,
            lastName: user.lastName,
            fatherName: user.fatherName,
            school: user.school,
            class: user.class,
            role: user.role,
            region: user.region,
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

      console.log("[Demo Mode] Invalid action:", action)
      return NextResponse.json({ error: "Yanlış sorğu" }, { status: 400 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Giriş zamanı xəta baş verdi" }, { status: 500 })
  }
}
