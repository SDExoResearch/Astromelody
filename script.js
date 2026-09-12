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
  document.documentElement.classList.add("has-ambient-cursor");

  const cursorGlow = document.createElement("div");
  cursorGlow.className = "cursor-glow";
  cursorGlow.setAttribute("aria-hidden", "true");

  const cursorPointer = document.createElement("div");
  cursorPointer.className = "cursor-pointer";
  cursorPointer.setAttribute("aria-hidden", "true");

  document.body.append(cursorGlow, cursorPointer);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let lastDustAt = 0;
  let dustCount = 0;

  const renderAmbientCursor = () => {
    currentX += (targetX - currentX) * 0.42;
    currentY += (targetY - currentY) * 0.42;
    cursorGlow.style.transform = `translate3d(${currentX - 140}px, ${currentY - 140}px, 0)`;
    window.requestAnimationFrame(renderAmbientCursor);
  };

  const addDust = (x, y) => {
    if (dustCount > 210) return;

    for (let index = 0; index < 4; index += 1) {
      const dust = document.createElement("i");
      const angle = Math.random() * Math.PI * 2;
      const distance = 18 + Math.random() * 42;
      const size = 1 + Math.random() * 2.2;
      dust.className = "cursor-dust";
      dust.setAttribute("aria-hidden", "true");
      dust.style.left = `${x - size / 2}px`;
      dust.style.top = `${y - size / 2}px`;
      dust.style.setProperty("--dust-size", `${size}px`);
      dust.style.setProperty("--dust-x", `${Math.cos(angle) * distance}px`);
      dust.style.setProperty("--dust-y", `${Math.sin(angle) * distance}px`);
      document.body.append(dust);
      dustCount += 1;
      dust.addEventListener(
        "animationend",
        () => {
          dust.remove();
          dustCount -= 1;
        },
        { once: true }
      );
    }
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursorPointer.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      cursorGlow.classList.add("is-active");
      cursorPointer.classList.add("is-active");

      const now = window.performance.now();
      if (now - lastDustAt > 42) {
        addDust(targetX, targetY);
        lastDustAt = now;
      }
    },
    { passive: true }
  );

  document.addEventListener("pointerleave", () => {
    cursorGlow.classList.remove("is-active");
    cursorPointer.classList.remove("is-active");
  });
  document.addEventListener("pointerenter", () => {
    cursorGlow.classList.add("is-active");
    cursorPointer.classList.add("is-active");
  });
  window.requestAnimationFrame(renderAmbientCursor);
}
