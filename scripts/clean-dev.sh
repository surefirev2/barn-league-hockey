#!/usr/bin/env bash
# Free the local dev port and stop leftover astro/wrangler/workerd from this repo.
# Does not delete source, .env, node_modules, or D1 state (.wrangler/state).
set -euo pipefail

host="${ASTRO_HOST:-127.0.0.1}"
ui_port="${ASTRO_PORT:-4321}"
worker_port="${WORKER_PORT:-8788}"
ports=("${ui_port}" "${worker_port}")
repo="$(cd "$(dirname "$0")/.." && pwd)"
self="$$"
make_pid="${PPID}"

listener_pids_for() {
  local port="${1}"
  if command -v lsof >/dev/null 2>&1; then
    lsof -t -iTCP:"${port}" -sTCP:LISTEN 2>/dev/null | sort -u || true
    return
  fi
  ss -H -tlnp "sport = :${port}" 2>/dev/null |
    sed -n 's/.*pid=\([0-9]\+\).*/\1/p' | sort -u || true
}

listener_pids() {
  local port
  for port in "${ports[@]}"; do
    listener_pids_for "${port}"
  done | sort -u
}

pid_cmd() {
  ps -p "${1}" -o args= 2>/dev/null | tr -s ' ' | sed 's/^ //' || true
}

pid_cwd() {
  readlink "/proc/${1}/cwd" 2>/dev/null || true
}

pid_comm() {
  ps -p "${1}" -o comm= 2>/dev/null || echo unknown
}

describe_pid() {
  local pid="${1}"
  printf 'pid %s (%s): %s' "${pid}" "$(pid_comm "${pid}")" "$(pid_cmd "${pid}")"
}

is_protected() {
  local pid="${1}"
  [[ "${pid}" == "${self}" || "${pid}" == "${make_pid}" || "${pid}" == "1" ]]
}

is_our_dev_server() {
  local pid="${1}"
  local cmd cwd
  cmd="$(pid_cmd "${pid}")"
  cwd="$(pid_cwd "${pid}")"
  case "${cmd}" in
    *"${repo}"*) ;;
    *)
      if [[ "${cwd}" != "${repo}" && "${cwd}" != "${repo}/"* ]]; then
        return 1
      fi
      ;;
  esac
  case "${cmd}" in
    *"astro dev"* | *"astro preview"* | *"wrangler dev"* | *workerd* | *"/vite"*)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

stop_pid() {
  local pid="${1}"
  if is_protected "${pid}"; then
    return 0
  fi
  if ! kill -0 "${pid}" 2>/dev/null; then
    return 0
  fi
  echo "  stopping $(describe_pid "${pid}")"
  kill "${pid}" 2>/dev/null || true
  local i=0
  while kill -0 "${pid}" 2>/dev/null && [[ "${i}" -lt 20 ]]; do
    sleep 0.1
    i=$((i + 1))
  done
  if kill -0 "${pid}" 2>/dev/null; then
    kill -9 "${pid}" 2>/dev/null || true
  fi
}

candidate_pids() {
  pgrep -f 'astro dev|astro preview|wrangler dev|workerd' 2>/dev/null || true
  listener_pids
}

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  docker compose -f "${repo}/compose.yaml" --project-directory "${repo}" down --timeout 3 >/dev/null 2>&1 || true
fi

stopped=0
seen=" "
while read -r pid; do
  [[ -n "${pid}" ]] || continue
  case "${seen}" in
    *" ${pid} "*) continue ;;
  esac
  seen="${seen}${pid} "
  if is_our_dev_server "${pid}"; then
    stop_pid "${pid}"
    stopped=1
  fi
done < <(candidate_pids | sort -u)

rm -rf "${repo}/.wrangler/tmp"

i=0
while [[ -n "$(listener_pids)" && "${i}" -lt 30 ]]; do
  sleep 0.1
  i=$((i + 1))
done

left="$(listener_pids)"
if [[ -z "${left}" ]]; then
  if [[ "${stopped}" -eq 1 ]]; then
    echo "Freed ${host}:${ui_port} and :${worker_port}."
  fi
  exit 0
fi

echo "error: ${host}:${ui_port} or :${worker_port} is already in use:" >&2
for pid in ${left}; do
  echo "  $(describe_pid "${pid}")" >&2
done
echo "Stop that process, or override the ports:" >&2
echo "  make dev ASTRO_PORT=4322 WORKER_PORT=8790" >&2
echo "  ASTRO_PORT=4322 docker compose up" >&2
exit 1
