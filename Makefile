# Makefile
ASTRO_HOST ?= 127.0.0.1
ASTRO_PORT ?= 4321
MOCK_PORT ?= 4174

.PHONY: init run-pre-commit dev preview mock build check test secrets/sync tokens/mint deploy

init:
	pre-commit install

run-pre-commit:
	pre-commit run --all-files

dev:
	npx astro dev --host $(ASTRO_HOST) --port $(ASTRO_PORT)

preview: build
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
	set -a && . ./.env && set +a && npx wrangler deploy
