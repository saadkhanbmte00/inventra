# Turn on the admin login (GitHub Pages + Cloudflare Worker)

Your admin lives at **https://saadkhanbmte00.github.io/inventra/admin/**.
It loads, but can't sign in until you add a small (free) OAuth proxy. ~10 minutes, one time.

You'll do three things: **(A)** make a GitHub OAuth App, **(B)** deploy the Worker,
**(C)** point the CMS at it.

---

## A. Create a GitHub OAuth App  (2 min)
1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
   (direct link: https://github.com/settings/developers).
2. Fill in:
   - **Application name:** `INVENTRA CMS`
   - **Homepage URL:** `https://saadkhanbmte00.github.io/inventra/`
   - **Authorization callback URL:** `https://PLACEHOLDER/callback`
     *(you'll fix this in step B once you know the Worker URL — any value for now)*
3. Click **Register application**.
4. Copy the **Client ID**. Click **Generate a new client secret** and copy the **Client Secret**.
   *(Keep these private — they go into the Worker, never the website.)*

---

## B. Deploy the Cloudflare Worker  (5 min, free)
1. Sign up / log in at **https://dash.cloudflare.com** → **Workers & Pages** → **Create** → **Create Worker**.
2. Name it e.g. `inventra-oauth`, click **Deploy** (the default code is fine for now), then **Edit code**.
3. Delete the default code and paste the entire contents of **`oauth-worker.js`** (in this folder). **Save and deploy.**
4. Note your Worker URL — it looks like `https://inventra-oauth.<your-subdomain>.workers.dev`.
5. Add your GitHub credentials as variables:
   **Worker → Settings → Variables and Secrets → Add:**
   - `CLIENT_ID` = your GitHub Client ID
   - `CLIENT_SECRET` = your GitHub Client Secret  *(mark it as a Secret / encrypted)*
   Save and **redeploy**.
6. Go back to your **GitHub OAuth App** (step A) and set the
   **Authorization callback URL** to: `https://inventra-oauth.<your-subdomain>.workers.dev/callback`

> Test it: open `https://inventra-oauth.<your-subdomain>.workers.dev/` — it should say
> "INVENTRA Decap OAuth proxy is running."

---

## C. Point the CMS at the Worker  (1 min)
1. Open **`admin/config.yml`** and set `base_url` to your Worker URL (no trailing slash):
   ```yaml
   backend:
     name: github
     repo: saadkhanbmte00/inventra
     branch: main
     base_url: https://inventra-oauth.<your-subdomain>.workers.dev
   ```
2. Commit & push:
   ```bash
   git add admin/config.yml
   git commit -m "Wire admin login to OAuth worker"
   git push
   ```
3. Wait ~1 minute for GitHub Pages to rebuild, then open
   **https://saadkhanbmte00.github.io/inventra/admin/** → **Login with GitHub**. 🎉

You can now edit Business details, Projects and Blog from the admin; every save
commits to the repo and the site redeploys automatically.

---

### Prefer zero setup?
Hosting on **Netlify** instead gives the same admin with **no Worker and no OAuth App**
(enable Identity + Git Gateway). Say the word and I'll switch the config and walk you through it.
