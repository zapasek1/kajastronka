// Tab pages:
// - hover: photo greys out, project description appears on it (CSS)
// - click in the overview: the grid swaps to the photos of that project, with a Back button
// - click inside a project: the viewer opens with arrows through that project (lightbox.ts)
// - sidebar list filters by project too; S/M/L sets the image size (remembered per browser)
const VIEW_KEY = 'kaja-view';

export function initShop() {
  let saved = '';
  try { saved = localStorage.getItem(VIEW_KEY) || ''; } catch {}

  const grids = Array.from(document.querySelectorAll<HTMLElement>('[data-grid]'));
  const viewBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('.view__btn'));
  function setView(v: string) {
    grids.forEach((g) => (g.dataset.view = v));
    viewBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === v)));
    try { localStorage.setItem(VIEW_KEY, v); } catch {}
  }
  if (['S', 'M', 'L'].includes(saved)) setView(saved);
  viewBtns.forEach((b) => b.addEventListener('click', () => setView(b.dataset.view!)));

  document.querySelectorAll<HTMLElement>('.shop').forEach((panel) => {
    const sideBtns = Array.from(panel.querySelectorAll<HTMLButtonElement>('.side__item'));
    const cards = Array.from(panel.querySelectorAll<HTMLElement>('.card'));
    const heading = panel.querySelector<HTMLElement>('[data-heading]');
    const back = panel.querySelector<HTMLButtonElement>('[data-back]');
    const defaultHeading = heading?.textContent ?? '';
    const photoCount = (p: string) => cards.filter((c) => c.dataset.project === p && c.querySelector('.card__btn')).length;

    function openProject(p: string) {
      panel.dataset.project = p;
      panel.classList.toggle('is-project', !!p);
      sideBtns.forEach((x) => x.setAttribute('aria-pressed', String((x.dataset.project || '') === p)));
      let n = 0;
      cards.forEach((c) => {
        const show = !p || c.dataset.project === p;
        c.hidden = !show;
        if (show) c.style.setProperty('--i', String(n++));
      });
      if (heading) heading.textContent = p || defaultHeading;
      if (back) back.hidden = !p;
      // Re-run the fade so the photos visibly swap in place.
      panel.classList.remove('is-in');
      void panel.offsetWidth;
      panel.classList.add('is-in');
      const top = panel.getBoundingClientRect().top + scrollY - 70;
      if (scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    }

    sideBtns.forEach((b) => b.addEventListener('click', () => openProject(b.dataset.project || '')));
    back?.addEventListener('click', () => openProject(''));
    panel.addEventListener('tab-reset', () => openProject(''));

    // Capture phase so this runs before the viewer's own click handler.
    panel.querySelectorAll<HTMLButtonElement>('.card__btn').forEach((btn) => {
      btn.addEventListener(
        'click',
        (e) => {
          const p = btn.closest<HTMLElement>('.card')!.dataset.project || '';
          if (!panel.dataset.project && p && photoCount(p) > 1) {
            e.stopImmediatePropagation();
            openProject(p);
          }
        },
        true,
      );
    });
  });
}
