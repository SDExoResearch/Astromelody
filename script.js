document.documentElement.classList.add("js");

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

const canUseCursorEffect =
  window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReducedMotion;

if (canUseCursorEffect) {
  const cursorOrbit = document.createElement("div");
  cursorOrbit.className = "cursor-orbit";
  cursorOrbit.setAttribute("aria-hidden", "true");
  document.body.append(cursorOrbit);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let lastSparkAt = 0;

  const renderCursorOrbit = () => {
    currentX += (targetX - currentX) * 0.2;
    currentY += (targetY - currentY) * 0.2;
    cursorOrbit.style.transform = `translate3d(${currentX - 23}px, ${currentY - 23}px, 0)`;
    window.requestAnimationFrame(renderCursorOrbit);
  };

  const addSpark = (x, y) => {
    const spark = document.createElement("i");
    const angle = Math.random() * Math.PI * 2;
    const distance = 10 + Math.random() * 22;
    spark.className = "cursor-spark";
    spark.setAttribute("aria-hidden", "true");
    spark.style.left = `${x - 2}px`;
    spark.style.top = `${y - 2}px`;
    spark.style.setProperty("--spark-x", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--spark-y", `${Math.sin(angle) * distance}px`);
    document.body.append(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursorOrbit.classList.add("is-active");

      const now = window.performance.now();
      if (now - lastSparkAt > 72) {
        addSpark(targetX, targetY);
        lastSparkAt = now;
      }
    },
    { passive: true }
  );

  document.addEventListener("pointerleave", () => cursorOrbit.classList.remove("is-active"));
  document.addEventListener("pointerenter", () => cursorOrbit.classList.add("is-active"));
  window.requestAnimationFrame(renderCursorOrbit);
}
