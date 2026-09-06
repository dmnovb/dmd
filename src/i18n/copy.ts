import type { ProjectId } from '@/data/site'

export const locales = ['en', 'bg'] as const

export type Locale = (typeof locales)[number]

export type Copy = {
  meta: {
    title: string
    description: string
  }
  skip: string
  nav: { label: string; href: string }[]
  header: {
    send: string
  }
  language: {
    label: string
  }
  theme: {
    toggle: string
    light: string
    dark: string
    system: string
  }
  hero: {
    headline: string
    standfirst: string
    photoAlt: string
  }
  help: {
    heading: string
    items: { title: string; body: string }[]
  }
  steps: {
    heading: string
    items: { title: string; body: string }[]
  }
  projects: {
    heading: string
    standfirst: string
    items: Record<ProjectId, { title: string; caption: string }>
  }
  contact: {
    heading: string
    standfirst: string
    name: string
    namePlaceholder: string
    email: string
    project: string
    projectPlaceholder: string
    photos: string
    photosHint: string
    sending: string
    submit: string
    sent: string
    telephone: string
    hoursLabel: string
    hours: string
    errors: {
      invalid: string
      too_long: string
      too_many_files: string
      file_too_large: string
      file_type: string
      send_failed: string
      not_configured: string
    }
  }
  footer: {
    blurb: string
  }
}

