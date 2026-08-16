#!/usr/bin/env bash
# =============================================================================
# Allura Stack Migration — org + core monorepo (RuVector-style), history kept
# Run ON YOUR WORKSTATION (needs gh auth + local folders). Default is DRY RUN.
#   bash allura-stack-migration.sh          # show plan, change nothing
#   bash allura-stack-migration.sh --run    # execute
# =============================================================================
set -euo pipefail

# ----------------------------- CONFIG ----------------------------------------
ORG="Allura-Ecosystem"                     # <- change if you prefer another org name
MONOREPO="allura"
WORKDIR="$HOME/Projects/allura-stack-build"
DEFAULT_BRANCH="main"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SEED_DIR="$SCRIPT_DIR/monorepo-seed"      # README.md + docs/assets/*.png

ENGINE_REMOTE="https://github.com/Charitablebusinessronin/Allura_Memory.git"
DURHAM_REMOTE="https://github.com/Charitablebusinessronin/team_durham.git"
TEAMRAM_LOCAL="/media/ronin704/Games/Projects/Allura-ecosystem/Allura-TeamRam"
MORTAGATE_LOCAL="$HOME/Documents/Claude/Projects/Mortagate"

MORTAGATE_VISIBILITY="private"             # recommended; set "public" only deliberately

DRY=1
[[ "${1:-}" == "--run" ]] && DRY=0

run() { if [[ $DRY -eq 1 ]]; then echo "[dry-run] $*"; else echo "[exec] $*"; "$@"; fi; }
note() { echo -e "\n=== $* ==="; }

# ----------------------------- PRE-FLIGHT -------------------------------------
note "Pre-flight checks"
for bin in git gh gitleaks; do
  command -v "$bin" >/dev/null || { echo "MISSING: $bin — install it first (see plan doc)"; exit 1; }
done
gh auth status >/dev/null || { echo "gh not authenticated — run: gh auth login"; exit 1; }
[[ -d "$TEAMRAM_LOCAL" ]]   || { echo "MISSING folder: $TEAMRAM_LOCAL"; exit 1; }
[[ -d "$MORTAGATE_LOCAL" ]] || { echo "MISSING folder: $MORTAGATE_LOCAL"; exit 1; }
echo "NOTE: the GitHub ORG must already exist (web UI: github.com/account/organizations/new)."
echo "      gh cannot create organizations."

