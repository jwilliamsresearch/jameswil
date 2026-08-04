# Project page spec: the case-study template

**Why this page matters most:** the work index gets skimmed. An individual
project page is where a hiring committee or engineering lead decides whether
you can actually do the thing. It is the highest-leverage page on the site.

Template: [src/pages/work/[...slug].astro](../src/pages/work/[...slug].astro)  
Schema: [src/content.config.ts](../src/content.config.ts)  
Styles: section 18b of [src/styles/global.css](../src/styles/global.css)  
Live examples: [walkgrid.md](../src/content/work/walkgrid.md),
[parm-x.md](../src/content/work/parm-x.md),
[lwswg.md](../src/content/work/lwswg.md)

---

## 1. Reading order (fixed, do not reorder)

The page is a guided descent from claim to evidence. Each band answers the
question the previous one raises.

| # | Band | Answers | Source |
|---|---|---|---|
| 1 | Logo, title, lead, meta strip | What is this, when, what was my role? | `logo`, `title`, `summary`, `period`, `status`, `role`, `tags` |
| 2 | Cover figure and caption | What does it look like? | `cover`, `coverAlt`, `coverCaption` |
| 3 | **Impact metrics** | Why should I keep reading? | `metrics` |
| 4 | Narrative prose with TOC rail | What was the problem, what was the idea? | markdown body |
| 5 | **How it works** | Can you actually build it? | `steps` |
| 6 | Figures | Show me. | `figures` |
| 7 | Outcomes | What changed because it existed? | `outcomes` |
| 8 | Stack and Partners | Is this credible and funded? | `stack`, `sponsors` |
| 9 | Project team | Who else was on it? | `team` |
| 10 | Funder marks and acknowledgement | Who paid for it? | `sponsors[].logo`, `funding` |
| 11 | Previous / next | Keep reading. | auto |
| 12 | CTA | Hire me. | auto |

Every band is optional. Omit the frontmatter key and the band disappears, with
no empty headings and no orphaned rules.

---

## 2. Rules per band

### Metrics (the hook)

The single most important element on the page. Four entries reads best. The
grid is 4 to 2 to 1, so three or five will not orphan.

- `value`: the number, short. `51`, `25+`, `18 min`, `MIT`. Never a sentence.
- `label`: what it counts, two to four words.
- `note`: **the comparison that makes it mean something.** This is the field
  people skip and it is the one that sells. "18 min" is a fact. "Down from
  nine hours" is an argument.

Aim for at least one *delta*, meaning something got faster, cheaper, more
accurate, or was found to be wrong. Scale numbers alone read as bragging. A
delta reads as impact. Where a project genuinely has no delta, say what the
numbers cover instead and do not invent one.

### Narrative (markdown body)

Three H2s, in this order:

1. **The brief**: the problem, stated so a non-specialist feels the stakes.
   End on a bolded sentence framing why the obvious approach fails.
2. **The insight**: the one idea that made it tractable. If there isn't one,
   the project probably isn't worth a full case study.
3. **What it does not do**: limitations, stated plainly.

That third section is counter-intuitive and it is the strongest trust signal on
the page. Anyone senior reading it will believe the numbers above because you
volunteered the caveats. Do not drop it.

### Steps

Four to six stages. Each has `title` (an imperative verb phrase), `body` (why
the stage exists and what decision it embodies), and optional `detail` (the
hard numbers, set in mono under a rule).

`detail` is where you prove depth. `1.4M km, 14.2M edges, 11.8M nodes` tells an
engineer more than a paragraph would.

### Figures

Two columns. If the figure count is odd, the template promotes the **first**
figure to full width automatically, so the grid never leaves an empty cell.
`wide: true` forces a specific figure wide on top of that.

Captions must make a *claim*, not label the image. Bad: "The controls screen."
Good: "The operator console. Everything here is mirrored onto the projected
map as it changes."

Figures carry the only colour on the site apart from the hero name. Keep
decorative chrome monochrome so they land.

#### Video figures

Screen recordings go in as video, never as animated GIF. Supply `video.mp4`
and `video.webm` pointing at `public/`, with `src` as the poster still in
`src/assets/`. The template then:

- optimises the poster through `getImage()` to WebP, because a `poster`
  attribute bypasses `<Image>` and would otherwise ship the original PNG
