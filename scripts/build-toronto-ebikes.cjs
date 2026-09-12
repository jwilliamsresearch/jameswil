/**
 * Snapshot Bike Share Toronto's GBFS feed and measure e-bike availability.
 *
 *   in : https://toronto.publicbikesystem.net/customer/gbfs/v3.0/
 *   out: public/assets/notes/toronto-ebikes.json
 *
 * The feed reports inventory per bike model at every dock, so classic and
 * electric are separately countable. Two things are computed from that:
 *
 *   reach     For each station, the distance to the nearest station holding
 *             an e-bike. This is the number a rider actually experiences:
 *             not "how many e-bikes exist" but "how far to one from here".
 *
 *   charge    For each station, the distance and bearing to the nearest
 *             charging dock. An e-bike returned to a plain dock does not
 *             recharge, so the charging network sets where electric supply
 *             can replenish itself without a van.
 *
 * Both are great-circle distances. Over a 25 km city the spheroid correction
 * is under a metre, which is far below the positional error in the dock
 * coordinates themselves.
 *
 * Run: node scripts/build-toronto-ebikes.cjs
 */

const fs = require('fs');
const path = require('path');

const BASE = 'https://toronto.publicbikesystem.net/customer/gbfs/v3.0/';
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'assets', 'notes', 'toronto-ebikes.json');

/* The pedal models, named rather than inferred. EFIT, EFIT G5, BOOST and
   ASTRO are the battery assisted stock, and anything the feed adds later
   falls to electric by default. That default is the safe direction: a new
   classic model counted as electric shows up immediately as a jump in the
   headline number, where the reverse would quietly inflate availability. */
const CLASSIC = new Set(['ICONIC', 'FIT', 'METRO', 'METRO_CONNECTED', 'CHLOE', 'COSMO']);

const R = 6371008.8; // IUGG mean Earth radius, metres

function haversine(aLat, aLon, bLat, bLon) {
  const p = Math.PI / 180;
  const dLat = (bLat - aLat) * p;
  const dLon = (bLon - aLon) * p;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aLat * p) * Math.cos(bLat * p) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Initial bearing from a to b, degrees clockwise from north. */
function bearing(aLat, aLon, bLat, bLon) {
  const p = Math.PI / 180;
  const y = Math.sin((bLon - aLon) * p) * Math.cos(bLat * p);
  const x =
    Math.cos(aLat * p) * Math.sin(bLat * p) -
    Math.sin(aLat * p) * Math.cos(bLat * p) * Math.cos((bLon - aLon) * p);
  return (Math.atan2(y, x) / p + 360) % 360;
}

function quantile(sorted, q) {
  if (!sorted.length) return null;
  const i = (sorted.length - 1) * q;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? sorted[lo] : sorted[lo] + (i - lo) * (sorted[hi] - sorted[lo]);
}

/** GBFS 3.0 gives localised names as [{text, language}]. Take English. */
function name(field) {
  if (typeof field === 'string') return field;
  if (!Array.isArray(field)) return '';
  const en = field.find((x) => x.language === 'en');
  return (en || field[0] || {}).text || '';
}

async function get(file) {
  const res = await fetch(BASE + file);
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  return res.json();
}

