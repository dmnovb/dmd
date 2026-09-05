import { PhotoSlot } from '@/components/photo-slot'
import { projectSlots } from '@/data/site'
import { useLocale } from '@/i18n/locale'

export function ProjectsSection() {
  const { t } = useLocale()

  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-24 sm:px-8 sm:py-32"
    >
      <h2 className="text-sm text-muted-foreground">{t.projects.heading}</h2>
      <p className="mt-4 max-w-xl text-2xl font-medium tracking-tight text-balance sm:text-3xl">
        {t.projects.standfirst}
      </p>

      <ul className="mt-16 grid gap-x-10 gap-y-16 sm:grid-cols-2">
        {projectSlots.map((project) => {
          const item = t.projects.items[project.id]
          return (
            <li key={project.id}>
              <div className="aspect-4/3 overflow-hidden rounded-lg">
                <PhotoSlot
                  alt={item.title}
                  image={project.image}
                  hint={project.file}
                />
              </div>
              <h3 className="mt-5 text-base font-medium">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {item.caption}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