export const copy: Record<Locale, Copy> = {
  en: {
    meta: {
      title: 'DMD — Kitchen and furniture projects',
      description:
        'Send a kitchen or furniture project. Get a materials plan and a next step — DIY, another tradesperson, or a build.',
    },
    skip: 'Skip to send your project',
    nav: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' },
    ],
    header: {
      send: 'Send your project',
    },
    language: {
      label: 'Language',
    },
    theme: {
      toggle: 'Toggle theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    hero: {
      headline: 'Planning a kitchen? Send the project first.',
      standfirst:
        'A photo, a sketch, or a quote you already have is enough. I will come back with a materials plan and a next step — do it yourself, hire someone else, or have me build it.',
      photoAlt: 'A recent kitchen',
    },
    help: {
      heading: 'What you get',
      items: [
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
      ],
    },
    steps: {
      heading: 'How it works',
      items: [
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
      ],
    },
    projects: {
      heading: 'Projects',
      standfirst: 'Recent kitchens and one piece of furniture.',
      items: {
        'kitchen-north': {
          title: 'Kitchen, north side',
          caption: 'Full kitchen. Cabinets, worktops, and the run to the window.',
        },
        'kitchen-terrace': {
          title: 'Kitchen, terrace house',
          caption: 'Narrow galley. New run of units and a single stretch of worktop.',
        },
        wardrobe: {
          title: 'Built-in wardrobe',
          caption: 'Floor to ceiling, scribed to an alcove that was not square.',
        },
        table: {
          title: 'Dining table',
          caption: 'Solid hardwood, made for an eight-seat room.',
        },
      },
    },
    contact: {
      heading: 'Send your project',
      standfirst:
        'Write what you want to do and attach photos if you have them. I will reply in a few days.',
      name: 'Name',
      namePlaceholder: 'Optional',
      email: 'Email',
      project: 'The project',
      projectPlaceholder:
        'The room, what you want, and anything you already have — photos, a sketch, a quote.',
      photos: 'Photos',
      photosHint: 'Optional. Up to five JPEG, PNG, WebP, or PDF files, 8 MB each.',
      sending: 'Sending…',
      submit: 'Send the enquiry',
      sent: 'Sent. I will write back in a few days.',
      telephone: 'Telephone',
      hoursLabel: 'Hours',
      hours: 'Weekdays, by appointment',
      errors: {
        invalid: 'Add an email and a short note about the project.',
        too_long: 'That note is too long — try a shorter version.',
        too_many_files: 'You can attach up to five files.',
        file_too_large: 'Those files are too large. Keep each under 8 MB.',
        file_type: 'Those files are not allowed. Use JPEG, PNG, WebP, or PDF.',
        send_failed:
          'It did not go through. Try again, or ring the number on the right.',
        not_configured:
          'It did not go through. Try again, or ring the number on the right.',
      },
    },
    footer: {
      blurb:
        'Kitchen and furniture projects. A plan first — a build when that is the right call.',
    },
  },
  bg: {
    meta: {
      title: 'DMD — Кухненски и мебелни проекти',
      description:
        'Пратете кухненски или мебелен проект. Получавате план за материали и следваща стъпка — сами, друг майстор, или изработка.',
    },
    skip: 'Към формата за проекта',
    nav: [
      { label: 'Как работи', href: '#how-it-works' },
      { label: 'Проекти', href: '#projects' },
      { label: 'Контакт', href: '#contact' },
    ],
    header: {
      send: 'Пратете проекта',
    },
    language: {
      label: 'Език',
    },
    theme: {
      toggle: 'Смяна на темата',
      light: 'Светла',
      dark: 'Тъмна',
      system: 'Системна',
    },
    hero: {
      headline: 'Планирате кухня? Пратете проекта първо.',
      standfirst:
        'Снимка, скица или оферта, която вече имате, стига. Ще се върна с план за материали и следваща стъпка — сами, друг майстор, или аз да го направя.',
      photoAlt: 'Скорошна кухня',
    },
    help: {
      heading: 'Какво получавате',
      items: [
        {
          title: 'План за действие',
          body: 'Редът на работата, какво да решите първо и какво може да почака. Предимно кухни — мебели и вградени също.',
        },
        {
          title: 'Материали и обков',
          body: 'Какво да купите, какво да пропуснете и какво ще издържи в това помещение. Конкретни продукти, не колаж от идеи.',
        },
        {
          title: 'Поглед към оферта или проект',
          body: 'Ако вече имате цена или чертеж, ще кажа дали спецификацията и сумата имат смисъл.',
        },
        {
          title: 'Изработката, ако това е верният ход',
          body: 'Мога и да го направя. Ще кажа, ако не трябва — сами или друг майстор може да е по-добрият път.',
        },
      ],
    },
    steps: {
      heading: 'Как работи',
      items: [
        {
          title: 'Пратете проекта',
          body: 'Снимки на помещението, скица, списък какво искате, или оферта, за която не сте сигурни.',
        },
        {
          title: 'Първи поглед',
          body: 'Отговарям в рамките на няколко дни с честен прочит: какво е право, какво не е, и какво бих направил след това.',
        },
        {
          title: 'Следващата стъпка',
          body: 'Платен съвет с цена, уговорена предварително — или оферта за изработка, ако аз да го направя е верният ход.',
        },
      ],
    },
    projects: {
      heading: 'Проекти',
      standfirst: 'Последни кухни и една мебел.',
      items: {
        'kitchen-north': {
          title: 'Кухня, северна страна',
          caption: 'Цяла кухня. Шкафове, плотове и линията до прозореца.',
        },
        'kitchen-terrace': {
          title: 'Кухня, редова къща',
          caption: 'Тясна галерия. Нова линия шкафове и един участък плот.',
        },
        wardrobe: {
          title: 'Вграден гардероб',
          caption: 'От пода до тавана, припаснат към ниша, която не беше права.',
        },
        table: {
          title: 'Трапезна маса',
          caption: 'Масивно дърво, за стая с осем места.',
        },
      },
    },
    contact: {
      heading: 'Пратете проекта',
      standfirst:
        'Напишете какво искате да направите и прикачете снимки, ако имате. Ще отговоря след няколко дни.',
      name: 'Име',
      namePlaceholder: 'По желание',
      email: 'Имейл',
      project: 'Проектът',
      projectPlaceholder:
        'Помещението, какво искате и каквото вече имате — снимки, скица, оферта.',
      photos: 'Снимки',
      photosHint: 'По желание. До пет JPEG, PNG, WebP или PDF, по 8 MB.',
      sending: 'Изпращане…',
      submit: 'Изпратете запитването',
      sent: 'Изпратено. Ще отговоря след няколко дни.',
      telephone: 'Телефон',
      hoursLabel: 'Часове',
      hours: 'Делнични дни, след уговорка',
      errors: {
        invalid: 'Добавете имейл и кратко описание на проекта.',
        too_long: 'Бележката е твърде дълга — опитайте по-кратка версия.',
        too_many_files: 'Може да прикачите до пет файла.',
        file_too_large: 'Файловете са твърде големи. Всеки да е под 8 MB.',
        file_type: 'Тези файлове не стават. Използвайте JPEG, PNG, WebP или PDF.',
        send_failed:
          'Не мина. Опитайте пак или се обадете на номера вдясно.',
        not_configured:
          'Не мина. Опитайте пак или се обадете на номера вдясно.',
      },
    },
    footer: {
      blurb:
        'Кухненски и мебелни проекти. Първо план — изработка, когато това е верният ход.',
    },
  },
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'bg'
}
