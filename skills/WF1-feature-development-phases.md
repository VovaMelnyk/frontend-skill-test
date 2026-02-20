# Feature Development — Phase Details

> **REQUIRED SUB-SKILL:** Use superpowers:using-git-worktrees for Phase 1
> **REQUIRED SUB-SKILL:** Use superpowers:brainstorming for Phase 2
> **REQUIRED SUB-SKILL:** Use superpowers:writing-plans for Phase 3
> **REQUIRED SUB-SKILL:** Use superpowers:test-driven-development for Phase 4
> **REQUIRED SUB-SKILL:** Use superpowers:requesting-code-review for Phase 5
> **REQUIRED SUB-SKILL:** Use superpowers:verification-before-completion for Phase 6
> **REQUIRED SUB-SKILL:** Use superpowers:finishing-a-development-branch for Phase 7

---

## Phase 1: ISOLATE

**Goal:** Isolated workspace on a dedicated feature branch.

**Steps:**
1. Create branch from `main`: `feature/<short-description>`
2. Set up git worktree for isolated development
3. Run existing tests — all must pass before any work
4. If tests fail on clean checkout — STOP and report immediately

**🚦 APPROVAL GATE:**
```
✅ Branch created: feature/<name>
✅ Worktree ready: /path/to/worktree
✅ Baseline tests: XX passed, 0 failed
→ Proceed to DESIGN?
```
**STOP. Wait for explicit approval.**

---

## Phase 2: DESIGN

**Goal:** Deep understanding of the requirement, explored approaches, approved design document.

**Always activate:** `brainstorming`

**Conditional activation:**

| Task involves...     | Also activate                                          |
| -------------------- | ------------------------------------------------------ |
| UI components/pages  | `react-best-practices` + `next-best-practices`         |

**Steps:**
1. Read relevant codebase to understand current architecture
2. Ask clarifying questions — ONE at a time, wait for answer
3. Do NOT assume requirements — ask until fully understood
4. Propose 2-3 approaches with trade-offs
5. After developer picks approach — write design in 200-300 word sections
6. Present EACH section for approval before writing the next

**Design document template:**
```markdown
# Design: <Feature Name>
Date: YYYY-MM-DD
Branch: feature/<name>

## Problem
What we're solving and why

## Approach
Chosen approach with rationale

## Architecture
- Pages: routes and layouts
- Components: shared and feature-specific components
- State Management: client state, server state, URL state

## UI Behavior
User flows, states, edge cases

## Components
- Component hierarchy and responsibilities
- Props interfaces
- Server Components vs Client Components

## Out of Scope
What we explicitly are NOT doing
```

Save to: `docs/designs/YYYY-MM-DD-<feature-name>.md` on feature branch.

**🚦 APPROVAL GATE:**
```
✅ Design saved: docs/designs/YYYY-MM-DD-<feature-name>.md
✅ Approach: <1-sentence summary>
✅ Scope: N pages, N components
→ Proceed to PLAN?
```
**STOP. Wait for explicit approval.**

---

## Phase 3: PLAN

**Goal:** Atomic tasks a junior dev could follow with zero project context.

**Always activate:** `writing-plans`

**Conditional influence on task breakdown:**

| Design includes...    | Skill influences                                      |
| --------------------- | ----------------------------------------------------- |
| React components      | `react-best-practices` + `next-best-practices` → Server/Client split |
| TypeScript interfaces | `advanced-typescript-patterns` → proper generics      |

**Each task MUST have:**
1. Clear title
2. Exact file paths to create or modify
3. Complete working code (not pseudocode)
4. Verification command (test, browser check)
5. Estimated time: 2-5 minutes
6. Dependencies: which tasks must complete first

**Task ordering:**
1. TypeScript types/interfaces (contracts)
2. Shared components (reusable UI primitives)
3. Page components (feature-specific UI)
4. Integration tests (verification)

Save to: `docs/plans/YYYY-MM-DD-<feature-name>-plan.md` on feature branch.

**🚦 APPROVAL GATE:**
```
✅ Plan saved: docs/plans/YYYY-MM-DD-<feature-name>-plan.md
✅ Total tasks: N
✅ Estimated time: ~N minutes
✅ Task list:
   1. <task title> (~X min)
   2. <task title> (~X min)
   ...
→ Choose execution mode:
   [A] subagent-driven-development (autonomous, fresh agent per task — best for 5+ tasks)
   [B] executing-plans (batched with checkpoints — best for 3-5 tasks)
   [C] dispatching-parallel-agents (parallel — best for independent tasks)
```
**STOP. Wait for approval AND execution mode choice.**

---

## Phase 4: BUILD

**Goal:** Execute plan task by task with TDD.

**Always activate:** `test-driven-development`

