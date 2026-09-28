import { NextRequest, NextResponse } from "next/server"

import * as analyze_test_results from "@/lib/api-handlers/analyze-test-results/route"
import * as backend_textbooks from "@/lib/api-handlers/backend/textbooks/route"
import * as check_api_status from "@/lib/api-handlers/check-api-status/route"
import * as documents_id from "@/lib/api-handlers/documents/[id]/route"
import * as ingest from "@/lib/api-handlers/ingest/route"
import * as lora_benchmark from "@/lib/api-handlers/lora/benchmark/route"
import * as lora_train from "@/lib/api-handlers/lora/train/route"
import * as lora_versions from "@/lib/api-handlers/lora/versions/route"
import * as messages from "@/lib/api-handlers/messages/route"
import * as notifications_send_report from "@/lib/api-handlers/notifications/send-report/route"
import * as notifications_send_result from "@/lib/api-handlers/notifications/send-result/route"
import * as parent_invite from "@/lib/api-handlers/parent-invite/route"
import * as parent_invite_warn from "@/lib/api-handlers/parent-invite/warn/route"
import * as production_metrics from "@/lib/api-handlers/production-metrics/route"
import * as rag_ingest from "@/lib/api-handlers/rag/ingest/route"
import * as rag_search from "@/lib/api-handlers/rag/search/route"
import * as regional_metrics from "@/lib/api-handlers/regional-metrics/route"
import * as save_results from "@/lib/api-handlers/save-results/route"
import * as save_test_result from "@/lib/api-handlers/save-test-result/route"
import * as search from "@/lib/api-handlers/search/route"
import * as students_link from "@/lib/api-handlers/students/link/route"
import * as students_results from "@/lib/api-handlers/students/results/route"
import * as test_bank_coverage from "@/lib/api-handlers/test-bank/coverage/route"
import * as test_bank_generate from "@/lib/api-handlers/test-bank/generate/route"
import * as test_bank_questions from "@/lib/api-handlers/test-bank/questions/route"
import * as test_bank_select from "@/lib/api-handlers/test-bank/select/route"
import * as test_bank_submit from "@/lib/api-handlers/test-bank/submit/route"
import * as tests_analyze from "@/lib/api-handlers/tests/analyze/route"
import * as tests_generate from "@/lib/api-handlers/tests/generate/route"
import * as tests_submit from "@/lib/api-handlers/tests/submit/route"
import * as textbooks from "@/lib/api-handlers/textbooks/route"
import * as textbooks_topics from "@/lib/api-handlers/textbooks/topics/route"
import * as tts from "@/lib/api-handlers/tts/route"
import * as users from "@/lib/api-handlers/users/route"
import * as validate_key from "@/lib/api-handlers/validate-key/route"
import * as validate_openai_key from "@/lib/api-handlers/validate-openai-key/route"
import * as wandb_runs from "@/lib/api-handlers/wandb/runs/route"
import * as wandb_setup from "@/lib/api-handlers/wandb/setup/route"

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const path = slug.join("/")
  if (path === "backend/textbooks" && backend_textbooks.GET) return backend_textbooks.GET(req)
  if (path === "check-api-status" && check_api_status.GET) return check_api_status.GET(req)
  if (path === "lora/benchmark" && lora_benchmark.GET) return lora_benchmark.GET(req)
  if (path === "lora/train" && lora_train.GET) return lora_train.GET(req)
  if (path === "lora/versions" && lora_versions.GET) return lora_versions.GET(req)
  if (path === "messages" && messages.GET) return messages.GET(req)
  if (path === "parent-invite" && parent_invite.GET) return parent_invite.GET(req)
  if (path === "production-metrics" && production_metrics.GET) return production_metrics.GET(req)
  if (path === "regional-metrics" && regional_metrics.GET) return regional_metrics.GET(req)
  if (path === "save-results" && save_results.GET) return save_results.GET(req)
  if (path === "students/link" && students_link.GET) return students_link.GET(req)
  if (path === "students/results" && students_results.GET) return students_results.GET(req)
  if (path === "test-bank/coverage" && test_bank_coverage.GET) return test_bank_coverage.GET(req)
  if (path === "test-bank/questions" && test_bank_questions.GET) return test_bank_questions.GET(req)
  if (path === "textbooks" && textbooks.GET) return textbooks.GET(req)
  if (path === "textbooks/topics" && textbooks_topics.GET) return textbooks_topics.GET(req)
  if (path === "tts" && tts.GET) return tts.GET(req)
  if (path === "users" && users.GET) return users.GET(req)
  if (path === "wandb/runs" && wandb_runs.GET) return wandb_runs.GET(req)
  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
}

