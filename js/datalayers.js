// datalayers.js — everything that turns data into registry layers: Natural Earth reference layers, the layer catalogue
// (data/layers.json), user layers (files, services), analysis results, persistence in IndexedDB and exports.
import { el, esc, kv, downloadFile, unwrapLon, hashStr } from './util.js';

export const INK = ['#49546D', '#9A4A42', '#8A6A22', '#4A6B48', '#2F6A6E', '#6B4A68', '#A0532A', '#33393B', '#5B6264', '#6E4540', '#51445A', '#6B5F52'];
export const SWATCHES = ['#33393B', '#49546D', '#B2ABB4', '#DFDDD7', '#F6F4EF', '#EEDED1', '#CCD6E6', '#9A4A42', '#2F6A6E', '#8A6A22'];
export const DEFAULT_STYLE = { color: '#49546D', weight: 2, fillOpacity: 0.28, radius: 5.5, labelField: '', categoryField: '' };

// =====================================================  parsing
export function parseCSV(text) {
  text = text.replace(/^﻿/, '');
  const first = text.split(/\r?\n/, 1)[0], delim = [',', ';', '\t'].map(d => [d, first.split(d).length]).sort((a, b) => b[1] - a[1])[0][0];
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === delim) { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  const clean = rows.filter(r => r.some(x => x.trim() !== ''));
  const headers = (clean.shift() || []).map(h => h.trim());
  return { headers, rows: clean.map(r => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? '').trim()]))) };
}
export function guessLatLon(headers) {
  const find = re => headers.find(h => re.test(h.trim()));
  return { lat: find(/^(lat|latitude|y|origin_lat)$/i) || find(/lat/i) || '', lon: find(/^(lon|lng|long|longitude|x|origin_lon)$/i) || find(/(lon|lng)/i) || '', label: find(/^(name|label|title|nama)$/i) || headers.find(h => !/^(lat|lon|lng|x|y)/i.test(h)) || '' };
}
export function csvToFC(csv, latCol, lonCol) {
  const feats = [];
  for (const r of csv.rows) {
    const lat = parseFloat(String(r[latCol]).replace(',', '.')), lon = parseFloat(String(r[lonCol]).replace(',', '.'));
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90) continue;
    feats.push({ type: 'Feature', properties: { ...r }, geometry: { type: 'Point', coordinates: [lon, lat] } });
  }
  return { type: 'FeatureCollection', features: feats };
}
export async function parseFile(file) {
  const name = file.name, ext = name.split('.').pop().toLowerCase();
  if (ext === 'zip') {
    const out = await shp(await file.arrayBuffer());
    const fcs = Array.isArray(out) ? out : [out];
    return { kind: 'fc', fc: { type: 'FeatureCollection', features: fcs.flatMap(f => f.features) }, name: name.replace(/\.zip$/i, '') };
  }
  const text = await file.text();
  if (ext === 'csv' || ext === 'tsv' || ext === 'txt') { const csv = parseCSV(text); return { kind: 'csv', csv, guess: guessLatLon(csv.headers), name: name.replace(/\.\w+$/, '') }; }
  if (ext === 'kml') return { kind: 'fc', fc: toGeoJSON.kml(new DOMParser().parseFromString(text, 'text/xml')), name: name.replace(/\.\w+$/, '') };
  if (ext === 'gpx') return { kind: 'fc', fc: toGeoJSON.gpx(new DOMParser().parseFromString(text, 'text/xml')), name: name.replace(/\.\w+$/, '') };
  const j = JSON.parse(text);
  return { kind: 'fc', fc: normaliseFC(j), name: name.replace(/\.\w+$/, '') };
}
export function normaliseFC(j) {
  if (j.type === 'FeatureCollection') return j;
  if (j.type === 'Feature') return { type: 'FeatureCollection', features: [j] };
  if (j.type && j.coordinates) return { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: j }] };
  if (Array.isArray(j)) return { type: 'FeatureCollection', features: j.filter(f => f.type === 'Feature') };
  throw new Error('Not GeoJSON');
}
export const geomKind = fc => {
  const t = new Set((fc?.features || []).map(f => f.geometry?.type || ''));
  const pt = [...t].every(x => /Point/.test(x)), ln = [...t].every(x => /LineString/.test(x)), pg = [...t].every(x => /Polygon/.test(x));
  return !t.size ? 'any' : pt ? 'point' : ln ? 'line' : pg ? 'polygon' : 'any';
};

