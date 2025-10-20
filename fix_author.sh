#!/usr/bin/env bash
set -euo pipefail

usage() {
    cat <<EOF
Usage: $(basename "$0") --old-email OLD_EMAIL --name "Correct Name" --email correct@example.com [--dry-run] [--yes]

This script safely rewrites commit author/committer metadata using git-filter-repo.

Options:
    --old-email EMAIL    Email to replace (exact match)
    --name NAME          Correct name to use
    --email EMAIL        Correct email to use
    --dry-run            Only show matching commits and exit (no rewrite)
    --yes                Skip confirmation prompt and proceed
    -h, --help           Show this help

Notes:
    - Requires git and git-filter-repo to be installed. If git-filter-repo is not available,
        install it with: pip install git-filter-repo
    - This rewrites history (commit hashes will change). You will need to force-push
        and coordinate with collaborators.
    - The script creates a backup bundle in ./backups/ before rewriting.
EOF
}

if [ "$#" -eq 0 ]; then
    usage
    exit 1
fi

OLD_EMAIL=""
CORRECT_NAME=""
CORRECT_EMAIL=""
DRY_RUN=0
ASSUME_YES=0

while [ "$#" -gt 0 ]; do
    case "$1" in
        --old-email) OLD_EMAIL="$2"; shift 2;;
        --name) CORRECT_NAME="$2"; shift 2;;
        --email) CORRECT_EMAIL="$2"; shift 2;;
        --dry-run) DRY_RUN=1; shift 1;;
        --yes) ASSUME_YES=1; shift 1;;
        -h|--help) usage; exit 0;;
        *) echo "Unknown arg: $1"; usage; exit 1;;
    esac
done

if [ -z "$OLD_EMAIL" ] || [ -z "$CORRECT_NAME" ] || [ -z "$CORRECT_EMAIL" ]; then
    echo "Error: --old-email, --name and --email are required." >&2
    usage
    exit 2
fi

# Preflight checks
if ! command -v git >/dev/null 2>&1; then
    echo "git not found in PATH. Install git and re-run." >&2
    exit 3
fi

if [ ! -d .git ]; then
    echo "This does not appear to be a git repository (no .git). Run this from the repo root." >&2
    exit 4
fi

if ! command -v git-filter-repo >/dev/null 2>&1; then
    echo "git-filter-repo not found. It's the recommended tool to rewrite history." >&2
    echo "Install with: pip install git-filter-repo" >&2
    exit 5
fi

echo "Scanning repository for commits with author/committer email: $OLD_EMAIL"

matches=$(git log --all --format='%H %an <%ae>' | grep -F "$OLD_EMAIL" || true)
if [ -z "$matches" ]; then
    echo "No commits found matching '$OLD_EMAIL'. Nothing to do."
    exit 0
fi

if [ "$DRY_RUN" -eq 1 ]; then
    echo "Dry run: the following commits contain the old email and would be rewritten:"
    echo
    git log --all --format='%h %ad %an <%ae> %s' --date=short | grep -F "$OLD_EMAIL" || true
    echo
    echo "Run the script without --dry-run to perform the rewrite (it will create a backup bundle)."
    exit 0
fi

echo "Found commits matching the old email. Preparing backup..."
mkdir -p backups
BACKUP_FILE="backups/backup-$(date +%Y%m%d%H%M%S).bundle"
git bundle create "$BACKUP_FILE" --all
echo "Created backup bundle: $BACKUP_FILE"

if [ "$ASSUME_YES" -ne 1 ]; then
    echo
    echo "About to rewrite history to replace '$OLD_EMAIL' with '$CORRECT_NAME <$CORRECT_EMAIL>'."
    echo "This operation will change commit hashes across the repository. You will need to force-push branches and tags." 
    read -r -p "Proceed? (y/N) " confirm
    case "$confirm" in
        [yY]|[yY][eE][sS]) ;;
        *) echo "Aborting."; exit 0;;
    esac
fi

MAILMAP_FILE=$(mktemp)
trap 'rm -f "$MAILMAP_FILE"' EXIT

# Create a mailmap line. Format: Correct Name <correct@example.com> <old@example@example.com>
echo "$CORRECT_NAME <$CORRECT_EMAIL> <$OLD_EMAIL>" > "$MAILMAP_FILE"

echo "Running git-filter-repo (this may take a while for large repos)..."

# Run filter-repo using the mailmap; --force ensures the script runs non-interactively
git filter-repo --mailmap "$MAILMAP_FILE" --force

echo "Rewrite finished. Verifying that no commits remain with the old email..."
remaining=$(git log --all --format='%ae' | grep -F "$OLD_EMAIL" || true)
if [ -z "$remaining" ]; then
    echo "Success: no commits contain the old email '$OLD_EMAIL'."
    echo "Next steps (recommended):"
    cat <<NEXT
    - Inspect the repository locally and verify everything looks correct.
    - Force-push rewritten branches and tags to remote (for example):
        git push --force --tags origin 'refs/heads/*'
    - Tell collaborators to re-clone or to fetch and reset their branches.
    - Note: rewritten commits will invalidate GPG/SSH signatures.
NEXT
    exit 0
else
    echo "Warning: some commits still reference the old email. Remaining matches:" >&2
    git log --all --format='%h %an <%ae> %s' --date=short | grep -F "$OLD_EMAIL" || true
    echo "You may need to inspect these commits manually." >&2
    exit 6
fi
