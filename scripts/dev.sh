#!/usr/bin/env bash
# Astro HMR on ASTRO_PORT, Worker/API on WORKER_PORT, /api proxied from the UI.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "${root}"

host="${ASTRO_HOST:-127.0.0.1}"
ui_port="${ASTRO_PORT:-4321}"
worker_port="${WORKER_PORT:-8788}"
worker_bind="${host}"
if [[ "${host}" == "0.0.0.0" || "${host}" == "::" ]]; then
  worker_origin="http://127.0.0.1:${worker_port}"
else
  worker_origin="http://${host}:${worker_port}"
fi
export WORKER_ORIGIN="${WORKER_ORIGIN:-${worker_origin}}"

if [[ "${ui_port}" == "${worker_port}" ]]; then
  echo "error: ASTRO_PORT and WORKER_PORT must differ (UI vs API)." >&2
  exit 1
fi

probe_host="${host}"
if [[ "${probe_host}" == "0.0.0.0" || "${probe_host}" == "::" ]]; then
  probe_host="127.0.0.1"
fi
if ! python3 - "${probe_host}" "${worker_port}" <<'PY'
import socket, sys
host, port = sys.argv[1], int(sys.argv[2])
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    sock.bind((host, port))
except OSError:
    sys.exit(1)
finally:
    sock.close()
PY
then
  server="$(curl -sI --max-time 1 "http://${probe_host}:${worker_port}/" 2>/dev/null | awk -F': ' 'tolower($1)=="server"{gsub("\r","",$2); print $2; exit}')"
  echo "error: ${probe_host}:${worker_port} is already in use${server:+ (${server})}." >&2
  echo "Pick a free Worker port, for example:" >&2
  echo "  make dev WORKER_PORT=8790" >&2
  exit 1
fi

npx wrangler d1 migrations apply barn-league-hockey --local </dev/null
mkdir -p dist

worker_pid=""

kill_tree() {
  local pid="${1}"
  local child
  for child in $(pgrep -P "${pid}" 2>/dev/null || true); do
    kill_tree "${child}"
  done
  kill "${pid}" 2>/dev/null || true
}

cleanup() {
  if [[ -n "${worker_pid}" ]]; then
    kill_tree "${worker_pid}"
    wait "${worker_pid}" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

npx wrangler dev --ip "${worker_bind}" --port "${worker_port}" --live-reload &
worker_pid=$!

ready=0
for _ in $(seq 1 50); do
  if ! kill -0 "${worker_pid}" 2>/dev/null; then
    echo "error: wrangler exited before it was ready." >&2
    exit 1
  fi
  if curl -sf "${WORKER_ORIGIN}/api/config" >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 0.2
done
if [[ "${ready}" -ne 1 ]]; then
  echo "error: Worker did not become ready at ${WORKER_ORIGIN}" >&2
  exit 1
fi

echo "UI  http://${host}:${ui_port}/   (Astro HMR — use this)"
echo "API ${WORKER_ORIGIN}/api/*"

npx astro dev --host "${host}" --port "${ui_port}"
