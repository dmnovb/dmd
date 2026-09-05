import { PhotoSlot } from '@/components/photo-slot'
import { projects } from '@/data/site'

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-24 sm:px-8 sm:py-32"
    >
      <h2 className="text-sm text-muted-foreground">Projects</h2>
      <p className="mt-4 max-w-xl text-2xl font-medium tracking-tight text-balance sm:text-3xl">
        Recent kitchens and one piece of furniture.
      </p>

      <ul className="mt-16 grid gap-x-10 gap-y-16 sm:grid-cols-2">
        {projects.map((project) => (
          <li key={project.title}>
            <div className="aspect-4/3 overflow-hidden rounded-lg">
              <PhotoSlot
                alt={project.title}
                image={project.image}
                hint={project.file}
              />
            </div>
            <h3 className="mt-5 text-base font-medium">{project.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {project.caption}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
