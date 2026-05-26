#!/usr/bin/env bash
# Used as Vercel "Ignored Build Step" / vercel.json ignoreCommand.
# Exit 0 = skip this deployment. Exit 1 = run the build.
#
# Usage (from a storefront root on Vercel):
#   bash ../scripts/vercel-should-build.sh watches-store-v2 packages/admin-ui
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "usage: vercel-should-build.sh <repo-relative-path-prefix>..." >&2
  exit 1
fi

# Unknown context (e.g. local CLI) — build to be safe.
if [ -z "${VERCEL_GIT_COMMIT_SHA:-}" ]; then
  exit 1
fi

if [ -n "${VERCEL_GIT_PREVIOUS_SHA:-}" ]; then
  CHANGED=$(git diff --name-only "$VERCEL_GIT_PREVIOUS_SHA" "$VERCEL_GIT_COMMIT_SHA" 2>/dev/null || true)
else
  CHANGED=$(git diff --name-only HEAD^ HEAD 2>/dev/null || true)
fi

if [ -z "$CHANGED" ]; then
  exit 0
fi

while IFS= read -r file; do
  [ -z "$file" ] && continue
  for prefix in "$@"; do
    case "$file" in
      "${prefix}"/*|"${prefix}") exit 1 ;;
    esac
  done
  case "$file" in
    package.json|package-lock.json) exit 1 ;;
  esac
done <<< "$CHANGED"

exit 0