**Choose one (developer's choice from Phase 3):**
- `subagent-driven-development`
- `executing-plans`
- `dispatching-parallel-agents`

**Domain skills auto-activate per task — see Skill Activation table in SKILL.md.**

**TDD cycle for EVERY task:**
```
1. RED    — Write failing test for expected behavior
2. GREEN  — Write minimum code to pass
3. REFACTOR — Clean up, tests stay green
4. COMMIT — Descriptive message
```

**Subagent mode:**
- Fresh subagent per task (no context leakage)
- Each follows TDD independently
- After completion: Stage 1 review (matches spec?) → Stage 2 review (code quality via domain skills)
- Review fails → fix before next task

**🚦 APPROVAL GATE:**
```
✅ Build complete
✅ Tasks: N/N done
✅ Tests: XX passed, 0 failed
✅ New tests written: XX
✅ Files changed:
   - path/to/file1.ts (new)
   - path/to/file2.tsx (modified)
   ...
→ Proceed to CODE REVIEW?
```
**STOP. Wait for explicit approval.**

---

## Phase 5: CODE REVIEW

**Goal:** Systematic audit against domain best practices.

**Always activate:** `requesting-code-review`

**Steps:**

1. Generate review summary:
```markdown
## Code Review Summary
### Changes: N files, +N/-N lines
### Architecture Decisions
- <decision and rationale>
### Test Coverage: N new, N modified, all passing ✅/❌
### Risk Areas
- <area>: <why risky>
### Screenshots (if UI changes)
```

2. Domain audits:

| Audited area                  | Skill                         |
|-------------------------------|-------------------------------|
| React performance, SSR        | `react-best-practices`        |
| Next.js patterns              | `next-best-practices`         |
| Accessibility, UX             | `web-design-guidelines`       |
| Type safety                   | `advanced-typescript-patterns` |

3. Categorize: **Critical** / **Major** / **Minor** / **Nit**
4. Fix Critical + Major automatically with TDD (test for issue → fix)
5. Present Minor + Nit to developer for decision

**If developer gives feedback:** activate `receiving-code-review`
- Analyze each comment (don't blindly agree)
- Valid → fix with TDD
- Disputed → argue position, wait for decision

**🚦 APPROVAL GATE:**
```
✅ Code review complete
✅ Critical: 0 (fixed N)
✅ Major: 0 (fixed N)
⚠️  Minor: N — <list>
💡 Nit: N — <list>
→ Fix minors? Skip nits? Proceed to VERIFY?
```
**STOP. Wait for decisions on each category.**

---

## Phase 6: VERIFY

**Goal:** Comprehensive verification with REAL output. No false claims.

**Always activate:** `verification-before-completion`

**Steps:**

1. **Unit tests** — show real terminal output:
```
$ npm test
PASS src/components/CourseCard/CourseCard.test.tsx (4 tests)
PASS src/app/courses/__tests__/page.test.tsx (6 tests)
...
Tests: 47 passed, 0 failed
```

2. **E2E** (if UI changes) — `agent-browser`:
```bash
agent-browser open http://localhost:3000/<page>
agent-browser snapshot -i
agent-browser fill @<element> "<test data>"
agent-browser click @<button>
agent-browser wait --load networkidle
agent-browser screenshot verification.png
```

3. **Accessibility** (if UI changes) — `web-design-guidelines`:
   - ARIA attributes, keyboard nav, focus management, color contrast, responsive

4. **Compile report:**
```
Unit tests:     ✅ 47/47 passed
E2E tests:      ✅ 3/3 passed (or N/A)
Accessibility:  ✅ no issues (or ⚠️ N issues)
Type checking:  ✅ no errors
Lint:           ✅ no errors
```

**🚦 APPROVAL GATE:**
```
✅ Verification passed
✅ <full report above>
→ Choose:
   [A] Merge to main locally
   [B] Create GitHub PR
   [C] Stop — I'll handle the rest
```
**STOP. Wait for choice.**

---

## Phase 7: SHIP

**Goal:** Deliver based on developer's choice.

**Always activate:** `finishing-a-development-branch`

**Option A — Merge locally:**
1. Switch to `main`
2. Merge with `--no-ff`
3. Delete feature branch + worktree
4. Push to remote

**Option B — Create GitHub PR:**
1. Push feature branch
2. Create PR: title, description (link to design), test results, labels
3. Do NOT merge — developer handles PR review

**Option C — Stop:**
1. Leave everything on feature branch
2. List what was done and file locations

**🚦 FINAL GATE:**
```
✅ Feature shipped
✅ Method: <merge|PR|stopped>
✅ Branch: feature/<name>
✅ Design: docs/designs/YYYY-MM-DD-<feature-name>.md
✅ Plan: docs/plans/YYYY-MM-DD-<feature-name>-plan.md
→ Done. Anything to adjust?
```
