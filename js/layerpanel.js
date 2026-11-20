// layerpanel.js — the left "Layers" panel (Bhumi-style layer manager), the Add-layer dialog, the style editor,
// the attribute table and the layer info dialog.
import { el, esc, textGlyph, debounce, downloadFile, formatYear, unwrapLon } from './util.js';
import { openModal, closeModal } from './cards.js';
import { SWATCHES, parseFile, csvToFC, guessLatLon, exportGeoJSON, exportCSV, restyle, applyLabels, propsTable, slug, DEFAULT_STYLE } from './datalayers.js';

const swatchEl = d => {
  const s = d.swatch || { type: 'dot', color: '#49546D' };
  return el('i', { class: 'sw sw-' + s.type + (s.dash ? ' dash' : ''), style: `--c:${s.color}` }, s.type === 'text' ? 'Aa' : null);
};

export function createLayerPanel({ D, map, reg, state, dl, ctx }) {
  const root = document.getElementById('layers');
  const header = el('div', { class: 'layers-head' },
    el('button', { class: 'layers-toggle', 'aria-expanded': 'true', 'aria-controls': 'layers-body', onclick: () => { const c = root.classList.toggle('collapsed'); header.querySelector('.layers-toggle').setAttribute('aria-expanded', !c); } }, el('span', {}, 'Layers'), el('span', { class: 'caret' }, '▾')),
    el('button', { class: 'btn btn-sm btn-add', onclick: () => openAddDialog(), 'aria-label': 'Add a layer' }, '+ Add'));
  const body = el('div', { id: 'layers-body', class: 'layers-body' });
  root.replaceChildren(header, body);
  const open = new Set();

  // ------------------------------------------------------------------ rows
  function themeBox() {
    const box = el('div', { class: 'lyr-themes' }, el('div', { class: 'lyr-sub' }, el('span', {}, 'Themes'), el('span', { class: 'lyr-all' }, el('button', { class: 'link-btn', onclick: () => state.set({ themesOn: new Set(D.themes.map(t => t.id)) }) }, 'all'), ' · ', el('button', { class: 'link-btn', onclick: () => state.set({ themesOn: new Set() }) }, 'none'))));
    D.themes.forEach(t => {
      const input = el('input', { type: 'checkbox', id: 'th-' + t.id, checked: state.get().themesOn.has(t.id) || null });
      input.addEventListener('change', () => { const s = new Set(state.get().themesOn); input.checked ? s.add(t.id) : s.delete(t.id); state.set({ themesOn: s }); });
      box.append(el('label', { class: 'lyr lyr-th', for: 'th-' + t.id }, input, el('span', { class: 'switch' }), el('span', { class: 'lyr-glyph', style: `--c:${t.color}` }, textGlyph(t.glyph)), el('span', { class: 'lyr-name' }, t.name), el('span', { class: 'lyr-count' }, D.eventsByTheme.get(t.id) || 0)));
    });
    return box;
  }
  function legendBox(d) {
    const items = typeof d.legend === 'function' ? d.legend() : d.legend; if (!items?.length) return null;
    return el('div', { class: 'legend' }, items.map(i => el('div', { class: 'leg' }, el('i', { style: `background:${i.color}` }), i.label)));
  }
  function controlEl(d, c) {
    if (c.type === 'select') {
      const s = el('select', { 'aria-label': c.label }, c.options.map(([v, l]) => el('option', { value: v, selected: v === c.value || null }, l)));
      s.addEventListener('change', () => { c.value = s.value; c.onChange(s.value); });
      return el('label', { class: 'ctl' }, el('span', {}, c.label), s);
    }
    const r = el('input', { type: 'range', min: c.min, max: c.max, step: c.step || 1, value: c.value, 'aria-label': c.label });
    const v = el('output', {}, String(c.value));
    r.addEventListener('input', () => { c.value = +r.value; v.textContent = r.value; c.onInput(+r.value); });
    return el('label', { class: 'ctl' }, el('span', {}, c.label), r, v);
  }
  function detail(d) {
    const op = el('input', { type: 'range', min: 0, max: 1, step: 0.05, value: d.opacity, 'aria-label': `Opacity of ${d.name}` });
    const ov = el('output', {}, Math.round(d.opacity * 100) + '%');
    op.addEventListener('input', () => { reg.setOpacity(d.id, +op.value); ov.textContent = Math.round(op.value * 100) + '%'; });
    const hasFC = !!(d.fc || d.layer?.toGeoJSON), vector = hasFC && d.type !== 'custom-heat';
    const btn = (label, fn, title, cls = '') => el('button', { class: 'btn btn-sm btn-mini ' + cls, title: title || label, onclick: fn }, label);
    const acts = [
      btn('Zoom to', () => { if (!reg.zoomTo(d.id)) ctx.toast('No extent known for this layer yet.'); }, 'Zoom to layer'),
      btn('Info', () => openInfo(d), 'Source and attribution'),
      vector && d.visible ? btn('Table', () => openTable(d), 'Attribute table') : null,
      d.data && d.layer instanceof L.GeoJSON && d.kind !== 'builtin' ? btn('Style', () => openStyle(d), 'Style editor') : null,
      vector ? btn('GeoJSON', () => { const fc = reg.fc(d.id); fc ? exportGeoJSON(fc, d.name) : ctx.toast('Nothing to export.'); }, 'Export as GeoJSON') : null,
      vector ? btn('CSV', () => { const fc = reg.fc(d.id); fc ? exportCSV(fc, d.name) : ctx.toast('Nothing to export.'); }, 'Export as CSV') : null,
      d.kind === 'user' || d.kind === 'catalogue' ? btn('Catalogue entry', () => openCatalogueEntry(d), 'Copy a JSON snippet for data/layers.json') : null,
      btn('▲', () => reg.move(d.id, 1), 'Draw above', 'btn-ico'), btn('▼', () => reg.move(d.id, -1), 'Draw below', 'btn-ico'),
      d.removable ? btn('Remove', () => { if (confirm(`Remove “${d.name}”?`)) reg.unregister(d.id); }, 'Remove layer', 'btn-danger') : null
    ].filter(Boolean);
    return el('div', { class: 'lyr-detail' },
      el('label', { class: 'ctl' }, el('span', {}, 'Opacity'), op, ov),
      ...(d.controls || []).map(c => controlEl(d, c)),
      d.badge === 'themes' ? themeBox() : null,
      legendBox(d),
      d.loading ? el('div', { class: 'lyr-status' }, d.progress != null ? `Computing… ${Math.round(d.progress * 100)}%` : 'Loading…') : null,
      d.progress != null && !d.loading ? el('div', { class: 'lyr-status' }, `Computing… ${Math.round(d.progress * 100)}%`) : null,
      d.error ? el('div', { class: 'lyr-status err' }, d.error) : null,
      el('div', { class: 'lyr-acts' }, acts));
  }
  function row(d) {
    const input = el('input', { type: 'checkbox', id: 'ly-' + d.id, checked: d.visible || null });
    input.addEventListener('change', () => reg.setVisible(d.id, input.checked));
    const isOpen = open.has(d.id);
    const more = el('button', { class: 'lyr-more', 'aria-expanded': isOpen, 'aria-label': `Options for ${d.name}`, onclick: () => { open.has(d.id) ? open.delete(d.id) : open.add(d.id); render(); } }, '▾');
    return el('div', { class: 'lyr-item' + (isOpen ? ' open' : '') + (d.loading ? ' loading' : '') + (d.error ? ' errored' : ''), 'data-id': d.id },
      el('div', { class: 'lyr-line' },
        el('label', { class: 'lyr', for: 'ly-' + d.id }, input, el('span', { class: 'switch' }), swatchEl(d), el('span', { class: 'lyr-name' }, d.name), d.count != null ? el('span', { class: 'lyr-count' }, d.count) : null),
        more),
      isOpen ? detail(d) : null);
  }
  function render() {
    const scroll = root.scrollTop;
    const sections = reg.groups().map(g => {
      const list = reg.list(g).slice().reverse();     // top of the stack first
      if (!list.length) return null;
      return el('div', { class: 'lyr-group' }, el('div', { class: 'lyr-h' }, el('span', {}, g), el('span', { class: 'lyr-n' }, list.length)), list.map(row));
    }).filter(Boolean);
    body.replaceChildren(...sections);
    root.scrollTop = scroll;
  }
  const renderSoon = debounce(render, 60);
  reg.on((t, d) => {
    if (t === 'opacity') return;
    if (t === 'visibility') { const i = document.getElementById('ly-' + d.id); if (i) i.checked = d.visible; if (open.has(d.id)) renderSoon(); return; }
    renderSoon();
  });
  state.on((s, p) => { if (s.themesOn !== p.themesOn) D.themes.forEach(t => { const i = document.getElementById('th-' + t.id); if (i) i.checked = s.themesOn.has(t.id); }); });
  render();

  // ------------------------------------------------------------------ info
  function openInfo(d) {
    const i = d.info || {}, src = i.source_id && D.sourceById.get(i.source_id);
    openModal(d.name, el('div', { class: 'panel-body prose' },
      i.source ? el('p', { class: 'lede-sm' }, i.source) : null,
      el('dl', { class: 'meta' },
        d.count != null ? [el('dt', {}, 'Features'), el('dd', {}, String(d.count))] : [],
        d.type ? [el('dt', {}, 'Type'), el('dd', {}, d.type)] : [],
        i.attribution ? [el('dt', {}, 'Attribution'), el('dd', {}, i.attribution)] : [],
        i.url ? [el('dt', {}, 'Link'), el('dd', {}, el('a', { href: i.url, target: '_blank', rel: 'noopener' }, i.url))] : []),
      i.note ? el('p', {}, i.note) : null,
      src ? el('p', {}, el('button', { class: 'btn btn-sm', onclick: () => { closeModal(); ctx.openSource(src.id); } }, 'Open source card (with Verify)')) : (i.source_id ? el('p', { class: 'muted' }, `Source card “${i.source_id}” is not in the bibliography yet.`) : null)));
  }
  function openCatalogueEntry(d) {
    const json = dl.catalogueEntry(d);
    const ta = el('textarea', { class: 'code-area', readonly: true, rows: 14 }, json);
    const copy = el('button', { class: 'btn btn-primary', onclick: async () => { try { await navigator.clipboard.writeText(json); copy.textContent = 'Copied ✓'; } catch (e) { ta.select(); copy.textContent = 'Select + copy (Ctrl-C)'; } } }, 'Copy JSON');
    openModal('Catalogue entry', el('div', { class: 'panel-body' }, el('p', {}, 'This is the entry for ', el('code', {}, 'data/layers.json'), '. Send it to Claude with “make this layer permanent” and it will be added to the repository for everyone.'), ta, el('div', { class: 'row sp' }, copy,
      d.type === 'geojson' ? el('button', { class: 'btn', onclick: () => { const fc = reg.fc(d.id); fc && exportGeoJSON(fc, d.name); } }, 'Download GeoJSON file too') : null)));
  }

  // ------------------------------------------------------------------ style editor
  function openStyle(d) {
    const st = d.style, fields = [...new Set((d.data?.features || []).flatMap(f => Object.keys(f.properties || {})))];
    const apply = () => { restyle(d); dl.persist(d); reg.changed(d); };
    const sw = el('div', { class: 'swatches' }, SWATCHES.map(c => el('button', { class: 'swatch' + (c.toLowerCase() === st.color.toLowerCase() ? ' on' : ''), style: `background:${c}`, 'aria-label': `Colour ${c}`, title: c, onclick: e => { st.color = c; sw.querySelectorAll('.swatch').forEach(b => b.classList.toggle('on', b === e.currentTarget)); apply(); } })));
    const range = (label, key, min, max, step) => { const r = el('input', { type: 'range', min, max, step, value: st[key] }), o = el('output', {}, String(st[key])); r.addEventListener('input', () => { st[key] = +r.value; o.textContent = r.value; apply(); }); return el('label', { class: 'ctl' }, el('span', {}, label), r, o); };
    const sel = (label, key) => { const s = el('select', {}, el('option', { value: '' }, '— none —'), fields.map(f => el('option', { value: f, selected: st[key] === f || null }, f))); s.addEventListener('change', () => { st[key] = s.value; apply(); }); return el('label', { class: 'ctl' }, el('span', {}, label), s); };
    openModal(`Style · ${d.name}`, el('div', { class: 'panel-body style-ed' },
      el('div', { class: 'ctl' }, el('span', {}, 'Colour (palette)'), sw),
      range('Line / outline weight', 'weight', 0.5, 8, 0.5), range('Fill opacity', 'fillOpacity', 0, 1, 0.05), range('Point radius', 'radius', 2, 14, 0.5),
      sel('Label field', 'labelField'), sel('Colour by category', 'categoryField'),
      el('p', { class: 'muted' }, 'Category colouring overrides the single colour; labels show above ~800 features only when they are few enough to stay legible.')), {});
  }

  // ------------------------------------------------------------------ attribute table
  function openTable(d) {
    const fc = reg.fc(d.id); if (!fc) return ctx.toast('This layer has no attribute table.');
    const feats = fc.features, keys = [...new Set(feats.flatMap(f => Object.keys(f.properties || {})))].filter(k => k !== 'id' || feats.length < 400).slice(0, 12);
    let sortK = null, dir = 1, q = '';
    const info = el('span', { class: 'muted' }), thead = el('thead'), tbody = el('tbody');
    const rowsOf = () => {
      let rows = feats.map((f, i) => ({ f, i }));
      if (q) { const t = q.toLowerCase(); rows = rows.filter(({ f }) => keys.some(k => String(f.properties?.[k] ?? '').toLowerCase().includes(t))); }
      if (sortK) rows.sort((a, b) => { const x = a.f.properties?.[sortK], y = b.f.properties?.[sortK]; return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x ?? '').localeCompare(String(y ?? ''), undefined, { numeric: true })) * dir; });
      return rows;
    };
    const paint = () => {
      thead.replaceChildren(el('tr', {}, keys.map(k => el('th', { class: sortK === k ? 'sorted' : '', 'aria-sort': sortK === k ? (dir > 0 ? 'ascending' : 'descending') : 'none', onclick: () => { dir = sortK === k ? -dir : 1; sortK = k; paint(); } }, k, sortK === k ? (dir > 0 ? ' ▲' : ' ▼') : ''))));
      const rows = rowsOf(); info.textContent = `${rows.length} of ${feats.length} features${rows.length > 500 ? ' (first 500 shown)' : ''}`;
      tbody.replaceChildren(...rows.slice(0, 500).map(({ f }) => el('tr', { tabindex: 0, onclick: () => zoomFeature(f, d), onkeydown: e => e.key === 'Enter' && zoomFeature(f, d) }, keys.map(k => el('td', {}, String(f.properties?.[k] ?? ''))))));
    };
    const filter = el('input', { type: 'search', placeholder: 'Filter rows…', 'aria-label': 'Filter rows' }); filter.addEventListener('input', debounce(() => { q = filter.value.trim(); paint(); }, 150));
    paint();
    openModal(`Table · ${d.name}`, el('div', { class: 'panel-body' }, el('div', { class: 'filters' }, filter, info), el('div', { class: 'table-wrap' }, el('table', { class: 'attr-table' }, thead, tbody))), { wide: true });
  }
  function zoomFeature(f, d) {
    closeModal();
    const g = L.geoJSON(f, { coordsToLatLng: c => L.latLng(c[1], c[0]) });
    const b = g.getBounds(); if (!b.isValid()) return;
    const flash = L.geoJSON(f, { pane: 'p-flash', style: { color: '#9A4A42', weight: 4, fillOpacity: 0.2 }, pointToLayer: (ft, ll) => L.circleMarker(ll, { pane: 'p-flash', radius: 12, color: '#9A4A42', weight: 3, fillColor: '#F6F4EF', fillOpacity: 0.5 }) }).addTo(map.map);
    if (b.getSouthWest().equals(b.getNorthEast())) map.flyToView(b.getCenter(), Math.max(map.map.getZoom(), 9), { duration: 1 }); else map.flyToBounds(b, { pad: 60, maxZoom: 12 });
    setTimeout(() => map.map.removeLayer(flash), 3500);
  }
  map.pane('p-flash', 395);

  // ------------------------------------------------------------------ add layer dialog
  function openAddDialog() {
    const tabs = ['Upload file', 'WMS', 'XYZ tiles', 'ArcGIS', 'GeoJSON URL'];
    const panes = [uploadTab(), wmsTab(), xyzTab(), arcgisTab(), urlTab()];
    const bar = el('div', { class: 'tabs', role: 'tablist' }), bodyEl = el('div', { class: 'tab-body' });
    const show = i => { bar.childNodes.forEach((b, j) => { b.classList.toggle('on', i === j); b.setAttribute('aria-selected', i === j); }); bodyEl.replaceChildren(panes[i]); };
    tabs.forEach((t, i) => bar.append(el('button', { class: 'tab', role: 'tab', onclick: () => show(i) }, t)));
    show(0);
    openModal('Add a layer', el('div', { class: 'panel-body add-dialog' }, el('p', { class: 'muted' }, 'Layers you add stay in this browser (IndexedDB). Use “Catalogue entry” on a layer to hand it to Claude and make it permanent.'), bar, bodyEl), { wide: true });
  }
  const nameInput = (v = '') => el('input', { type: 'text', value: v, placeholder: 'Layer name', 'aria-label': 'Layer name' });
  const field = (label, ...kids) => el('label', { class: 'fld' }, el('span', {}, label), ...kids);
  const status = () => el('div', { class: 'lyr-status', 'aria-live': 'polite' });
  async function guard(st, fn) { st.className = 'lyr-status'; st.textContent = 'Working…'; try { await fn(); closeModal(); } catch (e) { st.className = 'lyr-status err'; st.textContent = e.message || String(e); console.warn(e); } }

  function uploadTab() {
    const st = status(), area = el('div'), file = el('input', { type: 'file', accept: '.geojson,.json,.kml,.gpx,.zip,.csv,.tsv,.txt', 'aria-label': 'Choose a file' });
    const drop = el('label', { class: 'drop' }, el('b', {}, 'Choose a file'), el('span', {}, 'GeoJSON · KML · GPX · zipped Shapefile · CSV with lat/lon columns'), file);
    ['dragover', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); if (ev === 'drop' && e.dataTransfer.files[0]) handle(e.dataTransfer.files[0]); }));
    file.addEventListener('change', () => file.files[0] && handle(file.files[0]));
    async function handle(f) {
      st.className = 'lyr-status'; st.textContent = 'Reading…'; area.replaceChildren();
      try {
        const r = await parseFile(f); st.textContent = '';
        const nm = nameInput(r.name);
        if (r.kind === 'csv') {
          const H = r.csv.headers, opt = (v) => H.map(h => el('option', { value: h, selected: h === v || null }, h));
          const lat = el('select', {}, opt(r.guess.lat)), lon = el('select', {}, opt(r.guess.lon)), lab = el('select', {}, el('option', { value: '' }, '— none —'), opt(r.guess.label));
          area.append(el('p', {}, `${r.csv.rows.length} rows. Pick the coordinate columns:`), el('div', { class: 'grid3' }, field('Latitude', lat), field('Longitude', lon), field('Label', lab)), field('Name', nm),
            el('button', { class: 'btn btn-primary', onclick: () => guard(st, async () => { const fc = csvToFC(r.csv, lat.value, lon.value); if (!fc.features.length) throw new Error('No valid coordinates in those columns.'); await dl.addFC(fc, nm.value || r.name, { source: f.name, opts: { style: { labelField: lab.value } } }); }) }, 'Add layer'));
        } else {
          if (!r.fc.features?.length) throw new Error('The file contains no features.');
          area.append(el('p', {}, `${r.fc.features.length} feature${r.fc.features.length > 1 ? 's' : ''} found.`), field('Name', nm), el('button', { class: 'btn btn-primary', onclick: () => guard(st, async () => { await dl.addFC(r.fc, nm.value || r.name, { source: f.name }); }) }, 'Add layer'));
        }
      } catch (e) { st.className = 'lyr-status err'; st.textContent = 'Could not read that file: ' + (e.message || e); }
    }
    return el('div', {}, drop, area, st);
  }
  function wmsTab() {
    const url = el('input', { type: 'url', placeholder: 'https://example.org/geoserver/wms', 'aria-label': 'WMS URL' }), layer = el('input', { type: 'text', placeholder: 'layer name(s), comma separated', 'aria-label': 'WMS layer name' }), nm = nameInput(), st = status(), list = el('div', { class: 'cap-list' });
    const load = el('button', { class: 'btn btn-sm', onclick: async () => {
      st.className = 'lyr-status'; st.textContent = 'Reading GetCapabilities…'; list.replaceChildren();
      try {
        const u = new URL(url.value.trim()); u.searchParams.set('service', 'WMS'); u.searchParams.set('request', 'GetCapabilities');
        const r = await fetch(u); if (!r.ok) throw new Error('HTTP ' + r.status);
        const doc = new DOMParser().parseFromString(await r.text(), 'text/xml');
        const items = [...doc.querySelectorAll('Layer > Name')].map(n => ({ name: n.textContent, title: n.parentElement.querySelector(':scope > Title')?.textContent || n.textContent }));
        if (!items.length) throw new Error('No layers found in the capabilities document.');
        st.textContent = `${items.length} layers — click one:`;
        list.replaceChildren(...items.slice(0, 200).map(i => el('button', { class: 'cap', onclick: () => { layer.value = i.name; if (!nm.value) nm.value = i.title; } }, el('b', {}, i.title), el('small', {}, i.name))));
      } catch (e) { st.className = 'lyr-status err'; st.textContent = 'Could not list layers (the server may not allow cross-origin requests) — type the layer name instead. ' + (e.message || ''); }
    } }, 'List layers');
    return el('div', {}, field('WMS URL', url), el('div', { class: 'row' }, load), list, field('Layer name', layer), field('Name', nm),
      el('button', { class: 'btn btn-primary', onclick: () => guard(st, async () => { if (!url.value || !layer.value) throw new Error('Give a URL and a layer name.'); await dl.addUserLayer({ name: nm.value || layer.value, spec: { type: 'wms', url: url.value.trim().replace(/\?.*$/, ''), options: { layers: layer.value.trim(), format: 'image/png', transparent: true, version: '1.3.0' } }, info: { source: url.value } }); }) }, 'Add WMS layer'), st);
  }
  function xyzTab() {
    const url = el('input', { type: 'text', placeholder: 'https://tile.example.org/{z}/{x}/{y}.png', 'aria-label': 'Tile URL template' }), attr = el('input', { type: 'text', placeholder: '© tile provider', 'aria-label': 'Attribution' }), nm = nameInput(), st = status();
    return el('div', {}, field('Tile URL ({z} {x} {y}, optional {s})', url), field('Attribution', attr), field('Name', nm),
      el('button', { class: 'btn btn-primary', onclick: () => guard(st, async () => { if (!/\{z\}/.test(url.value)) throw new Error('The URL needs {z}, {x} and {y}.'); await dl.addUserLayer({ name: nm.value || 'XYZ tiles', spec: { type: 'xyz', url: url.value.trim(), attribution: attr.value }, info: { source: url.value } }); }) }, 'Add tile layer'), st);
  }
  function arcgisTab() {
    const url = el('input', { type: 'url', placeholder: 'https://…/arcgis/rest/services/…/MapServer  or  …/FeatureServer/0', 'aria-label': 'ArcGIS service URL' }), nm = nameInput(), st = status();
    return el('div', {}, field('ArcGIS REST URL', url), el('p', { class: 'muted' }, 'A MapServer URL is drawn as a dynamic image; a FeatureServer (or MapServer/N) layer URL is loaded as clickable features.'), field('Name', nm),
      el('button', { class: 'btn btn-primary', onclick: () => guard(st, async () => { const u = url.value.trim().replace(/\/$/, ''); if (!/rest\/services/i.test(u)) throw new Error('That does not look like an ArcGIS REST URL.'); const feat = /FeatureServer(\/\d+)?$/i.test(u) || /MapServer\/\d+$/i.test(u); await dl.addUserLayer({ name: nm.value || 'ArcGIS layer', spec: { type: feat ? 'arcgis-feature' : 'arcgis-dynamic', url: u }, info: { source: u } }); }) }, 'Add ArcGIS layer'), st);
  }
  function urlTab() {
    const url = el('input', { type: 'url', placeholder: 'https://example.org/data.geojson', 'aria-label': 'GeoJSON URL' }), nm = nameInput(), st = status();
    return el('div', {}, field('GeoJSON URL (must allow cross-origin requests)', url), field('Name', nm),
      el('button', { class: 'btn btn-primary', onclick: () => guard(st, async () => { const u = url.value.trim(); if (!u) throw new Error('Give a URL.'); await dl.addUserLayer({ name: nm.value || u.split('/').pop() || 'GeoJSON', spec: { type: 'geojson', url: u }, info: { source: u } }); }) }, 'Add GeoJSON layer'), st);
  }
  return { render, openAddDialog, openInfo, openTable, openStyle, toggleMobile: () => root.classList.toggle('sheet-open') };
}
