// Nav scroll shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
function closeMobile() {
  mobileMenu.classList.remove('open');
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) closeMobile();
});

// Fade-up on scroll
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
fadeEls.forEach((el) => observer.observe(el));

// Hobby pop-outs on tap (mobile)
document.querySelectorAll('.hobby-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const isActive = chip.classList.contains('is-active');
    document.querySelectorAll('.hobby-chip.is-active').forEach((c) => c.classList.remove('is-active'));
    if (!isActive) chip.classList.add('is-active');
  });
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.hobby-chip')) {
    document.querySelectorAll('.hobby-chip.is-active').forEach((c) => c.classList.remove('is-active'));
  }
});

// Hero wave background
(function initHeroWaves() {
  const canvas = document.querySelector('.hero-wave-bg');
  const hero = document.getElementById('intro');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  let t = 0;

  const layers = [
    { amp: 26, freq: 0.0055, speed: 0.0007, y: 0.42, alpha: 0.22 },
    { amp: 20, freq: 0.008, speed: 0.001, y: 0.58, alpha: 0.16 },
    { amp: 16, freq: 0.011, speed: 0.00085, y: 0.72, alpha: 0.12 },
  ];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = hero.offsetWidth;
    const h = hero.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function waveY(x, layer, time) {
    return (
      hero.offsetHeight * layer.y
      + Math.sin(x * layer.freq + time * layer.speed) * layer.amp
      + Math.sin(x * layer.freq * 1.7 + time * layer.speed * 1.4 + 1.2) * (layer.amp * 0.45)
      + Math.cos(x * layer.freq * 0.6 + time * layer.speed * 0.8) * (layer.amp * 0.25)
    );
  }

  function draw() {
    const w = hero.offsetWidth;
    const h = hero.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    layers.forEach((layer, i) => {
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 3) {
        ctx.lineTo(x, waveY(x, layer, t + i * 40));
      }
      ctx.lineTo(w, h);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, h * layer.y - layer.amp * 2, 0, h);
      grad.addColorStop(0, `rgba(255, 255, 255, ${layer.alpha})`);
      grad.addColorStop(0.45, `rgba(238, 242, 255, ${layer.alpha * 0.7})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
    });

    if (!reducedMotion) {
      t += 16;
      raf = requestAnimationFrame(draw);
    }
  }

  resize();
  draw();
  window.addEventListener('resize', () => {
    resize();
    if (reducedMotion) draw();
  });
})();


// Click cursor effect (sniper mode)
(function initClickCursor() {
  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const COLOR = '#3B6BF5';
  const DURATION = 0.3;
  const STROKE_WIDTH = 2;
  const EFFECT_SIZE = 90;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const TICK_ANGLES = [0, 90, 180, 270];
  const DOT_ANGLES = [
    Math.PI / 3, (2 * Math.PI) / 3, (4 * Math.PI) / 3, (5 * Math.PI) / 3,
    Math.PI / 6, (5 * Math.PI) / 6, (7 * Math.PI) / 6, (11 * Math.PI) / 6,
  ];

  const layer = document.createElement('div');
  layer.style.cssText = 'position:fixed; inset:0; pointer-events:none; z-index:9999; overflow:visible;';
  document.body.appendChild(layer);

  function spawnSniper(x, y) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:absolute; left:0; top:0;';

    const centerX = EFFECT_SIZE / 2;
    const centerY = EFFECT_SIZE / 2;

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${EFFECT_SIZE} ${EFFECT_SIZE}`);
    svg.style.cssText = `position:absolute; left:${x - EFFECT_SIZE / 2}px; top:${y - EFFECT_SIZE / 2}px; width:${EFFECT_SIZE}px; height:${EFFECT_SIZE}px; overflow:visible;`;
    wrap.appendChild(svg);

    TICK_ANGLES.forEach((deg) => {
      const angle = (deg * Math.PI) / 180;
      const lineLength = EFFECT_SIZE * 0.2;
      const startX = centerX + 5 * Math.cos(angle);
      const startY = centerY - 5 * Math.sin(angle);
      const endX = centerX + (5 + lineLength) * Math.cos(angle);
      const endY = centerY - (5 + lineLength) * Math.sin(angle);

      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', startX);
      line.setAttribute('y1', startY);
      line.setAttribute('x2', startX);
      line.setAttribute('y2', startY);
      line.setAttribute('stroke', COLOR);
      line.setAttribute('stroke-width', STROKE_WIDTH);
      line.setAttribute('stroke-linecap', 'square');
      svg.appendChild(line);

      gsap.timeline()
        .to(line, {
          attr: { x1: endX, y1: endY, x2: endX, y2: endY },
          translateX: (5 + lineLength) * Math.cos(angle),
          translateY: -(5 + lineLength) * Math.sin(angle),
          duration: DURATION,
          ease: 'power2.out',
        })
        .to(line, { strokeWidth: 0, duration: DURATION * 0.4, ease: 'linear' }, DURATION * 0.6);
    });

    DOT_ANGLES.forEach((angle) => {
      const dot = document.createElement('div');
      dot.style.cssText = `position:absolute; left:${x - STROKE_WIDTH / 2}px; top:${y - STROKE_WIDTH / 2}px; width:${STROKE_WIDTH}px; height:${STROKE_WIDTH}px; background:${COLOR};`;
      wrap.appendChild(dot);

      gsap.timeline()
        .to(dot, {
          x: Math.cos(angle) * (EFFECT_SIZE * 0.4),
          y: Math.sin(angle) * (EFFECT_SIZE * 0.4),
          duration: DURATION,
          ease: 'power2.out',
        })
        .to(dot, { width: 0, height: 0, duration: DURATION * 0.4, ease: 'linear' }, DURATION * 0.6);
    });

    layer.appendChild(wrap);
    setTimeout(() => wrap.remove(), (DURATION + DURATION * 0.4) * 1000 + 60);
  }

  document.addEventListener('click', (e) => {
    spawnSniper(e.clientX, e.clientY);
  });
})();
