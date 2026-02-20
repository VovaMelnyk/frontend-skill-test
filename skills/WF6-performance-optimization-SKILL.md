---
name: performance-optimization
description: Use when application is slow, bundle size is large, page load is sluggish, or unnecessary re-renders are suspected in Next.js + React + Tailwind CSS stack
---

# Performance Optimization Workflow

## Overview

7-phase pipeline with mandatory BEFORE/AFTER metrics. No optimization without measurement. Every change must show concrete improvement with numbers.

## When to Use

**Use for:**
- Large frontend bundle size
- Slow page load / SSR performance
- Re-render storms
- High Core Web Vitals metrics
- User-reported slowness

**Do NOT use for:**
- Code cleanup without performance goal → `refactoring`
- Adding new features → `feature-development`
- Fixing incorrect behavior → `bugfix`

## Core Pattern

```
ISOLATE → 🚦 → PROFILE → 🚦 → PLAN → 🚦 → OPTIMIZE → 🚦 → MEASURE → 🚦 → CODE REVIEW → 🚦 → SHIP → 🚦
```

**Key difference from refactoring:** PROFILE (before) and MEASURE (after) phases with concrete metrics. No "feels faster" — only numbers.

Every 🚦 = HARD STOP. Wait for developer approval.

## Quick Reference

| Phase | Goal | Primary Skills | Gate Output |
|-------|------|----------------|-------------|
| 1. ISOLATE | Branch + worktree | `using-git-worktrees` | Branch name, baseline |
| 2. PROFILE | Measure BEFORE metrics | `react-best-practices` + `next-best-practices` + `agent-browser` | Concrete numbers per bottleneck |
| 3. PLAN | Specific optimizations with expected impact | `writing-plans` + domain skills | Optimization tasks with targets |
| 4. OPTIMIZE | Implement with TDD | `test-driven-development` + domain skills | Changes applied, tests pass |
| 5. MEASURE | Measure AFTER metrics, compare | Same tools as PROFILE | Before/after comparison |
| 6. CODE REVIEW | Review with metrics evidence | `requesting-code-review` | Improvements documented |
| 7. SHIP | Merge / PR / stop | `finishing-a-development-branch` | Method chosen |

## Skill Activation by Bottleneck Type

| Bottleneck | Skills activated |
|------------|-----------------|
| Large bundle | `react-best-practices` (code splitting, lazy loading, tree shaking) |
| Slow SSR/ISR | `next-best-practices` (caching, streaming, partial prerendering) |
| Slow page load | `agent-browser` (measurement) + `react-best-practices` + `next-best-practices` |
| Re-render storms | `react-best-practices` + `react-composition-patterns` (memoization, state lifting) |

## Implementation

See performance-optimization-phases.md for detailed phase-by-phase instructions.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Optimizing without measuring first | PROFILE phase is mandatory. Numbers before any change |
| "Feels faster" without proof | MEASURE phase compares concrete metrics before/after |
| Optimizing the wrong thing | Profile identifies ACTUAL bottleneck, not assumed one |
| Premature optimization of non-bottleneck | Focus on top 1-3 bottlenecks identified in PROFILE |
| Breaking behavior while optimizing | Tests must pass throughout. Behavior doesn't change |
| Not measuring after optimization | MEASURE is mandatory. Show improvement with numbers |
