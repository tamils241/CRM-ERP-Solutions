document.addEventListener('DOMContentLoaded', () => {
  const grids = document.querySelectorAll('.crm-feature-grid, .service-feature-grid');

  grids.forEach(grid => {
    // data-pan-enabled: "false" disables animation
    const enabled = grid.dataset.panEnabled !== 'false';
    // data-pan-duration: e.g. "16s" or "20s" or numeric seconds like "16"
    let raw = grid.dataset.panDuration || grid.dataset.pan || '';
    if (raw && /^\d+$/.test(raw)) raw = raw + 's';
    if (raw) grid.style.setProperty('--pan-duration', raw);
    if (enabled) grid.classList.add('animated');

    // hover behavior: data-pan-hover can be "pause", "continue", or "speed"
    // default: service grid -> continue, crm grid -> pause
    const rawHover = (grid.dataset.panHover || '').toLowerCase();
    const defaultHover = grid.classList.contains('service-feature-grid') ? 'continue' : 'pause';
    const hoverBehavior = rawHover || defaultHover;
    if (hoverBehavior === 'pause') {
      grid.classList.add('pause-on-hover');
    } else {
      grid.classList.remove('pause-on-hover');
    }
    // if user provided a hover duration, apply it
    let rawHoverDur = grid.dataset.panHoverDuration || grid.dataset.panHoverSpeed || '';
    if (rawHoverDur && /^\d+$/.test(rawHoverDur)) rawHoverDur = rawHoverDur + 's';
    if (rawHoverDur) grid.style.setProperty('--pan-duration-hover', rawHoverDur);
  });

  // create hover badges for feature-cards and show computed duration on hover
  const allCards = document.querySelectorAll('.feature-card');
  allCards.forEach(card => {
    // avoid duplicating badges
    if (card.querySelector('.hover-badge')) return;
    const badge = document.createElement('span');
    badge.className = 'hover-badge';
    badge.setAttribute('aria-hidden', 'true');
    card.appendChild(badge);

    let hoverTimeout = null;
    card.addEventListener('mouseenter', (e) => {
      const grid = card.closest('.crm-feature-grid, .service-feature-grid');
      // read hover duration first, then normal duration
      const cs = window.getComputedStyle(grid || document.documentElement);
      let dur = (cs.getPropertyValue('--pan-duration-hover') || '').trim();
      if (!dur) dur = (cs.getPropertyValue('--pan-duration') || '').trim();
      // fallback to data attribute
      if (!dur && grid) dur = grid.dataset.panDuration || grid.dataset.pan || '';
      if (dur && /^\d+$/.test(dur)) dur = dur + 's';
      if (!dur) dur = 'auto';
      badge.textContent = dur;
      card.classList.add('hovered');
      // small delay to avoid flicker when moving pointer quickly
      if (hoverTimeout) clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        badge.style.opacity = '1';
      }, 60);
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hovered');
      if (hoverTimeout) clearTimeout(hoverTimeout);
      badge.style.opacity = '';
    });
  });

  // Expose a small API for runtime control
  window.FeaturePanControl = {
    setDuration(grid, duration) {
      const el = typeof grid === 'string' ? document.querySelector(grid) : grid;
      if (!el) return false;
      const dur = (typeof duration === 'number') ? duration + 's' : duration;
      el.style.setProperty('--pan-duration', dur);
      return true;
    },
    setHoverBehavior(grid, behavior, hoverDuration) {
      const el = typeof grid === 'string' ? document.querySelector(grid) : grid;
      if (!el) return false;
      const b = (behavior || '').toLowerCase();
      if (b === 'pause') el.classList.add('pause-on-hover'); else el.classList.remove('pause-on-hover');
      if (hoverDuration) {
        const dur = (typeof hoverDuration === 'number') ? hoverDuration + 's' : hoverDuration;
        el.style.setProperty('--pan-duration-hover', dur);
      }
      return true;
    },
    enable(grid, on = true) {
      const el = typeof grid === 'string' ? document.querySelector(grid) : grid;
      if (!el) return false;
      if (on) el.classList.add('animated'); else el.classList.remove('animated');
      return true;
    },
    toggle(grid) {
      const el = typeof grid === 'string' ? document.querySelector(grid) : grid;
      if (!el) return false;
      el.classList.toggle('animated');
      return el.classList.contains('animated');
    }
  };
});
