// routes.js — animated route arrows on Leaflet's SVG renderer.
// Each route = halo + coloured line + flowing white dashes (CSS animation) + travelling particles + arrowhead marker.
// Curves are Catmull-Rom splines computed in lon/lat (longitudes are never normalised, so Pacific routes up to
// lon 260 draw continuously). The draw-in animation re-slices the polyline each frame so it survives zooming.
import { clamp, formatRange, PAL, mixHex, reducedMotion } from './util.js';

// Colours are "ink" tones derived from palette A so lines read on the light palette basemap AND on dusk/satellite
// (every line carries a light VG Var halo). Dashed kinds are also distinguished by pattern.
export const ROUTE_COLOURS = {
  migration: '#49546D', trade: '#6E4540', religion: '#33393B', pilgrimage: '#33393B', colonial: '#5B6264',
  slave: '#9A4A42', labour: '#6B5F52', resource: '#51445A', state: '#49546D', flow: '#49546D'
};
export const ROUTE_DASH = { religion: '10 7', pilgrimage: '2 7', state: '10 7' };

/** Centripetal Catmull-Rom through [[lon,lat],…] → [[lat,lon],…] (dense). */
export function smoothPath(path, seg = 14) {
  const P = path.map(([x, y]) => [x, y]);
  if (P.length < 3) {
    const out = []; const n = P.length === 2 ? 24 : 1;
    for (let i = 0; i <= n; i++) { const t = i / n; out.push([P[0][1] + (P[P.length - 1][1] - P[0][1]) * t, P[0][0] + (P[P.length - 1][0] - P[0][0]) * t]); }
    return out;
  }
  const ext = [[2 * P[0][0] - P[1][0], 2 * P[0][1] - P[1][1]], ...P, [2 * P[P.length - 1][0] * 1 - P[P.length - 2][0], 2 * P[P.length - 1][1] - P[P.length - 2][1]]];
  const out = [];
  const tj = (ti, a, b) => ti + Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1]), 0.5) || ti + 1e-6;
  for (let i = 1; i < ext.length - 2; i++) {
    const p0 = ext[i - 1], p1 = ext[i], p2 = ext[i + 1], p3 = ext[i + 2];
    const t0 = 0, t1 = tj(t0, p0, p1), t2 = tj(t1, p1, p2), t3 = tj(t2, p2, p3);
    for (let s = 0; s < seg; s++) {
      const t = t1 + (t2 - t1) * s / seg;
      const f = (a, b, ta, tb) => [(tb - t) / (tb - ta) * a[0] + (t - ta) / (tb - ta) * b[0], (tb - t) / (tb - ta) * a[1] + (t - ta) / (tb - ta) * b[1]];
      const A1 = f(p0, p1, t0, t1), A2 = f(p1, p2, t1, t2), A3 = f(p2, p3, t2, t3);
      const B1 = f(A1, A2, t0, t2), B2 = f(A2, A3, t1, t3);
      const C = f(B1, B2, t1, t2);
      out.push([C[1], C[0]]);
    }
  }
  out.push([P[P.length - 1][1], P[P.length - 1][0]]);
  return out;
}

/** Quadratic arc between two points (for flow maps), bulging sideways by `bulge` × distance. */
export function arcPath(a, b, bulge = 0.18) {
  const [x0, y0] = a, [x1, y1] = b, mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0;
  return [[x0, y0], [mx - dy * bulge, my + dx * bulge], [x1, y1]];
}

