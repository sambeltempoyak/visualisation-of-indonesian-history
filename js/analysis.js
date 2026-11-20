// analysis.js — the "Analyse" panel: drawing (Leaflet-Geoman), measuring, and Turf-based spatial analysis whose
// outputs become layers in the "Analysis results" group.
import { el, esc, debounce, formatYear, downloadFile } from './util.js';
import { createRouteSet, arcPath } from './routes.js';
import { parseCSV } from './datalayers.js';

const SHAPES = [['Marker', 'Point', '●'], ['Line', 'Line', '⁄'], ['Polygon', 'Polygon', '⬠'], ['Rectangle', 'Rectangle', '▭'], ['Circle', 'Circle', '◯']];
const fmtKm = km => km < 1 ? `${(km * 1000).toFixed(0)} m` : km < 100 ? `${km.toFixed(2)} km` : `${km.toFixed(0)} km`;
const fmtArea = km2 => `${km2 < 1 ? km2.toFixed(3) : km2 < 100 ? km2.toFixed(2) : km2.toFixed(0)} km² · ${(km2 * 100).toLocaleString('en-GB', { maximumFractionDigits: 1 })} ha`;
export const FLOW_SAMPLE = `origin_lat,origin_lon,dest_lat,dest_lon,value,label,start,end
-4.6,129.9,2.2,102.2,90,Banda nutmeg & mace to Melaka,1400,1511
2.2,102.2,15.5,73.9,70,Melaka to Goa (Portuguese),1511,1641
-4.6,129.9,-6.2,106.8,120,Banda spices to Batavia (VOC),1621,1799
-6.2,106.8,52.4,4.9,200,Batavia to Amsterdam (VOC),1619,1799
-5.1,119.4,22.3,114.2,40,Makassar trepang to Canton,1700,1850
-7.2,112.7,-6.2,106.8,60,East Java rice to Batavia,1700,1800
4.0,96.0,21.0,39.0,25,Aceh pilgrims to Mecca,1600,1900
-6.2,106.8,5.4,100.3,35,Batavia to Penang,1786,1870`;

