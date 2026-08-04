# Site Ruleset: jameswil.com

**Audience:** Hiring committees (academic) and senior technical recruiters / leads (industry).  
**Tone:** Precise and confident. Numbers do the selling. No filler.  
**Last updated:** 2026-08-04

---

## 1. Copy rules

### 1.1 Lead with outcomes, not activities

Bad: "I work on ETL pipelines and geocoding."  
Good: "A geocoder resolving 894M+ place references. A conflation platform unifying 53 sources into 23.5M records. Built, deployed, maintained."

Every claim that can carry a number must carry a number. Quantify scale (records, sources, countries), speed (response time, process reduction), and reach (publications, deployments).

### 1.2 No em dashes, ever

Em dashes (—) do not appear anywhere on this site, in any page copy, caption,
frontmatter field or note. They read as machine-written prose, which is fatal
on a site whose entire purpose is to establish that you wrote your own work.

Restructure the sentence rather than substituting an en dash. A comma, a colon,
a full stop or a pair of brackets carries the same break. The examples below
are the only place on this site an em dash may appear, and only because they
are specimens of what not to write.

| Instead of | Write |
|---|---|
| The model worked &mdash; the interface was the barrier. | The model worked, the interface was the barrier. |
| Three metrics &mdash; cosine, Euclidean, Manhattan. | Three metrics: cosine, Euclidean and Manhattan. |
| It covers one city &mdash; extending is not free. | It covers one city. Extending is not free. |

Check before every deploy. The pattern below excludes this file, which is the
only expected match:

```
grep -rn '—' src/content src/pages src/components notes --exclude=site-ruleset.md
```

### 1.3 Strong verbs, no hedging

Banned words: *involved in*, *worked on*, *helped with*, *contributed to*, *various*, *several*, *some*, *things*, *etc.*

Preferred verbs: *built*, *designed*, *led*, *delivered*, *cut*, *resolved*, *deployed*, *authored*, *reduced*, *fused*, *unified*.

### 1.4 One claim per sentence

Do not stack clauses. Make one sharp claim, stop, move on.

### 1.5 Sell the rarity, not the resume

Reframe skills as rare combinations: "A geospatial researcher who ships production code" or "PhD-level rigor, engineering-level delivery." Committees see many researchers. Hiring managers see many engineers. Very few are both.

### 1.6 The tagline rule

The tagline (hero line) must answer "what does James do that matters?" in one sentence. It should make a hiring manager or committee member want to keep reading. Test: if you could say the same sentence about 50 other people, rewrite it.

Current tagline is strong. Preserve the structure but revisit quarterly.

### 1.7 Academic copy conventions

- Publication counts go in the hero or bio, not buried in a table.
- Teaching experience needs explicit student numbers or course scale where possible.
- Research vision (1–2 sentences) belongs on the About page, above the technical detail.
- Fellowship and grant language signals academic credibility; always name the funder (Leverhulme, Ordnance Survey).

### 1.8 Industry copy conventions

- Every project entry needs a one-line impact statement (what changed, at what scale).
- Tech stack belongs in the project meta, not inline in prose.
- Consulting availability should be stated plainly; ambiguity costs enquiries.

---

## 2. SEO rules

### 2.1 Keyword strategy: primary targets

Target a tight cluster. Do not dilute.

| Intent | Primary keyword | Secondary |
|---|---|---|
| Academic search | "geospatial data science researcher" | "platial analysis", "geocoding research" |
| Industry search | "geospatial data developer" | "spatial ETL developer", "PostGIS developer" |
| Name search | "James Williams geospatial" | "James Williams data science" |

These should appear naturally in: `<title>`, `<meta description>`, H1/H2 headings, first 100 words of each page, and JSON-LD.

### 2.2 Page titles: formula

- Home: `James Williams: Geospatial Data Developer and Research Scientist`
- About: `About: James Williams | Geospatial Data Science`
- Publications: `Publications: James Williams | 21 Peer-Reviewed Papers`
- Teaching: `Teaching: James Williams | Computer Science Courses`
- Work: `Work: James Williams | Geospatial Projects at Scale`
- Contact: `Contact James Williams: Geospatial Developer and Researcher`

### 2.3 Meta descriptions: rules

- 140–160 characters.
- Must include a number and the primary keyword.
- No generic phrases: not "welcome to my website", not "learn more about James."
- Each page gets a unique description.

### 2.4 Structured data (JSON-LD)

Already implemented. Maintain and extend:

- `Person` schema: name, jobTitle, url, sameAs (GitHub, LinkedIn), worksFor, knowsAbout.
- `WebSite` schema with `potentialAction` (SearchAction if search is ever added).
- `ScholarlyArticle` on each publication page.
- `Course` on each teaching page.

Keep `knowsAbout` updated with current tools and topics. It feeds Google's entity graph.

### 2.5 Content freshness signals

- Update `updated:` frontmatter on any page that changes.
- RSS feed is already implemented, so use it. It signals an active site to crawlers.
- `llms.txt` is already implemented, so maintain it.
- Sitemap must include lastmod dates.

### 2.6 Technical SEO checklist

