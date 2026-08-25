# AI Hub Settings — Design Reference

Prototype of `aihub.instabase.com` settings, built on Pollen design tokens (`styles.css` `:root`).

## Files
- `index.html` — markup for settings page + all modals
- `styles.css` — Pollen tokens + component styles
- `app.js` — interactions (modal open/close, form state, copy-to-clipboard)
- `icons.js` — inline icon set

## Color
| Token | Value | Use |
|---|---|---|
| `--btn-primary-bg` | `#5a52fa` | primary button, links, active tab |
| `--btn-primary-hover` | `#1d0ebe` | primary button hover |
| `--btn-primary-disabled` | `#C3C5FD` | primary button disabled |
| `--color-border` | `#E0E0E0` | dividers, borders |
| `--color-success` | `#34b785` | success states |
| `--color-error` | `#ee4823` | error states, destructive text |
| `--modal-text` | `#292929` | modal heading/body text |

## Typography
Font: `Roboto` (normal), `Roboto Mono` (code).

| Scale | Size | Weight (default) |
|---|---|---|
| xsmall | 12px | — |
| small | 14px | — |
| medium | 16px | — |
| large | 20px | — |
| xlarge | 28px | — |
| xxlarge | 36px | — |

Modal headings (`.modal-title`, `.modal-title-lg`, `.confirm-title`, `.signin-title`) are **h3**, fixed at **24px / bold** — overridden from the xlarge token, not tied to it.

## Spacing & radius
`--space-1` (4px) through `--space-9` (36px), step 4px.
Radius: xxsmall 2px, xsmall 4px, small 8px, medium 12px, large 32px.

## Modals
Two sizes, applied everywhere (base `.modal`, inline styles, and variant classes):

| Size | Width | Classes / cases |
|---|---|---|
| **Big** | 820px | base `.modal`, `.modal-bulk-groups`, SAML/OIDC modals |
| **Small** | 600px | `.modal-sm`, `.modal-add-group`, `.confirm-modal`, SSO test/success/failed status modals |

- Corner radius: `--modal-radius` = 16px (shared by all modals, incl. sign-in modal).
- Footer buttons (`.modal-footer`, `.confirm-footer`): fit content, right-aligned — for **both** sizes. Full-width stacked buttons are an explicit opt-in via `.modal-footer--full-width` / `.group-success-footer` / `.token-success-footer`, not the default for small modals.
- Backdrop: `--modal-overlay` `#52525285`; shadow: `--modal-shadow`.

## Conventions for future changes
- Prefer editing the shared CSS variable (`--modal-radius`, `--modal-footer-padding`, etc.) over per-modal overrides so a change applies everywhere.
- When adding a new modal, pick big (820px) or small (600px) — don't introduce a third width.
- Modal heading is always `h3` with `.modal-title` (or `.confirm-title` / `.signin-title` for dialogs/sign-in).
