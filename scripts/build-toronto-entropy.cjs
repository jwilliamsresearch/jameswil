/**
 * Aggregate raw Toronto OSM points into H3 cells carrying two measures.
 *
 *   in : data/toronto-osm-raw.json          (74k points, build input, not deployed)
 *   out: public/assets/notes/toronto-entropy.json
 *
 * Two things are computed per cell:
 *
 *   H    Shannon entropy over Tier-1 functional categories. How mixed the cell
 *        is internally. This is "no single category names this place".
 *
 *   JSD  Mean Jensen-Shannon divergence between the cell's category
 *        distribution and those of its six H3 neighbours. How different the
 *        cell is from what surrounds it. This is the measure that actually
 *        matches Turner: liminality is being *between* two states, not being
 *        internally jumbled. A 50/50 cafe-and-warehouse cell is mixed; a cell
 *        on the seam between a cafe district and a warehouse district is
 *        liminal, and those are not the same cell.
 *
 * Street furniture is excluded before either measure is computed. See
 * taxonomy.cjs: bench alone is 8,615 nodes in this extract, more than every
 * restaurant in Toronto, and a bench says a sidewalk is present rather than
 * saying anything about what a place is for.
 *
 * Run: node scripts/build-toronto-entropy.cjs
 */

const fs = require('fs');
const path = require('path');
const h3 = require('h3-js');
const { TIERS, FURNITURE, VACANT, classify } = require('./taxonomy.cjs');

const RES = 10;      // ~65 m across
const MIN_N = 5;     // below this, entropy is a coin flip rather than a reading

/* A cell compared against a single neighbour reaches JSD 1.0 whenever the two
   happen to share no category, which puts noise in the top decile. The bias is
   mild (corr(neighbours, JSD) = -0.12, versus 0.51 for the density confound
   entropy had) so a floor of two is enough: it removes the worst of the tail
   while keeping 73% of cells. Demanding three would cost 57% of the map. */
const MIN_NBRS = 2;

const ROOT = path.join(__dirname, '..');
const IN = path.join(ROOT, 'data', 'toronto-osm-raw.json');
const OUT = path.join(ROOT, 'public', 'assets', 'notes', 'toronto-entropy.json');

/* ---------- information theory ---------- */

/** Shannon entropy in bits over an array of counts. */
function entropy(counts) {
  const n = counts.reduce((a, b) => a + b, 0);
  if (!n) return 0;
  return counts.reduce((acc, c) => (c ? acc - (c / n) * Math.log2(c / n) : acc), 0);
}

/**
 * Jensen-Shannon divergence between two count vectors, in bits.
 * Bounded [0, 1] with log2: 0 when the distributions match, 1 when they share
 * no category at all. Symmetric, unlike KL divergence, and finite even when a
 * category is absent from one side, which is why it works on sparse cells.
 */
function jsd(a, b) {
  const na = a.reduce((x, y) => x + y, 0);
  const nb = b.reduce((x, y) => x + y, 0);
  if (!na || !nb) return 0;

  let hm = 0, ha = 0, hb = 0;
  for (let i = 0; i < a.length; i++) {
    const p = a[i] / na;
    const q = b[i] / nb;
    const m = (p + q) / 2;
    if (m > 0) hm -= m * Math.log2(m);
    if (p > 0) ha -= p * Math.log2(p);
    if (q > 0) hb -= q * Math.log2(q);
  }
  return Math.max(0, hm - (ha + hb) / 2);
}

/* ---------- aggregate ---------- */

const raw = JSON.parse(fs.readFileSync(IN, 'utf8'));
console.log(`read ${raw.length.toLocaleString()} raw points`);

const cells = new Map();
const tally = { functional: 0, furniture: 0, vacant: 0 };
const catTotals = new Array(TIERS.length).fill(0);

for (const [lat, lon, key, value] of raw) {
  const cat = classify(key, value);
  const idx = h3.latLngToCell(lat, lon, RES);

  let cell = cells.get(idx);
  if (!cell) {
    cell = { counts: new Array(TIERS.length).fill(0), furniture: 0, vacant: 0 };
    cells.set(idx, cell);
  }

  if (cat === FURNITURE) { cell.furniture++; tally.furniture++; continue; }
  if (cat === VACANT) { cell.vacant++; tally.vacant++; continue; }

  cell.counts[cat]++;
  catTotals[cat]++;
  tally.functional++;
}

