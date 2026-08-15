#!/usr/bin/env bash
# Mint a least-privilege Cloudflare token for wrangler deploy of this Worker.
#
# Bootstrap token needs "Create additional tokens" (user) or Account API Tokens
# Write (account-owned). Do not reuse that token in GitHub Actions.
#
# Usage: fill .env.bootstrap (regular file or 1Password Environments FIFO mount)
#   then ./scripts/create-least-privilege-token.sh
#
# Writes CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to .env. Does not print
# the token. Logs go to stderr.
set -euo pipefail

API_BASE="https://api.cloudflare.com/client/v4"
TOKEN_NAME="${CLOUDFLARE_TOKEN_NAME:-barn-league-hockey-deploy}"
ZONE_NAME="${CLOUDFLARE_ZONE_NAME:-hutch.fail}"
CF_TOKEN_SCOPE=""
CF_API_STATUS=""
CF_API_BODY=""
CF_NEW_TOKEN_VALUE=""

log() { printf '%s\n' "$*" >&2; }

die() {
  log "error: $*"
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "need ${1} on PATH"
}

upsert_env_key() {
  local file="$1"
  local key="$2"
  local value="$3"
  local tmp
  tmp="$(mktemp)"
  if [[ -f "${file}" ]]; then
    grep -vE "^${key}=" "${file}" >"${tmp}" || true
  else
    : >"${tmp}"
  fi
  printf '%s=%s\n' "${key}" "${value}" >>"${tmp}"
  mv "${tmp}" "${file}"
}

strip_env_keys() {
  local file="$1"
  shift
  local key tmp
  [[ -f "${file}" ]] || return 0
  tmp="$(mktemp)"
  cp "${file}" "${tmp}"
  for key in "$@"; do
    grep -vE "^${key}=" "${tmp}" >"${tmp}.next" || true
    mv "${tmp}.next" "${tmp}"
  done
  mv "${tmp}" "${file}"
}

ensure_env_file() {
  local root="$1"
  local out="${root}/.env"
  if [[ ! -f "${out}" ]]; then
    if [[ -f "${root}/.env.example" ]]; then
      cp "${root}/.env.example" "${out}"
      log "created ${out} from .env.example"
    else
      : >"${out}"
      log "created empty ${out}"
    fi
  fi
  printf '%s' "${out}"
}

# Regular gitignored file or 1Password Environments local .env mount (FIFO).
# https://developer.1password.com/docs/environments/local-env-file/
bootstrap_present() {
  local path="$1"
  [[ -f "${path}" || -p "${path}" ]]
}

