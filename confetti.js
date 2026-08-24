const COLORS = ['#3B6BF5', '#FFC82C', '#43C463', '#FF6B6B', '#A78BFA'];

function createParticle(x, y) {
  const angle = (Math.random() * Math.PI) / 2 + Math.PI / 4;
  const speed = 6 + Math.random() * 8;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? -1 : 1),
    vy: -Math.sin(angle) * speed - 4,
    size: 5 + Math.random() * 5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 12,
    life: 1,
    shape: Math.random() < 0.5 ? 'rect' : 'circle',
  };
}

export function initBottomConfetti(options = {}) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { destroy() {} };
  }

  const target = options.target || document.querySelector('footer');
  if (!target) return { destroy() {} };

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  let particles = [];
  let rafId = null;
  let fired = false;

  const gravity = 0.28;
  const drag = 0.985;

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.vy += gravity;
      p.vx *= drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.life -= 0.008;

      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    particles = particles.filter((p) => p.life > 0 && p.y < window.innerHeight + 40);

    if (particles.length > 0) {
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
    }
  }

  function burst() {
    const count = options.count || 140;
    const y = window.innerHeight + 10;
    for (let i = 0; i < count; i++) {
      const x = window.innerWidth / 2 + (Math.random() - 0.5) * window.innerWidth * 0.6;
      particles.push(createParticle(x, y));
    }
    if (!rafId) rafId = requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          burst();
        }
      });
    },
    { threshold: 0.4 }
  );
  observer.observe(target);

  return {
    destroy() {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
      canvas.remove();
    },
  };
}
