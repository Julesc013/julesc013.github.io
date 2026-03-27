# Theme Matrix

## Theme Families
The project stays within a retro desktop/document aesthetic. Theme families are visual systems, not content systems.

| Family ID | Representative Variants | Status | Notes |
| --- | --- | --- | --- |
| `windows-classic` | `win31`, `win98`, `win2000` | Partial visible catalog | `win98` is implemented; the rest are scaffolded catalog entries for later work. |
| `windows-modern` | `winxp`, `win7`, `win81`, `win10`, `win11` | Scaffolded visible catalog | Present in the catalog and settings architecture, but not selectable in V2 yet. |
| `mac-classic` | `system6`, `macos92` | Partial visible catalog | `macos92` currently uses the extant classic-Mac package as a preview-quality bridge. |
| `macosx` | `macos100`, `macos105`, `macos1010`, `macos11`, `macos26` | Scaffolded visible catalog | Present in the catalog and settings architecture, but not selectable in V2 yet. |

The visible catalog is intentionally larger than the currently selectable set so later prompts can deepen the family bases and add per-theme implementation without reopening IDs or settings structure.

## Family Foundations
- `src/themes/families/windows-classic/`, `windows-modern/`, `mac-classic/`, and `macosx/` now carry shared family metrics, tokens, and effect-ladder files.
- Current implemented variants align conservatively with those family bases: `win98` now rides the `windows-classic` baseline, and `macos92` keeps only the radius delta that is not yet safe to universalize across `mac-classic`.
- The family effect ladder is defined as levels `0` through `3`, mapped to the user-facing `off`, `low`, `medium`, and `high` settings. Advanced translucency and blur remain enhancement-only and must fail open.

## Hidden Compatibility Themes
- `macos9` remains as a hidden compatibility theme while the visible catalog uses `macos92`.
- `cde` in `x11-retro` remains as a hidden compatibility theme.
- `msdos` in `dos-retro` remains as a hidden compatibility theme.

These legacy entries are not part of the normal visible catalog and exist only to preserve Prompt 1 compatibility and old stored preferences safely.

## Current V2 Selection State
- `win98` is the default V2 theme and is fully selectable.
- `macos92` is selectable as an honest preview-quality bridge to the current classic-Mac package.
- All other requested visible themes are scaffolded catalog entries and render as unavailable status items, not live controls.

## Theme Rules
- Themes are presentation only.
- Themes must not rewrite copy, change information architecture, or alter link destinations.
- Themes must not require JavaScript for basic readability.
- Themes must not change the canonical DOM structure or the canonical content path at `/`.
- Modes remain orthogonal to themes.
- The visible catalog may be larger than the currently selectable set, but unfinished entries must be marked honestly.
- Theme switching is currently implemented as optional enhancement within V2.
- The default theme direction must remain compatible with the extant retro, windowed baseline.

## Registry Guidance
- Theme families and theme variants should each use stable kebab-case IDs.
- IDs are registry-local, stable, and path-independent.
- Visible catalog entries and hidden compatibility entries may coexist in the registry when that is the safest way to preserve behavior.
- A theme registry entry should identify at minimum its `id`, `family`, label, status, and availability.
- File locations, template names, or stylesheet names are not theme identity.
- Theme metadata may point to tokens, classes, or templates later, but those references are implementation detail.
