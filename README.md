# INVENTRA — Design & Automation Solutions

A modern, premium, **fully static** marketing website (no build step, no backend) for INVENTRA.
Hand-built with semantic HTML5, a custom CSS design system, and dependency-free vanilla JS.
Deploys to any free static host — GitHub Pages, Netlify, Vercel, Cloudflare Pages.

> Aesthetic: **“Industrial Futurism”** — dark, electric-cyan accents, glassmorphism, animated
> circuit/particle hero, scroll-reveal motion, animated counters, filterable portfolio, blog, and more.

---

## ✨ Features

- Responsive, mobile-first layout (tested 375 → 1440px+)
- Animated hero with a cursor-reactive **canvas particle/circuit network**
- Sticky glass navigation + full-screen mobile menu + scroll-progress bar
- Scroll-reveal animations (IntersectionObserver) + animated stat counters + typewriter
- Glassmorphic cards with cursor-follow sheen, gradient text, glow effects
- **6 pages:** Home, About, Services, Projects, Insights (blog), Contact
- Filterable projects portfolio + filterable blog list
- 3 full blog articles + custom 404 page
- Working contact form (Web3Forms) with a graceful `mailto:` fallback
- FAQ accordion, process timeline, testimonials, marquee
- SEO: meta + Open Graph + JSON-LD structured data + `sitemap.xml` + `robots.txt`
- Accessibility: skip link, semantic landmarks, ARIA, keyboard-friendly, `prefers-reduced-motion`
- PWA basics: `site.webmanifest` + SVG favicon
- **Zero dependencies, zero build** — just static files

---

## 📁 Structure

```
.
├── index.html                         # Home
├── about.html  services.html  projects.html  blog.html  contact.html
├── blog-industrial-automation-2026.html
├── post.html                          # blog article template (renders any post)
├── blog-*.html                        # redirects from old article URLs → post.html
├── 404.html
├── favicon.svg  site.webmanifest  robots.txt  sitemap.xml  .nojekyll
├── admin/                             # Token-login admin panel (GitHub API)
│   └── index.html
├── content/                           # editable data the admin writes to
│   ├── settings.json                  # contact + social details
│   ├── projects.json                  # portfolio items
│   └── blog.json                      # blog posts
├── assets/
│   ├── css/style.css                  # entire design system
│   ├── js/main.js                     # interactions (nav, reveals, counters, form…)
│   ├── js/hero.js                     # hero canvas animation
│   └── js/cms.js                      # renders content/*.json into the pages
├── .github/workflows/deploy.yml       # auto-deploy to GitHub Pages
└── dev-server.ps1                     # LOCAL preview only (git-ignored)
```

---

## 🛠 Make it yours — replace these placeholders

Search the project for each token and replace it:

| Placeholder | Where | Replace with |
|---|---|---|
| `hello@inventra.dev` | contact.html, footers | your real email |
| `+1 (000) 000-0000` / `tel:+10000000000` | contact.html | your phone / WhatsApp |
| `YOUR_WEB3FORMS_ACCESS_KEY` | contact.html (`data-access-key`) | your Web3Forms key (below) |
| `#` in social links (`aria-label="LinkedIn"`, etc.) | every footer + contact.html | your real social URLs |
| `REPLACE-WITH-YOUR-DOMAIN` | sitemap.xml, robots.txt, index.html JSON-LD | your live URL |
| Stats, services, projects, testimonials, blog copy | the HTML pages | your real numbers & content |

### Contact form (2-minute setup)
1. Go to **https://web3forms.com**, enter your email, get a free **Access Key**.
2. In `contact.html`, set `data-access-key="YOUR_WEB3FORMS_ACCESS_KEY"` to that key.
3. Done — submissions arrive in your inbox. *Until you add a key, the form opens the visitor's
   email app pre-filled (so it still works).*

### Change the colors
All theming lives in CSS variables at the top of `assets/css/style.css` under `:root`
(`--cyan`, `--blue`, `--violet`, `--bg`, `--grad`, …). Change those and the whole site updates.

---

## 👀 Preview locally
Any static server works. With PowerShell (no installs needed):
```powershell
pwsh -NoProfile -File dev-server.ps1   # then open http://localhost:8123
```
Or just double-click `index.html` (the contact form's live submit needs http, not file://).

---

## 🚀 Deploy to GitHub Pages (free)

1. Create a new GitHub repo (e.g. `inventra`).
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "INVENTRA website"
   git branch -M main
   git remote add origin https://github.com/<you>/inventra.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions.**
   The included workflow (`.github/workflows/deploy.yml`) publishes automatically on every push.
4. Your site goes live at `https://<you>.github.io/inventra/`.
   *(For a clean root URL, name the repo `<you>.github.io`.)*

After it's live, update `REPLACE-WITH-YOUR-DOMAIN` in `sitemap.xml`, `robots.txt`, and the
JSON-LD block in `index.html` to your real URL.

### Other hosts
- **Netlify / Cloudflare Pages:** drag-and-drop this folder, or connect the repo. No settings needed.
- **Vercel:** import the repo (framework preset = “Other”). No build command.

---

## 🔐 Admin panel (token login — works on GitHub Pages, no extra services)

A self-contained admin lives at **`/admin/`**. It needs **no Decap, no OAuth app, no Worker**:

1. Go to **GitHub → Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token**.
   - **Repository access:** Only select repositories → this repo.
   - **Permissions → Repository → Contents: Read and write.**
   - Generate and copy the token.
2. Open **`/admin/`** on your live site, paste the token, confirm the repo, **Connect to GitHub**.
3. Edit **Business details**, **Projects** and **Blog**, hit **Save**. Each save commits to the
   repo via the GitHub API, and GitHub Pages redeploys the site in ~1 minute.

The pages render `content/*.json` (settings, projects, blog) via `assets/js/cms.js`, so your
edits appear live; the static HTML stays as a no-JS fallback. Your token is stored **only in your
browser** (localStorage) and used solely with GitHub's API — nothing is sent anywhere else.

> Tip: a **fine-grained** token scoped to this one repo with only *Contents* access is safest.
> You can revoke/rotate it anytime from the same GitHub settings page.

---

## 📝 Notes
- For best social-share previews, export `assets/img/og.svg` to a 1200×630 **PNG** named `og.png`
  and update the `og:image` paths (some scrapers don't render SVG).
- The site is intentionally framework-free so it stays fast and easy to edit by hand.

© INVENTRA Design & Automation Solutions.
