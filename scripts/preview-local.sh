#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "${root}"

if [[ ! -d node_modules ]]; then
  npm ci
fi

host="${ASTRO_HOST:-127.0.0.1}"
port="${ASTRO_PORT:-4321}"
mock_port="${MOCK_PORT:-4174}"

echo "Landing page: http://${host}:${port}/"

if [[ "${1:-}" == "--with-mock" ]]; then
  echo "Design mock:   http://${host}:${mock_port}/LandingPage.dc.html"
  make mock &
  mock_pid=$!
  trap 'kill "${mock_pid}" 2>/dev/null || true' EXIT
fi

make dev
