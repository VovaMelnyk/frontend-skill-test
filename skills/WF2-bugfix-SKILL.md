---
name: bugfix
description: Use when something is broken, a test fails, a bug is reported from production, or unexpected behavior needs to be fixed in Next.js + React + Tailwind CSS stack
---

# Bugfix Workflow

## Overview

6-phase pipeline focused on systematic diagnosis and TDD-driven fix. Every phase requires explicit developer approval. The agent diagnoses root cause BEFORE writing any fix code.

## When to Use

```
digraph when {
  "Something broken?" [shape=diamond];
  "Known root cause?" [shape=diamond];
  "Quick typo/config fix?" [shape=diamond];
  "bugfix" [shape=box, style=filled];
  "Just fix it" [shape=box];

  "Something broken?" -> "Known root cause?" [label="yes"];
  "Something broken?" -> "feature-development" [label="no, new work"];
  "Known root cause?" -> "Quick typo/config fix?" [label="yes"];
  "Known root cause?" -> "bugfix" [label="no"];
  "Quick typo/config fix?" -> "Just fix it" [label="yes, 1-line"];
  "Quick typo/config fix?" -> "bugfix" [label="no, needs investigation"];
}
```

**Use for:**
- Bug reported by users or QA
- Test that started failing
- Unexpected behavior in existing functionality
- Production error or exception
- Regression after deploy

**Do NOT use for:**
- New functionality → `feature-development`
- Code cleanup without behavior change → `refactoring`
- Slow performance → `performance-optimization`
- Trivial 1-line typo/config fix → just fix it directly

## Core Pattern

```
ISOLATE → 🚦 → DIAGNOSE → 🚦 → FIX (TDD) → 🚦 → CODE REVIEW → 🚦 → VERIFY → 🚦 → SHIP → 🚦
```

Every 🚦 = HARD STOP. Present results. Wait for developer approval. A question from the developer is NOT approval.

## Quick Reference

| Phase | Goal | Primary Skills | Gate Output |
|-------|------|----------------|-------------|
| 1. ISOLATE | Branch + worktree + reproduce environment | `using-git-worktrees` | Branch name, baseline status |
| 2. DIAGNOSE | Find root cause, NOT guess | `systematic-debugging` + domain skills | Root cause, evidence, fix plan |
| 3. FIX | Test-first fix: failing test → minimal fix | `test-driven-development` + domain skills | Test for bug + fix applied |
| 4. CODE REVIEW | Audit fix doesn't introduce new issues | `requesting-code-review` + domain skills | Review summary, risk areas |
| 5. VERIFY | Full test suite + regression check | `verification-before-completion` + `agent-browser` | All tests pass including new one |
| 6. SHIP | Merge / PR / stop | `finishing-a-development-branch` | Method chosen |

## Skill Activation by Bug Type

| Bug is in... | Skills activated |
|--------------|-----------------|
| React component rendering | `react-best-practices` + `systematic-debugging` |
| Next.js SSR/routing/caching | `next-best-practices` + `systematic-debugging` |
| UI visual/interaction | `agent-browser` (reproduce) + `react-best-practices` |
| TypeScript type errors | `advanced-typescript-patterns` |

## Implementation

See bugfix-phases.md for detailed phase-by-phase instructions including:
- Diagnosis methodology (4-phase systematic debugging)
- Approval gate formats
- TDD cycle for bugfixes (test reproduces bug → fix → verify)
- Regression verification checklist

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Guessing the fix without diagnosing | DIAGNOSE phase is mandatory. Find root cause with evidence |
| Fixing symptoms instead of root cause | `systematic-debugging` traces to actual cause, not surface symptoms |
| Writing fix before writing test for bug | RED first: write test that reproduces the bug and fails |
| Making the fix too broad / refactoring | Minimal fix only. Refactoring is a separate workflow |
| Not checking for similar bugs elsewhere | After fix, search codebase for same pattern in other places |
| Skipping regression tests | Run FULL test suite, not just the new test |
