import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

export interface Document {
  id: string
  text: string
  metadata?: Record<string, any>
}

export interface ChunkedDocument {
  id: string
  chunkIndex: number
  chunkText: string
  metadata?: Record<string, any>
}

/**
 * Load and split documents into chunks for embedding
 * Uses RecursiveCharacterTextSplitter with customizable chunk size and overlap
 */
export async function loadAndSplitDocuments(
  documents: Document[],
  chunkSize = 1000,
  chunkOverlap = 200,
): Promise<ChunkedDocument[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
    separators: ["\n\n", "\n", " ", ""],
  })

  const chunkedDocs: ChunkedDocument[] = []

  for (const doc of documents) {
    const chunks = await splitter.splitText(doc.text)
    chunks.forEach((chunk, index) => {
      chunkedDocs.push({
        id: `${doc.id}-chunk-${index}`,
        chunkIndex: index,
        chunkText: chunk,
        metadata: {
          ...doc.metadata,
          source_document_id: doc.id,
        },
      })
    })
  }

  return chunkedDocs
}

/**
 * Simple text loader that preserves document metadata
 */
export function createDocument(id: string, text: string, metadata?: Record<string, any>): Document {
  return {
    id,
    text,
    metadata,
  }
}
