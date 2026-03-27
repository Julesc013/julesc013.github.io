# Codex Workflow

## Purpose
This document defines the staged prompt queue for repository work and the safety rules that govern movement from one stage to the next.

## Prompt Groups
| Group | Purpose |
| --- | --- |
| `A1` | Audit the extant repository, production surface, and constraints before architecture or implementation decisions are locked. |
| `A2` | Lock architecture decisions, scope boundaries, and non-negotiable rules. |
| `B1` | Create the governance document set required to express the locked decisions. |
| `B2` | Reconcile the governance set for consistency, scope accuracy, and implementation safety. |
| `B3` | Consolidate unresolved governance work so the repository is fully C1-ready without starting foundation implementation. |
| `C1` | Scaffold the foundation layer for the locked Eleventy structure without changing deployment authority prematurely. |
| `C2` | Prepare parity-safe source/output wiring and migration steps while root deployment files remain authoritative. |
| `D1` | Normalize and structure canonical content for the future source/build layer without changing user-facing meaning. |
| `D2` | Compose the canonical shell/layout integration that preserves the single DOM and extant reading path. |
| `E1` | Implement V2's single desktop surface and single document window. |
| `E2` | Refine the V2 document app with menu, mode, theme, and persistence behavior that stays inside the V2 boundary. |
| `F1` | Plan V3+ shell architecture, registries, and capability boundaries beyond the V2 contract. |
| `F2` | Implement approved V3+ shell features such as multi-window, launcher, or taskbar/dock behavior. |
| `G` | Run recurring hardening, cleanup, docs-from-reality sync, parity signoff, deployment review, and other approved post-V2 maintenance. |

## Current Repo State
- The repository currently has a working registry-backed V2 baseline with one desktop surface, one document window, one lightweight menu bar, three modes, four starter themes, and optional persistence.
- The next safe recurring slice is `G`-style hardening, cleanup, verification, and docs-from-reality work rather than new shell scope.
- Root legacy files remain retained for rollback safety until their retirement is explicitly approved.

## Manual-Safe Default
- If the requested prompt group is ambiguous, fall back to audit, documentation, or narrowly scoped fixes.
- Do not assume permission to restructure the repository, activate Eleventy, or change deployment just because later groups exist.
- When repository state and prompt intent disagree, prefer preserving the extant production surface and document the conflict.
- If a placeholder governance document blocks safe implementation, complete the governance work before writing code.

## Review-Gate Discipline
- Finish and review each group before starting the next group that depends on it.
- Do not skip from `A` or `B` work straight into implementation if the contract is still incomplete.
- Do not begin `C` work until `B3` leaves the repository governance layer internally consistent.
- Do not begin `F` work while V2 scope is still unresolved or expanding.
- Deployment-transition work stays gated until parity is explicitly verified.

## Verification Expectations
- `A` and `B` groups verify repository state, governance consistency, and scope clarity.
- `C` and `D` groups verify parity protection, directory-model correctness, and unchanged user-facing behavior.
- `E` groups verify the V2 boundary, desktop layout, narrow mobile layout, no-JS readability, link integrity, and failure-safe enhancements.
- `F` groups verify that V3+ work does not break the extant reading path or pull forbidden features into V2.
- `G` verifies recurring hardening, cleanup, deployment confidence, and regression coverage across the current V2 baseline.

## PR Discipline
- Prefer one concern per PR.
- Keep governance PRs separate from implementation PRs when practical.
- Keep migrations decomposed into reversible steps.
- Explain tradeoffs, verification results, and regression risks when the scope is non-trivial.

## Regression Rules
- Preserve user-written copy unless explicitly instructed otherwise.
- Preserve the canonical V1 content path at `/`.
- Preserve no-JS readability.
- Preserve current link destinations unless explicitly instructed otherwise.
- Preserve the established retro direction.
- Do not move, rename, or retire root deployment files before publishing authority and rollback safety are explicitly reconfirmed.
- Do not activate V3+ shell behavior during V2 work.

## Subagent Usage Rules
- Use bounded parallel subagents for audits, comparisons, or other well-scoped sidecar tasks when that materially speeds up the work.
- Keep subagent responsibilities disjoint.
- Do not assign overlapping write scopes to multiple implementation agents.
- The primary agent remains responsible for final synthesis, consistency, and verification.
- Subagents do not override repository governance; they operate within it.
