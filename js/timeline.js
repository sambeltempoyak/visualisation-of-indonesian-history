// timeline.js — the bottom "turn" bar: piecewise year scale, era bands, event ticks, draggable window brush,
// cumulative toggle, play/pause with speeds, current-era header.
import { el, clamp, formatYear, formatYearLong, formatRange, reducedMotion } from './util.js';
import { svgEl } from './util.js';

const WIDTHS = { deep: .10, austronesian: .12, indic: .16, commerce: .14, company: .14, colonial: .14, revolution: .08, nation: .12 };

/** Piecewise-linear scale: year ↔ fraction [0,1] of the bar, one segment per era. */
export function makeScale(eras) {
  let ws = eras.map(e => WIDTHS[e.id] ?? 0); const tot = ws.reduce((a, b) => a + b, 0);
  ws = tot > 0 && ws.every(v => v > 0) ? ws.map(v => v / tot) : eras.map(() => 1 / eras.length);
  let acc = 0; const segs = eras.map((e, i) => { const s = { era: e, f0: acc, f1: acc + ws[i] }; acc += ws[i]; return s; });
  const yearToFrac = y => {
    if (y <= eras[0].start) return 0; if (y >= eras[eras.length - 1].end) return 1;
    const s = segs.find(s => y < s.era.end) || segs[segs.length - 1];
    return s.f0 + (s.f1 - s.f0) * clamp((y - s.era.start) / (s.era.end - s.era.start), 0, 1);
  };
  const fracToYear = f => {
    f = clamp(f, 0, 1);
    const s = segs.find(s => f <= s.f1) || segs[segs.length - 1];
    return s.era.start + (s.era.end - s.era.start) * clamp((f - s.f0) / (s.f1 - s.f0), 0, 1);
  };
  const eraAtFrac = f => (segs.find(s => f < s.f1) || segs[segs.length - 1]).era;
  return { segs, yearToFrac, fracToYear, eraAtFrac };
}

