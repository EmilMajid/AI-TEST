import { createClient } from "@/lib/supabase/server"

export class VectorStore {
  private supabase: any

  async init() {
    this.supabase = await createClient()
  }

  async addDocuments(documents: Array<{ id: string; content: string; metadata?: any; userId?: string }>) {
    if (!this.supabase) await this.init()

    const { data, error } = await this.supabase.from("documents").insert(
      documents.map((doc) => ({
        id: doc.id,
        content: doc.content,
        metadata: doc.metadata,
        user_id: doc.userId,
        created_at: new Date().toISOString(),
      })),
    )

    if (error) throw error
    return data
  }

  async search(query: string, limitOrUserId: number | string = 5, limit = 5) {
    if (!this.supabase) await this.init()

    const actualLimit = typeof limitOrUserId === "number" ? limitOrUserId : limit
    const userId = typeof limitOrUserId === "string" ? limitOrUserId : undefined

    let dbQuery = this.supabase.from("documents").select("*")
    if (userId) {
      dbQuery = dbQuery.eq("user_id", userId)
    }

    const { data, error } = await dbQuery
      .order("created_at", { ascending: false })
      .limit(actualLimit)

    if (error) throw error
    return data
  }

  async deleteDocument(id: string, userId: string) {
    if (!this.supabase) await this.init()

    const { error } = await this.supabase
      .from("documents")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)

    if (error) throw error
  }

  async getUserDocuments(userId: string) {
    if (!this.supabase) await this.init()

    const { data, error } = await this.supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }
}

export const vectorStore = new VectorStore()
