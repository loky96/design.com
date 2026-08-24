# Case Study Page Template

Reference structure extracted from `mes-coded.html` / `mes-coded.css`. Use this as the skeleton for the next coded case study (`<project>-coded.html` + `<project>-coded.css`).

## File setup

```html
<link rel="stylesheet" href="<project>-coded.css" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet" />
```

```css
/* <project>-coded.css */
@import url("case-study.css");
/* page-scoped classes + palette overrides below */
```

`case-study.css` is the shared base (colors, typography, `.sec`, `.wrap`, `.ph` placeholders, and a library of section components — see "Reusable components" below). Never duplicate its rules; only add page-scoped classes.

## Page skeleton (top to bottom)

```
<header class="nav">...</header>          — shared, identical on every page
<nav class="XX-side-nav">...</nav>        — optional, only if page is long (see Side nav)
<main>
  <section class="sec dark hero-cover">   — 1. Cover
  <section id="..." class="sec light">    — 2. Quick context (4-card grid)
  <section id="..." class="sec dark">     — 3. Product brief
  <section class="sec light">             — 4. Why we're building this (why-card grid)
  <section id="..." class="sec blue">     — 5. Explore / pick a path (optional branch section)
  <section class="sec dark strip">        — divider strip: section title only
  <section class="sec light">             — 6+. User/persona/flow sections, one per id
  ...
  <section id="..." class="sec dark strip"> — divider strip before results
  <section id="..." class="sec light">    — Success metrics
  <section id="..." class="sec light">    — Adoption & retention
  <section id="..." class="sec light">    — Business impact
  <section id="..." class="sec dark">     — Reflections & learnings
  <section id="thanks" class="sec light thanks"> — Thank you
</main>
<footer class="footer">...</footer>       — shared, identical on every page
```

Every `<section>` that appears in the side nav needs a stable `id` matching its nav link's `href`/`data-target`.

## 1. Cover (`hero-cover`, dark)

```html
<section class="sec dark hero-cover">
  <div class="wrap">
    <img class="brand-logo" src="images/Logos/<client>.webp" alt="<Client>" />
    <h1 class="cover-title">Project Title</h1>
    <p class="cover-sub">One-line subtitle.</p>

    <div class="meta-grid">
      <div class="meta-chip"><span class="meta-label">🖥️ Product:</span><span class="meta-val">...</span></div>
      <div class="meta-chip"><span class="meta-label">👥 Team:</span><span class="meta-val">...</span></div>
      <div class="meta-chip"><span class="meta-label">💼 Role:</span><span class="meta-val">...</span></div>
      <div class="meta-chip"><span class="meta-label">⏱️ Time:</span><span class="meta-val">...</span></div>
    </div>

    <div class="cover-laptop-wrap">
      <img class="cover-laptop" src="..." alt="..." loading="eager" decoding="async" />
      <!-- optional hover-reveal gif overlay, same position/size as cover-laptop -->
      <img class="cover-laptop-gif" src="..." alt="" aria-hidden="true" loading="lazy" />
    </div>

    <div class="cover-cards">
      <div class="cover-card">
        <h3>Business Impact</h3>
        <p class="cover-card-sub">...</p>
        <img class="ph-chart" src="..." alt="..." loading="lazy" decoding="async" />
        <div class="stat-row">
          <div class="stat-card"><div class="stat-label">💰 Metric:</div><div class="stat-val">before to <strong>after</strong></div><div class="stat-pct">+N%</div></div>
          <div class="stat-card">...</div>
        </div>
        <p class="dark-fine">Source: ...</p>
      </div>
      <div class="cover-card">
        <h3>Adoption &amp; Net promoter score</h3>
        <img class="ph-chart" src="..." alt="..." loading="lazy" decoding="async" />
        <p class="nps-caption">NPS test conducted with users</p>
        <div class="nps-block">
          <div class="nps-head"><span class="nps-who">Segment <span class="nps-count">N 👤</span></span><span class="nps-score">NPS Score: N</span></div>
          <div class="nps-gauge"><div class="g-red"></div><div class="g-yellow"></div><div class="g-green"></div><div class="g-marker" style="left:N%;"></div></div>
          <div class="nps-scale"><span>-100</span><span>0</span><span>30</span><span>70</span><span>100</span></div>
        </div>
      </div>
    </div>
  </div>
</section>
```

