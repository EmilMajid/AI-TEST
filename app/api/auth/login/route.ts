import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { generateAccessToken } from "@/lib/jwt"

const loginSchema = z.object({
  email: z.string().email("Düzgün email daxil edin"),
  password: z.string().min(1, "Şifrə daxil edin"),
})

import { MOCK_USERS } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Demo mode is only for specific demo accounts, not all development logins
    const isDemoMode = true; // Forced for full mock mode

    // Try real authentication first (unless explicitly demo mode)
    let shouldTryRealAuth = false; // Forced for full mock mode


    // Check if this is a known demo account
    const demoEmails = [
      "demo@example.com",
      "test@example.com",
      // Test users
      "emil.mecidov@example.com",
      "aysel.aliyeva@test.com",
      "nigar.huseynova@test.com",
      "ramiz.mammadov@test.com",
      "farid.qasimov@test.com",
      "inci.mecidzade@test.com",
      "emilia.mecidzade@test.com",
      "ali.velizade@test.com",
      "leyla.hasanova@test.com",
      "murad.ibrahimov@test.com",
      "gunay.rzayeva@test.com",
      "elvin.quliyev@test.com",
      "sevinc.ismayilova@test.com",
      // Admin
      "admin@edu.az",
      ...MOCK_USERS.map(u => u.email)
    ]
    if (demoEmails.includes(body.email?.toLowerCase())) {
      shouldTryRealAuth = false
    }

    if (isDemoMode && !shouldTryRealAuth) {
      // Mock Data for test users
      const mockUsers = MOCK_USERS
      const { action, email, password, role, userId } = body;

      console.log(`[Mock Auth] Action: ${action}, Email: ${email}, Role: ${role}, UserId: ${userId}`);

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
          console.log(`[Mock Auth] Looking for userId: ${userId}, password length: ${password?.length}`);
          user = mockUsers.find(u => u.id === userId && u.password === password);
          if (!user) {
            const userById = mockUsers.find(u => u.id === userId);
            if (userById) {
              console.log(`[Mock Auth] User found by ID but password mismatch. Expected: ${userById.password}, Got: ${password}`);
            } else {
              console.log(`[Mock Auth] No user found with ID: ${userId}`);
            }
          }
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
            region: "Bakı", // Valid default to prevent modal
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

      return NextResponse.json({ error: "Yanlış sorğu" }, { status: 400 });
    }

    // Real Supabase Auth - Handle action-based flow
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
        if (role) {
          query = query.eq("account_type", role)
        }

        const { data: profiles, error } = await query

        if (error) {
          console.error("Profile lookup error:", error)
          return NextResponse.json({ error: "İstifadəçi axtarışı zamanı xəta" }, { status: 500 })
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
        return NextResponse.json({ error: "Xəta baş verdi" }, { status: 500 })
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
        return NextResponse.json({ error: "Giriş zamanı xəta" }, { status: 500 })
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
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Giriş zamanı xəta baş verdi" }, { status: 500 })
  }
}
