import { defineConfig } from 'astro/config';

// Site address. Pick one:
// A) GitHub Pages project page: https://zapasek1.github.io/kajastronka/
//    SITE = 'https://zapasek1.github.io'   BASE = '/kajastronka'
// B) Custom domain (add public/CNAME with the domain):
//    SITE = 'https://yourdomain.com'       BASE = '/'
const SITE = 'https://kajamann.com';
const BASE = '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
});
