/**
 * Language-neutral facts. Words live in src/i18n/copy.ts.
 * Drop photos into public/, then set heroPhoto / category.photos here.
 */

export const business = {
  name: 'DMD',
  email: 'damyanov_d@yahoo.co.uk',
  phone: '089 241 0451',
  phoneHref: '+359892410451',
} as const

export const heroPhoto = '/hero.jpg'
export const heroPhotoHint = 'public/hero.jpg'

export type ProjectCategoryId = 'kitchens' | 'wardrobes' | 'bathrooms'

export type ProjectCategory = {
  id: ProjectCategoryId
  photos: string[]
}

export const projectCategories: ProjectCategory[] = [
  {
    id: 'kitchens',
    photos: [
      '/projects/kitchens/01.jpg',
      '/projects/kitchens/02.jpg',
      '/projects/kitchens/03.jpg',
      '/projects/kitchens/04.jpg',
      '/projects/kitchens/05.jpg',
      '/projects/kitchens/06.jpg',
      '/projects/kitchens/07.jpg',
      '/projects/kitchens/08.jpg',
      '/projects/kitchens/09.jpg',
    ],
  },
  {
    id: 'wardrobes',
    photos: [
      '/projects/wardrobes/01.jpg',
      '/projects/wardrobes/02.jpg',
      '/projects/wardrobes/03.jpg',
      '/projects/wardrobes/04.jpg',
      '/projects/wardrobes/05.jpg',
    ],
  },
  {
    id: 'bathrooms',
    photos: [
      '/projects/bathrooms/01.jpg',
      '/projects/bathrooms/02.jpg',
    ],
  },
]
