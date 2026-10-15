# Kaja portfolio

Static portfolio site: Astro, deployed to GitHub Pages on every push to `main`.

- Content: `src/content/*.json` (edited through the CMS at `/admin/`)
- Page: `src/pages/index.astro`, styles: `src/styles/global.css`
- Photos: `public/uploads/` (the current images are placeholders)

## Local
    npm install
    npm run dev

## CMS login
Open `/admin/`, choose "Sign In with Token" and paste a fine-grained GitHub token
with Contents read/write on this repository only.

## Address
`astro.config.mjs` holds SITE and BASE. For a custom domain add `public/CNAME`,
set SITE to the domain and BASE to '/', and set the domain in Settings > Pages.
