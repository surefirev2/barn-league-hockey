#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
env_file="${root}/.env"

if [[ ! -f "${env_file}" ]]; then
  echo "missing .env — copy .env.example and fill CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN" >&2
  exit 1
fi

allowlist=(CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_API_TOKEN)

get_val() {
  local key="$1"
  local line
  line="$(grep -E "^${key}=" "${env_file}" | tail -n1 || true)"
  if [[ -z "${line}" ]]; then
    echo "missing ${key} in .env" >&2
    exit 1
  fi
  printf '%s' "${line#*=}"
}

for key in "${allowlist[@]}"; do
  val="$(get_val "${key}")"
  if [[ -z "${val}" ]]; then
    echo "${key} is empty in .env" >&2
    exit 1
  fi
  printf '%s' "${val}" | gh secret set "${key}"
  echo "set ${key}"
done
