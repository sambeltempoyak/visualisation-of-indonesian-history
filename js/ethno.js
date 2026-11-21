// ethno.js — "Ethnicity & language" layers: the 633 ethnic groups (Ananta et al. 2014), Kartapranata's map image and
// suku labels, Glottolog language points and the derived "Language areas" (Voronoi, clipped to land, in a Web Worker).
import { el, esc, unwrapLon, clamp } from './util.js';

// Categorical "ink" tones derived from palette A (mixed toward its darks so they hold ≥3:1 on Dew and on Ancient Water).
export const ISLAND_COLOURS = {
  'Sumatra': '#49546D', 'Jawa-Bali': '#9A4A42', 'Nusa Tenggara': '#8A6A22', 'Kalimantan': '#4A6B48', 'Sulawesi': '#2F6A6E', 'Maluku': '#6B4A68', 'Papua': '#A0532A', 'Foreign/Other': '#5B6264'
};
export const PRECISION_COLOURS = { point: '#33393B', district: '#49546D', province: '#6F7B9A', island: '#A39BA6' };
const PRECISION_LABEL = { point: 'Point (a place)', district: 'District (kabupaten)', province: 'Province', island: 'Island centroid', none: 'Not mapped' };
const FAMILY_INK = ['#49546D', '#9A4A42', '#8A6A22', '#4A6B48', '#2F6A6E', '#6B4A68', '#A0532A', '#33393B', '#6E4540'];
const OTHER_INK = '#8A8590';

class Gated extends L.Layer {
  constructor(inner, minZoom) { super(); this.inner = inner; this.minZoom = minZoom; }
  onAdd(map) { this._map = map; map.on('zoomend', this._u, this); this._u(); }
  onRemove(map) { map.off('zoomend', this._u, this); map.removeLayer(this.inner); }
  _u() { const on = this._map.getZoom() >= this.minZoom, has = this._map.hasLayer(this.inner); if (on && !has) this._map.addLayer(this.inner); else if (!on && has) this._map.removeLayer(this.inner); }
  getBounds() { return this.inner.getBounds?.(); }
}

