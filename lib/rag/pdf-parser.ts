'use server'

import type { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

export interface ParsedPDF {
  content: string
  metadata: {
    source: string
    pages: number
    uploadedAt: string
  }
}

export async function parsePDFContent(buffer: Buffer, filename: string): Promise<ParsedPDF> {
  try {
    // In production, use pdf-parse or pdfjs-dist
    // For now, return placeholder that will be processed by backend
    const content = `[PDF: ${filename}] - Content will be extracted and processed by backend`
    
    return {
      content,
      metadata: {
        source: filename,
        pages: 1,
        uploadedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error("[v0] PDF parsing error:", error)
    throw new Error("PDF parsing failed")
  }
}

export async function chunkPDFContent(content: string, chunkSize: number = 1000): Promise<string[]> {
  const chunks: string[] = []
  let currentChunk = ""

  const sentences = content.split(/[.!?]+/)
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize) {
      if (currentChunk) chunks.push(currentChunk.trim())
      currentChunk = sentence
    } else {
      currentChunk += sentence + ". "
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim())
  return chunks
}
