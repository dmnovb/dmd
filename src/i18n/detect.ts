import { isLocale, type Locale } from '@/i18n/copy'

export const LOCALE_STORAGE_KEY = 'locale'
export const COUNTRY_COOKIE = 'dmd-country'

declare global {
  interface Window {
    __COUNTRY__?: string
  }
}

export function countryFromCookie(): string {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COUNTRY_COOKIE}=([^;]*)`),
  )
  return match ? decodeURIComponent(match[1]) : ''
}

function isBulgariaTimezone(): boolean {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone === 'Europe/Sofia'
  } catch {
    return false
  }
}

/** Country first (Cloudflare). Timezone only when country is unknown, e.g. local Vite. */
export function localeFromLocation(): Locale {
  const country =
    (typeof window.__COUNTRY__ === 'string' && window.__COUNTRY__) ||
    countryFromCookie()

  if (country === 'BG') return 'bg'
  if (!country && isBulgariaTimezone()) return 'bg'
  return 'en'
}

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  const fromQuery = new URLSearchParams(window.location.search).get('lang')
  if (isLocale(fromQuery)) return fromQuery

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (isLocale(stored)) return stored

  return localeFromLocation()
}