// =====================================================  vector layers
export const propsTable = (props, skip = []) => {
  const rows = Object.entries(props || {}).filter(([k, v]) => !skip.includes(k) && v != null && v !== '');
  return el('table', { class: 'prop-table' }, ...rows.slice(0, 40).map(([k, v]) => el('tr', {}, el('th', {}, k), el('td', {}, typeof v === 'object' ? JSON.stringify(v) : String(v)))));
};
export function categoryColours(fc, field) {
  const vals = [...new Set(fc.features.map(f => String(f.properties?.[field] ?? '')))].sort();
  return Object.fromEntries(vals.map((v, i) => [v, INK[i % INK.length]]));
}
export function styleFor(f, st, cats) {
  const col = st.categoryField && cats ? (cats[String(f.properties?.[st.categoryField] ?? '')] || st.color) : st.color;
  return { color: col, weight: st.weight, fillColor: col, fillOpacity: st.fillOpacity, opacity: 1, radius: st.radius };
}

/** Build the Leaflet layer for a vector layer def (def.data = FeatureCollection, def.style). */
export function buildVector(d, { tip } = {}) {
  const pane = d.pane, big = d.data.features.length > 1500;
  const renderer = big ? L.canvas({ pane, padding: 0.3 }) : undefined;
  const cats = d.style.categoryField ? categoryColours(d.data, d.style.categoryField) : null; d.cats = cats;
  const g = L.geoJSON(d.data, {
    pane, renderer, style: f => styleFor(f, d.style, d.cats),
    pointToLayer: (f, ll) => L.circleMarker(L.latLng(ll.lat, ll.lng), { pane, renderer, ...styleFor(f, d.style, d.cats), color: '#F6F4EF', weight: 1.2, fillColor: styleFor(f, d.style, d.cats).fillColor, fillOpacity: 0.92 }),
    onEachFeature: (f, l) => {
      l.bindPopup(() => el('div', { class: 'vp-pop' }, el('h4', {}, f.properties?.name || f.properties?.label || f.properties?.title || d.name), propsTable(f.properties)), { className: 'vih-popup', maxWidth: 360, maxHeight: 280 });
      if (tip) { const t = f.properties?.name || f.properties?.label || f.properties?.title; if (t) { l.on('mouseover', e => tip.show(`<b>${esc(t)}</b>`, e.originalEvent)); l.on('mousemove', e => tip.move(e.originalEvent)); l.on('mouseout', () => tip.hide()); } }
    }
  });
  applyLabels(d, g);
  return g;
}
export function applyLabels(d, g = d.layer) {
  if (!g) return;
  g.eachLayer(l => {
    l.unbindTooltip?.();
    const v = d.style.labelField && l.feature?.properties?.[d.style.labelField];
    if (v != null && v !== '' && d.data.features.length <= 800) l.bindTooltip(String(v), { permanent: true, direction: 'top', offset: [0, -4], className: 'vih-lbl', opacity: 1 });
  });
}
export function restyle(d) {
  d.cats = d.style.categoryField ? categoryColours(d.data, d.style.categoryField) : null;
  d.layer?.eachLayer(l => { if (l.setStyle) { const s = styleFor(l.feature, d.style, d.cats); l.setStyle(l instanceof L.CircleMarker ? { ...s, color: '#F6F4EF', weight: 1.2, fillOpacity: 0.92 } : s); if (l.setRadius) l.setRadius(d.style.radius); } });
  applyLabels(d);
}

// =====================================================  exports
export function exportGeoJSON(fc, name) { downloadFile(`${slug(name)}.geojson`, JSON.stringify(fc), 'application/geo+json'); }
export function exportCSV(fc, name) {
  const keys = [...new Set(fc.features.flatMap(f => Object.keys(f.properties || {})))];
  const isPts = fc.features.every(f => f.geometry?.type === 'Point');
  const head = [...(isPts ? ['lon', 'lat'] : ['geometry']), ...keys], q = v => { v = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); return /[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; };
  const lines = [head.join(',')].concat(fc.features.map(f => [...(isPts ? f.geometry.coordinates.slice(0, 2) : [JSON.stringify(f.geometry)]), ...keys.map(k => f.properties?.[k])].map(q).join(',')));
  downloadFile(`${slug(name)}.csv`, lines.join('\n'), 'text/csv');
}
export const slug = s => String(s || 'layer').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'layer';

