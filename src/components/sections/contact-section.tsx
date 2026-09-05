import type { FormEvent } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { business, contact } from '@/data/site'

export function ContactSection() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const project = String(data.get('project') ?? '').trim()

    const body = [
      name ? `Name: ${name}` : null,
      `Email: ${email}`,
      '',
      project,
    ]
      .filter((line) => line !== null)
      .join('\n')

    window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(
      contact.subject,
    )}&body=${encodeURIComponent(body)}`

    toast.success('Opening your email app', {
      description: 'Attach photos there, then send.',
    })
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
        <form onSubmit={onSubmit} className="max-w-xl space-y-6">
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
          <Button type="submit" size="lg">
            Send the enquiry
          </Button>
        </form>

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
