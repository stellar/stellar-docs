#!/usr/bin/env bash
#
# Canonical check: internal doc links must be relative (../path/file.mdx), not
# absolute /docs/... routes. Relative links are validated at build time by
# Docusaurus' onBrokenMarkdownLinks; absolute route links are not.
#
# This is the single source of truth shared by CI (.github/workflows/main.yml)
# and the local pre-commit hook (.husky/pre-commit) — like `pnpm format:mdx`,
# there is one definition of the rule, not two driftable copies.
#
# It only flags absolute /docs links in NEWLY PROPOSED content: it reads a
# word-level diff and inspects added tokens only. Editing a typo on a line that
# already contains an absolute link does not flag that link (the link stays a
# context token); introducing or editing a /docs link does. Pre-existing debt
# in untouched lines is never the contributor's problem.
#
# CONTRIBUTING.md is excluded: it is not part of the docs build and its /docs
# link is an intentional, illustrative example.
#
# Usage:
#   scripts/check-relative-links.sh --staged                 # staged changes (pre-commit)
#   scripts/check-relative-links.sh --range [BASE...HEAD]     # PR range (CI); default origin/main...HEAD
#
# Exit 0 = clean, 1 = absolute /docs link(s) introduced.

set -euo pipefail

mode="${1:---range}"
DOCS_PATHSPEC=('docs/*.md' 'docs/*.mdx')

case "$mode" in
  --staged)
    diff_cmd=(git diff --cached --word-diff=porcelain -- "${DOCS_PATHSPEC[@]}")
    ;;
  --range)
    range="${2:-origin/main...HEAD}"
    diff_cmd=(git diff --word-diff=porcelain "$range" -- "${DOCS_PATHSPEC[@]}")
    ;;
  *)
    echo "usage: $0 [--staged | --range [BASE...HEAD]]" >&2
    exit 2
    ;;
esac

# Walk the word-diff porcelain stream. For each new-file line, remember whether
# any *added* token on it contains an absolute '](/docs' link; report that line
# if so. New-file line numbers are tracked from each hunk's @@ header, advancing
# on every completed line except pure deletions (old-file-only).
findings=$(
  "${diff_cmd[@]}" | awk '
    function reset() { hasrem=0; haskept=0; flag=0 }
    /^diff --git / { infile=0; reset(); next }
    /^--- /        { next }
    /^\+\+\+ /     { path=substr($0,7); sub(/\t.*/,"",path); infile=1; next }
    /^@@ /         { match($0,/\+[0-9]+/); newno=substr($0,RSTART+1,RLENGTH-1)+0; reset(); next }
    !infile        { next }
    /^~/ {
      is_removal_only = (hasrem && !haskept)
      if (!is_removal_only) {
        if (flag && path !~ /CONTRIBUTING\.md$/)
          print path ":" newno ": absolute /docs link introduced in added content — use a relative ../path/file.mdx link"
        newno++
      }
      reset(); next
    }
    {
      pfx = substr($0,1,1); tok = substr($0,2)
      if (pfx == "-")      { hasrem = 1 }
      else if (pfx == "+") { haskept = 1; if (tok ~ /\]\(\/docs/) flag = 1 }
      else                 { haskept = 1 }   # context token (leading space)
    }
  '
)

if [ -n "$findings" ]; then
  echo "$findings"
  echo ""
  echo "Fix: replace the absolute /docs/... link with a relative link ending in .mdx"
  echo "(e.g. ../getting-started/setup.mdx). See docs/platforms/anchor-platform/CONTRIBUTING.md."
  exit 1
fi

echo "All links check out"
exit 0
