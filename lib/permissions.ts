export const ROLE_PERMISSIONS: { [key: string]: string[] } = {
  student: ["view_own_profile", "view_own_results", "take_test", "save_results", "view_own_analysis"],
  parent: [
    "view_own_profile",
    "link_student",
    "view_linked_students",
    "view_linked_student_results",
    "unlink_student",
    "view_student_analysis",
  ],
  teacher: [
    "view_own_profile",
    "link_student",
    "view_linked_students",
    "view_linked_student_results",
    "view_student_analysis",
    "create_test",
    "manage_tests",
    "view_class_analytics",
  ],
  director: [
    "view_own_profile",
    "manage_users",
    "view_all_students",
    "view_all_results",
    "view_school_analytics",
    "manage_teachers",
    "view_audit_logs",
    "system_settings",
    "manage_global_settings",
    "manage_ai_generation",
    "override_sharing_rules"
  ],
}

export function hasPermission(role: string, permission: string): boolean {
  const rolePerms = ROLE_PERMISSIONS[role] || []
  return rolePerms.includes(permission)
}

export function requirePermission(role: string, permission: string): boolean {
  return hasPermission(role, permission)
}
