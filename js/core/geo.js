// core/geo.js — load light geometry packs (data/geo/lite/<pack>.topo.json, data/peoples/…, data/admin/…) as GeoJSON,
// once, with an in-memory cache. Needs vendor/topojson-client.min.js on the page.
const cache = new Map();

/** GeoJSON FeatureCollection for a topojson file (first object unless `object` is given). */
export async function loadTopo(url, object) {
  const k = url + '#' + (object || '');
  if (!cache.has(k)) cache.set(k, fetch(url).then(r => { if (!r.ok) throw new Error(`${url}: ${r.status}`); return r.json(); })
    .then(t => topojson.feature(t, t.objects[object || Object.keys(t.objects)[0]])));
  return cache.get(k);
}

/** A story geometry pack by name, e.g. 'sumba-kab' → features keyed by their name property. */
export const PACKS = {
  'sumba-island': { url: 'data/geo/lite/sumba-island.topo.json', key: () => 'Sumba' },
  'sumba-kab': { url: 'data/geo/lite/sumba-kab.topo.json', key: p => p.kab },
  'sumba-kec': { url: 'data/geo/lite/sumba-kec.topo.json', key: p => p.kec },
  'sumba-desa': { url: 'data/geo/lite/sumba-desa.topo.json', key: p => p.desa },
  'indonesia-prov': { url: 'data/geo/lite/indonesia-prov.topo.json', key: p => p.prov },
  'indonesia-kab': { url: 'data/geo/lite/indonesia-kab.topo.json', key: p => p.kab }
};
export async function loadPack(name) {
  const pk = PACKS[name]; if (!pk) throw new Error('unknown geometry pack ' + name);
  const fc = await loadTopo(pk.url), byKey = new Map();
  fc.features.forEach(f => { const k = pk.key(f.properties || {}); if (!k) return; (byKey.get(k) || byKey.set(k, []).get(k)).push(f); });
  return { fc, byKey };
}

/** Catmull-Rom smoothing for flow paths given as [[lon,lat],…] → [[lat,lng],…] dense polyline. */
export function smoothPath(pts, steps = 18) {
  const P = pts.map(([x, y]) => [y, x]);
  if (P.length === 2) { // gentle arc for two-point flows
    const [a, b] = P, mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], dx = b[1] - a[1], dy = b[0] - a[0], len = Math.hypot(dx, dy) || 1, bend = Math.min(0.18 * len, 3);
    P.splice(1, 0, [mid[0] + (dx / len) * bend, mid[1] - (dy / len) * bend]);
  }
  const out = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map(k => 0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  out.push(P[P.length - 1]);
  return out;
}
