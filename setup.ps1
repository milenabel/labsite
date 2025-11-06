# setup.ps1 — installs/locks common deps for this labsite
# Run from repo root: powershell -ExecutionPolicy Bypass -File .\setup.ps1

Write-Host "▶ Checking Node/npm…" -ForegroundColor Cyan
node -v
npm -v

Write-Host "▶ Installing base dependencies (uses package-lock if present)..." -ForegroundColor Cyan
# Prefer clean, otherwise install
npm ci 2>$null
if ($LASTEXITCODE -ne 0) {
  npm install
}

Write-Host "▶ Ensuring runtime deps are present..." -ForegroundColor Cyan
# (ok if already installed)
npm i -E xml2js katex clsx

Write-Host "▶ Ensuring dev deps are present..." -ForegroundColor Cyan
npm i -D -E @types/xml2js tailwindcss postcss autoprefixer typescript @types/node @types/react eslint

Write-Host "▶ Tailwind (if not already init’d)..." -ForegroundColor Cyan
if (-not (Test-Path ".\tailwind.config.ts") -and -not (Test-Path ".\tailwind.config.js")) {
  npx tailwindcss init -p
}

Write-Host "▶ All set. Start dev server with: npm run dev" -ForegroundColor Green
