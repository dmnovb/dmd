import { help } from '@/data/site'

export function HelpSection() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-24 sm:px-8 sm:py-32">
      <h2 className="text-sm text-muted-foreground">What you get</h2>

      <ul className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-x-16 sm:gap-y-16">
        {help.map((item) => (
          <li key={item.title} className="max-w-sm">
            <h3 className="text-lg font-medium tracking-tight">{item.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
