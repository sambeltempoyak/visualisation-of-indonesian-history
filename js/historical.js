// historical.js — the "Historical" layers on the Leaflet map: event badges (clustered), animated routes,
// people banners and the hand-placed sea/land names. All of them follow the timeline window, theme filters,
// cumulative mode and the current selection (state), and are registered in the layer registry.
import { clamp, formatRange, formatYear, PAL, textGlyph, reducedMotion, esc, unwrapLon } from './util.js';
import { createRouteSet, routeSub } from './routes.js';

// ---------- place names (kind: sea | land ; z:[min,max] Leaflet zoom range ; s: base size px ; r: rotation) ----------
// zoom values converted from the v1 hex-map zoom factor k via z = 3.6 + log2(k)
const kz = k => 3.6 + Math.log2(k);
const NAMES = [
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

const geomPoint = (lon, lat, props) => ({ type: 'Feature', properties: props, geometry: { type: 'Point', coordinates: [lon, lat] } });

export function createHistorical({ D, map, reg, state, tip, onSelect }) {
  const lmap = map.map;
  const out = {};
  let pending = 0;

  // =====================================================  PLACE NAMES
  const namesGroup = L.layerGroup();
  const names = NAMES.map(([t, lon, lat, kind, kr, size, rot = 0]) => {
    const m = L.marker([lat, lon], { pane: 'p-place-names', interactive: false, keyboard: false, icon: L.divIcon({ className: 'pn-wrap', iconSize: [0, 0], html: `<span class="pn ${kind}" style="--rot:${rot}deg">${esc(t)}</span>` }) });
    return { m, kind, z: [kz(kr[0]), kz(kr[1])], size };
  });
  function layoutNames() {
    if (!lmap.hasLayer(namesGroup)) return;
    const z = lmap.getZoom(), sc = clamp(0.78 + 0.26 * (z - 3.6), 0.78, 2.1);
    for (const n of names) {
      const on = z >= n.z[0] && z <= n.z[1];
      if (on && !namesGroup.hasLayer(n.m)) namesGroup.addLayer(n.m); else if (!on && namesGroup.hasLayer(n.m)) namesGroup.removeLayer(n.m);
      const e = n.m.getElement(); if (on && e) e.firstChild.style.fontSize = (n.size * (n.size >= 20 ? clamp(sc, 0.8, 1.5) : sc)).toFixed(1) + 'px';
    }
  }
  lmap.on('zoomend', layoutNames); namesGroup.on('add', layoutNames);
  reg.register({
    id: 'place-names', name: 'Place names', group: 'Reference', layer: namesGroup, visible: true, geom: 'point', pane: 'p-place-names',
    swatch: { type: 'text', color: '#49546D' },
    info: { source: 'Hand-placed names of seas, islands and straits', note: 'Shown on the palette basemaps, which carry no labels of their own.' },
    fc: () => ({ type: 'FeatureCollection', features: NAMES.map(([t, lon, lat, kind]) => geomPoint(lon, lat, { name: t, kind })) })
  });

  // =====================================================  EVENTS (clustered divIcons)
  const evState = new Map();            // id → {sel, hl}
  const forced = new Set();             // always-visible ids (story chapters)
  const badgeIcon = e => {
    const th = D.themeById.get(e.theme), s = evState.get(e.id) || {};
    return L.divIcon({ className: 'vb-wrap', iconSize: [40, 44], iconAnchor: [20, 22],
      html: `<div class="vb${s.sel ? ' sel' : ''}${s.hl ? ' hl' : ''}" style="--c:${th?.color || PAL.water}"><i class="vb-o"></i><i class="vb-i"></i><b class="vb-g">${esc(textGlyph(th?.glyph))}</b><u class="vb-pulse"></u></div>` });
  };
  const cluster = L.markerClusterGroup({
    pane: 'p-events', clusterPane: 'p-events', maxClusterRadius: 48, showCoverageOnHover: false, zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true, disableClusteringAtZoom: 9, removeOutsideVisibleBounds: true, animate: !reducedMotion(), chunkedLoading: true,
    iconCreateFunction: c => { const n = c.getChildCount(); return L.divIcon({ className: 'vc-wrap', iconSize: [44, 44], html: `<div class="vc"><b>${n}</b></div>` }); }
  });
  const evMarkers = D.events.map(e => {
    const m = L.marker([e.lat, e.lon], { pane: 'p-events', icon: badgeIcon(e), keyboard: true, title: e.title, alt: e.title, riseOnHover: true });
    m.on('mouseover', ev => tip.show(`<b>${esc(e.title)}</b><br><span>${esc(formatRange(e.start, e.end))} · ${esc(e.place || '')}</span>`, ev.originalEvent));
    m.on('mousemove', ev => tip.move(ev.originalEvent)); m.on('mouseout', () => tip.hide());
    m.on('click', ev => { L.DomEvent.stopPropagation(ev); tip.hide(); onSelect('event', e.id); });
    m.on('keypress', ev => { if (ev.originalEvent.key === 'Enter') onSelect('event', e.id); });
    return { e, m, on: false };
  });
  const evById = new Map(evMarkers.map(x => [x.e.id, x]));
  reg.register({
    id: 'events', name: 'Events', group: 'Historical', layer: cluster, visible: true, geom: 'point', pane: 'p-events', badge: 'themes',
    swatch: { type: 'hex', color: '#CCD6E6' }, count: D.events.length,
    info: { source: 'Curated event cards (data/events.json)', note: 'Each badge opens a card with summary, debate, peoples and sources. Badges follow the timeline and the theme filters.' },
    bounds: () => L.latLngBounds(D.events.map(e => [e.lat, e.lon])),
    fc: () => ({ type: 'FeatureCollection', features: D.events.map(e => geomPoint(e.lon, e.lat, { id: e.id, name: e.title, start: e.start, end: e.end, theme: e.theme, era: e.era, place: e.place, certainty: e.certainty })) })
  });

  const timeVisible = (a, b, st) => st.cumulative ? a <= st.window[1] : (a <= st.window[1] && b >= st.window[0]);
  const eventVisible = (e, st) => {
    if (forced.has(e.id)) return true;
    if (st.selection?.type === 'event' && st.selection.id === e.id) return true;
    return st.themesOn.has(e.theme) && timeVisible(e.start, e.end ?? e.start, st);
  };

  // =====================================================  PEOPLES (banner pills)
  const mctx = document.createElement('canvas').getContext('2d');
  mctx.font = '500 12px Inter, system-ui, sans-serif';
  const peopleGroup = L.layerGroup();
  const banners = D.peoples.map(p => {
    const w = Math.ceil(mctx.measureText(p.name).width + 34);
    const m = L.marker([p.lat, p.lon], { pane: 'p-peoples', keyboard: true, title: p.name, alt: p.name, icon: L.divIcon({ className: 'vp-wrap', iconSize: [w, 32], iconAnchor: [w / 2, 31], html: `<div class="vp" style="width:${w}px"><span class="vp-h"></span><span class="vp-t">${esc(p.name)}</span><i class="vp-pin"></i></div>` }) });
    m.on('click', ev => { L.DomEvent.stopPropagation(ev); onSelect('people', p.id); });
    m.on('keypress', ev => { if (ev.originalEvent.key === 'Enter') onSelect('people', p.id); });
    m.on('mouseover', ev => tip.show(`<b>${esc(p.name)}</b><br><span>${esc(p.family || '')}</span>`, ev.originalEvent));
    m.on('mousemove', ev => tip.move(ev.originalEvent)); m.on('mouseout', () => tip.hide());
    peopleGroup.addLayer(m);
    return { p, m, w, hl: false };
  });
  function cullBanners() {
    if (!lmap.hasLayer(peopleGroup)) return;
    const z = lmap.getZoom(), sel = state.get().selection, rects = [], size = lmap.getSize();
    for (const b of banners) {
      const el = b.m.getElement(); if (!el) continue;
      const pt = lmap.latLngToContainerPoint(b.m.getLatLng());
      let show = !(z < 4.1 && b.p._rank >= 14);
      if (show && (pt.x < -100 || pt.y < -60 || pt.x > size.x + 100 || pt.y > size.y + 80)) show = false;
      if (show) {
        const r = { x0: pt.x - b.w / 2, x1: pt.x + b.w / 2, y0: pt.y - 31, y1: pt.y + 2 };
        const important = (sel?.type === 'people' && sel.id === b.p.id) || b.hl;
        if (!important && rects.some(q => r.x0 < q.x1 + 4 && r.x1 > q.x0 - 4 && r.y0 < q.y1 + 2 && r.y1 > q.y0 - 2)) show = false; else rects.push(r);
      }
      el.classList.toggle('culled', !show);
    }
  }
  lmap.on('zoomend moveend', cullBanners); peopleGroup.on('add', () => setTimeout(cullBanners, 0));
  reg.register({
    id: 'peoples', name: 'Peoples', group: 'Historical', layer: peopleGroup, visible: true, geom: 'point', pane: 'p-peoples', count: D.peoples.length,
    swatch: { type: 'pill', color: '#49546D' },
    info: { source: 'Curated people cards (data/peoples.json)', note: 'Banners mark the homelands of indigenous and ethnolinguistic groups.' },
    fc: () => ({ type: 'FeatureCollection', features: D.peoples.map(p => geomPoint(p.lon, p.lat, { id: p.id, name: p.name, autonym: p.autonym, family: p.family, region: p.region, glottocode: p.glottocode })) })
  });

  // =====================================================  ROUTES
  const routeSet = createRouteSet({ map: lmap, pane: 'p-routes', tip });
  const rh = new Map();
  D.routes.forEach(r => {
    rh.set(r.id, routeSet.add({ id: r.id, path: r.path, kind: r.kind, width: clamp(r.width || 2, 1, 4) + 0.5, title: r.title, sub: routeSub(r),
      onClick: () => onSelect('route', r.id) }));
  });
  reg.register({
    id: 'routes', name: 'Routes', group: 'Historical', layer: routeSet.group, visible: true, geom: 'line', pane: 'p-routes', count: D.routes.length,
    swatch: { type: 'arrow', color: '#49546D' }, legend: () => Object.entries({ migration: 'Migration', trade: 'Trade', religion: 'Religion / pilgrimage (dashed)', colonial: 'Colonial', slave: 'Slave trade', labour: 'Labour', resource: 'Resources', state: 'State (dashed)' }).map(([k, label]) => ({ color: ({ religion: '#33393B' })[k] || routeColour(k), label })),
    info: { source: 'Curated routes (data/routes.json)', note: 'Animated arrows: drawn when their period enters the timeline window. Click one for its card.' },
    onVisibility: on => { if (on) { rh.forEach(h => h.hide()); applyState(); } },
    bounds: () => L.latLngBounds(D.routes.flatMap(r => r.path.map(([lo, la]) => [la, lo]))),
    fc: () => ({ type: 'FeatureCollection', features: D.routes.map(r => ({ type: 'Feature', properties: { id: r.id, name: r.title, kind: r.kind, start: r.start, end: r.end }, geometry: { type: 'LineString', coordinates: r.path } })) })
  });
  const routeColour = k => ({ migration: '#49546D', trade: '#6E4540', colonial: '#5B6264', slave: '#9A4A42', labour: '#6B5F52', resource: '#51445A', state: '#49546D' })[k] || '#49546D';

  // =====================================================  state → visibility / highlighting
  function applyState() {
    pending = 0;
    const st = state.get(), evOn = reg.isVisible('events'), rtOn = reg.isVisible('routes'), pplOn = reg.isVisible('peoples');
    // ----- events: diff against what is in the cluster
    const toAdd = [], toRemove = [];
    for (const x of evMarkers) { const v = evOn && eventVisible(x.e, st); if (v && !x.on) { x.on = true; toAdd.push(x.m); } else if (!v && x.on) { x.on = false; toRemove.push(x.m); } }
    if (toRemove.length) cluster.removeLayers(toRemove);
    if (toAdd.length) cluster.addLayers(toAdd);
    // ----- selection sets
    const sel = st.selection;
    const evSel = sel?.type === 'event' ? D.eventById.get(sel.id) : null;
    const selRoutes = new Set(evSel ? (D.routesOfEvent.get(evSel.id) || []).map(r => r.id) : sel?.type === 'route' ? [sel.id] : []);
    if (sel?.route) selRoutes.add(sel.route);
    const selPeoples = new Set(evSel ? (evSel.peoples || []) : sel?.type === 'people' ? [sel.id] : []);
    const selEvents = new Set(sel?.type === 'event' ? [sel.id] : sel?.type === 'people' ? (D.eventsOfPeople.get(sel.id) || []).map(e => e.id) : []);
    for (const x of evMarkers) {
      const s = { sel: sel?.type === 'event' && sel.id === x.e.id, hl: (selEvents.has(x.e.id) && sel?.type !== 'event') || forced.has(x.e.id) };
      const o = evState.get(x.e.id) || {};
      if (o.sel !== s.sel || o.hl !== s.hl) { evState.set(x.e.id, s); x.m.setIcon(badgeIcon(x.e)); }
    }
    // ----- routes
    for (const r of D.routes) {
      const h = rh.get(r.id), ev = r.event && D.eventById.get(r.event);
      let v = rtOn && timeVisible(r.start, r.end ?? r.start, st) && (!ev || st.themesOn.has(ev.theme));
      if (sel?.type === 'route' && sel.id === r.id || sel?.route === r.id) v = rtOn || v;
      if (evSel && selRoutes.has(r.id)) v = rtOn;
      v ? h.show() : h.hide();
      h.setFaded(!!(v && st.cumulative && r.end != null && r.end < st.window[1]));
      h.setClass('sel', selRoutes.has(r.id)); h.setClass('dim', !!sel && sel.type !== 'people' && !selRoutes.has(r.id));
    }
    for (const b of banners) { b.hl = selPeoples.has(b.p.id); b.m.getElement()?.classList.toggle('sel', b.hl); }
    cullBanners();
  }
  const schedule = () => { if (!pending) pending = requestAnimationFrame(applyState); };
  state.on((s, p) => { if (s.window !== p.window || s.cumulative !== p.cumulative || s.themesOn !== p.themesOn || s.selection !== p.selection) schedule(); });
  reg.on(t => { if (t === 'visibility') schedule(); });
  schedule();

  Object.assign(out, {
    applyState: schedule,
    /** Event ids that stay visible and highlighted regardless of the timeline (story chapters). */
    setForced(ids) { forced.clear(); (ids || []).forEach(i => forced.add(i)); schedule(); },
    eventLatLng: e => [e.lat, e.lon],
    /** lat/lon points framing an event: its location + its routes' paths */
    eventPoints(e) { const pts = [[e.lat, e.lon]]; (D.routesOfEvent.get(e.id) || []).forEach(r => r.path.forEach(([lo, la]) => pts.push([la, lo]))); return pts; },
    routePoints: id => { const r = D.routeById.get(id); return r ? r.path.map(([lo, la]) => [la, lo]) : []; },
    zoomToEventMarker(id) { const x = evById.get(id); if (x && x.on) cluster.zoomToShowLayer(x.m); },
    eventMarker: id => evById.get(id)?.m
  });
  return out;
}
