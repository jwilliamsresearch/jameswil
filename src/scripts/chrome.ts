/** Theme toggle and header measurement. Runs on every page. */

const root = document.documentElement;

function currentTheme(): 'light' | 'dark' {
  if (root.dataset.theme === 'dark' || root.dataset.theme === 'light') return root.dataset.theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
  button.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* Private mode, not worth handling. */
    }
    button.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} theme`);
  });
}

/* -------------------------------------------------------------- mobile nav */

const navToggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const nav = document.querySelector<HTMLElement>('[data-nav]');

if (navToggle && nav) {
  const setOpen = (open: boolean) => {
    navToggle.setAttribute('aria-expanded', String(open));
    if (open) nav.setAttribute('data-open', '');
    else nav.removeAttribute('data-open');
  };

  navToggle.addEventListener('click', () => {
    setOpen(navToggle.getAttribute('aria-expanded') !== 'true');
  });

  // Escape closes it and returns focus to the button that opened it.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      navToggle.focus();
    }
  });

  // A click outside the header dismisses it.
  document.addEventListener('click', (event) => {
    if (navToggle.getAttribute('aria-expanded') !== 'true') return;
    const target = event.target as Node;
    if (!nav.contains(target) && !navToggle.contains(target)) setOpen(false);
  });

  // Leave no stale open state behind when the desktop layout takes over.
  const wide = window.matchMedia('(min-width: 56.0625rem)');
  wide.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

// Real header height, so a full-viewport hero is exactly one screen minus the
// nav even when the nav wraps or mobile browser chrome moves.
const header = document.querySelector<HTMLElement>('.site-header');
if (header) {
  const measure = () => root.style.setProperty('--header-h', `${header.offsetHeight}px`);
  measure();
  window.addEventListener('resize', measure);
  new ResizeObserver(measure).observe(header);
}

export {};
