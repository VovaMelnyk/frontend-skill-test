# Code Review PR — Phase Details

> **REQUIRED SUB-SKILL:** Use superpowers:requesting-code-review for Phase 3

---

## Phase 1: READ

**Goal:** Understand what the PR does, why, and what context is relevant.

**Steps:**
1. Read the PR description, linked issues, design docs
2. Read the full diff — understand every changed file
3. Check the branch name and commit messages for intent
4. Identify the scope: which areas are touched (pages / components / styles)
5. Note what tests were added or modified

**🚦 APPROVAL GATE:**
```
✅ PR: <title>
✅ Author: <name>
✅ Scope: <areas touched>
✅ Summary: <what the PR does in 2-3 sentences>
✅ Files changed: N
✅ Tests: N new, N modified
→ Proceed to AUDIT?
```
**STOP. Wait for explicit approval.**

---

## Phase 2: AUDIT

**Goal:** Systematic analysis using domain skills for each area touched.

**Activate skills by what the PR changes:**

| PR changes... | Audit with |
|---------------|------------|
| React components | `react-best-practices` — performance, re-renders, waterfall, SSR |
| Next.js pages/layouts | `next-best-practices` — Server/Client split, caching, routing |
| Accessibility-related | `web-design-guidelines` — ARIA, focus, contrast, keyboard nav |
| TypeScript types | `advanced-typescript-patterns` — type safety, generics, utility types |

**Audit checklist for EVERY PR:**

1. **Logic correctness** — Does the code do what it claims?
2. **Edge cases** — What happens with empty data, null, errors?
3. **Security** — XSS, data exposure, unsafe user input handling?
4. **Performance** — Unnecessary re-renders, missing memoization, large bundle imports?
5. **Test coverage** — Are new code paths tested? Edge cases?
6. **Type safety** — Any `any` types? Missing null checks?
7. **Consistency** — Follows project patterns and conventions?
8. **Error handling** — Failures handled gracefully? Error boundaries present?

**Categorize each finding:**
- **🔴 Critical** — Security issue, data loss risk, incorrect logic. Must fix before merge.
- **🟠 Major** — Performance problem, missing error handling, untested paths. Should fix.
- **🟡 Minor** — Style inconsistency, suboptimal pattern. Nice to fix.
- **💬 Nit** — Naming suggestion, comment improvement. Optional.

**🚦 APPROVAL GATE:**
```
✅ Audit complete

🔴 Critical: N
   - <finding + file:line>

🟠 Major: N
   - <finding + file:line>

🟡 Minor: N
   - <finding + file:line>

💬 Nit: N
   - <finding + file:line>

✅ Overall assessment: APPROVE / REQUEST CHANGES / REJECT
→ Review my analysis. Adjust, then I'll help formulate comments.
```
**STOP. Wait for developer to review analysis and give direction.**

---

## Phase 3: FEEDBACK

**Goal:** Help developer formulate clear, constructive PR comments.

**Always activate:** `requesting-code-review`

**Steps:**

1. Based on developer's decisions from Phase 2, draft comments:
   - Each comment references specific file:line
   - Clear description of the issue
   - Suggestion for how to fix (when applicable)
   - Constructive tone — explain WHY, not just what's wrong

2. Format for posting:

```markdown
### [CRITICAL] <file>:<line> — <title>
<description of issue>
**Suggestion:** <how to fix>

### [MAJOR] <file>:<line> — <title>
<description>
**Suggestion:** <fix>

### [MINOR] <file>:<line> — <title>
<description>

### [NIT] <file>:<line> — <title>
<suggestion>
```

3. Draft overall review summary:
```markdown
## Review Summary
<1-2 sentences about the PR quality>

### What's good
- <positive aspects>

### Must fix before merge
- <critical + major items>

### Suggestions
- <minor + nit items>
```

**🚦 APPROVAL GATE:**
```
✅ Comments drafted: N total
✅ Review type: APPROVE / REQUEST CHANGES
→ Review comments. Edit as needed, then post to PR.
```
**STOP. Developer posts the review themselves.**
