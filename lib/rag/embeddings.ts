import { embeddings } from "@/lib/ai"

export async function generateEmbeddings(texts: string[]) {
  try {
    const results = await embeddings.embedMany({
      model: "openai/text-embedding-3-small",
      texts,
    })
    return results
  } catch (error) {
    console.error("Error generating embeddings:", error)
    throw error
  }
}

export async function generateEmbedding(text: string) {
  try {
    const result = await embeddings.embed({
      model: "openai/text-embedding-3-small",
      value: text,
    })
    return result.embedding
  } catch (error) {
    console.error("Error generating embedding:", error)
    throw error
  }
}
