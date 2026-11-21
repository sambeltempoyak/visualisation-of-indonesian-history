// story/ui.js — DOM pieces: picker, title panel, year counter, slide card (legend, sources), chronology ribbon, overview.
import { el, esc, reducedMotion, isMobile, clamp } from '../core/util.js';
import { FLOWS, AREAS, GLYPHS, TIER, glyphSvg, flowColor } from '../core/symbols.js';
import { BASEMAPS } from '../core/basemaps.js';
import { loadSources, tierOf } from './data.js';

const ICON = {
  prev: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  play: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.2"/><rect x="13.5" y="5" width="4" height="14" rx="1.2"/></svg>',
  grid: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>',
  layers: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/></svg>'
};
const cap = s => String(s).charAt(0).toUpperCase() + String(s).slice(1);
const sameYearSpan = ([a, b]) => `${fmtY(a)}${a === b ? '' : '–' + fmtY(b)}`;
export const fmtY = y => { const r = Math.round(y); return r <= 0 ? `${Math.abs(r) || 1}<small> BCE</small>` : String(r); };
const plainFmt = y => { const r = Math.round(y); return r <= 0 ? `${Math.abs(r) || 1} BCE` : String(r); };
const yearText = ([a, b]) => a === b ? plainFmt(a) : `${plainFmt(a)}–${plainFmt(b)}`;

/* ============================== picker ============================== */
export function buildPicker(list, missingId) {
  const root = el('div', { class: 'vs-picker' });
  root.append(
    el('header', { class: 'pk-head' },
      el('a', { class: 'b ghost sm pk-back', href: 'index.html' }, '← All modes'),
      el('div', { class: 'pk-kick' }, 'Visualisation of Indonesian History'),
      el('h1', { class: 'g-title on-light' }, 'Stories'),
      el('p', { class: 'pk-lead' }, 'Pick a story and let it play: one slide at a time, in chronological order, with a map that moves, a year counter, and every slide citing its sources.')));
  if (missingId) root.querySelector('.pk-head').append(el('p', { class: 'pk-warn' }, `No story called “${missingId}” was found. Pick one below.`));
  const grid = el('div', { class: 'pk-grid' });
  if (!list.length) grid.append(el('p', { class: 'pk-empty' }, 'No stories have been published yet.'));
  list.forEach((s, i) => {
    const n = s.slides ?? s.chapters, span = s.span && s.span.length ? yearText(s.span) : '';
    grid.append(el('a', { class: 'pk-card on-dark', href: `#${s.id}/0`, style: `--i:${i}` },
      el('div', { class: 'pk-card-in' },
        el('div', { class: 'pk-meta' }, span && el('span', { class: 'chip' }, span), n && el('span', { class: 'chip' }, `${n} slides`)),
        el('h2', { class: 'g-title on-dark' }, s.title),
        s.subtitle && el('p', { class: 'pk-sub' }, s.subtitle),
        s.cover && !/^(https?:|data\/|\.\/|\/)/.test(s.cover) && el('p', { class: 'pk-cover' }, s.cover),
        el('div', { class: 'pk-foot' }, el('span', { class: 'pk-by' }, s.author || ''), el('span', { class: 'b sm pk-go' }, 'Play ▶')))));
  });
  root.append(grid);
  return root;
}

