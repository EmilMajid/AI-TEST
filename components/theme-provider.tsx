"use client"

import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"

export function ThemeProviderComponent({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="theme">
      {children}
    </ThemeProvider>
  )
}
