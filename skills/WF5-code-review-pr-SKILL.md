---
name: code-review-pr
description: Use when reviewing someone else's pull request, analyzing a PR diff, or providing structured feedback on code changes in Next.js + React + Tailwind CSS stack
---

# Code Review PR Workflow

## Overview

3-phase analysis workflow for reviewing other developers' PRs. No build phase — agent reads, audits, and helps formulate feedback. Developer makes the final approve/reject decision.

## When to Use

**Use for:**
- Reviewing a teammate's PR
- Analyzing a PR diff before merging
- Getting AI-assisted review of code changes
- Second opinion on architectural decisions in a PR

**Do NOT use for:**
- Writing new code → `feature-development`
- Fixing code yourself → `bugfix` or `refactoring`
- Reviewing your OWN changes → use CODE REVIEW phase within other workflows

## Core Pattern

```
READ → 🚦 → AUDIT → 🚦 → FEEDBACK → 🚦
```

Every 🚦 = HARD STOP. Wait for developer approval.

## Quick Reference

| Phase | Goal | Skills Used | Gate Output |
|-------|------|-------------|-------------|
| 1. READ | Understand context + changes | — | Summary of what PR does |
| 2. AUDIT | Domain-specific analysis | All domain skills by layer | Findings: critical/major/minor/nit |
| 3. FEEDBACK | Formulate review comments | `requesting-code-review` | Ready-to-post comments |

## Implementation

See code-review-pr-phases.md for detailed instructions.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Approving without thorough audit | Run ALL relevant domain skill audits |
| Only checking style/formatting | Focus on logic, architecture, security, performance FIRST |
| Nitpicking without noting severity | Always categorize: critical / major / minor / nit |
| Not checking test coverage of changes | Verify new code has corresponding tests |
| Blindly trusting AI review | Developer makes final decision — agent provides analysis |
