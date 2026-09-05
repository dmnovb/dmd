import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { copy, isLocale, type Copy, type Locale } from '@/i18n/copy'
import { detectLocale, LOCALE_STORAGE_KEY } from '@/i18n/detect'

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Copy
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function applyDocumentLocale(locale: Locale) {
  const { title, description } = copy[locale].meta
  document.documentElement.lang = locale
  document.title = title
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', description)
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
    applyDocumentLocale(next)

    const url = new URL(window.location.href)
    url.searchParams.set('lang', next)
    window.history.replaceState(null, '', url)
  }, [])

  useEffect(() => {
    applyDocumentLocale(locale)
  }, [locale])

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get('lang')
    if (isLocale(fromQuery)) {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, fromQuery)
    }
  }, [])

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: copy[locale] }),
    [locale, setLocale],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return context
}