// =====================================================  service layers from a spec
/** spec: {type, url, options, bounds, attribution, style, popup, data}. Returns a Leaflet layer (or promise for geojson). */
export async function layerFromSpec(spec, d, ctx) {
  const pane = d.pane, attr = spec.attribution || '';
  switch (spec.type) {
    case 'wms': return L.tileLayer.wms(spec.url, { pane, layers: spec.options?.layers || '', format: spec.options?.format || 'image/png', transparent: spec.options?.transparent !== false, version: spec.options?.version || '1.3.0', attribution: attr, maxZoom: 17, ...(spec.options?.extra || {}) });
    case 'xyz': return L.tileLayer(spec.url, { pane, maxZoom: 17, maxNativeZoom: spec.options?.maxNativeZoom || 18, attribution: attr, subdomains: spec.options?.subdomains || 'abc', ...(spec.options?.extra || {}) });
    case 'arcgis-dynamic': return L.esri.dynamicMapLayer({ url: spec.url, pane, attribution: attr, opacity: 1, f: 'image', ...(spec.options?.extra || {}) });
    case 'arcgis-feature': return L.esri.featureLayer({ url: spec.url, pane, attribution: attr, style: () => ({ color: d.style?.color || '#49546D', weight: d.style?.weight || 1.5, fillOpacity: d.style?.fillOpacity ?? 0.25 }), pointToLayer: (f, ll) => L.circleMarker(ll, { pane, radius: 5, color: '#F6F4EF', weight: 1, fillColor: d.style?.color || '#49546D', fillOpacity: 0.9 }),
      onEachFeature: (f, l) => l.bindPopup(() => el('div', { class: 'vp-pop' }, propsTable(f.properties)), { className: 'vih-popup', maxHeight: 260 }) });
    case 'image': return L.imageOverlay(spec.url, spec.bounds, { pane, attribution: attr, interactive: false });
    case 'geojson': {
      if (!d.data) { const r = await fetch(spec.url); if (!r.ok) throw new Error(`HTTP ${r.status}`); d.data = normaliseFC(await r.json()); }
      d.geom = geomKind(d.data); return buildVector(d, ctx);
    }
    default: throw new Error('Unknown layer type ' + spec.type);
  }
}

