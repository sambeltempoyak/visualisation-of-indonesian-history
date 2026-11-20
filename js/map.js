// map.js — the Leaflet map: panes, basemaps (+ offline vector fallback), basemap switcher, camera helpers.
//
// Basemap "Ejak (palette)": CARTO Positron (no labels) pushed through an SVG gradient-map filter (see PALETTE_STOPS)
// so that water reads Ancient Water, land reads Dew / VG Var and linework reads Blue Indigo.
// A Natural Earth vector land/sea map in the same palette always sits underneath the tiles, so the map stays
// meaningful when tiles cannot be fetched (offline, blocked, rate-limited).
import { clamp, reducedMotion, PAL, el, mixHex, hex2rgb, unwrapLon } from './util.js';

export const HOME_BOUNDS = [[-12, 92], [22, 142]];
const CARTO = 'Tiles &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>, data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';
const ESRI = 'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noopener">Esri</a> — Source: Esri, Maxar, Earthstar Geographics and the GIS User Community';
const NE_ATTR = '<a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a> (public domain)';

export const BASEMAPS = [
  { id: 'palette', name: 'Ejak (palette)', sub: 'Warm land, Ancient Water sea', url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', subdomains: 'abcd', attribution: CARTO, filter: 'palette', dark: false, maxNativeZoom: 20, swatch: ['#F6F4EF', '#CCD6E6'] },
  { id: 'dusk', name: 'Dusk', sub: 'Forest River / Blue Indigo', url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', subdomains: 'abcd', attribution: CARTO, filter: 'dusk', dark: true, maxNativeZoom: 20, swatch: ['#49546D', '#33393B'] },
  { id: 'labels', name: 'Labels', sub: 'CARTO light with place names', url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', subdomains: 'abcd', attribution: CARTO, dark: false, maxNativeZoom: 20, swatch: ['#E8E6E1', '#C9D3DA'] },
  { id: 'terrain', name: 'Terrain', sub: 'Esri shaded relief', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', attribution: ESRI, dark: false, maxNativeZoom: 13, swatch: ['#C8BFA9', '#9EA9A2'] },
  { id: 'satellite', name: 'Satellite', sub: 'Esri World Imagery', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: ESRI, dark: true, maxNativeZoom: 19, swatch: ['#3F5B3C', '#1F3A4D'] },
  { id: 'osm', name: 'OpenStreetMap', sub: 'Standard OSM tiles', url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors', dark: false, maxNativeZoom: 19, swatch: ['#F2EFE9', '#AAD3DF'] }
];

// Gradient maps: [luminance 0..1 of the source tile, target colour]. Tuned for CARTO Positron / Dark Matter:
// Positron water ≈ lum .84–.87, land ≈ .93–.98, roads/boundaries .75–.9. Edit here to retune.
export const PALETTE_STOPS = {
  palette: [[0, '#49546D'], [.55, '#6E7790'], [.78, '#B2ABB4'], [.835, '#B9C6DB'], [.865, '#CCD6E6'], [.905, '#CCD6E6'], [.93, '#EEDED1'], [.975, '#F2E8DC'], [1, '#F6F4EF']],
  dusk: [[0, '#33393B'], [.09, '#3A4150'], [.17, '#49546D'], [.3, '#5A6684'], [.6, '#8C93A8'], [1, '#CCD6E6']]
};
function installFilters() {
  const defs = document.getElementById('svgDefs');
  for (const [id, stops] of Object.entries(PALETTE_STOPS)) {
    const N = 64, ch = [[], [], []];
    for (let i = 0; i < N; i++) {
      const l = i / (N - 1); let a = stops[0], b = stops[stops.length - 1];
      for (let j = 0; j < stops.length - 1; j++) if (l >= stops[j][0] && l <= stops[j + 1][0]) { a = stops[j]; b = stops[j + 1]; break; }
      const t = b[0] === a[0] ? 0 : (l - a[0]) / (b[0] - a[0]), c = mixHex(a[1], b[1], t).match(/\d+/g).map(Number);
      c.forEach((v, k) => ch[k].push((v / 255).toFixed(4)));
    }
    defs.insertAdjacentHTML('beforeend', `<filter id="vih-f-${id}" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
      <feColorMatrix type="matrix" values=".2126 .7152 .0722 0 0  .2126 .7152 .0722 0 0  .2126 .7152 .0722 0 0  0 0 0 1 0"/>
      <feComponentTransfer><feFuncR type="table" tableValues="${ch[0].join(' ')}"/><feFuncG type="table" tableValues="${ch[1].join(' ')}"/><feFuncB type="table" tableValues="${ch[2].join(' ')}"/></feComponentTransfer></filter>`);
  }
}

export function createMap({ D, state }) {
  installFilters();
  const root = document.getElementById('map');
  const map = L.map(root, {
    zoomControl: false, attributionControl: false, worldCopyJump: false, minZoom: 2, maxZoom: 17,
    zoomSnap: 0.25, zoomDelta: 0.5, wheelPxPerZoomLevel: 110, wheelDebounceTime: 30, inertia: true, preferCanvas: false,
    center: [4, 117], zoom: 4
  });
  const api = { map, D, insets: { top: 72, right: 0, bottom: 150, left: 0 } };
  const listeners = { basemap: [] };

  // ---- panes -------------------------------------------------------------
  api.pane = (name, z) => { const p = map.getPane(name) || map.createPane(name); if (z != null) p.style.zIndex = z; return p; };
  api.pane('fallback', 150);
  map.getPane('tilePane').style.zIndex = 200;

  // ---- vector fallback basemap (Natural Earth, palette) ------------------
  const fbRenderer = L.canvas({ pane: 'fallback', padding: 0.5 });
  const countries = topojson.feature(D.countries, D.countries.objects.countries);
  const shift = (g, d) => { const f = c => Array.isArray(c[0]) ? c.map(f) : [c[0] + d, c[1]]; return { ...g, coordinates: f(g.coordinates) }; };
  const fbFeatures = { type: 'FeatureCollection', features: [...countries.features, ...countries.features.map(f => ({ ...f, geometry: shift(f.geometry, 360) }))] };
  const FB = {
    light: { sea: '#CCD6E6', land: '#EEDED1', line: '#B2ABB4' },
    dusk: { sea: '#3A4150', land: '#49546D', line: '#5A6684' },
    sat: { sea: '#1F3A4D', land: '#3F5B3C', line: '#5C7A58' }
  };
  const fbLayer = L.geoJSON(fbFeatures, { pane: 'fallback', renderer: fbRenderer, interactive: false, smoothFactor: 0.6, style: { weight: 0.8, fillOpacity: 1 } }).addTo(map);
  function paintFallback(kind) {
    const c = FB[kind] || FB.light; root.style.setProperty('--sea', c.sea);
    fbLayer.setStyle({ fillColor: c.land, color: c.line, weight: 0.8, fillOpacity: 1 });
    root.classList.toggle('base-dark', kind !== 'light');
  }

  // ---- basemap tiles -------------------------------------------------------
  let tileLayer = null, current = null, errCount = 0, okCount = 0;
  const tilePane = map.getPane('tilePane');
  const mock = new URLSearchParams(location.search).has('mocktiles');
  api.setBasemap = (id) => {
    const b = BASEMAPS.find(x => x.id === id) || BASEMAPS[0];
    if (tileLayer) map.removeLayer(tileLayer);
    errCount = 0; okCount = 0; root.classList.remove('tiles-offline');
    const opts = { subdomains: b.subdomains || 'abc', attribution: b.attribution, maxZoom: 17, maxNativeZoom: b.maxNativeZoom || 18, crossOrigin: true, detectRetina: false, updateWhenIdle: false, keepBuffer: 3, pane: 'tilePane' };
    if (mock) { tileLayer = new (window.__MockTiles(b))({ ...opts, tileSize: 256 }); }
    else tileLayer = L.tileLayer(b.url, opts);
    tileLayer.on('tileerror', () => { errCount++; if (errCount >= 3 && okCount === 0) root.classList.add('tiles-offline'); });
    tileLayer.on('tileload', () => { okCount++; root.classList.remove('tiles-offline'); });
    tileLayer.addTo(map);
    tilePane.style.filter = b.filter ? `url(#vih-f-${b.filter})` : 'none';
    paintFallback(b.filter === 'palette' || !b.dark ? 'light' : b.id === 'satellite' ? 'sat' : 'dusk');
    root.dataset.basemap = b.id;
    current = b; attrib.set(b);
    try { localStorage.setItem('vih.basemap', id); } catch (e) { /* ignore */ }
    listeners.basemap.forEach(f => f(b));
  };
  api.basemap = () => current;
  api.onBasemap = f => listeners.basemap.push(f);

  // ---- attribution (basemap + active layers) ------------------------------
  const attrib = (() => {
    const c = L.control.attribution({ position: 'bottomright', prefix: '<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>' }).addTo(map);
    return { set(b) { c._attributions = {}; c._update(); c.addAttribution(b.attribution); c.addAttribution(NE_ATTR + ' · Glottolog 5.4'); }, add: t => c.addAttribution(t) };
  })();
  api.addAttribution = t => attrib.add(t);

  // ---- controls (zoom + scale) --------------------------------------------
  L.control.zoom({ position: 'topright', zoomInTitle: 'Zoom in', zoomOutTitle: 'Zoom out' }).addTo(map);
  L.control.scale({ position: 'bottomleft', imperial: false, maxWidth: 120 }).addTo(map);

  // ---- basemap switcher (rounded chip) -------------------------------------
  const Switcher = L.Control.extend({
    options: { position: 'topright' },
    onAdd() {
      const box = el('div', { class: 'leaflet-bar vih-base' });
      const chip = el('button', { class: 'vih-base-chip', 'aria-haspopup': 'listbox', 'aria-expanded': 'false', title: 'Change basemap' });
      const list = el('div', { class: 'vih-base-list', role: 'listbox', hidden: true });
      const paint = () => {
        chip.replaceChildren(el('i', { class: 'vih-sw', style: `background:linear-gradient(135deg,${current.swatch[0]} 50%,${current.swatch[1]} 50%)` }), el('span', {}, current.name), el('b', {}, '▾'));
        list.replaceChildren(...BASEMAPS.map(b => el('button', { class: 'vih-base-opt' + (b.id === current.id ? ' on' : ''), role: 'option', 'aria-selected': b.id === current.id, onclick: () => { api.setBasemap(b.id); list.hidden = true; chip.setAttribute('aria-expanded', 'false'); } },
          el('i', { class: 'vih-sw', style: `background:linear-gradient(135deg,${b.swatch[0]} 50%,${b.swatch[1]} 50%)` }), el('span', {}, el('b', {}, b.name), el('small', {}, b.sub)))),
          el('div', { class: 'vih-base-note' }, 'If tiles cannot load (offline or blocked) the Natural Earth vector map shows instead.'));
      };
      api.onBasemap(paint);
      chip.addEventListener('click', () => { list.hidden = !list.hidden; chip.setAttribute('aria-expanded', String(!list.hidden)); });
      map.on('click', () => { list.hidden = true; chip.setAttribute('aria-expanded', 'false'); });
      box.append(chip, list);
      L.DomEvent.disableClickPropagation(box); L.DomEvent.disableScrollPropagation(box);
      this._paint = paint;
      return box;
    }
  });
  const switcher = new Switcher().addTo(map);
  // the switcher must sit above the zoom buttons
  switcher.getContainer().parentNode.prepend(switcher.getContainer());

  // ---- camera helpers -------------------------------------------------------
  const dur = s => (reducedMotion() ? 0 : s);
  /** Pixel offset between container centre and the centre of the free area (viewport minus UI insets). */
  const offset = () => L.point((api.insets.left - api.insets.right) / 2, (api.insets.top - api.insets.bottom) / 2);
  api.setInsets = i => { api.insets = { ...api.insets, ...i }; };
  api.viewFor = (bounds, { pad = 40, maxZoom = 12, minZoom = 2 } = {}) => {
    const sz = map.getSize(), ins = api.insets;
    const aw = Math.max(120, sz.x - ins.left - ins.right - 2 * pad), ah = Math.max(120, sz.y - ins.top - ins.bottom - 2 * pad);
    const b = L.latLngBounds(bounds);
    let z = clamp(map.getBoundsZoom(b, false, L.point(sz.x - aw, sz.y - ah)), minZoom, maxZoom);
    z = Math.floor(z * 4) / 4;
    return { center: b.getCenter(), zoom: z };
  };
  api.flyToView = (latlng, zoom, { duration = 1.2, animate = true } = {}) => {
    const c = map.unproject(map.project(L.latLng(latlng), zoom).subtract(offset()), zoom);
    const d = dur(duration);
    if (!animate || d === 0) map.setView(c, zoom, { animate: false });
    else map.flyTo(c, zoom, { duration: d, easeLinearity: 0.3 });
  };
  api.flyToBounds = (bounds, o = {}) => { const v = api.viewFor(bounds, o); api.flyToView(v.center, v.zoom, o); };
  api.home = (o = {}) => api.flyToBounds(HOME_BOUNDS, { pad: 10, maxZoom: 6, duration: 1, ...o });
  api.size = () => map.getSize();

  // class on <body> so CSS can move the controls when the card is open
  api.stopPlacing = () => {};

  // ---- init --------------------------------------------------------------------
  api.init = () => {
    let saved = null; try { saved = localStorage.getItem('vih.basemap'); } catch (e) { /* ignore */ }
    api.setBasemap(saved && BASEMAPS.some(b => b.id === saved) ? saved : 'palette');
    switcher._paint?.();
    const v = api.viewFor(HOME_BOUNDS, { pad: 10, maxZoom: 6 });
    const c = map.unproject(map.project(v.center, v.zoom).subtract(offset()), v.zoom);
    map.setView(c, v.zoom, { animate: false });
  };
  return api;
}
