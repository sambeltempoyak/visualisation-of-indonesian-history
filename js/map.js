// map.js — projection, hex canvases, SVG overlay skeleton, zoom/pan, fly-to, rivers/borders/language dots.
//
// Rendering strategy (kept smooth at 60 fps):
//   • world underlay  : the whole hex world pre-rendered once at base scale into an offscreen canvas;
//                       drawn every frame with the zoom transform (one drawImage).
//   • detail tile     : viewport (+30 % margin) re-rendered crisply at the current scale 150 ms after the
//                       last zoom/pan event, then drawn on top (scaled relative to its own render transform)
//                       while the user keeps moving. The underlay is clipped out beneath it.
//   • SVG overlay     : rivers/borders live in a <g> with the zoom transform (non-scaling strokes);
//                       labels, routes, badges and banners are repositioned in screen space by overlays.js.
import { clamp, debounce, reducedMotion } from './util.js';
import { makeBaseProjection, buildHexWorld, assignLanguages, renderWorldCanvas, renderHex, LANG_GROUPS } from './hex.js';

const SVGNS = 'http://www.w3.org/2000/svg';
export const svgEl = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) n.setAttribute(k, v);
  if (parent) parent.append(n);
  return n;
};

export const HOME_BOX = { lon: [92, 142], lat: [-12, 22] };

