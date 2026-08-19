/** Lightweight canvas confetti — no external dependency. */
export function fireConfetti(durationMs = 2800) {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;z-index:9999;pointer-events:none;width:100%;height:100%;";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const context = ctx;

  const colors = ["#C43C2C", "#E8B84A", "#1A6B73", "#F7F4EE", "#2F9E5F", "#050505"];
  const particles = Array.from({ length: 160 }, () => ({
    x: window.innerWidth / 2 + (Math.random() - 0.5) * 120,
    y: window.innerHeight * 0.42,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -14 - 4,
    w: Math.random() * 8 + 4,
    h: Math.random() * 6 + 3,
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 12,
    color: colors[Math.floor(Math.random() * colors.length)]!,
    life: 1,
  }));

  const start = performance.now();

  function frame(now: number) {
    const elapsed = now - start;
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rot += p.vr;
      p.life = Math.max(0, 1 - elapsed / durationMs);

      context.save();
      context.translate(p.x, p.y);
      context.rotate((p.rot * Math.PI) / 180);
      context.globalAlpha = p.life;
      context.fillStyle = p.color;
      context.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      context.restore();
    }

    if (elapsed < durationMs) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(frame);
}
