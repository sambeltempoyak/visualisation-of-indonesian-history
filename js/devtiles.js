// devtiles.js — DEV ONLY (enabled with ?mocktiles): draws Positron-/Dark-Matter-coloured Mercator tiles from the
// bundled Natural Earth data so the palette filter and overlay contrast can be tested when CARTO is unreachable.
const R = 6378137, ORIGIN = Math.PI * R;
export async function installMockTiles() {
  const topo = await (await fetch('data/geo/countries.topo.json')).json();
  const fc = topojson.feature(topo, topo.objects.countries);
  const polys = [];
  for (const f of fc.features) for (const off of [0, 360]) {
    const g = f.geometry, parts = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
    for (const p of parts) polys.push(p.map(r => r.map(([x, y]) => [x + off, y])));
  }
  const merc = (lon, lat) => [lon * Math.PI / 180 * R, Math.log(Math.tan(Math.PI / 4 + Math.max(-85, Math.min(85, lat)) * Math.PI / 360)) * R];
  window.__MockTiles = (b) => L.GridLayer.extend({
    createTile(coords, done) {
      const c = document.createElement('canvas'), s = 256; c.width = c.height = s; const x = c.getContext('2d');
      const dark = b.id === 'dusk', world = 2 * ORIGIN / Math.pow(2, coords.z);
      const x0 = -ORIGIN + coords.x * world, y1 = ORIGIN - coords.y * world;
      x.fillStyle = dark ? '#0e0e0e' : '#d4dadc'; x.fillRect(0, 0, s, s);
      x.fillStyle = dark ? '#262626' : '#f5f3f0'; x.strokeStyle = dark ? '#3a3a3a' : '#c9c9c6'; x.lineWidth = 0.8;
      for (const p of polys) {
        x.beginPath();
        for (const ring of p) ring.forEach(([lo, la], i) => { const [mx, my] = merc(lo, la); const px = (mx - x0) / world * s, py = (y1 - my) / world * s; i ? x.lineTo(px, py) : x.moveTo(px, py); });
        x.fill('evenodd'); x.stroke();
      }
      setTimeout(() => done(null, c), 5); return c;
    }
  });
}
