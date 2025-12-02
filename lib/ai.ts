import { embeddings as createEmbeddings } from "ai"

export const embeddings = createEmbeddings({
  model: "openai/text-embedding-3-small",
})
