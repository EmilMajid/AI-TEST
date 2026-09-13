"use client"

import { useState, useRef, useEffect } from "react"
import { Globe, ChevronDown, Check } from "lucide-react"

export type Lang = "az" | "en" | "tr" | "ru"

export interface LanguageItem {
  code: Lang
  label: string
  flag: string
  short: string
}

export const LANGUAGES: LanguageItem[] = [
  { code: "az", label: "Azərbaycan", flag: "🇦🇿", short: "AZ" },
  { code: "en", label: "English", flag: "🇬🇧", short: "EN" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷", short: "TR" },
  { code: "ru", label: "Русский", flag: "🇷🇺", short: "RU" },
]

interface LanguageDropdownProps {
  currentLang: Lang
  onSelectLang: (lang: Lang) => void
  variant?: "light" | "dark"
}

export function LanguageDropdown({
  currentLang,
  onSelectLang,
  variant = "light",
}: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selected = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0]

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs ${
          variant === "dark"
            ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="text-sm">{selected.flag}</span>
        <span className="hidden sm:inline text-slate-800 font-medium">{selected.label}</span>
        <span className="sm:hidden text-slate-800 font-bold uppercase">{selected.short}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
            Dili Seçin / Select Language
          </div>
          {LANGUAGES.map((item) => {
            const isSelected = item.code === currentLang
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  onSelectLang(item.code)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.flag}</span>
                  <span>{item.label}</span>
                  <span className="text-[11px] text-slate-400 uppercase">({item.short})</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