/* ============================== the HUD ============================== */
export class Hud {
  /** h = { go(i), toggle(), basemap(id), onInteract() } */
  constructor(root, story, entry, h) {
    this.root = root; this.story = story; this.h = h; this.n = story.slides.length; this.i = -1; this.shownYear = null; this.yearRaf = 0;
    const S = story.slides;
    // ---- tick positions: blend of linear-by-year and evenly spaced (rank preserving) ----
    const mids = S.map(s => (s.year[0] + s.year[1]) / 2), y0 = Math.min(...mids), y1 = Math.max(...mids);
    this.pos = [0, ...mids.map((m, k) => .05 + .95 * (.5 * ((m - y0) / ((y1 - y0) || 1)) + .5 * (this.n > 1 ? k / (this.n - 1) : 1)))];

    root.innerHTML = '';
    this.top = el('header', { class: 'vs-top' });
    this.top.append(
      el('div', { class: 'vs-pill glass-dark' }, el('a', { class: 'tp-a', href: 'index.html' }, '← All modes'), el('span', { class: 'tp-sep' }), el('a', { class: 'tp-a tp-stories', href: 'story.html' }, 'Stories')),
      el('div', { class: 'vs-tools' }, this.baseMenu(), el('button', { class: 'vs-pill glass-dark tp-a', type: 'button', onclick: () => this.openOverview() }, el('span', { html: ICON.grid }), el('span', { class: 'hm' }, 'Overview')),
        el('a', { class: 'vs-pill glass-dark tp-a', href: 'analyse.html' }, el('span', { class: 'hm' }, 'Open in '), 'Analyse ↗')));
    this.year = el('div', { class: 'vs-year glass-dark', hidden: true, 'aria-live': 'polite' }, el('div', { class: 'yr-num g-title on-dark' }), el('div', { class: 'yr-cap' }));
    this.card = el('section', { class: 'vs-card glass-dark', hidden: true, 'aria-label': 'Slide' });
    this.titleP = this.buildTitle(entry);
    this.rib = this.buildRibbon();
    this.over = el('div', { class: 'vs-over', hidden: true, role: 'dialog', 'aria-modal': 'true', 'aria-label': 'All slides' });
    this.pop = el('div', { class: 'vs-srcpop glass-light', hidden: true, role: 'dialog' });
    this.tip = el('div', { class: 'vs-ribtip glass-dark', hidden: true });
    root.append(this.top, this.year, this.card, this.titleP, this.rib, this.over, this.pop, this.tip);
    this.swipe();
    document.addEventListener('pointerdown', e => { if (!this.pop.hidden && !this.pop.contains(e.target) && !e.target.closest('.src')) this.closePop(); if (this.menu && !this.menu.hidden && !e.target.closest('.vs-basewrap')) this.menu.hidden = true; });
  }

