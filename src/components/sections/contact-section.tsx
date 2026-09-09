import { useState, type ChangeEvent, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { business } from '@/data/site'
import type { Copy } from '@/i18n/copy'
import { useLocale } from '@/i18n/locale'

type Status = 'idle' | 'sending' | 'sent' | 'error'
type ErrorKey = keyof Copy['contact']['errors']

function isErrorKey(value: string | undefined): value is ErrorKey {
  return (
    value === 'invalid' ||
    value === 'too_long' ||
    value === 'too_many_files' ||
    value === 'file_too_large' ||
    value === 'file_type' ||
    value === 'send_failed' ||
    value === 'not_configured'
  )
}

function photoSummary(names: string[], empty: string) {
  if (names.length === 0) return empty
  return names.join(', ')
}

export function ContactSection() {
  const { locale, t } = useLocale()
  const [status, setStatus] = useState<Status>('idle')
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null)
  const [photoNames, setPhotoNames] = useState<string[]>([])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setErrorKey(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: new FormData(event.currentTarget),
      })
      const payload = (await response.json()) as { ok?: boolean; error?: string }

      if (!response.ok || !payload.ok) {
        setErrorKey(isErrorKey(payload.error) ? payload.error : 'send_failed')
        setStatus('error')
        return
      }

      setStatus('sent')
    } catch {
      setErrorKey('send_failed')
      setStatus('error')
    }
  }

  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-24 sm:px-8 sm:py-32"
    >
      <div className="max-w-xl">
        <h2 className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">
          {t.contact.heading}
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground text-pretty">
          {t.contact.standfirst}
        </p>
      </div>

      <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_14rem]">
        {status === 'sent' ? (
          <p className="max-w-xl text-lg font-medium tracking-tight">
            {t.contact.sent}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="max-w-xl space-y-6">
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <input type="hidden" name="locale" value={locale} />

            <div className="grid gap-2">
              <Label htmlFor="name">{t.contact.name}</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                maxLength={100}
                placeholder={t.contact.namePlaceholder}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t.contact.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project">{t.contact.project}</Label>
              <Textarea
                id="project"
                name="project"
                required
                maxLength={8000}
                rows={7}
                placeholder={t.contact.projectPlaceholder}
                className="resize-y"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="photos">{t.contact.photos}</Label>
              <div className="relative flex min-h-8 w-full items-center gap-3 overflow-hidden rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30">
                <input
                  id="photos"
                  name="photos"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf"
                  multiple
                  lang={locale}
                  aria-label={`${t.contact.photos}. ${t.contact.photosChoose}. ${photoSummary(photoNames, t.contact.photosEmpty)}`}
                  aria-describedby="photos-hint"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setPhotoNames(
                      Array.from(event.currentTarget.files ?? []).map(
                        (file) => file.name,
                      ),
                    )
                  }}
                  className="absolute inset-0 z-10 cursor-pointer opacity-0 file:hidden"
                />
                <span aria-hidden="true" className="pointer-events-none shrink-0 font-medium">
                  {t.contact.photosChoose}
                </span>
                <span aria-hidden="true" className="pointer-events-none min-w-0 truncate text-muted-foreground">
                  {photoSummary(photoNames, t.contact.photosEmpty)}
                </span>
              </div>
              <p id="photos-hint" className="text-xs text-muted-foreground">
                {t.contact.photosHint}
              </p>
            </div>
            {errorKey ? (
              <p className="text-sm text-destructive">{t.contact.errors[errorKey]}</p>
            ) : null}
            <Button type="submit" size="lg" disabled={status === 'sending'}>
              {status === 'sending' ? t.contact.sending : t.contact.submit}
            </Button>
          </form>
        )}

        <aside className="space-y-8 text-sm">
          <div>
            <p className="text-muted-foreground">{t.contact.email}</p>
            <a
              href={`mailto:${business.email}`}
              className="mt-1 block underline-offset-4 hover:underline"
            >
              {business.email}
            </a>
          </div>
          <div>
            <p className="text-muted-foreground">{t.contact.telephone}</p>
            <a
              href={`tel:${business.phoneHref}`}
              className="mt-1 block underline-offset-4 hover:underline"
            >
              {business.phone}
            </a>
          </div>
          <div>
            <p className="text-muted-foreground">{t.contact.hoursLabel}</p>
            <p className="mt-1">{t.contact.hours}</p>
          </div>
        </aside>
      </div>
    </section>
  )
}
