import path from "path"

/**
 * Safely resolves project workspace paths at runtime without triggering
 * Next.js / @vercel/nft static directory bundling (which would otherwise
 * bundle 300MB+ of raw data/scripts into serverless functions, causing Vercel
 * deployment errors on the Hobby plan).
 */
export function getSafeWorkspacePath(...segments: string[]): string {
  let root = process.cwd()
  for (let i = 0; i < segments.length; i++) {
    root = path.join(root, segments[i])
  }
  return root
}