## 2. Quick context (`sec light`)

4-card grid answering Why / What / Whom / How:

```html
<section id="quick-context" class="sec light">
  <div class="wrap">
    <h2 class="sec-h2">Quick context</h2>
    <div class="grid-2" style="grid-template-columns:repeat(4,1fr);">
      <div class="ctx-card"><h3>❓ Why</h3><ul><li>...</li></ul></div>
      <div class="ctx-card"><h3>🔍 What</h3><ul><li>...</li></ul></div>
      <div class="ctx-card"><h3>👥 Whom</h3><ul><li>...</li></ul></div>
      <div class="ctx-card"><h3>🛠 How</h3><ul><li>...</li></ul></div>
    </div>
  </div>
</section>
```

## 3. Product brief (`sec dark`)

Big statement + supporting illustration, uses `.brief-row` / `.brief-text` / `.brief-illus`.

## 4. Why we're building this (`sec light`)

Grid of `.why-card` (icon emoji lead + heading + paragraph). One card can expand into a `.persona-cols` two-column mini breakdown for "addressing different personas."

## 5. Explore / branch picker (`sec blue`, optional)

Only for pages with parallel deep-dive paths (e.g. per-persona flows). Uses `.explore-cols` + `.explore-pill` link buttons + `.explore-list`.

## Divider strips

Between major acts, drop a one-line full-bleed strip to mark a transition:

```html
<section class="sec dark strip" id="current-flow">
  <div class="wrap"><h2 class="strip-title">Lets understand what happens in X</h2></div>
</section>
```

Use `sec blue strip` + `strip-title white` for a colored variant.

## Persona sections (repeat per persona/user type)

```html
<section id="<persona-id>" class="sec light">
  <div class="wrap">
    <h2 class="sec-h2">🧑‍💻 Persona name</h2>
    <div class="pnq-grid">
      <div class="pnq-card pain"><h3>😓 Pain points</h3><ul>...</ul></div>
      <div class="pnq-card needs"><h3>🔑 Needs</h3><ul>...</ul></div>
      <div class="pnq-card qualities"><h3>🔥 Qualities</h3><ul>...</ul></div>
    </div>
    <h3>🔄 User flow</h3>
    <div class="uflow-row">
      <div class="uflow-box">Step 1</div><span class="uflow-arrow">→</span>
      <div class="uflow-box">Step 2</div><span class="uflow-arrow">→</span>
      ...
    </div>
  </div>
</section>
```

Follow each persona section with a `sec dark` solutions section using `.sol-row` (persona-tagged left column + `.needs-solved` olive box) to show what was built for them, and `<video>`/image placeholders for the actual feature walkthroughs.

## Research section

- Factory/field visit, interviews, insights → `.research-card` (image/text split, 0.9fr/1.1fr grid) repeated per research method.
- Competitor analysis → `.comp-table-wrap > table.comp-table` (sticky first column, per-column accent colors — see case-study.css `.comp-table` block).

## Personas gallery

`.persona-photo-row` grid of `.persona-photo-card` (grayscale avatar via `.pp-avatar`, colored on hover).

## Iteration & solution

- Stakeholder alignment bullet list.
- Wireframes/wireflows → `.ph-grid-6` or stacked single-column images.
- Information architecture diagram.

## Visual design

Two `.research-card`-style blocks: "Visual Design" (mood/UI kit) and "Prototyping" (Figma prototype embed placeholder).

## Usability evaluation

- Task success rate table.
- Think-aloud / retrospective testing notes.
- Before/after feedback pairs merged into a shared `.flag-card` wrapper containing multiple `.grid-2` rows (see "Merged feedback pattern" below).
- SUS evaluation + NPS score cards (reuse `.nps-block` from cover).

## Merged feedback pattern

When showing "User feedback → Change made" pairs that belong to the same flow, wrap them together instead of separate boxes:

