// peoples/main.js — Indonesian peoples: approximate homeland areas drawn on a canvas map. Loads Leaflet, topojson-client,
// data/peoples/* and (optionally, zoomed in) desa borders of the provinces in view. Nothing else.
import { setBasemap } from '../core/basemaps.js';
import { loadTopo } from '../core/geo.js';
import { ISLANDS, methodWords, precisionWords, tint } from './words.js';
import { createLabels } from './labels.js';
import { createDesa } from './desa.js';

const $ = s => document.querySelector(s);
const h = (tag, attrs = {}, ...kids) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) { if (v == null || v === false) continue; if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (k === 'class') e.className = v; else e.setAttribute(k, v); } kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : document.createTextNode(c))); return e; };
const ISL_TINT = Object.fromEntries(ISLANDS.map(i => [i, tint(i, 'x')]));

async function boot() {
  const map = L.map('map', { zoomControl: false, minZoom: 4, maxZoom: 14, zoomSnap: .5, preferCanvas: true, worldCopyJump: false }).setView([-2.6, 118.5], window.innerWidth < 760 ? 4.5 : 5);
  L.control.zoom({ position: 'topright' }).addTo(map);
  setBasemap(map, 'paper');
  map.createPane('areas').style.zIndex = 300; map.createPane('desa').style.zIndex = 330;
  const [fc, meta, sources] = await Promise.all([loadTopo('data/peoples/ethnic-areas.topo.json'), fetch('data/peoples/ethnic-areas.meta.json').then(r => r.json()), fetch('data/sources.json').then(r => r.ok ? r.json() : []).catch(() => [])]);
  const A = meta.areas, srcById = new Map(sources.map(s => [s.id, s]));
  $('#methodText').textContent = meta.method;

  let activeIsland = null, selected = null;
  const renderer = L.canvas({ pane: 'areas', padding: .3 });
  const layers = new Map();
  const styleOf = id => {
    const a = A[id] || {}, dim = activeIsland && a.island !== activeIsland, sel = selected === id;
    return { renderer, pane: 'areas', fillColor: tint(a.island, id), fillOpacity: sel ? .88 : dim ? .1 : .68, color: sel ? '#33393B' : '#49546D', weight: sel ? 3 : .5, opacity: dim ? .25 : sel ? 1 : .8, interactive: !dim };
  };
  const geo = L.geoJSON(fc, { pane: 'areas', renderer, style: f => styleOf(f.properties.g), onEachFeature: (f, l) => {
    const id = f.properties.g, a = A[id] || {}; layers.set(id, l);
    l.bindTooltip(`${a.name || id}<small>${a.island || ''}</small>`, { sticky: true, className: 'pl-tip', direction: 'top', opacity: 1 });
    l.on('mouseover', () => { if (selected !== id) { l.setStyle({ weight: 2, fillOpacity: .8, color: '#33393B' }); l.bringToFront(); } });
    l.on('mouseout', () => l.setStyle(styleOf(id)));
    l.on('click', e => { L.DomEvent.stopPropagation(e); select(id, { fly: false }); });
  } }).addTo(map);
  const restyle = () => layers.forEach((l, id) => l.setStyle(styleOf(id)));
  map.on('click', () => select(null));
  const home = () => window.innerWidth < 760 ? map.setView([-2.6, 118.5], 4.5) : map.fitBounds([[-11.5, 94.5], [6.2, 141.2]], { paddingTopLeft: [400, 70], paddingBottomRight: [50, 20] });
  home();

  // ---- polygon facts: label points and areas, per group
  const info = new Map();
  fc.features.forEach(f => {
    const id = f.properties.g, polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    let best = null, total = 0;
    polys.forEach(p => { const r = p[0], ar = ringArea(r); total += ar; if (!best || ar > best.ar) best = { ar, r }; });
    const km2 = polys.reduce((s, p) => s + ringArea(p[0], true), 0);
    info.set(id, { pt: labelPoint(best.r), area: total, km2, n: polys.length });
  });
  const labels = createLabels({ map, A, info, isActive: id => !activeIsland || A[id]?.island === activeIsland, selectedId: () => selected, ISLANDS });

  // ---- selection
  const card = $('#card');
  function select(id, { fly = true } = {}) {
    selected = id; restyle(); labels.refresh();
    if (!id) { card.hidden = true; history.replaceState(null, '', location.pathname); return; }
    const l = layers.get(id); l?.bringToFront();
    if (fly && l) map.flyToBounds(l.getBounds(), { padding: [60, 60], maxZoom: 9, duration: .9 });
    paintCard(id); history.replaceState(null, '', '#g=' + encodeURIComponent(id));
    if (window.innerWidth < 760) $('#panel').classList.remove('closed');
  }
  const srcLine = id => { const s = srcById.get(id); if (!s) return h('li', {}, id); const au = (s.authors || '').split(';')[0].split(',')[0]; return h('li', {}, s.url ? h('a', { href: s.url, target: '_blank', rel: 'noopener' }, `${au}${s.authors?.includes(';') ? ' et al.' : ''} (${s.year})`) : `${au} (${s.year})`, ` — ${s.title}`); };
  function paintCard(id) {
    const a = A[id], i = info.get(id), srcIds = [a.source === 'glottolog' ? 'glottolog' : 'ananta2014'];
    if (a.glottocode && !srcIds.includes('glottolog')) srcIds.push('glottolog'); srcIds.push('big-batas-wilayah');
    const row = (k, v) => v ? [h('dt', {}, k), h('dd', {}, v)] : [];
    card.replaceChildren(...[
      h('h3', {}, a.name), a.aliases?.length ? h('p', { class: 'al' }, 'Also: ' + a.aliases.join(', ')) : null,
      h('dl', {}, ...row('Island', a.island), ...row('Homeland', a.place), ...row('Precision', precisionWords(a.precision)), ...row('Method', methodWords(a.method)),
        ...row('Area', i ? `${i.n} polygon${i.n > 1 ? 's' : ''}, about ${Math.round(i.km2 / 100) * 100 || Math.round(i.km2)} km² (approximate)` : '')),
      a.method === 'glottolog-language' && a.note ? h('p', { class: 'note' }, a.note) : (a.note ? h('p', { class: 'note' }, a.note) : null),
      h('div', { class: 'links' }, h('a', { class: 'b', href: 'analyse.html' }, 'Show in Analyse'), a.glottocode ? h('a', { class: 'b ghost', href: `https://glottolog.org/resource/languoid/id/${a.glottocode}`, target: '_blank', rel: 'noopener' }, 'Glottolog') : null),
      h('ul', { class: 'srcs' }, srcIds.map(srcLine))].filter(Boolean));
    card.hidden = false; card.scrollIntoView?.({ block: 'nearest' });
  }

  // ---- search
  const q = $('#q'), res = $('#results'), idx = Object.entries(A).map(([id, a]) => ({ id, a, hay: [a.name, ...(a.aliases || []), a.place || ''].join(' ').toLowerCase() }));
  let hits = [], cur = -1;
  const paintHits = () => [...res.children].forEach((c, i) => c.classList.toggle('on', i === cur));
  q.addEventListener('input', () => {
    const t = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean); if (!t.length) { res.hidden = true; return; }
    hits = idx.filter(x => t.every(w => x.hay.includes(w))).sort((x, y) => (y.a.name.toLowerCase().startsWith(t[0]) - x.a.name.toLowerCase().startsWith(t[0]))).slice(0, 8); cur = -1;
    res.replaceChildren(...(hits.length ? hits.map((x, i) => h('button', { type: 'button', onclick: () => pick(i) }, x.a.name, h('small', {}, [x.a.island, x.a.place].filter(Boolean).join(' · ')))) : [h('button', { type: 'button', disabled: true }, 'No matching mapped group')]));
    res.hidden = false;
  });
  const pick = i => { const x = hits[i]; if (!x) return; res.hidden = true; q.value = x.a.name; q.blur(); select(x.id); };
  q.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { cur = Math.min(hits.length - 1, cur + 1); paintHits(); e.preventDefault(); } else if (e.key === 'ArrowUp') { cur = Math.max(0, cur - 1); paintHits(); e.preventDefault(); } else if (e.key === 'Enter') pick(cur >= 0 ? cur : 0); else if (e.key === 'Escape') res.hidden = true; });
  document.addEventListener('pointerdown', e => { if (!e.target.closest('.search')) res.hidden = true; });

  // ---- island chips + unmapped list
  const chips = $('#islands'), unm = $('#unmappedBody');
  const paintUnmapped = () => {
    unm.replaceChildren(...Object.entries(meta.unmapped).filter(([isl]) => !activeIsland || isl === activeIsland).map(([isl, list]) => h('div', {}, h('h4', {}, `${isl} (${list.length})`), h('p', {}, list.map(x => x.name).join(', ') + '.'))));
    if (!unm.children.length) unm.append(h('p', {}, 'Every group on this island group has an area.'));
  };
  const setIsland = isl => { activeIsland = activeIsland === isl ? null : isl; chips.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.i === activeIsland))); restyle(); labels.refresh(); paintUnmapped(); if (activeIsland) { const b = L.latLngBounds([]); layers.forEach((l, id) => A[id].island === activeIsland && b.extend(l.getBounds())); if (b.isValid()) map.flyToBounds(b, { padding: [40, 40], duration: .9 }); } };
  ISLANDS.forEach(i => chips.append(h('button', { type: 'button', 'data-i': i, 'aria-pressed': 'false', onclick: () => setIsland(i) }, h('i', { style: `background:${ISL_TINT[i]}` }), i)));
  paintUnmapped();

  // ---- panel collapse
  const panel = $('#panel'), col = $('#collapse');
  col.addEventListener('click', () => { const c = panel.classList.toggle('closed'); col.setAttribute('aria-expanded', String(!c)); });
  if (window.innerWidth < 760) { panel.classList.add('closed'); col.setAttribute('aria-expanded', 'false'); }

  // ---- desa borders
  const desa = createDesa({ map, pane: 'desa', max: 3, onStatus: t => { $('#desaNote').textContent = t; } });
  $('#desaOn').addEventListener('change', e => e.target.checked ? desa.on() : desa.off());

  const m = /^#g=(.+)/.exec(location.hash); if (m && A[decodeURIComponent(m[1])]) select(decodeURIComponent(m[1]));
  window.peoples = { map, select, layers, A, setIsland, desa };
  document.body.classList.add('ready');
}

