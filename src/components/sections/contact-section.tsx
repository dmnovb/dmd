import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { business, contact } from '@/data/site'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const errors: Record<string, string> = {
  invalid: 'Add an email and a short note about the project.',
  too_long: 'That note is too long — try a shorter version.',
  too_many_files: 'You can attach up to five files.',
  file_too_large: 'Those files are too large. Keep each under 8 MB.',
  send_failed: 'It did not go through. Try again, or ring the number on the right.',
  not_configured: 'It did not go through. Try again, or ring the number on the right.',
}

export function ContactSection() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: new FormData(event.currentTarget),
      })
      const payload = (await response.json()) as { ok?: boolean; error?: string }

      if (!response.ok || !payload.ok) {
        setError(errors[payload.error ?? ''] ?? errors.send_failed)
        setStatus('error')
        return
      }

      setStatus('sent')
    } catch {
      setError(errors.send_failed)
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
          {contact.heading}
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground text-pretty">
          {contact.standfirst}
        </p>
      </div>

      <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_14rem]">
        {status === 'sent' ? (
          <p className="max-w-xl text-lg font-medium tracking-tight">
            Sent. I will write back in a few days.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="max-w-xl space-y-6">
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Optional"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="project">The project</Label>
              <Textarea
                id="project"
                name="project"
                required
                rows={7}
                placeholder="The room, what you want, and anything you already have — photos, a sketch, a quote."
                className="resize-y"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="photos">Photos</Label>
              <Input
                id="photos"
                name="photos"
                type="file"
                accept="image/*,.pdf"
                multiple
                className="h-auto py-2 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium"
              />
              <p className="text-xs text-muted-foreground">
                Optional. Up to five images or PDFs, 8 MB each.
              </p>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" size="lg" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send the enquiry'}
            </Button>
          </form>
        )}

        <aside className="space-y-8 text-sm">
          <div>
            <p className="text-muted-foreground">Email</p>
            <a
              href={`mailto:${business.email}`}
              className="mt-1 block underline-offset-4 hover:underline"
            >
              {business.email}
            </a>
          </div>
          <div>
            <p className="text-muted-foreground">Telephone</p>
            <a
              href={`tel:${business.phoneHref}`}
              className="mt-1 block underline-offset-4 hover:underline"
            >
              {business.phone}
            </a>
          </div>
          <div>
            <p className="text-muted-foreground">Hours</p>
            <p className="mt-1">{business.hours}</p>
          </div>
        </aside>
      </div>
    </section>
  )
}
