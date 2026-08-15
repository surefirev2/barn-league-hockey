# Makefile
ASTRO_HOST ?= 127.0.0.1
ASTRO_PORT ?= 4321
WORKER_PORT ?= 8788
MOCK_PORT ?= 4174

.PHONY: init run-pre-commit clean clean-data dev astro preview mock build check test secrets/sync tokens/mint deploy docker docker-down

init:
	pre-commit install

run-pre-commit:
	pre-commit run --all-files

clean:
	ASTRO_HOST=$(ASTRO_HOST) ASTRO_PORT=$(ASTRO_PORT) WORKER_PORT=$(WORKER_PORT) ./scripts/clean-dev.sh

# Wipes local D1/R2/Queue state. make dev re-applies D1 migrations.
clean-data: clean
	rm -rf .wrangler/state
	-docker compose down -v --timeout 3

dev: clean
	ASTRO_HOST=$(ASTRO_HOST) ASTRO_PORT=$(ASTRO_PORT) WORKER_PORT=$(WORKER_PORT) ./scripts/dev.sh

astro: clean
	npx astro dev --host $(ASTRO_HOST) --port $(ASTRO_PORT)

preview: clean build
	npx astro preview --host $(ASTRO_HOST) --port $(ASTRO_PORT)

mock:
	python3 -m http.server $(MOCK_PORT) --bind $(ASTRO_HOST) --directory docs/design/landingpage-mockup

build:
	npm run build

check:
	npm run check

test:
	npm test

secrets/sync:
	./scripts/sync-github-secrets.sh

tokens/mint:
	./scripts/create-least-privilege-token.sh

deploy: build
	@test -f .env || (echo "copy .env.example to .env" >&2 && exit 1)
	set -a && . ./.env && set +a && npx wrangler d1 migrations apply barn-league-hockey --remote </dev/null
	set -a && . ./.env && set +a && npx wrangler deploy

docker: clean
	docker compose up

docker-down:
	docker compose down