- [ ] Canonical URLs on every page.
- [ ] OG image: 1200×630, text-readable, branded. Current cn-tower-view.jpg, so consider a purpose-built card.
- [ ] Twitter card meta tags (already in Seo.astro, verify they render).
- [ ] `robots.txt` allows all relevant paths (already implemented, review annually).
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms. Run Lighthouse monthly.
- [ ] No broken internal links. Run a link check before every deploy.
- [ ] Alt text on all images: descriptive, keyword-relevant where natural.

### 2.7 Backlink targets

Prioritise links from:
- University profile pages (Nottingham, Birmingham Newman), which must link to jameswil.com.
- Google Scholar profile, verified author with homepage URL.
- ORCID profile, homepage field set.
- GitHub profile, website field set.
- LinkedIn, featured link in intro section.
- Co-author pages, where you can ask collaborators to link publications pages.
- Conference proceedings and journal author pages where author URL is accepted.

---

## 3. Design and UX rules

### 3.1 Minimalism means decisions, not absence

Every element must justify its presence. If removing it does not break a user journey or reduce information, remove it.

### 3.2 Information hierarchy: fixed order

Each page must establish hierarchy in 3 seconds:

1. Who this is / what this page is (H1 or hero).
2. The one thing that makes it worth staying (the hook, whether a number, a strong line, a clear value).
3. Proof (publications, project scale, credentials).
4. What to do next (the CTA, whether email, CV, or next page).

Never bury the hook below the fold.

### 3.3 Navigation rules

- Maximum 6 nav items (currently at 6, so hold the line).
- Mobile nav must be usable with one thumb.
- Active state must be visually unambiguous.
- No dropdowns. Flat nav only.

### 3.4 Typography rules

- Body: 16–18px, generous line height (1.6–1.75). Academic readers skim long text; comfortable measure reduces abandonment.
- Headings: a clear scale, with H1 substantially larger than H2, H2 substantially larger than H3.
- Monospace only for code snippets or tool names in technical tables. Not for decoration.
- No more than 2 typefaces site-wide.

### 3.5 Colour rules

- Neutral base (white/off-white background, near-black text).
- One accent colour, used sparingly for links and CTAs only.
- Sufficient contrast: WCAG AA minimum everywhere, AAA for body text.
- Dark mode: if implemented, must be tested for every component.

### 3.6 Mobile-first

- All layouts must be tested at 375px width before considering desktop.
- Tables on About/Publications are a mobile risk: wrap in `overflow-x: auto` container.
- Hero must be readable without pinching at 375px.
- Touch targets: minimum 44×44px.

### 3.7 Performance rules

- Hero images: serve via `astro:assets` with correct `width`/`height` to avoid CLS. Already in place: maintain.
- No render-blocking third-party scripts.
- Fonts: use `font-display: swap`. Subset if using a web font.
- PDFs in `/public/assets/papers/`: do not load these on page load; link only.

---

## 4. Content strategy: dual-market

### 4.1 Home page

Must work for both markets in the first viewport:

- Name + role(s): include both "Geospatial Data Developer" and "Research Scientist."
- Tagline that signals technical depth and research credibility simultaneously.
- Proof links visible without scrolling: GitHub, LinkedIn, CV, email.

### 4.2 Work page

Industry-facing primary. Frame every project as: problem → approach → outcome at scale.  
Do not list publications here. Do not use academic language (no "investigated", "analysed").

### 4.3 Publications page

Academic-facing primary. Count should be in the page intro. Show venue quality signals (journal name, conference tier) where possible. Link to PDFs; PDFs are already in `/public/assets/papers/`.

### 4.4 Teaching page

Covers both markets: academics want teaching range; industry wants evidence of communication skills and leadership. Include student numbers or cohort size where available.

### 4.5 About page

Serves both. Current structure is good. Improvement opportunities:
- Add a 2–3 sentence research vision before the technical skills table.
- Make the "How I work" section punchier: it's the best copy on the site; move it higher.
- Add consulting availability line at the bottom.

### 4.6 CV / PDF

- CV should be downloadable from the hero (already linked via `/cv.pdf`).
- Maintain a matching version for academic applications (longer, publication list) and industry (one page, impact-forward).

---

## 5. Language patterns to use and avoid

| Avoid | Use instead |
|---|---|
| "passionate about" | "building X" or just state the thing |
| "strong skills in" | name the skill, give the context |
| "looking to" | state what you do, not what you want |
| "leveraged" | "used", "built with", "deployed on" |
| "synergies" / "ecosystem" | describe the actual relationship |
| "world-class" / "cutting-edge" | let the numbers make that claim |
| passive voice | active: "I designed", "the team shipped" |
| "etc." | be specific or stop the list |
| long throat-clearing intros | first sentence must be the point |

---

## 6. Review cadence

| Item | Frequency |
|---|---|
| Update `updated:` frontmatter | On every content change |
| Run Lighthouse audit | Monthly |
| Review tagline and hero copy | Quarterly |
| Check backlink profile | Quarterly |
| Refresh About page with new roles/numbers | On every role change |
| Add new publications to bib + publications page | On every acceptance |
| Verify all PDF links work | On every deploy |
