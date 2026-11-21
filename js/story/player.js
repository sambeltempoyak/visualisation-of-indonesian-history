// story/player.js — slide state, hash, autoplay, keyboard.
import { reducedMotion } from '../core/util.js';
import { Hud } from './ui.js';

export class Player {
  constructor({ root, stage, story, entry }) {
    this.stage = stage; this.story = story; this.n = story.slides.length; this.i = -1; this.playing = false; this.raf = 0; this.gen = 0;
    this.hud = new Hud(root, story, entry, {
      go: (i, user) => this.go(i, user), step: (d, user) => this.go(this.i + d, true), toggle: () => this.toggle(),
      basemap: id => this.setBasemap(id), onInteract: () => this.stop()
    });
    this.hud.setBasemapLabel(stage.baseId);
    this.onKey = e => this.key(e); addEventListener('keydown', this.onKey, true);
    this.onResize = () => { clearTimeout(this.rz); this.rz = setTimeout(() => this.i >= 0 && this.stage.map.invalidateSize(), 200); }; addEventListener('resize', this.onResize);
    // any pointer press on the map or card pauses autoplay
    this.onPtr = e => { if (this.playing && e.target.closest('#map, .vs-card, .vs-title')) this.stop(); };
    root.addEventListener('pointerdown', this.onPtr, true);
    this.root = root;
  }
  destroy() { this.stop(); cancelAnimationFrame(this.raf); removeEventListener('keydown', this.onKey, true); removeEventListener('resize', this.onResize); this.root.removeEventListener('pointerdown', this.onPtr, true); }

  go(i, user = false, { instant = false } = {}) {
    i = Math.max(0, Math.min(this.n, i)); if (user) this.stop();
    const first = this.i < 0, prev = this.i; this.i = i; const gen = ++this.gen;
    history.replaceState(null, '', `#${this.story.id}/${i}`);
    this.hud.closeAll();
    if (i === 0) { this.hud.showTitleSlide(); this.stage.showTitle(this.story, this.hud.pad(), instant || first); }
    else {
      this.hud.showSlide(i, { animateYear: prev > 0 });
      this.stage.showSlide(this.story.slides[i - 1], this.hud.pad(), { instant: instant || first });
    }
    if (this.playing) this.schedule(gen);
  }
  setBasemap(id) {
    this.stage.setBasemap(id); this.hud.setBasemapLabel(id);
    if (this.i > 0) this.stage.showSlide(this.story.slides[this.i - 1], this.hud.pad(), { still: true });
  }

  // ---- autoplay ----
  toggle() { this.playing ? this.stop() : this.play(); }
  play() {
    if (this.playing) return; this.playing = true; this.hud.setPlaying(true);
    if (this.i >= this.n) this.go(1); else if (this.i === 0) this.go(1); else this.schedule(this.gen);
  }
  stop() { if (!this.playing) return; this.playing = false; cancelAnimationFrame(this.raf); this.hud.setPlaying(false); }
  schedule(gen) {
    cancelAnimationFrame(this.raf);
    const s = this.story.slides[this.i - 1]; if (!s) return;
    const ms = Math.max(7000, (s.words || 0) / 3.2 * 1000) + (reducedMotion() ? 0 : 1600), t0 = performance.now();
    const tick = now => {
      if (!this.playing || gen !== this.gen) return;
      const p = Math.min(1, (now - t0) / ms); this.hud.setProgress(p);
      if (p >= 1) { if (this.i >= this.n) { this.stop(); return; } this.go(this.i + 1); return; }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  // ---- keyboard ----
  key(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key, tag = (e.target.tagName || '').toLowerCase();
    if (k === 'Escape') { if (this.hud.closeAll()) e.preventDefault(); return; }
    if (!this.hud.over.hidden) return;                      // overview handles its own focus/tab
    if (k === ' ' || k === 'Spacebar') { if (tag === 'button' || tag === 'a' || tag === 'input') return; e.preventDefault(); this.toggle(); return; }
    const go = d => { e.preventDefault(); this.go(this.i + d, true); };
    if (k === 'ArrowRight' || k === 'PageDown') go(1);
    else if (k === 'ArrowLeft' || k === 'PageUp') go(-1);
    else if (k === 'Home') { e.preventDefault(); this.go(0, true); }
    else if (k === 'End') { e.preventDefault(); this.go(this.n, true); }
  }
}
