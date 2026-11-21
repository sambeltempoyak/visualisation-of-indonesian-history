// landing.js — hero map (SVG of the provinces, equirectangular) and the stories strip. No Leaflet, no data beyond
// data/geo/lite/indonesia-prov.topo.json (73 KB) and data/stories/index.json.
import { formatYear } from './core/util.js';

const NS = 'http://www.w3.org/2000/svg';
const W = 920, H = 360, LON0 = 94.6, LON1 = 141.4, LAT0 = 6.6, LAT1 = -11.4;
const px = (lon, lat) => [(lon - LON0) / (LON1 - LON0) * W, (lat - LAT0) / (LAT1 - LAT0) * H];

async function hero() {
  const svg = document.getElementById('heroMap');
  svg.innerHTML = `<defs><radialGradient id="hg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#CCD6E6" stop-opacity=".32"/><stop offset="1" stop-color="#CCD6E6" stop-opacity="0"/></radialGradient></defs>
    <ellipse class="glow" cx="470" cy="190" rx="360" ry="150" fill="url(#hg)"/><g class="drift" id="hd"></g>`;
  const g = svg.querySelector('#hd');
  try {
    const t = await fetch('data/geo/lite/indonesia-prov.topo.json').then(r => r.json());
    const fc = topojson.feature(t, t.objects[Object.keys(t.objects)[0]]);
    const ring = r => r.map((c, i) => (i ? 'L' : 'M') + px(c[0], c[1]).map(v => v.toFixed(1)).join(' ')).join('') + 'Z';
    fc.features.forEach(f => {
      const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      const p = document.createElementNS(NS, 'path'); p.setAttribute('class', 'pv');
      p.setAttribute('d', polys.map(poly => poly.map(ring).join('')).join('')); g.append(p);
    });
  } catch (e) { console.info('[landing] hero map unavailable', e.message); }
  // trade / forced-movement arcs between a few nodes of the archipelago (illustrative, not data)
  const N = { malacca: [101.4, 2.2], batavia: [106.8, -6.2], makassar: [119.4, -5.1], ternate: [127.4, 0.8], banda: [129.9, -4.5], kupang: [123.6, -10.2], sumba: [119.6, -9.6], bali: [115.2, -8.5], aceh: [95.4, 5.5], manila: [121, 14.6] };
  const arc = (a, b, cls, bend = .22) => {
    const [x1, y1] = px(...N[a]), [x2, y2] = px(...N[b]), mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1;
    const path = document.createElementNS(NS, 'path'); path.setAttribute('class', 'arc ' + cls);
    path.setAttribute('d', `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${(mx - dy * bend).toFixed(1)} ${(my + dx * bend).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`); g.append(path);
  };
  arc('aceh', 'malacca', 'b', -.2); arc('malacca', 'batavia', 'b', .2); arc('batavia', 'makassar', 'a', -.18); arc('makassar', 'ternate', 'a', .2);
  arc('banda', 'batavia', 'b', .3); arc('sumba', 'bali', 'c', -.25); arc('kupang', 'banda', 'c', .2); arc('sumba', 'makassar', 'c', .25);
  Object.keys(N).filter(k => k !== 'manila').forEach((k, i) => {
    const [x, y] = px(...N[k]), c = document.createElementNS(NS, 'circle');
    c.setAttribute('class', 'node'); c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('r', 3); c.style.animationDelay = (-i * 0.9) + 's'; g.append(c);
  });
}

async function stories() {
  const dev = new URLSearchParams(location.search).has('dev');
  let list = null;
  for (const u of ['data/stories/index.json', ...(dev ? ['dev-fixtures/stories/index.json'] : [])]) {
    try { const r = await fetch(u, { cache: 'no-cache' }); if (r.ok) { list = await r.json(); break; } } catch (e) { /* none */ }
  }
  if (!Array.isArray(list) || !list.length) return;
  const row = document.getElementById('storyCards');
  list.forEach(s => {
    const n = s.slides ?? s.chapters, span = Array.isArray(s.span) && s.span.length === 2 ? `${formatYear(s.span[0])} – ${formatYear(s.span[1])}` : '';
    const a = document.createElement('a'); a.className = 'scard'; a.href = `story.html#${encodeURIComponent(s.id)}`;
    a.innerHTML = `<h3></h3><p class="sub-t"></p><p></p><div class="meta"></div>`;
    a.querySelector('h3').textContent = s.title || s.id;
    a.querySelector('.sub-t').textContent = s.subtitle || ''; a.querySelector('p:not(.sub-t)').textContent = s.cover || '';
    const meta = a.querySelector('.meta');
    [n ? `${n} slides` : '', span, s.region && typeof s.region === 'string' ? s.region : ''].filter(Boolean).forEach(t => { const c = document.createElement('span'); c.className = 'chip'; c.textContent = t; meta.append(c); });
    row.append(a);
  });
  document.getElementById('storiesStrip').hidden = false;
}

hero(); stories();
