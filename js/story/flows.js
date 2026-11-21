// story/flows.js — one animated flow: glow underlay + line (draw-in, then marching dashes) + arrowhead + label pill.
import { FLOWS, flowColor } from '../core/symbols.js';
import { smoothPath } from '../core/geo.js';
import { reducedMotion, esc } from '../core/util.js';

const cumulative = pts => { const d = [0]; for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return d; };

export class Flow {
  constructor(map, renderer, f, { dark = false, delay = 0 } = {}) {
    this.map = map; this.f = f; this.dead = false; this.timers = [];
    const kind = FLOWS[f.kind] ? f.kind : 'trade', st = FLOWS[kind], color = flowColor(kind, dark);
    this.kind = kind; this.color = color;
    const pts = smoothPath(f.path); this.pts = pts;
    const w = 1.5 + Math.max(1, Math.min(4, +f.weight || 2)) * 1.2, still = reducedMotion();
    // dash pattern scaled to line width; round caps need the gap widened by the cap
    const s = Math.max(.8, w / 3), pat = st.dash.map((v, i) => v * s + (i % 2 && st.cap === 'round' ? w : 0));
    const sum = pat.reduce((a, b) => a + b, 0);
    this.glow = L.polyline(pts, { renderer, interactive: false, color, weight: w * 3, opacity: .18, lineCap: 'round', lineJoin: 'round', className: 'vs-glow', smoothFactor: 1 }).addTo(map);
    this.line = L.polyline(pts, { renderer, interactive: false, color, weight: w, opacity: .96, lineCap: st.cap, lineJoin: 'round', className: 'vs-flow', smoothFactor: 1 }).addTo(map);
    const g = this.glow.getElement(), p = this.line.getElement();
    g.style.opacity = 0; g.style.transition = `opacity .9s ease ${delay}ms`;
    requestAnimationFrame(() => { if (!this.dead) g.style.opacity = 1; });
    const flowOn = () => {
      if (this.dead) return;
      p.style.transition = ''; p.style.strokeDasharray = pat.join(' '); p.style.strokeDashoffset = '0';
      if (!still) { p.style.setProperty('--dl', sum + 'px'); p.style.setProperty('--dur', (sum / st.speed).toFixed(2) + 's'); p.classList.add('vs-flowing'); }
    };
    // arrowhead + label markers
    this.arrow = L.marker(pts[pts.length - 1], { icon: L.divIcon({ className: 'vs-arrow-wrap', iconSize: [0, 0], html: `<svg class="vs-arrow" viewBox="-12 -12 24 24" width="${16 + w * 1.5}" height="${16 + w * 1.5}" aria-hidden="true"><path d="M-7 -7 L8 0 L-7 7 L-3 0Z" fill="${color}" stroke="${dark ? 'rgba(30,36,38,.7)' : 'rgba(246,244,239,.9)'}" stroke-width="1.6" stroke-linejoin="round"/></svg>` }), interactive: false, keyboard: false, zIndexOffset: 200 }).addTo(map);
    this.arrowEl = this.arrow.getElement(); this.arrowEl.style.opacity = 0;
    this.orient();
    if (f.label) {
      const d = cumulative(pts), half = d[d.length - 1] / 2; let k = d.findIndex(v => v >= half); k = Math.max(0, k);
      this.lab = L.marker(pts[k], { icon: L.divIcon({ className: 'vs-flab', iconSize: [0, 0], html: `<span class="vf-label" style="--c:${color}">${esc(f.label)}</span>` }), interactive: false, keyboard: false, zIndexOffset: 100 }).addTo(map);
      this.lab.getElement().style.opacity = 0;
    }
    const reveal = () => { if (this.dead) return; this.arrowEl.style.opacity = 1; if (this.lab) this.lab.getElement().style.opacity = 1; };
    if (still) { flowOn(); reveal(); return; }
    // draw-in: dash the whole line as one long dash, then pull the offset to 0
    const len = p.getTotalLength ? p.getTotalLength() : 0;
    if (!len) { flowOn(); reveal(); return; }
    p.style.strokeDasharray = `${len} ${len + 10}`; p.style.strokeDashoffset = len;
    void p.getBoundingClientRect();
    const dur = Math.min(1600, 900 + len * .5);
    p.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(.3,.1,.2,1) ${delay}ms`;
    requestAnimationFrame(() => { if (!this.dead) p.style.strokeDashoffset = 0; });
    this.timers.push(setTimeout(reveal, delay + dur * .75), setTimeout(flowOn, delay + dur + 40));
  }
  /** Rotate the arrowhead to the line's final direction in screen space. */
  orient() {
    const n = this.pts.length, m = this.map, a = m.latLngToLayerPoint(this.pts[Math.max(0, n - 4)]), b = m.latLngToLayerPoint(this.pts[n - 1]);
    const deg = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    const svg = this.arrowEl?.querySelector('svg'); if (svg) svg.style.transform = `translate(-50%,-50%) rotate(${deg}deg)`;
  }
  bounds() { return this.line.getBounds(); }
  remove() {
    this.dead = true; this.timers.forEach(clearTimeout);
    [this.glow, this.line, this.arrow, this.lab].forEach(l => l && this.map.removeLayer(l));
  }
}