  /* ---- basemap chip menu ---- */
  baseMenu() {
    const wrap = el('div', { class: 'vs-basewrap' });
    this.baseBtn = el('button', { class: 'vs-pill glass-dark tp-a', type: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false', onclick: () => { this.menu.hidden = !this.menu.hidden; this.baseBtn.setAttribute('aria-expanded', String(!this.menu.hidden)); } });
    this.menu = el('div', { class: 'vs-menu glass-dark', hidden: true, role: 'menu' });
    ['relief', 'imagery', 'dusk'].forEach(id => this.menu.append(el('button', { class: 'vs-mi', type: 'button', role: 'menuitemradio', 'data-id': id, onclick: () => { this.menu.hidden = true; this.h.basemap(id); } }, BASEMAPS[id].name)));
    wrap.append(this.baseBtn, this.menu); return wrap;
  }
  setBasemapLabel(id) {
    this.baseBtn.innerHTML = `${ICON.layers}<span>${BASEMAPS[id]?.name || id}</span><span aria-hidden="true">▾</span>`;
    this.menu.querySelectorAll('.vs-mi').forEach(b => { const on = b.dataset.id === id; b.setAttribute('aria-checked', on); b.classList.toggle('on', on); });
  }

  /* ---- title slide ---- */
  buildTitle(entry) {
    const s = this.story, n = this.n, sp = s.span;
    const p = el('section', { class: 'vs-title glass-dark', hidden: true });
    p.append(
      el('div', { class: 'tt-kick' }, [s.author, s.date].filter(Boolean).join(' · ') || 'A story'),
      el('h1', { class: 'tt-h g-title on-dark' }, s.title),
      s.subtitle && el('p', { class: 'tt-sub' }, s.subtitle),
      el('div', { class: 'tt-intro' }, (s.intro || entry.cover || '').split(/\n\s*\n/).filter(Boolean).map(t => el('p', {}, t))),
      el('div', { class: 'tt-meta' }, el('span', { class: 'chip' }, `${n} slides`), sp[0] !== sp[1] && el('span', { class: 'chip' }, yearText(sp))),
      el('div', { class: 'tt-act' }, el('button', { class: 'b tt-begin', type: 'button', onclick: () => this.h.go(1, true) }, 'Begin ▶'),
        el('span', { class: 'tt-hint hm' }, '← → keys or swipe · Space plays')),
      el('p', { class: 'tt-foot' }, 'Every slide cites its sources: ✓ peer-reviewed · A academic (thesis, university) · ◆ primary record.'));
    return p;
  }

  /* ---- ribbon ---- */
  buildRibbon() {
    const S = this.story.slides, rb = el('nav', { class: 'vs-rib glass-dark', 'aria-label': 'Chronology' });
    this.bPrev = el('button', { class: 'b round', type: 'button', 'aria-label': 'Previous slide', html: ICON.prev, onclick: () => this.h.step(-1) });
    this.bPlay = el('button', { class: 'b round rb-play', type: 'button', 'aria-label': 'Play', html: ICON.play, onclick: () => this.h.toggle() });
    this.bNext = el('button', { class: 'b round', type: 'button', 'aria-label': 'Next slide', html: ICON.next, onclick: () => this.h.step(1) });
    this.track = el('div', { class: 'rb-track', role: 'slider', 'aria-label': 'Slide', 'aria-valuemin': 0, 'aria-valuemax': this.n, tabindex: '-1' });
    const inner = this.inner = el('div', { class: 'rb-in' });
    this.fill = el('div', { class: 'rb-fill' });
    inner.append(el('div', { class: 'rb-line' }), this.fill);
    this.ticks = this.pos.map((p, k) => el('span', { class: 'rb-tick' + (k === 0 ? ' rb-home' : ''), style: `left:${(p * 100).toFixed(3)}%` }));
    inner.append(...this.ticks); this.track.append(inner);
    const near = x => { const r = inner.getBoundingClientRect(); let b = 0, bd = 1e9; this.pos.forEach((p, k) => { const d = Math.abs(r.left + p * r.width - x); if (d < bd) { bd = d; b = k; } }); return b; };
    this.track.addEventListener('click', e => { this.h.go(near(e.clientX), true); });
    this.track.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; this.showTip(near(e.clientX)); });
    this.track.addEventListener('pointerleave', () => { this.tip.hidden = true; });
    const a = el('span', { class: 'rb-end hm' }, plainFmt(this.story.span[0])), z = el('span', { class: 'rb-end hm' }, plainFmt(this.story.span[1]));
    this.count = el('span', { class: 'rb-count' });
    rb.append(this.bPrev, this.bPlay, this.bNext, a, this.track, z, this.count);
    return rb;
  }
  showTip(k) {
    const s = this.story.slides[k - 1], r = this.ticks[k].getBoundingClientRect();
    this.tip.innerHTML = k === 0 ? `<b>Title</b> ${esc(this.story.title)}` : `<b>${esc(s.label || yearText(s.year))}</b> · ${esc(s.title)}`;
    this.tip.hidden = false;
    const w = this.tip.offsetWidth; this.tip.style.left = clamp(r.left + r.width / 2 - w / 2, 8, innerWidth - w - 8) + 'px'; this.tip.style.top = (this.rib.getBoundingClientRect().top - this.tip.offsetHeight - 10) + 'px';
  }

