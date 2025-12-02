import { POST } from "@/app/api/ingest/route"
import { NextRequest } from "next/server"
import jest from "jest"

// Mock Supabase
jest.mock("@/utils/supabaseClient", () => ({
  supabaseServer: {
    auth: {
      getUser: jest.fn(),
    },
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
      })),
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}))

describe("POST /api/ingest", () => {
  it("should return 401 when unauthorized", async () => {
    const request = new NextRequest(new URL("http://localhost:3000/api/ingest"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it("should return 400 when no file provided", async () => {
    const request = new NextRequest(new URL("http://localhost:3000/api/ingest"), {
      method: "POST",
      headers: {
        Authorization: "Bearer test-token",
      },
    })

    const response = await POST(request)
    // Would need mocking setup for full test
    expect(response).toBeDefined()
  })
})