const cumul = pts => { const c = [0]; for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], (pts[i][1] - pts[i - 1][1]) * Math.cos(pts[i][0] * Math.PI / 180))); return c; };
const slice = (pts, cum, frac) => {
  const target = cum[cum.length - 1] * frac;
  let lo = 0, hi = cum.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; cum[m] <= target ? lo = m : hi = m; }
  const out = pts.slice(0, lo + 1); const seglen = cum[hi] - cum[lo] || 1, t = (target - cum[lo]) / seglen;
  if (t > 0 && hi < pts.length) out.push([pts[lo][0] + (pts[hi][0] - pts[lo][0]) * t, pts[lo][1] + (pts[hi][1] - pts[lo][1]) * t]);
  return out;
};
const pointAt = (pts, cum, d) => {
  const total = cum[cum.length - 1]; d = ((d % total) + total) % total;
  let lo = 0, hi = cum.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; cum[m] <= d ? lo = m : hi = m; }
  const t = (d - cum[lo]) / ((cum[hi] - cum[lo]) || 1); return [pts[lo][0] + (pts[hi][0] - pts[lo][0]) * t, pts[lo][1] + (pts[hi][1] - pts[lo][1]) * t];
};

/**
 * A set of animated routes living in one Leaflet pane. Used by the historical routes layer and by flow maps.
 * routeSet.add(spec) → route handle with show()/hide()/restyle().
 * spec: { id, path:[[lon,lat],…], kind, color?, width?, title, sub, smooth?:bool, onClick, onHover }
 */
