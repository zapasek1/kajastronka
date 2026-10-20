// Full-screen viewer for the photos currently visible in the open tab: arrows, swipe, keyboard.
export function initLightbox() {
  const dlg = document.querySelector<HTMLDialogElement>('.lightbox');
  if (!dlg) return;
  const img = dlg.querySelector('img')!;
  const title = dlg.querySelector('.lightbox__title')!;
  const desc = dlg.querySelector('.lightbox__desc')!;
  const count = dlg.querySelector('.lightbox__count')!;
  let items: HTMLButtonElement[] = [];
  let idx = 0;

  function render() {
    const b = items[idx];
    img.src = b.dataset.full!;
    img.alt = b.dataset.title || '';
    title.textContent = b.dataset.title || '';
    desc.textContent = b.dataset.desc || '';
    count.textContent = `${idx + 1} / ${items.length}`;
    dlg!.classList.toggle('lightbox--single', items.length < 2);
  }
  function step(d: number) {
    idx = (idx + d + items.length) % items.length;
    render();
  }

  document.querySelectorAll<HTMLButtonElement>('.card__btn').forEach((b) => {
    b.addEventListener('click', () => {
      items = Array.from(b.closest('[data-grid]')!.querySelectorAll<HTMLButtonElement>('.card:not([hidden]) .card__btn'));
      idx = items.indexOf(b);
      render();
      dlg.showModal();
    });
  });
  dlg.querySelector('.lightbox__close')!.addEventListener('click', () => dlg.close());
  dlg.querySelector('.lightbox__prev')!.addEventListener('click', () => step(-1));
  dlg.querySelector('.lightbox__next')!.addEventListener('click', () => step(1));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  let x0 = 0;
  dlg.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });
}
