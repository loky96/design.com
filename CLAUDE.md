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

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (60-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk go test             # Go test failures only (90%)
rtk jest                # Jest failures only (99.5%)
rtk vitest              # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk pytest              # Python test failures only (90%)
rtk rake test           # Ruby test failures only (90%)
rtk rspec               # RSpec test failures only (60%)
rtk test <cmd>          # Generic test wrapper - failures only
```

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
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
rtk uv run <cmd>        # Compact uv project command output
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%). Format flags (-c, -l, -L, -o, -Z) run raw.
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
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
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->