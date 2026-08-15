# Makefile
.PHONY: init run-pre-commit dev build check test secrets/sync tokens/mint deploy

init:
	pre-commit install

run-pre-commit:
	pre-commit run --all-files

dev:
	npm run dev

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
