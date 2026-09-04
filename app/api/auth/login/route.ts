export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { generateAccessToken } from "@/lib/jwt"
import { getUserUniqueId } from "@/lib/profile-utils"

const loginSchema = z.object({
  email: z.string().min(1, "E-mail və ya Şagird ID daxil edin"),
  password: z.string().min(1, "Şifrə daxil edin"),
})

import { MOCK_USERS } from "@/lib/mock-data"
import { getAllUsers, saveUser, findUsers, StoredUser } from "@/lib/user-store"

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
      const { action, email, password, role, userId, clientUser } = body;

      // If client supplied user data from browser storage, save it immediately
      if (clientUser && clientUser.email) {
        saveUser(clientUser);
      }

      console.log(`[Auth] Action: ${action}, Email: ${email}, Role: ${role}, UserId: ${userId}`);

      // Helper to generate a respectable name from email if needed
      const parseNameFromEmail = (rawEmail: string) => {
        const username = rawEmail.split('@')[0].replace(/[0-9]/g, '');
        const parts = username.split(/[._-]/).filter(Boolean);
        if (parts.length >= 2) {
          const last = parts[parts.length - 1];
          const first = parts.slice(0, -1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
          return {
            firstName: first,
            lastName: last.charAt(0).toUpperCase() + last.slice(1)
          };
        } else if (parts.length === 1) {
          return {
            firstName: parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
            lastName: "İstifadəçi"
          };
        }
        return { firstName: "İstifadəçi", lastName: "" };
      };

      // ACTION: LOOKUP
      if (action === "lookup") {
        const cleanLookupEmail = (email || "").trim().toLowerCase();
        if (cleanLookupEmail === "r.h.rzayev@gmail.com") {
          return NextResponse.json({
            success: true,
            users: [{
              id: "parent-rzayev",
              firstName: "R.",
              lastName: "Rzayev",
              fatherName: "H.",
              accountType: "parent",
              role: "parent",
              email: "r.h.rzayev@gmail.com",
              school: "161 saylı məktəb",
              region: "Bakı",
            }],
          });
        }

        let foundUsers = findUsers({ emailOrId: email, role });

        // If no users found, create and persist an account with proper role and name
        if (foundUsers.length === 0 && isDemoMode) {
          const parsedName = parseNameFromEmail(email || "");
          const effectiveRole = role || "parent";
          
          const autoUser: StoredUser = {
            id: "user-" + Date.now(),
            firstName: parsedName.firstName,
            lastName: parsedName.lastName,
            fatherName: "",
            school: effectiveRole === "student" ? "161 saylı məktəb" : "Bakı şəhəri",
            class: effectiveRole === "student" ? "8" : undefined,
            region: "Bakı",
            accountType: effectiveRole,
            role: effectiveRole,
            email: email
          };
          saveUser(autoUser);

          return NextResponse.json({
            success: true,
            users: [{
              id: autoUser.id,
              firstName: autoUser.firstName,
              lastName: autoUser.lastName,
              accountType: autoUser.accountType,
              role: autoUser.role,
              email: autoUser.email,
              school: autoUser.school
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
            role: u.role || u.accountType,
            school: u.school,
            class: u.class,
            region: u.region,
            email: u.email
          }))
        });
      }

      // ACTION: LOGIN
      if (action === "login") {
        const users = getAllUsers();
        const cleanInput = (email || "").trim().toLowerCase();
        const cleanId = cleanInput.startsWith("@") ? cleanInput : `@${cleanInput}`;

        let user = null;

        if (cleanInput === "r.h.rzayev@gmail.com" || userId === "parent-rzayev") {
          user = {
            id: "parent-rzayev",
            email: "r.h.rzayev@gmail.com",
            accountType: "parent",
            role: "parent",
            firstName: "R.",
            lastName: "Rzayev",
            fatherName: "H.",
            school: "161 saylı məktəb",
            region: "Bakı",
          };
          saveUser(user);
        }

        if (!user && userId) {
          user = users.find(u => String(u.id) === String(userId));
        }
        if (!user && cleanInput) {
          user = users.find(u => u.email && u.email.toLowerCase() === cleanInput) ||
                 users.find(u => {
                   const uId = getUserUniqueId(u).toLowerCase();
                   return uId === cleanId || uId.replace("@", "") === cleanInput.replace("@", "");
                 });
        }

        // If user not found, check clientUser or create an account with proper role and parsed name
        if (!user && isDemoMode) {
          if (clientUser && clientUser.email) {
            user = saveUser(clientUser);
          } else {
            const parsedName = parseNameFromEmail(email || "");
            const effectiveRole = role || "parent";
            user = saveUser({
              id: "user-" + Date.now(),
              email: email,
              accountType: effectiveRole,
              role: effectiveRole,
              firstName: parsedName.firstName,
              lastName: parsedName.lastName,
              school: effectiveRole === "student" ? "161 saylı məktəb" : "Bakı şəhəri",
              class: effectiveRole === "student" ? "8" : undefined,
              region: "Bakı",
            });
          }
        }

        if (!user) {
          return NextResponse.json({ error: "Şifrə yanlışdır" }, { status: 401 });
        }

        // Generate valid JWT
        const numericId = typeof user.id === "number" ? user.id : (Number(String(user.id).replace(/\D/g, '')) || Date.now());
        const token = generateAccessToken({
          id: numericId,
          email: user.email,
          accountType: user.accountType,
          role: user.role || undefined
        });

        return NextResponse.json({
          success: true,
          message: "Uğurlu giriş",
          user: {
            id: user.id,
            email: user.email,
            accountType: user.accountType,
            firstName: user.firstName,
            lastName: user.lastName,
            fatherName: user.fatherName,
            school: user.school,
            class: user.class,
            role: user.role || user.accountType,
            region: user.region || "Bakı",
          },
          session: {
            access_token: token,
            refresh_token: "demo-refresh-token",
            expires_in: 3600 * 24 * 7,
            token_type: "bearer",
            user: {
              id: user.id,
              email: user.email,
            }
          },
        });
      }

      return NextResponse.json({ error: "Yanlış sorğu" }, { status: 400 });
    }

    // Real Supabase Auth - Handle action-based flow
    const supabase = await createClient()
    const { action, email, password, role, userId } = body

    // ACTION: LOOKUP
    if (action === "lookup") {
      try {
        const cleanInput = (email || "").trim().toLowerCase()
        const cleanId = cleanInput.startsWith("@") ? cleanInput : `@${cleanInput}`

        let query = supabase
          .from("profiles")
          .select("id, email, first_name, last_name, father_name, account_type, school, class, role, region")

        // Filter by role if provided
        if (role) {
          query = query.eq("account_type", role)
        }

        const { data: profiles, error } = await query

        if (error) {
          console.error("Profile lookup error:", error)
          return NextResponse.json({ error: "İstifadəçi axtarışı zamanı xəta" }, { status: 500 })
        }

        const matchedProfiles = (profiles || []).filter(p => {
          if (p.email && p.email.toLowerCase() === cleanInput) return true
          const pId = getUserUniqueId({
            id: p.id,
            firstName: p.first_name,
            lastName: p.last_name,
            school: p.school,
            class: p.class,
            accountType: p.account_type,
            role: p.role
          }).toLowerCase()
          return pId === cleanId || pId.replace("@", "") === cleanInput.replace("@", "")
        })

        if (!matchedProfiles || matchedProfiles.length === 0) {
          return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          users: matchedProfiles.map(p => ({
            id: p.id,
            firstName: p.first_name,
            lastName: p.last_name,
            fatherName: p.father_name,
            accountType: p.account_type,
            school: p.school,
            class: p.class,
            region: p.region,
            role: p.role,
            email: p.email
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
        let loginEmail = email
        if (userId) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", userId)
            .single()
          if (profile?.email) {
            loginEmail = profile.email
          }
        }

        // Validate credentials with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: loginEmail,
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
