// overlays.js — everything drawn in SVG above the hex canvas: place labels, route arrows (animated),
// hexagonal event badges, and "city banner" people pills. Positions are recomputed in screen space on every
// zoom frame so glyphs/labels keep a comfortable size; time/theme/selection state toggles visibility.
import { clamp, formatRange, formatYear, hex2rgb, mix, rgb2css, PAL, textGlyph, reducedMotion, hashStr } from './util.js';
import { svgEl } from './map.js';

// ---------- place labels (hard-coded) ----------
// kind: sea | land ; k:[min,max] zoom range ; s: base font-size ; r: rotation (deg)
const LABELS = [
  ['Indian Ocean', 78, -13, 'sea', [0.35, 2.2], 24], ['Pacific Ocean', 160, 6, 'sea', [0.35, 2.2], 24],
  ['South China Sea', 112, 13.5, 'sea', [0.35, 5], 17], ['Bay of Bengal', 88, 14, 'sea', [0.35, 5], 16],
  ['Java Sea', 111.5, -5.1, 'sea', [0.9, 7], 14], ['Andaman Sea', 95.5, 11.5, 'sea', [0.9, 7], 13],
  ['Banda Sea', 127.5, -5.7, 'sea', [0.9, 7], 14], ['Sulu Sea', 120, 8.8, 'sea', [0.9, 7], 13],
  ['Celebes Sea', 122.3, 3.5, 'sea', [0.9, 7], 13], ['Arafura Sea', 135.5, -9.4, 'sea', [0.9, 7], 14],
  ['Philippine Sea', 131, 17, 'sea', [0.9, 5], 14], ['Timor Sea', 127.5, -11.6, 'sea', [1.2, 7], 12],
  ['Strait of Malacca', 100.2, 3.4, 'sea', [1.1, 9], 12, 38], ['Makassar Strait', 118.2, -1.2, 'sea', [1.5, 9], 11, -62],
  ['Gulf of Thailand', 101.5, 9.3, 'sea', [1.5, 9], 11], ['Flores Sea', 120, -7.3, 'sea', [2, 9], 11],
  ['Sumatra', 101.5, -0.3, 'land', [0.6, 9], 16, -38], ['Java', 110.6, -7.45, 'land', [0.6, 9], 15], ['Borneo', 114.2, 0.4, 'land', [0.6, 9], 17],
  ['Sulawesi', 121.2, -2.2, 'land', [0.8, 9], 14], ['New Guinea', 138.5, -5.2, 'land', [0.5, 9], 17],
  ['Luzon', 121, 16.6, 'land', [0.8, 9], 13], ['Mindanao', 125.2, 7.9, 'land', [1, 9], 13],
  ['Malay Peninsula', 101.7, 4.6, 'land', [1.2, 9], 12, -78], ['Taiwan', 121, 23.6, 'land', [1, 9], 12],
  ['Mainland Southeast Asia', 103, 17.4, 'land', [0.35, 2.6], 17], ['Australia', 134, -24.5, 'land', [0.35, 3], 20],
  ['Madagascar', 46.8, -19, 'land', [0.35, 5], 15],
  ['Sumba', 119.9, -9.7, 'land', [2.6, 12], 11], ['Flores', 121.4, -8.55, 'land', [2.2, 12], 11], ['Timor', 125.2, -9.2, 'land', [2, 12], 12, -22],
  ['Bali', 115.15, -8.35, 'land', [3, 12], 10], ['Maluku', 128.3, -3.3, 'land', [1.4, 7], 12], ['Halmahera', 128, 0.9, 'land', [2, 12], 11]
];

// route colours (palette A; slave = muted rose derived from Dew, darkened)
export const ROUTE_COLOURS = {
  migration: '#CCD6E6', trade: '#EEDED1', religion: '#F6F4EF', pilgrimage: '#F6F4EF', colonial: '#B2ABB4',
  slave: '#C4968F', labour: '#EEDED1', resource: '#DFDDD7', state: '#CCD6E6'
};
const DASHED = new Set(['religion', 'pilgrimage', 'state']);

