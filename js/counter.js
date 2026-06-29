document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const animate = (counter) => {
    const target = Number(counter.dataset.counter);
    const suffix = counter.dataset.suffix || "";
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 70));
    const tick = () => {
      current = Math.min(target, current + step);
      counter.textContent = `${current}${suffix}`;
      if (current < target) requestAnimationFrame(tick);
    };
    tick();
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));
  } else {
    counters.forEach(animate);
  }
});