  /* ---- state ---- */
  setPlaying(on) { this.playing = on; this.bPlay.innerHTML = on ? ICON.pause : ICON.play; this.bPlay.setAttribute('aria-label', on ? 'Pause' : 'Play'); this.rib.classList.toggle('is-playing', on); if (!on) this.setProgress(0); }
  setProgress(p) {
    this.bPlay.style.setProperty('--pp', p.toFixed(4));
    const c = this.pos[Math.max(0, this.i)], nx = this.pos[Math.min(this.n, this.i + 1)] ?? c;
    this.fill.style.width = ((c + (nx - c) * p) * 100).toFixed(3) + '%';
  }
  showTitleSlide() {
    this.i = 0; this.titleP.hidden = true; void this.titleP.offsetWidth; this.titleP.hidden = false; this.titleP.classList.remove('vs-enter'); void this.titleP.offsetWidth; this.titleP.classList.add('vs-enter');
    this.card.hidden = true; this.year.hidden = true; this.shownYear = null; this.closePop();
    this.root.classList.add('is-title'); this.root.classList.remove('is-slide');
    this.mark(0);
  }
  mark(i) {
    this.ticks.forEach((t, k) => { t.classList.toggle('on', k === i); t.classList.toggle('past', k < i); });
    this.fill.style.width = (this.pos[i] * 100).toFixed(3) + '%'; this.bPlay.style.setProperty('--pp', 0);
    this.bPrev.disabled = i <= 0; this.bNext.disabled = i >= this.n;
    this.count.textContent = i === 0 ? `0 / ${this.n}` : `${i} / ${this.n}`;
    this.track.setAttribute('aria-valuenow', i); this.track.setAttribute('aria-valuetext', i ? `Slide ${i} of ${this.n}` : 'Title');
  }
  showSlide(i, { animateYear = true } = {}) {
    const s = this.story.slides[i - 1];
    this.i = i; this.titleP.hidden = true; this.card.hidden = false; this.year.hidden = false; this.closePop();
    this.root.classList.remove('is-title'); this.root.classList.add('is-slide');
    this.renderCard(s, i); this.setYear(s, animateYear); this.mark(i);
  }

  /* ---- year counter ---- */
  setYear(s, animate) {
    const to = s.year.slice(), num = this.year.querySelector('.yr-num'), capEl = this.year.querySelector('.yr-cap');
    const label = String(s.label || '').trim(), norm = t => t.replace(/[\s\u2013\u2014-]+/g, '').toLowerCase(), plain = /^-?\d+$/.test(label) || norm(label) === norm(yearText(to));
    capEl.textContent = !label || plain ? '' : label; capEl.hidden = !capEl.textContent;
    this.year.classList.toggle('is-span', to[0] !== to[1]);
    const draw = v => { num.innerHTML = v[0] === v[1] ? fmtY(v[0]) : `${fmtY(v[0])}<span class="yr-dash">–</span>${fmtY(v[1])}`; };
    cancelAnimationFrame(this.yearRaf);
    const from = this.shownYear; this.shownYear = to;
    if (!from || !animate || reducedMotion()) { draw(to); return; }
    const f0 = this.curYear || from, t0 = performance.now(), D = 900, ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const tick = now => {
      const t = clamp((now - t0) / D, 0, 1), k = ease(t);
      this.curYear = [f0[0] + (to[0] - f0[0]) * k, f0[1] + (to[1] - f0[1]) * k];
      draw(t >= 1 ? to : this.curYear.map(Math.round));
      if (t < 1) this.yearRaf = requestAnimationFrame(tick); else this.curYear = null;
    };
    this.yearRaf = requestAnimationFrame(tick);
  }

