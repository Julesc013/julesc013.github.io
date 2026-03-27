# Codex Environment Notes

This note applies to the current Codex execution environment for this repository.

## Raw Environment Limits
- Direct writes under the original `.git/objects` and `.git/refs/heads` paths are blocked.
- System `node` and `npm` are not available on `PATH`.
- Workspace file writes still succeed.

## Repo-Local Repairs
- Plain `git` now works from the repository root through a repo-local wrapper that uses the writable `.git-codex/` metadata store.
- Plain `node`, `npm`, and `npx` now work from the repository root through repo-local wrappers backed by `.local-tools/node/`.
- npm writable state is redirected into the repository through `.npmrc`.

## Required Usage
- Run `git`, `node`, `npm`, and `npx` from the repository root so the repo-local wrappers are used.
- Treat `.git-codex/`, `.local-tools/`, and the repo-root wrapper scripts as local environment adapters, not product files.
- CI remains authoritative for shared build validation, but local Node-based build execution is now available again from the repo root.

## Fallback Rule
- If the repo-local adapters are missing or broken in a future session, fall back to workspace-write / no-git / no-local-build mode and rely on CI until the adapters are restored.
