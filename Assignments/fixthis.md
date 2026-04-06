# :spaghetti: Fixthis

_Clone an unfamiliar codebase, figure out how it works, and ship a feature — without breaking anything!_

## Purpose (Why Should I Do This?)

Real work often means inheriting unfamiliar code. This project teaches you to read, understand, and contribute to a codebase you didn't build — a core skill you'll use throughout your career. You'll learn to navigate complexity and make confident changes without breaking existing functionality.

### Table of Contents

1. [Purpose (Why Should I Do This?)](#purpose-why-should-i-do-this)
1. [Setup](#setup)
1. [Instructions](#instructions)
1. [Rubric](#rubric)
1. [Submission](#submission)
1. [Resources](#resources)

## Setup

### Project Structure

```bash
fixthis/
├── README.md
├── CLAUDE.md
├── AGENTS.md              (at least 1 scoped to a key subdirectory)
├── writeup.md             (exploration + context building notes)
└── (forked codebase)
```

1. Choose one of the following open-source projects _(or propose an alternative with instructor approval)_:

    - **SuiteCRM** — add a custom dashboard widget
    - **Redwood.js Tutorial App** — add a new model with full CRUD
    - **Express.js Starter** — add authentication middleware with JWT

1. Fork the repo and clone it locally:

    ```bash
    $ git clone git@github.com:YOUR_GITHUB_USERNAME/CHOSEN_REPO.git
    $ cd CHOSEN_REPO
    ```

1. **Don't start coding yet.** Your first job is understanding the codebase. Use your AI tools to explore before you build.

## Instructions

Complete each task in the order they appear. Use [GitHub Task List](https://help.github.com/en/github/managing-your-work-on-github/about-task-lists) syntax to track your progress.

### V1.0 — Exploration & Understanding

- [ ] Map the codebase architecture using AI tools. Save exploration logs or summaries.
- [ ] Create `CLAUDE.md` based on what you learned — tech stack, patterns, conventions, gotchas.
- [ ] Create at least **1** `AGENTS.md` in a key subdirectory with scoped instructions for that area.
- [ ] **Add, commit, and push to GitHub**.

### V1.1 — Rules & Context Tuning

- [ ] Write at least **3 rules** with glob or path scoping that enforce the project's existing conventions.
- [ ] Test your rules by running a small task and observing agent behavior.
- [ ] Refine your `CLAUDE.md` or rules based on output quality. Document what you changed and why in `writeup.md`.
- [ ] **Add, commit, and push to GitHub**.

### V1.2 — Feature Addition

- [ ] Write your feature specification with acceptance criteria.
- [ ] Build the feature using test-first development. New tests must pass.
- [ ] Verify **no regressions** — all existing tests must still pass after your changes.
- [ ] **Add, commit, and push to GitHub**.

### Stretch Challenges

- [ ] Write scoped rules that cover testing patterns _and_ architectural constraints in addition to conventions.
- [ ] Generate architecture diagrams or decision documentation from your exploration.
- [ ] Show before/after evidence of how your context tuning changed agent output quality.

## Rubric

| | **Needs Improvement** | **Basic** | **Proficient** | **Advanced** |
|:--|:--|:--|:--|:--|
| **Codebase Understanding** | Minimal exploration; architecture unclear | Basic mapping of codebase; some patterns identified | Thorough analysis of architecture, patterns, and conventions | Deep understanding reflected in clear, well-scoped rules |
| **Configuration Quality** | Missing `CLAUDE.md` or `AGENTS.md` | Present but generic instructions | Comprehensive, project-specific guidance with clear conventions | Config serves as a template; other students could clone and build immediately |
| **Rules & Enforcement** | No rules or rules don't match project patterns | Basic rules written; limited testing | 3+ well-scoped rules enforcing existing conventions; tested | Advanced rules combining testing patterns and architectural constraints |
| **Feature Implementation** | Feature incomplete or breaks existing tests | Feature works; some test failures | All tests pass; feature follows project patterns; no regressions | Sophisticated implementation; demonstrates mastery of project patterns |
| **Documentation** | Minimal or unclear writeup | Basic exploration notes in `writeup.md` | Clear documentation of exploration, tuning, and results | Excellent before/after evidence of context refinement |

## Submission

Submit your GitHub repo link via [Gradescope](https://www.gradescope.com/courses/1293005).

## Resources

### Lesson Plans

- [**Day 07**: Somebody Else's Spaghetti](../Lessons/somebody-elses-spaghetti.md): Navigating a large, unfamiliar codebase.
- [**Day 08**: House Rules](../Lessons/house-rules.md): Teaching your tools how YOUR project works.