(async () => {
  const [info, status] = await Promise.all([
    get('station_information.json'),
    get('station_status.json'),
  ]);

  const meta = new Map(info.data.stations.map((s) => [s.station_id, s]));

  /* A station in status but not in information has no coordinates, so it
     cannot be placed or measured against. Dropped, and counted, because a
     silent drop would quietly change every denominator below. */
  let unplaced = 0;

  const stations = [];
  for (const s of status.data.stations) {
    const m = meta.get(s.station_id);
    if (!m || typeof m.lat !== 'number' || typeof m.lon !== 'number') {
      unplaced++;
      continue;
    }

    let classic = 0;
    let electric = 0;
    const models = {};
    for (const v of s.vehicle_types_available || []) {
      if (!v.count) continue;
      models[v.vehicle_type_id] = v.count;
      if (CLASSIC.has(v.vehicle_type_id)) classic += v.count;
      else electric += v.count;
    }

    stations.push({
      id: s.station_id,
      name: name(m.name),
      lat: m.lat,
      lon: m.lon,
      capacity: m.capacity || 0,
      classic,
      electric,
      models,
      docksFree: s.num_docks_available || 0,
      disabled: s.num_vehicles_disabled || 0,
      charging: !!m.is_charging_station,
      renting: !!s.is_renting,
    });
  }

  const chargers = stations.filter((s) => s.charging);
  const withE = stations.filter((s) => s.electric > 0);

  /* 1,068 stations against 52 chargers and roughly 335 e-bike holders is
     ~90k distance pairs. Brute force is a few milliseconds and avoids an
     index whose correctness would itself need checking. */
  for (const s of stations) {
    let best = Infinity;
    let bestC = null;
    for (const c of chargers) {
      const d = haversine(s.lat, s.lon, c.lat, c.lon);
      if (d < best) {
        best = d;
        bestC = c;
      }
    }
    s.chargerM = bestC ? Math.round(best) : null;
    s.chargerId = bestC ? bestC.id : null;
    /* Bearing runs from the charger to the station, which is the direction
       the charge-space view places it in. A charging dock sits at its own
       origin, so its bearing is undefined and recorded as null. */
    s.chargerBrg = bestC && best > 0 ? Math.round(bearing(bestC.lat, bestC.lon, s.lat, s.lon)) : null;

    let bestE = Infinity;
    for (const e of withE) {
      const d = haversine(s.lat, s.lon, e.lat, e.lon);
      if (d < bestE) bestE = d;
    }
    s.reachM = withE.length ? Math.round(bestE) : null;
  }

  const sum = (f) => stations.reduce((a, s) => a + f(s), 0);
  const modelTotals = {};
  for (const s of stations) {
    for (const [k, v] of Object.entries(s.models)) modelTotals[k] = (modelTotals[k] || 0) + v;
  }

  const reach = stations.map((s) => s.reachM).filter((v) => v !== null).sort((a, b) => a - b);
  const chargeD = stations.map((s) => s.chargerM).filter((v) => v !== null).sort((a, b) => a - b);

  const eAtChargers = chargers.reduce((a, s) => a + s.electric, 0);
  const totalE = sum((s) => s.electric);

  const out = {
    /* The feed's own clock, not the build clock. The note quotes this and it
       has to be the moment the counts were true. */
    captured: status.last_updated || new Date().toISOString(),
    source: BASE,
    totals: {
      stations: stations.length,
      unplaced,
      capacity: sum((s) => s.capacity),
      bikes: sum((s) => s.classic + s.electric),
      classic: sum((s) => s.classic),
      electric: totalE,
      disabled: sum((s) => s.disabled),
      chargers: chargers.length,
      chargerCapacity: chargers.reduce((a, s) => a + s.capacity, 0),
      empty: stations.filter((s) => s.classic + s.electric === 0).length,
      full: stations.filter((s) => s.docksFree === 0).length,
      noElectric: stations.filter((s) => s.electric === 0).length,
      notRenting: stations.filter((s) => !s.renting).length,
      electricAtChargers: eAtChargers,
    },
    models: modelTotals,
    reach: {
      median: Math.round(quantile(reach, 0.5)),
      p90: Math.round(quantile(reach, 0.9)),
      max: reach[reach.length - 1],
    },
    charge: {
      median: Math.round(quantile(chargeD, 0.5)),
      p90: Math.round(quantile(chargeD, 0.9)),
      max: chargeD[chargeD.length - 1],
    },
    /* Array of arrays rather than objects: 1,068 rows with named keys is
       most of the payload spent on repeating the key names. */
    cols: ['id', 'name', 'lat', 'lon', 'cap', 'classic', 'electric', 'docksFree', 'charging', 'chargerM', 'chargerBrg', 'reachM'],
    stations: stations.map((s) => [
      s.id,
      s.name,
      Number(s.lat.toFixed(5)),
      Number(s.lon.toFixed(5)),
      s.capacity,
      s.classic,
      s.electric,
      s.docksFree,
      s.charging ? 1 : 0,
      s.chargerM,
      s.chargerBrg,
      s.reachM,
    ]),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out));

  const t = out.totals;
  const pct = (n, d) => ((100 * n) / d).toFixed(1) + '%';
  console.log(`captured ${out.captured}`);
  console.log(`\n${t.stations} stations, ${t.capacity} docks, ${t.bikes} bikes out (${pct(t.bikes, t.capacity)} full)`);
  console.log(`classic ${t.classic}  electric ${t.electric} (${pct(t.electric, t.bikes)} of stock)`);
  console.log(`models: ${JSON.stringify(out.models)}`);
  console.log(`\nempty ${t.empty}  full ${t.full}  not renting ${t.notRenting}`);
  console.log(`no e-bike at all: ${t.noElectric} of ${t.stations} (${pct(t.noElectric, t.stations)})`);
  console.log(`chargers ${t.chargers}, holding ${t.electricAtChargers} e-bikes (${pct(t.electricAtChargers, t.electric)} of electric stock)`);
  console.log(`\nnearest e-bike: median ${out.reach.median} m, p90 ${out.reach.p90} m, worst ${out.reach.max} m`);
  console.log(`nearest charger: median ${out.charge.median} m, p90 ${out.charge.p90} m, worst ${out.charge.max} m`);
  if (t.unplaced) console.log(`\n${t.unplaced} station(s) in status with no coordinates, dropped`);

  const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
  console.log(`\nwrote ${OUT.replace(ROOT, '.')}  ${kb} KB`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
