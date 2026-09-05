const MAX_FILES = 5
const MAX_FILE_BYTES = 8 * 1024 * 1024
const MAX_TOTAL_BYTES = 20 * 1024 * 1024
const MAX_MESSAGE = 8000

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

  const headers = new Headers(rewritten.headers)
  headers.set('Cache-Control', 'private, no-cache')
  if (country) {
    headers.append(
      'Set-Cookie',
      `dmd-country=${country}; Path=/; Max-Age=86400; SameSite=Lax`,
    )
  }

  return new Response(rewritten.body, {
    status: rewritten.status,
    statusText: rewritten.statusText,
    headers,
  })
}

async function handleContact(request: Request, env: WorkerEnv): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'method' }, { status: 405 })
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL) {
    return Response.json({ error: 'not_configured' }, { status: 503 })
  }

  const incoming = await request.formData()

  // Bots fill hidden fields. Pretend success so they move on.
  if (String(incoming.get('website') ?? '').trim()) {
    return Response.json({ ok: true })
  }

  const name = String(incoming.get('name') ?? '').trim()
  const email = String(incoming.get('email') ?? '').trim()
  const project = String(incoming.get('project') ?? '').trim()
  const locale = String(incoming.get('locale') ?? '').trim()
  const language =
    locale === 'bg' ? 'Bulgarian' : locale === 'en' ? 'English' : locale || '—'

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !project) {
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
  const attachments: { filename: string; content: string }[] = []

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      return Response.json({ error: 'file_too_large' }, { status: 400 })
    }
    total += file.size
    if (total > MAX_TOTAL_BYTES) {
      return Response.json({ error: 'file_too_large' }, { status: 400 })
    }
    attachments.push({
      filename: file.name || 'upload',
      content: bufferToBase64(await file.arrayBuffer()),
    })
  }

  const lines = [
    name ? `Name: ${name}` : 'Name: —',
    `Email: ${email}`,
    `Language: ${language}`,
    '',
    project,
  ]

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

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  const chunk = 0x8000
  let binary = ''
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}
