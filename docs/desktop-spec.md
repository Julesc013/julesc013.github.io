# Desktop V3+ Specification

## V3+ Capability Area
V3+ is the first phase where richer desktop-shell behavior may be introduced. Examples include:

- Multiple windows or app surfaces.
- Launcher or start-menu behavior.
- Taskbar or dock behavior.
- Desktop icons or app launch affordances.
- App switching, focus management, or richer shell state.

These capabilities are explicitly outside V2 scope.

## V2 Boundary
V2 is exactly one desktop surface plus one Notepad/TextEdit-style document window.

V2 does not require:
- More than one window.
- Launcher behavior.
- Taskbar or dock behavior.
- Desktop icon navigation.
- Window management beyond optional decorative polish.

## V3+ Rules
- V3+ work must remain content-first, progressively enhanced, and gracefully degradable.
- V3+ shell features must not replace the canonical content source.
- Registry entries and shell state must use stable kebab-case, registry-local, path-independent IDs.
- V3+ features must be additive to the extant reading path at `/`.
- New shell behavior must fail open when JavaScript is unavailable.
- Deployment transition rules, root-file authority, and parity requirements still apply.

## V3+ Must-Not-Break Rules
- The canonical V1 content path at `/`.
- No-JS readability.
- User-written copy unless explicitly changed by instruction.
- Existing outbound link destinations unless explicitly changed by instruction.
- The established retro direction.
- Wallpaper/background stability on mobile.
- The single canonical content source rule.

## Preconditions Before V3+ Work
- The governance layer in `AGENTS.md` and `docs/` is complete and internally consistent.
- V1 parity expectations are documented and understood.
- Any Eleventy scaffolding respects the locked `src/`, `src/_data/`, `src/_includes/`, and `_site/` model.
- Root deployment files remain authoritative until GitHub Actions deployment is live and parity is verified.
- V2 scope has been honored and not expanded implicitly.

## Explicit Non-Requirements for V2
- Simultaneous open applications.
- App lifecycle management.
- Persistent shell state.
- Drag-to-arrange desktop icons.
- Complex window z-order systems.
- Notification areas, system trays, or status bars.
- Any interaction model that hides content behind the shell.
