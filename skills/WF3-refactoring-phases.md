# Refactoring — Phase Details

> **REQUIRED SUB-SKILL:** Use superpowers:using-git-worktrees for Phase 1
> **REQUIRED SUB-SKILL:** Use superpowers:brainstorming for Phase 2
> **REQUIRED SUB-SKILL:** Use superpowers:writing-plans for Phase 3
> **REQUIRED SUB-SKILL:** Use superpowers:test-driven-development for Phase 4
> **REQUIRED SUB-SKILL:** Use superpowers:requesting-code-review for Phase 6
> **REQUIRED SUB-SKILL:** Use superpowers:verification-before-completion for Phase 7
> **REQUIRED SUB-SKILL:** Use superpowers:finishing-a-development-branch for Phase 8

---

## Phase 1: ISOLATE

**Steps:**
1. Create branch: `refactor/<description>`
2. Set up worktree
3. Run all tests — record exact results (this is the BEFORE snapshot)

**🚦 APPROVAL GATE:**
```
✅ Branch: refactor/<n>
✅ Baseline tests: XX passed, 0 failed
→ Proceed to DESIGN?
```
**STOP. Wait for explicit approval.**

---

## Phase 2: DESIGN

**Always activate:** `brainstorming`

**Conditional activation:**

| Refactoring targets... | Also activate |
|------------------------|---------------|
| React components | `react-best-practices` + `react-composition-patterns` |
| Next.js patterns | `next-best-practices` |
| TypeScript types | `advanced-typescript-patterns` |

**Steps:**
1. Analyze current code — identify specific problems (not vague "messy code")
2. Ask developer clarifying questions ONE at a time
3. Define scope: what EXACTLY will be refactored
4. Define boundaries: what will NOT be touched
5. Identify risks: what could break
6. Propose approach in 200-300 word sections

Save to: `docs/designs/YYYY-MM-DD-refactor-<name>.md`

**🚦 APPROVAL GATE:**
```
✅ Design saved: docs/designs/YYYY-MM-DD-refactor-<name>.md
✅ Scope: <what will change>
✅ Boundaries: <what stays untouched>
✅ Risks: <what could break>
✅ Behavior change: NONE (confirmed)
→ Proceed to PLAN?
```
**STOP. Wait for explicit approval.**

---

## Phase 3: PLAN

**Always activate:** `writing-plans`

**Each task MUST specify:**
1. What to change
2. Exact file paths
3. Verification: **all existing tests must pass after this task**
4. Estimated time: 2-5 minutes

**Task ordering for refactoring:**
1. Types/interfaces first (if changing contracts)
2. Deepest dependencies first (leaf components → root)
3. One component or module at a time (never refactor two simultaneously)

Save to: `docs/plans/YYYY-MM-DD-refactor-<name>-plan.md`

**🚦 APPROVAL GATE:**
```
✅ Plan saved: docs/plans/YYYY-MM-DD-refactor-<name>-plan.md
✅ Total tasks: N
✅ Each task keeps tests green: confirmed
✅ Task list:
   1. <task> (~X min)
   2. <task> (~X min)
   ...
→ Proceed to SAFETY NET?
```
**STOP. Wait for explicit approval.**

---

## Phase 4: SAFETY NET

**Goal:** Ensure test coverage is SUFFICIENT before changing anything. This is the critical phase unique to refactoring.

**Always activate:** `test-driven-development` + `javascript-testing-patterns`

**Steps:**

1. Analyze test coverage for code being refactored:
   - Which components/hooks have tests?
   - Which edge cases are covered?
   - Which behaviors are tested?

2. Identify gaps:
   - Untested component states or props combinations
   - Missing edge case coverage
   - No integration tests for cross-component behavior

3. If gaps found — write tests for CURRENT behavior FIRST:
   ```
   RED    — Write test for existing behavior (should PASS, not fail)
   GREEN  — Test passes (confirms current behavior is captured)
   COMMIT — "test: add coverage for <behavior> before refactoring"
   ```
   Note: in safety net, tests should pass immediately — we're documenting existing behavior, not changing it.

4. Run full suite again to confirm everything green

**🚦 APPROVAL GATE:**
```
✅ Coverage analysis complete
✅ Existing coverage: sufficient / gaps found
✅ New tests written: N (for current behavior)
✅ All tests pass: XX passed, 0 failed
✅ Safe to refactor: yes
→ Proceed to BUILD?
```
**STOP. Wait for explicit approval.**

---

## Phase 5: BUILD

**Choose execution mode:**
- `subagent-driven-development` — for 5+ tasks
- `executing-plans` — for 3-5 tasks
- `dispatching-parallel-agents` — for independent components

**Domain skills auto-activate per task — see Skill Activation table in SKILL.md.**

**Critical refactoring rules:**
- After EACH task: run ALL tests. They MUST pass.
- If a test fails after a task — the refactoring changed behavior. STOP and fix.
- Do NOT add new features. Do NOT fix bugs. Note them for later.
- Small commits: one commit per task with clear message

**🚦 APPROVAL GATE:**
```
✅ Build complete
✅ Tasks: N/N done
✅ Tests after refactoring: XX passed, 0 failed (same count as before)
✅ Behavior changes: NONE
✅ Files changed:
   - path/to/file.tsx (refactored)
   ...
→ Proceed to CODE REVIEW?
```
**STOP. Wait for explicit approval.**

---

## Phase 6: CODE REVIEW

**Always activate:** `requesting-code-review`

**Review focus for refactoring:**
```markdown
## Refactoring Review

### What improved
- <before pattern> → <after pattern>
- <metric before> → <metric after> (e.g. duplication, complexity)

### Files changed: N (+N/-N lines)

### Behavior verification
- All XX tests pass (same count as before refactoring)
- No new tests needed for behavior (only safety net tests added)

### Risk areas
- <anything that changed structurally>
```

**Domain audits verify the NEW code follows best practices.**

**If developer gives feedback:** activate `receiving-code-review`

**🚦 APPROVAL GATE:**
```
✅ Review complete
✅ Improvements documented
✅ No behavior changes confirmed
→ Proceed to VERIFY?
```
**STOP. Wait for explicit approval.**

---

## Phase 7: VERIFY

**Always activate:** `verification-before-completion`

**Critical verification: BEFORE vs AFTER comparison.**

1. Run full test suite — show real output:
```
BEFORE refactoring: 48 tests passed, 0 failed
AFTER refactoring:  52 tests passed, 0 failed (+4 safety net tests)
```

2. All original tests must still pass
3. Safety net tests must still pass
4. Type checking: `tsc --noEmit` — no errors
5. Lint: no new warnings

**🚦 APPROVAL GATE:**
```
✅ Verification passed
✅ Tests before: 48 passed
✅ Tests after: 52 passed (+4 safety net)
✅ All original tests: still pass
✅ Type check: clean
✅ Lint: clean
→ Choose: [A] Merge [B] PR [C] Stop
```
**STOP. Wait for choice.**

---

## Phase 8: SHIP

**Always activate:** `finishing-a-development-branch`

Same options as feature-development: merge / PR / stop.

**🚦 FINAL GATE:**
```
✅ Refactoring shipped
✅ Method: <merge|PR|stopped>
✅ Branch: refactor/<n>
✅ What improved: <1-sentence>
✅ Tests: all passing, +N safety net tests added
→ Done. Anything to adjust?
```
