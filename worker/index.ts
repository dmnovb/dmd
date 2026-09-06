const MAX_FILES = 5
const MAX_FILE_BYTES = 8 * 1024 * 1024
const MAX_TOTAL_BYTES = 20 * 1024 * 1024
const MAX_MESSAGE = 8000
const MAX_NAME = 100
const MAX_EMAIL = 254

const ALLOWED_ORIGINS = new Set([
  'https://dmdfurniture.uk',
  'https://www.dmdfurniture.uk',
  'https://dmd.boqn-damqnov03.workers.dev',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
])

const MIME_BY_KIND = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  pdf: 'application/pdf',
} as const

type FileKind = keyof typeof MIME_BY_KIND

type WorkerEnv = Env & {
  RESEND_API_KEY?: string
  ASSETS: { fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> }
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)
    const country = visitorCountry(request)

    if (url.pathname === '/api/contact') {
      return handleContact(request, env)
    }

    if (url.pathname === '/' || url.pathname === '/index.html') {
      const page = await env.ASSETS.fetch(request)
      return injectCountry(page, country)
    }

    return Response.json({ error: 'not_found' }, { status: 404 })
  },
} satisfies ExportedHandler<WorkerEnv>

function visitorCountry(request: Request): string {
  const country = request.cf?.country
  return typeof country === 'string' ? country : ''
}

function injectCountry(response: Response, country: string): Response {
  const rewritten = new HTMLRewriter()
    .on('script#geo-boot', {
      element(element) {
        element.setInnerContent(`window.__COUNTRY__=${JSON.stringify(country)}`)
      },
    })
    .transform(response)

  const headers = withSecurityHeaders(new Headers(rewritten.headers))
  headers.set('Cache-Control', 'private, no-cache')
  if (country) {
    headers.append(
      'Set-Cookie',
      `dmd-country=${country}; Path=/; Max-Age=86400; SameSite=Lax; Secure`,
    )
  }

  return new Response(rewritten.body, {
    status: rewritten.status,
    statusText: rewritten.statusText,
    headers,
  })
}

function withSecurityHeaders(headers: Headers): Headers {
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  )
  return headers
}

async function handleContact(request: Request, env: WorkerEnv): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'method' }, { status: 405 })
  }

  const origin = request.headers.get('Origin')
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return Response.json({ error: 'forbidden' }, { status: 403 })
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL) {
    return Response.json({ error: 'not_configured' }, { status: 503 })
  }

  const incoming = await request.formData()

  // Bots fill hidden fields. Pretend success so they move on.
  if (String(incoming.get('website') ?? '').trim()) {
    return Response.json({ ok: true })
  }

  const name = sanitizeLine(String(incoming.get('name') ?? ''), MAX_NAME)
  const email = String(incoming.get('email') ?? '').trim()
  const project = String(incoming.get('project') ?? '').trim()
  const locale = String(incoming.get('locale') ?? '').trim()
  const language = locale === 'bg' ? 'Bulgarian' : locale === 'en' ? 'English' : '—'

  if (
    !email ||
    email.length > MAX_EMAIL ||
    /[\r\n<>]/.test(email) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !project
  ) {
    return Response.json({ error: 'invalid' }, { status: 400 })
  }

  if (project.length > MAX_MESSAGE) {
    return Response.json({ error: 'too_long' }, { status: 400 })
  }

  const files = incoming
    .getAll('photos')
    .filter((value): value is File => value instanceof File && value.size > 0)

  if (files.length > MAX_FILES) {
    return Response.json({ error: 'too_many_files' }, { status: 400 })
  }

  let total = 0
  const attachments: { filename: string; content: string; content_type: string }[] = []

  for (const [index, file] of files.entries()) {
    if (file.size > MAX_FILE_BYTES) {
      return Response.json({ error: 'file_too_large' }, { status: 400 })
    }
    total += file.size
    if (total > MAX_TOTAL_BYTES) {
      return Response.json({ error: 'file_too_large' }, { status: 400 })
    }

    const bytes = new Uint8Array(await file.arrayBuffer())
    const kind = detectFileKind(bytes)
    if (!kind) {
      return Response.json({ error: 'file_type' }, { status: 400 })
    }

    attachments.push({
      filename: `photo-${index + 1}.${kind}`,
      content: bufferToBase64(bytes.buffer),
      content_type: MIME_BY_KIND[kind],
    })
  }

  const lines = [
    'Sent from the DMD website form. Reply-to is the address the visitor typed — it is not verified.',
  ]
  if (attachments.length) {
    lines.push(
      'Attachments are forwarded as sent. Open them only if you trust the sender.',
    )
  }
  lines.push(
    '',
    name ? `Name: ${name}` : 'Name: —',
    `Email: ${email}`,
    `Language: ${language}`,
    '',
    project,
  )

  const resend = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'DMD website <onboarding@resend.dev>',
      to: [env.CONTACT_EMAIL],
      reply_to: email,
      subject: name ? `Project from ${name}` : 'Project from the website',
      text: lines.join('\n'),
      attachments,
    }),
  })

  if (!resend.ok) {
    console.error('resend_failed', resend.status)
    return Response.json({ error: 'send_failed' }, { status: 502 })
  }

  return Response.json({ ok: true })
}

function sanitizeLine(value: string, max: number): string {
  return value.replace(/[\r\n]+/g, ' ').trim().slice(0, max)
}

function detectFileKind(bytes: Uint8Array): FileKind | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpg'
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'png'
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'webp'
  }
  if (
    bytes.length >= 4 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46
  ) {
    return 'pdf'
  }
  return null
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  const chunk = 0x8000
  let binary = ''
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}
