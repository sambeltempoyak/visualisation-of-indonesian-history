// core/basemaps.js — light basemaps for the Stories and Peoples pages (Leaflet only, no plugins).
// Tiles are pushed through SVG gradient-map filters so every basemap speaks palette A (Ejak / Lushpin).
import { mixHex } from './util.js';

const ESRI = 'Tiles © <a href="https://www.esri.com/" target="_blank" rel="noopener">Esri</a> — Esri, Maxar, Earthstar Geographics, USGS, GEBCO and the GIS User Community';
const BIG = 'Boundaries © <a href="https://geoservices.big.go.id/" target="_blank" rel="noopener">Badan Informasi Geospasial</a> (generalised)';

export const BASEMAPS = {
  // shaded relief + ocean: land as warm paper, sea as Ancient Water → the "map table" look for stories
  relief: { name: 'Relief', dark: false, layers: [
    { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', filter: 'mist', maxNativeZoom: 13 },
    { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', filter: 'relief', maxNativeZoom: 13, opacity: .55, blend: 'multiply' }] },
  // satellite under a dusk wash — the cinematic look of animated history maps
  imagery: { name: 'Imagery', dark: true, layers: [
    { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', filter: 'dimmed', maxNativeZoom: 18 }] },
  // night map for the darker stories (slavery, violence)
  dusk: { name: 'Dusk', dark: true, layers: [
    { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', filter: 'dusk', maxNativeZoom: 13 },
    { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', filter: 'duskRelief', maxNativeZoom: 13, opacity: .35, blend: 'screen' }] },
  // plain light canvas for the Peoples page (areas carry the colour)
  paper: { name: 'Paper', dark: false, layers: [
    { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', filter: 'mist', maxNativeZoom: 16 }] }
};

// luminance → colour stops
const STOPS = {
  mist: [[0, '#49546D'], [.5, '#8C93A8'], [.72, '#B9C6DB'], [.8, '#CCD6E6'], [.9, '#E4E6EA'], [.95, '#EEDED1'], [1, '#F6F4EF']],
  relief: [[0, '#33393B'], [.5, '#8C8A86'], [.8, '#D9D2C8'], [1, '#F6F4EF']],
  dimmed: [[0, '#1E2426'], [.25, '#33393B'], [.55, '#5A6684'], [.8, '#B2ABB4'], [1, '#EEDED1']],
  dusk: [[0, '#262B2D'], [.4, '#33393B'], [.7, '#3D4659'], [.85, '#49546D'], [1, '#5A6684']],
  duskRelief: [[0, '#000000'], [.6, '#3A4150'], [1, '#8C93A8']]
};

let filtersInstalled = false;
export function installFilters() {
  if (filtersInstalled) return; filtersInstalled = true;
  let defs = document.getElementById('svgDefs');
  if (!defs) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', 0); svg.setAttribute('height', 0); svg.style.position = 'absolute'; svg.setAttribute('aria-hidden', 'true');
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'); defs.id = 'svgDefs'; svg.append(defs); document.body.append(svg);
  }
  for (const [id, stops] of Object.entries(STOPS)) {
    const N = 48, ch = [[], [], []];
    for (let i = 0; i < N; i++) {
      const l = i / (N - 1); let a = stops[0], b = stops[stops.length - 1];
      for (let j = 0; j < stops.length - 1; j++) if (l >= stops[j][0] && l <= stops[j + 1][0]) { a = stops[j]; b = stops[j + 1]; break; }
      const t = b[0] === a[0] ? 0 : (l - a[0]) / (b[0] - a[0]), c = mixHex(a[1], b[1], t).match(/\d+/g).map(Number);
      c.forEach((v, k) => ch[k].push((v / 255).toFixed(4)));
    }
    defs.insertAdjacentHTML('beforeend', `<filter id="vb-${id}" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%"><feColorMatrix type="matrix" values=".2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues="${ch[0].join(' ')}"/><feFuncG type="table" tableValues="${ch[1].join(' ')}"/><feFuncB type="table" tableValues="${ch[2].join(' ')}"/></feComponentTransfer></filter>`);
  }
}

/** Put basemap `id` on `map`; returns {remove, dark}. One pane per tile layer so each gets its own CSS filter. */
export function setBasemap(map, id, prev) {
  installFilters();
  prev?.remove();
  const b = BASEMAPS[id] || BASEMAPS.relief, made = [];
  b.layers.forEach((t, i) => {
    const pane = `base${i}`; const p = map.getPane(pane) || map.createPane(pane);
    p.style.zIndex = 150 + i; p.style.filter = `url(#vb-${t.filter})`; p.style.mixBlendMode = t.blend || 'normal'; p.style.pointerEvents = 'none';
    made.push(L.tileLayer(t.url, { pane, maxNativeZoom: t.maxNativeZoom, maxZoom: 18, opacity: t.opacity ?? 1, crossOrigin: true, keepBuffer: 2, updateWhenIdle: true, attribution: i === 0 ? ESRI : '' }).addTo(map));
  });
  map.getContainer().classList.toggle('base-dark', !!b.dark);
  map.getContainer().dataset.basemap = id;
  return { id, dark: !!b.dark, remove: () => made.forEach(l => map.removeLayer(l)) };
}

export const BIG_ATTR = BIG;
