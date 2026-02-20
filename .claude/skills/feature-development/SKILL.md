---
name: feature-development
description: Use when implementing new functionality, adding a new page, new component, or any task touching multiple layers (pages + components + state) in Next.js + React + Tailwind CSS stack
---

# Feature Development Workflow

## Overview

Full 7-phase pipeline for building new features with mandatory developer approval at every phase. The agent NEVER advances without explicit "yes" / "proceed" / "go" / "далі" from the developer.

## When to Use

```
digraph when {
  "New work?" [shape=diamond];
  "Bug or broken?" [shape=diamond];
  "Behavior changes?" [shape=diamond];
  "feature-development" [shape=box, style=filled];
  "bugfix" [shape=box];
  "refactoring" [shape=box];

  "New work?" -> "Bug or broken?" [label="yes"];
  "New work?" -> "refactoring" [label="no new behavior"];
  "Bug or broken?" -> "bugfix" [label="yes"];
  "Bug or broken?" -> "Behavior changes?" [label="no"];
  "Behavior changes?" -> "feature-development" [label="yes"];
  "Behavior changes?" -> "refactoring" [label="no"];
}
```

**Use for:**
- New feature or user story
- New page or route
- New component or UI module
- Significant new functionality in existing page

**Do NOT use for:**
- Bug fixes → `bugfix`
- Restructuring without behavior change → `refactoring`
- Reviewing someone's PR → `code-review-pr`
- Performance improvements → `performance-optimization`
- Writing docs → `documentation`

## Core Pattern

```
ISOLATE → 🚦 → DESIGN → 🚦 → PLAN → 🚦 → BUILD → 🚦 → CODE REVIEW → 🚦 → VERIFY → 🚦 → SHIP → 🚦
```

Every 🚦 = HARD STOP. Present results. Wait for developer approval. A question from the developer is NOT approval.

## Quick Reference

| Phase | Goal | Primary Skills | Gate Output |
|-------|------|----------------|-------------|
| 1. ISOLATE | Branch + worktree + baseline tests | `using-git-worktrees` | Branch name, test count |
| 2. DESIGN | Understand, explore, document approach | `brainstorming` + domain skills | Design doc path, scope summary |
| 3. PLAN | Atomic tasks with full code + verification | `writing-plans` + domain skills | Task count, time estimate, execution mode choice |
| 4. BUILD | TDD implementation task by task | `test-driven-development` + execution skill + domain skills | Tasks done, tests passed, files changed |
| 5. CODE REVIEW | Domain-specific audit of all changes | `requesting-code-review` + domain skills | Issues by severity, fixes applied |
| 6. VERIFY | Real test output, E2E, a11y | `verification-before-completion` + `agent-browser` | Full verification report |
| 7. SHIP | Merge / PR / stop | `finishing-a-development-branch` | Method chosen, links |

## Skill Activation by Task Type

Skills auto-activate based on what the current task touches:

| Task touches... | Skills activated |
|-----------------|-----------------|
| React component | `react-best-practices` + `react-composition-patterns` |
| Next.js page/layout | `next-best-practices` |
| TypeScript types/interfaces | `advanced-typescript-patterns` |
| Test files | `javascript-testing-patterns` |
| Bug during build | `systematic-debugging` |
| UI accessibility | `web-design-guidelines` |

## Implementation

See feature-development-phases.md for detailed phase-by-phase instructions including:
- Exact steps for each phase
- Approval gate formats (what to show the developer)
- Conditional skill activation rules
- Design and plan document templates
- TDD cycle details
- Verification checklist
- Ship options

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Advancing without developer approval | STOP after every phase. Only "yes"/"go"/"proceed"/"далі" = approval |
| Summarizing tests as "all pass ✅" | Show actual terminal output of test execution |
| Coding before design approval | Design must be saved and approved before planning |
| Writing code before tests (TDD violation) | RED → GREEN → REFACTOR. Test first, always |
| Treating developer's question as approval | A question means WAIT. Only explicit confirmation proceeds |
| Skipping code review phase | Code review is mandatory between BUILD and VERIFY |
| Starting multiple tasks in parallel without approval | Developer chooses execution mode in PLAN gate |
