.PHONY: docker-start docker-refresh

# Local overlay (.docker/local) — Vite HMR on :5173
# --no-deps: do not run the `base` image as a container
docker-start:
	docker compose up --build --no-deps --remove-orphans local

# Rebuild the local overlay and recreate volumes (use after dependency changes)
docker-refresh:
	docker compose down -v --remove-orphans
	docker compose up --build --no-deps --force-recreate local