  /* ---- card ---- */
  renderCard(s, i) {
    const c = this.card; c.innerHTML = ''; c.scrollTop = 0;
    const body = el('div', { class: 'cd-body' });
    body.append(el('div', { class: 'cd-kick' }, `Slide ${i} of ${this.n}`), el('h2', { class: 'cd-h g-title on-dark' }, s.title),
      el('div', { class: 'cd-text' }, String(s.text).split(/\n\s*\n/).filter(Boolean).map(t => el('p', {}, t))));
    if (s.more) {
      const more = el('div', { class: 'cd-more', hidden: true }, String(s.more).split(/\n\s*\n/).filter(Boolean).map(t => el('p', {}, t)));
      const btn = el('button', { class: 'b ghost sm cd-morebtn', type: 'button', 'aria-expanded': 'false', onclick: () => { more.hidden = !more.hidden; btn.setAttribute('aria-expanded', String(!more.hidden)); btn.textContent = more.hidden ? 'Read more' : 'Show less'; this.h.onInteract?.(); } }, 'Read more');
      body.append(btn, more);
    }
    if (s.sources.length) {
      const row = el('div', { class: 'cd-src' }, el('span', { class: 'cd-lab' }, 'Sources'));
      s.sources.forEach(src => {
        const t = TIER[src.tier] ? src.tier : 'other', T = TIER[t];
        const txt = src.cite || [src.id, src.pages].filter(Boolean).join(', ');
        const b = el('button', { class: 'chip src', type: 'button', 'aria-haspopup': 'dialog', title: `${T.t} source`, onclick: e => { e.stopPropagation(); this.h.onInteract?.(); this.openSource(b, src); } },
          el('span', { class: `tier ${T.c}`, 'aria-label': T.t }, T.g), el('span', { class: 'src-t' }, txt));
        row.append(b);
      });
      body.append(row);
    }
    const lg = this.legend(s); if (lg) body.append(lg);
    c.append(body); c.classList.remove('vs-enter'); void c.offsetWidth; c.classList.add('vs-enter');
  }
  legend(s) {
    const fl = [...new Set(s.flows.map(f => FLOWS[f.kind] ? f.kind : 'trade'))], ar = [...new Set(s.areas.map(a => AREAS[a.role] ? a.role : 'focus'))], pl = [...new Set(s.places.map(p => GLYPHS[p.kind] ? p.kind : 'village'))];
    if (!fl.length && !ar.length && !pl.length) return null;
    const wrap = el('div', { class: 'cd-legend', role: 'group', 'aria-label': 'Map legend' });
    fl.forEach(k => { const st = FLOWS[k], col = flowColor(k, true), d = st.dash.map(v => v * .9 + (st.cap === 'round' ? 2 : 0)).join(' ');
      wrap.append(el('span', { class: 'lg', html: `<svg width="30" height="10" viewBox="0 0 30 10" aria-hidden="true"><line x1="1" y1="5" x2="29" y2="5" stroke="${col}" stroke-width="3" stroke-linecap="${st.cap}" stroke-dasharray="${d}"/></svg><span>${esc(st.label)}</span>` })); });
    ar.forEach(k => { const st = AREAS[k], stroke = st.strokeDark, fill = String(st.fill).startsWith('url(') ? (k === 'claim' ? `repeating-linear-gradient(45deg, ${stroke} 0 2px, rgba(204,214,230,.2) 2px 6px)` : `repeating-linear-gradient(-35deg, ${st.strokeDark} 0 3px, rgba(238,222,209,.3) 3px 7px)`) : (st.fillDark || st.fill);
      wrap.append(el('span', { class: 'lg' }, el('i', { class: 'lg-sw', style: `background:${fill};border:${Math.max(1.5, st.weight)}px ${st.dash ? 'dashed' : 'solid'} ${stroke}` }), el('span', {}, st.label))); });
    pl.forEach(k => wrap.append(el('span', { class: 'lg', html: `<span class="lg-gl">${glyphSvg(k, 14)}</span><span>${cap(k)}</span>` })));
    return wrap;
  }

  /* ---- source popover ---- */
  async openSource(btn, entry) {
    this.pop.hidden = false; this.pop.innerHTML = '<p class="sp-load">Loading bibliography…</p>'; this.placePop(btn);
    const map = await loadSources(), src = map.get(entry.id), t = tierOf(src, entry), T = TIER[t] || TIER.other;
    const refParts = src ? [
      src.authors && `${esc(src.authors)}${src.year ? ` (${src.year}).` : '.'}`, src.title && `<i>${esc(src.title)}</i>.`,
      src.container && src.container !== src.publisher && `${esc(src.container)}.`, src.publisher && `${esc(src.publisher)}.`].filter(Boolean).join(' ') : '';
    const link = src ? (src.doi ? `https://doi.org/${encodeURI(src.doi)}` : /^https?:/.test(src.url || '') ? src.url : '') : '';
    this.pop.innerHTML = `<div class="sp-h"><span class="tier ${T.c}">${T.g}</span> ${esc(T.t)}${src?.library === 'mendeley' ? ' · Ejak’s library' : ''}</div>
      <p class="sp-ref">${refParts || `No bibliography entry found for <b>${esc(entry.id || entry.cite || '?')}</b>.`}</p>
      ${entry.pages ? `<p class="sp-pg">Cited: ${esc(entry.pages)}</p>` : (entry.cite ? `<p class="sp-pg">Cited as: ${esc(entry.cite)}</p>` : '')}
      ${src?.note ? `<p class="sp-note">${esc(src.note)}</p>` : ''}
      ${link ? `<a class="b sm sp-link" target="_blank" rel="noopener" href="${esc(link)}">${src.doi ? 'DOI' : 'Open link'} ↗</a>` : ''}
      <button class="sp-x" type="button" aria-label="Close">×</button>`;
    this.pop.querySelector('.sp-x').onclick = () => this.closePop();
    this.placePop(btn);
  }
  placePop(btn) {
    const r = btn.getBoundingClientRect(), p = this.pop; p.style.left = '0px'; p.style.top = '0px';
    const w = p.offsetWidth, h = p.offsetHeight;
    let top = r.top - h - 10; if (top < 8) top = Math.min(innerHeight - h - 8, r.bottom + 10);
    p.style.left = clamp(r.left, 8, innerWidth - w - 8) + 'px'; p.style.top = top + 'px';
  }
  closePop() { this.pop.hidden = true; }