export function createAnalysis({ D, map, reg, dl, state, tip, ctx }) {
  const lmap = map.map, root = document.getElementById('analyse'), live = document.getElementById('liveMeasure');
  const shapes = []; let n = 0;
  const KIND_TXT = { Marker: 'Point', Line: 'Line', Polygon: 'Polygon', Rectangle: 'Rectangle', Circle: 'Circle' };

  // =====================================================  drawn shapes layer
  map.pane('p-drawn', 392);
  const drawnGroup = L.featureGroup();
  const PATH = { color: '#9A4A42', weight: 2.5, fillColor: '#9A4A42', fillOpacity: 0.2, pane: 'p-drawn' };
  const featureOf = s => {
    const l = s.layer; let g;
    if (s.kind === 'Circle') { const c = l.getLatLng(); g = turf.circle([c.lng, c.lat], l.getRadius() / 1000, { steps: 72, units: 'kilometers' }); g = { type: 'Feature', properties: {}, geometry: g.geometry }; }
    else g = { type: 'Feature', properties: {}, geometry: l.toGeoJSON().geometry };
    g.properties = { name: s.name, kind: KIND_TXT[s.kind], shape_id: s.id, ...measureOf(s, g) };
    return g;
  };
  function measureOf(s, g) {
    try {
      if (s.kind === 'Line') return { length_km: +turf.length(g, { units: 'kilometers' }).toFixed(3) };
      if (s.kind === 'Marker') return {};
      const a = turf.area(g) / 1e6; return { area_km2: +a.toFixed(3), area_ha: +(a * 100).toFixed(1), perimeter_km: +turf.length(turf.polygonToLine(g), { units: 'kilometers' }).toFixed(3), ...(s.kind === 'Circle' ? { radius_km: +(s.layer.getRadius() / 1000).toFixed(3) } : {}) };
    } catch (e) { return {}; }
  }
  const labelOf = (s, f) => { const p = f.properties; return p.length_km != null ? fmtKm(p.length_km) : p.area_km2 != null ? fmtArea(p.area_km2) : s.name; };
  function relabel(s) {
    const f = featureOf(s); s.layer.unbindTooltip();
    s.layer.bindTooltip(`${esc(s.name)}<br>${labelOf(s, f)}`, { permanent: true, direction: s.kind === 'Marker' ? 'top' : 'center', className: 'vih-measure', opacity: 1, ...(s.kind === 'Marker' ? { offset: [0, -8] } : {}) });
    s.layer.openTooltip?.();
  }
  const drawnDef = reg.register({
    id: 'drawn', name: 'Drawn shapes', group: 'User layers', kind: 'user-draw', layer: drawnGroup, visible: true, geom: 'any', pane: 'p-drawn', removable: false,
    swatch: { type: 'area', color: '#9A4A42' }, count: 0,
    info: { source: 'Shapes you draw with the Analyse tools', note: 'Named shapes feed the analysis tools (buffer, points in polygon, intersect). They live in this browser session only — export as GeoJSON to keep them.' },
    fc: () => ({ type: 'FeatureCollection', features: shapes.map(featureOf) })
  });
  const shapeSubs = new Set(); const shapesChanged = () => { drawnDef.count = shapes.length; reg.changed(drawnDef); shapeSubs.forEach(f => f()); renderShapes(); };

  lmap.pm.setGlobalOptions({ pathOptions: PATH, snappable: true, snapDistance: 14, allowSelfIntersection: true, finishOn: 'dblclick', tooltips: true, hintlineStyle: { color: '#9A4A42', dashArray: [5, 5] }, templineStyle: { color: '#9A4A42' }, markerStyle: { draggable: true } });
  lmap.pm.setLang?.('en');
  lmap.on('pm:create', e => {
    const kind = e.shape, l = e.layer; n++;
    const s = { id: 's' + n, kind, layer: l, name: `${KIND_TXT[kind] || kind} ${n}` };
    drawnGroup.addLayer(l); shapes.push(s);
    l.on('pm:edit', () => { relabel(s); shapeSubs.forEach(f => f()); });
    l.on('pm:dragend', () => relabel(s));
    if (l.setStyle && kind !== 'Marker') l.setStyle(PATH);
    relabel(s); shapesChanged();
    live.hidden = true; setMode(null);
  });
  lmap.on('pm:remove', e => { const i = shapes.findIndex(s => s.layer === e.layer); if (i >= 0) { shapes.splice(i, 1); drawnGroup.removeLayer(e.layer); shapesChanged(); } });
  lmap.on('pm:drawstart', e => {
    const wl = e.workingLayer, shape = e.shape;
    const move = ev => {
      if (shape !== 'Line' && shape !== 'Polygon') return;
      const pts = [].concat(wl.getLatLngs()).flat(Infinity); if (!pts.length) { live.hidden = true; return; }
      const all = [...pts, ev.latlng].map(p => [p.lng, p.lat]); let txt;
      if (shape === 'Line') txt = 'Length ' + fmtKm(turf.length(turf.lineString(all), { units: 'kilometers' }));
      else if (all.length >= 3) { const poly = turf.polygon([[...all, all[0]]]); txt = 'Area ' + fmtArea(turf.area(poly) / 1e6); } else txt = 'Length ' + fmtKm(turf.length(turf.lineString(all), { units: 'kilometers' }));
      live.textContent = txt; live.hidden = false; live.style.left = (ev.originalEvent.clientX + 16) + 'px'; live.style.top = (ev.originalEvent.clientY + 16) + 'px';
    };
    lmap.on('mousemove', move);
    lmap.once('pm:drawend', () => { lmap.off('mousemove', move); live.hidden = true; setMode(null); });
  });

  // =====================================================  UI helpers
  let mode = null; const modeBtns = new Map();
  function setMode(m) {
    mode = m; lmap.pm.disableDraw(); if (lmap.pm.globalEditModeEnabled()) lmap.pm.disableGlobalEditMode(); if (lmap.pm.globalRemovalModeEnabled()) lmap.pm.disableGlobalRemovalMode();
    document.body.classList.toggle('drawing', !!m && SHAPES.some(s => s[0] === m));
    if (m && SHAPES.some(s => s[0] === m)) lmap.pm.enableDraw(m);
    else if (m === 'edit') lmap.pm.enableGlobalEditMode();
    else if (m === 'delete') lmap.pm.enableGlobalRemovalMode();
    modeBtns.forEach((b, k) => b.setAttribute('aria-pressed', String(k === m)));
  }
  const modeBtn = (key, label, glyph, title) => { const b = el('button', { class: 'btn btn-sm tool', 'aria-pressed': 'false', title: title || label, onclick: () => setMode(mode === key ? null : key) }, el('span', { class: 'tool-g' }, glyph), label); modeBtns.set(key, b); return b; };
  const sec = (title, open, ...kids) => el('details', { class: 'an-sec', open: open || null }, el('summary', {}, title), el('div', { class: 'an-body' }, ...kids));
  const fld = (label, ...kids) => el('label', { class: 'fld' }, el('span', {}, label), ...kids);
  const outBox = () => el('div', { class: 'an-out', 'aria-live': 'polite' });
  const selects = [];   // {sel, kind, withShapes}
  const opts = (kind, withShapes) => {
    const out = [];
    if (withShapes) {
      for (const sh of shapes) { if (kind === 'point' && sh.kind !== 'Marker') continue; if (kind === 'polygon' && !['Polygon', 'Rectangle', 'Circle'].includes(sh.kind)) continue; out.push([`shape:${sh.id}`, `✎ ${sh.name}`]); }
      if (shapes.length > 1) out.push(['layer:drawn', '✎ All drawn shapes']);
    }
    for (const d of reg.list().slice().reverse()) {
      if (d.id === 'drawn') continue;
      if (!(d.fc || d.layer?.toGeoJSON) || d.geom === null || d.type === 'custom-heat') continue;
      if (kind === 'point' && !['point', 'any'].includes(d.geom)) continue;
      if (kind === 'polygon' && !['polygon', 'any'].includes(d.geom)) continue;
      out.push([`layer:${d.id}`, `${d.name}`]);
    }
    return out;
  };
  function geoSelect(kind, label, withShapes = true) {
    const sel = el('select', { 'aria-label': label });
    const fill = () => { const v = sel.value; sel.replaceChildren(...opts(kind, withShapes).map(([val, t]) => el('option', { value: val }, t))); if ([...sel.options].some(o => o.value === v)) sel.value = v; };
    fill(); selects.push(fill);
    return { sel, field: fld(label, sel) };
  }
  const resolve = value => {
    if (!value) return null;
    const [t, id] = value.split(':');
    if (t === 'shape') { const s = shapes.find(x => x.id === id); return s ? { name: s.name, fc: { type: 'FeatureCollection', features: [featureOf(s)] } } : null; }
    const d = reg.get(id); const fc = reg.fc(id); if (!fc) throw new Error(`“${d?.name || id}” has no features yet — switch the layer on first.`); return fc ? { name: d.name, fc } : null;
  };
  const nameOf = f => f.properties?.name ?? f.properties?.label ?? f.properties?.title ?? f.properties?.id ?? '(unnamed)';
  const ptsOf = fc => fc.features.filter(f => f.geometry && /Point/.test(f.geometry.type));
  const polysOf = fc => fc.features.filter(f => f.geometry && /Polygon/.test(f.geometry.type));
  const cent = f => f.geometry.type === 'Point' ? f.geometry.coordinates : turf.centroid(f).geometry.coordinates;
  const busy = async (out, fn) => { out.className = 'an-out'; out.textContent = 'Working…'; await new Promise(r => setTimeout(r, 20)); try { await fn(); } catch (e) { out.className = 'an-out err'; out.textContent = e.message || String(e); console.warn(e); } };
  const zoomBtn = (fc, label = 'Zoom to result') => el('button', { class: 'btn btn-sm', onclick: () => { const b = L.geoJSON(fc).getBounds(); b.isValid() && map.flyToBounds(b, { pad: 60, maxZoom: 11 }); } }, label);

  // ----- shapes list
  const shapeList = el('div', { class: 'shape-list' });
  function renderShapes() {
    shapeList.replaceChildren(...(shapes.length ? shapes.map(s => {
      const f = featureOf(s), name = el('input', { type: 'text', value: s.name, 'aria-label': 'Shape name' });
      name.addEventListener('change', () => { s.name = name.value.trim() || s.name; relabel(s); shapesChanged(); });
      return el('div', { class: 'shape' }, name, el('span', { class: 'shape-m' }, `${KIND_TXT[s.kind]} · ${labelOf(s, f)}`),
        el('button', { class: 'btn btn-sm btn-mini', onclick: () => { const b = s.layer.getBounds ? s.layer.getBounds() : L.latLngBounds([s.layer.getLatLng()]); b.getSouthWest().equals(b.getNorthEast()) ? map.flyToView(b.getCenter(), 9) : map.flyToBounds(b, { pad: 60 }); } }, 'Zoom'),
        el('button', { class: 'btn btn-sm btn-mini btn-danger', 'aria-label': `Delete ${s.name}`, onclick: () => { drawnGroup.removeLayer(s.layer); shapes.splice(shapes.indexOf(s), 1); shapesChanged(); } }, '✕'));
    }) : [el('p', { class: 'muted' }, 'No shapes yet. Pick a tool and click on the map (double-click to finish a line or polygon).')]));
  }
  shapeSubs.add(() => selects.forEach(f => f()));
  reg.on(t => { if (t === 'add' || t === 'remove') selects.forEach(f => f()); });

  // =====================================================  sections
  const drawSec = sec('Draw & measure', true,
    el('div', { class: 'tools' }, ...SHAPES.map(([k, l, g]) => modeBtn(k, l, g)), modeBtn('edit', 'Edit', '✎', 'Move vertices of drawn shapes'), modeBtn('delete', 'Delete', '✕', 'Click a shape to delete it')),
    el('p', { class: 'muted hint' }, 'Lines and polygons show a live length / area at the cursor; finished shapes keep a label. Name a shape below to use it in the tools.'),
    shapeList,
    el('div', { class: 'row' }, el('button', { class: 'btn btn-sm', onclick: () => { const fc = reg.fc('drawn'); fc.features.length ? downloadFile('drawn-shapes.geojson', JSON.stringify(fc), 'application/geo+json') : ctx.toast('Nothing drawn yet.'); } }, 'Export shapes (GeoJSON)'),
      el('button', { class: 'btn btn-sm', onclick: () => { shapes.slice().forEach(s => drawnGroup.removeLayer(s.layer)); shapes.length = 0; shapesChanged(); } }, 'Clear all')));

  // ----- buffer
  const bufSrc = geoSelect('any', 'Around'), bufKm = el('input', { type: 'number', value: 25, min: 0.01, step: 'any', 'aria-label': 'Buffer distance in km' }), bufOut = outBox();
  const bufSec = sec('Buffer', false, bufSrc.field, fld('Distance (km)', bufKm),
    el('button', { class: 'btn btn-primary', onclick: () => busy(bufOut, async () => {
      const r = resolve(bufSrc.sel.value); if (!r) throw new Error('Choose a layer or a drawn shape.');
      const km = +bufKm.value; if (!(km > 0)) throw new Error('Enter a distance above zero.');
      if (r.fc.features.length > 1500) throw new Error('That layer has too many features for a buffer — pick a smaller layer or a drawn shape.');
      const feats = [];
      for (const f of r.fc.features) { const b = turf.buffer(f, km, { units: 'kilometers', steps: 24 }); if (b) { b.properties = { ...f.properties, buffer_km: km, area_km2: +(turf.area(b) / 1e6).toFixed(2) }; feats.push(b); } }
      const fc = turf.featureCollection(feats);
      dl.addResult({ name: `Buffer ${km} km · ${r.name}`, fc, geom: 'polygon', info: { note: `Geodesic buffer of ${km} km around ${r.name}.` } });
      bufOut.className = 'an-out ok'; bufOut.replaceChildren(`${feats.length} buffer polygon${feats.length > 1 ? 's' : ''} added to Analysis results.`, ' ', zoomBtn(fc));
    }) }, 'Create buffer'), bufOut);

  // ----- points in polygon
  const pipPts = geoSelect('point', 'Points from'), pipPoly = geoSelect('polygon', 'Inside polygon(s)'), pipOut = outBox();
  const pipSec = sec('Points in polygon', false, pipPts.field, pipPoly.field,
    el('button', { class: 'btn btn-primary', onclick: () => busy(pipOut, async () => {
      const A = resolve(pipPts.sel.value), B = resolve(pipPoly.sel.value); if (!A || !B) throw new Error('Choose a point layer and a polygon.');
      const pts = ptsOf(A.fc), polys = polysOf(B.fc); if (!polys.length) throw new Error('The second choice has no polygons.');
      const hit = [], per = [];
      for (const pg of polys) {
        const bb = turf.bbox(pg); let c = 0;
        for (const p of pts) { const [x, y] = p.geometry.coordinates; if (x < bb[0] || x > bb[2] || y < bb[1] || y > bb[3]) continue; if (turf.booleanPointInPolygon(p, pg)) { hit.push({ ...p, properties: { ...p.properties, inside: nameOf(pg) } }); c++; } }
        per.push([nameOf(pg), c]);
      }
      const fc = turf.featureCollection(hit);
      pipOut.className = 'an-out ok'; pipOut.replaceChildren(...[el('p', {}, el('b', {}, `${hit.length} of ${pts.length}`), ` points of “${A.name}” lie inside ${B.name}.`),
        per.length > 1 ? el('p', { class: 'muted' }, per.map(([a, c]) => `${a}: ${c}`).join(' · ')) : null,
        hit.length ? el('ol', { class: 'hits' }, hit.slice(0, 80).map(h => el('li', {}, nameOf(h), h.properties.island ? el('small', {}, ' · ' + h.properties.island) : null))) : null,
        hit.length > 80 ? el('p', { class: 'muted' }, `…and ${hit.length - 80} more (see the result layer's table).`) : null, hit.length ? zoomBtn(fc, 'Zoom to hits') : null].filter(Boolean));
      if (hit.length) dl.addResult({ name: `${A.name} in ${B.name}`, fc, geom: 'point', style: { color: '#9A4A42', radius: 7 }, info: { note: `Points of ${A.name} inside ${B.name}.` } });
    }) }, 'Find points'), pipOut);

  // ----- intersect / clip
  const isA = geoSelect('polygon', 'Polygon layer A'), isB = geoSelect('polygon', 'Polygon layer B'), isOut = outBox();
  const isSec = sec('Intersect / clip', false, isA.field, isB.field,
    el('button', { class: 'btn btn-primary', onclick: () => busy(isOut, async () => {
      const A = resolve(isA.sel.value), B = resolve(isB.sel.value); if (!A || !B) throw new Error('Choose two polygon layers.');
      const pa = polysOf(A.fc), pb = polysOf(B.fc); if (!pa.length || !pb.length) throw new Error('Both choices need polygons.');
      const feats = []; let tests = 0;
      for (const fa of pa) { const ba = turf.bbox(fa); for (const fb of pb) { const bb = turf.bbox(fb); if (ba[0] > bb[2] || ba[2] < bb[0] || ba[1] > bb[3] || ba[3] < bb[1]) continue; if (++tests > 6000) break;
        let x = null; try { x = turf.intersect(turf.featureCollection([fa, fb])); } catch (e) { /* skip */ }
        if (x) { x.properties = { a: nameOf(fa), b: nameOf(fb), area_km2: +(turf.area(x) / 1e6).toFixed(3) }; feats.push(x); } } }
      if (!feats.length) { isOut.className = 'an-out'; isOut.textContent = 'The polygons do not overlap.'; return; }
      const fc = turf.featureCollection(feats), tot = feats.reduce((s, f) => s + f.properties.area_km2, 0);
      dl.addResult({ name: `${A.name} ∩ ${B.name}`, fc, geom: 'polygon', info: { note: 'Intersection of the two polygon layers.' } });
      isOut.className = 'an-out ok'; isOut.replaceChildren(`${feats.length} overlap piece${feats.length > 1 ? 's' : ''}, total ${fmtArea(tot)}. `, zoomBtn(fc));
    }) }, 'Intersect'), isOut);

  // ----- nearest
  const nnA = geoSelect('any', 'For each feature of A'), nnB = geoSelect('point', 'find nearest in B'), nnN = el('input', { type: 'number', value: 3, min: 1, max: 10, 'aria-label': 'Number of neighbours' }), nnOut = outBox();
  const nnSec = sec('Nearest features', false, nnA.field, nnB.field, fld('How many (N)', nnN),
    el('button', { class: 'btn btn-primary', onclick: () => busy(nnOut, async () => {
      const A = resolve(nnA.sel.value), B = resolve(nnB.sel.value); if (!A || !B) throw new Error('Choose layers A and B.');
      if (A.fc.features.length > 400) throw new Error('A has more than 400 features — choose a smaller layer or a drawn shape.');
      const N = Math.max(1, Math.min(10, +nnN.value || 1)), bs = B.fc.features.filter(f => f.geometry).map(f => ({ f, c: cent(f) }));
      const rows = [], lines = [];
      for (const fa of A.fc.features) {
        if (!fa.geometry) continue; const ca = cent(fa), ap = turf.point(ca);
        const dists = bs.map(b => ({ b, km: turf.distance(ap, turf.point(b.c), { units: 'kilometers' }) })).filter(x => x.b.f !== fa).sort((x, y) => x.km - y.km).slice(0, N);
        dists.forEach((d, i) => { rows.push({ a: nameOf(fa), b: nameOf(d.b.f), km: d.km, rank: i + 1 }); lines.push({ type: 'Feature', properties: { from: nameOf(fa), to: nameOf(d.b.f), rank: i + 1, distance_km: +d.km.toFixed(2) }, geometry: { type: 'LineString', coordinates: [ca, d.b.c] } }); });
      }
      const fc = turf.featureCollection(lines);
      dl.addResult({ name: `Nearest ${N} · ${A.name} → ${B.name}`, fc, geom: 'line', style: { color: '#2F6A6E', weight: 2 }, info: { note: `For each feature of ${A.name}, its ${N} nearest features in ${B.name} (great-circle distance between centroids).` } });
      nnOut.className = 'an-out ok';
      nnOut.replaceChildren(...[el('table', { class: 'mini-table' }, el('thead', {}, el('tr', {}, ...['A', '#', 'B', 'km'].map(h => el('th', {}, h)))), el('tbody', {}, rows.slice(0, 40).map(r => el('tr', {}, el('td', {}, r.a), el('td', {}, r.rank), el('td', {}, r.b), el('td', {}, r.km.toFixed(1)))))), rows.length > 40 ? el('p', { class: 'muted' }, `${rows.length - 40} more rows in the result layer's table.`) : null, zoomBtn(fc)].filter(Boolean));
    }) }, 'Find nearest'), nnOut);

  // ----- heatmap
  const heatSrc = geoSelect('point', 'Point layer', true), heatR = el('input', { type: 'range', min: 6, max: 70, value: 28, 'aria-label': 'Heatmap radius' }), heatOut = outBox();
  const PaneHeat = L.HeatLayer.extend({ onAdd(m) { L.HeatLayer.prototype.onAdd.call(this, m); const p = m.getPane(this.options.pane); if (p && this._canvas.parentNode !== p) p.appendChild(this._canvas); } });
  const heatSec = sec('Heatmap / density', false, heatSrc.field, fld('Radius (px)', heatR),
    el('button', { class: 'btn btn-primary', onclick: () => busy(heatOut, async () => {
      const A = resolve(heatSrc.sel.value); if (!A) throw new Error('Choose a point layer.');
      const pts = ptsOf(A.fc).map(f => [f.geometry.coordinates[1], f.geometry.coordinates[0], 1]); if (!pts.length) throw new Error('No points in that layer.');
      const id = 'h' + Date.now().toString(36), pane = 'p-' + id; map.pane(pane);
      const r0 = +heatR.value;
      const layer = new PaneHeat(pts, { pane, radius: r0, blur: Math.round(r0 * 0.8), maxZoom: 7, max: 1, minOpacity: 0.28, gradient: { 0.25: '#CCD6E6', 0.5: '#B2ABB4', 0.7: '#49546D', 0.88: '#6E4540', 1: '#33393B' } });
      const d = reg.register({ id, name: `Density · ${A.name}`, group: 'Analysis results', kind: 'result', type: 'custom-heat', removable: true, layer, pane, geom: null, swatch: { type: 'area', color: '#6E4540' }, count: pts.length,
        info: { source: 'Analysis result', note: `Kernel density of ${pts.length} points (leaflet.heat). Use the radius slider on the layer row.` },
        bounds: () => L.latLngBounds(pts.map(p => [p[0], p[1]])),
        controls: [{ type: 'range', label: 'Radius (px)', min: 6, max: 70, value: r0, onInput: v => layer.setOptions({ radius: v, blur: Math.round(v * 0.8) }) }] });
      reg.setVisible(id, true);
      heatOut.className = 'an-out ok'; heatOut.textContent = `Density of ${pts.length} points added to Analysis results (adjust radius there).`;
    }) }, 'Create heatmap'), heatOut);

  // ----- flow map
  const flowTxt = el('textarea', { class: 'code-area', rows: 5, spellcheck: false, placeholder: 'origin_lat,origin_lon,dest_lat,dest_lon,value,label,start,end', 'aria-label': 'Flow CSV' });
  const flowTie = el('input', { type: 'checkbox' }), flowOut = outBox(), flowFile = el('input', { type: 'file', accept: '.csv,.tsv,.txt', 'aria-label': 'Flow CSV file' });
  flowFile.addEventListener('change', async () => { if (flowFile.files[0]) flowTxt.value = await flowFile.files[0].text(); });
  const flA = geoSelect('point', 'Origins (layer A)', false), flB = geoSelect('point', 'Destinations (layer B)', false), flLink = el('textarea', { class: 'code-area', rows: 3, spellcheck: false, placeholder: 'origin,dest,value,label,start,end\nKodi,Waingapu,12', 'aria-label': 'Link table CSV' });
  const toNum = v => { const x = parseFloat(String(v ?? '').replace(',', '.')); return Number.isFinite(x) ? x : null; };
  function buildFlows(rows, name, tie) {
    const id = 'f' + Date.now().toString(36), pane = 'p-' + id; map.pane(pane);
    const set = createRouteSet({ map: lmap, pane, tip });
    const vmax = Math.max(...rows.map(r => r.value || 1), 1), handles = [];
    rows.forEach((r, i) => {
      const w = 1.4 + 6 * Math.sqrt((r.value || 1) / vmax);
      const hnd = set.add({ id: id + i, path: arcPath([r.olon, r.olat], [r.dlon, r.dlat], 0.16), kind: 'flow', width: w, title: r.label || `Flow ${i + 1}`, sub: `${r.value ?? ''}${r.start != null ? ' · ' + formatYear(r.start) + (r.end != null ? ' – ' + formatYear(r.end) : '') : ''}` });
      handles.push({ hnd, r });
    });
    const apply = () => { const st = state.get(); handles.forEach(({ hnd, r }) => { const timed = tie && r.start != null; const v = !timed || (st.cumulative ? r.start <= st.window[1] : (r.start <= st.window[1] && (r.end ?? r.start) >= st.window[0])); v ? hnd.show() : hnd.hide(); }); };
    const unsub = tie ? state.on((s, p) => { if (s.window !== p.window || s.cumulative !== p.cumulative) apply(); }) : null;
    const d = reg.register({ id, name: `Flows · ${name}`, group: 'Analysis results', kind: 'result', type: 'custom', removable: true, layer: set.group, pane, geom: 'line', swatch: { type: 'arrow', color: '#49546D' }, count: rows.length,
      info: { source: 'Analysis result', note: `Flow map of ${rows.length} flows; line width is proportional to value${tie ? '; shown only while their start–end years overlap the timeline window' : ''}.` },
      bounds: () => L.latLngBounds(rows.flatMap(r => [[r.olat, r.olon], [r.dlat, r.dlon]])),
      fc: () => ({ type: 'FeatureCollection', features: rows.map(r => ({ type: 'Feature', properties: { label: r.label, value: r.value, start: r.start, end: r.end }, geometry: { type: 'LineString', coordinates: [[r.olon, r.olat], [r.dlon, r.dlat]] } })) }),
      onVisibility: on => { if (on) { handles.forEach(h => h.hnd.hide()); apply(); } }, onRemove: () => { unsub?.(); handles.forEach(h => h.hnd.remove()); } });
    reg.setVisible(id, true); return d;
  }
  const flowSec = sec('Flow map (animated arrows)', false,
    el('p', { class: 'muted hint' }, 'From a CSV with columns ', el('code', {}, 'origin_lat, origin_lon, dest_lat, dest_lon, value, label, start, end'), ' (start / end in years, optional).'),
    flowTxt, el('div', { class: 'row' }, flowFile, el('button', { class: 'btn btn-sm', onclick: () => { flowTxt.value = FLOW_SAMPLE; flowTie.checked = true; } }, 'Use sample (VOC-era trade)')),
    el('label', { class: 'check' }, flowTie, 'Tie to the timeline (needs start / end)'),
    el('button', { class: 'btn btn-primary', onclick: () => busy(flowOut, async () => {
      const csv = parseCSV(flowTxt.value || ''); if (!csv.rows.length) throw new Error('Paste or choose a CSV first.');
      const H = Object.fromEntries(csv.headers.map(h => [h.toLowerCase(), h]));
      const need = ['origin_lat', 'origin_lon', 'dest_lat', 'dest_lon']; const miss = need.filter(k => !H[k]); if (miss.length) throw new Error('Missing columns: ' + miss.join(', '));
      const rows = csv.rows.map(r => ({ olat: toNum(r[H.origin_lat]), olon: toNum(r[H.origin_lon]), dlat: toNum(r[H.dest_lat]), dlon: toNum(r[H.dest_lon]), value: toNum(r[H.value]), label: r[H.label] || '', start: toNum(r[H.start]), end: toNum(r[H.end]) })).filter(r => [r.olat, r.olon, r.dlat, r.dlon].every(v => v != null));
      if (!rows.length) throw new Error('No valid rows (check the coordinate columns).');
      const d = buildFlows(rows, `${rows.length} flows`, flowTie.checked && rows.some(r => r.start != null));
      flowOut.className = 'an-out ok'; flowOut.replaceChildren(`${rows.length} flows added. `, el('button', { class: 'btn btn-sm', onclick: () => reg.zoomTo(d.id) }, 'Zoom to flows'));
    }) }, 'Create flow map'),
    el('hr', { class: 'sep' }),
    el('p', { class: 'muted hint' }, 'Or link two point layers with a table of ', el('code', {}, 'origin, dest, value'), ' names:'),
    flA.field, flB.field, flLink,
    el('button', { class: 'btn', onclick: () => busy(flowOut, async () => {
      const A = resolve(flA.sel.value), B = resolve(flB.sel.value); if (!A || !B) throw new Error('Choose layers A and B.');
      const index = r => new Map(ptsOf(r.fc).map(f => [String(nameOf(f)).toLowerCase(), f.geometry.coordinates]));
      const ia = index(A), ib = index(B), csv = parseCSV(flowLink.value || ''); if (!csv.rows.length) throw new Error('Paste the link table first.');
      const H = Object.fromEntries(csv.headers.map(h => [h.toLowerCase(), h])); if (!H.origin || !H.dest) throw new Error('The table needs origin and dest columns.');
      const rows = [], miss = [];
      csv.rows.forEach(r => { const a = ia.get(String(r[H.origin]).toLowerCase()), b = ib.get(String(r[H.dest]).toLowerCase()); if (!a || !b) { miss.push(`${r[H.origin]}→${r[H.dest]}`); return; } rows.push({ olon: a[0], olat: a[1], dlon: b[0], dlat: b[1], value: toNum(r[H.value]), label: r[H.label] || `${r[H.origin]} → ${r[H.dest]}`, start: toNum(r[H.start]), end: toNum(r[H.end]) }); });
      if (!rows.length) throw new Error('No origin/dest names matched a feature name in the layers.');
      buildFlows(rows, `${A.name} → ${B.name}`, rows.some(r => r.start != null));
      flowOut.className = 'an-out ok'; flowOut.textContent = `${rows.length} flows added.` + (miss.length ? ` Unmatched: ${miss.slice(0, 5).join(', ')}` : '');
    }) }, 'Create from layers + table'), flowOut);

  const printSec = sec('Export', false,
    el('p', { class: 'muted hint' }, 'Any vector layer exports to GeoJSON or CSV from its row in the Layers panel. To save the map as an image or PDF, use the browser print dialog (Save as PDF): the print view hides the panels and keeps the map, legend and credits.'),
    el('button', { class: 'btn', onclick: () => { document.body.classList.add('printing'); setTimeout(() => { window.print(); setTimeout(() => document.body.classList.remove('printing'), 400); }, 120); } }, 'Print / save map as PDF'));

  // ----- panel shell
  const head = el('div', { class: 'layers-head' }, el('div', { class: 'layers-toggle static' }, el('span', {}, 'Analyse')), el('button', { class: 'btn btn-icon btn-sm', 'aria-label': 'Close analysis panel', onclick: () => api.close() }, '✕'));
  root.replaceChildren(head, el('div', { class: 'layers-body an' }, drawSec, bufSec, pipSec, isSec, nnSec, heatSec, flowSec, printSec));
  renderShapes();

  const api = {
    open() { root.hidden = false; document.body.classList.add('analyse-open'); },
    close() { root.hidden = true; setMode(null); document.body.classList.remove('analyse-open'); },
    toggle() { root.hidden ? api.open() : api.close(); },
    isOpen: () => !root.hidden, shapes, buildFlows, FLOW_SAMPLE
  };
  return api;
}
