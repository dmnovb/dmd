import { useState } from 'react'

import { PhotoLightbox } from '@/components/photo-lightbox'
import { PhotoSlot } from '@/components/photo-slot'
import {
  projectCategories,
  type ProjectCategoryId,
} from '@/data/site'
import { useLocale } from '@/i18n/locale'
import { rectFromElement, type PhotoRect } from '@/lib/photo-transition'

type OpenPhoto = {
  aspect: number
  categoryId: ProjectCategoryId
  index: number
  origin: PhotoRect
}

export function ProjectsSection() {
  const { t } = useLocale()
  const [openPhoto, setOpenPhoto] = useState<OpenPhoto | null>(null)

  const openCategory = openPhoto
    ? projectCategories.find((category) => category.id === openPhoto.categoryId)
    : undefined

  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-24 sm:px-8 sm:py-32"
    >
      <h2 className="text-sm text-muted-foreground">{t.projects.heading}</h2>
      <p className="mt-4 max-w-xl text-2xl font-medium tracking-tight text-balance sm:text-3xl">
        {t.projects.standfirst}
      </p>

      <div className="mt-16 flex flex-col gap-20">
        {projectCategories.map((category) => {
          const item = t.projects.categories[category.id]
          return (
            <div key={category.id}>
              <h3 className="text-base font-medium">{item.title}</h3>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {item.caption}
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.photos.map((src, index) => (
                  <li key={src}>
                    <button
                      type="button"
                      data-project-photo={`${category.id}:${index}`}
                      className="aspect-4/3 w-full cursor-zoom-in overflow-hidden rounded-lg border-0 bg-transparent p-0 [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-90"
                      onClick={(event) => {
                        const origin = rectFromElement(event.currentTarget)
                        const image =
                          event.currentTarget.querySelector('img')
                        const aspect =
                          image &&
                          image.naturalWidth > 0 &&
                          image.naturalHeight > 0
                            ? image.naturalWidth / image.naturalHeight
                            : origin.width / origin.height

                        setOpenPhoto({
                          aspect,
                          categoryId: category.id,
                          index,
                          origin,
                        })
                      }}
                    >
                      <PhotoSlot
                        alt={t.projects.photoAlt[category.id]}
                        className="pointer-events-none"
                        image={src}
                        hint={src}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <PhotoLightbox
        alt={
          openPhoto ? t.projects.photoAlt[openPhoto.categoryId] : ''
        }
        index={openPhoto?.index ?? 0}
        onIndexChange={(index) =>
          setOpenPhoto((current) => (current ? { ...current, index } : current))
        }
        onOpenChange={(open) => {
          if (!open) setOpenPhoto(null)
        }}
        open={openPhoto !== null}
        aspect={openPhoto?.aspect ?? null}
        origin={openPhoto?.origin ?? null}
        photos={openCategory?.photos ?? []}
        thumbId={
          openPhoto ? `${openPhoto.categoryId}:${openPhoto.index}` : ''
        }
      />
    </section>
  )
}
