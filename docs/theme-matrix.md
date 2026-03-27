# Theme Matrix

## Theme Families
The project stays within a retro desktop/document aesthetic. Theme families are visual systems, not content systems.

| Family ID | Representative Variants | Notes |
| --- | --- | --- |
| `windows-classic` | `win95`, `win98`, `win2000` | Default family space and the current `win98` starter theme. |
| `mac-classic` | `system-7`, `platinum`, `macos9` | Supports the current classic document-app interpretation. |
| `x11-retro` | `motif`, `cde` | Fits later desktop-shell exploration while preserving retro direction. |
| `dos-retro` | `msdos` | Supports the current austere fallback-friendly starter theme. |

Representative variants are examples of the intended family space, not a mandate to implement every listed variant immediately.

## Implemented Starter Themes
- `win98` in `windows-classic` is the default V2 theme.
- `macos9` in `mac-classic` is the current rounded classic alternative.
- `cde` in `x11-retro` is the current workstation-style alternative.
- `msdos` in `dos-retro` is the current high-contrast minimal alternative.

## Theme Rules
- Themes are presentation only.
- Themes must not rewrite copy, change information architecture, or alter link destinations.
- Themes must not require JavaScript for basic readability.
- Themes must not change the canonical DOM structure or the canonical content path at `/`.
- Modes remain orthogonal to themes.
- One active theme at a time is sufficient.
- Theme switching is currently implemented as optional enhancement within V2.
- The default theme direction must remain compatible with the extant retro, windowed baseline.

## Family Notes
- `windows-classic` is the default reference family because the current site already leans in that direction.
- `mac-classic` is compatible with the V2 single document-window goal.
- `x11-retro` is a valid future family for V3+ experimentation, provided it does not pull V3+ features into V2.
- `dos-retro` is the most austere current family and aligns with the safe, low-friction end of the present starter set.

## Registry Guidance
- Theme families and theme variants should each use stable kebab-case IDs.
- IDs are registry-local, stable, and path-independent.
- A theme registry entry should at minimum identify its `id`, `family`, and display label.
- File locations, template names, or stylesheet names are not theme identity.
- Theme metadata may point to tokens, classes, or templates later, but those references are implementation detail.
- Theme switching UI is optional in architecture terms, but the current V2 baseline already exposes a small starter set.
