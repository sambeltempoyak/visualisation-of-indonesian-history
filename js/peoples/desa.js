// peoples/desa.js — optional desa/kelurahan borders: only the provinces in view, only at zoom >= 9, at most `max` in memory.
const MINZ = 9;
export function createDesa({ map, pane, max = 3, onStatus = () => {} }) {
  let index = null, on = false, t, gen = 0; const loaded = new Map(); const renderer = L.canvas({ pane, padding: .25 });
  const style = { color: '#49546D', weight: .5, opacity: .6, fill: true, fillOpacity: 0, renderer, pane };
  const esc = s => String(s ?? '').replace(/[<&>]/g, '');
  async function update() {
    if (!on) return; const g = ++gen;
    if (map.getZoom() < MINZ) { loaded.forEach(e => e.layer && map.removeLayer(e.layer)); onStatus(`Zoom in to ${MINZ} or more to load desa borders.`); return; }
    if (!index) index = await fetch('data/admin/desa/index.json').then(r => r.json());
    const b = map.getBounds(), c = b.getCenter();
    const want = index.filter(p => !(p.bbox[0] > b.getEast() || p.bbox[2] < b.getWest() || p.bbox[1] > b.getNorth() || p.bbox[3] < b.getSouth()))
      .map(p => ({ p, d: Math.hypot((p.bbox[0] + p.bbox[2]) / 2 - c.lng, (p.bbox[1] + p.bbox[3]) / 2 - c.lat) })).sort((a, b) => a.d - b.d).slice(0, max).map(x => x.p);
    for (const p of want) {
      if (loaded.has(p.slug)) { loaded.get(p.slug).t = performance.now(); continue; }
      const e = { t: performance.now(), layer: null }; loaded.set(p.slug, e); onStatus(`Loading desa of ${p.prov}…`);
      try {
        const topo = await fetch(p.file).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });
        const fc = topojson.feature(topo, topo.objects[Object.keys(topo.objects)[0]]);
        e.layer = L.geoJSON(fc, { pane, renderer, style: () => style, onEachFeature: (f, l) => l.bindPopup(`<b>${esc(f.properties.desa)}</b><br>Kec. ${esc(f.properties.kec)}, ${esc(f.properties.kab)}<br>${esc(p.prov)} · ${esc(f.properties.kode)}`) });
      } catch (err) { loaded.delete(p.slug); onStatus(`Could not load desa of ${p.prov}: ${err.message}`); }
    }
    if (!on) return;
    const keep = new Set(want.map(p => p.slug));
    [...loaded.entries()].filter(([k]) => !keep.has(k)).sort((a, b) => a[1].t - b[1].t).forEach(([k, e]) => { if (loaded.size > max) { e.layer && map.removeLayer(e.layer); loaded.delete(k); } });
    loaded.forEach((e, k) => { if (!e.layer) return; const w = keep.has(k); if (w && !map.hasLayer(e.layer)) map.addLayer(e.layer); else if (!w && map.hasLayer(e.layer)) map.removeLayer(e.layer); });
    if (g === gen) onStatus(want.length ? `Desa borders: ${want.map(p => p.prov).join(', ')} (max ${max} provinces kept in memory).` : 'No province in view.');
  }
  const later = () => { clearTimeout(t); t = setTimeout(update, 200); };
  return {
    on() { on = true; map.on('moveend zoomend', later); update(); },
    off() { on = false; gen++; map.off('moveend zoomend', later); loaded.forEach(e => e.layer && map.removeLayer(e.layer)); loaded.clear(); onStatus('Village boundaries load province by province when you zoom in to 9 or more.'); },
    loaded: () => [...loaded.keys()]
  };
}
