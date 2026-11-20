// hex.js — the procedural hex world.
//
// 1. The land polygons (Natural Earth 50 m) are rasterised ONCE onto an offscreen "mask" canvas in a fixed
//    base projected space (17 px per degree at the equator, Mercator rotated so 130°E is the centre).
// 2. A pointy-top hex grid (radius HEX_R = 6 base px) is laid over that space. A hex is land if its centre or
//    any of its 6 corners samples land on the mask (so Sumba, Banda, Ternate … still appear).
// 3. Each land hex gets a terrain colour from a seeded value-noise (fbm) + inland depth, quantised to a small
//    palette of warm lights; sea hexes within 3 steps of land get a "shallow water" tint.
// 4. renderHex() paints any rectangle of that world at any zoom, batching hexes by colour into Path2D objects.
//    map.js uses it for a whole-world underlay (base scale) and for a crisp viewport tile after each zoom.
import { PAL, hex2rgb, mix, rgb2css, rng, hashStr } from './util.js';

export const HEX_R = 6;
export const BASE_PX_PER_DEG = 17;
const SQ3 = Math.sqrt(3);
const COL_W = SQ3 * HEX_R, ROW_H = 1.5 * HEX_R;

// corner offsets (pointy-top): corner i at angle 30°+60°·i. Edge i joins corner i → i+1 and faces
// neighbour direction [SE, SW, W, NW, NE, E][i].
const CX = [], CY = [];
for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (30 + 60 * i); CX.push(Math.cos(a) * HEX_R); CY.push(Math.sin(a) * HEX_R); }

/** The base projection shared by hexes, rivers, borders, routes, badges. */
export function makeBaseProjection() {
  return d3.geoMercator().rotate([-130, 0]).scale(BASE_PX_PER_DEG * 180 / Math.PI).translate([0, 0]);
}

// ---------- seeded value noise (own implementation) ----------
function makeNoise(seed) {
  const R = rng(seed), perm = new Uint8Array(512), vals = new Float32Array(256);
  for (let i = 0; i < 256; i++) { perm[i] = i; vals[i] = R(); }
  for (let i = 255; i > 0; i--) { const j = (R() * (i + 1)) | 0; [perm[i], perm[j]] = [perm[j], perm[i]]; }
  for (let i = 0; i < 256; i++) perm[256 + i] = perm[i];
  const sm = t => t * t * (3 - 2 * t);
  const v = (x, y) => vals[perm[perm[x & 255] + (y & 255)]];
  const noise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi);
    const a = v(xi, yi), b = v(xi + 1, yi), c = v(xi, yi + 1), d = v(xi + 1, yi + 1);
    return (a + (b - a) * xf) + ((c + (d - c) * xf) - (a + (b - a) * xf)) * yf;
  };
  /** fractal Brownian motion, 4 octaves → ≈ [0,1] */
  return (x, y) => (noise(x, y) * 0.5 + noise(x * 2.03, y * 2.03) * 0.25 + noise(x * 4.1, y * 4.1) * 0.15 + noise(x * 8.3, y * 8.3) * 0.1);
}

// ---------- language families → 8 colour groups ----------
export const LANG_GROUPS = [
  { id: 'aust', name: 'Austronesian', tint: '#B5C7E3' },
  { id: 'ntng', name: 'Nuclear Trans-New Guinea', tint: '#EBCDB4' },
  { id: 'papuan', name: 'Other Papuan families', tint: '#D8AC95' },
  { id: 'ausas', name: 'Austroasiatic', tint: '#C9B8C8' },
  { id: 'tai', name: 'Tai-Kadai', tint: '#BDC9B9' },
  { id: 'sino', name: 'Sino-Tibetan', tint: '#A7B6C9' },
  { id: 'aus', name: 'Australian families', tint: '#E3D0A2' },
  { id: 'other', name: 'Other families & isolates', tint: '#DAD8D4' }
];
const FIXED = { aust1307: 0, nucl1709: 1, aust1305: 3, taik1256: 4, sino1245: 5, pama1250: 6,
  indo1319: 7, japo1237: 7, hmon1336: 7, kore1284: 7, mong1349: 7, turk1311: 7, grea1241: 7 };

/** Map every Glottolog family id to a group index. Unknown families: Australian if centred south of 11.5°S, else Papuan. */
export function familyGroups(lang) {
  const iF = lang.cols.indexOf('family'), iLat = lang.cols.indexOf('lat');
  const lats = {};
  for (const r of lang.rows) (lats[r[iF]] ||= []).push(r[iLat]);
  const g = {};
  for (const fid of Object.keys(lang.families)) {
    if (fid in FIXED) { g[fid] = FIXED[fid]; continue; }
    const a = (lats[fid] || []).sort((x, y) => x - y);
    const med = a.length ? a[a.length >> 1] : 0;
    g[fid] = med < -11.5 ? 6 : 2;
  }
  return g;
}