  /* ---- overview ---- */
  openOverview() {
    const S = this.story.slides, o = this.over; o.innerHTML = ''; this.h.onInteract?.();
    const panel = el('div', { class: 'ov-panel glass-dark' }, el('div', { class: 'ov-head' }, el('h2', { class: 'g-title on-dark' }, 'All slides'), el('button', { class: 'b ghost sm ov-x', type: 'button', onclick: () => this.closeOverview() }, 'Close ✕')));
    const grid = el('div', { class: 'ov-grid' });
    grid.append(el('button', { class: 'ov-card ov-title' + (this.i === 0 ? ' on' : ''), type: 'button', onclick: () => { this.closeOverview(); this.h.go(0, true); } }, el('span', { class: 'ov-yr' }, 'Title'), el('span', { class: 'ov-t' }, this.story.title)));
    S.forEach((s, k) => grid.append(el('button', { class: 'ov-card' + (this.i === k + 1 ? ' on' : ''), type: 'button', onclick: () => { this.closeOverview(); this.h.go(k + 1, true); } },
      el('span', { class: 'ov-n' }, String(k + 1)), el('span', { class: 'ov-yr' }, s.label || yearText(s.year)), el('span', { class: 'ov-t' }, s.title))));
    panel.append(grid); o.append(panel); o.hidden = false;
    (grid.querySelector('.on') || grid.firstChild).focus({ preventScroll: false });
  }
  closeOverview() { this.over.hidden = true; }
  anyOpen() { return !this.over.hidden || !this.pop.hidden || (this.menu && !this.menu.hidden); }
  closeAll() { const was = this.anyOpen(); this.closeOverview(); this.closePop(); this.menu.hidden = true; return was; }

  /* ---- swipe on the card ---- */
  swipe() {
    let x0, y0, t0;
    const c = this.card, onEnd = (x, y) => { const dx = x - x0, dy = y - y0; if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6 && Date.now() - t0 < 700) this.h.step(dx < 0 ? 1 : -1, true); };
    c.addEventListener('touchstart', e => { const t = e.changedTouches[0]; x0 = t.clientX; y0 = t.clientY; t0 = Date.now(); }, { passive: true });
    c.addEventListener('touchend', e => { const t = e.changedTouches[0]; onEnd(t.clientX, t.clientY); }, { passive: true });
  }

  /** Visible-rect padding for the camera: [top, right, bottom, left] in px. */
  pad() {
    const mob = isMobile(), W = innerWidth, H = innerHeight, rib = this.rib.offsetHeight + parseFloat(getComputedStyle(this.rib).bottom || 0);
    if (this.i === 0) {
      if (mob) return [70, 10, Math.min(H * .62, this.titleP.offsetHeight + 20) + rib * 0, 10];
      return [70, 40, rib + 20, Math.min(W * .5, this.titleP.offsetWidth + 70)];
    }
    if (mob) return [this.year.offsetTop + this.year.offsetHeight + 14, 10, this.card.offsetHeight + rib + 14, 10];
    return [76, 60, rib + 24, this.card.offsetWidth + parseFloat(getComputedStyle(this.card).left || 20) + 24];
  }
}
