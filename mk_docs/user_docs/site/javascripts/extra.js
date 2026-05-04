document.addEventListener("DOMContentLoaded", () => {
  const animated = document.querySelectorAll(
    ".role-card, .feature-item, .step, .kpi-card"
  );
  const counters = document.querySelectorAll(".kpi-value[data-counter]");

  const animateCounter = (el) => {
    const target = Number.parseInt(el.dataset.counter || "0", 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = `${prefix}${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(tick);
  };

  if (!animated.length || !("IntersectionObserver" in window)) {
    counters.forEach((el) => {
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      el.textContent = `${prefix}${el.dataset.counter || "0"}${suffix}`;
    });
    return;
  }

  animated.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.setProperty("--delay", `${Math.min(i * 70, 420)}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          if (
            entry.target.classList.contains("kpi-card") &&
            !entry.target.dataset.counted
          ) {
            const counter = entry.target.querySelector(".kpi-value[data-counter]");
            if (counter) {
              animateCounter(counter);
              entry.target.dataset.counted = "true";
            }
          }

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animated.forEach((el) => observer.observe(el));
});