apply_env_line() {
  local line="$1"
  local key value
  line="${line%$'\r'}"
  line="${line#"${line%%[![:space:]]*}"}"
  [[ -z "${line}" || "${line}" == \#* ]] && return 0
  [[ "${line}" == export[[:space:]]* ]] && line="${line#export }"
  line="${line#"${line%%[![:space:]]*}"}"
  [[ "${line}" == *=* ]] || return 0
  key="${line%%=*}"
  value="${line#*=}"
  key="${key%"${key##*[![:space:]]}"}"
  if [[ "${value}" == \"*\" || "${value}" == \'*\' ]]; then
    value="${value:1:-1}"
  fi
  case "${key}" in
    CLOUDFLARE_BOOTSTRAP_API_TOKEN | CLOUDFLARE_ACCOUNT_ID | CLOUDFLARE_ZONE_ID | CLOUDFLARE_ZONE_NAME | CLOUDFLARE_TOKEN_NAME | CLOUDFLARE_API_TOKEN)
      if [[ -z "${!key:-}" ]]; then
        printf -v "${key}" '%s' "${value}"
        export "${key}"
      fi
      ;;
  esac
}

# Source KEY=VALUE pairs from a regular file or 1Password FIFO. Cat the pipe
# once into a temp file so bash does not hang on a second read.
load_env_file() {
  local file="$1"
  local src="${file}"
  local tmp=""
  local line
  if ! bootstrap_present "${file}"; then
    die "missing ${file} — mount a 1Password Environments local .env here, or copy .env.bootstrap.example"
  fi
  if [[ -p "${file}" ]]; then
    log "reading 1Password Environments mount ${file} (authorize if prompted)"
    tmp="$(mktemp)"
    if ! cat "${file}" >"${tmp}"; then
      rm -f "${tmp}"
      die "failed to read ${file} — unlock 1Password and authorize the mount"
    fi
    if [[ ! -s "${tmp}" ]]; then
      rm -f "${tmp}"
      die "empty read from ${file} — check the Environment has variables and the mount is enabled"
    fi
    src="${tmp}"
  fi
  while IFS= read -r line || [[ -n "${line}" ]]; do
    apply_env_line "${line}"
  done <"${src}"
  if [[ -n "${tmp}" ]]; then
    rm -f "${tmp}"
  fi
}

cf_api() {
  local method="$1"
  local path="$2"
  shift 2
  local tmp status
  tmp="$(mktemp)"
  status="$(
    curl -sS -o "${tmp}" -w '%{http_code}' -X "${method}" "${API_BASE}${path}" \
      -H "Authorization: Bearer ${CLOUDFLARE_BOOTSTRAP_API_TOKEN}" \
      -H "Accept: application/json" \
      -H "Content-Type: application/json" \
      "$@"
  )"
  CF_API_STATUS="${status}"
  CF_API_BODY="$(cat "${tmp}")"
  rm -f "${tmp}"
}

tokens_base() {
  local account_id="$1"
  if [[ "${CF_TOKEN_SCOPE}" == "account" ]]; then
    printf '/accounts/%s/tokens' "${account_id}"
  else
    printf '/user/tokens'
  fi
}

detect_token_scope() {
  local account_id="$1"
  cf_api GET "/accounts/${account_id}/tokens/verify"
  if [[ "${CF_API_STATUS}" == "200" ]] && jq -e '.success == true' >/dev/null 2>&1 <<<"${CF_API_BODY}"; then
    CF_TOKEN_SCOPE=account
    log "bootstrap token is account-owned"
    return 0
  fi
  cf_api GET "/user/tokens/verify"
  if [[ "${CF_API_STATUS}" == "200" ]] && jq -e '.success == true' >/dev/null 2>&1 <<<"${CF_API_BODY}"; then
    CF_TOKEN_SCOPE=user
    log "bootstrap token is user-owned"
    return 0
  fi
  die "bootstrap token failed verify (need Create additional tokens or Account API Tokens Write)"
}

perm_id() {
  local name="$1"
  local scope="$2"
  local encoded path
  encoded="$(printf '%s' "${name}" | jq -sRr @uri)"
  path="$(tokens_base "${CLOUDFLARE_ACCOUNT_ID}")/permission_groups?name=${encoded}"
  cf_api GET "${path}"
  if [[ "${CF_API_STATUS}" != "200" ]]; then
    die "list permission groups failed HTTP ${CF_API_STATUS}: ${CF_API_BODY}"
  fi
  local id
  id="$(
    jq -r --arg n "${name}" --arg s "${scope}" '
      [.result[]? | select(.name == $n) | select(any(.scopes[]?; . == $s))][0].id // empty
    ' <<<"${CF_API_BODY}"
  )"
  [[ -n "${id}" && "${id}" != "null" ]] || die "permission group not found: ${name} (${scope})"
  printf '%s' "${id}"
}

resolve_zone_id() {
  if [[ -n "${CLOUDFLARE_ZONE_ID:-}" ]]; then
    log "using CLOUDFLARE_ZONE_ID ${CLOUDFLARE_ZONE_ID}"
    printf '%s' "${CLOUDFLARE_ZONE_ID}"
    return 0
  fi
  local qs id
  qs="name=$(printf '%s' "${ZONE_NAME}" | jq -sRr @uri)&account.id=$(printf '%s' "${CLOUDFLARE_ACCOUNT_ID}" | jq -sRr @uri)"
  cf_api GET "/zones?${qs}"
  if [[ "${CF_API_STATUS}" != "200" ]]; then
    die "list zones failed HTTP ${CF_API_STATUS}. Set CLOUDFLARE_ZONE_ID (Dashboard → ${ZONE_NAME} → Overview)."
  fi
  id="$(jq -r --arg n "${ZONE_NAME}" '.result[]? | select(.name == $n) | .id' <<<"${CF_API_BODY}" | head -1)"
  if [[ -z "${id}" || "${id}" == "null" ]]; then
    die "zone ${ZONE_NAME} not visible to bootstrap token. Set CLOUDFLARE_ZONE_ID."
  fi
  log "zone ${ZONE_NAME} → ${id}"
  printf '%s' "${id}"
}

create_token() {
  local account_id="$1"
  local zone_id="$2"
  local scripts_id settings_id routes_id
  local account_scope="com.cloudflare.api.account"
  local zone_scope="com.cloudflare.api.account.zone"

  scripts_id="$(perm_id "Workers Scripts Write" "${account_scope}")"
  settings_id="$(perm_id "Account Settings Read" "${account_scope}")"
  routes_id="$(perm_id "Workers Routes Write" "${zone_scope}")"

  log "permissions: Workers Scripts Write, Account Settings Read, Workers Routes Write (${ZONE_NAME} only)"

  local body
  body="$(
    jq -n \
      --arg name "${TOKEN_NAME}" \
      --arg acct "${account_id}" \
      --arg zone "${zone_id}" \
      --arg scripts "${scripts_id}" \
      --arg settings "${settings_id}" \
      --arg routes "${routes_id}" \
      '{
        name: $name,
        policies: [
          {
            effect: "allow",
            resources: {("com.cloudflare.api.account." + $acct): "*"},
            permission_groups: [{id: $scripts}, {id: $settings}]
          },
          {
            effect: "allow",
            resources: {("com.cloudflare.api.account.zone." + $zone): "*"},
            permission_groups: [{id: $routes}]
          }
        ]
      }'
  )"

  cf_api POST "$(tokens_base "${account_id}")" -d "${body}"
  if [[ "${CF_API_STATUS}" != "200" ]]; then
    die "create token failed HTTP ${CF_API_STATUS}: ${CF_API_BODY}"
  fi
  local token_id token_value
  token_id="$(jq -r '.result.id // empty' <<<"${CF_API_BODY}")"
  token_value="$(jq -r '.result.value // empty' <<<"${CF_API_BODY}")"
  if [[ -z "${token_id}" || -z "${token_value}" ]]; then
    die "create token response missing id/value"
  fi
  CF_NEW_TOKEN_VALUE="${token_value}"
  log "token id ${token_id}"
  log "account ${account_id}"
  log "zone ${ZONE_NAME} ${zone_id}"
}

