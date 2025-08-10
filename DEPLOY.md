# One‑Click Deploy

After you push this folder to **GitHub**, click the button below (replace the `repository-url` with your GitHub repo URL). Vercel will clone it, prompt for env vars, and deploy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?project-name=rfq-sqs&repository-url=REPLACE_WITH_YOUR_GITHUB_REPO_URL&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,APP_BASE_URL&envDescription=Paste%20your%20Supabase%20project%20URL%20and%20Anon%20key%2C%20and%20the%20public%20base%20URL%20of%20the%20app.&envLink=https://app.supabase.com/project/_/settings/api)

### Steps
1. Create a new GitHub repo and push this code.
2. Replace `REPLACE_WITH_YOUR_GITHUB_REPO_URL` in the link above with your repo URL.
3. Click the Deploy button → Add env vars when prompted → Deploy.

**Required Env Vars**
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon public key
- `APP_BASE_URL` — e.g. `https://your-project-name.vercel.app`
