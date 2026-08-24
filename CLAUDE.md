# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Output Style
- Keep thinking/reasoning blocks to 1-2 lines max, or omit entirely.
- No step-by-step narration before tool calls.
- Go straight to actions; explain only final results, briefly.

## What this is

Static portfolio site (no build step, no framework). Plain HTML/CSS/JS served as-is.

## Commands

```bash
npm start
```
Runs `npx serve -l ${PORT:-3000} .`. No build, lint, or test suite.

## Architecture

### Page types

- **`index.html`** — landing page. Uses `style.css` + `script.js`. Nav, animated hero canvas, fade-up-on-scroll sections, hobby chips, project links.
- **Case study pages** — one per project (Lumigo, MES, FTUE, Infurnia, Motion-restriction-VR), each in up to two forms:
  - **Image-based** (`lumigo.html`, `mes.html`, `ftue.html`, `infurnia.html`, `Motion-restriction-VR.html`) — scrollytelling sequence of full-bleed screenshots from the matching folder (`lumigo/img_01.webp`, ...). Fast to produce, not real markup.
  - **Coded rebuild** (`lumigo-coded.html`, `mes-coded.html`, `ftue-coded.html`) — same case study as real HTML/CSS. `mes-coded.html` and `ftue-coded.html` are done; `lumigo-coded.html` still has `.lg-ph` placeholder divs (emoji + description) where content still needs to go.
  - Infurnia and Motion-restriction-VR have no coded counterpart yet.

### CSS

- `style.css` — `index.html` only.
- `case-study.css` — shared base (colors, typography, placeholder helpers, layout primitives), imported via `@import url("case-study.css");` at the top of every per-project stylesheet (`mes.css`, `mes-coded.css`, `ftue.css`, `ftue-coded.css`, `lumigo.css`, `lumigo-coded.css`, `infurnia.css`, `Motion-restriction-VR.css`).
- Each per-project stylesheet then adds its own scoped class prefix and palette (e.g. Lumigo's coded rebuild uses `lg-` classes and `--lg-*` variables).
- Shared primitives belong in `case-study.css`, not duplicated per project.

### JS

`script.js` loads only in `index.html`: nav scroll shadow, mobile menu toggle, scroll fade-up (`IntersectionObserver`), hobby-chip taps, hero canvas wave animation, GSAP click-cursor effect (GSAP via CDN in `index.html`; no-ops without GSAP or with `prefers-reduced-motion`). Case study pages have no JS of their own.

### Assets

- `images/` — shared assets for `index.html`.
- Per-project image folders (`lumigo/`, `manufacturing/` for MES, `ftue/`, `infurnia/`, `Motion-restriction-VR/`) hold numbered screenshots for that project's image-based page.

## Working conventions

- Respond with only the code needed; skip explanations/preamble. Mark omitted unchanged regions with `/* ... existing code ... */`.
- Do not explain your reasoning or steps. Proceed directly to the tool call or final answer.
- Prefer vanilla JS and native CSS (Grid, Flexbox, custom properties) over libraries/frameworks unless already in use.
- Prefer standard DOM APIs (`querySelector`, `addEventListener`) over jQuery; `localStorage`/`sessionStorage` over mock APIs; semantic tags (`<nav>`, `<main>`, `<dialog>`) over extra wrapper divs/classes.
- Route small, mechanical edits (copy/typo fixes, basic styling tweaks, simple event listeners/DOM tweaks, formatting) to a lighter/cheaper model or subagent; reserve full-capability review for architecture, cross-file refactors, and new features.
- Skip reading/scanning binary and generated assets: `node_modules/`, `.git/`, `dist/`, `build/`, `.DS_Store`, images (`*.png`, `*.jpg`, `*.jpeg`, `*.gif`, `*.svg`, `*.ico`), media (`*.mp4`, `*.mp3`), fonts (`*.woff`, `*.woff2`, `*.ttf`, `*.eot`), `*.map`.

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands relevant to this project (static HTML/CSS/JS, no build/lint/test tooling)

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### npm (relevant: `npm start` runs the local static server)
```bash
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%) — use for .html/.css/.js
rtk grep <pattern>      # Search grouped by file (75%). Format flags (-c, -l, -L, -o, -Z) run raw.
rtk find <pattern>      # Find grouped by directory (70%)
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
```
<!-- /rtk-instructions -->