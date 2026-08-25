/**
 * Cursor-reactive flower field.
 * Usage:
 *   import { initFlowerField } from './flower-field.js';
 *   initFlowerField(document.getElementById('field'), { count: 11 });
 */
export function initFlowerField(container, opts = {}) {
  if (typeof window !== 'undefined') window.initFlowerField = initFlowerField;
  const COUNT = opts.count ?? 11;
  const MAX_ANGLE = opts.maxAngle ?? 35;
  const RADIUS = opts.radius ?? 250;
  const SENSITIVITY = opts.sensitivity ?? 0.15;
  const BLUE = opts.colors ?? ['#6f95e8', '#7ea8ff', '#5b7fd4', '#8fb3ff'];
  const YELLOW = opts.centerColor ?? '#ffd76a';
  const GAP = opts.gap ?? '6px';

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // inject styles once
  if (!document.getElementById('flower-field-styles')) {
    const style = document.createElement('style');
    style.id = 'flower-field-styles';
    style.textContent = `
      .flower-field {
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        width: 100%;
        height: 100%;
        gap: ${GAP};
        pointer-events: none;
        opacity: 0.2;
      }
      .flower-field .flower {
        transform-origin: bottom center;
        transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        will-change: transform;
        pointer-events: auto;
      }
      .flower-field .flower svg { display: block; overflow: visible; }
    `;
    document.head.appendChild(style);
  }

  container.classList.add('flower-field');

  function leaves(stemX, stemBottom, stemTop) {
    let out = '';
    const n = Math.floor(rand(1, 3));
    for (let i = 0; i < n; i++) {
      const y = rand(stemTop + 15, stemBottom - 10);
      const side = Math.random() < 0.5 ? -1 : 1;
      const lx = stemX + side * rand(6, 12);
      const c = pick(BLUE);
      out += `<path d="M${stemX},${y} Q${stemX + side * 10},${y - 8} ${lx},${y - 14}"
               stroke="${c}" stroke-width="2" fill="none" opacity="0.8"/>`;
    }
    return out;
  }

  function daisyRound(cx, cy, r, color) {
    let petals = '';
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      petals += `<circle cx="${cx + Math.cos(a) * r}" cy="${cy + Math.sin(a) * r}" r="${r * 0.7}" fill="${color}"/>`;
    }
    return `${petals}<circle cx="${cx}" cy="${cy}" r="${r * 0.55}" fill="${YELLOW}"/>`;
  }

  function heartPair(cx, cy, r, color) {
    const heart = (hx, hy, rot) => `
      <g transform="translate(${hx},${hy}) rotate(${rot})">
        <path d="M0,0 C-${r},-${r} -${r},${r * 0.6} 0,${r * 1.4} C${r},${r * 0.6} ${r},-${r} 0,0 Z" fill="${color}"/>
      </g>`;
    let out = '';
    const n = Math.floor(rand(2, 4));
    for (let p = 0; p < n; p++) {
      const a = (p / n) * 360 + rand(-10, 10);
      const dx = Math.cos(a * Math.PI / 180) * r * 0.9;
      const dy = Math.sin(a * Math.PI / 180) * r * 0.9;
      out += heart(cx + dx, cy + dy, a + 90);
    }
    return out + `<circle cx="${cx}" cy="${cy}" r="${r * 0.4}" fill="${YELLOW}"/>`;
  }

  function spikyBloom(cx, cy, r, color) {
    let petals = '';
    const n = 6;
    for (let p = 0; p < n; p++) {
      const a = (p / n) * Math.PI * 2;
      const px = cx + Math.cos(a) * r * 1.1;
      const py = cy + Math.sin(a) * r * 1.1;
      petals += `<ellipse cx="${px}" cy="${py}" rx="${r * 0.4}" ry="${r * 0.9}"
                 transform="rotate(${a * 180 / Math.PI + 90} ${px} ${py})" fill="${color}"/>`;
    }
    return petals + `<circle cx="${cx}" cy="${cy}" r="${r * 0.5}" fill="${YELLOW}"/>`;
  }

  function bell(cx, cy, r, color) {
    return `<path d="M${cx - r},${cy} Q${cx - r},${cy + r * 1.6} ${cx},${cy + r * 1.8}
             Q${cx + r},${cy + r * 1.6} ${cx + r},${cy}
             Q${cx},${cy - r * 0.5} ${cx - r},${cy} Z" fill="${color}"/>`;
  }

  function budCluster(cx, cy, r, color) {
    let out = '';
    const n = Math.floor(rand(2, 4));
    for (let p = 0; p < n; p++) {
      const ox = rand(-r * 1.5, r * 1.5);
      const oy = rand(-r, r * 0.5);
      out += `<ellipse cx="${cx + ox}" cy="${cy + oy}" rx="${r * 0.5}" ry="${r * 0.8}" fill="${color}"/>`;
    }
    return out;
  }

  const SPECIES = [daisyRound, heartPair, spikyBloom, bell, budCluster];

  function buildFlower() {
    const stemH = rand(60, 130);
    const w = 44;
    const stemX = w / 2;
    const stemTop = rand(15, 30);
    const color = pick(BLUE);
    const r = rand(6, 11);
    const species = pick(SPECIES);
    const bloom = species(stemX, stemTop, r, color);
    const leafSvg = leaves(stemX, stemH, stemTop);

    return `
      <svg width="${w}" height="${stemH}" viewBox="0 0 ${w} ${stemH}">
        <line x1="${stemX}" y1="${stemH}" x2="${stemX}" y2="${stemTop}" stroke="${color}" stroke-width="2.5"/>
        ${leafSvg}
        ${bloom}
      </svg>`;
  }

  const flowers = [];
  for (let i = 0; i < COUNT; i++) {
    const wrap = document.createElement('div');
    wrap.className = 'flower';
    wrap.innerHTML = buildFlower();
    container.appendChild(wrap);
    flowers.push(wrap);
  }

  function onMove(clientX, clientY) {
    flowers.forEach((f) => {
      const rect = f.getBoundingClientRect();
      const baseX = rect.left + rect.width / 2;
      const baseY = rect.bottom;
      const dx = clientX - baseX;
      const dy = clientY - baseY;
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS) {
        const strength = 1 - dist / RADIUS;
        const angle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, -dx * SENSITIVITY * strength));
        f.style.transform = `rotate(${angle}deg)`;
      } else {
        f.style.transform = 'rotate(0deg)';
      }
    });
  }

  const handleMouse = (e) => onMove(e.clientX, e.clientY);
  const handleTouch = (e) => {
    const t = e.touches[0];
    if (t) onMove(t.clientX, t.clientY);
  };

  window.addEventListener('mousemove', handleMouse);
  window.addEventListener('touchmove', handleTouch);

  // cleanup function
  return function destroy() {
    window.removeEventListener('mousemove', handleMouse);
    window.removeEventListener('touchmove', handleTouch);
    container.innerHTML = '';
  };
}
