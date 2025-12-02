'use server'

import { createClient } from "@/lib/supabase/server"
import type { User } from "@supabase/supabase-js"

export interface UserScope {
  userId: string
  accountType: 'student' | 'parent' | 'teacher' | 'director'
  permissions: string[]
}

export async function getUserScope(user: User): Promise<UserScope> {
  const supabase = await createClient()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('account_type, role')
    .eq('id', user.id)
    .single()

  if (error) throw new Error('Failed to fetch user profile')

  const accountType = profile.account_type as 'student' | 'parent' | 'teacher' | 'director'
  const permissions = getPermissions(accountType, profile.role)

  return {
    userId: user.id,
    accountType,
    permissions,
  }
}

function getPermissions(accountType: string, role?: string): string[] {
  const basePermissions = {
    student: ['view_own_results', 'take_tests', 'view_own_pdfs'],
    parent: ['view_child_results', 'manage_children', 'upload_pdfs'],
    teacher: ['view_student_results', 'manage_tests', 'upload_pdfs', 'view_analytics'],
    director: ['view_all_results', 'manage_system', 'manage_teachers', 'view_analytics'],
  }

  return basePermissions[accountType as keyof typeof basePermissions] || []
}
