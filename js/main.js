// main.js — boots the app: loads data, builds the Leaflet map, registers layers, and wires timeline, cards,
// layer manager, analysis, stories, search and the questions tour.
import { $, $$, el, clamp, createState, isMobile } from './util.js';
import { loadAll } from './data.js';
import { createMap } from './map.js';
import { createRegistry } from './layers.js';
import { createHistorical } from './historical.js';
import { createEthno } from './ethno.js';
import { createDataLayers } from './datalayers.js';
import { createAdminLayers } from './adminlayers.js';
import { createLayerPanel } from './layerpanel.js';
import { createAnalysis } from './analysis.js';
import { createStories } from './story.js';
import { createDeclutter } from './declutter.js';
import { createTimeline, makeScale } from './timeline.js';
import { createCards, openModal, closeModal, modalOpen, sourcesPanel, sourceItem } from './cards.js';
import { createSearch, createTour, openAbout } from './panels.js';
import { notesPanel } from './notes.js';
import { verifyAll } from './verify.js';
import { openArchive } from './archivepanel.js';

// ---------------------------------------------------------------- tooltip (hover cards for map features)
const tipEl = $('#tooltip');
const tip = {
  sticky: false,
  show(html, ev) { if (tip.sticky) return; tipEl.innerHTML = html; tipEl.hidden = false; tip.move(ev); },
  move(ev) {
    if (tip.sticky || tipEl.hidden || !ev) return;
    const w = tipEl.offsetWidth, h = tipEl.offsetHeight;
    tipEl.style.left = clamp(ev.clientX + 14, 8, innerWidth - w - 8) + 'px';
    tipEl.style.top = clamp(ev.clientY - h - 14 < 8 ? ev.clientY + 18 : ev.clientY - h - 14, 8, innerHeight - h - 8) + 'px';
  },
  hide() { if (!tip.sticky) tipEl.hidden = true; },
  unpin() { tip.sticky = false; tipEl.hidden = true; }
};

function toast(msg) {
  const t = el('div', { class: 'toast', role: 'status' }, msg); document.body.append(t);
  requestAnimationFrame(() => t.classList.add('on')); setTimeout(() => { t.classList.remove('on'); setTimeout(() => t.remove(), 400); }, 4200);
}

