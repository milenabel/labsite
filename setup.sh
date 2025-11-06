#!/usr/bin/env bash
# setup.sh — installs/locks common deps for this labsite
# # Run from repo root: chmod +x setup.sh && ./setup.sh

set -e

echo "▶ Node/npm versions"
node -v
npm -v

echo "▶ Installing base dependencies (uses package-lock if present)…"
if npm ci; then
  :
else
  npm install
fi

echo "▶ Ensuring runtime deps…"
npm i -E xml2js katex clsx

echo "▶ Ensuring dev deps…"
npm i -D -E @types/xml2js tailwindcss postcss autoprefixer typescript @types/node @types/react eslint

echo "▶ Tailwind init (only if missing)…"
if [ ! -f tailwind.config.ts ] && [ ! -f tailwind.config.js ]; then
  npx tailwindcss init -p
fi

echo "▶ Done. Start dev server with: npm run dev"
