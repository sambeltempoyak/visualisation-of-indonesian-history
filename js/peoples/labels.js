// peoples/labels.js — decluttered group labels (zoom >= 6) and island-group names (lower zooms).
export function createLabels({ map, A, info, isActive, selectedId, ISLANDS }) {
  map.createPane('labels').style.zIndex = 420; map.getPane('labels').style.pointerEvents = 'none';
  const grp = L.layerGroup().addTo(map); let t;
  // island centres: area-weighted mean of the label points
  const isl = {}; info.forEach((v, id) => { const i = A[id]?.island; if (!i) return; const o = isl[i] || (isl[i] = { w: 0, la: 0, lo: 0 }); o.w += v.area; o.la += v.pt[0] * v.area; o.lo += v.pt[1] * v.area; });
  const icon = (cls, text) => L.divIcon({ className: 'pl-wrap', iconSize: [0, 0], html: `<span class="${cls}">${text.replace(/[<&>]/g, '')}</span>` });
  function refresh() {
    grp.clearLayers(); const z = map.getZoom();
    if (z < 6) {
      ISLANDS.forEach(i => { const o = isl[i]; if (!o) return; if (!isActive(Object.keys(A).find(id => A[id].island === i))) return; grp.addLayer(L.marker([o.la / o.w, o.lo / o.w], { pane: 'labels', icon: icon('pi', i), interactive: false, keyboard: false })); });
      return;
    }
    const b = map.getBounds().pad(.05), placed = [], size = map.getSize(), sel = selectedId();
    const cand = [...info.entries()].filter(([id, v]) => isActive(id) && b.contains(v.pt)).sort((x, y) => (y[0] === sel) - (x[0] === sel) || y[1].area - x[1].area);
    for (const [id, v] of cand) {
      if (placed.length > 90) break;
      const p = map.latLngToContainerPoint(v.pt), name = A[id].name, w = name.length * 6.6 + 18, hh = 20;
      if (p.x < 0 || p.y < 0 || p.x > size.x || p.y > size.y) continue;
      const r = [p.x - w / 2, p.y - hh / 2, p.x + w / 2, p.y + hh / 2];
      if (placed.some(q => r[0] < q[2] && r[2] > q[0] && r[1] < q[3] && r[3] > q[1])) continue;
      placed.push(r); grp.addLayer(L.marker(v.pt, { pane: 'labels', icon: icon('pl' + (id === sel ? ' sel' : ''), name), interactive: false, keyboard: false }));
    }
  }
  const later = () => { clearTimeout(t); t = setTimeout(refresh, 120); };
  map.on('moveend zoomend', later); refresh();
  return { refresh };
}
