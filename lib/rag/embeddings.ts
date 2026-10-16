import { embed, embedMany } from "ai"
import { embeddings } from "@/lib/ai"

export async function generateEmbeddings(texts: string[]) {
  try {
    const { embeddings: results } = await embedMany({
      model: embeddings,
      values: texts,
    })
    return results
  } catch (error) {
    console.error("Error generating embeddings:", error)
    throw error
  }
}

export async function generateEmbedding(text: string) {
  try {
    const { embedding } = await embed({
      model: embeddings,
      value: text,
    })
    return embedding
  } catch (error) {
    console.error("Error generating embedding:", error)
    throw error
  }
}
