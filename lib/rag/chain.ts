import { generateText } from "ai"
import { vectorStore } from "./vectorstore"

interface RAGContext {
  query: string
  documents: Array<{ content: string; metadata?: any }>
}

export async function createRAGChain() {
  return {
    async call(query: string) {
      // Search for relevant documents
      const documents = await vectorStore.search(query, 3)

      if (!documents || documents.length === 0) {
        return {
          answer: "Relevant documents not found",
          sources: [],
        }
      }

      // Create context from documents
      const context = documents.map((doc: any, idx: number) => `[Source ${idx + 1}]\n${doc.content}`).join("\n\n")

      // Generate response using LLM
      const { text } = await generateText({
        model: "openai/gpt-4-turbo",
        system: `You are an educational assistant for Azerbaijani students. 
        Use the provided documents to answer questions accurately and helpfully.
        Always cite the sources you use. Respond in Azerbaijani.`,
        prompt: `Documents:\n${context}\n\nQuestion: ${query}`,
      })

      return {
        answer: text,
        sources: documents.map((doc: any) => doc.metadata?.source || "Unknown"),
      }
    },
  }
}