```html
<div class="flag-card">
  <div class="grid-2">...feedback 1 / change 1...</div>
  <div class="grid-2" style="margin-top:20px;">...feedback 2 / change 2...</div>
</div>
```

## Collaboration / Challenges faced

- Collaboration: subheadings only, no card grid (`Stakeholder Collaboration`, `Developer sign off`).
- Challenges: proposed design callout + `.why-card` grid titled "How I approached this challenge" (numbered emoji steps: understanding root problem → explaining rationale → alternate implementation → knowledge update → quick iteration → closing the loop).

## Results block

```html
<section class="sec dark strip" id="impact-results">
  <div class="wrap"><h2 class="strip-title">Impact &amp; results</h2></div>
</section>

<section id="success-metrics" class="sec light">
  <div class="wrap">
    <h2 class="sec-h2">Defining Product Success Metrics</h2>
    <div class="grid-2" style="grid-template-columns:repeat(4,1fr);">
      <div class="metric-card"><img class="metric-icon" src="..." alt="" /><h3>Metric name</h3><p>Why: ...</p></div>
      ...
    </div>
  </div>
</section>

<section id="adoption-retention" class="sec light">
  <div class="wrap">
    <h2 class="sec-h2">Adoption and Retention metrics <span class="h2-light">in initial N months</span></h2>
    <div class="grid-2">
      <div class="adopt-block"><h3>Metric <span class="h3-sub">context</span></h3><p><strong>N% change</strong> detail</p><img class="ph-chart" src="..." alt="..." /></div>
      ...
    </div>
  </div>
</section>

<section id="business-impact" class="sec light">
  <div class="wrap">
    <h2 class="sec-h2">Impact on business! <span class="h2-light">(Revenue metrics ...)</span></h2>
    <div class="impact-grid"><div class="stat-card lg">...</div>...</div>
  </div>
</section>
```

## Reflections & learnings (`sec dark`)

Grid of `.reflect-card` (emoji + one-liner heading + paragraph). Make one card `.reflect-card.wide` to span both columns for the standout takeaway.

## Thank you (`sec light thanks`)

```html
<section id="thanks" class="sec light thanks">
  <div class="wrap"><h2 class="thanks-title">Thankyou</h2></div>
</section>
```

## Side nav (only for long pages, 15+ sections)

Copy structure verbatim, rename `mes-` prefix to the new page's prefix:

```html
<nav class="XX-side-nav" aria-label="Section navigation">
  <a href="#<id>" class="XX-side-nav-link" data-target="<id>"><span class="XX-side-nav-bar"></span><span class="XX-side-nav-label">Label</span></a>
  <!-- one per h2-level section id, in document order -->
</nav>
```

CSS (`<project>-coded.css`):

```css
html { scroll-behavior: smooth; }
.XX-side-nav { position: fixed; left: 28px; top: 50%; transform: translateY(-50%); z-index: 40; display: flex; flex-direction: column; gap: 10px; }
.XX-side-nav-link { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.XX-side-nav-bar { width: 2px; height: 12px; background: #ccc; }
.XX-side-nav-link.active .XX-side-nav-bar { background: var(--blue); }
.XX-side-nav-label { opacity: 0; max-width: 0; overflow: hidden; white-space: nowrap; transform: translateX(-6px); transition: opacity .15s, max-width .15s, transform .15s; font-size: 13px; color: var(--ink-2); }
.XX-side-nav-link.active .XX-side-nav-label { color: var(--blue); font-weight: 500; }
.XX-side-nav:hover .XX-side-nav-label { opacity: 1; max-width: 220px; transform: translateX(0); }
@media (max-width: 700px) { .XX-side-nav { display: none; } }
```

Scroll-spy script (paste before `</body>`, swap `mes` for the page prefix):

```html
<script>
  (function initXXSideNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".XX-side-nav-link"));
    var sections = links.map(function (link) { return document.getElementById(link.dataset.target); });
    var ticking = false;
    function updateActive() {
      var refY = window.innerHeight * 0.35;
      var activeIndex = -1;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i] && sections[i].getBoundingClientRect().top <= refY) activeIndex = i;
      }
      links.forEach(function (link, i) { link.classList.toggle("active", i === activeIndex); });
      ticking = false;
    }
    function onScroll() { if (!ticking) { requestAnimationFrame(updateActive); ticking = true; } }
    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActive);
  })();
</script>
```

