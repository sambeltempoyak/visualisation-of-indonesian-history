// Screen-space tidy-up: dim banners/badges that sit under story place labels, and lift event badges off the people banners beneath them.
export function createDeclutter(lmap) {
  const root = lmap.getContainer();
  const hit = (a, b, m = 0) => a.left < b.right + m && a.right > b.left - m && a.top < b.bottom + m && a.bottom > b.top - m;
  let t1 = 0, t2 = 0;
  function run() {
    const vb = [...root.querySelectorAll('.vb, .vc')];
    vb.forEach(b => b.style.removeProperty('--dy'));
    root.querySelectorAll('.vih-dim').forEach(n => n.classList.remove('vih-dim'));
    const story = document.body.classList.contains('story-mode');
    if (story) {
      const places = [...root.querySelectorAll('.sp')].map(n => n.getBoundingClientRect());
      if (places.length) {
        root.querySelectorAll('.vp-wrap, .vb-wrap, .vc-wrap').forEach(w => {
          if (w.querySelector('.vb.hl, .vb.sel')) return;
          const r = (w.querySelector('.vp, .vb, .vc') || w).getBoundingClientRect();
          if (places.some(p => hit(r, p, 4))) w.classList.add('vih-dim');
        });
      }
    }
    const pills = [...root.querySelectorAll('.vp-wrap:not(.vih-dim) .vp')].map(n => n.getBoundingClientRect());
    vb.forEach(b => {
      if (b.closest('.vih-dim')) return;
      const r = b.getBoundingClientRect();
      const p = pills.find(q => hit(r, q, 0));
      if (p) b.style.setProperty('--dy', `${-Math.round(r.bottom - p.top + 3)}px`);
    });
  }
  const kick = () => { clearTimeout(t1); clearTimeout(t2); t1 = setTimeout(run, 80); t2 = setTimeout(run, 450); };
  lmap.on('moveend zoomend layeradd layerremove', kick);
  document.addEventListener('vih:declutter', kick);
  return { run, kick };
}