# ----------------------------- 1. MONOREPO INIT --------------------------------
note "1/6 Init monorepo skeleton"
run mkdir -p "$WORKDIR"
if [[ $DRY -eq 0 ]]; then
  cd "$WORKDIR"
  if [[ ! -d "$MONOREPO/.git" ]]; then
    git init -b "$DEFAULT_BRANCH" "$MONOREPO"
    cd "$MONOREPO"
    mkdir -p harnesses plugins sdk docs .claude
    # README + brand assets come from the seed folder next to this script
    if [[ -d "$SEED_DIR" ]]; then
      cp "$SEED_DIR/README.md" README.md
      mkdir -p docs/assets
      cp "$SEED_DIR"/docs/assets/*.png docs/assets/
    else
      echo "WARN: seed folder not found at $SEED_DIR — writing minimal README"
      echo "# Allura — governed memory infrastructure for AI agents" > README.md
    fi
    curl -fsSL https://raw.githubusercontent.com/github/choosealicense.com/gh-pages/_licenses/mit.txt 2>/dev/null | tail -n +13 > LICENSE || echo "MIT" > LICENSE
    git add -A && git commit -m "chore: allura stack monorepo skeleton (README + brand assets)"
  else
    cd "$MONOREPO"
  fi
else
  echo "[dry-run] git init $WORKDIR/$MONOREPO + skeleton commit (README, LICENSE, dirs)"
fi

# ----------------------------- 2. SUBTREE IMPORTS ------------------------------
# git subtree add keeps full source history reachable via a merge commit (no hash rewrite).
note "2/6 Import sources with history (git subtree)"

# 2a. Engine (remote)
run git subtree add --prefix=engine "$ENGINE_REMOTE" "$DEFAULT_BRANCH"

# 2b. Team Durham (remote)
run git subtree add --prefix=harnesses/team-durham "$DURHAM_REMOTE" "$DEFAULT_BRANCH"

# 2c. Team RAM (local — init a repo there first if needed)
if [[ $DRY -eq 0 ]]; then
  if [[ ! -d "$TEAMRAM_LOCAL/.git" ]]; then
    git -C "$TEAMRAM_LOCAL" init -b "$DEFAULT_BRANCH"
    git -C "$TEAMRAM_LOCAL" add -A
    git -C "$TEAMRAM_LOCAL" commit -m "chore: baseline import of Team RAM harness"
  fi
  TR_BRANCH=$(git -C "$TEAMRAM_LOCAL" rev-parse --abbrev-ref HEAD)
  git subtree add --prefix=harnesses/team-ram "$TEAMRAM_LOCAL" "$TR_BRANCH"
else
  echo "[dry-run] init git in $TEAMRAM_LOCAL if needed, then subtree add -> harnesses/team-ram"
fi

# ----------------------------- 3. SECRET SCAN (HARD GATE) ----------------------
note "3/6 Secret scan on FULL history (gitleaks) — hard gate before public push"
if [[ $DRY -eq 0 ]]; then
  if ! gitleaks detect --source . --redact -v; then
    echo ""
    echo "!! SECRETS FOUND IN HISTORY. DO NOT PUSH PUBLIC. !!"
    echo "Redact with git-filter-repo BEFORE the first push (after that it's too late):"
    echo "  pipx install git-filter-repo"
    echo "  git filter-repo --replace-text <(echo 'THE_SECRET==>REDACTED')"
    exit 2
  fi
else
  echo "[dry-run] gitleaks detect --source . (exit nonzero blocks push)"
fi

# ----------------------------- 4. CREATE + PUSH MONOREPO -----------------------
note "4/6 Create org repo + push"
run gh repo create "$ORG/$MONOREPO" --public --description "Allura — governed memory infrastructure for AI agents (engine + harnesses + SDK)" || true
run git remote add origin "https://github.com/$ORG/$MONOREPO.git" || true
run git push -u origin "$DEFAULT_BRANCH"

# ----------------------------- 5. MORTAGATE (separate vertical repo) -----------
note "5/6 Mortagate -> own repo in org ($MORTAGATE_VISIBILITY)"
if [[ $DRY -eq 0 ]]; then
  cd "$MORTAGATE_LOCAL"
  if [[ ! -d .git ]]; then
    git init -b "$DEFAULT_BRANCH" && git add -A && git commit -m "chore: baseline import of Mortagate (Salesforce mortgage QC vertical)"
  fi
  gitleaks detect --source . --redact -v || { echo "!! secrets in Mortagate history — fix before push"; exit 2; }
  gh repo create "$ORG/mortagate" --"$MORTAGATE_VISIBILITY" --description "Mortgage Audit Replay & QC — Salesforce internal app on the Allura stack" || true
  git remote add allura-org "https://github.com/$ORG/mortagate.git" 2>/dev/null || true
  git push -u allura-org "$DEFAULT_BRANCH"
else
  echo "[dry-run] init+scan+push $MORTAGATE_LOCAL -> $ORG/mortagate ($MORTAGATE_VISIBILITY)"
fi

# ----------------------------- 6. ARCHIVE OLD REPOS ----------------------------
note "6/6 Archive superseded repos (append-only: archive, never delete)"
echo "Manual/CLI after verifying the monorepo clone works:"
echo "  gh repo archive Charitablebusinessronin/Allura_Memory --yes   # AFTER PR #47/#50 are merged or carried over"
echo "  gh repo archive Charitablebusinessronin/team_durham  --yes"
echo "Add a pointer README to each first: 'Moved to github.com/$ORG/$MONOREPO'"

note "DONE"
echo "Verify: git clone https://github.com/$ORG/$MONOREPO && cd $MONOREPO && git log --oneline | head"
echo "Subtree history check: git log --oneline -- engine | tail   (should show old Allura_Memory commits)"