## Video embeds

Prefer local `.mp4` screen-recordings over third-party iframes (YouTube/Wistia embeds can't be verified in sandboxed browser previews and sometimes silently fail):

```html
<div class="video-embed">
  <video controls preload="auto" poster="path/to/poster.jpg" src="path/to/video.mp4" title="..."></video>
  <button class="video-play-btn" aria-label="Play video">&#9658;</button>
</div>
```

```css
.video-embed { position: relative; overflow: hidden; border-radius: 12px; aspect-ratio: 16/9; }
.video-embed video { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; background: #000; object-fit: contain; }
.video-play-btn { position: absolute; inset: 0; margin: auto; width: 68px; height: 68px; border-radius: 50%; background: rgba(0,0,0,0.55); border: 2px solid #fff; color: #fff; font-size: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.video-embed.is-playing .video-play-btn { opacity: 0; pointer-events: none; }
```
JS: click button → `video.play()`; on `play`/`pause`/`ended` toggle `.is-playing` on the `.video-embed` wrapper. Generate the poster by seeking the video to ~4s in a canvas and exporting a JPEG — gives a real preview frame instead of a black first frame.

## Placeholder convention

Every image/video not yet supplied gets a dashed `.ph` box (or a size variant: `.ph-sm`, `.ph-thumb`, `.ph-chart`, `.ph-chart-lg`, `.ph-diagram`, `.ph-video`, `.ph-grid-6`) with an emoji + description, e.g.:

```html
<div class="ph ph-diagram">🖼 ph-04 — Diagram: hand stopping at surface obstacle, in-game vs real life</div>
```

Number placeholders sequentially per page (`ph-01`, `ph-02`, ...) so they're easy to find and swap out later.

## Design tokens (from `case-study.css`)

```css
--dark-bg: #1c1c1c;       --dark-card: #2e2e2e;      --dark-card-2: #353535;
--dark-border: #4a4a4a;   --dark-text: #e8e8e8;      --dark-text-dim: #b9b9b9;
--olive-bg: #57491d;      --olive-text: #e9dfb6;
--light-bg: #ffffff;      --light-card: #f7f8f9;     --light-border: #e6e8ec;
--ink: #17181c;           --ink-2: #3d3f45;
--blue: #4a97ee;          --mint: #e9f6ef;           --green: #1e9e50;
--pink: #fdf0ee;          --cream: #fdf6e3;          --greyblue: #f4f6f8;
--radius: 14px;
```

Fonts: `DM Sans` for body text, `Rajdhani` for `h1`/`h2`/`h3`/`.strip-title`/`.cover-title` (set globally in `case-study.css`, no per-page override needed).

Section background rotation: alternate `sec light` / `sec dark` per act; use `sec blue` sparingly for a single "explore" or "results" pivot; use `strip` variants only as one-line dividers.

## Responsive

`case-study.css` already collapses all grid components to a single column under `900px` and stacks `.uflow-row`/`.iter-item` offsets. New page-scoped grids should follow the same pattern — add their selectors into the page's own `@media (max-width: 900px)` block, don't touch `case-study.css`.

## Checklist for a new case study page

1. Copy this skeleton, swap section IDs/labels for the new project.
2. Import `case-study.css`, add only page-scoped classes/overrides in `<project>-coded.css`.
3. Reuse existing component classes (`.ctx-card`, `.pnq-card`, `.why-card`, `.sol-row`, `.research-card`, `.comp-table`, `.flag-card`, `.metric-card`, `.adopt-block`, `.reflect-card`, `.video-embed`, `.persona-photo-card`, `.nps-block`) before inventing new ones.
4. Insert numbered `.ph` placeholders for every asset not yet supplied.
5. Add the side nav + scroll-spy script only if the page has 15+ sections.
6. Verify in the browser at both mobile (<900px) and desktop widths, and confirm every side-nav id resolves.
