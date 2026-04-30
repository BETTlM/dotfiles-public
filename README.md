# Personal Config Portal

Public website for browsing/downloading sanitized personal config files, with a GitHub-authenticated admin panel restricted to `BETTlM`.

## Features

- Public catalog and syntax-highlighted file viewer
- Individual file downloads + full `.tar.gz` bundle
- Admin CRUD API and panel (`/admin`) protected by GitHub OAuth
- Hard admin allowlist: only GitHub login `BETTlM`
- Redaction and placeholder normalization (`{{HOME}}`, `{{USERNAME}}`)
- Bootstrap scripts for macOS and Linux

## Setup

1. Install dependencies:
   - `npm install`
2. Copy environment template:
   - `cp .env.example .env.local`
3. Fill all required values in `.env.local`.

## Import Your Configs

Run:

```bash
npm run import:configs
```

This reads selected files from your home directory, applies redaction + placeholders, and writes:

- `data/configs/*`
- `data/manifest.json`

## Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Bootstrap on New Machines

- macOS:
  - `./scripts/bootstrap/bootstrap-macos.sh https://your-domain.com`
- Linux:
  - `./scripts/bootstrap/bootstrap-linux.sh https://your-domain.com`

## Vercel Deployment Checklist

- Set all `.env.local` values as Vercel environment variables
- Add custom domain in Vercel project settings
- Verify:
  - `/` catalog page
  - `/download/bundle`
  - `/admin` GitHub sign-in lock to `BETTlM`
- Full guide: `docs/vercel-deploy.md`
