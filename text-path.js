/* ═══════════════════════════════════════════════════════════════
   Text Path — infinite wave marquee.
   Ported from a React/Framer component (Originkit) to plain JS
   (this site has no build step / no React). Text scrolls along a
   procedural sine-wave SVG path via <textPath startOffset>, driven
   by a single rAF loop so it never stutters on re-layout.
   ═══════════════════════════════════════════════════════════════ */

const SVG_NS = 'http://www.w3.org/2000/svg';
let uid = 0;

/**
 * initTextPath(container, options) → { destroy() }
 * options: {
 *   text, separator, gap, fontSize, letterSpacing, fontFamily, fontWeight,
 *   fontStyle, textColor, speed, reversed, waveFrequency, waveHeight
 * }
 */
export function initTextPath(container, options = {}) {
  const opts = {
    text: 'TEXT PATH',
    separator: '   •   ',
    gap: 0,
    fontSize: 40,
    letterSpacing: 1,
    fontFamily: 'inherit',
    fontWeight: 400,
    fontStyle: 'normal',
    textColor: '#000000',
    speed: 18,
    reversed: true,
    waveFrequency: 2,
    waveHeight: 58,
    ...options,
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const id = `tp-${uid++}`;
  const pathId = `${id}-path`;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.style.cssText = 'display:block;width:100%;height:100%;';
  container.appendChild(svg);

  const defs = document.createElementNS(SVG_NS, 'defs');
  const pathEl = document.createElementNS(SVG_NS, 'path');
  pathEl.setAttribute('id', pathId);
  pathEl.setAttribute('fill', 'none');
  defs.appendChild(pathEl);
  svg.appendChild(defs);

  function makeMeasureText() {
    const t = document.createElementNS(SVG_NS, 'text');
    t.setAttribute('x', '0');
    t.setAttribute('y', '-9999');
    t.style.visibility = 'hidden';
    t.style.pointerEvents = 'none';
    applyFont(t);
    svg.appendChild(t);
    return t;
  }

  function applyFont(el) {
    el.style.fontSize = `${opts.fontSize}px`;
    el.style.letterSpacing = `${opts.letterSpacing}px`;
    el.style.fontFamily = opts.fontFamily;
    el.style.fontWeight = opts.fontWeight;
    el.style.fontStyle = opts.fontStyle;
  }

  const measureA = makeMeasureText();
  const measureB = makeMeasureText();

  const mainText = document.createElementNS(SVG_NS, 'text');
  mainText.setAttribute('fill', opts.textColor);
  applyFont(mainText);
  const textPath = document.createElementNS(SVG_NS, 'textPath');
  textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${pathId}`);
  textPath.setAttribute('href', `#${pathId}`);
  mainText.appendChild(textPath);
  svg.appendChild(mainText);

  const gapStr = ' '.repeat(Math.max(0, Math.min(20, Math.round(opts.gap))));
  const safeText = opts.text && opts.text.length ? opts.text : ' ';
  const unitText = safeText + gapStr + opts.separator + gapStr;

  let w = 800;
  let h = 200;
  let unitWidthPx = 0;
  let pathLengthPx = 0;

  function buildWave() {
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const cy = h / 2;
    const amplitude = Math.max(0, Math.min(opts.waveHeight / 2, h / 2 - opts.fontSize));
    const ctrlAmp = amplitude * (4 / 3);
    const halfCyclesVisible = Math.max(1, Math.round(opts.waveFrequency * 2));
    const halfWidth = w / halfCyclesVisible;
    const overflow = Math.max(100, w * 0.3);
    const leftSteps = Math.ceil(overflow / halfWidth);
    const rightSteps = Math.ceil(overflow / halfWidth);
    const totalSteps = halfCyclesVisible + leftSteps + rightSteps;
    const xStart = -leftSteps * halfWidth;
    const startSign = leftSteps % 2 === 0 ? -1 : 1;

    let d = `M ${xStart},${cy}`;
    for (let i = 0; i < totalSteps; i++) {
      const xa = xStart + i * halfWidth;
      const xb = xStart + (i + 1) * halfWidth;
      const peakY = cy + (i % 2 === 0 ? startSign * ctrlAmp : -startSign * ctrlAmp);
      d += ` C ${xa + halfWidth / 3},${peakY} ${xb - halfWidth / 3},${peakY} ${xb},${cy}`;
    }
    pathEl.setAttribute('d', d);

    let len = 0;
    try { len = pathEl.getTotalLength(); } catch (e) { len = 0; }
    if (isFinite(len) && len > 0) pathLengthPx = len;

    const segArc = 2 * Math.hypot(halfWidth / 2, ctrlAmp) * 1.15;
    const estPathLengthPx = totalSteps * Math.max(halfWidth, segArc);
    const effPathLengthPx = Math.max(pathLengthPx, estPathLengthPx);

    measureA.textContent = unitText.repeat(2);
    measureB.textContent = unitText.repeat(4);
    let la = 0, lb = 0;
    try { la = measureA.getComputedTextLength(); lb = measureB.getComputedTextLength(); } catch (e) {}
    const period = (lb - la) / 2;
    if (isFinite(period) && period > 0) unitWidthPx = period;

    const estUnitWidthPx = Math.max(1, unitText.length * opts.fontSize * 0.6);
    const effUnitWidthPx = unitWidthPx > 0 ? unitWidthPx : estUnitWidthPx;

    const repeatCount = Math.min(256, Math.max(2, Math.ceil(effPathLengthPx / effUnitWidthPx) + 3));
    textPath.textContent = unitText.repeat(repeatCount);
  }

  function resize() {
    const rect = container.getBoundingClientRect();
    const nw = Math.round(rect.width);
    const nh = Math.round(rect.height);
    if (nw <= 0 || nh <= 0) return;
    if (Math.abs(w - nw) <= 1 && Math.abs(h - nh) <= 1) return;
    w = nw; h = nh;
    buildWave();
  }

  resize();
  buildWave();

  const ro = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(container);
  window.addEventListener('resize', resize);

  let offset = 0;
  let lastT = null;
  let rafId = null;

  function loop(t) {
    if (lastT == null) lastT = t;
    const dt = Math.min((t - lastT) / 1000, 1 / 30);
    lastT = t;
    const pps = Math.max(0, opts.speed) * 5;
    if (unitWidthPx > 0 && pps > 0) {
      const dir = opts.reversed ? 1 : -1;
      let off = offset + dir * pps * dt;
      off -= Math.floor(off / unitWidthPx) * unitWidthPx;
      offset = off;
      textPath.setAttribute('startOffset', `${off}px`);
    }
    rafId = requestAnimationFrame(loop);
  }

  if (!reducedMotion) {
    rafId = requestAnimationFrame(loop);
  } else {
    textPath.setAttribute('startOffset', '0');
  }

  return {
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', resize);
      svg.remove();
    },
  };
}
