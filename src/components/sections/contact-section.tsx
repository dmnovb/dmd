import { useState, type FormEvent } from 'react'

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
    value === 'send_failed' ||
    value === 'not_configured'
  )
}

export function ContactSection() {
  const { locale, t } = useLocale()
  const [status, setStatus] = useState<Status>('idle')
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null)

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
                rows={7}
                placeholder={t.contact.projectPlaceholder}
                className="resize-y"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="photos">{t.contact.photos}</Label>
              <Input
                id="photos"
                name="photos"
                type="file"
                accept="image/*,.pdf"
                multiple
                className="h-auto py-2 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium"
              />
              <p className="text-xs text-muted-foreground">
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
