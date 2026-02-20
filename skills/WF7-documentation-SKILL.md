---
name: documentation
description: Use when writing or updating component docs, README files, onboarding guides, architecture decision records, or technical documentation for Next.js + React + Tailwind CSS project
---

# Documentation Workflow

## Overview

5-phase lightweight pipeline for creating or updating technical documentation. Section-by-section writing with developer approval at each step. Code examples in docs are verified to actually work.

## When to Use

**Use for:**
- Component documentation (props, usage, variants)
- README creation or update
- Onboarding guides for new developers
- Architecture Decision Records (ADR)
- Technical specs or guides
- Page/layout documentation

**Do NOT use for:**
- Design docs for new features → created within `feature-development` DESIGN phase
- Code comments or JSDoc → part of normal development
- User-facing help articles → separate content workflow

## Core Pattern

```
[ISOLATE] → 🚦 → RESEARCH → 🚦 → WRITE → 🚦 → REVIEW → 🚦 → SHIP → 🚦
```

ISOLATE is optional — skip for small docs updates, use for large documentation efforts.

Every 🚦 = HARD STOP. Wait for developer approval.

## Quick Reference

| Phase | Goal | Primary Skills | Gate Output |
|-------|------|----------------|-------------|
| 1. ISOLATE | Branch (optional for small changes) | `using-git-worktrees` | Branch name |
| 2. RESEARCH | Analyze codebase, plan doc structure | `brainstorming` + domain skills | Doc outline with sections |
| 3. WRITE | Write section by section, verify examples | domain skills | Complete document |
| 4. REVIEW | Technical accuracy + examples work | `verification-before-completion` | Verified doc |
| 5. SHIP | Merge / PR / stop | `finishing-a-development-branch` | Method chosen |

## Implementation

See documentation-phases.md for detailed phase-by-phase instructions.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Writing entire doc without section approval | Present EACH section for approval before writing next |
| Code examples that don't work | Verify every code example actually runs in REVIEW phase |
| Documenting implementation instead of usage | Focus on HOW TO USE, not how it works internally |
| Outdated component docs | Cross-check with actual code — props, types, variants |
| Missing edge cases in docs | Document error states, empty states, loading states, limits |
| Writing for yourself instead of the reader | Ask: who reads this? New dev? External user? Adjust depth. |
