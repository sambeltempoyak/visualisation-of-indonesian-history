// adminlayers.js — v3 catalogue layers for Analyse: BIG administrative boundaries (kab/kota, kecamatan, desa per province on
// demand) and the approximate ethnic-group areas. All are registered "builtin" with an `ensure()` so NOTHING is fetched
// until the layer is switched on.
import { el, esc } from './util.js';
import { methodWords, precisionWords, tint } from './peoples/words.js';

const BIG = 'Badan Informasi Geospasial (generalised)';
const getJSON = async url => { const r = await fetch(url); if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`); return r.json(); };
const topoFC = t => topojson.feature(t, t.objects[Object.keys(t.objects)[0]]);

export function createAdminLayers({ D, map, reg, tip, ctx }) {
  const lmap = map.map, out = {};
  const outline = (w, o) => () => map.basemap()?.dark ? { color: '#CCD6E6', weight: w, opacity: o + .1, fill: true, fillOpacity: 0 } : { color: '#49546D', weight: w, opacity: o, fill: true, fillOpacity: 0 };
  const kabStyle = outline(1.2, .8), kecStyle = outline(.7, .6), desaStyle = outline(.5, .55);
  const dl = (rows) => el('dl', { class: 'pop-dl' }, ...rows.filter(r => r[1]).flatMap(([k, v]) => [el('dt', {}, k), el('dd', {}, String(v))]));
  const hover = (l, name, style) => {
    l.on('mouseover', e => { l.setStyle({ fillOpacity: .16, fillColor: '#CCD6E6', weight: (l.options.weight || 1) + .8 }); tip.show(`<b>${esc(name)}</b>`, e.originalEvent); });
    l.on('mousemove', e => tip.move(e.originalEvent));
    l.on('mouseout', () => { l.setStyle({ ...style(), fillOpacity: 0 }); tip.hide(); });
  };
  class ZoomGate extends L.Layer {
    constructor(inner, minZoom) { super(); this.inner = inner; this.minZoom = minZoom; }
    onAdd(m) { this._map = m; m.on('zoomend', this._u, this); this._u(); }
    onRemove(m) { m.off('zoomend', this._u, this); m.removeLayer(this.inner); }
    _u() { const on = this._map.getZoom() >= this.minZoom, has = this._map.hasLayer(this.inner); if (on && !has) this._map.addLayer(this.inner); else if (!on && has) this._map.removeLayer(this.inner); }
    getBounds() { return this.inner.getBounds?.(); }
  }
  const restyleOnBasemap = (getLayer, style) => map.onBasemap(() => getLayer()?.eachLayer?.(l => l.setStyle?.({ ...style(), fillOpacity: 0 })));

  // ---------------------------------------------------------------- kabupaten / kota (524)
  let kabLayer = null;
  const dKab = reg.register({
    id: 'admin-kab', name: 'Kabupaten / kota (BIG, 524)', group: 'Administrative boundaries (BIG)', geom: 'polygon', pane: 'p-admin-kab',
    swatch: { type: 'line', color: '#49546D' }, info: { source: 'BIG Batas Wilayah Administrasi, kabupaten/kota (RBI geoservices), generalised', attribution: BIG, source_id: 'big-batas-wilayah', url: 'https://geoservices.big.go.id/', note: '524 regencies and cities (0.7 MB, loaded when switched on).' },
    fc: () => dKab.data || null,
    ensure: async d => {
      d.data = topoFC(await getJSON('data/admin/kabkota.topo.json')); d.count = d.data.features.length;
      const renderer = L.canvas({ pane: d.pane, padding: .3 });
      kabLayer = L.geoJSON(d.data, { pane: d.pane, renderer, style: () => kabStyle(), onEachFeature: (f, l) => {
        hover(l, f.properties.kab, kabStyle);
        l.bindPopup(() => el('div', { class: 'vp-pop' }, el('h4', {}, f.properties.kab), dl([['Province', f.properties.prov], ['Source', BIG]])), { className: 'vih-popup' });
      } });
      return kabLayer;
    }
  });
  restyleOnBasemap(() => kabLayer, kabStyle);

  // ---------------------------------------------------------------- kecamatan (7,423), zoom >= 7
  let kecLayer = null;
  const dKec = reg.register({
    id: 'admin-kec', name: 'Kecamatan (BIG, 7,423)', group: 'Administrative boundaries (BIG)', geom: 'polygon', pane: 'p-admin-kec',
    swatch: { type: 'line', color: '#6F7B9A' }, info: { source: 'BIG Batas Wilayah Administrasi, kecamatan (RBI geoservices), generalised', attribution: BIG, source_id: 'big-batas-wilayah', url: 'https://geoservices.big.go.id/', note: '7,423 districts (2.3 MB, loaded when switched on); drawn from zoom 7.' },
    fc: () => dKec.data || null,
    ensure: async d => {
      if (lmap.getZoom() < 7) ctx.toast?.('Kecamatan lines are drawn from zoom 7 — zoom in.');
      d.data = topoFC(await getJSON('data/admin/kecamatan.topo.json')); d.count = d.data.features.length;
      const renderer = L.canvas({ pane: d.pane, padding: .2 });
      kecLayer = L.geoJSON(d.data, { pane: d.pane, renderer, style: () => kecStyle(), onEachFeature: (f, l) => {
        hover(l, f.properties.kec, kecStyle);
        l.bindPopup(() => el('div', { class: 'vp-pop' }, el('h4', {}, 'Kec. ' + f.properties.kec), dl([['Kabupaten / kota', f.properties.kab], ['Province', f.properties.prov], ['Source', BIG]])), { className: 'vih-popup' });
      } });
      return new ZoomGate(kecLayer, 7);
    }
  });
  restyleOnBasemap(() => kecLayer, kecStyle);

  // ---------------------------------------------------------------- desa / kelurahan: provinces in view, LRU of 4, zoom >= 9
  const MAXP = 4, MINZ = 9;
  class DesaLayer extends L.Layer {
    constructor(pane, index) { super(); this.pane = pane; this.index = index; this.loaded = new Map(); this.renderer = L.canvas({ pane, padding: .25 }); this.want = []; this.gen = 0; }
    onAdd(m) { this._map = m; this._t = null; this._h = () => { clearTimeout(this._t); this._t = setTimeout(() => this.update(), 220); }; m.on('moveend zoomend', this._h); this.update(); }
    onRemove(m) { m.off('moveend zoomend', this._h); clearTimeout(this._t); this.gen++; this.loaded.forEach(p => p.layer && m.removeLayer(p.layer)); this.loaded.clear(); this.want = []; }
    count() { let n = 0; this.loaded.forEach(p => { n += p.n; }); return n; }
    features() { const f = []; this.loaded.forEach(p => p.fc && f.push(...p.fc.features)); return { type: 'FeatureCollection', features: f }; }
    async update() {
      const m = this._map; if (!m) return;
      const gen = ++this.gen;
      if (m.getZoom() < MINZ) { this.loaded.forEach(p => p.layer && m.hasLayer(p.layer) && m.removeLayer(p.layer)); this.want = []; this.status?.(`Zoom in to ${MINZ} or more to load desa borders (one province at a time).`); return; }
      const b = m.getBounds(), c = b.getCenter();
      const hit = this.index.filter(p => !(p.bbox[0] > b.getEast() || p.bbox[2] < b.getWest() || p.bbox[1] > b.getNorth() || p.bbox[3] < b.getSouth()))
        .map(p => ({ p, d: Math.hypot((p.bbox[0] + p.bbox[2]) / 2 - c.lng, (p.bbox[1] + p.bbox[3]) / 2 - c.lat) })).sort((a, b) => a.d - b.d).slice(0, MAXP).map(x => x.p);
      this.want = hit.map(p => p.slug);
      const now = performance.now();
      for (const p of hit) {
        let e = this.loaded.get(p.slug);
        if (!e) { e = { layer: null, fc: null, n: 0, t: now }; this.loaded.set(p.slug, e); this.status?.(`Loading desa of ${p.prov}…`);
          try { e.fc = topoFC(await getJSON(p.file)); } catch (err) { this.loaded.delete(p.slug); ctx.toast?.(`Could not load desa of ${p.prov}: ${err.message}`); continue; }
          if (gen !== this.gen && !this._map) return;
          e.n = e.fc.features.length;
          e.layer = L.geoJSON(e.fc, { pane: this.pane, renderer: this.renderer, style: () => desaStyle(), onEachFeature: (f, l) => {
            hover(l, f.properties.desa, desaStyle);
            l.bindPopup(() => el('div', { class: 'vp-pop' }, el('h4', {}, f.properties.desa), dl([['Kecamatan', f.properties.kec], ['Kabupaten / kota', f.properties.kab], ['Province', p.prov], ['Kode', f.properties.kode], ['Source', BIG]])), { className: 'vih-popup' });
          } });
        }
        e.t = now;
      }
      // evict least-recently-used beyond MAXP (never one that is wanted)
      [...this.loaded.entries()].filter(([k]) => !this.want.includes(k)).sort((a, b) => a[1].t - b[1].t).forEach(([k, e]) => { if (this.loaded.size > MAXP || !this.want.length) { e.layer && m.removeLayer(e.layer); this.loaded.delete(k); } });
      this.loaded.forEach((e, k) => { if (!e.layer) return; const on = this.want.includes(k); if (on && !m.hasLayer(e.layer)) m.addLayer(e.layer); else if (!on && m.hasLayer(e.layer)) m.removeLayer(e.layer); });
      dDesa.count = this.count(); reg.changed(dDesa);
      this.status?.(hit.length ? `${this.count().toLocaleString()} desa in memory (${hit.map(p => p.prov).join(', ')})` : 'No province in view.');
    }
  }
  let desaLayer = null;
  const dDesa = reg.register({
    id: 'admin-desa', name: 'Desa / kelurahan (BIG, 84,503)', group: 'Administrative boundaries (BIG)', geom: 'polygon', pane: 'p-admin-desa',
    swatch: { type: 'line', color: '#8C93A8' }, info: { source: 'BIG Batas Wilayah Administrasi, desa/kelurahan (RBI geoservices), generalised ~200 m', attribution: BIG, source_id: 'big-batas-wilayah', url: 'https://geoservices.big.go.id/', note: 'Loaded province by province when you are zoomed in to 9 or more (at most 4 provinces in memory); 38 files of 0.07–2 MB.' },
    fc: () => desaLayer?.features() || null,
    ensure: async d => {
      const index = await getJSON('data/admin/desa/index.json');
      if (lmap.getZoom() < MINZ) ctx.toast?.('Desa borders load from zoom 9 — zoom in; they come province by province.');
      desaLayer = new DesaLayer(d.pane, index); return desaLayer;
    }
  });
  map.onBasemap(() => desaLayer?.loaded.forEach(p => p.layer?.setStyle({ ...desaStyle(), fillOpacity: 0 })));

  // ---------------------------------------------------------------- ethnic areas (394 groups, approximate)
  let eaLayer = null;
  const dEA = reg.register({
    id: 'ethnic-areas', name: 'Ethnic group areas (approximate)', group: 'Ethnicity & language', geom: 'polygon', pane: 'p-ethnic-areas', opacity: .75,
    swatch: { type: 'area', color: '#B2ABB4' }, info: { source: 'Derived: every desa assigned to the nearest documented ethnic-group location on its island group', attribution: 'Ananta et al. 2014; Glottolog 5.4; ' + BIG, source_id: 'ananta2014', note: 'Approximate homeland zones, not a census map. 1.1 MB, loaded when switched on. See the Peoples page for the full method.' },
    fc: () => dEA.data || null,
    ensure: async d => {
      const [topo, meta] = await Promise.all([getJSON('data/peoples/ethnic-areas.topo.json'), getJSON('data/peoples/ethnic-areas.meta.json')]);
      d.data = topoFC(topo); d.meta = meta; d.count = d.data.features.length;
      d.data.features.forEach(f => { const m = meta.areas[f.properties.g] || {}; Object.assign(f.properties, { name: m.name, island: m.island, precision: m.precision, method: m.method, place: m.place }); });
      const renderer = L.canvas({ pane: d.pane, padding: .3 });
      const st = f => ({ fillColor: tint(f.properties.island, f.properties.g), fillOpacity: .62, color: '#49546D', weight: .5, opacity: .8 });
      eaLayer = L.geoJSON(d.data, { pane: d.pane, renderer, style: st, onEachFeature: (f, l) => {
        const m = meta.areas[f.properties.g] || {};
        l.on('mouseover', e => { l.setStyle({ weight: 2, fillOpacity: .85 }); tip.show(`<b>${esc(m.name || f.properties.g)}</b><br><span>${esc(m.island || '')}</span>`, e.originalEvent); });
        l.on('mousemove', e => tip.move(e.originalEvent)); l.on('mouseout', () => { eaLayer.resetStyle(l); tip.hide(); });
        l.bindPopup(() => el('div', { class: 'vp-pop' }, el('h4', {}, m.name || f.properties.g),
          dl([['Island', m.island], ['Homeland', m.place], ['Precision', precisionWords(m.precision)], ['Method', methodWords(m.method)], ['Aliases', (m.aliases || []).join(', ')], ['Note', m.note]]),
          m.glottocode ? el('a', { href: `https://glottolog.org/resource/languoid/id/${m.glottocode}`, target: '_blank', rel: 'noopener' }, 'Glottolog ↗') : null,
          el('p', { class: 'muted' }, 'Approximate area — see the Peoples page for how these were made.')), { className: 'vih-popup', maxWidth: 340 });
      } });
      return eaLayer;
    }
  });
  return out;
}