async function boot() {
  if (new URLSearchParams(location.search).has('mocktiles')) await (await import('./devtiles.js')).installMockTiles();
  const D = await loadAll();
  const allThemes = new Set(D.themes.map(t => t.id));
  const startEra = D.eraById.get('commerce') || D.eras[Math.min(3, D.eras.length - 1)];
  const state = createState({ window: [startEra.start, startEra.end], cumulative: false, themesOn: allThemes, selection: null });

  const map = createMap({ D, state }), lmap = map.map;
  const reg = createRegistry({ map });
  const ctx = {
    toast,
    openSource(id, cite) {
      const s = id && D.sourceById.get(id);
      openModal('Source', el('div', { class: 'panel-body' }, s ? el('ol', { class: 'sources one' }, sourceItem(D, { id }, 0)) : el('p', {}, cite ? `“${cite}” is not in the bibliography yet.` : `Source “${id}” is not in the bibliography yet.`)));
    },
    updateInsets: () => updateInsets()
  };
  let tl, tour, cards, stories;
  const scale = makeScale(D.eras);

  // ---- insets: the free map area, for fly-to / fit ----
  const tlH = () => $('#timeline').offsetHeight + 12;
  function updateInsets() {
    const mob = isMobile(), open = $('#card').classList.contains('open'), story = document.body.classList.contains('story-mode');
    map.setInsets({ top: mob ? 108 : 72, left: !mob && story ? 440 : (!mob && $('#layers') && !$('#layers').hidden && $('#layers').offsetWidth ? $('#layers').offsetWidth + 24 : 0), right: !mob && open ? 452 : 0, bottom: mob ? (open || story ? innerHeight * 0.5 : tlH() + 60) : tlH() });
    document.body.classList.toggle('card-open', open);
  }

  // ---- selection / navigation ----
  let stack = [], current = null;
  const sameSel = (a, b) => a && b && a.type === b.type && a.id === b.id;
  const onSelect = (type, id) => {
    if (type === 'route') { const r = D.routeById.get(id); if (r?.event && D.eventById.has(r.event)) return actions.select('event', r.event, { route: id }); }
    actions.select(type, id);
  };
  const historical = createHistorical({ D, map, reg, state, tip, onSelect });
  const ethno = createEthno({ D, map, reg, tip, ctx });
  const dl = createDataLayers({ D, map, reg, tip, ctx });
  createAdminLayers({ D, map, reg, tip, ctx });
  reg.arrange(['wm-suku-map', 'language-areas', 'ethnic-areas', 'admin-kab', 'admin-kec', 'admin-desa', 'rivers', 'borders', 'place-names', 'languages', 'ethnic-groups', 'wm-suku-labels', 'routes', 'peoples', 'events']);
  dl.applyCatalogue();
  const flyPts = (pts, o = {}) => (pts.length === 1 ? map.flyToView(pts[0], Math.max(lmap.getZoom(), o.zoom || 7.5), { duration: 1.2 }) : map.flyToBounds(pts, { pad: 70, maxZoom: 8, minZoom: 2, duration: 1.3 }));

  const actions = {
    select(type, id, opt = {}) {
      if (!opt.keepStack && current && !sameSel(current, { type, id }) && !opt.tour && !opt.reset) { if (type === 'people' || current.type === 'people') stack.push(current); else stack = []; }
      if (opt.tour || opt.reset) stack = [];
      current = { type, id };
      state.set({ selection: { type, id, route: opt.route || null } });
      $('#card').classList.add('open');
      if (type === 'event') {
        const e = D.eventById.get(id); if (!e) return;
        tl.ensureVisible(e.start, e.end ?? e.start);
        cards.openEvent(id); updateInsets();
        flyPts(historical.eventPoints(e));
        setTimeout(() => historical.zoomToEventMarker(id), 1500);
      } else if (type === 'people') {
        const p = D.peopleById.get(id); if (!p) return;
        cards.openPeople(id); updateInsets(); flyPts([[p.lat, p.lon]], { zoom: 7 });
      } else if (type === 'route') {
        cards.openRoute(id); updateInsets(); flyPts(historical.routePoints(id));
      }
    },
    flyRoute(id) {
      const r = D.routeById.get(id); if (!r) return;
      tl.ensureVisible(r.start, r.end ?? r.start);
      state.set({ selection: { ...state.get().selection, route: id } });
      flyPts(historical.routePoints(id));
    },
    close() { tour?.stop(); cards.close(); stack = []; current = null; state.set({ selection: null }); $('#card').classList.remove('open'); updateInsets(); },
    canBack: () => stack.length > 0,
    back() { const prev = stack.pop(); if (prev) actions.select(prev.type, prev.id, { keepStack: true, reset: false }); },
    step(dir) {
      const st = state.get(), evs = D.events;
      let i;
      if (st.selection?.type === 'event') i = D.eventById.get(st.selection.id)._i + dir;
      else {
        const anchor = st.window[1] > 1e9 ? 0 : (st.cumulative ? st.window[1] : (st.window[0] + st.window[1]) / 2);
        i = dir > 0 ? evs.findIndex(e => e.start > anchor) : (() => { let j = -1; evs.forEach((e, n) => { if (e.start < anchor) j = n; }); return j; })();
      }
      if (i < 0 || i >= evs.length) return;
      actions.select('event', evs[i].id, { reset: true });
    },
    openSources(query = '') { openModal('Sources', sourcesPanel(D, { actions, query }), { wide: true }); },
    openNotes() { openModal('Notes', notesPanel(D)); }
  };

  cards = createCards({ D, state, actions });
  $('#card').classList.remove('open');

  // ---- timeline, tour, panels ----
  tl = createTimeline({ D, state, scale, tip, onSelectEvent: id => actions.select('event', id, { reset: true }), onStep: d => actions.step(d) });
  tour = createTour({ D, actions });
  const layerPanel = createLayerPanel({ D, map, reg, state, dl, ctx });
  const analysis = createAnalysis({ D, map, reg, dl, state, tip, ctx });
  stories = createStories({ D, map, reg, state, historical, ctx });
  createDeclutter(lmap);
  ctx.beforeStory = () => { analysis.close(); $('#layers').classList.remove('sheet-open'); };
  const search = createSearch({ D, actions, reg, ethno, map, ctx });

  // ---- map init ----
  updateInsets();
  map.init();
  window.addEventListener('resize', () => { updateInsets(); tl.redraw(); });
  dl.restore();
  lmap.on('click', () => { $('#layers').classList.remove('sheet-open'); });

  // ---- top bar / tabs ----
  const showMore = anchor => {
    const pop = $('#popover');
    if (!pop.hidden) { pop.hidden = true; return; }
    pop.replaceChildren(el('div', { class: 'pop-h' }, 'More'), el('div', { class: 'more-list' },
      ...[['Questions (guided tour)', () => tour.togglePopover($('#tabbar'))], ['Peoples (new page)', () => { location.href = 'peoples.html'; }], ['Notes', () => actions.openNotes()], ['Archive', () => openArchive()], ['About', () => openAbout(D)]].map(([t, f]) => el('button', { class: 'btn', onclick: () => { pop.hidden = true; f(); } }, t))));
    pop.hidden = false;
  };
  $$('[data-open]').forEach(b => b.addEventListener('click', () => {
    const what = b.dataset.open;
    if (what === 'questions') tour.togglePopover(isMobile() ? $('#tabbar') : b);
    else if (what === 'sources') actions.openSources();
    else if (what === 'notes') actions.openNotes();
    else if (what === 'about') openAbout(D);
    else if (what === 'archive') openArchive();
    else if (what === 'analyse') { analysis.toggle(); $('#layers').classList.remove('sheet-open'); }
    else if (what === 'more') showMore(b);
  }));
  $('#btnHome').addEventListener('click', () => map.home());
  $('[data-tab="layers"]').addEventListener('click', () => { analysis.close(); $('#layers').classList.toggle('sheet-open'); });
  $('.modal-backdrop').addEventListener('click', () => closeModal());

  // ---- keyboard ----
  document.addEventListener('keydown', e => {
    const t = e.target, typing = t.matches?.('input, textarea, select, [contenteditable]');
    if (e.key === 'Escape') {
      if (modalOpen()) return closeModal();
      if (!$('#popover').hidden) { $('#popover').hidden = true; return; }
      if (lmap.pm.globalDrawModeEnabled?.()) { lmap.pm.disableDraw(); return; }
      if ($('#layers').classList.contains('sheet-open')) return $('#layers').classList.remove('sheet-open');
      if (stories.active()) return stories.exit();
      if (tour.active()) return tour.stop();
      if ($('#card').classList.contains('open')) return actions.close();
      if (analysis.isOpen()) return analysis.close();
      return;
    }
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '/') { e.preventDefault(); search.focus(); }
    else if (e.key === ' ' && !t.closest?.('button, a, [role="button"], .leaflet-marker-icon, .story-scroll')) { e.preventDefault(); tl.toggle(); }
    else if (e.key === 'ArrowRight' && !t.closest?.('.tl-svg, .band, .story-scroll, .leaflet-container')) { e.preventDefault(); actions.step(1); }
    else if (e.key === 'ArrowLeft' && !t.closest?.('.tl-svg, .band, .story-scroll, .leaflet-container')) { e.preventDefault(); actions.step(-1); }
  });

  // ---- hooks for automated audit / debugging ----
  window.vihVerifyAll = () => verifyAll(D.sources, { force: true });
  window.vih = { D, state, map, reg, actions, historical, ethno, dl, analysis, stories, layerPanel, tl, tip, ctx };

  document.body.classList.add('ready');
  $('#loading').classList.add('done');
  setTimeout(() => $('#loading').remove(), 700);
  // (v3) stories live on story.html; old #story= links are redirected by analyse.html's head script
}

boot().catch(err => {
  console.error('[boot]', err);
  const l = $('#loading'); if (l) { l.classList.add('error'); l.querySelector('span').textContent = 'Could not start: ' + err.message; }
});
