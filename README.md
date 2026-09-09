# DMD

Kitchen and furniture project site for DMD. Visitors send a brief; the owner replies with a materials plan and a next step.

Live at [https://dmdfurniture.uk](https://dmdfurniture.uk) (also [www](https://www.dmdfurniture.uk)).

## Stack

- Vite 8, React 19, TypeScript
- Tailwind CSS 4 and shadcn/ui
- Cloudflare Worker for the site and `POST /api/contact`
- Resend for enquiry email

Copy is English and Bulgarian. Strings live in [`src/i18n/copy.ts`](src/i18n/copy.ts). Phone, email, and photo slots stay in [`src/data/site.ts`](src/data/site.ts). Drop photos in `public/hero.jpg` and `public/projects/`, then set `heroPhoto` / `project.image` in that file.

The header switch is EN / BG. A saved choice and `?lang=bg` or `?lang=en` win. Otherwise the default is Bulgarian when Cloudflare says the visitor is in Bulgaria (`request.cf.country === BG`), and English everywhere else. The HTML for `/` is not cached publicly, so that country does not leak into another visitor’s page.

Local Vite has no Cloudflare country. If the machine timezone is `Europe/Sofia`, the default is Bulgarian.

## Local

```sh
npm install
npm run dev
```

UI: [http://localhost:5173](http://localhost:5173).

The form posts to `/api/contact`. Vite proxies that to a local Worker:

```sh
cp .dev.vars.example .dev.vars
# put RESEND_API_KEY in .dev.vars
npm run dev:api
```

`.dev.vars` is gitignored. Never commit it.

## Deploy

```sh
npm run deploy
```

That is workers.dev preview only (`dmd-preview…workers.dev`). It does **not** update the live site.

```bash
npm run deploy:prod
```

Production: `dmdfurniture.uk`, `www.dmdfurniture.uk`, and `dmd…workers.dev` (Worker name `dmd`).

Set the Resend key on Cloudflare (not in the repo). Preview and production are separate Workers, so set it on both if you need the contact form in each:

```sh
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_API_KEY --env production
```

`CONTACT_EMAIL` is a Wrangler var. With Resend’s `onboarding@resend.dev` sender, that inbox must be the Resend account email.

Pushes to `main` on [github.com/dmnovb/dmd](https://github.com/dmnovb/dmd) are the source of truth. Connect the repo under the Worker’s **Builds** settings if you want Cloudflare to deploy on push (`npm run build`, then `npx wrangler deploy --env production`).

## Docker

Optional. From this directory:

```sh
make docker-start          # Vite in a container, port 5173
make docker-refresh        # rebuild after dependency changes
docker compose --profile prod up --build   # nginx on 8080
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run dev:api` | Wrangler on port 8787 (contact API) |
| `npm run build` | Typecheck and production bundle |
| `npm run preview` | Serve the production bundle |
| `npm run lint` | Oxlint |
| `npm run deploy` | Build and deploy preview (workers.dev only) |
| `npm run deploy:prod` | Build and deploy production (custom domains) |

## shadcn

```sh
npx shadcn@latest add dialog
```

Import from `@/components/ui/...`. Theme is in `src/index.css`. Dark mode uses `next-themes` on `<html>`.
