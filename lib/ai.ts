import { openai } from "@ai-sdk/openai"

export const embeddings = openai.embedding("text-embedding-3-small")
