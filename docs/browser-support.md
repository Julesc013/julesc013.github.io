# Browser Support Contract

## Purpose
This document defines the support tiers for the site and the minimum guarantees that must hold across V1, V2, and V3+ work.

## Tier 0
Tier 0 is the no-JS, low-CSS, fail-open baseline.

### Guarantees
- Primary content is readable in source order.
- The site root `/` exposes the canonical V1 content path directly.
- Links remain visible and usable.
- The page remains understandable even if desktop chrome disappears.

### Allowed Degradation
- Plain HTML presentation.
- Loss of wallpaper/background imagery.
- Loss of gradients, shadows, or decorative window styling.
- Menus shown as plain text or absent.

## Tier 1
Tier 1 is limited or older browser support with basic CSS but incomplete modern feature support.

### Guarantees
- A readable single-document experience remains intact.
- Text contrast, spacing, and link access remain usable.
- The page does not rely on modern CSS or JavaScript features for core comprehension.

### Allowed Degradation
- Simplified layout if viewport or feature support is constrained.
- Fallback behavior when features such as `dvh`, fixed positioning, gradients, or advanced focus styling are unavailable.
- Reduced decorative fidelity in desktop or window chrome.

## Tier 2
Tier 2 is current evergreen browser support on desktop and mobile.

### Guarantees
- The intended retro presentation renders as designed.
- Wallpaper/background behavior remains stable on desktop and mobile.
- The extant V1 experience, and later the V2 single-window experience, render without functional regressions.

### Allowed Degradation
- Minor visual differences between engines that do not affect parity, readability, or access to content.

## Tier 3
Tier 3 is optional progressive enhancement through JavaScript.

### Guarantees
- Enhancements are additive only.
- Failure to load or execute JavaScript leaves the site readable and navigable.
- Enhanced menus, theme controls, or window polish do not become required for access to primary content.

### Allowed Degradation
- No enhancement when JavaScript is absent.
- Inert or simplified enhanced controls when the browser refuses optional APIs.

## Forbidden Dependencies
- JavaScript-required access to primary content.
- Client-side routing as a prerequisite for reading the canonical document.
- Launcher, taskbar/dock, or window-management behavior as a prerequisite for reaching content.
- Storage, service workers, or network-dependent runtime state as a prerequisite for basic page rendering.
- Modern CSS or JS APIs as hard dependencies for the core reading path.

## Cross-Tier Rules
- The same primary content and URLs must remain available across all tiers.
- Enhancements must fail open.
- Wallpaper/background treatment is decorative and must not obscure content if it fails.
- Theme changes must not alter content structure or hide core information.
- Keyboard and basic link navigation must remain viable even when enhancements are absent.
- If a feature cannot degrade gracefully to Tier 0 and Tier 1, it is not part of the core experience.

## Verification Expectations
- Verify Tier 0 by disabling JavaScript and confirming content readability and link access.
- Verify Tier 1 by checking constrained or partially supported layout behavior, including narrow mobile conditions.
- Verify Tier 2 by checking current desktop and mobile browsers for intended presentation and wallpaper stability.
- Verify Tier 3 by confirming enhanced behavior is additive and that disabling JavaScript returns the site to a readable baseline.
