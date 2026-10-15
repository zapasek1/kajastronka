// Light reflection on glass that follows the pointer (desktop only, off for reduced motion).
export function initSheen() {
  if (!matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
  document.addEventListener('pointermove', (e) => {
    const el = (e.target as Element).closest<HTMLElement>('.glass');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  });
}