// ---------- world construction ----------
export function buildHexWorld(countries, proj, seed = 20261120) {
  const topo = countries;
  const land = topojson.feature(topo, topo.objects.countries);
  // grid extent: lon 30°E … 100°W (Madagascar → Easter Island), lat 40°N … 47°S
  const X0 = Math.floor(proj([30, 0])[0]), X1 = Math.ceil(proj([-100, 0])[0]);
  const Y0 = Math.floor(proj([130, 40])[1]), Y1 = Math.ceil(proj([130, -48])[1]);
  const W = X1 - X0, H = Y1 - Y0;

  // 1. mask
  const mc = document.createElement('canvas'); mc.width = W; mc.height = H;
  const mx = mc.getContext('2d', { willReadFrequently: true });
  const shifted = d3.geoMercator().rotate([-130, 0]).scale(proj.scale()).translate([-X0, -Y0]);
  const path = d3.geoPath(shifted, mx);
  mx.fillStyle = '#000'; mx.strokeStyle = '#000'; mx.lineWidth = 1.2; mx.lineJoin = 'round';
  mx.beginPath(); path(land); mx.fill(); mx.stroke();
  const img = mx.getImageData(0, 0, W, H).data;
  const mask = new Uint8Array(W * H);
  for (let i = 0; i < mask.length; i++) mask[i] = img[i * 4 + 3] > 100 ? 1 : 0;
  mc.width = mc.height = 0; // free memory

  // 2. grid + sampling
  const cols = Math.ceil(W / COL_W) + 1, rows = Math.ceil(H / ROW_H) + 1, N = cols * rows;
  const isLand = new Uint8Array(N);
  const sample = (x, y) => { const px = Math.round(x - X0), py = Math.round(y - Y0); return px >= 0 && py >= 0 && px < W && py < H ? mask[py * W + px] : 0; };
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = X0 + COL_W * (c + 0.5 * (r & 1)), y = Y0 + ROW_H * r;
    let l = sample(x, y);
    for (let i = 0; i < 6 && !l; i++) l = sample(x + CX[i] * 0.9, y + CY[i] * 0.9);
    isLand[r * cols + c] = l;
  }

  const world = { X0, Y0, X1, Y1, W, H, cols, rows, N, isLand, proj, seed };
  const nb = (i, e) => neighbour(world, i, e);
  world.nb = nb;

  // 3. distances (BFS): sea cells → steps to land; land cells → steps to sea
  const dist = new Uint8Array(N).fill(255);
  const q = [];
  for (let i = 0; i < N; i++) {
    for (let e = 0; e < 6; e++) { const j = nb(i, e); if (j >= 0 && isLand[j] !== isLand[i]) { dist[i] = 1; q.push(i); break; } }
  }
  for (let h = 0; h < q.length; h++) {
    const i = q[h]; if (dist[i] >= 9) continue;
    for (let e = 0; e < 6; e++) { const j = nb(i, e); if (j >= 0 && dist[j] === 255 && isLand[j] === isLand[i]) { dist[j] = dist[i] + 1; q.push(j); } }
  }
  world.dist = dist;

  // coast edges: bitmask of sea-facing edges for land hexes
  const seaEdges = new Uint8Array(N);
  for (let i = 0; i < N; i++) if (isLand[i]) for (let e = 0; e < 6; e++) { const j = nb(i, e); if (j < 0 || !isLand[j]) seaEdges[i] |= (1 << e); }
  world.seaEdges = seaEdges;

  // 4. terrain colours
  const noise = makeNoise(seed);
  const palette = [], palIdx = new Map();
  const pal = css => { let k = palIdx.get(css); if (k == null) { k = palette.length; palette.push(css); palIdx.set(css, k); } return k; };
  world.palette = palette; world.pal = pal;
  const bands = [PAL.vgvar, PAL.dew, PAL.vapor].map(hex2rgb), rain = hex2rgb(PAL.raindrops);
  const terr = new Uint16Array(N), elev = new Float32Array(N);
  const jit = rng(hashStr('jitter' + seed));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c; if (!isLand[i]) continue;
    const x = X0 + COL_W * (c + 0.5 * (r & 1)), y = Y0 + ROW_H * r;
    const inland = Math.min(dist[i], 8);
    const e = noise(x / 46, y / 46) * 0.85 + inland * 0.028 - 0.06;
    elev[i] = e;
    const band = e < 0.36 ? 0 : e < 0.52 ? 1 : 2;
    let col = bands[band];
    if (e > 0.64) col = mix(col, rain, 0.30); // highlands
    else if (e > 0.58) col = mix(col, rain, 0.14);
    const j = Math.floor(jit() * 5) - 2;      // ±2 steps of 1.2 % lightness jitter
    col = j < 0 ? mix(col, [51, 57, 59], -j * 0.012) : mix(col, [255, 255, 255], j * 0.012);
    terr[i] = pal(rgb2css(col));
  }
  world.terr = terr; world.elev = elev;
  world.lang = null;
  return world;
}

