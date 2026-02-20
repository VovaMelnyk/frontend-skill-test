# Documentation — Phase Details

> **REQUIRED SUB-SKILL:** Use superpowers:using-git-worktrees for Phase 1 (if used)
> **REQUIRED SUB-SKILL:** Use superpowers:brainstorming for Phase 2
> **REQUIRED SUB-SKILL:** Use superpowers:verification-before-completion for Phase 4
> **REQUIRED SUB-SKILL:** Use superpowers:finishing-a-development-branch for Phase 5 (if branch used)

---

## Phase 1: ISOLATE (Optional)

**Use branch for:** large docs efforts (new README, full component library docs, onboarding guide)
**Skip branch for:** small updates (fixing typos, updating one component doc, adding a section)

**If using branch:**
1. Create branch: `docs/<description>`
2. Set up worktree

**If skipping branch:** work directly in current workspace

**🚦 APPROVAL GATE:**
```
✅ Branch: docs/<n> / Working directly (small update)
→ Proceed to RESEARCH?
```
**STOP. Wait for explicit approval.**

---

## Phase 2: RESEARCH

**Always activate:** `brainstorming`

**Activate by documentation type:**

| Documenting... | Also activate for analysis |
|----------------|---------------------------|
| Frontend components | `react-best-practices` + `next-best-practices` |
| Architecture | `next-best-practices` |
| TypeScript patterns | `advanced-typescript-patterns` |

**Steps:**

1. Clarify with developer:
   - Who is the audience? (new dev, external user, team member)
   - What format? (README, component docs, guide, ADR)
   - What scope? (whole design system, single component, full project)

2. Analyze relevant codebase:
   - Read source files for the area being documented
   - Extract: component props, types, variants, default values
   - Note: configuration options, environment variables, dependencies

3. Propose document outline:
```markdown
## Proposed Outline: <Doc Title>
Audience: <who>
Format: <type>

### Sections:
1. <Section title> — <what it covers>
2. <Section title> — <what it covers>
3. <Section title> — <what it covers>
...
```

**🚦 APPROVAL GATE:**
```
✅ Audience: <who>
✅ Format: <type>
✅ Sections planned: N
✅ Outline:
   1. <section> — <scope>
   2. <section> — <scope>
   ...
→ Approve outline? Proceed to WRITE?
```
**STOP. Wait for explicit approval of outline.**

---

## Phase 3: WRITE

**Write section by section. Present EACH section for approval.**

**Steps per section:**

1. Write the section content
2. Include code examples where helpful
3. Present to developer for review

**🚦 SECTION GATE (repeat for each section):**
```
## Section N: <title>

<section content>

→ Approve this section? Changes needed?
```
**STOP after EACH section. Wait for approval or corrections.**

**Writing guidelines by doc type:**

### Component Documentation
```markdown
## Button Component

Reusable button with multiple variants.

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'ghost' | 'primary' | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| disabled | boolean | false | Disabled state |

### Usage
​```tsx
import { Button } from '@/components/ui/Button';

// Primary button (default)
<Button>Click me</Button>

// Secondary variant, large size
<Button variant="secondary" size="lg">
  Submit
</Button>

// Ghost variant, disabled
<Button variant="ghost" disabled>
  Cancel
</Button>
​```

### Variants
- **primary** — Solid background, used for main actions
- **secondary** — Outlined, used for secondary actions
- **ghost** — No background, used for tertiary actions

### Accessibility
- Renders as `<button>` element by default
- Supports `aria-label` for icon-only buttons
- Focus ring visible on keyboard navigation
- Disabled state removes from tab order
```

### README
```markdown
# Project Name

## Quick Start
1. Clone + install
2. Environment setup
3. Run dev server

## Architecture
- High-level overview
- Key directories

## Development
- Commands
- Testing
- Code style

## Deployment
- How to deploy
```

### Onboarding Guide
```markdown
# Developer Onboarding

## Day 1: Setup
- Environment, tools, access

## Day 2: Architecture
- How the app works, key concepts

## Day 3: First Task
- Pick a starter task, workflow to follow
```

### Architecture Decision Record (ADR)
```markdown
# ADR-NNN: <Decision Title>
Date: YYYY-MM-DD
Status: Accepted / Proposed / Deprecated

## Context
What situation led to this decision

## Decision
What we decided and why

## Consequences
Positive and negative effects

## Alternatives Considered
What else we evaluated
```

After all sections approved — save complete document to appropriate location.

**🚦 COMPLETION GATE:**
```
✅ All N sections approved
✅ Document saved: <path>
→ Proceed to REVIEW?
```
**STOP. Wait for explicit approval.**

---

## Phase 4: REVIEW

**Always activate:** `verification-before-completion`

**Steps:**

1. **Verify code examples work:**
   - Extract every code snippet from the doc
   - Run each one (component renders, shell commands, TypeScript compiles)
   - Fix any that don't work

2. **Cross-check with source code:**
   - Component props match actual type definitions
   - Import paths are correct
   - Default values match actual defaults
   - Variant names match actual implementation

3. **Readability check:**
   - Clear for target audience?
   - No assumed knowledge that isn't documented?
   - Examples are complete (not fragments)?

**🚦 APPROVAL GATE:**
```
✅ Code examples verified: N/N work
✅ Cross-checked with source: all accurate
✅ Fixed issues: <list> / None
→ Choose: [A] Merge [B] PR [C] Stop
```
**STOP. Wait for choice.**

---

## Phase 5: SHIP

**If branch was used:** activate `finishing-a-development-branch`
**If no branch:** just confirm completion.

Same options: merge / PR / stop.

**🚦 FINAL GATE:**
```
✅ Documentation shipped
✅ Method: <merge|PR|stopped|direct commit>
✅ Document: <path>
✅ Type: <component docs|README|onboarding|ADR|other>
✅ Sections: N
→ Done. Anything to adjust?
```
