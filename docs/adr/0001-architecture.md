# ADR 0001: Static Architecture and Build Boundary

- Status: Accepted
- Date: 2026-03-27

## Context
The repository now has an Eleventy source/build layer under `src/` and `_site/`, registry-backed V2 rendering, parity tooling, and GitHub Actions workflows for CI and Pages deployment. The original root-served V1 files still remain in the repository as rollback and parity-reference artifacts.

## Decision
- The build system is Eleventy.
- The source root is `src/`.
- Global data lives in `src/_data/`.
- Layouts and includes live in `src/_includes/`.
- Generated output is written to `_site/`.
- The architecture remains content-first, progressively enhanced, and gracefully degradable.
- The repository is configured for Actions-based Pages deployment targeting `_site/`.
- Root legacy files remain in the repository for rollback and parity reference until their retirement is explicitly approved.

## Consequences
- Source and generated output remain separate.
- Public and internal identities use stable IDs rather than file paths.
- The working V2 site can evolve inside the single-window boundary without reopening the build architecture.
- Future cleanup must not remove the protected root legacy files casually.
- Deployment and rollback decisions remain gated by explicit verification and an approved retirement plan.
