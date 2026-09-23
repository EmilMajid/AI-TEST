import { Lang } from "@/components/language-dropdown"

/**
 * Default locale for root (/) landing page.
 * Set to "en" during Google AdSense review compliance to satisfy supported language requirements.
 * To restore Azerbaijani as the default opening language after AdSense approval,
 * simply change this value to "az".
 */
export const DEFAULT_LOCALE: Lang = "en"

export const SUPPORTED_LOCALES: readonly Lang[] = ["az", "en", "tr", "ru"] as const