export function createTimeline({ D, state, scale, tip, onSelectEvent, onStep }) {
  const root = document.getElementById('timeline');
  const MIN_W = 0.012;
  let W = 800, playing = false, speed = 1, lastT = 0;

  // ---------- header ----------
  const eraName = el('div', { class: 'era-name' }), eraYears = el('div', { class: 'era-years' });
  const btnPlay = el('button', { class: 'btn btn-round', 'aria-label': 'Play timeline', title: 'Play / pause (space)' }, '▶');
  const btnPrev = el('button', { class: 'btn btn-round btn-sm', 'aria-label': 'Previous event', title: 'Previous event (←)' }, '‹');
  const btnNext = el('button', { class: 'btn btn-round btn-sm', 'aria-label': 'Next event', title: 'Next event (→)' }, '›');
  const speeds = [1, 2, 4].map(s => el('button', { class: 'seg' + (s === 1 ? ' on' : ''), 'aria-label': `Speed ${s}×`, 'aria-pressed': s === 1, onclick: () => { speed = s; speeds.forEach((b, i) => { b.classList.toggle('on', [1, 2, 4][i] === s); b.setAttribute('aria-pressed', [1, 2, 4][i] === s); }); } }, s + '×'));
  const modeBtns = ['window', 'cumulative'].map(m => el('button', { class: 'seg', 'data-mode': m, 'aria-pressed': 'false', onclick: () => state.set({ cumulative: m === 'cumulative' }) }, m === 'window' ? 'Window' : 'Cumulative'));
  const winText = el('div', { class: 'win-text', 'aria-live': 'polite' });
  const head = el('div', { class: 'tl-head' },
    el('div', { class: 'tl-era' }, eraName, eraYears),
    el('div', { class: 'tl-controls' }, btnPrev, btnPlay, btnNext, el('div', { class: 'segs', role: 'group', 'aria-label': 'Playback speed' }, speeds), el('div', { class: 'segs', role: 'group', 'aria-label': 'Window mode' }, modeBtns), winText));
  const track = el('div', { class: 'tl-track' });
  root.replaceChildren(head, track);

  // ---------- svg ----------
  const svg = svgEl('svg', { class: 'tl-svg', role: 'group', 'aria-label': 'Timeline: drag the highlighted window to change the period shown' });
  track.append(svg);
  const gBands = svgEl('g', {}, svg), gTicks = svgEl('g', {}, svg), gBrush = svgEl('g', { class: 'brush' }, svg);
  const brushRect = svgEl('rect', { class: 'brush-body', y: 3, height: 62, rx: 8 }, gBrush);
  const hL = svgEl('rect', { class: 'brush-h', y: 14, width: 7, height: 40, rx: 3.5 }, gBrush), hR = svgEl('rect', { class: 'brush-h', y: 14, width: 7, height: 40, rx: 3.5 }, gBrush);
  const BAND_Y = 6, BAND_H = 26;
  let tickEls = [];

  function drawStatic() {
    W = Math.max(300, track.clientWidth);
    svg.setAttribute('width', W); svg.setAttribute('height', 86); svg.setAttribute('viewBox', `0 0 ${W} 86`);
    gBands.replaceChildren(); gTicks.replaceChildren(); tickEls = [];
    const eraOnClick = e => () => state.set({ cumulative: false, window: [e.start, e.end] });
    scale.segs.forEach((s, i) => {
      const x0 = s.f0 * W, x1 = s.f1 * W, g = svgEl('g', { class: 'band', tabindex: 0, role: 'button', 'aria-label': `${s.era.name}, ${formatYear(s.era.start)} to ${formatYear(s.era.end)}` }, gBands);
      svgEl('rect', { x: x0 + 1, y: BAND_Y, width: Math.max(1, x1 - x0 - 2), height: BAND_H, rx: 7, class: 'band-rect', style: `--i:${i}` }, g);
      const label = svgEl('text', { x: x0 + 9, y: BAND_Y + BAND_H / 2, class: 'band-label', 'dominant-baseline': 'central' }, g);
      label.textContent = s.era.name;
      // truncate to fit
      let txt = s.era.name; const maxW = x1 - x0 - 14;
      while (label.getComputedTextLength() > maxW && txt.length > 3) { txt = txt.slice(0, -1); label.textContent = txt.trimEnd() + '…'; }
      const yl = svgEl('text', { x: x0 + 2, y: 80, class: 'year-label' }, g); yl.textContent = formatYear(s.era.start);
      g.addEventListener('click', eraOnClick(s.era));
      g.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); eraOnClick(s.era)(); } });
      g.addEventListener('pointerenter', ev => tip.show(`<b>${s.era.name}</b><br><span>${formatYearLong(s.era.start)} – ${formatYearLong(s.era.end)}</span>`, ev));
      g.addEventListener('pointermove', ev => tip.move(ev)); g.addEventListener('pointerleave', () => tip.hide());
    });
    const last = svgEl('text', { x: W - 2, y: 80, class: 'year-label', 'text-anchor': 'end' }, gBands); last.textContent = 'today';
    D.events.forEach(e => {
      const th = D.themeById.get(e.theme), x = scale.yearToFrac(e.start) * W, lane = e._i % 3;
      const g = svgEl('g', { class: 'tick', tabindex: -1 }, gTicks);
      svgEl('line', { x1: x, x2: x, y1: 38 + lane * 7, y2: 38 + lane * 7 + 13, stroke: th?.color || '#CCD6E6', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g);
      svgEl('rect', { x: x - 4, y: 36, width: 8, height: 30, fill: 'transparent' }, g);
      g.addEventListener('pointerenter', ev => tip.show(`<b>${e.title}</b><br><span>${formatRange(e.start, e.end)}</span>`, ev));
      g.addEventListener('pointermove', ev => tip.move(ev)); g.addEventListener('pointerleave', () => tip.hide());
      g.addEventListener('click', ev => { ev.stopPropagation(); onSelectEvent(e.id); });
      g.addEventListener('pointerdown', ev => ev.stopPropagation());
      tickEls.push({ e, g });
    });
    gBrush.parentNode.append(gBrush); // keep brush above ticks
    paint(state.get());
  }

  // ---------- state → visuals ----------
  const fr = st => st.cumulative ? [0, scale.yearToFrac(st.window[1])] : [scale.yearToFrac(st.window[0]), scale.yearToFrac(st.window[1])];
  function paint(st) {
    const [f0, f1] = fr(st), x0 = f0 * W, x1 = f1 * W;
    brushRect.setAttribute('x', x0); brushRect.setAttribute('width', Math.max(6, x1 - x0));
    hL.setAttribute('x', x0 - 1); hR.setAttribute('x', x1 - 6); hL.style.display = st.cumulative ? 'none' : '';
    const era = scale.eraAtFrac(st.cumulative ? f1 : (f0 + f1) / 2);
    eraName.textContent = era.name;
    eraYears.textContent = `${formatYearLong(era.start)} – ${era.end >= 2026 ? 'today' : formatYearLong(era.end)}`;
    winText.textContent = st.cumulative ? `up to ${formatYear(st.window[1])}` : formatRange(st.window[0], st.window[1]);
    modeBtns.forEach(b => { const on = (b.dataset.mode === 'cumulative') === st.cumulative; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    const [w0, w1] = st.window;
    tickEls.forEach(({ e, g }) => {
      const inWin = st.cumulative ? e.start <= w1 : (e.start <= w1 && (e.end ?? e.start) >= w0);
      g.classList.toggle('in', inWin); g.classList.toggle('off', !st.themesOn.has(e.theme));
      g.classList.toggle('sel', st.selection?.type === 'event' && st.selection.id === e.id);
    });
    root.classList.toggle('is-cumulative', st.cumulative);
  }
  state.on((s, p) => { if (s.window !== p.window || s.cumulative !== p.cumulative || s.themesOn !== p.themesOn || s.selection !== p.selection) paint(s); });

  // ---------- brush dragging ----------
  let drag = null;
  const setFracs = (f0, f1) => {
    const st = state.get();
    f1 = clamp(f1, MIN_W, 1); f0 = clamp(f0, 0, f1 - MIN_W);
    state.set({ window: [scale.fracToYear(f0), scale.fracToYear(f1)] });
  };
  const xOf = ev => { const r = svg.getBoundingClientRect(); return (ev.clientX - r.left) / W; };
  function onDown(kind) {
    return ev => {
      ev.preventDefault(); ev.stopPropagation(); stopPlay();
      const st = state.get(), [f0, f1] = fr(st);
      drag = { kind, x: xOf(ev), f0, f1, cum: st.cumulative };
      svg.setPointerCapture?.(ev.pointerId); tip.hide();
    };
  }
  brushRect.addEventListener('pointerdown', onDown('body')); hL.addEventListener('pointerdown', onDown('l')); hR.addEventListener('pointerdown', onDown('r'));
  svg.addEventListener('pointermove', ev => {
    if (!drag) return;
    const dx = xOf(ev) - drag.x;
    if (drag.cum) { setFracs(0, drag.f1 + dx); return; }
    if (drag.kind === 'body') { const w = drag.f1 - drag.f0; const a = clamp(drag.f0 + dx, 0, 1 - w); setFracs(a, a + w); }
    else if (drag.kind === 'l') setFracs(drag.f0 + dx, drag.f1);
    else setFracs(drag.f0, drag.f1 + dx);
  });
  const up = () => { drag = null; };
  svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
  svg.addEventListener('keydown', ev => { /* arrows handled globally */ });
  // click on empty track: centre the window there
  svg.addEventListener('pointerdown', ev => {
    if (ev.target.closest && (ev.target.closest('.brush') || ev.target.closest('.tick') || ev.target.closest('.band'))) return;
    const f = xOf(ev), [f0, f1] = fr(state.get()), w = f1 - f0;
    const a = clamp(f - w / 2, 0, 1 - w); setFracs(state.get().cumulative ? 0 : a, state.get().cumulative ? f : a + w);
  });

  // ---------- playback ----------
  function tick(t) {
    if (!playing) return;
    const dt = Math.min(0.1, (t - lastT) / 1000); lastT = t;
    const st = state.get(), [f0, f1] = fr(st), step = dt * speed / 45;
    if (f1 >= 1 - 1e-4) { stopPlay(); return; }
    const nf1 = Math.min(1, f1 + step);
    if (st.cumulative) setFracs(0, nf1); else { const w = f1 - f0; setFracs(nf1 - w, nf1); }
    requestAnimationFrame(tick);
  }
  function startPlay() {
    const st = state.get(), [, f1] = fr(st);
    if (f1 >= 1 - 1e-3) { // restart from the beginning
      const [f0] = fr(st), w = st.cumulative ? 0.1 : f1 - f0; setFracs(0, Math.max(w, MIN_W * 2));
    }
    playing = true; lastT = performance.now(); btnPlay.textContent = '❚❚'; btnPlay.setAttribute('aria-label', 'Pause timeline'); root.classList.add('playing');
    requestAnimationFrame(tick);
  }
  function stopPlay() { playing = false; btnPlay.textContent = '▶'; btnPlay.setAttribute('aria-label', 'Play timeline'); root.classList.remove('playing'); }
  btnPlay.addEventListener('click', () => playing ? stopPlay() : startPlay());
  btnPrev.addEventListener('click', () => onStep(-1)); btnNext.addEventListener('click', () => onStep(1));

  new ResizeObserver(() => drawStatic()).observe(track);
  drawStatic();
  return {
    scale, toggle: () => playing ? stopPlay() : startPlay(), stop: stopPlay, isPlaying: () => playing, redraw: drawStatic,
    /** make sure the interval [a,b] is inside the current window; slide the window (keeping its width) if not */
    ensureVisible(a, b = a) {
      const st = state.get(), [w0, w1] = st.window;
      if (st.cumulative) { if (a > w1) setFracs(0, scale.yearToFrac(Math.min(2026, a + 1))); return; }
      if (a <= w1 && b >= w0) return;
      const [f0, f1] = fr(st), w = f1 - f0, c = scale.yearToFrac(a);
      const s = clamp(c - w / 2, 0, 1 - w); setFracs(s, s + w);
    }
  };
}
