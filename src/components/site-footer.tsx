import { business } from '@/data/site'
import { useLocale } from '@/i18n/locale'

const year = new Date().getFullYear()

export function SiteFooter() {
  const { t } = useLocale()

  return (
    <footer className="bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 sm:px-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium">{business.name}</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {t.footer.blurb}
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {t.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <p className="mx-auto w-full max-w-5xl px-6 pb-10 text-xs text-muted-foreground sm:px-8">
        © {year} {business.name}
      </p>
    </footer>
  )
}