console.log(
  `classified: ${tally.functional.toLocaleString()} functional, ` +
  `${tally.furniture.toLocaleString()} street furniture ` +
  `(${(100 * tally.furniture / raw.length).toFixed(1)}%), ` +
  `${tally.vacant.toLocaleString()} vacant`,
);

console.log('\nTier-1 mix:');
TIERS.map((t, i) => [t, catTotals[i]])
  .sort((a, b) => b[1] - a[1])
  .filter(([, c]) => c > 0)
  .forEach(([t, c]) => console.log(`  ${t.padEnd(26)} ${String(c).padStart(6)}  ${(100 * c / tally.functional).toFixed(1)}%`));

/* ---------- per-cell measures ---------- */

/* Only cells clearing the floor take part, both as subjects and as neighbours.
   A neighbour with two POIs would otherwise drag divergence around on noise. */
const eligible = new Map();
for (const [idx, cell] of cells) {
  const n = cell.counts.reduce((a, b) => a + b, 0);
  if (n >= MIN_N) eligible.set(idx, { ...cell, n });
}

console.log(
  `\ncells: ${cells.size.toLocaleString()} total, ` +
  `${eligible.size.toLocaleString()} clear the n>=${MIN_N} floor ` +
  `(${(100 * eligible.size / cells.size).toFixed(1)}%)`,
);

const out = [];
for (const [idx, cell] of eligible) {
  const H = entropy(cell.counts);

  let sum = 0, seen = 0;
  for (const nb of h3.gridDisk(idx, 1)) {
    if (nb === idx) continue;
    const other = eligible.get(nb);
    if (!other) continue;
    sum += jsd(cell.counts, other.counts);
    seen++;
  }

  /* Too few qualifying neighbours means no betweenness to report. Left null
     rather than zero, since "nothing adjacent to compare against" is not the
     same claim as "identical to its surroundings". */
  const J = seen >= MIN_NBRS ? sum / seen : null;

  /* Sparse [catIndex, count, ...] pairs keep the payload small. */
  const sparse = [];
  cell.counts.forEach((c, i) => { if (c) sparse.push(i, c); });

  out.push([
    idx,
    cell.n,
    Number(H.toFixed(3)),
    J === null ? null : Number(J.toFixed(3)),
    seen,
    sparse,
    cell.furniture,
    cell.vacant,
  ]);
}

/* ---------- scale breaks ---------- */

/** Decile breaks. Both measures are right-skewed, so a linear ramp would
    leave most of the colour range unused, which is the fault in the first
    version of this map: it normalised to 3 bits when nothing exceeded 2.25. */
function deciles(values) {
  const s = values.slice().sort((a, b) => a - b);
  return Array.from({ length: 9 }, (_, i) =>
    Number(s[Math.floor((i + 1) / 10 * s.length)].toFixed(3)));
}

const hVals = out.map((r) => r[2]);
const jVals = out.filter((r) => r[3] !== null).map((r) => r[3]);

const meta = {
  res: RES,
  minN: MIN_N,
  minNbrs: MIN_NBRS,
  cats: TIERS,
  source: 'OpenStreetMap contributors (ODbL), extracted August 2026',
  bbox: [43.580, -79.640, 43.860, -79.110],
  totals: {
    rawPoints: raw.length,
    functional: tally.functional,
    furniture: tally.furniture,
    vacant: tally.vacant,
    cellsTotal: cells.size,
    cellsShown: eligible.size,
    cellsWithBetweenness: out.filter((r) => r[3] !== null).length,
  },
  H: {
    max: Number(Math.max(...hVals).toFixed(3)),
    mean: Number((hVals.reduce((a, b) => a + b, 0) / hVals.length).toFixed(3)),
    breaks: deciles(hVals),
  },
  jsd: {
    max: Number(Math.max(...jVals).toFixed(3)),
    mean: Number((jVals.reduce((a, b) => a + b, 0) / jVals.length).toFixed(3)),
    breaks: deciles(jVals),
  },
  cells: out,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(meta));

const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
const rawMb = (fs.statSync(IN).size / 1048576).toFixed(2);
console.log(`\nH   mean ${meta.H.mean}  max ${meta.H.max}`);
console.log(`JSD mean ${meta.jsd.mean}  max ${meta.jsd.max}`);
console.log(`\nwrote ${OUT.replace(ROOT, '.')}  ${kb} KB  (from ${rawMb} MB raw)`);
