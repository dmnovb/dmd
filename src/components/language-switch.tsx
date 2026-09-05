import { useLocale } from '@/i18n/locale'
import { locales, type Locale } from '@/i18n/copy'
import { cn } from '@/lib/utils'

const labels: Record<Locale, string> = {
  en: 'EN',
  bg: 'BG',
}

export function LanguageSwitch() {
  const { locale, setLocale, t } = useLocale()

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className="flex items-center text-sm"
    >
      {locales.map((code, index) => (
        <span key={code} className="flex items-center">
          {index > 0 ? (
            <span className="px-1 text-muted-foreground/40" aria-hidden="true">
              /
            </span>
          ) : null}
          <button
            type="button"
            aria-pressed={locale === code}
            onClick={() => setLocale(code)}
            className={cn(
              'cursor-pointer border-0 bg-transparent p-0 text-sm transition-colors',
              locale === code
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {labels[code]}
          </button>
        </span>
      ))}
    </div>
  )
}
