# Extant V1 Definition

## V1 Baseline
The repository retains the root-served static V1 experience as its rollback baseline and parity reference.

- The canonical V1 page is `index.html` at the site root.
- The canonical V1 stylesheet is `style.css` at the site root.
- The retained V1 page is a single readable document with a skip link, one visible window-styled surface, a main content region, and a project-link list.
- No JavaScript is required for reading the retained V1 page.
- The current wallpaper/background treatment is decorative and is sourced from root-resident image assets.
- The active CSS reference today is `bg_2560x1920.jpg`.
- The implemented V2 site is now built from `src/` and emits `_site/`, but the root V1 files remain in-repo as rollback safety.

## Production-Critical Files
These files define the retained V1 rollback surface and parity reference. Keep them in place until their retirement is explicitly approved:

- `index.html`
- `style.css`
- `bg_2560x1920.jpg`

The remaining root wallpaper assets are protected supporting assets while rollback safety is still required:

- `background.heic`
- `background.jpeg`
- `bg_1920x1440.heic`
- `bg_1920x1440.jpg`
- `bg_2560x1920.heic`

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
- Theme tokens, CSS organization, registry wiring, or shell polish that do not break parity.
- Decorative polish that preserves the retro direction, readability, and layout stability.
- The current source/build scaffolding under `src/` and `_site/`, provided the canonical URL shape and rollback safety remain intact.

## What Must Not Change While Rollback Safety Is Required
- Keep the root V1 files in place until production publishing authority and rollback strategy are explicitly reconfirmed.
- The canonical V1 content path at `/` must survive V2 and V3+ work.
- The repository must not silently move, rename, or retire current root deployment files.
- V2 must remain exactly one desktop surface plus one Notepad/TextEdit-style document window.
- Multi-window management, launcher behavior, taskbar/dock behavior, and richer shell features remain V3+ work.
- No task may make primary content access depend on JavaScript.

## Explicit Parity Definition
For this repository, parity means that a generated or restructured output is an acceptable replacement for the retained root rollback surface only when all of the following are true:

- The site root `/` still exposes the same canonical homepage content.
- User-written copy is unchanged unless an explicit content-change instruction approved otherwise.
- Outbound link destinations are unchanged unless explicitly approved otherwise.
- The reading order, primary heading, and main-content access remain intact.
- The page remains readable and usable without JavaScript.
- The visual result preserves the established retro direction and does not introduce a silent redesign.
- Wallpaper/background behavior remains stable on desktop and mobile within normal browser tolerance.
- No new runtime requirement is introduced for basic access to the page.

## Early Regression Checklist
- Open the site at `/` and confirm the homepage content is still directly visible.
- Disable JavaScript and confirm the page remains readable and linkable.
- Check the main content order and heading hierarchy.
- Compare outbound link destinations against the extant baseline.
- Check desktop layout.
- Check narrow mobile layout.
- Check wallpaper/background behavior on mobile.
- Confirm no early V3+ features have been activated in V2 work.
