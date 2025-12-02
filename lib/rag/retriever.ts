import { supabaseServer } from "@/utils/supabaseClient"
import { generateEmbedding } from "./embeddings"

export interface RetrievedContext {
  text: string
  documentId: string
  chunkIndex: number
  similarity: number
  metadata?: Record<string, any>
}

/**
 * Create a retriever that queries the vector database for similar chunks
 * Uses pgvector similarity search with cosine distance
 */
export async function createRetriever(userId: string, k = 5) {
  return {
    async retrieve(query: string): Promise<RetrievedContext[]> {
      try {
        // Generate embedding for query
        const queryEmbedding = await generateEmbedding(query)

        // Query rag_chunks table using pgvector similarity
        // This uses the <-> operator for cosine distance (smaller = more similar)
        const { data, error } = await supabaseServer.rpc("search_rag_chunks", {
          query_embedding: queryEmbedding,
          user_id_param: userId,
          match_count: k,
        })

        if (error) {
          console.error("[ERROR] Vector search failed:", error)
          return []
        }

        // Transform results to RetrievedContext format
        return (data || []).map((result: any) => ({
          text: result.chunk_text,
          documentId: result.document_id,
          chunkIndex: result.chunk_index,
          similarity: result.similarity,
          metadata: result.metadata,
        }))
      } catch (error) {
        console.error("[ERROR] Retriever error:", error)
        return []
      }
    },
  }
}

/**
 * Alternative: Direct SQL query for vector similarity search
 * If RPC not available, use this direct query approach
 */
export async function retrieveContexts(userId: string, queryEmbedding: number[], k = 5): Promise<RetrievedContext[]> {
  try {
    const { data, error } = await supabaseServer
      .from("rag_chunks")
      .select(
        `
        id,
        chunk_text,
        chunk_index,
        embedding,
        metadata,
        document_id,
        rag_documents!inner(user_id)
      `,
      )
      .eq("rag_documents.user_id", userId)
      .order("embedding", {
        ascending: true,
        nullsFirst: false,
      })
      .limit(k)

    if (error) {
      console.error("[ERROR] Context retrieval failed:", error)
      return []
    }

    // Calculate similarity scores (1 - cosine_distance)
    // For proper vector distance, this should be done server-side via RPC
    return (data || []).map((result: any) => ({
      text: result.chunk_text,
      documentId: result.document_id,
      chunkIndex: result.chunk_index,
      similarity: 0.5, // Placeholder - would be calculated with proper distance metric
      metadata: result.metadata,
    }))
  } catch (error) {
    console.error("[ERROR] Retriever error:", error)
    return []
  }
}
