# :seedling: firstbuild

_Build your very first application from scratch using Claude Code and a test-driven AI workflow!_

## Purpose (Why should I do this?)

Building from scratch with test-first discipline teaches you how to work with AI tools as true partners. You'll ship a real application, prove your implementation works, and establish patterns you'll carry into every project you build.

### Table of Contents

1. [Project Structure](#project-structure)
2. [Getting Started](#getting-started)
3. [Deliverables](#deliverables)
4. [Resources](#resources)

## Project Structure

```bash
firstbuild/
├── README.md
├── CLAUDE.md
├── spec.md
├── src/
│   └── (your application code)
└── tests/
    └── (your tests)
```

## Setup

1. Visit [github.com/new](https://github.com/new) and create a new repository named `firstbuild`.
2. Run each command line-by-line in your terminal to set up the project:

    ```bash
    $ mkdir firstbuild && cd firstbuild
    $ git init
    $ git remote add origin git@github.com:YOUR_GITHUB_USERNAME/firstbuild.git
    ```

3. Pick what you want to build: **CLI tool or REST API**, your choice. The domain doesn't matter — the workflow does. Some ideas: URL shortener, markdown converter, task tracker.

## Instructions

Complete each task in the order they appear. Use [GitHub Task List](https://help.github.com/en/github/managing-your-work-on-github/about-task-lists) syntax to track your progress.

### v1.0 — Project Setup & Specification

- [ ] Create `CLAUDE.md` with project-specific instructions — tech stack, conventions, testing expectations.
- [ ] Write `spec.md` with at least **3 quality gates**. Each gate needs a concrete way to invoke it and success criteria you can verify.
- [ ] Write at least **5 acceptance criteria** in Given/When/Then format.
- [ ] **Add, commit, and push to GitHub**.

### v1.1 — Test-First Development

- [ ] Write failing tests for your first feature _before_ writing any implementation code.
- [ ] Implement the feature until all tests pass.
- [ ] Refactor the code while keeping tests green.
- [ ] Repeat the red/green/refactor cycle for at least 2 additional features.
- [ ] Your commit history must show tests committed _before_ implementation for each feature.
- [ ] **Add, commit, and push to GitHub**.

### v1.2 — Complexity & Polish

- [ ] Complete at least one **task complexity level** task (multi-step, single file area) using the workflow.
- [ ] Complete at least one **task complexity level** task (multi-file, requires design decisions) using the workflow.
- [ ] Document the different workflow approaches you used for each level.
- [ ] Ensure **all tests pass** on the final submission.
- [ ] **Add, commit, and push to GitHub**.

### Stretch Challenges

- [ ] Add custom slash commands (`.claude/commands/`) that accelerate your personal workflow.
- [ ] Add an `AGENTS.md` in a subdirectory with scoped instructions.
- [ ] Show evidence of refining your `CLAUDE.md` based on agent output quality (before/after in commit history).

## Rubric

| | **Needs Improvement** | **Basic** | **Proficient** | **Advanced** |
|:--|:--|:--|:--|:--|
| **Project Setup** | Missing key files or incomplete git history | `CLAUDE.md`, `spec.md`, and basic repo structure present | Clear, well-organized project with 5+ acceptance criteria and 3+ quality gates | Setup serves as a template for future projects |
| **Test-First Workflow** | Tests written after code, or tests missing | Tests present but incomplete; some features lack test coverage | Full red/green/refactor cycle visible in commit history for 3+ features | Sophisticated test patterns; advanced refactoring strategies evident |
| **Feature Completion** | Incomplete features; failing tests | Core features working; most tests passing | All features complete, all tests passing, code is clean | Thoughtful complexity handling; multiple refactoring cycles |
| **Commit Quality** | Poor organization or missing commits | Adequate commits; some squashing needed | Clear commit messages showing progression; tests before implementation | Excellent narrative arc in commit history; evidence of refinement |

## Submission

Submit your GitHub repo link via [Gradescope](https://gradescope.com).

## Resources

### Lesson Plans

- [**Day 01**: Copilot ≠ Coworker](../Lessons/copilot-neq-coworker.md): How autonomous dev tools differ from suggestion engines.
- [**Day 02**: Memory Is Everything](../Lessons/memory-is-everything.md): Project instructions, scoped configs, and custom commands.
- [**Day 04**: Thirteen Tiny Coworkers](../Lessons/thirteen-tiny-coworkers.md): Test-first development enforced by the workflow.
- [**Day 05**: Words Before Code](../Lessons/words-before-code.md): Why your description is the primary artifact.
