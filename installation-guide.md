# Гайд з встановлення скілів для Frontend проєкту (Next.js + React + Tailwind CSS)

## Зміст

1. [Огляд: що ставимо](#1-огляд)
2. [Superpowers (процесний фреймворк)](#2-superpowers)
3. [wshobson/agents (JS/TS)](#3-wshobsonagents)
4. [Vercel Agent Skills (React + Web Design)](#4-vercel-agent-skills)
5. [Vercel Next Skills (Next.js)](#5-vercel-next-skills)
6. [Vercel Agent Browser (E2E)](#6-vercel-agent-browser)
8. [Наші кастомні воркфлоу](#8-наші-кастомні-воркфлоу)
9. [Перевірка що все працює](#9-перевірка)
10. [Структура файлів після встановлення](#10-структура)

---

## 1. Огляд

### Що ставимо і звідки

| Джерело | Скіли | Метод встановлення |
|---------|-------|-------------------|
| obra/superpowers | brainstorming, using-git-worktrees, writing-plans, test-driven-development, subagent-driven-development, executing-plans, dispatching-parallel-agents, requesting-code-review, receiving-code-review, verification-before-completion, finishing-a-development-branch, systematic-debugging, writing-skills, using-superpowers | Plugin marketplace |
| wshobson/agents | **javascript-typescript** (3): javascript-testing-patterns, typescript-advanced-types, modern-javascript-patterns | Plugin marketplace |
| vercel-labs/agent-skills | vercel-react-best-practices, web-design-guidelines, vercel-composition-patterns | `npx skills add` |
| vercel-labs/next-skills | next-best-practices | `npx skills add` |
| vercel-labs/agent-browser | agent-browser (CLI) | `npx skills add` + npm global |
| vercel-labs/skill-creator | skill-creator | `npx skills add` |
| Наші файли | 6 кастомних воркфлоу | Копіювання в `.claude/skills/` (project-level) |

### Передумови

- Claude Code встановлений і працює
- Node.js 18+ та npm
- Git
- Доступ до терміналу

---

## 2. Superpowers

**Що це:** Процесний фреймворк — brainstorming, планування, TDD, code review, git worktrees, debugging. Це ядро всіх наших воркфлоу.

**Скіли що входять (14):**
brainstorming, using-git-worktrees, writing-plans, executing-plans, subagent-driven-development, dispatching-parallel-agents, test-driven-development, verification-before-completion, requesting-code-review, receiving-code-review, finishing-a-development-branch, systematic-debugging, using-superpowers, writing-skills

### Встановлення

```bash
# Крок 1: Додати marketplace (одноразово)
/plugin marketplace add obra/superpowers-marketplace

# Крок 2: Встановити плагін
/plugin install superpowers@superpowers-marketplace
```

Ці команди виконуються ВСЕРЕДИНІ Claude Code (в інтерактивній сесії).

### Перевірка

```bash
# В Claude Code перевірити що команди доступні
/help
# Повинні з'явитись:
#   /superpowers:brainstorm
#   /superpowers:write-plan
#   /superpowers:execute-plan
```

### Оновлення

```bash
/plugin update superpowers
```

---

## 3. wshobson/agents

**Що це:** JavaScript/TypeScript патерни для тестування, типізації та сучасних JS практик.

**Скіли що входять (3 для frontend):**

| Плагін | Скіли |
|--------|-------|
| javascript-typescript (3) | javascript-testing-patterns, typescript-advanced-types, modern-javascript-patterns |

### Встановлення

```bash
# В Claude Code (інтерактивна сесія)

# Крок 1: Додати marketplace (одноразово)
/plugin marketplace add wshobson/agents

# Крок 2: Встановити плагін (3 frontend скіли + 2 агенти)
plugin install javascript-typescript
```

> **Важливо:** Встановлюється весь плагін цілком — окремі скіли не можна встановити по одному. Разом з 3 frontend скілами також встановлюються 2 агенти: `javascript-pro` та `typescript-pro`.
>


### Перевірка

В Claude Code попросити:
```
Use skill tool to list all skills
```
Повинні бути видимі: javascript-testing-patterns, typescript-advanced-types, modern-javascript-patterns.

---

## 4. Vercel Agent Skills

**Що це:** React та web-design best practices від Vercel. 57 правил для React, 100+ правил для web design.

**Скіли:**
- vercel-react-best-practices (57 правил: waterfall elimination, bundle optimization, SSR)
- web-design-guidelines (100+ правил: accessibility, performance, UX)
- vercel-composition-patterns (compound components, state lifting)

### Встановлення

```bash
# В терміналі проєкту (не в Claude Code)
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-composition-patterns
```
---

## 5. Vercel Next Skills

**Що це:** Next.js specific best practices. Скіл `next-best-practices` — це background skill, він активується автоматично при роботі з Next.js файлами.

**Скіли:**
- next-best-practices (авто-активація)

### Встановлення

```bash
# В терміналі проєкту
npx skills add https://github.com/vercel-labs/next-skills --skill next-best-practices
```

---

## 6. Vercel Agent Browser

**Що це:** CLI інструмент для E2E тестування та browser automation. Використовується у фазах VERIFY наших воркфлоу.

**Це НЕ просто скіл — це CLI тулза + скіл.**

### Встановлення

```bash
# Крок 1: Встановити скіл (документація для Claude)
npx skills add https://github.com/vercel-labs/agent-browser --skill agent-browser
```

---

## 8. Наші кастомні воркфлоу

**Що це:** 6 воркфлоу для frontend розробки — feature-development, bugfix, refactoring, code-review-pr, performance-optimization, documentation.

### Архітектура зберігання скілів

Проєкт використовує 2-рівневу архітектуру для організації скілів:

```
<project-root>/
├── skills/                    # Вихідні файли воркфлоу (WF1–WF7, без WF4)
├── .agents/skills/            # Канонічні пакети спільних скілів
└── .claude/skills/            # Те, що читає Claude Code
    ├── <6 symlinks>           # → .agents/skills/* (зовнішні скіли)
    └── <6 directories>        # Наші кастомні воркфлоу
```

**Рівень 1: `skills/`** — директорія в корені проєкту. Містить оригінальні файли воркфлоу. Це вихідні файли для подальшого розгортання.

**Рівень 2: `.agents/skills/`** — канонічне сховище для пакетів скілів, встановлених через `npx skills add`. Тут живуть зовнішні скіли (Vercel React, Next.js, web-design, agent-browser, skill-creator).

**Рівень 3: `.claude/skills/`** — єдина директорія, яку читає Claude Code. Містить:
- **6 symlinks** на `.agents/skills/*` (зовнішні скіли)
- **6 реальних директорій** (наші кастомні воркфлоу з SKILL.md + phases.md)

### Встановлення кастомних воркфлоу

Кастомні скіли розміщуються безпосередньо в `.claude/skills/` проєкту (project-level):

```bash
# В корені проєкту
mkdir -p .claude/skills/{feature-development,bugfix,refactoring,code-review-pr,performance-optimization,documentation}

# Скопіювати файли з skills/ директорії
cp skills/WF1-feature-development-SKILL.md .claude/skills/feature-development/SKILL.md
cp skills/WF1-feature-development-phases.md .claude/skills/feature-development/feature-development-phases.md

cp skills/WF2-bugfix-SKILL.md .claude/skills/bugfix/SKILL.md
cp skills/WF2-bugfix-phases.md .claude/skills/bugfix/bugfix-phases.md

cp skills/WF3-refactoring-SKILL.md .claude/skills/refactoring/SKILL.md
cp skills/WF3-refactoring-phases.md .claude/skills/refactoring/refactoring-phases.md

cp skills/WF5-code-review-pr-SKILL.md .claude/skills/code-review-pr/SKILL.md
cp skills/WF5-code-review-pr-phases.md .claude/skills/code-review-pr/code-review-pr-phases.md

cp skills/WF6-performance-optimization-SKILL.md .claude/skills/performance-optimization/SKILL.md
cp skills/WF6-performance-optimization-phases.md .claude/skills/performance-optimization/performance-optimization-phases.md

cp skills/WF7-documentation-SKILL.md .claude/skills/documentation/SKILL.md
cp skills/WF7-documentation-phases.md .claude/skills/documentation/documentation-phases.md
```

### Створення symlinks для зовнішніх скілів

Зовнішні скіли з `.agents/skills/` підключаються через symbolic links:

```bash
cd .claude/skills/
ln -s ../../.agents/skills/agent-browser agent-browser
ln -s ../../.agents/skills/next-best-practices next-best-practices
ln -s ../../.agents/skills/vercel-composition-patterns vercel-composition-patterns
ln -s ../../.agents/skills/vercel-react-best-practices vercel-react-best-practices
ln -s ../../.agents/skills/web-design-guidelines web-design-guidelines
```

### Рекомендація

Для цього проєкту скіли стоять в **project-level** (`.claude/skills/`), бо воркфлоу специфічні для Next.js + React + Tailwind CSS стеку і не підходять для інших проєктів.

---

## 9. Перевірка що все працює

### Повний чек-лист

Запустіть нову сесію Claude Code і виконайте:

```
List all available skills
```

**Повинні бути видимі:**

✅ Superpowers (14):
- brainstorming, using-git-worktrees, writing-plans, executing-plans, subagent-driven-development, dispatching-parallel-agents, test-driven-development, verification-before-completion, requesting-code-review, receiving-code-review, finishing-a-development-branch, systematic-debugging, using-superpowers, writing-skills

✅ wshobson/agents (3):
- **javascript-typescript** (3): javascript-testing-patterns, typescript-advanced-types, modern-javascript-patterns

✅ Project-level shared (5):
- agent-browser, next-best-practices, vercel-composition-patterns, vercel-react-best-practices, web-design-guidelines

✅ Наші воркфлоу (6):
- feature-development, bugfix, refactoring, code-review-pr, performance-optimization, documentation

**Разом: ~28 скілів** (14 superpowers + 3 wshobson + 6 shared + 6 custom)

---

## 10. Структура файлів після встановлення

```
<project-root>/
├── skills/                                    # Вихідні файли воркфлоу (WF originals)
│   ├── WF1-feature-development-SKILL.md
│   ├── WF1-feature-development-phases.md
│   ├── WF2-bugfix-SKILL.md
│   ├── WF2-bugfix-phases.md
│   ├── WF3-refactoring-SKILL.md
│   ├── WF3-refactoring-phases.md
│   ├── WF5-code-review-pr-SKILL.md
│   ├── WF5-code-review-pr-phases.md
│   ├── WF6-performance-optimization-SKILL.md
│   ├── WF6-performance-optimization-phases.md
│   ├── WF7-documentation-SKILL.md
│   └── WF7-documentation-phases.md
├── .agents/
│   └── skills/                                # Канонічні пакети спільних скілів
│       ├── agent-browser/
│       ├── next-best-practices/
│       ├── vercel-composition-patterns/
│       ├── vercel-react-best-practices/
│       └── web-design-guidelines/
├── .claude/
│   ├── settings.json
│   └── skills/                                # Те, що читає Claude Code
│       ├── agent-browser → ../../.agents/skills/agent-browser
│       ├── next-best-practices → ../../.agents/skills/next-best-practices
│       ├── vercel-composition-patterns → ../../.agents/skills/vercel-composition-patterns
│       ├── vercel-react-best-practices → ../../.agents/skills/vercel-react-best-practices
│       ├── web-design-guidelines → ../../.agents/skills/web-design-guidelines
│       ├── bugfix/
│       │   ├── SKILL.md
│       │   └── bugfix-phases.md
│       ├── code-review-pr/
│       │   ├── SKILL.md
│       │   └── code-review-pr-phases.md
│       ├── documentation/
│       │   ├── SKILL.md
│       │   └── documentation-phases.md
│       ├── feature-development/
│       │   ├── SKILL.md
│       │   └── feature-development-phases.md
│       ├── performance-optimization/
│       │   ├── SKILL.md
│       │   └── performance-optimization-phases.md
│       └── refactoring/
│           ├── SKILL.md
│           └── refactoring-phases.md
└── installation-guide.md
```

### Пояснення структури

| Директорія | Що містить | Хто читає |
|---|---|---|
| `skills/` | Оригінальні WF файли (source of truth) | Розробники (для редагування) |
| `.agents/skills/` | Пакети зовнішніх скілів (npx skills add) | Symlinks з `.claude/skills/` |
| `.claude/skills/` | Symlinks + кастомні воркфлоу | Claude Code |
---
