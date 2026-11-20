// voronoi-worker.js — "Language areas": Voronoi cells of the Glottolog language points, clipped to Natural Earth land.
// Runs in a Web Worker (turf is vendored): the main thread stays responsive and receives progress messages.
/* global turf, importScripts */
importScripts('../vendor/turf.min.js');

onmessage = ({ data }) => {
  try {
    const { pts, countries } = data;   // pts: [[lon, lat, familyIndex, name, glottocode], …] (longitudes already unwrapped)
    // ---- land parts (each polygon of each country), simplified, with bboxes; Pacific parts shifted +360 like the points
    const parts = [];
    for (const f of countries.features) {
      const g = f.geometry, polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
      for (const rings of polys) {
        const meanLon = rings[0].reduce((s, p) => s + p[0], 0) / rings[0].length;
        const d = meanLon < -100 ? 360 : 0;
        let poly = turf.polygon(rings.map(r => r.map(([x, y]) => [x + d, y])));
        try { poly = turf.simplify(poly, { tolerance: 0.01, highQuality: false, mutate: false }); } catch (e) { /* keep */ }
        if (!poly.geometry.coordinates[0] || poly.geometry.coordinates[0].length < 4) continue;
        parts.push({ poly, bb: turf.bbox(poly) });
      }
    }
    // ---- dedupe points
    const seen = new Set(), P = [];
    for (const p of pts) { const k = p[0].toFixed(3) + ',' + p[1].toFixed(3); if (!seen.has(k)) { seen.add(k); P.push(p); } }
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const p of P) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    const vor = turf.voronoi(turf.featureCollection(P.map(p => turf.point([p[0], p[1]]))), { bbox: [x0 - 1, y0 - 1, x1 + 1, y1 + 1] });
    const out = [];
    for (let i = 0; i < vor.features.length; i++) {
      const cell = vor.features[i], p = P[i];
      if (!cell || !cell.geometry) continue;
      const cb = turf.bbox(cell), pieces = [];
      for (const part of parts) {
        const b = part.bb; if (b[0] > cb[2] || b[2] < cb[0] || b[1] > cb[3] || b[3] < cb[1]) continue;
        let clipped = part.poly;
        try { clipped = turf.bboxClip(part.poly, cb); } catch (e) { /* use full */ }
        if (!clipped.geometry.coordinates.length) continue;
        try {
          const inter = turf.intersect(turf.featureCollection([cell, clipped]));
          if (inter) pieces.push(inter.geometry);
        } catch (e) { /* skip degenerate */ }
      }
      if (!pieces.length) continue;
      const polys = pieces.flatMap(g => g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
      out.push({ type: 'Feature', properties: { name: p[3], glottocode: p[4], fam: p[2] }, geometry: polys.length === 1 ? { type: 'Polygon', coordinates: polys[0] } : { type: 'MultiPolygon', coordinates: polys } });
      if (i % 150 === 0) postMessage({ progress: i / vor.features.length });
    }
    postMessage({ done: true, fc: { type: 'FeatureCollection', features: out } });
  } catch (err) { postMessage({ error: String(err && err.message || err) }); }
};