/** neighbour index in direction e (0 SE,1 SW,2 W,3 NW,4 NE,5 E) for odd-r offset grid, or -1 */
function neighbour(w, i, e) {
  const r = (i / w.cols) | 0, c = i - r * w.cols, odd = r & 1;
  let nc = c, nr = r;
  switch (e) {
    case 0: nr = r + 1; nc = c + odd; break;
    case 1: nr = r + 1; nc = c - 1 + odd; break;
    case 2: nc = c - 1; break;
    case 3: nr = r - 1; nc = c - 1 + odd; break;
    case 4: nr = r - 1; nc = c + odd; break;
    case 5: nc = c + 1; break;
  }
  return nc < 0 || nr < 0 || nc >= w.cols || nr >= w.rows ? -1 : nr * w.cols + nc;
}

/** Cultural layer: nearest Glottolog point per land hex (≤ 2.5°) → family group; territory edges. */
export function assignLanguages(world, lang) {
  const iLat = lang.cols.indexOf('lat'), iLon = lang.cols.indexOf('lon'), iF = lang.cols.indexOf('family');
  const groups = familyGroups(lang);
  const pts = lang.rows.map(r => [r[iLon], r[iLat]]);
  const del = d3.Delaunay.from(pts);
  const { N, isLand, cols, X0, Y0, proj } = world;
  const grp = new Int8Array(N).fill(-1);
  let hint = 0;
  for (let i = 0; i < N; i++) {
    if (!isLand[i]) continue;
    const r = (i / cols) | 0, c = i - r * cols;
    const x = X0 + COL_W * (c + 0.5 * (r & 1)), y = Y0 + ROW_H * r;
    const ll = proj.invert([x, y]); if (!ll) continue;
    const k = del.find(ll[0], ll[1], hint); hint = k;
    const dx = (pts[k][0] - ll[0]) * Math.cos(ll[1] * Math.PI / 180), dy = pts[k][1] - ll[1];
    if (Math.hypot(dx, dy) <= 2.5) grp[i] = groups[lang.rows[k][iF]] ?? 7;
  }
  // smooth: a land hex with no language but ≥4 grouped neighbours of one group joins it (closes pin-holes)
  const g2 = grp.slice();
  for (let i = 0; i < N; i++) if (isLand[i] && grp[i] < 0) {
    const cnt = {}; let best = -1, bn = 0;
    for (let e = 0; e < 6; e++) { const j = world.nb(i, e); if (j >= 0 && grp[j] >= 0) { cnt[grp[j]] = (cnt[grp[j]] || 0) + 1; if (cnt[grp[j]] > bn) { bn = cnt[grp[j]]; best = grp[j]; } } }
    if (bn >= 4) g2[i] = best;
  }
  const edges = new Uint8Array(N), fill = new Uint16Array(N);
  for (let i = 0; i < N; i++) if (isLand[i]) {
    for (let e = 0; e < 6; e++) { const j = world.nb(i, e); if (j >= 0 && isLand[j] && g2[j] !== g2[i]) edges[i] |= (1 << e); }
    const t = world.palette[world.terr[i]].match(/\d+/g).map(Number);
    const tint = g2[i] >= 0 ? hex2rgb(LANG_GROUPS[g2[i]].tint) : null;
    fill[i] = world.pal(rgb2css(tint ? mix(tint, t, 0.28) : mix(t, [182, 178, 184], 0.25)));
  }
  world.lang = { grp: g2, edges, fill, groups };
  return world.lang;
}

/**
 * Paint a rectangle of the hex world.
 * ctx   — target context; T = {k,x,y} maps base space → ctx pixels (x' = bx·k + T.x)
 * rect  — {x0,y0,x1,y1} part of ctx to paint (ctx pixel coords)
 * opts  — {lang:boolean}
 */
