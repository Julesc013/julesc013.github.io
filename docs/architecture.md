# Architecture Contract

## Purpose
This document defines the repository's architecture contract for the current post-migration V2 baseline: a registry-backed Eleventy build that preserves the canonical content path at `/`, keeps the site readable without JavaScript, and retains root legacy files for rollback safety.

## Core Principles
- Content-first: user-facing content is primary and must remain readable without JavaScript.
- Progressive enhancement: shell behavior, menus, theme switching, and mode switching may enhance the experience but must not gate access to content.
- Graceful degradation: when CSS or JavaScript features are unavailable, the page must remain readable and navigable.
- Canonical DOM: one DOM structure serves V1, V2, and V3+; later phases wrap or enhance it instead of duplicating it.
- Stable identity: IDs remain stable even if file layout, templates, or build steps change.
- Path independence: registries and schemas identify things by stable IDs, not by filesystem paths.
- Source/output separation: editable source and generated output remain distinct.

## Eleventy Directory Model
- The locked build system is Eleventy.
- The locked source root is `src/`.
- The locked global data directory is `src/_data/`.
- The locked layouts/includes directory is `src/_includes/`.
- The locked generated output directory is `_site/`.
- The repository now contains GitHub Actions workflows that build and deploy `_site/`.
- Root legacy files remain in the repo as rollback and parity-reference artifacts until their retirement is explicitly approved.

## System Layers
- Content: user-written copy, page text, structured records, and canonical document content.
- Shell: framing elements such as page chrome, desktop surface, window chrome, and future shell containers.
- Theme: presentation tokens, family selection, and visual rules that do not alter content meaning.
- Behavior: optional JavaScript enhancements for menus, theme controls, mode controls, and light shell polish.

The dependency direction is inward:
- Content must stand on its own.
- Shell may wrap content.
- Theme may style content and shell.
- Behavior may enhance content, shell, and theme, but must fail open.

## Canonical DOM Expectations
- The primary content must exist in HTML and remain readable in source order without JavaScript.
- The canonical content path remains the site root `/`, even when the page is presented inside the V2 document window.
- The primary document content belongs in a real main content region and must not be duplicated into separate fallback and enhanced copies.
- Desktop chrome, window chrome, menus, and status areas are shell around the canonical content, not alternate content sources.
- Menus and display controls must never be required to reach the primary content.
- DOM hooks and registry references must use stable IDs rather than file-path-derived names.

## Registry Model
- Registries are the source of truth for pages, apps, themes, modes, and related configuration.
- Each registry owns its own namespace.
- Cross-registry references must use IDs, not file paths.
- Templates and build logic consume registry data; they do not define identity themselves.
- Moving a file, renaming a template, or reorganizing source folders must not require changing public or internal stable IDs.

## Common Schema Rules
- Every registry entry must have a required `id`.
- IDs must be kebab-case.
- IDs must be unique within their registry.
- IDs must be stable over time.
- IDs must be path-independent.
- Human-readable labels or titles may change without changing IDs.
- Classification fields such as family, kind, or mode do not replace the stable ID.
- Relationships between records must reference IDs only.
- Optional fields must fail safely when absent.

## Source vs Output
- Editable source files live under `src/`.
- Generated output lives under `_site/`.
- Generated output is not the hand-edited source of truth.
- The repository is configured for Actions-based build and deploy from `_site/`, but root legacy files remain protected rollback artifacts until external publishing settings are confirmed stable.
- Source migration and future cleanup must preserve the current canonical URL structure and the canonical content path at `/`.

## Future Extensibility Model
- V2 work is limited to one desktop surface and one Notepad/TextEdit-style document window.
- V2 may include lightweight menu, theme, and mode enhancements so long as content remains directly readable and no-JS-safe.
- V3+ may add multi-window, launcher, taskbar/dock, or richer shell features only after the documented prerequisites are met.
- New capabilities should be introduced by extending registries and shell layers, not by duplicating or fragmenting the canonical content.
- Themes and modes remain orthogonal so the same content and shell can render under multiple visual systems.
