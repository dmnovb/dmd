# Frontend

Vite + React + Tailwind + shadcn/ui, with Docker for both local HMR and a production nginx build. Run commands from this directory.

## Stack

- Vite 8 + React 19 + TypeScript
- Tailwind CSS 4 (`@tailwindcss/vite`)
- shadcn/ui (Nova / Radix)
- `.docker/Dockerfile.base` (Node OS + deps) with `.docker/local/` and `.docker/remote/` overlays

## Start locally

```sh
npm install
npm run dev
```

App runs at [http://localhost:5173](http://localhost:5173).

## Start with Docker

Dev server (local overlay, source mounted, HMR on):

```sh
make docker-start
```

Rebuild the local overlay after dependency or Dockerfile changes (drops the anonymous `node_modules` volume and recreates containers):

```sh
make docker-refresh
```

Production image (remote overlay, static files behind nginx on port 8080):

```sh
docker compose --profile prod up --build
```

Published image from Docker Hub (`latest`, no git pull, no local build):

```sh
docker compose --profile hub pull
docker compose --profile hub up
```

The anonymous `node_modules` volume keeps container installs off your host.

### Docker layout

| Path | Role |
| --- | --- |
| `.docker/Dockerfile.base` | Node Alpine base image with `npm ci` and app source |
| `.docker/local/Dockerfile.local` | Dev overlay; runs Vite via `entrypoint.sh` |
| `.docker/remote/Dockerfile.remote` | Production overlay; builds static assets and serves nginx |
| `.docker/local/entrypoint.sh` | Setup, then `exec npm run dev …` (long-running) |
| `.docker/remote/entrypoint.sh` | Config check, then `exec nginx …` (long-running) |

`make docker-start` and `make docker-refresh` run the **local** overlay only (`local` service). The **remote** overlay is the `prod` profile (`remote` service). `base` is a build-only image; the Makefile does not start it as a container.

## Publish `latest` (GitHub Actions → Docker Hub)

Pushes to `main` that touch `Frontend/` build the production image and push `bleudechanel/frontend:latest` (and a `sha-…` tag).

Add these on the GitHub repo (**Settings → Secrets and variables → Actions**):

| Name | Where | Value |
| --- | --- | --- |
| `DOCKERHUB_USERNAME` | Variable or secret | Docker Hub username |
| `DOCKERHUB_TOKEN` | Secret | [Access token](https://hub.docker.com/settings/security) with Read & Write |

Override the pull image name with `DOCKERHUB_IMAGE=youruser/frontend:latest` if it is not `bleudechanel/frontend`.

## Add shadcn components

```sh
npx shadcn@latest add dialog
```

Then import from `@/components/ui/...`. Theme lives in `src/index.css`. Dark mode uses `next-themes` with a class on `<html>`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production bundle |
| `npm run preview` | Serve the production bundle |
| `npm run lint` | Oxlint |
