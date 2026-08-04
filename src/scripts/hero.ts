/**
 * Masked-letter hero.
 *
 * Each glyph is a window onto its own photograph. On load the images cut in
 * one letter at a time, then settle into an occasional ambient swap. Hovering
 * a letter shutters it through a short burst of new frames.
 *
 * Image URLs come from astro:assets via a JSON script tag, so this file never
 * needs to know a filename.
 */

interface Variant {
  small: string;
  large: string;
}

const el = document.querySelector<HTMLElement>('[data-name]');
const payload = document.getElementById('hero-images');

if (el && payload?.textContent) {
  const variants: Variant[] = JSON.parse(payload.textContent);

  // A phone glyph is a fraction of the size of a desktop one, so it gets the
  // smaller file. Chosen once, since a rotation mid-session would be worse
  // than serving a slightly larger image after a resize.
  const useLarge = window.matchMedia('(min-width: 52rem)').matches || window.devicePixelRatio > 2;
  const images = variants.map((v) => (useLarge ? v.large : v.small));

  const text = el.textContent?.trim() ?? '';
  el.setAttribute('aria-label', text);
  el.textContent = '';

  // Words are the layout unit: one line when wide, stacked lines when narrow.
  const letters: HTMLSpanElement[] = [];
  const words = text.split(/\s+/).map((word) => {
    const wordEl = document.createElement('span');
    wordEl.className = 'word';
    wordEl.setAttribute('aria-hidden', 'true');
    for (const char of word) {
      const span = document.createElement('span');
      span.className = 'ltr';
      span.textContent = char;
      letters.push(span);
      wordEl.appendChild(span);
    }
    el.appendChild(wordEl);
    return wordEl;
  });
  el.setAttribute('data-ready', '');

  /* ---------------------------------------------------------------- fit -- */

  const narrow = window.matchMedia('(max-width: 52rem)');

  // Stacking sizes each word to the full width, which turns a one or two
  // letter word into an absurd single glyph. Only stack when every word is
  // long enough to carry a line on its own.
  const canStack = words.length > 1 && text.split(/\s+/).every((word) => word.length >= 3);
  const stacked = {
    get matches() {
      return canStack && narrow.matches;
    },
  };

  /** First glyph's left edge to last glyph's right edge, excluding the
      letter-spacing that hangs off the final character. */
  function ink(node: HTMLElement): number {
    const glyphs = node.querySelectorAll<HTMLElement>('.ltr');
    if (glyphs.length === 0) return 0;
    return (
      glyphs[glyphs.length - 1].getBoundingClientRect().right -
      glyphs[0].getBoundingClientRect().left
    );
  }

  function fit() {
    const available = (el!.parentElement as HTMLElement).clientWidth;
    if (!available) return;

    if (stacked.matches) el!.setAttribute('data-stack', '');
    else el!.removeAttribute('data-stack');

    if (stacked.matches) {
      // Each word sized independently so both lines run edge to edge.
      el!.style.fontSize = '';
      for (const word of words) {
        word.style.fontSize = '100px';
        const width = ink(word);
        if (width > 0) word.style.fontSize = `${((100 * available) / width).toFixed(2)}px`;
      }
    } else {
      for (const word of words) word.style.fontSize = '';
      el!.style.fontSize = '100px';
      const width = ink(el!);
      if (width > 0) el!.style.fontSize = `${((100 * available) / width).toFixed(2)}px`;
    }
  }

  fit();
  void document.fonts?.ready.then(fit);

  let resizeTimer: number;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(fit, 120);
  });
  narrow.addEventListener('change', fit);

  /* ------------------------------------------------------------ montage -- */

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (n: number) => Math.floor(Math.random() * n);

  /** A handful of photos across a dozen glyphs would repeat visibly, so each
      letter also gets its own zoom and crop window. The zoom is height based
      and never below 120%, which guarantees full coverage of the glyph. */
  function paint(span: HTMLElement) {
    const previous = span.dataset.img;
    let next = images[rand(images.length)];
    if (images.length > 1) {
      while (next === previous) next = images[rand(images.length)];
    }
    span.dataset.img = next;
    span.style.setProperty('--img', `url("${next}")`);
    span.style.backgroundSize = `auto ${120 + rand(80)}%`;
    span.style.backgroundPosition = `${rand(101)}% ${rand(101)}%`;
    span.classList.add('has-img');
  }

  if (reduced) {
    for (const span of letters) paint(span);
  } else {
    for (const src of images) new Image().src = src;

    function flick(span: HTMLElement) {
      span.classList.remove('flick');
      void span.offsetWidth;
      paint(span);
      span.classList.add('flick');
    }

    if (window.matchMedia('(hover: hover)').matches) {
      for (const span of letters) {
        span.addEventListener('mouseenter', () => {
          if (span.dataset.busy) return;
          span.dataset.busy = '1';
          let frame = 0;
          const frames = 3 + rand(3);
          const step = () => {
            flick(span);
            frame += 1;
            if (frame < frames) window.setTimeout(step, 130 + frame * 30);
            else delete span.dataset.busy;
          };
          step();
        });
      }
    }

    // Fill in. Every letter is cut exactly once, in scattered order, so the
    // name resolves on its own with nothing snapping into place at the end.
    const order = [...letters];
    for (let i = order.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }

    let elapsed = 0;
    order.forEach((span, index) => {
      elapsed += 135 + index * 9;
      window.setTimeout(() => flick(span), elapsed);
    });

    // Ambient: an occasional single swap, well spaced.
    window.setTimeout(() => {
      window.setInterval(() => {
        if (document.hidden) return;
        flick(letters[rand(letters.length)]);
      }, 4200);
    }, elapsed + 1400);
  }
}

export {};
