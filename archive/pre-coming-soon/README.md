# Pre–coming-soon site (archived)

Snapshot of the full marketing site and contact form as it existed on `main` before the temporary coming-soon landing page.

## Contents

| Path | Description |
| --- | --- |
| `src/App.tsx` | Full landing page (three pillars, social links, PodBrief card) |
| `src/main.tsx` | App entry with React Router |
| `src/pages/StudioContact.tsx` | Studios contact form (Turnstile + Resend) |
| `api/contact.ts` | Vercel serverless contact API |
| `.env.example` | Required env vars for the contact form |
| `README.full-site.md` | Original project README |

## To restore

1. Copy files back to their original locations (e.g. `src/App.tsx`, `api/contact.ts`, etc.).
2. Reinstall dependencies removed for the coming-soon page:

   ```bash
   pnpm add @marsidev/react-turnstile react-icons react-router-dom resend
   pnpm add -D @vercel/node
   ```

3. Restore env vars in Vercel (`RESEND_API_KEY`, `VITE_TURNSTILE_SITE_KEY`, `CLOUDFLARE_TURNSTILE_SECRET_KEY`).
4. Update `index.html` meta descriptions if needed.

The live site intentionally does not include these files or dependencies so Resend is not required during the transition.
