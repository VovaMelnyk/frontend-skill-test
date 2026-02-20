# Bugfix — Phase Details

> **REQUIRED SUB-SKILL:** Use superpowers:using-git-worktrees for Phase 1
> **REQUIRED SUB-SKILL:** Use superpowers:systematic-debugging for Phase 2
> **REQUIRED SUB-SKILL:** Use superpowers:test-driven-development for Phase 3
> **REQUIRED SUB-SKILL:** Use superpowers:requesting-code-review for Phase 4
> **REQUIRED SUB-SKILL:** Use superpowers:verification-before-completion for Phase 5
> **REQUIRED SUB-SKILL:** Use superpowers:finishing-a-development-branch for Phase 6

---

## Phase 1: ISOLATE

**Goal:** Clean workspace to reproduce and fix the bug without affecting other work.

**Steps:**
1. Create branch from `main`: `fix/<bug-short-description>`
2. Set up git worktree
3. Run existing tests — note which pass and which fail
4. If the bug is already caught by a test — note that test name
5. If no test catches the bug — note this (we'll write one in Phase 3)

**🚦 APPROVAL GATE:**
```
✅ Branch created: fix/<n>
✅ Worktree ready
✅ Baseline tests: XX passed, N failed
✅ Bug already caught by test: <test name> / No existing test
→ Proceed to DIAGNOSE?
```
**STOP. Wait for explicit approval.**

---

## Phase 2: DIAGNOSE

**Goal:** Find the ROOT CAUSE with evidence. Do NOT guess. Do NOT start fixing.

**Always activate:** `systematic-debugging`

**Conditional activation:**

| Bug area           | Also activate                |
| ------------------ | ---------------------------- |
| Frontend rendering | `react-best-practices`       |
| SSR/routing/cache  | `next-best-practices`        |
| UI interaction     | `agent-browser`              |

**4-phase diagnosis methodology (from systematic-debugging):**

### Step 1: REPRODUCE
- Confirm the bug exists and is reproducible
- If UI bug — use `agent-browser` to reproduce:
  ```bash
  agent-browser open http://localhost:3000/<page>
  agent-browser snapshot -i
  agent-browser click @<element>
  agent-browser screenshot bug-reproduction.png
  ```
- If rendering bug — reproduce with test or dev server inspection
- Document exact reproduction steps

### Step 2: NARROW
- Binary search to isolate the problem area
- Check recent changes (git log, git diff)
- Add temporary logging if needed
- Narrow down to specific file, function, line

### Step 3: ROOT CAUSE
- Identify WHY it breaks, not just WHERE
- Check for:
  - Race conditions
  - Missing null checks
  - State management issues
  - Hydration mismatches (SSR vs client)
  - Type mismatches
  - Missing error handling
  - Incorrect dependency arrays in hooks
  - Stale closures
- If Next.js related — check caching, route segments, middleware order, server/client component boundaries

### Step 4: FORMULATE FIX PLAN
- Describe the minimal fix needed
- Identify any related code that might have the same issue
- Assess risk of the fix (what else could it break?)

**🚦 APPROVAL GATE:**
```
✅ Bug reproduced: <exact reproduction steps>
✅ Root cause: <clear explanation with evidence>
✅ Affected code: <file:line>
✅ Fix plan: <what will be changed and why>
✅ Risk assessment: <what could this fix break>
✅ Similar patterns found: <other places with same issue> / None
→ Approve fix plan? Proceed to FIX?
```
**STOP. Wait for explicit approval of the diagnosis and fix plan.**

---

## Phase 3: FIX (TDD)

**Goal:** Write a test that reproduces the bug, then write the minimal fix.

**Always activate:** `test-driven-development`

**Domain skills activate by bug type — see Skill Activation table in SKILL.md.**

**TDD cycle for bugfix:**

```
1. RED    — Write test that REPRODUCES the bug (test must FAIL)
           This proves the bug exists and is testable
2. GREEN  — Write MINIMAL fix to make the test pass
           Do NOT refactor. Do NOT add features. Minimal fix only.
3. REFACTOR — Clean up ONLY if needed, tests stay green
4. COMMIT — "fix: <description of what was fixed>"
```

**Critical rules:**
- The test must fail BEFORE the fix (proving it catches the bug)
- The fix must be minimal — no "while we're here" improvements
- If similar patterns exist elsewhere (found in Phase 2) — fix those too with separate tests
- Each similar fix gets its own RED → GREEN cycle

**🚦 APPROVAL GATE:**
```
✅ Test written: <test file and name>
✅ Test fails without fix: confirmed (RED)
✅ Fix applied: <file:line — what changed>
✅ Test passes with fix: confirmed (GREEN)
✅ Similar patterns fixed: N additional places / None
✅ All existing tests still pass: XX passed, 0 failed
→ Proceed to CODE REVIEW?
```
**STOP. Wait for explicit approval.**

---

## Phase 4: CODE REVIEW

**Goal:** Verify the fix doesn't introduce new problems.

**Always activate:** `requesting-code-review`

**Steps:**

1. Generate review summary:
```markdown
## Bugfix Review

### Bug: <title>
### Root Cause: <1-sentence>
### Fix: <what changed and why>

### Files Changed
- <file> — <what and why>

### New Tests
- <test name> — verifies <what>

### Risk Areas
- <anything the fix might affect>

### Regression Check
- <related areas that should be re-tested>
```

2. Domain audits (based on what was changed):

| Changed area | Audit with |
|-------------|------------|
| React components | `react-best-practices` — re-render impact, SSR |
| Next.js pages | `next-best-practices` — caching, routing |
| Accessibility | `web-design-guidelines` — ARIA, keyboard nav |
| Type safety | `advanced-typescript-patterns` — type correctness |

3. Check: does the fix follow domain best practices or introduce tech debt?
4. Fix any Critical/Major issues found with TDD

**If developer gives feedback:** activate `receiving-code-review`

**🚦 APPROVAL GATE:**
```
✅ Review complete
✅ Fix follows best practices: yes / <concerns>
✅ No new issues introduced
✅ Regression areas identified: <list>
→ Proceed to VERIFY?
```
**STOP. Wait for explicit approval.**

---

## Phase 5: VERIFY

**Goal:** Full regression test. The bug is fixed AND nothing else broke.

**Always activate:** `verification-before-completion`

**Steps:**

1. Run FULL test suite — show real output:
```
$ npm test
PASS src/components/CourseCard/CourseCard.test.tsx (4 tests)
PASS src/app/courses/__tests__/page.test.tsx (6 tests)
PASS src/app/courses/__tests__/bug-fix-name.test.tsx (1 test)  ← NEW
...
Tests: 48 passed, 0 failed
```

2. If UI bug — verify with `agent-browser`:
```bash
agent-browser open http://localhost:3000/<page>
# Repeat exact reproduction steps from Phase 2
# Bug should NOT occur now
agent-browser screenshot bug-fixed.png
```

3. Run related/adjacent tests to check for regressions

4. Compile report:
```
Bug reproduction:  ✅ Bug no longer occurs
New test:          ✅ passes
Full test suite:   ✅ 48/48 passed (was 47 before)
Regression check:  ✅ no regressions
E2E (if UI):       ✅ verified / N/A
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

## Phase 6: SHIP

**Goal:** Deliver the fix.

**Always activate:** `finishing-a-development-branch`

**Option A — Merge locally:**
1. Switch to `main`
2. Merge with `--no-ff`
3. Delete fix branch + worktree
4. Push to remote

**Option B — Create GitHub PR:**
1. Push fix branch
2. Create PR: title "fix: <bug>", description with root cause + fix + test results
3. Do NOT merge — developer handles

**Option C — Stop:**
1. Leave on fix branch
2. List what was done

**🚦 FINAL GATE:**
```
✅ Bugfix shipped
✅ Method: <merge|PR|stopped>
✅ Branch: fix/<n>
✅ Root cause: <1-sentence>
✅ Fix: <1-sentence>
✅ New test: <test name>
→ Done. Anything to adjust?
```
