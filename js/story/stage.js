// story/stage.js — the map: camera flights, areas that fade/pulse, animated flows, place markers. Holds the layers of
// the CURRENT slide only; everything else is removed so memory stays flat across a 20-slide story.
import { setBasemap, BIG_ATTR } from '../core/basemaps.js';
import { loadPack } from '../core/geo.js';
import { AREAS, installPatterns, placeIcon } from '../core/symbols.js';
import { reducedMotion, esc } from '../core/util.js';
import { Flow } from './flows.js';

const FLY = 1.6;

/** Visual centre of a polygon (coarse pole of inaccessibility on the largest outer ring). */
function labelPoint(features) {
  let best = null, bestA = -1;
  for (const f of features) {
    const g = f.geometry; if (!g) continue;
    const polys = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
    for (const poly of polys) {
      const ring = poly[0]; let a = 0;
      for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
      a = Math.abs(a / 2); if (a > bestA) { bestA = a; best = ring; }
    }
  }
  if (!best) return null;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  best.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
  const inside = (x, y) => { let c = false; for (let i = 0, j = best.length - 1; i < best.length; j = i++) { const [xi, yi] = best[i], [xj, yj] = best[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const step = Math.max(1, Math.floor(best.length / 220)); let bp = [(x0 + x1) / 2, (y0 + y1) / 2], bd = -1;
  const N = 18;
  for (let i = 1; i < N; i++) for (let j = 1; j < N; j++) {
    const x = x0 + (x1 - x0) * i / N, y = y0 + (y1 - y0) * j / N; if (!inside(x, y)) continue;
    let d = 1e9; for (let k = 0; k < best.length; k += step) d = Math.min(d, (best[k][0] - x) ** 2 + (best[k][1] - y) ** 2);
    if (d > bd) { bd = d; bp = [x, y]; }
  }
  return [bp[1], bp[0]];
}

export class Stage {
  constructor(el) {
    this.el = el; this.token = 0; this.packs = new Map(); this.timers = []; this.dark = false;
    this.cur = { areas: [], flows: [], places: [], labels: [] };
    this.attrBig = false;
    const map = this.map = L.map(el, { zoomControl: false, attributionControl: true, keyboard: false, zoomSnap: .25, zoomDelta: .5, wheelPxPerZoomLevel: 90, worldCopyJump: false, minZoom: 3, maxZoom: 14 });
    map.attributionControl.setPrefix(false);
    const ac = map.attributionControl.getContainer(); ac.addEventListener('click', () => ac.classList.toggle('open')); // phone: collapsed to an (i)
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    map.createPane('vstory').style.zIndex = 420;
    this.renderer = L.svg({ pane: 'vstory', padding: .5 });
    map.addLayer(this.renderer);
    installPatterns();
    this.landUnderlay();
    map.on('zoomend', () => this.cur.flows.forEach(f => f.orient()));
    map.on('moveend zoomend', () => this.declutter());
    document.addEventListener('visibilitychange', () => el.classList.toggle('vs-paused', document.hidden));
  }
  setBasemap(id) {
    this.base = setBasemap(this.map, id, this.base); this.dark = this.base.dark; this.baseId = id;
    this.paintLand();
    return this.dark;
  }
  // A light vector land layer (BIG provinces, generalised) always sits under the tiles: it is the map when tiles are
  // blocked or offline, and it keeps islands legible while tiles stream in.
  async landUnderlay() {
    const pane = this.map.createPane('vland'); pane.style.zIndex = 140; pane.style.pointerEvents = 'none';
    const r = L.canvas({ pane: 'vland', padding: .3 });
    try {
      const [prov, sumba] = await Promise.all([loadPack('indonesia-prov'), loadPack('sumba-island')]);
      const feats = prov.fc.features.filter(f => !/Nusa Tenggara Timur/.test(f.properties?.prov || '')).concat(prov.fc.features.filter(f => /Nusa Tenggara Timur/.test(f.properties?.prov || '')));
      this.land = L.geoJSON({ type: 'FeatureCollection', features: [...feats, ...sumba.fc.features] }, { renderer: r, interactive: false, smoothFactor: .8 }).addTo(this.map);
      this.paintLand();
    } catch (e) { console.warn('[story] land underlay', e.message); }
  }
  paintLand() {
    const dark = this.dark;
    this.el.style.background = dark ? '#262B2D' : '#CCD6E6';
    this.land?.setStyle({ fillColor: dark ? '#3D4659' : '#EEDED1', fillOpacity: 1, color: dark ? '#5A6684' : '#B2ABB4', weight: .7 });
  }
  // Hide labels that collide: place names win over area names, area names over flow labels.
  declutter() {
    const root = this.map.getContainer(), kept = [...document.querySelectorAll('.vs-card, .vs-rib, .vs-year, .vs-top, .vs-tools')].filter(e => !e.hidden && e.offsetWidth).map(e => e.getBoundingClientRect());
    const groups = [['.vp-lab', 3], ['.vs-al', 2], ['.vf-label', 1]];
    const all = groups.flatMap(([sel, pr]) => [...root.querySelectorAll(sel)].map(e => ({ e, pr })));
    all.forEach(x => { x.e.style.visibility = ''; });
    all.map(x => ({ ...x, r: x.e.getBoundingClientRect() })).filter(x => x.r.width).sort((a, b) => b.pr - a.pr)
      .forEach(x => { const hit = kept.some(k => !(x.r.right < k.left - 4 || x.r.left > k.right + 4 || x.r.bottom < k.top - 2 || x.r.top > k.bottom + 2)); if (hit) x.e.style.visibility = 'hidden'; else kept.push(x.r); });
  }
  async ensurePacks(names) {
    await Promise.all([...new Set(names)].filter(n => !this.packs.has(n)).map(async n => {
      try { this.packs.set(n, await loadPack(n)); } catch (e) { console.warn('[story] geometry pack failed', n, e.message); this.packs.set(n, null); }
    }));
    if (names.length && !this.attrBig && [...this.packs.values()].some(Boolean)) { this.map.attributionControl.addAttribution(BIG_ATTR); this.attrBig = true; }
  }
  wait(ms, fn) { const t = setTimeout(fn, ms); this.timers.push(t); return t; }

  // ---- clearing ----
  clearLayers({ areas = true } = {}) {
    this.timers.forEach(clearTimeout); this.timers = [];
    const c = this.cur;
    c.flows.forEach(f => f.remove()); c.places.forEach(m => this.map.removeLayer(m)); c.labels.forEach(m => this.map.removeLayer(m));
    c.flows = []; c.places = []; c.labels = [];
    if (areas) {
      const old = c.areas; c.areas = [];
      old.forEach(a => {
        const els = a.els; els.forEach(e => { e.classList.remove('vs-pulse'); e.style.transition = 'opacity .4s ease'; e.style.opacity = 0; });
        a.label && (a.label.getElement().style.opacity = 0);
        setTimeout(() => { this.map.removeLayer(a.layer); a.label && this.map.removeLayer(a.label); }, reducedMotion() ? 0 : 450);
      });
    }
  }
  clear() { this.token++; this.clearLayers(); }

  // ---- camera ----
  /** Visible-rect padding [top,right,bottom,left] supplied by the UI (card, ribbon). */
  targetView(slide, pad, region) {
    const m = this.map, [t, r, b, l] = pad;
    let bounds = null;
    if (region) bounds = L.latLngBounds(region);
    else if (!slide.camera) {
      const bs = [];
      slide.places.forEach(p => bs.push(L.latLngBounds([[p.lat, p.lon], [p.lat, p.lon]])));
      slide.flows.forEach(f => f.path.forEach(([x, y]) => bs.push(L.latLngBounds([[y, x], [y, x]]))));
      slide.areas.forEach(a => { const pk = this.packs.get(a.pack), fs = pk?.byKey.get(a.key); if (fs) bs.push(L.geoJSON({ type: 'FeatureCollection', features: fs }).getBounds()); });
      if (bs.length) { bounds = bs[0]; bs.slice(1).forEach(x => bounds.extend(x)); }
    }
    const size = m.getSize(), w = Math.max(80, size.x - l - r), h = Math.max(80, size.y - t - b);
    let center, zoom;
    if (bounds) {
      if (bounds.getNorth() === bounds.getSouth() && bounds.getEast() === bounds.getWest()) bounds = bounds.pad(.0005);
      const z0 = m.getBoundsZoom(bounds, false, L.point(size.x - w, size.y - h).add([24, 24]));
      zoom = Math.min(z0, region ? 12 : 10.5); center = bounds.getCenter();
    } else if (slide.camera) { center = L.latLng(slide.camera[0], slide.camera[1]); zoom = slide.camera[2]; }
    else return null;
    // shift so the target sits in the middle of the FREE part of the screen
    const P = m.project(center, zoom), d = L.point((l - r) / 2, (t - b) / 2);
    return { center: m.unproject(P.subtract(d), zoom), zoom };
  }
  fly(view, instant) {
    const m = this.map; if (!view) return Promise.resolve();
    return new Promise(res => {
      let done = false; const fin = () => { if (done) return; done = true; m.off('moveend', fin); res(); };
      if (instant || reducedMotion() || !m._loaded) { m.setView(view.center, view.zoom, { animate: false }); setTimeout(fin, 30); return; }
      m.on('moveend', fin); this.wait(FLY * 1000 + 500, fin);
      m.flyTo(view.center, view.zoom, { duration: FLY, easeLinearity: .25 });
    });
  }

  // ---- slides ----
  async showTitle(story, pad, instant) {
    const tok = ++this.token; this.clearLayers();
    const v = this.targetView({ places: [], flows: [], areas: [] }, pad, story.region);
    await this.fly(v, instant); return tok === this.token;
  }
  async showSlide(slide, pad, { instant = false, still = false } = {}) {
    const tok = ++this.token, keepAreas = still; // `still`: re-render in place (basemap switched) – no camera move
    this.clearLayers(); this.cur.areas.length = 0;
    await this.ensurePacks(slide.areas.map(a => a.pack));
    if (tok !== this.token) return;
    if (!still) { await this.fly(this.targetView(slide, pad), instant); if (tok !== this.token) return; }
    const quick = instant || still || reducedMotion();
    this.stageAreas(slide, quick);
    this.wait(quick ? 0 : 450, () => this.stageFlows(slide, quick));
    this.wait(quick ? 0 : 800, () => this.stagePlaces(slide));
  }
  stageAreas(slide, quick) {
    const dark = this.dark, fresh = [];
    slide.areas.forEach(a => {
      const role = AREAS[a.role] ? a.role : 'focus', st = AREAS[role], pk = this.packs.get(a.pack), fs = pk?.byKey.get(a.key);
      if (!fs) { console.warn(`[story] area not found: ${a.pack}:${a.key}`); return; }
      const stroke = dark ? st.strokeDark : st.stroke, fill = dark ? (st.fillDark || st.fill) : st.fill, isPat = String(fill).startsWith('url(');
      const layer = L.geoJSON({ type: 'FeatureCollection', features: fs }, { renderer: this.renderer, interactive: false, style: { color: stroke, weight: st.weight, opacity: 1, fillColor: isPat ? '#000' : fill, fillOpacity: st.opacity, dashArray: st.dash || null, lineJoin: 'round', className: 'vs-area vs-' + role } }).addTo(this.map);
      const els = []; layer.eachLayer(l => { const e = l.getElement(); if (!e) return; if (isPat) e.setAttribute('fill', fill); e.style.setProperty('--fo', st.opacity); els.push(e); });
      const lp = labelPoint(fs), text = a.label || a.key;
      const label = lp && L.marker(lp, { icon: L.divIcon({ className: 'vs-arealab', iconSize: [0, 0], html: `<span class="vs-al vs-al-${role}">${esc(text)}</span>` }), interactive: false, keyboard: false, zIndexOffset: -500 }).addTo(this.map);
      if (label) label.getElement().style.opacity = 0;
      els.forEach(e => { e.style.opacity = 0; });
      this.cur.areas.push({ layer, els, label });
      fresh.push({ els, label, role });
    });
    // sit under the flows: areas were added first, flows come later in the same renderer
    requestAnimationFrame(() => requestAnimationFrame(() => fresh.forEach(({ els, label, role }) => {
      els.forEach(e => { e.style.transition = quick ? 'none' : 'opacity .6s ease'; e.style.opacity = 1; if (role === 'focus' && !quick) setTimeout(() => e.classList.add('vs-pulse'), 650); });
      if (label) { const le = label.getElement(); le.style.transition = quick ? 'none' : 'opacity .6s ease .2s'; le.style.opacity = 1; }
    })));
  }
  stageFlows(slide, quick) {
    slide.flows.forEach((f, i) => this.cur.flows.push(new Flow(this.map, this.renderer, f, { dark: this.dark, delay: quick ? 0 : i * 250 })));
  }
  stagePlaces(slide) {
    slide.places.forEach((p, i) => {
      const m = L.marker([p.lat, p.lon], { icon: placeIcon(p, { dark: this.dark, delay: i * 120 }), keyboard: true, title: p.name, riseOnHover: true, zIndexOffset: 500 + i }).addTo(this.map);
      if (p.note) {
        m.bindTooltip(esc(p.note), { direction: 'top', offset: [0, -22], className: 'vs-tip', opacity: 1 });
        m.bindPopup(`<b>${esc(p.name)}</b><br>${esc(p.note)}`, { className: 'vs-pop', offset: [0, -14], closeButton: true });
      }
      this.cur.places.push(m);
    });
    this.wait(700, () => this.declutter());
  }
}