main() {
  require_cmd curl
  require_cmd jq

  local root out
  root="$(cd "$(dirname "$0")/.." && pwd)"
  load_env_file "${root}/.env.bootstrap"

  if [[ -z "${CLOUDFLARE_BOOTSTRAP_API_TOKEN:-}" && -n "${CLOUDFLARE_API_TOKEN:-}" ]]; then
    CLOUDFLARE_BOOTSTRAP_API_TOKEN="${CLOUDFLARE_API_TOKEN}"
    log "using CLOUDFLARE_API_TOKEN as bootstrap (prefer CLOUDFLARE_BOOTSTRAP_API_TOKEN)"
  fi
  [[ -n "${CLOUDFLARE_BOOTSTRAP_API_TOKEN:-}" ]] || die "set CLOUDFLARE_BOOTSTRAP_API_TOKEN"
  [[ -n "${CLOUDFLARE_ACCOUNT_ID:-}" ]] || die "set CLOUDFLARE_ACCOUNT_ID"

  detect_token_scope "${CLOUDFLARE_ACCOUNT_ID}"
  local zone_id
  zone_id="$(resolve_zone_id)"
  create_token "${CLOUDFLARE_ACCOUNT_ID}" "${zone_id}"

  out="$(ensure_env_file "${root}")"
  upsert_env_key "${out}" "CLOUDFLARE_ACCOUNT_ID" "${CLOUDFLARE_ACCOUNT_ID}"
  upsert_env_key "${out}" "CLOUDFLARE_API_TOKEN" "${CF_NEW_TOKEN_VALUE}"
  strip_env_keys "${out}" \
    CLOUDFLARE_BOOTSTRAP_API_TOKEN \
    CLOUDFLARE_API_KEY \
    CLOUDFLARE_EMAIL
  log "wrote CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to ${out}"
  log "CLOUDFLARE_API_TOKEN is set; not printed. Next: make secrets/sync"
}

main "$@"
