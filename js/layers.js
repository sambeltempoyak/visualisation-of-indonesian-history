// layers.js — the layer registry (one list for built-in, catalogue, user and analysis-result layers).
// Every layer owns a Leaflet pane, so opacity = pane opacity and z-order = pane z-index, for any layer type.
import { clamp } from './util.js';

export const GROUPS = ['Historical', 'Ethnicity & language', 'Reference', 'User layers', 'Analysis results'];
const Z0 = 210, ZSTEP = 2;

export function createRegistry({ map }) {
  const defs = new Map(), order = [], subs = new Set();
  const emit = (type, def) => subs.forEach(f => f(type, def));
  const relayer = () => order.forEach((id, i) => { map.pane(defs.get(id).pane, Z0 + i * ZSTEP); });

  async function setVisible(id, v) {
    const d = defs.get(id); if (!d) return;
    if (v && !d.layer && d.ensure) {
      d.loading = true; d.error = null; emit('change', d);
      try { d.layer = await d.ensure(d); } catch (e) { console.warn('[layer]', id, e); d.error = e.message || String(e); v = false; }
      d.loading = false;
    }
    if (v && !d.layer) v = false;
    d.visible = !!v;
    if (d.layer) { if (v) { if (!map.map.hasLayer(d.layer)) map.map.addLayer(d.layer); } else map.map.removeLayer(d.layer); }
    d.onVisibility?.(d.visible);
    emit('visibility', d);
  }
  function register(def, { top = true } = {}) {
    const d = { visible: false, opacity: 1, kind: 'builtin', group: 'Reference', legend: null, info: {}, ...def };
    d.pane = d.pane || 'p-' + d.id;
    map.pane(d.pane);
    if (defs.has(d.id)) unregister(d.id, true);
    defs.set(d.id, d);
    if (top) order.push(d.id); else order.unshift(d.id);
    relayer();
    map.pane(d.pane).style.opacity = d.opacity;
    emit('add', d);
    if (d.visible) { d.visible = false; setVisible(d.id, true); }
    return d;
  }
  function unregister(id, silent) {
    const d = defs.get(id); if (!d) return;
    if (d.layer) { map.map.removeLayer(d.layer); d.layer.off?.(); }
    d.onRemove?.();
    defs.delete(id); order.splice(order.indexOf(id), 1); relayer();
    if (!silent) emit('remove', d);
  }
  const api = {
    defs, order,
    on: f => { subs.add(f); return () => subs.delete(f); },
    get: id => defs.get(id), has: id => defs.has(id),
    list: group => order.map(id => defs.get(id)).filter(d => !group || d.group === group),
    groups: () => [...new Set([...GROUPS, ...order.map(id => defs.get(id).group)])],
    register, unregister, setVisible,
    isVisible: id => !!defs.get(id)?.visible,
    toggle: id => setVisible(id, !defs.get(id)?.visible),
    setOpacity(id, o) {
      const d = defs.get(id); if (!d) return; d.opacity = clamp(o, 0, 1);
      map.pane(d.pane).style.opacity = d.opacity; d.onOpacity?.(d.opacity); emit('opacity', d);
    },
    move(id, dir) {
      const d = defs.get(id); if (!d) return;
      const i = order.indexOf(id); let j = i + dir;
      while (j >= 0 && j < order.length && defs.get(order[j]).group !== d.group) j += dir;
      if (j < 0 || j >= order.length) return;
      order.splice(i, 1); order.splice(j, 0, id); relayer(); emit('order', d);
    },
    bounds(id) {
      const d = defs.get(id); if (!d) return null;
      try { const b = d.bounds?.() || d.layer?.getBounds?.(); return b && b.isValid && b.isValid() ? b : null; } catch (e) { return null; }
    },
    zoomTo(id) { const b = api.bounds(id); if (b) map.flyToBounds(b, { pad: 40, maxZoom: 11 }); return !!b; },
    /** GeoJSON FeatureCollection for any vector-capable layer (or null). */
    fc(id) { const d = defs.get(id); if (!d) return null; try { return d.fc ? d.fc() : d.layer?.toGeoJSON?.() || null; } catch (e) { console.warn(e); return null; } },
    /** Layers that can serve features: {points?:bool} filter by geometry kind. */
    vectorLayers(kind) {
      return api.list().filter(d => {
        if (!(d.fc || d.layer?.toGeoJSON)) return false;
        if (!kind) return true;
        const g = d.geom || 'any';
        return g === 'any' || g === kind || (kind === 'polygon' && g === 'polygon');
      });
    },
    /** Put the listed ids (bottom→top) at the bottom of the stack, in that order. */
    arrange(ids) { const rest = order.filter(i => !ids.includes(i)); order.length = 0; order.push(...ids.filter(i => defs.has(i)), ...rest); relayer(); emit('order'); },
    changed: d => emit('change', d)
  };
  return api;
}
