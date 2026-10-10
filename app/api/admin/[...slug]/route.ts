import { NextRequest, NextResponse } from "next/server"

import * as access_control from "@/lib/api-handlers/admin/access-control/route"
import * as analytics from "@/lib/api-handlers/admin/analytics/route"
import * as analytics_topic_stats from "@/lib/api-handlers/admin/analytics/topic-stats/route"
import * as antigravity_accounts from "@/lib/api-handlers/admin/antigravity/accounts/route"
import * as antigravity_orders from "@/lib/api-handlers/admin/antigravity/orders/route"
import * as antigravity_threshold_check from "@/lib/api-handlers/admin/antigravity/threshold-check/route"
import * as antigravity_validate_key from "@/lib/api-handlers/admin/antigravity/validate-key/route"
import * as audit_logs from "@/lib/api-handlers/admin/audit-logs/route"
import * as curriculum_options from "@/lib/api-handlers/admin/curriculum-options/route"
import * as curriculum_stats from "@/lib/api-handlers/admin/curriculum-stats/route"
import * as discussion_textbooks from "@/lib/api-handlers/admin/discussion-textbooks/route"
import * as discussion_textbooks_ingest from "@/lib/api-handlers/admin/discussion-textbooks/ingest/route"
import * as discussion_textbooks_promote from "@/lib/api-handlers/admin/discussion-textbooks/promote/route"
import * as discussion_textbooks_rollback from "@/lib/api-handlers/admin/discussion-textbooks/rollback/route"
import * as github_validate from "@/lib/api-handlers/admin/github/validate/route"
import * as global_settings from "@/lib/api-handlers/admin/global-settings/route"
import * as push_to_github from "@/lib/api-handlers/admin/push-to-github/route"
import * as test_bank_hierarchy from "@/lib/api-handlers/admin/test-bank/hierarchy/route"
import * as test_bank_questions from "@/lib/api-handlers/admin/test-bank/questions/route"
import * as test_bank_stats from "@/lib/api-handlers/admin/test-bank/stats/route"
import * as problem_reports from "@/lib/api-handlers/admin/test-bank/problem-reports/route"
import * as tests from "@/lib/api-handlers/admin/tests/route"
import * as topics from "@/lib/api-handlers/admin/topics/route"
import * as users from "@/lib/api-handlers/admin/users/route"
import * as users_id from "@/lib/api-handlers/admin/users/[id]/route"

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const path = slug.join("/")
  if (path === "access-control" && access_control.GET) return access_control.GET(req)
  if (path === "analytics" && analytics.GET) return analytics.GET(req)
  if (path === "analytics/topic-stats" && analytics_topic_stats.GET) return analytics_topic_stats.GET(req)
  if (path === "antigravity/accounts" && antigravity_accounts.GET) return antigravity_accounts.GET(req)
  if (path === "antigravity/orders" && antigravity_orders.GET) return antigravity_orders.GET(req)
  if (path === "audit-logs" && audit_logs.GET) return audit_logs.GET(req)
  if (path === "curriculum-options" && curriculum_options.GET) return curriculum_options.GET(req)
  if (path === "curriculum-stats" && curriculum_stats.GET) return curriculum_stats.GET(req)
  if (path === "discussion-textbooks" && discussion_textbooks.GET) return discussion_textbooks.GET(req)
  if (path === "global-settings" && global_settings.GET) return global_settings.GET(req)
  if (path === "test-bank/hierarchy" && test_bank_hierarchy.GET) return test_bank_hierarchy.GET(req)
  if (path === "test-bank/problem-reports" && problem_reports.GET) return problem_reports.GET()
  if (path === "test-bank/questions" && test_bank_questions.GET) return test_bank_questions.GET(req)
  if (path === "test-bank/stats" && test_bank_stats.GET) return test_bank_stats.GET(req)
  if (path === "tests" && tests.GET) return tests.GET(req)
  if (path === "topics" && topics.GET) return topics.GET(req)
  if (path === "users" && users.GET) return users.GET(req)
  if (slug.length === 2 && slug[0] === "users" && users_id.GET) return users_id.GET(req, { params: { id: slug[1] } })
  return NextResponse.json({ error: "Admin endpoint not found" }, { status: 404 })
}

export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const path = slug.join("/")
  if (path === "access-control" && access_control.POST) return access_control.POST(req)
  if (path === "antigravity/accounts" && antigravity_accounts.POST) return antigravity_accounts.POST(req)
  if (path === "antigravity/orders" && antigravity_orders.POST) return antigravity_orders.POST(req)
  if (path === "antigravity/threshold-check" && antigravity_threshold_check.POST) return antigravity_threshold_check.POST(req)
  if (path === "antigravity/validate-key" && antigravity_validate_key.POST) return antigravity_validate_key.POST(req)
  if (path === "discussion-textbooks" && discussion_textbooks.POST) return discussion_textbooks.POST(req)
  if (path === "discussion-textbooks/ingest" && discussion_textbooks_ingest.POST) return discussion_textbooks_ingest.POST(req)
  if (path === "discussion-textbooks/promote" && discussion_textbooks_promote.POST) return discussion_textbooks_promote.POST(req)
  if (path === "discussion-textbooks/rollback" && discussion_textbooks_rollback.POST) return discussion_textbooks_rollback.POST(req)
  if (path === "github/validate" && github_validate.POST) return github_validate.POST(req)
  if (path === "global-settings" && global_settings.POST) return global_settings.POST(req)
  if (path === "push-to-github" && push_to_github.POST) return push_to_github.POST(req)
  if (path === "test-bank/problem-reports" && problem_reports.POST) return problem_reports.POST(req)
  if (path === "topics" && topics.POST) return topics.POST(req)
  if (path === "users" && users.POST) return users.POST(req)
  return NextResponse.json({ error: "Admin endpoint not found" }, { status: 404 })
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const path = slug.join("/")

  return NextResponse.json({ error: "Admin endpoint not found" }, { status: 404 })
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const path = slug.join("/")
  if (path === "antigravity/orders" && antigravity_orders.DELETE) return antigravity_orders.DELETE(req)
  if (path === "users" && users.DELETE) return users.DELETE(req)
  if (slug.length === 2 && slug[0] === "users" && users_id.DELETE) return users_id.DELETE(req, { params: { id: slug[1] } })
  return NextResponse.json({ error: "Admin endpoint not found" }, { status: 404 })
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const path = slug.join("/")
  if (path === "users" && users.PATCH) return users.PATCH(req)
  if (slug.length === 2 && slug[0] === "users" && users_id.PATCH) return users_id.PATCH(req, { params: { id: slug[1] } })
  return NextResponse.json({ error: "Admin endpoint not found" }, { status: 404 })
}