export function createMap({ D, state }) {
  const root = document.getElementById('map');
  const hexCv = document.getElementById('hexCanvas'), dotsCv = document.getElementById('dotsCanvas');
  const svg = d3.select('#svg');
  const proj = makeBaseProjection();
  const ctx = hexCv.getContext('2d'), dctx = dotsCv.getContext('2d');

  let w = 1, h = 1, dpr = 1;
  let T = d3.zoomIdentity;
  let insets = { top: 72, right: 0, bottom: 150, left: 0 };
  const listeners = { zoom: [], end: [] };
  const api = { proj, svg, D, root };

  // ---- hex world (built once) ----
  const world = buildHexWorld(D.countries, proj);
  api.world = world;
  let worldCv = null, detail = null, langReady = false;
  const opts = () => ({ lang: !!state.get().layers.languages });

  // ---- SVG skeleton ----
  const defs = svgEl('defs', {}, svg.node());
  const gGeo = svgEl('g', { id: 'g-geo' }, svg.node());
  const gRivers = svgEl('g', { class: 'rivers' }, gGeo), gBorders = svgEl('g', { class: 'borders' }, gGeo);
  api.layers = {
    defs,
    labels: svgEl('g', { id: 'g-labels' }, svg.node()),
    routes: svgEl('g', { id: 'g-routes' }, svg.node()),
    badges: svgEl('g', { id: 'g-badges' }, svg.node()),
    banners: svgEl('g', { id: 'g-banners' }, svg.node())
  };
  const geoPath = d3.geoPath(proj);
  const rivers = topojson.feature(D.rivers, D.rivers.objects.rivers);
  svgEl('path', { d: geoPath(rivers), class: 'river-path', fill: 'none', 'vector-effect': 'non-scaling-stroke' }, gRivers);
  const countries = D.countries.objects.countries;
  svgEl('path', { d: geoPath(topojson.mesh(D.countries, countries, (a, b) => a !== b)), class: 'border-path', fill: 'none', 'vector-effect': 'non-scaling-stroke' }, gBorders);

  // ---- sizing ----
  function resize() {
    const r = root.getBoundingClientRect();
    w = Math.max(200, r.width); h = Math.max(200, r.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    for (const cv of [hexCv, dotsCv]) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); cv.style.width = w + 'px'; cv.style.height = h + 'px'; }
    svg.attr('width', w).attr('height', h);
    zoom.extent([[0, 0], [w, h]]);
    draw(); scheduleDetail(0);
  }

  // ---- drawing ----
  function drawUnderlay() {
    const { k, x, y } = T;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (!worldCv) return;
    let dest = null;
    if (detail) {
      const s = k / detail.T.k;
      if (s > 0.45 && s < 2.4) {
        // detail canvas px (0,0) was screen (-mx,-my) at render time ⇒ it now sits at ((-mx - T0.x)·s + T.x)
        dest = { x: (-detail.mx - detail.T.x) * s + x, y: (-detail.my - detail.T.y) * s + y, w: detail.cw * s, h: detail.ch * s };
      }
    }
    ctx.save();
    if (dest) { ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.rect(dest.x, dest.y, dest.w, dest.h); ctx.clip('evenodd'); }
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(worldCv, world.X0 * k + x, world.Y0 * k + y, world.W * k, world.H * k);
    ctx.restore();
    if (dest) ctx.drawImage(detail.cv, dest.x, dest.y, dest.w, dest.h);
  }

  function drawDots() {
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dctx.clearRect(0, 0, w, h);
    const on = state.get().layers.dots;
    if (!on || T.k < 3 || !api.langPts) return;
    dctx.fillStyle = 'rgba(51,57,59,.72)'; dctx.strokeStyle = 'rgba(246,244,239,.9)'; dctx.lineWidth = 1;
    const rad = T.k > 8 ? 3.4 : 2.6;
    dctx.beginPath();
    for (const p of api.langPts) {
      const sx = p.bx * T.k + T.x, sy = p.by * T.k + T.y;
      if (sx < -5 || sy < -5 || sx > w + 5 || sy > h + 5) continue;
      dctx.moveTo(sx + rad, sy); dctx.arc(sx, sy, rad, 0, 6.2832);
    }
    dctx.fill(); dctx.stroke();
  }

  let rafPending = false;
  function draw() {
    if (rafPending) return; rafPending = true;
    requestAnimationFrame(() => { rafPending = false; drawUnderlay(); drawDots(); });
  }

  function renderDetail() {
    if (!worldCv) return;
    const mx = Math.round(w * 0.3), my = Math.round(h * 0.3), cw = w + 2 * mx, ch = h + 2 * my;
    const cv = document.createElement('canvas'); cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
    const c = cv.getContext('2d'); c.scale(dpr, dpr);
    renderHex(c, world, { k: T.k, x: T.x + mx, y: T.y + my }, { x0: 0, y0: 0, x1: cw, y1: ch }, opts());
    detail = { cv, T: { k: T.k, x: T.x, y: T.y }, mx, my, cw, ch };
    drawUnderlay();
  }
  const scheduleDetail = debounce(renderDetail, 150);

  function rebuildWorld() {
    worldCv = renderWorldCanvas(world, opts(), 1);
    detail = null;
    renderDetail();
  }

  // ---- zoom ----
  const zoom = d3.zoom().scaleExtent([0.35, 14]).clickDistance(4)
    .filter(e => (!e.ctrlKey || e.type === 'wheel') && !e.button)
    .on('zoom', e => {
      T = e.transform;
      gGeo.setAttribute('transform', `translate(${T.x},${T.y}) scale(${T.k})`);
      // rivers appear from k>1.5; borders handled by updateLayers
      gRivers.style.opacity = clamp((T.k - 1.2) / 0.8, 0, 1) * (state.get().layers.rivers ? 1 : 0);
      draw(); scheduleDetail();
      listeners.zoom.forEach(f => f(T, e));
    })
    .on('end', e => { listeners.end.forEach(f => f(T, e)); });
  svg.call(zoom).on('dblclick.zoom', null);

  // ---- helpers exposed to other modules ----
  api.project = (lon, lat) => proj([lon, lat]);
  api.toScreen = (bx, by) => [bx * T.k + T.x, by * T.k + T.y];
  api.transform = () => T;
  api.size = () => ({ w, h });
  api.onZoom = f => listeners.zoom.push(f);
  api.onZoomEnd = f => listeners.end.push(f);
  api.setInsets = i => { insets = { ...insets, ...i }; };
  api.getInsets = () => insets;

  /** Transform that fits base-space points inside the free area (viewport minus insets). */
  api.fitPoints = (pts, { pad = 70, maxK = 8, minK = 0.5 } = {}) => {
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const aw = Math.max(100, w - insets.left - insets.right), ah = Math.max(100, h - insets.top - insets.bottom);
    // fit with pixel padding: solve k so that (extent*k + 2*pad) <= area
    const kx = (aw - 2 * pad) / Math.max(x1 - x0, 1e-6), ky = (ah - 2 * pad) / Math.max(y1 - y0, 1e-6);
    const kk = clamp(Math.min(kx, ky), minK, maxK);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return d3.zoomIdentity.translate(insets.left + aw / 2 - cx * kk, insets.top + ah / 2 - cy * kk).scale(kk);
  };
  api.homeTransform = () => {
    const a = proj([HOME_BOX.lon[0], HOME_BOX.lat[1]]), b = proj([HOME_BOX.lon[1], HOME_BOX.lat[0]]);
    return api.fitPoints([a, b], { pad: 24, maxK: 3, minK: 0.4 });
  };
  api.goto = (t, { duration = 900 } = {}) => {
    const dur = reducedMotion() ? 0 : duration;
    if (dur === 0) svg.call(zoom.transform, t);
    else svg.transition().duration(dur).ease(d3.easeCubicInOut).call(zoom.transform, t);
  };
  api.home = () => api.goto(api.homeTransform(), { duration: 800 });
  api.flyToPoints = (pts, o = {}) => api.goto(api.fitPoints(pts, o), o);
  api.zoomBy = f => svg.transition().duration(300).call(zoom.scaleBy, f);

  // ---- layer visibility driven by state ----
  api.updateLayers = () => {
    const { layers, window: win } = state.get();
    gRivers.style.opacity = clamp((T.k - 1.2) / 0.8, 0, 1) * (layers.rivers ? 1 : 0);
    const bordersOn = layers.borders || (win && win[1] >= 1824);
    gBorders.style.opacity = bordersOn ? 1 : 0;
    drawDots();
  };
  let lastLang = false;
  api.syncLanguages = () => {
    const on = !!state.get().layers.languages;
    if (on === lastLang) return; lastLang = on;
    if (on && !langReady) { assignLanguages(world, D.languages); langReady = true; }
    rebuildWorld();
  };

  // ---- language points (for dots + tooltip) ----
  const L = D.languages;
  if (L.rows.length) {
    const iN = L.cols.indexOf('name'), iG = L.cols.indexOf('glottocode'), iLat = L.cols.indexOf('lat'), iLon = L.cols.indexOf('lon'), iF = L.cols.indexOf('family');
    api.langPts = L.rows.map(r => { const [bx, by] = proj([r[iLon], r[iLat]]); return { name: r[iN], code: r[iG], lat: r[iLat], lon: r[iLon], family: L.families[r[iF]] || '—', bx, by }; });
    const del = d3.Delaunay.from(api.langPts, p => p.bx, p => p.by);
    api.nearestLang = (sx, sy, maxPx = 9) => {
      if (!state.get().layers.dots || T.k < 3) return null;
      const bx = (sx - T.x) / T.k, by = (sy - T.y) / T.k;
      const p = api.langPts[del.find(bx, by)];
      return p && Math.hypot((p.bx - bx) * T.k, (p.by - by) * T.k) <= maxPx ? p : null;
    };
  }
  api.legend = LANG_GROUPS;

  // ---- init ----
  api.init = () => {
    resize();
    const t = api.homeTransform();
    svg.call(zoom.transform, t);
    worldCv = renderWorldCanvas(world, opts(), 1);
    renderDetail();
    window.addEventListener('resize', debounce(() => { resize(); }, 120));
  };
  api.redraw = () => { draw(); scheduleDetail(); };
  return api;
}
