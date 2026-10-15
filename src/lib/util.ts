import { marked } from 'marked';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Path to a file in /public, with the GitHub Pages base prefix. */
export function asset(path: string | undefined): string {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return `${BASE}/${path.replace(/^\//, '')}`;
}

/** Internal link with the base prefix. */
export function href(path: string): string {
  return `${BASE}/${path.replace(/^\//, '')}`;
}

/** Markdown from the CMS to HTML. */
export function md(text: string | undefined): string {
  return text ? (marked.parse(text, { async: false }) as string) : '';
}

/** Phone number for a tel: link */
export function telHref(phone: string): string {
  return 'tel:' + phone.replace(/[^\d+]/g, '');
}