export function renderHex(ctx, world, T, rect, opts = {}) {
  const { cols, rows, isLand, dist, seaEdges, terr, X0, Y0 } = world;
  const k = T.k, R = HEX_R * k;
  const bx0 = (rect.x0 - T.x) / k, bx1 = (rect.x1 - T.x) / k, by0 = (rect.y0 - T.y) / k, by1 = (rect.y1 - T.y) / k;
  const r0 = Math.max(0, Math.floor((by0 - Y0) / ROW_H) - 1), r1 = Math.min(rows - 1, Math.ceil((by1 - Y0) / ROW_H) + 1);
  const cdx = CX.map(v => v * k), cdy = CY.map(v => v * k);
  const useLang = opts.lang && world.lang;
  const fillIdx = useLang ? world.lang.fill : terr;
  const shallow1 = new Path2D(), shallow2 = new Path2D(), shallow3 = new Path2D(), grid = new Path2D(), edges = new Path2D();
  const coastSoft = new Path2D(), coastLine = new Path2D(), borders = new Path2D(), landEdges = new Path2D();
  const byColour = new Map();
  const showGrid = R >= 2.6;

  for (let r = r0; r <= r1; r++) {
    const py = (Y0 + ROW_H * r) * k + T.y;
    const c0 = Math.max(0, Math.floor((bx0 - X0) / COL_W - 0.5 * (r & 1)) - 1), c1 = Math.min(cols - 1, Math.ceil((bx1 - X0) / COL_W) + 1);
    for (let c = c0; c <= c1; c++) {
      const i = r * cols + c, px = (X0 + COL_W * (c + 0.5 * (r & 1))) * k + T.x;
      if (isLand[i]) {
        let p = byColour.get(fillIdx[i]); if (!p) byColour.set(fillIdx[i], p = new Path2D());
        p.moveTo(px + cdx[0], py + cdy[0]);
        for (let e = 1; e < 6; e++) p.lineTo(px + cdx[e], py + cdy[e]);
        p.closePath();
        if (R >= 2) { // hex edge on land
          edges.moveTo(px + cdx[0], py + cdy[0]);
          for (let e = 1; e < 6; e++) edges.lineTo(px + cdx[e], py + cdy[e]);
          edges.closePath();
        }
        const se = seaEdges[i];
        if (se) for (let e = 0; e < 6; e++) if (se & (1 << e)) {
          const a = e, b = (e + 1) % 6;
          coastSoft.moveTo(px + cdx[a], py + cdy[a]); coastSoft.lineTo(px + cdx[b], py + cdy[b]);
        }
        if (useLang) { const le = world.lang.edges[i]; if (le) for (let e = 0; e < 6; e++) if (le & (1 << e)) {
          borders.moveTo(px + cdx[e], py + cdy[e]); borders.lineTo(px + cdx[(e + 1) % 6], py + cdy[(e + 1) % 6]); } }
      } else {
        const d = dist[i];
        if (d <= 3) {
          const sp = d === 1 ? shallow1 : d === 2 ? shallow2 : shallow3;
          sp.moveTo(px + cdx[0], py + cdy[0]);
          for (let e = 1; e < 6; e++) sp.lineTo(px + cdx[e], py + cdy[e]);
          sp.closePath();
        }
        if (showGrid) { // each shared edge once: E (5), SE (0), SW (1)
          grid.moveTo(px + cdx[5], py + cdy[5]); grid.lineTo(px + cdx[0], py + cdy[0]); grid.lineTo(px + cdx[1], py + cdy[1]); grid.lineTo(px + cdx[2], py + cdy[2]);
        }
      }
    }
  }
  ctx.save();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (showGrid) { ctx.strokeStyle = 'rgba(204,214,230,0.055)'; ctx.lineWidth = 1; ctx.stroke(grid); }
  ctx.fillStyle = 'rgba(204,214,230,0.20)'; ctx.fill(shallow1);
  ctx.fillStyle = 'rgba(204,214,230,0.115)'; ctx.fill(shallow2);
  ctx.fillStyle = 'rgba(204,214,230,0.05)'; ctx.fill(shallow3);
  for (const [idx, p] of byColour) { ctx.fillStyle = world.palette[idx]; ctx.fill(p); }
  if (R >= 2) { ctx.strokeStyle = 'rgba(51,57,59,0.10)'; ctx.lineWidth = 1; ctx.stroke(edges); }
  // coast glow: soft wide stroke + crisp thin pale-blue shoreline
  ctx.strokeStyle = 'rgba(204,214,230,0.28)'; ctx.lineWidth = Math.max(2.5, R * 0.55); ctx.stroke(coastSoft);
  ctx.strokeStyle = 'rgba(204,214,230,0.95)'; ctx.lineWidth = Math.max(1, R * 0.16); ctx.stroke(coastSoft);
  if (useLang) {
    ctx.strokeStyle = 'rgba(51,57,59,0.62)'; ctx.lineWidth = Math.max(1.4, 1.1 + R * 0.1); ctx.stroke(borders);
  }
  ctx.restore();
}

/** Render the whole world at base scale into a new canvas (the cheap underlay used while panning/zooming). */
export function renderWorldCanvas(world, opts, scale = 1) {
  const cv = document.createElement('canvas');
  cv.width = Math.ceil(world.W * scale); cv.height = Math.ceil(world.H * scale);
  const ctx = cv.getContext('2d');
  renderHex(ctx, world, { k: scale, x: -world.X0 * scale, y: -world.Y0 * scale }, { x0: 0, y0: 0, x1: cv.width, y1: cv.height }, opts);
  return cv;
}
