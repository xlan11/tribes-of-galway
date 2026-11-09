#!/usr/bin/env bash
# Publish the built site to the gh-pages branch (GitHub Pages serves it at
# https://xlan11.github.io/tribes-of-galway/). Run from the repo root: bash site/publish.sh
set -euo pipefail
root=$(git rev-parse --show-toplevel)
cd "$root/site" && node build.mjs
tmp=$(mktemp -d)
(cd "$root/site" && tar --exclude=./src --exclude=./build.mjs --exclude=./publish.sh --exclude=./README.md --exclude=./.taste-skill -cf - .) | tar -xf - -C "$tmp"
touch "$tmp/.nojekyll"
cd "$tmp" && git init -q -b gh-pages && git add -A && git commit -qm "Publish site from $(git -C "$root" rev-parse --short HEAD)"
git push -f "$(git -C "$root" remote get-url origin)" gh-pages
rm -rf "$tmp"
