/**
 * Every word on the site lives here. Swap the placeholders and drop
 * photos into public/projects/ — the page reads from this file.
 */

export const business = {
  name: 'DMD',
  email: 'damyanov_d@yahoo.co.uk',
  phone: '089 241 0451',
  phoneHref: '+359892410451',
  hours: 'Weekdays, by appointment',
} as const

export const nav = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
] as const

export const hero = {
  headline: 'Planning a kitchen? Send the project first.',
  standfirst:
    'A photo, a sketch, or a quote you already have is enough. I will come back with a materials plan and a next step — do it yourself, hire someone else, or have me build it.',
  photoHint: 'public/hero.jpg',
} as const

/** Set to '/hero.jpg' once the file is in public/. */
export const heroPhoto: string | undefined = undefined

export const help = [
  {
    title: 'A plan of action',
    body: 'The order of work, what to decide first, and what can wait. Kitchens mostly — furniture and built-ins too.',
  },
  {
    title: 'Materials and hardware',
    body: 'What to buy, what to skip, and what will last in that room. Named products, not a mood board.',
  },
  {
    title: 'A look at a quote or design',
    body: 'If you already have a price or a drawing, I will tell you whether the spec and the number make sense.',
  },
  {
    title: 'The build, if that is the right call',
    body: 'I can also do the work. I will say so if I should not — DIY or another tradesperson may be the better route.',
  },
] as const

export const steps = [
  {
    title: 'Send the project',
    body: 'Photos of the room, a sketch, a list of what you want, or a quote you are unsure about.',
  },
  {
    title: 'A first look',
    body: 'I reply within a few days with an honest read: what is straightforward, what is not, and what I would do next.',
  },
  {
    title: 'The next step',
    body: 'Paid advice with the price agreed first — or a build quote, if having me do it is the right call.',
  },
] as const

export type Project = {
  title: string
  caption: string
  /** Path shown on the empty frame, and used once the file exists. */
  file: string
  /** Set when the photo is actually in public/. */
  image?: string
}

export const projects: Project[] = [
  {
    title: 'Kitchen, north side',
    caption: 'Full kitchen. Cabinets, worktops, and the run to the window.',
    file: '/projects/kitchen-north.jpg',
  },
  {
    title: 'Kitchen, terrace house',
    caption: 'Narrow galley. New run of units and a single stretch of worktop.',
    file: '/projects/kitchen-terrace.jpg',
  },
  {
    title: 'Built-in wardrobe',
    caption: 'Floor to ceiling, scribed to an alcove that was not square.',
    file: '/projects/wardrobe.jpg',
  },
  {
    title: 'Dining table',
    caption: 'Solid hardwood, made for an eight-seat room.',
    file: '/projects/table.jpg',
  },
]

export const contact = {
  heading: 'Send your project',
  standfirst:
    'Write what you want to do and attach photos if you have them. I will reply in a few days.',
} as const
