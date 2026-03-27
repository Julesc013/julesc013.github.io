# Notepad V2 Specification

## V2 Scope
V2 is exactly one desktop surface plus one Notepad/TextEdit-style document window.

- There is one primary document window.
- That window presents the canonical homepage content.
- The page still resolves at `/`.
- No additional app windows are required or implied.

## Document Model
- The canonical document content is the existing homepage content path, not a rewritten alternate source.
- The document remains readable in HTML without JavaScript.
- Content order, link destinations, and user-written copy remain protected by the extant definition unless explicitly changed.
- Shell chrome may frame the content, but the content itself remains canonical and singular.

## Window Model
- V2 has one visible document window only.
- The window may include a title bar, body area, menu bar, status area, and document framing that evoke Notepad or TextEdit.
- The window may appear on a desktop surface, but content access must not depend on drag, resize, focus, or any other interaction.
- If JavaScript is unavailable, the same document content still renders inside a simpler readable fallback shell.
- Decorative positioning and polish are allowed; required window management is not.

## Menu Model
- The current V2 build includes a lightweight menu bar with File, Edit, View, and Help groups.
- Menus are implemented as semantic `details` / `summary` groups with optional JavaScript enhancement.
- Menu items may expose links, small utility actions, or theme/mode choices, but they remain non-blocking.
- Menus must not imply unsupported file system behavior such as real save, open, or edit operations.
- Menus must not be the only way to reach the document content.
- If JavaScript is unavailable, content access must remain intact even when some menu actions reduce to inert affordances.

## Theme and Mode Behavior
- Theme metadata and mode metadata exist in the registries and rendered shell hooks.
- Modes remain orthogonal to themes.
- Theme changes must not alter content structure or identity.
- The visible V2 theme catalog now uses the requested Prompt 2 IDs and keeps unfinished entries honest.
- The currently selectable visible themes are `win98` and `macos92`.
- Hidden compatibility themes such as `macos9`, `cde`, and `msdos` may remain in metadata so older stored preferences fail safe.
- The current modes are `museum`, `practical`, and `safe`.
- `practical` is the default enhanced presentation.
- Theme and mode switching are optional enhancements and may persist preferences when storage is available.

## No-JS and Degradation Rules
- The document content must exist in the initial HTML.
- The page must remain readable when JavaScript is absent or fails.
- Desktop and window chrome are progressive enhancement, not prerequisites.
- The no-JS path falls back to a simpler safe-style shell and hides enhancement-only display controls.
- The page must still function as a single document when CSS support is limited.
- No persistent client state is required for basic reading.

## Explicit Exclusions
- Multi-window behavior.
- Launcher or start-menu behavior.
- Taskbar or dock behavior.
- Desktop icons as required navigation.
- Real file editing, saving, or opening.
- Required drag, resize, minimize, or maximize behavior.
- Client-side routing.
- Any shell feature that moves the canonical content path away from `/`.
