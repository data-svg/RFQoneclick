# RFQ SQS — Next.js Auto‑Invite MVP

Next.js + Tailwind UI. Server-side auto‑matching of suppliers by `services[]` + optional `region` (cap 50).

## One‑Click Deploy (Vercel)
1. Push this code to GitHub (new repo).
2. Open **DEPLOY.md** and click the **Deploy with Vercel** button, replacing the `repository-url` with your repo URL.
3. When prompted, add env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `APP_BASE_URL` (e.g., your Vercel URL)

## Supabase Setup (run in SQL Editor)
- `supabase/sql/00_schema.sql`
- `supabase/sql/10_rls_dev.sql` (DEV‑ONLY permissive policies)
- `supabase/sql/20_seed.sql`

## Local Dev
```bash
npm i
npm run dev
# open http://localhost:3000
```

Pages:
- `/dashboard` — list RFQs
- `/rfqs/new` — create RFQ (no email fields)
- `/rfqs/[id]` — RFQ detail, invites & quotes
- `/supplier/rfqs/[id]?token=...` — supplier quote form