- sets `preload="none"`, so nothing downloads until the clip scrolls into view
- plays and pauses via IntersectionObserver, so five loops never run at once
- shows a poster with ordinary controls under `prefers-reduced-motion`
- toggles play on click, for anyone reading detail in a frame

### Outcomes

Two to four entries, each `title` plus `body`. Titles are conclusions, not
topics. Bad: "Adoption". Good: "The model worked, the interface was the
barrier."

Cover at least one of: someone adopted it, something measurably improved, it
was released openly, it changed a decision.

### Partners, funders and team

`sponsors` renders twice, deliberately:

- as **named partners** in type, with each organisation's actual role
  (`Funder, grant EP/S023305/1`, `Data provider`, `Host institution`)
- as a **funder logo band**, for any sponsor with a `logo`

The logo band is the one place raster logos are allowed. Grant terms often
require the mark, and a funder logo carries credibility that type alone cannot.
Logos sit on a permanent white plate so a dark theme never inverts a brand
colour, are held at 82% opacity so they support rather than shout, and link
through to the organisation when `href` is set.

`funding` is printed verbatim under the logos. Grant terms usually fix the
wording, so paste it exactly.

`team` lists named collaborators with affiliations. Do not invent names. If you
only know the organisations, leave `team` out and let `sponsors` carry it.

---

## 3. Design invariants

- Monochrome only. Colour lives in figures and funder logos, nothing else.
- Hairline grids (`1px` gap over a `--line` background) for every multi-cell
  band, matching the existing `.cards` pattern.
- Invert-on-hover (a `scaleY` sweep from the bottom) is the site's signature
  interaction, used on `.row` and `.proj-nav-item`. Do not add a third idiom.
- All type scales with `clamp()`. No fixed px font sizes.
- Every band collapses 4 to 2 to 1, or 2 to 1. Test at 375px before shipping.

---

## 4. Adding a new project

1. Drop a `.md` file in `src/content/work/`.
2. Put images in `src/assets/work/<project>/` and reference them relatively
   (`../../assets/work/<project>/name.png`) so `astro:assets` optimises them.
   Videos go in `public/assets/work/<project>/` and are referenced by URL.
3. Set `order`. Lower sorts first, and it drives the previous/next sequence.
4. Fill `metrics` first. If you cannot write four honest metrics, the project
   may belong on the index as a row rather than as a full case study.

### Converting GIFs

A 14 MB GIF is not a figure, it is a page weight problem. The five WalkGrid
clips went from 28.3 MB of GIF to 10.3 MB of MP4 and WebM, and because only
posters load up front the real first-paint cost is near zero.

`ffmpeg-static` is a devDependency for exactly this. Per clip:

```
ffmpeg -i in.gif -movflags +faststart -pix_fmt yuv420p \
  -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 26 -preset slow -an out.mp4
ffmpeg -i in.gif -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
  -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 -an out.webm
ffmpeg -i in.gif -vf "select=eq(n\,0)" -frames:v 1 -update 1 poster.png
```

### YAML gotchas

Both of these fail the build with an unhelpful error, and both bit during
this build:

- **Flow sequences split on commas.** `[pytest, 2,000-point ground truth]`
  parses as three items and fails schema validation. Quote any value containing
  a comma: `[pytest, "2,000-point ground truth"]`.
- **A colon followed by a space ends the key.** An unquoted `body:` containing
  `scenarios: matchday arrival` is a parse error. Quote every long prose scalar,
  meaning `body`, `note`, `caption`, `alt` and `detail`.

---

## 5. Traps already hit, do not repeat

**Astro only hoists `<script>` tags it can see statically.** Wrapping the video
playback script in `{condition && (<script>…)}` silently dropped it from the
bundle and left every clip frozen on its poster. Keep scripts at the top level
of the template and guard inside the script instead.

**`.row-inner` is a four-column grid with an optional first cell.** Row.astro
only renders `.row-num` when a `label` is passed, so a listing that omitted it
pulled every remaining cell one column left and crushed the title into the
3.5rem index gutter. All four cells now carry explicit `grid-column` values,
and the work index passes a zero-padded index as its label.

**Video posters bypass `<Image>`.** The `poster` attribute takes a plain URL,
so an unoptimised import ships at full size. Route it through `getImage()`.
