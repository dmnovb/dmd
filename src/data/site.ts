/**
 * Language-neutral facts. Words live in src/i18n/copy.ts.
 * Drop photos into public/, then set heroPhoto / project.image here.
 */

export const business = {
  name: 'DMD',
  email: 'damyanov_d@yahoo.co.uk',
  phone: '089 241 0451',
  phoneHref: '+359892410451',
} as const

/** Set to '/hero.jpg' once the file is in public/. */
export const heroPhoto: string | undefined = undefined

export const heroPhotoHint = 'public/hero.jpg'

export type ProjectId =
  | 'kitchen-north'
  | 'kitchen-terrace'
  | 'wardrobe'
  | 'table'

export type ProjectSlot = {
  id: ProjectId
  file: string
  image?: string
}

export const projectSlots: ProjectSlot[] = [
  {
    id: 'kitchen-north',
    file: '/projects/kitchen-north.jpg',
  },
  {
    id: 'kitchen-terrace',
    file: '/projects/kitchen-terrace.jpg',
  },
  {
    id: 'wardrobe',
    file: '/projects/wardrobe.jpg',
  },
  {
    id: 'table',
    file: '/projects/table.jpg',
  },
]
