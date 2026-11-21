// core/symbols.js — the map's visual vocabulary: place glyphs, flow styles, area roles. Palette A only (+ the
// measured "warning brown" #8A4B3C from the design rules for captivity/violence). Each style has a light-basemap and
// a dark-basemap variant so nothing is ever dark-on-dark.

// 24×24 single-path glyphs (stroke-drawn, round caps) — simple, legible at 14–18 px.
export const GLYPHS = {
  port: 'M12 3v15M8 7h8M5 13a7 7 0 0 0 14 0M5 13H3m18 0h-2',                       // anchor
  fort: 'M5 20V9l2-2 2 2 2-2 2 2 2-2 2 2v11zM10 20v-4h4v4',                            // crenellated tower
  village: 'M4 20h16M6 20v-7l6-7 6 7v7M12 6V3M10 20v-4h4v4',                            // high-roofed house (uma)
  kingdom: 'M4 18h16l-1.5-9-4 3.5L12 6l-2.5 6.5-4-3.5zM4 21h16',                       // crown
  mission: 'M12 3v18M7 8h10M8 21h8',                                                  // cross on base
  school: 'M3 9l9-5 9 5-9 5zM7 11.5V16c3 2 7 2 10 0v-4.5M21 9v6',                       // mortarboard
  raid: 'M5 19L19 5M15 5h4v4M19 19L5 5M5 9V5h4',                                       // crossed spears
  battle: 'M6 18l12-12M14 6h4v4M6 6l12 12M10 18H6v-4',                                 // crossed blades
  market: 'M12 4v16M6 8h12M6 8l-3 6h6zM18 8l-3 6h6zM8 20h8',                           // scales
  plantation: 'M12 21V9M12 13c-3 0-5-2-5-5 3 0 5 2 5 5zM12 11c3 0 5-2 5-5-3 0-5 2-5 5zM7 21h10', // sprout
  resort: 'M12 8a4 4 0 1 0 0 .01M12 2v2M12 14v2M4 10H2M22 10h-2M3 20c3-2 6-2 9 0s6 2 9 0',  // sun over water
  mine: 'M4 20l9-9M14 4c3 0 6 3 6 6-2-2-4-3-6-3M14 4c-1 1-1 2 0 3l3 3',                 // pick
  adat: 'M8 21V9l4-5 4 5v12M6 21h12M10 13h4',                                         // megalith / standing stone
  grave: 'M4 14h16M6 14v6M18 14v6M5 11h14l-2-3H7z',                                    // dolmen tomb
  city: 'M4 20V10h5v10M9 20V5h6v15M15 20v-8h5v8M3 20h18'                              // skyline
};

/** Flow kinds → stroke styles. `dash` in px at weight 1; `speed` = dash travel px/s. */
export const FLOWS = {
  slave:     { label: 'Captives, forced movement', light: '#8A4B3C', dark: '#E2AC9C', dash: [2, 7], cap: 'round', speed: 26, glyph: 'chain' },
  trade:     { label: 'Trade (goods)', light: '#49546D', dark: '#EEDED1', dash: [14, 8], cap: 'round', speed: 34 },
  migration: { label: 'Migration, settlement', light: '#5B6264', dark: '#CCD6E6', dash: [1, 6], cap: 'round', speed: 18 },
  military:  { label: 'Military expedition, raid', light: '#33393B', dark: '#F6F4EF', dash: [10, 4, 2, 4], cap: 'butt', speed: 40 },
  mission:   { label: 'Religion, schooling', light: '#6E7790', dark: '#B2ABB4', dash: [18, 6], cap: 'round', speed: 16 },
  colonial:  { label: 'Colonial claim, administration', light: '#49546D', dark: '#CCD6E6', dash: [6, 3, 1, 3], cap: 'butt', speed: 22 },
  labour:    { label: 'Contract and coerced labour', light: '#7A5C4E', dark: '#DFC3B4', dash: [5, 5], cap: 'round', speed: 22 },
  capital:   { label: 'Capital, concessions, tourism', light: '#33393B', dark: '#EEDED1', dash: [3, 3], cap: 'butt', speed: 30 }
};
export const flowColor = (kind, dark) => (FLOWS[kind] || FLOWS.trade)[dark ? 'dark' : 'light'];

/** Area roles → fill/stroke; `pattern` refers to an SVG pattern id installed by installPatterns(). */
export const AREAS = {
  focus:      { label: 'Subject of this slide', fill: '#EEDED1', fillDark: '#EEDED1', opacity: .38, stroke: '#49546D', strokeDark: '#F6F4EF', weight: 2 },
  claim:      { label: 'Claimed overlordship', fill: 'url(#vp-hatch)', opacity: .9, stroke: '#49546D', strokeDark: '#CCD6E6', weight: 1.5, dash: '6 4' },
  contested:  { label: 'Contested', fill: '#B2ABB4', fillDark: '#B2ABB4', opacity: .35, stroke: '#33393B', strokeDark: '#F6F4EF', weight: 1.5, dash: '2 5' },
  lost:       { label: 'Land taken / lost', fill: '#33393B', fillDark: '#1E2426', opacity: .5, stroke: '#8A4B3C', strokeDark: '#E2AC9C', weight: 1.5 },
  adat:       { label: 'Customary (adat) territory', fill: '#CCD6E6', fillDark: '#CCD6E6', opacity: .42, stroke: '#49546D', strokeDark: '#CCD6E6', weight: 1.5, dash: '1 4' },
  concession: { label: 'Plantation / tourism permit', fill: 'url(#vp-stripe)', opacity: .95, stroke: '#7A5C4E', strokeDark: '#DFC3B4', weight: 1.5 }
};

export function installPatterns() {
  if (document.getElementById('vp-hatch')) return;
  const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', 0); svg.setAttribute('height', 0); svg.style.position = 'absolute'; svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = `<defs>
    <pattern id="vp-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="rgba(204,214,230,.25)"/><line x1="0" y1="0" x2="0" y2="8" stroke="#49546D" stroke-width="2" stroke-opacity=".55"/></pattern>
    <pattern id="vp-stripe" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><rect width="10" height="10" fill="rgba(238,222,209,.35)"/><line x1="0" y1="0" x2="0" y2="10" stroke="#7A5C4E" stroke-width="3.5" stroke-opacity=".6"/></pattern>
  </defs>`;
  document.body.append(svg);
}

/** Small inline SVG for a glyph (for legends, chips, markers). */
export const glyphSvg = (kind, size = 18, stroke = 'currentColor') =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${stroke}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${GLYPHS[kind] || GLYPHS.village}"/></svg>`;

/** Leaflet divIcon for a place marker: a soft round token with the glyph and a label pill. */
export function placeIcon(p, { dark = false, delay = 0 } = {}) {
  return L.divIcon({ className: 'vp-wrap', iconSize: [0, 0], html:
    `<div class="vp ${dark ? 'on-dark' : 'on-light'}" style="--d:${delay}ms"><span class="vp-tok">${glyphSvg(p.kind, 16)}</span><span class="vp-lab">${String(p.name).replace(/[<&>]/g, '')}</span></div>` });
}

/** Source tier → badge text + class. */
export const TIER = { 'peer-reviewed': { t: 'peer-reviewed', c: 'tier-pr', g: '✓' }, primary: { t: 'primary record', c: 'tier-pri', g: '◆' }, other: { t: 'other', c: 'tier-o', g: '○' }, missing: { t: 'missing', c: 'tier-x', g: '!' } };
