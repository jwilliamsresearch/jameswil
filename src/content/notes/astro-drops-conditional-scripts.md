---
title: "Astro will silently drop a script you wrapped in a condition"
date: 2026-08-04
tags: [Astro, Debugging]
draft: false
---

Five screen recordings on a project page, every one frozen on its poster
frame. No console error, no failed request, no missing file. The videos were
in the bundle and the playback script was not.

The script used an IntersectionObserver to play each clip only while it was on
screen, so I had wrapped it in a guard: render it only when the page actually
has videos.

```astro
{figures.some((f) => f.video) && (
  <script>/* never bundled */</script>
)}
```

Astro processes `<script>` tags statically, at compile time. It looks at the
template, finds the tags, and bundles them. A tag inside a JSX expression is
not there to be found, so it is dropped without complaint. The guard that was
supposed to avoid shipping dead code shipped no code at all.

The fix is to keep the tag at the top level and move the condition inside it,
where it costs a few bytes and always runs:

```js
const vids = document.querySelectorAll('video.fig-video');
if (vids.length) { /* ... */ }
```

Worth knowing because the failure is quiet. Nothing errors. The page just
does slightly less than you wrote.
