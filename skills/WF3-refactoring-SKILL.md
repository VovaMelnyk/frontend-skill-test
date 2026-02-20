---
name: refactoring
description: Use when restructuring existing code without changing behavior — tech debt, architecture improvements, pattern migration, code cleanup in Next.js + React + Tailwind CSS stack
---

# Refactoring Workflow

## Overview

8-phase pipeline for improving code quality without changing external behavior. Includes a mandatory SAFETY NET phase before any code changes — existing tests must cover current behavior, or new tests are written first.

## When to Use

```
digraph when {
  "Code needs improvement?" [shape=diamond];
  "Behavior changes?" [shape=diamond];
  "Performance issue?" [shape=diamond];
  "refactoring" [shape=box, style=filled];
  "feature-development" [shape=box];
  "performance-optimization" [shape=box];

  "Code needs improvement?" -> "Behavior changes?" [label="yes"];
  "Behavior changes?" -> "feature-development" [label="yes"];
  "Behavior changes?" -> "Performance issue?" [label="no"];
  "Performance issue?" -> "performance-optimization" [label="yes"];
  "Performance issue?" -> "refactoring" [label="no"];
}
```

**Use for:**
- Tech debt reduction
- Component architecture migration (e.g. extract shared component, refactor to compound pattern)
- Code duplication removal (DRY)
- Improving type safety
- Replacing deprecated patterns
- Page/layout restructuring

**Do NOT use for:**
- Adding new behavior → `feature-development`
- Fixing broken behavior → `bugfix`
- Speed/memory improvements → `performance-optimization`

## Core Pattern

```
ISOLATE → 🚦 → DESIGN → 🚦 → PLAN → 🚦 → SAFETY NET → 🚦 → BUILD → 🚦 → CODE REVIEW → 🚦 → VERIFY → 🚦 → SHIP → 🚦
```

**Key difference from feature-development:** SAFETY NET phase between PLAN and BUILD ensures tests cover existing behavior BEFORE any changes.

Every 🚦 = HARD STOP. Present results. Wait for developer approval.

## Quick Reference

| Phase | Goal | Primary Skills | Gate Output |
|-------|------|----------------|-------------|
| 1. ISOLATE | Branch + worktree | `using-git-worktrees` | Branch name, baseline tests |
| 2. DESIGN | Scope, priorities, risks | `brainstorming` + domain skills | What to refactor and why |
| 3. PLAN | Atomic refactoring tasks | `writing-plans` | Task list, each must keep tests green |
| 4. SAFETY NET | Ensure test coverage before changes | `test-driven-development` + `javascript-testing-patterns` | Coverage report, new tests if needed |
| 5. BUILD | Refactor task by task, tests green after each | execution skill + domain skills | All tasks done, all tests pass |
| 6. CODE REVIEW | Before/after comparison | `requesting-code-review` + domain skills | Quality improvements documented |
| 7. VERIFY | Same tests pass as before refactoring | `verification-before-completion` | Before/after comparison |
| 8. SHIP | Merge / PR / stop | `finishing-a-development-branch` | Method chosen |

## Skill Activation by Refactoring Type

| Refactoring target | Skills activated |
|--------------------|-----------------|
| React component composition | `react-best-practices` + `react-composition-patterns` |
| Next.js patterns | `next-best-practices` |
| TypeScript types/generics | `advanced-typescript-patterns` |
| Test improvements | `javascript-testing-patterns` |

## Implementation

See refactoring-phases.md for detailed phase-by-phase instructions including:
- Safety net methodology
- Approval gate formats
- Before/after verification approach
- Parallel refactoring with subagents

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Changing behavior during refactoring | Behavior MUST stay the same. New behavior = feature-development |
| Refactoring without test coverage | SAFETY NET is mandatory. Write tests for current behavior first |
| Doing everything in one big commit | Small atomic tasks, tests green after EACH one |
| Not comparing before/after | VERIFY phase must show same tests pass before and after |
| Mixing refactoring with bugfixes | If you find a bug — note it, finish refactoring, then use bugfix workflow |
| Skipping safety net because "tests exist" | Verify coverage is SUFFICIENT, not just that tests exist |
