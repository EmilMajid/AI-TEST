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

  async search(query: string, userId: string, limit = 5) {
    if (!this.supabase) await this.init()

    const { data, error } = await this.supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

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