export function createOverlays({ D, map, state, tip, onSelect }) {
  const L = map.layers, defs = L.defs;
  const SVG = (t, a, p) => svgEl(t, a, p);
  const hexPts = r => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 180 * (30 + 60 * i); return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`; }).join(' ');
  const T = () => map.transform();

  // ----- gradients / markers -----
  D.themes.forEach(t => {
    const g = SVG('linearGradient', { id: 'gt-' + t.id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    SVG('stop', { offset: '0%', 'stop-color': rgb2css(mix(t.color, '#FFFFFF', 0.45)) }, g);
    SVG('stop', { offset: '100%', 'stop-color': t.color }, g);
  });
  const bg = SVG('linearGradient', { id: 'g-banner', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
  SVG('stop', { offset: '0%', 'stop-color': PAL.forest }, bg); SVG('stop', { offset: '100%', 'stop-color': PAL.indigo }, bg);

  // =====================================================  LABELS
  const labelEls = LABELS.map(([t, lon, lat, kind, kr, size, rot = 0]) => {
    const [bx, by] = map.project(lon, lat);
    const g = SVG('text', { class: 'map-label ' + kind, 'text-anchor': 'middle' }, L.labels);
    g.textContent = t;
    return { g, bx, by, kind, kr, size, rot, t };
  });
  function layoutLabels() {
    const { k, x, y } = T(), on = state.get().layers.labels;
    const sc = clamp(0.78 + 0.26 * Math.log2(k), 0.78, 2.1);
    for (const l of labelEls) {
      const vis = on && k >= l.kr[0] && k <= l.kr[1];
      l.g.style.opacity = vis ? (l.kind === 'sea' ? 0.8 : 0.78) : 0;
      if (!vis) continue;
      const fs = l.size * (l.size >= 20 ? clamp(sc, 0.8, 1.5) : sc);
      l.g.setAttribute('transform', `translate(${(l.bx * k + x).toFixed(1)},${(l.by * k + y).toFixed(1)}) rotate(${l.rot})`);
      l.g.setAttribute('font-size', fs.toFixed(1));
      l.g.setAttribute('letter-spacing', (l.kind === 'sea' ? 0.28 : 0.14) + 'em');
    }
  }

  // =====================================================  ROUTES
  const routeLine = d3.line().curve(d3.curveCatmullRom.alpha(0.5));
  const routes = D.routes.map(r => {
    const col = ROUTE_COLOURS[r.kind] || '#CCD6E6', w = clamp(r.width || 2, 1, 4);
    const g = SVG('g', { class: 'route', 'data-id': r.id }, L.routes);
    const under = SVG('path', { class: 'r-under', fill: 'none', stroke: PAL.forest, 'stroke-width': w + 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const main = SVG('path', { class: 'r-main', fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const flow = SVG('path', { class: 'r-flow', fill: 'none', stroke: '#F6F4EF', 'stroke-width': Math.max(1, w * 0.45), 'stroke-linecap': 'round', opacity: 0 }, g);
    const headU = SVG('polygon', { class: 'r-head-u', fill: PAL.forest, stroke: PAL.forest, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    const head = SVG('polygon', { class: 'r-head', fill: col }, g);
    const parts = [];
    const hit = SVG('path', { class: 'r-hit', fill: 'none', stroke: 'transparent', 'stroke-width': 16 }, g);
    const pb = r.path.map(([lon, lat]) => map.project(lon, lat));
    const rt = { r, g, under, main, flow, head, headU, hit, pb, col, w, parts, vis: false, p: 0, t0: 0, len: 1, dirty: true, fade: false, faded: false };
    hit.addEventListener('pointerenter', e => tip.show(`<b>${r.title}</b><br><span>${formatRange(r.start, r.r?.end ?? r.end)} · ${r.kind}</span>`, e));
    hit.addEventListener('pointermove', e => tip.move(e));
    hit.addEventListener('pointerleave', () => tip.hide());
    hit.addEventListener('click', e => { e.stopPropagation(); tip.hide(); onSelect('route', r.id); });
    hit.setAttribute('tabindex', '-1');
    return rt;
  });
  const routeById = new Map(routes.map(r => [r.r.id, r]));

  function updateRoutePath(rt) {
    const { k, x, y } = T();
    const pts = rt.pb.map(p => [p[0] * k + x, p[1] * k + y]);
    const d = routeLine(pts);
    rt.under.setAttribute('d', d); rt.main.setAttribute('d', d); rt.flow.setAttribute('d', d); rt.hit.setAttribute('d', d);
    rt.len = rt.main.getTotalLength() || 1;
    const L1 = rt.len, p1 = rt.main.getPointAtLength(L1), p0 = rt.main.getPointAtLength(Math.max(0, L1 - 12));
    const ang = Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI, hs = 8 + rt.w * 2.2;
    const poly = `0,0 ${-hs},${-hs * 0.55} ${-hs * 0.72},0 ${-hs},${hs * 0.55}`;
    for (const h of [rt.head, rt.headU]) { h.setAttribute('points', poly); h.setAttribute('transform', `translate(${p1.x.toFixed(1)},${p1.y.toFixed(1)}) rotate(${ang.toFixed(1)})`); }
    // particles: 1–3 depending on length
    const n = reducedMotion() ? 0 : clamp(Math.round(L1 / 260), 1, 3);
    while (rt.parts.length < n) {
      const halo = SVG('circle', { r: 6, fill: rt.col, opacity: 0.28 }, rt.g), dot = SVG('circle', { r: 2.4, fill: '#F6F4EF' }, rt.g);
      rt.parts.push({ halo, dot, ph: rt.parts.length / n });
    }
    rt.dirty = false;
  }
  function applyDraw(rt) {
    // progress p∈[0,1]: stroke-dash reveal; afterwards the normal (possibly dashed) pattern
    const done = rt.p >= 1;
    const dash = done ? (DASHED.has(rt.r.kind) ? '9 7' : 'none') : `${rt.len} ${rt.len}`;
    for (const p of [rt.under, rt.main]) {
      p.setAttribute('stroke-dasharray', dash);
      p.setAttribute('stroke-dashoffset', done ? 0 : rt.len * (1 - rt.p));
    }
    const hv = rt.p > 0.97 ? 1 : 0;
    rt.head.style.opacity = hv; rt.headU.style.opacity = hv * 0.85;
  }

  // =====================================================  BADGES (events)
  const badges = D.events.map(e => {
    const th = D.themeById.get(e.theme), col = th?.color || PAL.water;
    const g = SVG('g', { class: 'badge', 'data-id': e.id, tabindex: 0, role: 'button', 'aria-label': `${e.title}, ${formatRange(e.start, e.end)}` }, L.badges);
    const leader = SVG('g', { class: 'leader' }, g);
    const lline = SVG('line', { x1: 0, y1: 0, x2: 0, y2: 0 }, leader), ldot = SVG('circle', { r: 2.4, cx: 0, cy: 0 }, leader);
    const inn = SVG('g', { class: 'badge-in' }, g);
    SVG('polygon', { class: 'pulse', points: hexPts(17), fill: 'none' }, inn);
    SVG('polygon', { class: 'b-shadow', points: hexPts(18.2), fill: PAL.forest }, inn);
    SVG('polygon', { class: 'b-face', points: hexPts(15.2), fill: `url(#gt-${e.theme})`, stroke: '#F6F4EF', 'stroke-width': 1.1 }, inn);
    const t = SVG('text', { class: 'b-glyph', 'text-anchor': 'middle', 'dominant-baseline': 'central', y: 0.5 }, inn);
    t.textContent = textGlyph(th?.glyph);
    const [bx, by] = map.project(e.lon, e.lat);
    const b = { e, g, inn, lline, ldot, bx, by, ox: 0, oy: 0, vis: false, th };
    g.addEventListener('pointerenter', ev => tip.show(`<b>${e.title}</b><br><span>${formatRange(e.start, e.end)} · ${e.place || ''}</span>`, ev));
    g.addEventListener('pointermove', ev => tip.move(ev));
    g.addEventListener('pointerleave', () => tip.hide());
    g.addEventListener('click', ev => { ev.stopPropagation(); tip.hide(); onSelect('event', e.id); });
    g.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onSelect('event', e.id); } });
    return b;
  });
  const badgeById = new Map(badges.map(b => [b.e.id, b]));

  // =====================================================  BANNERS (peoples)
  const mctx = document.createElement('canvas').getContext('2d');
  const banners = D.peoples.map(p => {
    const g = SVG('g', { class: 'banner', 'data-id': p.id, tabindex: 0, role: 'button', 'aria-label': `${p.name}, people` }, L.banners);
    const inn = SVG('g', { class: 'banner-in' }, g);
    mctx.font = '500 12px Inter, system-ui, sans-serif';
    const tw = mctx.measureText(p.name).width, w = Math.ceil(tw + 30), h = 22, y0 = -9 - h;
    SVG('path', { class: 'pin', d: 'M0,0 L-3.2,-9.5 L3.2,-9.5 Z' }, inn);
    SVG('circle', { class: 'pin-dot', r: 2.6, cx: 0, cy: 0 }, inn);
    SVG('rect', { class: 'pill', x: -w / 2, y: y0, width: w, height: h, rx: h / 2, fill: 'url(#g-banner)' }, inn);
    SVG('polygon', { class: 'pill-hex', points: hexPts(3.6), transform: `translate(${-w / 2 + 11},${y0 + h / 2})` }, inn);
    const t = SVG('text', { class: 'pill-text', x: 6, y: y0 + h / 2, 'dominant-baseline': 'central', 'text-anchor': 'middle' }, inn);
    t.textContent = p.name; t.setAttribute('x', (-w / 2 + 11 + 8 + tw / 2).toFixed(1));
    const [bx, by] = map.project(p.lon, p.lat);
    const b = { p, g, bx, by, w, h, shown: true, vis: true };
    g.addEventListener('click', ev => { ev.stopPropagation(); onSelect('people', p.id); });
    g.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onSelect('people', p.id); } });
    g.addEventListener('pointerenter', ev => tip.show(`<b>${p.name}</b><br><span>${p.family || ''}</span>`, ev));
    g.addEventListener('pointermove', ev => tip.move(ev));
    g.addEventListener('pointerleave', () => tip.hide());
    return b;
  });
  const bannerById = new Map(banners.map(b => [b.p.id, b]));

  // =====================================================  per-frame layout
  const bscale = k => clamp(0.74 + 0.17 * Math.log2(k), 0.74, 1.45);
  function layoutZoom() {
    const { k, x, y } = T();
    layoutLabels();
    const s = bscale(k);
    for (const b of badges) {
      if (!b.vis && !b.g.classList.contains('vis')) continue;
      b.g.style.transform = `translate(${(b.bx * k + x + b.ox).toFixed(1)}px,${(b.by * k + y + b.oy).toFixed(1)}px) scale(${s.toFixed(3)})`;
      if (b.ox || b.oy) { const ix = -b.ox / s, iy = -b.oy / s; b.lline.setAttribute('x2', ix); b.lline.setAttribute('y2', iy); b.ldot.setAttribute('cx', ix); b.ldot.setAttribute('cy', iy); }
    }
    const bs = clamp(0.78 + 0.1 * Math.log2(k), 0.78, 1.15);
    for (const b of banners) b.g.style.transform = `translate(${(b.bx * k + x).toFixed(1)}px,${(b.by * k + y).toFixed(1)}px) scale(${bs.toFixed(3)})`;
    for (const rt of routes) if (rt.vis) { updateRoutePath(rt); applyDraw(rt); } else rt.dirty = true;
  }

  // collision nudging for badges (deterministic spiral), culling for banners — run on zoom end / state change
  function settle() {
    const { k, x, y } = T();
    const s = bscale(k), minD = 34 * s;
    const placed = [];
    const vis = badges.filter(b => b.vis).sort((a, b) => a.e._i - b.e._i);
    const ring = [[0, 0]];
    for (const [rad, n] of [[36, 6], [66, 12], [96, 18]]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + 0.3; ring.push([Math.cos(a) * rad * s, Math.sin(a) * rad * s]); }
    for (const b of vis) {
      const sx = b.bx * k + x, sy = b.by * k + y;
      let best = ring[0];
      for (const o of ring) {
        const px = sx + o[0], py = sy + o[1];
        if (placed.every(q => Math.hypot(q[0] - px, q[1] - py) >= minD)) { best = o; break; }
      }
      b.ox = best[0]; b.oy = best[1];
      placed.push([sx + b.ox, sy + b.oy]);
      b.g.classList.toggle('nudged', !!(b.ox || b.oy));
    }
    for (const b of badges) if (!b.vis) { b.ox = b.oy = 0; }
    // banners: greedy by importance; < 0.7 zoom keeps only first 12
    const st = state.get();
    const rects = [];
    const wBox = map.size();
    for (const b of banners) {
      let show = st.layers.peoples;
      const sx = b.bx * k + x, sy = b.by * k + y, bsx = clamp(0.78 + 0.1 * Math.log2(k), 0.78, 1.15);
      if (show && k < 0.7 && b.p._rank >= 12) show = false;
      if (show && (sx < -80 || sy < -40 || sx > wBox.w + 80 || sy > wBox.h + 60)) show = true; // off-screen: irrelevant
      if (show) {
        const r = { x0: sx - b.w * bsx / 2, x1: sx + b.w * bsx / 2, y0: sy - (9 + b.h) * bsx, y1: sy + 2 };
        const important = st.selection && ((st.selection.type === 'people' && st.selection.id === b.p.id) || b.hl);
        if (!important && rects.some(q => r.x0 < q.x1 + 4 && r.x1 > q.x0 - 4 && r.y0 < q.y1 + 2 && r.y1 > q.y0 - 2)) show = false;
        else rects.push(r);
      }
      b.shown = show; b.g.classList.toggle('vis', show);
    }
    layoutZoom();
  }

  // =====================================================  state → visibility
  const timeVisible = (a, b, st) => st.cumulative ? a <= st.window[1] : (a <= st.window[1] && b >= st.window[0]);
  const eventVisible = (e, st) => {
    if (st.selection?.type === 'event' && st.selection.id === e.id) return true;
    return st.themesOn.has(e.theme) && timeVisible(e.start, e.end ?? e.start, st);
  };
  let now = performance.now();
  function applyState() {
    const st = state.get();
    for (const b of badges) {
      const v = eventVisible(b.e, st);
      if (v !== b.vis) { b.vis = v; b.g.classList.toggle('vis', v); if (v) b.g.style.display = ''; }
    }
    now = performance.now();
    for (const rt of routes) {
      const ev = rt.r.event && D.eventById.get(rt.r.event);
      let v = st.layers.routes && timeVisible(rt.r.start, rt.r.end ?? rt.r.start, st) && (!ev || st.themesOn.has(ev.theme));
      if ((st.selection?.type === 'route' && st.selection.id === rt.r.id) || st.selection?.route === rt.r.id) v = true;
      if (st.selection?.type === 'event' && (D.routesOfEvent.get(st.selection.id) || []).includes(rt.r)) v = st.layers.routes || v;
      if (v && !rt.vis) { rt.vis = true; rt.p = reducedMotion() ? 1 : 0; rt.t0 = now; rt.g.classList.add('vis'); updateRoutePath(rt); applyDraw(rt); }
      else if (!v && rt.vis) { rt.vis = false; rt.g.classList.remove('vis'); rt.p = 0; }
      rt.faded = v && st.cumulative && rt.r.end < st.window[1] && rt.r.end != null && (rt.r.end < st.window[1]);
      rt.g.classList.toggle('faded', !!rt.faded);
    }
    // selection highlighting
    const sel = st.selection;
    const evSel = sel?.type === 'event' ? D.eventById.get(sel.id) : null;
    const selRoutes = new Set(evSel ? (D.routesOfEvent.get(evSel.id) || []).map(r => r.id) : sel?.type === 'route' ? [sel.id] : []);
    if (sel?.route) selRoutes.add(sel.route);
    const selPeoples = new Set(evSel ? (evSel.peoples || []) : sel?.type === 'people' ? [sel.id] : []);
    const selEvents = new Set(sel?.type === 'event' ? [sel.id] : sel?.type === 'people' ? (D.eventsOfPeople.get(sel.id) || []).map(e => e.id) : []);
    for (const rt of routes) { rt.g.classList.toggle('sel', selRoutes.has(rt.r.id)); rt.g.classList.toggle('hl-one', !!sel?.route && sel.route === rt.r.id); rt.g.classList.toggle('dim', !!sel && sel.type !== 'people' && !selRoutes.has(rt.r.id)); }
    for (const b of badges) { b.g.classList.toggle('sel', sel?.type === 'event' && sel.id === b.e.id); b.g.classList.toggle('hl', selEvents.has(b.e.id) && !(sel?.type === 'event')); }
    for (const b of banners) { b.hl = selPeoples.has(b.p.id); b.g.classList.toggle('sel', b.hl); }
    map.updateLayers();
    settle();
  }

  // =====================================================  animation loop (draw-on, flow, particles)
  let last = performance.now();
  function frame(t) {
    requestAnimationFrame(frame);
    const rm = reducedMotion();
    let any = false;
    for (const rt of routes) {
      if (!rt.vis) continue;
      if (rt.dirty) { updateRoutePath(rt); applyDraw(rt); }
      if (rt.p < 1) {
        any = true;
        const u = clamp((t - rt.t0) / 1600, 0, 1);
        rt.p = rm ? 1 : 1 - Math.pow(1 - u, 3);       // easeOutCubic
        if (u >= 1) rt.p = 1;
        applyDraw(rt);
        if (rt.p >= 1) rt.flowReady = true;
      }
      if (rt.p >= 1 && !rm && !rt.faded) {
        const off = -(t / 1000) * 22;
        rt.flow.setAttribute('stroke-dasharray', '1.5 15'); rt.flow.setAttribute('stroke-dashoffset', off.toFixed(1)); rt.flow.setAttribute('opacity', 0.55);
        const speed = 55;
        rt.parts.forEach(pt => {
          const d = (((t / 1000) * speed + pt.ph * rt.len) % rt.len);
          const p = rt.main.getPointAtLength(d);
          pt.dot.setAttribute('cx', p.x.toFixed(1)); pt.dot.setAttribute('cy', p.y.toFixed(1));
          pt.halo.setAttribute('cx', p.x.toFixed(1)); pt.halo.setAttribute('cy', p.y.toFixed(1));
          pt.dot.style.display = pt.halo.style.display = '';
        });
      } else if (rt.p >= 1) { rt.flow.setAttribute('opacity', 0); rt.parts.forEach(pt => { pt.dot.style.display = pt.halo.style.display = 'none'; }); }
      else { rt.flow.setAttribute('opacity', 0); rt.parts.forEach(pt => { pt.dot.style.display = pt.halo.style.display = 'none'; }); }
    }
    last = t;
  }
  requestAnimationFrame(frame);

  // ----- wire up -----
  let zooming = false, zt;
  map.onZoom(() => {
    if (!zooming) { zooming = true; L.badges.classList.add('moving'); L.banners.classList.add('moving'); }
    clearTimeout(zt); zt = setTimeout(() => { zooming = false; L.badges.classList.remove('moving'); L.banners.classList.remove('moving'); settle(); }, 140);
    layoutZoom();
  });
  state.on((s, prev) => {
    if (s.window !== prev.window || s.cumulative !== prev.cumulative || s.themesOn !== prev.themesOn || s.layers !== prev.layers || s.selection !== prev.selection) applyState();
  });
  applyState();

  return {
    applyState, settle, layoutZoom,
    badge: id => badgeById.get(id), route: id => routeById.get(id), banner: id => bannerById.get(id),
    /** base-space points to frame an event: its location + its routes' paths */
    eventPoints(e) {
      const pts = [map.project(e.lon, e.lat)];
      (D.routesOfEvent.get(e.id) || []).forEach(r => r.path.forEach(([lo, la]) => pts.push(map.project(lo, la))));
      return pts;
    },
    routePoints: id => routeById.get(id)?.pb || []
  };
}
