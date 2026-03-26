# AGENTS.md

## Mission
Maintain this repository as a static website that evolves in controlled stages:
- V1: extant single-page site
- V2: one desktop surface plus one Notepad/TextEdit-style document window
- V3+: fuller desktop/window-manager shell

## Non-negotiable rules
- Preserve user-written site copy unless explicitly instructed to rewrite it.
- Preserve no-JS readability. Content access must not depend on JavaScript.
- Treat JavaScript as progressive enhancement, not as a hard dependency.
- Prefer minimal diffs over rewrites.
- Keep the site static-hostable on GitHub Pages.
- Do not silently redesign the site or replace the established retro direction with a generic modern UI.
- Maintain graceful degradation on old or limited browsers.
- Do not introduce frameworks unless explicitly requested.

## Architecture principles
- Separate content, shell, theme, and behavior.
- Keep one canonical DOM structure that can serve V1, V2, and V3+.
- Use stable IDs for pages, apps, themes, and modes.
- Use registries and schemas, not file paths, as the source of truth.
- Keep source and generated output separate once a build layer exists.
- Modes are orthogonal to themes.
- V2 scope is one desktop surface and one main document app window only.

## Workflow rules
- Read `AGENTS.md` and all relevant files in `docs/` before making changes.
- Produce a plan before major edits, restructures, or migrations.
- Keep each PR focused on one concern when practical.
- Keep commits atomic, descriptive, and easy to revert.
- Do not silently change wording, information architecture, URLs, or deployment behavior.
- Use short-lived `codex/*` branches for implementation work unless instructed otherwise.
- Explain tradeoffs and regression risks when scope is non-trivial.

## Verification requirements
- Verify desktop layout.
- Verify narrow mobile layout.
- Verify no-JS readability.
- Verify links still work.
- Verify wallpaper/background behavior remains stable on mobile.
- Verify new docs remain internally consistent with each other.

## Codex behavior rules
- Always start by reading this file.
- Stay within the requested scope. Do not overreach into unrelated cleanup.
- Do not move files, activate future features, or change deployment unless the task explicitly calls for it.
- Verify before finishing and report any gaps clearly.
- If repo rules and task wording conflict, resolve the docs so future ambiguity is removed.
