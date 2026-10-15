// Start page + tabs. Without JS every section is visible; with JS one panel is shown and synced with the #hash.
export function initTabs() {
  const tabs = Array.from(document.querySelectorAll<HTMLAnchorElement>('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-panel]'));
  const indicator = document.querySelector<HTMLElement>('.tabs__indicator');
  const list = document.querySelector<HTMLElement>('.tabs');
  if (!panels.length) return;
  const ids = panels.map((p) => p.id);
  let current = '';

  function moveIndicator() {
    const active = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
    if (!indicator || !list) return;
    if (!active) {
      indicator.style.opacity = '0';
      return;
    }
    indicator.style.opacity = '1';
    indicator.style.width = `${active.offsetWidth}px`;
    indicator.style.transform = `translateX(${active.offsetLeft}px)`;
  }

  function show(id: string, opts: { focus?: boolean; push?: boolean } = {}) {
    if (!ids.includes(id)) id = ids[0];
    if (id === current) return;
    current = id;
    tabs.forEach((t) => {
      const on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on || (id === 'home' && t === tabs[0]) ? 0 : -1;
      if (on && list) {
        const left = t.offsetLeft;
        if (left < list.scrollLeft || left + t.offsetWidth > list.scrollLeft + list.clientWidth) list.scrollLeft = left - 16;
      }
    });
    panels.forEach((p) => {
      const on = p.id === id;
      p.hidden = !on;
      if (on) {
        // Restart the staggered fade-in each time a panel is opened.
        p.classList.remove('is-in');
        void p.offsetWidth;
        p.classList.add('is-in');
      }
    });
    moveIndicator();
    if (opts.push) {
      const hash = id === 'home' ? location.pathname : `#${id}`;
      history.pushState(null, '', hash);
    }
    if (opts.focus) tabs.find((t) => t.getAttribute('aria-controls') === id)?.focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      show(tab.getAttribute('aria-controls')!, { push: true });
    });
    tab.addEventListener('keydown', (e) => {
      let next = -1;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next >= 0) {
        e.preventDefault();
        show(tabs[next].getAttribute('aria-controls')!, { focus: true, push: true });
      }
    });
  });

  document.querySelectorAll<HTMLAnchorElement>('[data-tab-link]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      show(a.dataset.tabLink!, { push: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  window.addEventListener('popstate', () => show(location.hash.slice(1) || 'home'));
  window.addEventListener('resize', moveIndicator);
  document.fonts?.ready.then(moveIndicator);
  show(location.hash.slice(1) || 'home');
}
