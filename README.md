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

Local:

```sh
npm run deploy
```

That is `npm run build` then `wrangler deploy`. Routes are `dmdfurniture.uk` and `www.dmdfurniture.uk` in [`wrangler.jsonc`](wrangler.jsonc).

Production releases are manual. In GitHub: **Actions → Release → Run workflow**. That builds `dist`, deploys the Worker, and creates a GitHub release (`release-N`). It does not run on push.

Repo secrets (Settings → Secrets and variables → Actions):

| Secret | What it is |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Account API token with **Edit Cloudflare Workers** |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

Create the token in the [Cloudflare dashboard](https://dash.cloudflare.com/profile/api-tokens). Scope it to this account only.

Set the Resend key on Cloudflare (not in the repo, not in GitHub):

```sh
npx wrangler secret put RESEND_API_KEY
```

`CONTACT_EMAIL` is a Wrangler var. With Resend’s `onboarding@resend.dev` sender, that inbox must be the Resend account email.

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
| `npm run deploy` | Build and deploy with Wrangler |

## shadcn

```sh
npx shadcn@latest add dialog
```

Import from `@/components/ui/...`. Theme is in `src/index.css`. Dark mode uses `next-themes` on `<html>`.
