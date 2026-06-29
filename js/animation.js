document.addEventListener("DOMContentLoaded", () => {
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("visible"));
  }

  const hero = document.querySelector(".parallax-hero");
  const copy = hero?.querySelector(".hero-copy");
  const visual = hero?.querySelector(".dashboard-visual");
  const allowParallax = window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (hero && copy && visual && allowParallax) {
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let scrollShift = 0;
    let currentCopyX = 0;
    let currentCopyY = 0;
    let currentVisualX = 0;
    let currentVisualY = 0;
    const ease = 0.075;

    const renderParallax = () => {
      const targetCopyX = pointerX * -10;
      const targetCopyY = pointerY * -8 + scrollShift * 0.1;
      const targetVisualX = pointerX * 24;
      const targetVisualY = pointerY * 18 + scrollShift * -0.18;

      currentCopyX += (targetCopyX - currentCopyX) * ease;
      currentCopyY += (targetCopyY - currentCopyY) * ease;
      currentVisualX += (targetVisualX - currentVisualX) * ease;
      currentVisualY += (targetVisualY - currentVisualY) * ease;

      hero.style.setProperty("--hero-bg-x", `${pointerX * -18}px`);
      hero.style.setProperty("--hero-bg-y", `${pointerY * -18 + scrollShift * 0.08}px`);
      copy.style.transform = `translate3d(${currentCopyX}px, ${currentCopyY}px, 0)`;
      visual.style.transform = `translate3d(${currentVisualX}px, ${currentVisualY}px, 0)`;
      frame = 0;
    };

    const requestParallax = () => {
      if (!frame) frame = requestAnimationFrame(renderParallax);
    };

    const moveHero = (event) => {
      const rect = hero.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
      requestParallax();
    };

    const scrollHero = () => {
      const rect = hero.getBoundingClientRect();
      scrollShift = Math.max(-140, Math.min(140, -rect.top));
      requestParallax();
    };

    const resetHero = () => {
      pointerX = 0;
      pointerY = 0;
      requestParallax();
    };

    hero.addEventListener("pointermove", moveHero);
    hero.addEventListener("pointerleave", resetHero);
    window.addEventListener("scroll", scrollHero, { passive: true });
    scrollHero();
  }
});
