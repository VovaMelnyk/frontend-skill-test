# Performance Optimization — Phase Details

> **REQUIRED SUB-SKILL:** Use superpowers:using-git-worktrees for Phase 1
> **REQUIRED SUB-SKILL:** Use superpowers:brainstorming for Phase 2
> **REQUIRED SUB-SKILL:** Use superpowers:writing-plans for Phase 3
> **REQUIRED SUB-SKILL:** Use superpowers:test-driven-development for Phase 4
> **REQUIRED SUB-SKILL:** Use superpowers:verification-before-completion for Phase 5
> **REQUIRED SUB-SKILL:** Use superpowers:requesting-code-review for Phase 6
> **REQUIRED SUB-SKILL:** Use superpowers:finishing-a-development-branch for Phase 7

---

## Phase 1: ISOLATE

**Steps:**
1. Create branch: `perf/<description>`
2. Set up worktree
3. Run all tests — record baseline

**🚦 APPROVAL GATE:**
```
✅ Branch: perf/<n>
✅ Baseline tests: XX passed, 0 failed
→ Proceed to PROFILE?
```
**STOP. Wait for explicit approval.**

---

## Phase 2: PROFILE

**Goal:** Measure BEFORE metrics. Identify actual bottlenecks with numbers.

**Always activate:** `brainstorming`

**Activate by suspected area:**

| Suspected area | Profiling method |
|----------------|-----------------|
| Bundle size | `react-best-practices` → `npm run build`, analyze bundle stats |
| Page load | `agent-browser` → measure load time, waterfall analysis |
| SSR performance | `next-best-practices` → server timing, TTFB measurement |
| Component renders | `react-best-practices` → React DevTools profiler, re-render count |

**Steps:**

1. Identify what is slow (developer input + investigation)
2. Measure EACH bottleneck with concrete numbers:
   ```
   Bundle: main.js 1.2MB (gzipped 380KB)

   Page load: /courses — 3.2s TTFB, 5.1s LCP

   Component: CourseList — 47 re-renders on filter change

   Core Web Vitals: LCP 4.2s, FID 180ms, CLS 0.25
   ```
3. Rank bottlenecks by impact
4. Set targets for each:
   ```
   Bundle: 1.2MB → target <700KB (code splitting)
   LCP: 4.2s → target <2.5s (image optimization + SSR)
   Re-renders: 47 → target <5 (memoization + state restructuring)
   ```

**🚦 APPROVAL GATE:**
```
✅ Bottlenecks identified:
   1. <bottleneck>: <current metric> → target: <goal>
   2. <bottleneck>: <current metric> → target: <goal>
   ...
✅ Priority order: <which to fix first>
→ Approve targets? Proceed to PLAN?
```
**STOP. Wait for explicit approval of targets.**

---

## Phase 3: PLAN

**Always activate:** `writing-plans`

**Each task must specify:**
1. Which bottleneck it addresses
2. Expected improvement
3. How to verify (re-measure command)

**Domain skills influence task details:**
- `react-best-practices` → specific splitting/memoization strategy
- `next-best-practices` → specific caching/SSR strategy
- `react-composition-patterns` → specific state lifting/composition approach

Save to: `docs/plans/YYYY-MM-DD-perf-<n>-plan.md`

**🚦 APPROVAL GATE:**
```
✅ Plan saved
✅ Tasks: N
✅ Each task has: bottleneck addressed + expected improvement + verification
✅ Task list:
   1. <task> → expected: <metric improvement>
   2. <task> → expected: <metric improvement>
   ...
→ Approve plan? Proceed to OPTIMIZE?
```
**STOP. Wait for explicit approval.**

---

## Phase 4: OPTIMIZE

**Always activate:** `test-driven-development`

**Domain skills auto-activate per task — see Skill Activation table in SKILL.md.**

**Steps per task:**
1. Write performance test if possible (benchmark, render count assertion)
2. Implement optimization
3. Run all tests — behavior must not change
4. Quick-measure the specific bottleneck to confirm direction

**Common optimizations by type:**

**Frontend:**
- Code splitting with `React.lazy()` + `Suspense`
- Memoization (`useMemo`, `useCallback`, `React.memo`)
- Image optimization (`next/image`, lazy loading, responsive sizes)
- Remove unused dependencies (tree shaking)
- Reduce Tailwind CSS bundle (purge unused classes, avoid dynamic class generation)
- Virtualize long lists (`react-window`, `@tanstack/virtual`)

**SSR/Next.js:**
- Static generation where possible (`generateStaticParams`)
- Incremental Static Regeneration (ISR with `revalidate`)
- Streaming SSR with Suspense boundaries
- Route segment caching (`force-static`, `force-dynamic`)
- Parallel data fetching in Server Components
- Partial Prerendering for mixed static/dynamic pages

**🚦 APPROVAL GATE:**
```
✅ Optimizations applied: N/N tasks
✅ All tests pass: XX passed, 0 failed
✅ Quick measurements show improvement direction
→ Proceed to MEASURE?
```
**STOP. Wait for explicit approval.**

---

## Phase 5: MEASURE

**Goal:** Measure AFTER metrics with SAME tools as Phase 2. Compare before/after.

**Steps:**

1. Re-run exact same measurements from PROFILE phase
2. Compare side-by-side:

```
## Before/After Comparison

| Metric                | Before    | After     | Change     | Target    | Status |
|-----------------------|-----------|-----------|------------|-----------|--------|
| Bundle: main.js       | 1.2MB     | 680KB     | -43.3%     | <700KB    | ✅ HIT |
| Page load: /courses   | 3.2s TTFB | 1.1s TTFB | -65.6%     | <1.5s     | ✅ HIT |
| LCP                   | 4.2s      | 2.1s      | -50.0%     | <2.5s     | ✅ HIT |
| CourseList re-renders  | 47        | 3         | -93.6%     | <5        | ✅ HIT |
```

3. Run full test suite — show real output
4. Verify behavior unchanged

**🚦 APPROVAL GATE:**
```
✅ BEFORE/AFTER comparison:
   <table above>
✅ Targets hit: N/N
✅ Targets missed: N — <which ones and by how much>
✅ Tests: XX passed, 0 failed
✅ Behavior: unchanged
→ Proceed to CODE REVIEW? Or optimize further for missed targets?
```
**STOP. Wait for developer decision — accept results or continue optimizing.**

---

## Phase 6: CODE REVIEW

**Always activate:** `requesting-code-review`

**Review must include metrics:**
```markdown
## Performance Optimization Review

### Changes
- <file> — <what was optimized and why>

### Metrics (before → after)
- <metric 1>: <before> → <after>
- <metric 2>: <before> → <after>

### Tests: all passing, behavior unchanged

### Risk Areas
- <any trade-offs: memory vs speed, cache invalidation, etc.>
```

**If developer gives feedback:** activate `receiving-code-review`

**🚦 APPROVAL GATE:**
```
✅ Review complete
✅ Metrics documented
✅ Trade-offs noted
→ Choose: [A] Merge [B] PR [C] Stop
```
**STOP. Wait for choice.**

---

## Phase 7: SHIP

**Always activate:** `finishing-a-development-branch`

Same options: merge / PR / stop.

**🚦 FINAL GATE:**
```
✅ Optimization shipped
✅ Method: <merge|PR|stopped>
✅ Branch: perf/<n>
✅ Key improvement: <best metric change>
✅ All targets hit: yes / N missed
→ Done. Anything to adjust?
```
