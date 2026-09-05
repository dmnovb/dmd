# DMD

Kitchen and furniture project site for DMD. Visitors send a brief; the owner replies with a materials plan and a next step.

Live at [https://dmdfurniture.uk](https://dmdfurniture.uk) (also [www](https://www.dmdfurniture.uk)).

## Stack

- Vite 8, React 19, TypeScript
- Tailwind CSS 4 and shadcn/ui
- Cloudflare Worker for the site and `POST /api/contact`
- Resend for enquiry email

Copy and project slots live in [`src/data/site.ts`](src/data/site.ts). Drop photos in `public/hero.jpg` and `public/projects/`, then set `heroPhoto` / `project.image` in that file.

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

That is `npm run build` then `wrangler deploy`. Routes are `dmdfurniture.uk` and `www.dmdfurniture.uk` in [`wrangler.jsonc`](wrangler.jsonc).

Set the Resend key on Cloudflare (not in the repo):

```sh
npx wrangler secret put RESEND_API_KEY
```

`CONTACT_EMAIL` is a Wrangler var. With Resend’s `onboarding@resend.dev` sender, that inbox must be the Resend account email.

Pushes to `main` on [github.com/dmnovb/dmd](https://github.com/dmnovb/dmd) are the source of truth. Connect the repo under the Worker’s **Builds** settings if you want Cloudflare to deploy on push (`npm run build`, then `npx wrangler deploy`).

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
