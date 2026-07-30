# The Remote Lifestyle — website

Marketing site for [theremotelifestyle.com](https://theremotelifestyle.com).

## Stack

- React + Vite
- Tailwind CSS v4
- React Router
- Vercel (static site + serverless contact API)
- Cloudflare Turnstile + Resend for the Studios contact form

## Develop

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env` and fill in keys as needed. In local dev, the contact form uses Cloudflare Turnstile test keys by default.

## Build

```bash
pnpm build
pnpm preview
```

## Contact API

`POST /api/contact` is a Vercel serverless function (`api/contact.ts`). Configure these environment variables in the Vercel project:

| Variable | Where used |
| --- | --- |
| `VITE_TURNSTILE_SITE_KEY` | Frontend (build-time) |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | API (runtime) |
| `RESEND_API_KEY` | API (runtime) |

Emails are sent to `victor@theremotelifestyle.com` via Resend.
