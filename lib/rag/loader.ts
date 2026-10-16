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
 * Split text into chunks with size and overlap
 */
function splitTextIntoChunks(text: string, chunkSize: number, chunkOverlap: number): string[] {
  if (text.length <= chunkSize) return [text]
  const chunks: string[] = []
  let start = 0
  const step = Math.max(1, chunkSize - chunkOverlap)
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end))
    if (end >= text.length) break
    start += step
  }
  return chunks
}

/**
 * Load and split documents into chunks for embedding
 */
export async function loadAndSplitDocuments(
  documents: Document[],
  chunkSize = 1000,
  chunkOverlap = 200,
): Promise<ChunkedDocument[]> {
  const chunkedDocs: ChunkedDocument[] = []

  for (const doc of documents) {
    const chunks = splitTextIntoChunks(doc.text, chunkSize, chunkOverlap)
    chunks.forEach((chunk: string, index: number) => {
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
