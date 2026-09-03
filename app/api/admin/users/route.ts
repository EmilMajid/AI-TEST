export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { MOCK_USERS } from "@/lib/mock-data"

export async function GET() {
  // Return all users from the shared mock data
  // We can add simple pagination or filtering later if needed
  return NextResponse.json({
    success: true,
    users: MOCK_USERS,
    total: MOCK_USERS.length
  })
}
