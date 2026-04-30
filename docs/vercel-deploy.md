# Vercel Deployment Guide

## 1) Create Vercel Project

- Import this repository in Vercel.
- Framework preset: Next.js.
- Production branch: `main` (or your preferred default).

## 2) Configure Environment Variables

Set these in Vercel (Production and Preview as needed):

- `NEXTAUTH_URL` = your full HTTPS domain (for example `https://configs.yourdomain.com`)
- `NEXTAUTH_SECRET` = long random secret
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_REPO_TOKEN`
- `GITHUB_REPO_OWNER` = `BETTlM`
- `GITHUB_REPO_NAME`
- `GITHUB_REPO_BRANCH` (default `main`)
- `CONFIG_USERNAME` = `bettim`
- `CONFIG_HOME_DIR` = `/Users/bettim`

## 3) GitHub OAuth App Settings

In your GitHub OAuth app:

- Homepage URL: your website URL
- Authorization callback URL: `https://your-domain.com/api/auth/callback/github`

## 4) Custom Domain

- Add your custom domain in Vercel project settings.
- Add DNS records requested by Vercel.
- Wait for SSL provisioning.

## 5) Post-Deploy Validation

- `/` loads catalog with entries.
- `/config/<id>` renders syntax-highlighted file content.
- `/download/<id>` downloads a single file.
- `/download/bundle` downloads `.tar.gz`.
- `/admin` only allows `BETTlM` after GitHub login.
- Admin create/update/delete reflects in `data/manifest.json` and `data/configs/*`.