// ---- geometry helpers (lon/lat rings)
function ringArea(r, km = false) { let s = 0; for (let i = 0, n = r.length - 1; i < n; i++) s += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]; s = Math.abs(s) / 2; if (!km) return s; const lat = r.reduce((a, c) => a + c[1], 0) / r.length; return s * 111.32 * 111.32 * Math.cos(lat * Math.PI / 180); }
function inRing(p, r) { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) if ((r[i][1] > p[1]) !== (r[j][1] > p[1]) && p[0] < (r[j][0] - r[i][0]) * (p[1] - r[i][1]) / (r[j][1] - r[i][1]) + r[i][0]) c = !c; return c; }
function labelPoint(r) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0, n = r.length - 1; i < n; i++) { const f = r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]; a += f; cx += (r[i][0] + r[i + 1][0]) * f; cy += (r[i][1] + r[i + 1][1]) * f; }
  const c = a ? [cx / (3 * a), cy / (3 * a)] : r[0];
  if (inRing(c, r)) return [c[1], c[0]];
  // fall back: scan a horizontal line through the centroid latitude and take the middle of the longest inside run
  const xs = []; for (let i = 0, j = r.length - 1; i < r.length; j = i++) if ((r[i][1] > c[1]) !== (r[j][1] > c[1])) xs.push(r[i][0] + (c[1] - r[i][1]) * (r[j][0] - r[i][0]) / (r[j][1] - r[i][1]));
  xs.sort((x, y) => x - y); let best = [0, -1]; for (let i = 0; i + 1 < xs.length; i += 2) if (xs[i + 1] - xs[i] > best[1] - best[0]) best = [xs[i], xs[i + 1]];
  return best[1] >= 0 ? [c[1], (best[0] + best[1]) / 2] : [r[0][1], r[0][0]];
}

boot().catch(e => { console.error('[peoples]', e); $('#methodText').textContent = 'Could not load the map data: ' + e.message; });
