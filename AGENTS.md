# AGENTS.md

## Mission
Maintain this repo as a static website that progressively evolves from:
- v2: single desktop + single Notepad/TextEdit-style window
- v3: fuller desktop/window manager shell

## Non-negotiable rules
- Preserve the user's written site copy unless explicitly instructed to rewrite text.
- Prefer minimal diffs over rewrites.
- Keep the site static-hostable on GitHub Pages.
- Keep content readable without JavaScript.
- Treat JavaScript as progressive enhancement, not a hard dependency.
- Do not introduce frameworks unless explicitly requested.
- Do not replace the existing design direction with a modern generic design.
- Maintain graceful degradation on old/limited browsers.

## Architecture rules
- Separate content, shell, theme, and behavior.
- One canonical DOM structure.
- Themes are data/config where possible.
- Modes are orthogonal to themes.
- Default v2 scope is: blank desktop + one main document app window.

## Browser/support policy
- Baseline: readable with no JS.
- Enhanced: theme switching and menus with JS.
- Avoid relying on bleeding-edge CSS/JS as core behavior.

## Change policy
- Before major edits, produce a plan.
- Make one focused change per PR where practical.
- Explain tradeoffs and regression risks.
- Do not silently change user wording or information architecture.

## Verification
- Test desktop and narrow mobile layout.
- Test no-JS readability.
- Check that links still work.
- Check that wallpaper/background behavior remains stable on mobile.