export function createRouteSet({ map, pane, tip }) {
  const L_ = L;
  const group = L_.layerGroup();
  const routes = [];
  let raf = 0;

  function add(spec) {
    const col = spec.color || ROUTE_COLOURS[spec.kind] || '#49546D', w = clamp(spec.width ?? 2, 0.8, 12);
    const pts = spec.smooth === false ? spec.path.map(([x, y]) => [y, x]) : smoothPath(spec.path);
    const cum = cumul(pts), total = cum[cum.length - 1] || 1;
    const dash = spec.dash ?? ROUTE_DASH[spec.kind] ?? null;
    const base = { pane, lineCap: 'round', lineJoin: 'round', interactive: false, smoothFactor: 0.5 };
    const halo = L_.polyline([], { ...base, color: '#F6F4EF', weight: w + 3.8, opacity: 0.82, className: 'r-halo' });
    const main = L_.polyline([], { ...base, color: col, weight: w, opacity: 1, className: 'r-main' });
    const flow = L_.polyline(pts, { ...base, color: '#F6F4EF', weight: Math.max(1, w * 0.42), opacity: 0, dashArray: '1.5 15', className: 'r-flow' });
    const hit = L_.polyline(pts, { ...base, color: '#000', weight: Math.max(16, w + 10), opacity: 0, interactive: true, className: 'r-hit' });
    const hs = 7 + w * 2.1;
    const arrow = L_.marker(pts[pts.length - 1], { pane, interactive: false, keyboard: false, icon: L_.divIcon({ className: 'r-arrow', iconSize: [0, 0], html: `<svg class="r-arrow-svg" width="${hs * 2}" height="${hs * 2}" viewBox="${-hs} ${-hs} ${hs * 2} ${hs * 2}"><polygon points="${hs * 0.55},0 ${-hs * 0.5},${-hs * 0.62} ${-hs * 0.22},0 ${-hs * 0.5},${hs * 0.62}" fill="${col}" stroke="#F6F4EF" stroke-width="2.4" stroke-linejoin="round" paint-order="stroke"/></svg>` }) });
    const nPart = reducedMotion() ? 0 : clamp(Math.round(total / 14), 1, 3);
    const parts = Array.from({ length: nPart }, (_, i) => ({ ph: i / nPart, c: L_.circleMarker(pts[0], { pane, radius: 2.7, color: '#33393B', weight: 0.8, fillColor: '#F6F4EF', fillOpacity: 1, interactive: false, opacity: 0.9 }) }));
    const r = { spec, pts, cum, total, col, w, dash, halo, main, flow, hit, arrow, parts, vis: false, p: 1, t0: 0, done: true, faded: false, layers: [halo, main, flow, arrow, ...parts.map(p => p.c), hit] };

    hit.on('mouseover mousemove', e => { if (tip && spec.title) tip.show(`<b>${spec.title}</b><br><span>${spec.sub || ''}</span>`, e.originalEvent); });
    hit.on('mouseout', () => tip?.hide());
    hit.on('click', e => { L_.DomEvent.stopPropagation(e); tip?.hide(); spec.onClick?.(spec); });
    routes.push(r);
    return {
      r,
      show({ animate = true } = {}) {
        if (r.vis) return; r.vis = true;
        r.layers.forEach(l => group.addLayer(l));
        r.p = animate && !reducedMotion() ? 0 : 1; r.t0 = performance.now(); r.done = r.p >= 1;
        paint(r); kick();
      },
      hide() { if (!r.vis) return; r.vis = false; r.layers.forEach(l => group.removeLayer(l)); },
      isVisible: () => r.vis,
      setFaded(f) { if (r.faded === f) return; r.faded = f; r.layers.forEach(l => l._path && l._path.classList.toggle('faded', f)); flowStyle(r); },
      setClass(cls, on) { r.layers.forEach(l => { l._path?.classList.toggle(cls, on); }); r.arrow.getElement()?.classList.toggle(cls, on); },
      remove() { r.vis = false; r.layers.forEach(l => group.removeLayer(l)); const i = routes.indexOf(r); if (i >= 0) routes.splice(i, 1); },
      bounds: () => L_.latLngBounds(pts)
    };
  }

  function flowStyle(r) {
    const on = r.p >= 1 && !r.faded && !reducedMotion();
    r.flow.setStyle({ opacity: on ? 0.6 : 0 });
    r.flow._path?.classList.toggle('flowing', on);
    r.parts.forEach(p => { p.c.setStyle({ opacity: on ? 0.9 : 0, fillOpacity: on ? 1 : 0 }); });
  }
  function paint(r) {
    const full = r.p >= 1;
    const seq = full ? r.pts : slice(r.pts, r.cum, Math.max(r.p, 0.0001));
    r.halo.setLatLngs(seq); r.main.setLatLngs(seq);
    if (full) r.main.setStyle({ dashArray: r.dash }); else r.main.setStyle({ dashArray: null });
    flowStyle(r); orient(r);
  }
  function orient(r) {
    const el = r.arrow.getElement(); if (!el) return;
    const n = r.pts.length, a = map.latLngToLayerPoint(r.pts[Math.max(0, n - 4)]), b = map.latLngToLayerPoint(r.pts[n - 1]);
    const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    const svg = el.firstChild; if (svg) svg.style.transform = `translate(-50%,-50%) rotate(${ang.toFixed(1)}deg)`;
    el.style.opacity = r.p > 0.97 ? 1 : 0;
  }
  const reorient = () => routes.forEach(r => { if (r.vis) orient(r); });
  map.on('zoomend', reorient);
  group.on('add', () => { reorient(); kick(); });

  function frame(t) {
    raf = 0; let active = false;
    const rm = reducedMotion();
    for (const r of routes) {
      if (!r.vis) continue;
      if (r.p < 1) {
        active = true; const u = clamp((t - r.t0) / 1700, 0, 1);
        r.p = 1 - Math.pow(1 - u, 3); if (u >= 1) r.p = 1; paint(r);
        if (r.p >= 1) { r.done = true; orient(r); }
      } else if (!rm && !r.faded && r.parts.length) {
        active = true;
        const dist = (t / 1000) * 7 * Math.max(0.5, Math.min(1.6, r.total / 25));
        r.parts.forEach(p => { const pt = pointAt(r.pts, r.cum, dist + p.ph * r.total); p.c.setLatLng(pt); });
      }
    }
    if (active && group._map) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && group._map) raf = requestAnimationFrame(frame); }
  return { group, add, routes, kick };
}

export const routeSub = r => `${formatRange(r.start, r.end ?? r.start)} · ${r.kind}`;
