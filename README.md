# Kaja portfolio

Static portfolio site: Astro, deployed to GitHub Pages on every push to `main`.

- Content: `src/content/*.json` (edited through the CMS at `/admin/`)
- Page: `src/pages/index.astro`, styles: `src/styles/global.css`
- Photos: `public/uploads/` (the current images are placeholders)

## Local
    npm install
    npm run dev

## CMS login
Open `/admin/` and click "Sign In with GitHub". Anyone added as a collaborator
on this repo (Settings > Collaborators) can log in with their own GitHub account.

Login runs through a small Cloudflare Worker (`sveltia-cms-auth.zapas950.workers.dev`,
repo `zapasek1/sveltia-cms-auth`) with the GitHub OAuth app "Kaja Mann CMS".
The client secret lives only as an encrypted Secret in the Worker settings.
Fallback: "Sign In with Token" with a classic token (scope `public_repo`).

Photos uploaded through the CMS are resized to max 2000 px and saved as WebP.

## Address
`astro.config.mjs` holds SITE and BASE. For a custom domain add `public/CNAME`,
set SITE to the domain and BASE to '/', and set the domain in Settings > Pages.
Currently live at https://kajamann.com (DNS: 4 A records to GitHub Pages, CNAME www to zapasek1.github.io).