export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const path = slug.join("/")
  if (path === "analyze-test-results" && analyze_test_results.POST) return analyze_test_results.POST(req)
  if (path === "ingest" && ingest.POST) return ingest.POST(req)
  if (path === "lora/benchmark" && lora_benchmark.POST) return lora_benchmark.POST(req)
  if (path === "lora/train" && lora_train.POST) return lora_train.POST(req)
  if (path === "lora/versions" && lora_versions.POST) return lora_versions.POST(req)
  if (path === "messages" && messages.POST) return messages.POST(req)
  if (path === "notifications/send-report" && notifications_send_report.POST) return notifications_send_report.POST(req)
  if (path === "notifications/send-result" && notifications_send_result.POST) return notifications_send_result.POST(req)
  if (path === "parent-invite" && parent_invite.POST) return parent_invite.POST(req)
  if (path === "parent-invite/warn" && parent_invite_warn.POST) return parent_invite_warn.POST(req)
  if (path === "production-metrics" && production_metrics.POST) return production_metrics.POST(req)
  if (path === "rag/ingest" && rag_ingest.POST) return rag_ingest.POST(req)
  if (path === "rag/search" && rag_search.POST) return rag_search.POST(req)
  if (path === "regional-metrics" && regional_metrics.POST) return regional_metrics.POST(req)
  if (path === "save-results" && save_results.POST) return save_results.POST(req)
  if (path === "save-test-result" && save_test_result.POST) return save_test_result.POST(req)
  if (path === "search" && search.POST) return search.POST(req)
  if (path === "students/link" && students_link.POST) return students_link.POST(req)
  if (path === "test-bank/generate" && test_bank_generate.POST) return test_bank_generate.POST(req)
  if (path === "test-bank/select" && test_bank_select.POST) return test_bank_select.POST(req)
  if (path === "test-bank/submit" && test_bank_submit.POST) return test_bank_submit.POST(req)
  if (path === "tests/analyze" && tests_analyze.POST) return tests_analyze.POST(req)
  if (path === "tests/generate" && tests_generate.POST) return tests_generate.POST(req)
  if (path === "tests/submit" && tests_submit.POST) return tests_submit.POST(req)
  if (path === "tts" && tts.POST) return tts.POST(req)
  if (path === "validate-key" && validate_key.POST) return validate_key.POST(req)
  if (path === "validate-openai-key" && validate_openai_key.POST) return validate_openai_key.POST(req)
  if (path === "wandb/setup" && wandb_setup.POST) return wandb_setup.POST(req)
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
  if (slug.length === 2 && slug[0] === "documents" && documents_id.DELETE) return documents_id.DELETE(req, { params: { id: slug[1] } })
  if (path === "lora/versions" && lora_versions.DELETE) return lora_versions.DELETE(req)
  if (path === "students/link" && students_link.DELETE) return students_link.DELETE(req)
  if (path === "test-bank/questions" && test_bank_questions.DELETE) return test_bank_questions.DELETE(req)
  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const path = slug.join("/")
  if (path === "parent-invite" && parent_invite.PATCH) return parent_invite.PATCH(req)
  if (path === "test-bank/coverage" && test_bank_coverage.PATCH) return test_bank_coverage.PATCH(req)
  if (path === "test-bank/questions" && test_bank_questions.PATCH) return test_bank_questions.PATCH(req)
  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
}
