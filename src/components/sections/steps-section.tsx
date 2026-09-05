import { useLocale } from '@/i18n/locale'

export function StepsSection() {
  const { t } = useLocale()

  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-24 sm:px-8 sm:py-32"
    >
      <h2 className="text-sm text-muted-foreground">{t.steps.heading}</h2>

      <ol className="mt-12 grid gap-12 sm:grid-cols-3 sm:gap-16">
        {t.steps.items.map((step, index) => (
          <li key={step.title} className="max-w-xs">
            <p className="text-sm text-muted-foreground">{index + 1}</p>
            <h3 className="mt-4 text-lg font-medium tracking-tight">{step.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