// =====================================================  the manager of data-driven layers
export function createDataLayers({ D, map, reg, tip, ctx }) {
  const lmap = map.map, out = {};
  const uid = () => 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

  // ----- Natural Earth reference layers (from data/geo)
  const borderStyle = () => map.basemap()?.dark ? { color: '#CCD6E6', weight: 1.1, opacity: 0.7, dashArray: '5 4' } : { color: '#33393B', weight: 1.1, opacity: 0.55, dashArray: '5 4' };
  const riverStyle = () => map.basemap()?.dark ? { color: '#CCD6E6', weight: 1.1, opacity: 0.8 } : { color: '#49546D', weight: 1.1, opacity: 0.75 };
  const neAttr = 'Natural Earth (public domain)';
  const mesh = topojson.mesh(D.countries, D.countries.objects.countries, (a, b) => a !== b);
  const countries = topojson.feature(D.countries, D.countries.objects.countries);
  const rivers = topojson.feature(D.rivers, D.rivers.objects.rivers);
  const bordersLayer = L.geoJSON(mesh, { pane: 'p-borders', interactive: false, style: borderStyle });
  const riversLayer = L.geoJSON(rivers, { pane: 'p-rivers', interactive: false, style: riverStyle, smoothFactor: 1 });
  const shifted = g => { const f = c => Array.isArray(c[0]) ? c.map(f) : [c[0] + 360, c[1]]; return { ...g, coordinates: f(g.coordinates) }; };
  const withPacific = layer => { const copy = L.geoJSON(layer.toGeoJSON(), { pane: layer.options.pane, interactive: false, style: layer.options.style, coordsToLatLng: c => L.latLng(c[1], c[0] + 360) }); layer.addLayer(copy); };
  withPacific(bordersLayer); withPacific(riversLayer);
  map.onBasemap(() => { bordersLayer.setStyle(borderStyle()); riversLayer.setStyle(riverStyle()); });
  reg.register({ id: 'borders', name: 'Modern borders', group: 'Reference', layer: bordersLayer, geom: 'line', pane: 'p-borders', swatch: { type: 'line', color: '#33393B', dash: true }, info: { source: 'Natural Earth 1:50m admin-0 boundaries', attribution: neAttr, url: 'https://www.naturalearthdata.com/' }, fc: () => mesh });
  reg.register({ id: 'rivers', name: 'Rivers', group: 'Reference', layer: riversLayer, geom: 'line', pane: 'p-rivers', swatch: { type: 'line', color: '#49546D' }, info: { source: 'Natural Earth 1:50m rivers and lake centrelines', attribution: neAttr, url: 'https://www.naturalearthdata.com/' }, fc: () => rivers });

  // ----- catalogue (data/layers.json): metadata overrides for built-ins, full entries for services/files
  const cat = Array.isArray(D.catalogue) ? D.catalogue : [];
  out.applyCatalogue = () => {
    for (const e of cat) {
      if (reg.has(e.id)) {                                     // built-in: layers.json may rename / regroup / set defaults
        const d = reg.get(e.id);
        if (e.name) d.name = e.name; if (e.group) d.group = e.group;
        d.info = { ...d.info, source: e.note || d.info.source, attribution: e.attribution || d.info.attribution, source_id: e.source_id || d.info.source_id };
        if (typeof e.opacity === 'number') reg.setOpacity(e.id, e.opacity);
        if (typeof e.default === 'boolean' && e.default !== d.visible) reg.setVisible(e.id, e.default);
        continue;
      }
      if (e.type === 'builtin') continue;
      const d = reg.register({
        id: e.id, name: e.name, group: e.group || 'Reference', kind: 'catalogue', type: e.type, geom: e.type === 'geojson' ? 'any' : null, opacity: e.opacity ?? 1, style: { ...DEFAULT_STYLE, ...(e.style || {}) },
        swatch: { type: e.type === 'geojson' ? 'area' : 'image', color: e.style?.color || '#CCD6E6' }, spec: e, bounds: e.bounds ? () => L.latLngBounds(e.bounds) : undefined,
        info: { source: e.note || e.url, url: e.url, attribution: e.attribution, source_id: e.source_id, note: e.note },
        fc: e.type === 'geojson' ? () => d.data : undefined,
        ensure: dd => layerFromSpec(e, dd, { tip })
      });
      if (e.default) reg.setVisible(e.id, true);
    }
  };
  out.catalogue = cat;

  // ----- user layers
  const persist = async d => {
    if (d.kind !== 'user') return;
    await kv.set('layer:' + d.id, { id: d.id, name: d.name, spec: { ...d.spec, data: d.spec.type === 'geojson' ? d.data : undefined }, style: d.style, opacity: d.opacity, visible: d.visible, geom: d.geom, info: d.info });
  };
  out.persist = persist;
  async function addUserLayer({ name, spec, data, style, info, visible = true, id, opacity = 1, geom }) {
    id = id || uid();
    const d = reg.register({
      id, name, group: 'User layers', kind: 'user', type: spec.type, removable: true, opacity, style: { ...DEFAULT_STYLE, ...(style || {}) }, spec, data, geom: geom || (data ? geomKind(data) : null),
      swatch: { type: spec.type === 'geojson' ? 'area' : 'image', color: style?.color || '#49546D' }, info: { source: info?.source || spec.url || 'Uploaded file', attribution: spec.attribution, note: info?.note, url: spec.url },
      fc: spec.type === 'geojson' ? () => d.data : undefined,
      ensure: dd => layerFromSpec(spec, dd, { tip }),
      onRemove: () => { kv.del('layer:' + id); }
    });
    await reg.setVisible(id, visible);
    if (d.error) throw new Error(d.error);
    persist(d); return d;
  }
  out.addUserLayer = addUserLayer;
  /** GeoJSON → user layer (files, CSV, URL). */
  out.addFC = (fc, name, extra = {}) => addUserLayer({ name, data: fc, spec: { type: 'geojson', url: extra.url }, info: { source: extra.source || extra.url || 'Uploaded file' }, ...extra.opts });
  /** Analysis / measurement result layer (not persisted). */
  out.addResult = ({ name, fc, style = {}, info = {}, controls, layer, geom, extra = {} }) => {
    const id = 'r' + uid().slice(1);
    const d = reg.register({
      id, name, group: 'Analysis results', kind: 'result', type: layer ? 'custom' : 'geojson', removable: true, geom: geom || (fc ? geomKind(fc) : null), data: fc, style: { ...DEFAULT_STYLE, color: '#9A4A42', fillOpacity: 0.3, ...style },
      swatch: { type: 'area', color: style.color || '#9A4A42' }, info: { source: 'Analysis result', ...info }, controls, fc: fc ? () => d.data : undefined, ...extra
    });
    d.layer = layer || buildVector(d, { tip });
    d.ensure = null;
    reg.setVisible(id, true);
    return d;
  };
  out.restore = async () => {
    const keys = await kv.keys('layer:');
    for (const k of keys.sort()) {
      const r = await kv.get(k); if (!r) continue;
      try { await addUserLayer({ id: r.id, name: r.name, spec: r.spec, data: r.spec.data, style: r.style, opacity: r.opacity, visible: r.visible, info: r.info, geom: r.geom }); }
      catch (e) { console.info('[user layer]', r.name, e.message); }
    }
  };
  /** JSON snippet for data/layers.json. */
  out.catalogueEntry = d => {
    const s = d.spec || {}, e = { id: d.id, name: d.name, group: 'Reference', type: s.type || d.type, url: s.url || '', options: s.options, bounds: s.bounds, style: d.style, attribution: s.attribution || d.info?.attribution || '', source_id: d.info?.source_id || '', opacity: d.opacity, default: false, note: d.info?.note || '' };
    if (s.type === 'geojson' && !s.url) { e.type = 'geojson'; e.url = `data/layers/${slug(d.name)}.geojson`; e.note = (e.note ? e.note + ' ' : '') + `(Save the exported GeoJSON as ${e.url}.)`; }
    Object.keys(e).forEach(k => (e[k] === undefined || e[k] === '') && delete e[k]);
    return JSON.stringify(e, null, 2);
  };
  return out;
}
