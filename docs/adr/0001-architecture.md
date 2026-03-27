# ADR 0001: Static Architecture and Build Boundary

- Status: Accepted
- Date: 2026-03-27

## Context
The repository has an Eleventy source/build layer under `src/` and `_site/`, registry-backed V2 rendering, parity tooling, and GitHub Actions workflows for CI and Pages deployment. The development line no longer keeps duplicate authored root site files once the source-driven parity gate is passing.

## Decision
- The build system is Eleventy.
- The source root is `src/`.
- Global data lives in `src/_data/`.
- Layouts and includes live in `src/_includes/`.
- Generated output is written to `_site/`.
- The architecture remains content-first, progressively enhanced, and gracefully degradable.
- The repository is configured for Actions-based Pages deployment targeting `_site/` from `main`.
- Development branches are source-only and rely on git history plus parity verification for rollback safety rather than duplicate authored root files.

## Consequences
- Source and generated output remain separate.
- Public and internal identities use stable IDs rather than file paths.
- The working V2 site can evolve inside the single-window boundary without reopening the build architecture.
- Cleanup should remove duplicate authored sources once parity is verified instead of preserving them indefinitely.
- Deployment changes remain gated by explicit verification and an approved policy change.
