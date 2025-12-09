import { POST as searchHandler } from "@/app/api/search/route"
import { NextRequest } from "next/server"


jest.mock("@/utils/supabaseClient")
jest.mock("@/lib/rag/embeddings")

describe("POST /api/search", () => {
  it("should return 401 when unauthorized", async () => {
    const request = new NextRequest(new URL("http://localhost:3000/api/search"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: "test" }),
    })

    const response = await searchHandler(request)
    expect(response.status).toBe(401)
  })

  it("should return 400 when query is empty", async () => {
    const request = new NextRequest(new URL("http://localhost:3000/api/search"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
      body: JSON.stringify({ query: "" }),
    })

    const response = await searchHandler(request)
    expect(response.status).toBe(400)
  })
})