export function createEthno({ D, map, reg, tip, ctx }) {
  const lmap = map.map;
  const out = { markers: new Map() };

  // =====================================================  633 ETHNIC GROUPS (data/ethnic-groups.json is fetched on first use)
  const srcId0 = 'ananta2014';
  let colourBy = 'island', drawn = [], group = null;
  const colour = g => colourBy === 'island' ? (ISLAND_COLOURS[g.island] || ISLAND_COLOURS['Foreign/Other']) : (PRECISION_COLOURS[g.precision] || '#8A8590');
  const restyleEthnic = () => group?.eachLayer(m => m.setStyle({ fillColor: colour(m.options._g) }));
  const buildEthnic = d => {
    const E = D.ethnic; if (!E?.groups?.length) throw new Error('The ethnic-group data could not be loaded.');
    const groups = E.groups, srcId = E.meta?.source_id || srcId0;
    drawn = groups.filter(g => g.precision !== 'none' && Number.isFinite(g.lat) && Number.isFinite(g.lon));
    // identical coordinates (province / island centroids) are fanned out on a small spiral so every group stays clickable
    const keyOf = g => g.lat.toFixed(2) + ',' + g.lon.toFixed(2), buckets = new Map();
    drawn.forEach(g => { const k = keyOf(g); (buckets.get(k) || buckets.set(k, []).get(k)).push(g); });
    const place = new Map();
    buckets.forEach(list => list.forEach((g, i) => {
      if (list.length === 1) return place.set(g.id, [g.lat, unwrapLon(g.lon)]);
      const a = i * 2.399963, r = 0.045 * Math.sqrt(i + 0.5) * (g.precision === 'point' ? 0.6 : 1);
      place.set(g.id, [g.lat + Math.sin(a) * r, unwrapLon(g.lon) + Math.cos(a) * r * 1.1]);
    }));
    const renderer = L.canvas({ pane: 'p-ethnic-groups', padding: 0.4, tolerance: 4 });
    const style = g => ({ renderer, pane: 'p-ethnic-groups', radius: g.precision === 'island' ? 6.5 : g.precision === 'province' ? 6 : 5.2, color: '#F6F4EF', weight: 1.3, fillColor: colour(g), fillOpacity: ({ point: 1, district: 0.88, province: 0.7, island: 0.55 })[g.precision] ?? 0.8, opacity: 0.95 });
    group = L.featureGroup();
    const popup = g => {
      const links = [];
      if (g.glottocode) links.push(el('a', { href: `https://glottolog.org/resource/languoid/id/${g.glottocode}`, target: '_blank', rel: 'noopener' }, `Glottolog ${g.glottocode} ↗`));
      if (g.wm_label) links.push(el('a', { href: D.suku?.meta?.url || 'https://commons.wikimedia.org/', target: '_blank', rel: 'noopener' }, `Kartapranata label “${g.wm_label}” ↗`));
      const row = (k, v) => v ? [el('dt', {}, k), el('dd', {}, v)] : [];
      return el('div', { class: 'vp-pop' },
        el('h4', {}, g.name),
        el('div', { class: 'pop-badges' }, el('span', { class: 'tag' }, 'Precision: ' + (PRECISION_LABEL[g.precision] || g.precision)), el('span', { class: 'tag' }, 'Method: ' + (g.method || '—')), g.island ? el('span', { class: 'tag' }, g.island) : null, g.appendix ? el('span', { class: 'tag' }, 'Appendix ' + g.appendix) : null),
        el('dl', { class: 'pop-dl' }, ...row('Place', g.place), ...row('Codes', (g.codes || []).map(c => `${c.code} ${c.label}`).join('; ')), ...row('Aliases', (g.aliases || []).join(', ')), ...row('Note', g.note)),
        links.length ? el('div', { class: 'pop-links' }, ...links.flatMap((l, i) => i ? [' · ', l] : [l])) : null,
        el('div', { class: 'pop-src' }, 'Source: ', el('button', { class: 'link-btn', onclick: () => ctx.openSource?.(srcId) }, D.sourceById.get(srcId) ? `${(D.sourceById.get(srcId).authors || '').split(',')[0]} et al. ${D.sourceById.get(srcId).year}` : 'Ananta et al. 2014'), g.precision !== 'point' ? el('span', { class: 'muted' }, ' · location is approximate; marker may be nudged apart from neighbours') : null));
    };
    drawn.forEach(g => {
      const m = L.circleMarker(place.get(g.id), style(g));
      m.options._g = g;
      m.on('mouseover', e => tip.show(`<b>${esc(g.name)}</b><br><span>${esc(g.island || '')} · ${esc(PRECISION_LABEL[g.precision] || '')}</span>`, e.originalEvent));
      m.on('mousemove', e => tip.move(e.originalEvent)); m.on('mouseout', () => tip.hide());
      m.bindPopup(() => popup(g), { className: 'vih-popup', maxWidth: 340 });
      group.addLayer(m); out.markers.set(g.id, m);
    });
    out.groups = groups; d.count = groups.length;
    d.info.note = `${drawn.length} of ${groups.length} groups are drawn; ${groups.length - drawn.length} (foreign nationals, catch-all categories) are listed in search but have no location. Locations come from the Kartapranata map, Glottolog or manual matching — the precision badge on each group says which.`;
    return group;
  };
  const dEth = reg.register({
    id: 'ethnic-groups', name: 'Ethnic groups (633)', group: 'Ethnicity & language', geom: 'point', pane: 'p-ethnic-groups',
    swatch: { type: 'dot', color: '#49546D' },
    info: { source: 'Ananta et al. (2014/2015), Census 2010 ethnic groups', source_id: srcId0, attribution: 'Ananta, Utami, Handayani & Arifin 2014', note: 'Loaded when you switch the layer on (260 KB).' },
    legend: () => colourBy === 'island' ? Object.entries(ISLAND_COLOURS).map(([k, c]) => ({ color: c, label: k })) : Object.entries(PRECISION_COLOURS).map(([k, c]) => ({ color: c, label: PRECISION_LABEL[k] })),
    controls: [{ type: 'select', label: 'Colour by', options: [['island', 'Island'], ['precision', 'Spatial precision']], value: 'island', onChange: v => { colourBy = v; restyleEthnic(); reg.changed(dEth); } }],
    ensure: async d => { await D.load.ethnic(); return buildEthnic(d); },
    fc: () => !drawn.length ? null : ({ type: 'FeatureCollection', features: drawn.map(g => ({ type: 'Feature', properties: { id: g.id, name: g.name, island: g.island, precision: g.precision, method: g.method, place: g.place, glottocode: g.glottocode, appendix: g.appendix }, geometry: { type: 'Point', coordinates: [g.lon, g.lat] } })) })
  });
  out.groups = [];
  /** Search needs the group list before the layer is on: load the (cached) JSON on first search focus. */
  out.loadSearch = async () => {
    await Promise.all([D.load.ethnic(), D.load.suku()]);
    out.groups = D.ethnic?.groups || []; out.labels = D.suku?.labels || [];
  };
  out.focus = async id => {
    await D.load.ethnic();
    const g = (D.ethnic?.groups || []).find(x => x.id === id); if (!g) return;
    await reg.setVisible('ethnic-groups', true);
    const m = out.markers.get(id);
    if (!m) { ctx.toast?.(`${g.name} is listed in Ananta et al. but has no map location.`); return; }
    map.flyToView(m.getLatLng(), Math.max(lmap.getZoom(), 8), { duration: 1 });
    setTimeout(() => m.openPopup(), 600);
  };

  // =====================================================  KARTAPRANATA (image + labels; JSON fetched on first use)
  const sukuBounds = () => { const b = D.suku.meta.georef.bounds; return [[b.south, b.west], [b.north, b.east]]; };
  reg.register({
    id: 'wm-suku-map', name: 'Ethnolinguistic map (Kartapranata)', group: 'Ethnicity & language', geom: null, pane: 'p-wm-suku-map', opacity: 0.7,
    swatch: { type: 'image', color: '#EEDED1' }, bounds: () => D.suku?.meta ? L.latLngBounds(sukuBounds()) : null,
    info: { source: 'Kartapranata ethnolinguistic map (Wikimedia Commons)', url: 'https://commons.wikimedia.org/wiki/File:Peta_Suku_Bangsa,_Bahasa,_dan_Aksara_di_Indonesia.svg', source_id: 'kartapranata-map', attribution: 'Gunawan Kartapranata, Wikimedia Commons', note: 'Georeferenced by least-squares fit on 17 control points. Use the opacity slider to compare with the basemap.' },
    ensure: async d => {
      await D.load.suku(); const S = D.suku; if (!S?.meta) throw new Error('Kartapranata georeference data not available.');
      const credit = 'Gunawan Kartapranata, <a href="https://commons.wikimedia.org/wiki/File:Peta_Suku_Bangsa,_Bahasa,_dan_Aksara_di_Indonesia.svg" target="_blank" rel="noopener">Wikimedia Commons</a> (CC BY-SA)';
      const o = L.imageOverlay(S.meta.image_url, sukuBounds(), { pane: 'p-wm-suku-map', interactive: false, opacity: 1, attribution: credit, alt: 'Ethnolinguistic map of Indonesia by Gunawan Kartapranata' });
      o.on('error', () => { d.error = 'The image could not be loaded (offline or blocked). The label layer still works.'; reg.changed(d); });
      o.on('load', () => { d.error = null; reg.changed(d); });
      return o;
    }
  });
  reg.register({
    id: 'wm-suku-labels', name: 'Suku labels (Kartapranata)', group: 'Ethnicity & language', geom: 'point', pane: 'p-wm-suku-labels',
    swatch: { type: 'text', color: '#33393B' },
    info: { source: 'Kartapranata ethnolinguistic map labels', url: 'https://commons.wikimedia.org/', source_id: 'kartapranata-map', attribution: 'Gunawan Kartapranata, Wikimedia Commons', note: 'Shown from zoom 5.' },
    bounds: () => D.suku?.labels ? L.latLngBounds(D.suku.labels.map(l => [l.lat, l.lon])) : null,
    fc: () => D.suku?.labels ? ({ type: 'FeatureCollection', features: D.suku.labels.map(l => ({ type: 'Feature', properties: { name: l.label }, geometry: { type: 'Point', coordinates: [l.lon, l.lat] } })) }) : null,
    ensure: async d => {
      await D.load.suku(); const S = D.suku; if (!S?.labels) throw new Error('Suku label data not available.');
      const labels = S.labels, g = L.layerGroup(); out.labels = labels; d.count = labels.length;
      labels.forEach(l => {
        const m = L.marker([l.lat, unwrapLon(l.lon)], { pane: 'p-wm-suku-labels', keyboard: false, icon: L.divIcon({ className: 'kl-wrap', iconSize: [0, 0], html: `<span class="kl">${esc(l.label)}</span>` }) });
        m.bindPopup(() => el('div', { class: 'vp-pop' }, el('h4', {}, l.label), el('p', { class: 'muted' }, 'Label position as placed by the cartographer (not a surveyed point).'), el('a', { href: S.meta.url, target: '_blank', rel: 'noopener' }, 'Kartapranata map on Wikimedia Commons ↗')), { className: 'vih-popup' });
        g.addLayer(m);
      });
      return new Gated(g, 5);
    }
  });

  // =====================================================  GLOTTOLOG (data/languages.json, 182 KB, fetched on first use)
  let LG = null;
  const langPrep = async () => {
    if (LG) return LG;
    await D.load.languages(); const Lg = D.languages;
    if (!Lg?.rows?.length) throw new Error('The language data could not be loaded.');
    const ix = n => Lg.cols.indexOf(n), iN = ix('name'), iG = ix('glottocode'), iLat = ix('lat'), iLon = ix('lon'), iF = ix('family'), iI = ix('iso');
    const counts = new Map(); Lg.rows.forEach(r => counts.set(r[iF], (counts.get(r[iF]) || 0) + 1));
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, FAMILY_INK.length).map(x => x[0]);
    const famColour = new Map(top.map((f, i) => [f, FAMILY_INK[i]]));
    const famName = f => Lg.families[f] || '—', colourOf = f => famColour.get(f) || OTHER_INK;
    return (LG = { Lg, iN, iG, iLat, iLon, iF, iI, top, famColour, famName, colourOf });
  };
  const legend = () => LG ? [...LG.top.map(f => ({ color: LG.famColour.get(f), label: LG.famName(f) })), { color: OTHER_INK, label: 'Other families' }] : [];
  reg.register({
    id: 'languages', name: 'Languages (Glottolog)', group: 'Ethnicity & language', geom: 'point', pane: 'p-languages',
    swatch: { type: 'dot', color: '#2F6A6E' }, legend,
    info: { source: 'Glottolog 5.4 (Hammarström, Forkel, Haspelmath & Bank)', attribution: 'Glottolog 5.4, CC BY 4.0', url: 'https://glottolog.org', note: 'One point per language, coloured by family. Shown from zoom 6 (the canvas renderer keeps 3,205 points smooth). Loaded when you switch the layer on.' },
    bounds: () => LG ? L.latLngBounds(LG.Lg.rows.map(r => [r[LG.iLat], unwrapLon(r[LG.iLon])])) : null,
    fc: () => !LG ? null : ({ type: 'FeatureCollection', features: LG.Lg.rows.map(r => ({ type: 'Feature', properties: { name: r[LG.iN], glottocode: r[LG.iG], iso: r[LG.iI], family: LG.famName(r[LG.iF]) }, geometry: { type: 'Point', coordinates: [unwrapLon(r[LG.iLon]), r[LG.iLat]] } })) }),
    ensure: async d => {
      const { Lg, iN, iG, iLat, iLon, iF, iI, famName, colourOf } = await langPrep(); d.count = Lg.rows.length;
      const renderer = L.canvas({ pane: 'p-languages', padding: 0.4, tolerance: 3 }), inner = L.featureGroup();
      Lg.rows.forEach(r => {
        const m = L.circleMarker([r[iLat], unwrapLon(r[iLon])], { renderer, pane: 'p-languages', radius: 3.6, color: '#F6F4EF', weight: 0.9, fillColor: colourOf(r[iF]), fillOpacity: 0.92 });
        m.on('mouseover', e => tip.show(`<b>${esc(r[iN])}</b><br><span>${esc(r[iG])} · ${esc(famName(r[iF]))}</span>`, e.originalEvent));
        m.on('mousemove', e => tip.move(e.originalEvent)); m.on('mouseout', () => tip.hide());
        m.bindPopup(() => el('div', { class: 'vp-pop' }, el('h4', {}, r[iN]), el('p', { class: 'muted' }, `${r[iG]}${r[iI] ? ' · ISO ' + r[iI] : ''}`), el('p', {}, famName(r[iF])), el('a', { href: `https://glottolog.org/resource/languoid/id/${r[iG]}`, target: '_blank', rel: 'noopener' }, 'Glottolog ↗')), { className: 'vih-popup' });
        inner.addLayer(m);
      });
      return new Gated(inner, 6);
    }
  });

  // ---- language areas: Voronoi of language points clipped to land (Web Worker, computed once on first use)
  let areaData = null;
  const areaRenderer = L.canvas({ pane: 'p-language-areas', padding: 0.3 });
  reg.register({
    id: 'language-areas', name: 'Language areas (Voronoi)', group: 'Ethnicity & language', geom: 'polygon', pane: 'p-language-areas', opacity: 0.6,
    swatch: { type: 'area', color: '#8A6A22' }, legend, progress: null,
    info: { source: 'Derived: Voronoi cells of Glottolog 5.4 language points, clipped to Natural Earth land', attribution: 'Glottolog 5.4; Natural Earth', note: 'Indicative only — each cell is simply the land nearer to that language point than to any other. It is not a claim about historical territories.' },
    fc: () => areaData,
    ensure: async d => {
      const { Lg, iN, iG, iLat, iLon, iF, colourOf } = await langPrep();
      return new Promise((resolve, reject) => {
        let w; try { w = new Worker('js/voronoi-worker.js'); } catch (e) { return reject(new Error('Web Workers are not available')); }
        const pts = Lg.rows.map(r => [unwrapLon(r[iLon]), r[iLat], r[iF], r[iN], r[iG]]);
        const countries = topojson.feature(D.countries, D.countries.objects.countries);
        d.progress = 0; reg.changed(d);
        w.onmessage = ({ data }) => {
          if (data.progress != null) { d.progress = data.progress; reg.changed(d); }
          else if (data.error) { w.terminate(); d.progress = null; reject(new Error(data.error)); }
          else if (data.done) {
            w.terminate(); d.progress = null; areaData = data.fc;
            const g = L.geoJSON(data.fc, { pane: 'p-language-areas', renderer: areaRenderer, style: f => ({ fillColor: colourOf(f.properties.fam), fillOpacity: 0.85, color: '#F6F4EF', weight: 0.5, opacity: 0.8 }),
              onEachFeature: (f, l) => { l.on('mouseover', e => tip.show(`<b>${esc(f.properties.name)}</b><br><span>area nearest this language point</span>`, e.originalEvent)); l.on('mousemove', e => tip.move(e.originalEvent)); l.on('mouseout', () => tip.hide()); } });
            reg.changed(d); resolve(g);
          }
        };
        w.onerror = e => { w.terminate(); d.progress = null; reject(new Error(e.message || 'worker failed')); };
        w.postMessage({ pts, countries });
      });
    }
  });
  return out;
}
