# Extant Definition

## Current Baseline
The current extant baseline is the generated single-page homepage served at `/`, built from the authoritative `src/` source tree.

- The canonical homepage source is `src/index.11ty.js`.
- The canonical homepage content fragment is `src/content/home.html`.
- The canonical stylesheet output remains `style.css`, generated from `src/style.11ty.js`, `src/assets/css/base.css`, `src/assets/css/shell.css`, `src/assets/css/effects.css`, `src/assets/css/modes.css`, `src/assets/css/responsive.css`, and the theme packages under `src/themes/`.
- The canonical shell behavior source is `src/assets/js/shell.js`.
- The wallpaper source set lives under `src/assets/img/wallpapers/`.
- The generated site still emits `index.html`, `style.css`, `shell.js`, and wallpaper files at the output root for continuity at `/`.

## Production-Critical Source Files
These files define the current V2 source baseline and parity gate:

- `src/index.11ty.js`
- `src/content/home.html`
- `src/style.11ty.js`
- `src/assets/css/base.css`
- `src/assets/css/shell.css`
- `src/assets/css/effects.css`
- `src/assets/css/modes.css`
- `src/assets/css/responsive.css`
- `src/themes/`
- `src/assets/js/shell.js`
- `src/assets/img/wallpapers/bg_2560x1920.jpg`
- `src/_data/pages.json`
- `src/_data/themes.json`
- `src/_data/theme-families.json`
- `src/_data/settings-options.json`
- `src/_data/settings-ui.json`
- `src/_data/modes.json`
- `src/_data/apps.json`
- `src/_data/capabilities.json`
- `tools/check-parity.cjs`

## What Must Not Regress
- The site root `/` must continue to expose the homepage content directly.
- User-written copy must remain unchanged unless explicitly instructed otherwise.
- The current outbound link destinations must remain intact unless explicitly instructed otherwise.
- Primary content must remain readable without JavaScript.
- The main reading flow and primary heading hierarchy must remain intact.
- The established retro, windowed presentation direction must not be silently replaced with a generic modern redesign.
- Wallpaper/background behavior must remain stable on mobile and must not obscure content.

## What May Change Safely
- Internal implementation details behind the same user-visible behavior.
- Theme tokens, family bases, effect policies, CSS organization, registry wiring, or shell polish that do not break parity.
- Decorative polish that preserves the retro direction, readability, and layout stability.
- Generated output file plumbing, provided the canonical URL shape and readable no-JS path remain intact.

## Rollback Model
- Rollback safety now comes from git history, branch isolation, and the passing parity gate rather than from duplicate authored root site files.
- `main` remains the live deployment line unless deployment policy is explicitly changed.
- Development branches should stay source-only once `src/` is the verified source of truth.

## Explicit Parity Definition
For this repository, parity means that a generated or restructured output is an acceptable replacement only when all of the following are true:

- The site root `/` still exposes the same canonical homepage content.
- User-written copy is unchanged unless an explicit content-change instruction approved otherwise.
- Outbound link destinations are unchanged unless explicitly approved otherwise.
- The reading order, primary heading, and main-content access remain intact.
- The page remains readable and usable without JavaScript.
- The visual result preserves the established retro direction and does not introduce a silent redesign.
- Wallpaper/background behavior remains stable on desktop and mobile within normal browser tolerance.
- No new runtime requirement is introduced for basic access to the page.

## Verification Checklist
- Open the site at `/` and confirm the homepage content is still directly visible.
- Disable JavaScript and confirm the page remains readable and linkable.
- Check the main content order and heading hierarchy.
- Compare outbound link destinations against the canonical source content fragment.
- Check desktop layout.
- Check narrow mobile layout.
- Check wallpaper/background behavior on mobile.
- Confirm no early V3+ features have been activated in V2 work.
- Run `npm run build:parity` and confirm the generated output matches the authoritative `src/` sources.
