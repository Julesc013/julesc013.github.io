# AGENTS.md

## Mission
Maintain this repository as a static website that evolves in controlled stages:
- V1: the canonical single-page content path at `/`
- V2: exactly one desktop surface plus one Notepad/TextEdit-style document window around that same content
- V3+: a fuller desktop/window-manager shell only after V2 and after the documented prerequisites are met

## Authority
- This file is the repository-wide governance contract. Files in `docs/` refine it for specific domains.
- If task wording and repository governance conflict, reconcile `AGENTS.md` and `docs/` explicitly before implementation.
- If governance files conflict, the more restrictive rule applies until the docs are reconciled.
- In governance-only phases, modify only `AGENTS.md` and files inside `docs/` unless the task explicitly authorizes more.

## Non-negotiable rules
- Preserve user-written site copy unless explicitly instructed to rewrite it.
- Preserve no-JS readability. Content access must not depend on JavaScript.
- Treat JavaScript as progressive enhancement, not as a hard dependency.
- Prefer minimal diffs over rewrites.
- Keep the site static-hostable on GitHub Pages.
- Do not silently redesign the site or replace the established retro direction with a generic modern UI.
- Maintain graceful degradation on old or limited browsers.
- Do not introduce frameworks unless explicitly requested.
- Do not silently change wording, information architecture, URLs, or deployment behavior.
- The canonical content path at `/` must survive V2 and V3+.
- Do not activate future features early. Multi-window, launcher, taskbar/dock, and richer shell behavior are not V2 work.

## Architecture rules
- Use a content-first architecture that is progressively enhanced and gracefully degradable.
- Separate content, shell, theme, and behavior.
- Keep one canonical DOM structure that can serve V1, V2, and V3+.
- Treat registries and schemas, not file paths, as the source of truth for identity.
- IDs for pages, apps, themes, modes, and registry entries must be kebab-case, registry-local, stable, and path-independent.
- Modes are orthogonal to themes.
- V2 scope is exactly one desktop surface plus one main document app window.
- V3+ is the first phase where multi-window management, launcher behavior, taskbar/dock behavior, and richer desktop features may be introduced.

## Build and Deploy Rules
- The locked build system is Eleventy.
- The locked source tree root is `src/`.
- The locked global data directory is `src/_data/`.
- The locked layouts/includes directory is `src/_includes/`.
- The locked generated output directory is `_site/`.
- Source and generated output must remain separate.
- On development branches, `src/` is the only authored site source of truth.
- `_site/` is generated output only and must not become the hand-edited source of truth.
- Generated output may still emit root-path assets such as `/style.css`, `/shell.js`, and the wallpaper files until a deliberate output-path migration is approved.
- The GitHub Actions Pages workflow builds and deploys `_site/`; `main` remains the live deployment line unless repository policy is explicitly changed.
- Do not reintroduce duplicate root-authored site files once the source-driven parity gate is passing.
- Do not change deployment branch policy or workflow scope casually.

## Workflow Rules
- Start by reading this file and all relevant files in `docs/`.
- Inspect the actual repository state before changing governance or implementation.
- Produce a plan before major edits, restructures, or migrations.
- Keep each PR focused on one concern when practical.
- Keep commits atomic, descriptive, and easy to revert.
- Explain tradeoffs and regression risks when scope is non-trivial.
- Use short-lived `codex/*` branches for implementation work unless instructed otherwise.
- If the raw Codex environment blocks git metadata writes or local Node/npm execution, first use any repo-local adapters that restore those capabilities from the repo root, then fall back to workspace-write / no-git / no-local-build mode only if those adapters are absent or broken.
- Replace placeholders with complete documents or remove them; do not leave partial governance or scaffolding docs behind.

## Verification Requirements
- Verify desktop layout.
- Verify narrow mobile layout.
- Verify no-JS readability.
- Verify menu, theme, mode, and persistence enhancements fail open when JavaScript or storage is unavailable.
- Verify links still work.
- Verify wallpaper/background behavior remains stable on mobile.
- Verify that V1/V2/V3+ boundaries remain explicit in docs and code.
- Verify that source/build/output reality remains documented consistently across `AGENTS.md` and `docs/`.
- Verify new docs remain internally consistent with each other.
- Verify `npm run build:parity` passes before retiring duplicated source files or changing branch/deploy assumptions.

## Codex Behavior Rules
- Always start by reading this file.
- Stay within the requested scope. Do not overreach into unrelated cleanup.
- Do not move files, activate future features, or change deployment unless the task explicitly calls for it.
- Do not rewrite user content unless explicitly instructed.
- Treat governance docs as enforceable contract text, not placeholders.
- Verify before finishing and report any gaps clearly.
- If repository rules and task wording conflict, resolve the docs so future ambiguity is removed.
