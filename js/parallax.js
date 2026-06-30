(function(){
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function initParallax(root=document){
    const heroes = root.querySelectorAll('.parallax-hero');
    const visuals = root.querySelectorAll('.dashboard-visual');

    function applyTo(el, x, y, depth=1){
      const tx = (x * depth).toFixed(3);
      const ty = (y * depth).toFixed(3);
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    }

    function handleMove(e){
      const px = e.clientX / window.innerWidth - 0.5;
      const py = e.clientY / window.innerHeight - 0.5;
      const sx = px * 36; // horizontal range
      const sy = py * 20; // vertical range

      heroes.forEach(hero => {
        const copy = hero.querySelector('.hero-copy');
        const visual = hero.querySelector('.dashboard-visual');
        if (copy) copy.style.transform = `translate3d(${(-sx*0.45).toFixed(2)}px, ${(-sy*0.35).toFixed(2)}px, 0)`;
        if (visual) visual.style.transform = `translate3d(${(sx*0.6).toFixed(2)}px, ${(sy*0.35).toFixed(2)}px, 0)`;
        // background pattern offset via CSS vars
        hero.style.setProperty('--hero-bg-x', `${(px*20).toFixed(2)}%`);
        hero.style.setProperty('--hero-bg-y', `${(py*10).toFixed(2)}%`);
      });

      visuals.forEach(v => {
        const depthEls = v.querySelectorAll('[data-parallax]');
        depthEls.forEach(el => {
          const depth = parseFloat(el.dataset.depth || '0.6');
          applyTo(el, sx * depth, sy * depth, 1);
        });
      });
    }

    function handleOrient(e){
      // gamma: left-right, beta: front-back
      const gamma = clamp(e.gamma || 0, -30, 30) / 30; // -1..1
      const beta = clamp(e.beta || 0, -30, 30) / 30;
      const sx = gamma * 24;
      const sy = beta * 12;
      heroes.forEach(hero => {
        const copy = hero.querySelector('.hero-copy');
        const visual = hero.querySelector('.dashboard-visual');
        if (copy) copy.style.transform = `translate3d(${(-sx*0.45).toFixed(2)}px, ${(-sy*0.35).toFixed(2)}px, 0)`;
        if (visual) visual.style.transform = `translate3d(${(sx*0.6).toFixed(2)}px, ${(sy*0.35).toFixed(2)}px, 0)`;
      });
    }

    // setup pointer move with requestAnimationFrame throttle
    let ticking = false;
    function onPointer(e){
      if (!ticking){
        window.requestAnimationFrame(()=>{ handleMove(e); ticking=false; });
        ticking = true;
      }
    }

    window.addEventListener('mousemove', onPointer, {passive:true});
    window.addEventListener('deviceorientation', handleOrient, {passive:true});
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') initParallax(document);
  else document.addEventListener('DOMContentLoaded', ()=> initParallax(document));

})();
