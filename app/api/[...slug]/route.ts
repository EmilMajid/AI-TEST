import { NextRequest, NextResponse } from "next/server"

import * as analyze_test_results from "@/lib/api-handlers/analyze-test-results/route"
import * as check_api_status from "@/lib/api-handlers/check-api-status/route"
import * as documents_id from "@/lib/api-handlers/documents/[id]/route"
import * as messages from "@/lib/api-handlers/messages/route"
import * as notifications_send_report from "@/lib/api-handlers/notifications/send-report/route"
import * as notifications_send_result from "@/lib/api-handlers/notifications/send-result/route"
import * as parent_invite from "@/lib/api-handlers/parent-invite/route"
import * as parent_invite_warn from "@/lib/api-handlers/parent-invite/warn/route"
import * as production_metrics from "@/lib/api-handlers/production-metrics/route"
import * as regional_metrics from "@/lib/api-handlers/regional-metrics/route"
import * as save_results from "@/lib/api-handlers/save-results/route"
import * as save_test_result from "@/lib/api-handlers/save-test-result/route"
import * as search from "@/lib/api-handlers/search/route"
import * as students_link from "@/lib/api-handlers/students/link/route"
import * as students_results from "@/lib/api-handlers/students/results/route"
import * as textbooks from "@/lib/api-handlers/textbooks/route"
import * as textbooks_topics from "@/lib/api-handlers/textbooks/topics/route"
import * as users from "@/lib/api-handlers/users/route"
import * as validate_key from "@/lib/api-handlers/validate-key/route"
import * as validate_openai_key from "@/lib/api-handlers/validate-openai-key/route"
import * as questions_report from "@/lib/api-handlers/questions/report/route"
import * as tts from "@/lib/api-handlers/tts/route"

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const path = slug.join("/")

  if (path === "check-api-status" && check_api_status.GET) return check_api_status.GET()
  if (path === "messages" && messages.GET) return messages.GET(req)
  if (path === "parent-invite" && parent_invite.GET) return parent_invite.GET(req)
  if (path === "production-metrics" && production_metrics.GET) return production_metrics.GET(req)
  if (path === "regional-metrics" && regional_metrics.GET) return regional_metrics.GET(req)
  if (path === "save-results" && save_results.GET) return save_results.GET(req)
  if (path === "students/link" && students_link.GET) return students_link.GET(req)
  if (path === "students/results" && students_results.GET) return students_results.GET(req)
  if (path === "textbooks" && textbooks.GET) return textbooks.GET(req)
  if (path === "textbooks/topics" && textbooks_topics.GET) return textbooks_topics.GET(req)
  if (path === "users" && users.GET) return users.GET(req)
  if (path === "questions/report" && questions_report.GET) return questions_report.GET()

  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
}

export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const path = slug.join("/")

  if (path === "analyze-test-results" && analyze_test_results.POST) return analyze_test_results.POST(req)
  if (path === "messages" && messages.POST) return messages.POST(req)
  if (path === "notifications/send-report" && notifications_send_report.POST) return notifications_send_report.POST(req)
  if (path === "notifications/send-result" && notifications_send_result.POST) return notifications_send_result.POST(req)
  if (path === "parent-invite" && parent_invite.POST) return parent_invite.POST(req)
  if (path === "parent-invite/warn" && parent_invite_warn.POST) return parent_invite_warn.POST(req)
  if (path === "production-metrics" && production_metrics.POST) return production_metrics.POST(req)
  if (path === "regional-metrics" && regional_metrics.POST) return regional_metrics.POST(req)
  if (path === "save-results" && save_results.POST) return save_results.POST(req)
  if (path === "save-test-result" && save_test_result.POST) return save_test_result.POST(req)
  if (path === "search" && search.POST) return search.POST(req)
  if (path === "students/link" && students_link.POST) return students_link.POST(req)
  if (path === "questions/report" && questions_report.POST) return questions_report.POST(req)
  if (path === "tts" && tts.POST) return tts.POST(req)
  if (path === "validate-key" && validate_key.POST) return validate_key.POST(req)
  if (path === "validate-openai-key" && validate_openai_key.POST) return validate_openai_key.POST(req)

  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const path = slug.join("/")

  if (path === "students/link" && students_link.PUT) return students_link.PUT(req)
  if (path === "users" && users.PUT) return users.PUT(req)

  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const path = slug.join("/")

  if (slug.length === 2 && slug[0] === "documents" && documents_id.DELETE) {
    return documents_id.DELETE(req, { params: { id: slug[1] } })
  }
  if (path === "students/link" && students_link.DELETE) return students_link.DELETE(req)

  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const path = slug.join("/")

  if (path === "parent-invite" && parent_invite.PATCH) return parent_invite.PATCH(req)

  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
}
