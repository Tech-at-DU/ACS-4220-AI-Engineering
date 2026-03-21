<!-- .slide: data-background="./Images/header.svg" data-background-repeat="none" data-background-size="40% 40%" data-background-position="center 10%" class="header" -->
# Thirteen Tiny Coworkers

<!-- > -->

## Minute-by-Minute

| **Elapsed** | **Time** | **Activity** |
|:-----------:|:--------:|:-------------|
| 0:00 | 0:05 | Objectives |
| 0:05 | 0:30 | Overview: The 11-Step test-driven development workflow |
| 0:35 | 0:35 | Activity 1: Red-Green-Refactor with Agents |
| 1:10 | 0:10 | BREAK |
| 1:20 | 0:20 | The 13 Specialized specialized agents |
| 1:40 | 0:30 | Activity 2: specialized agent Role Play |
| 2:10 | 0:15 | Activity 3: Model Selection Strategy |
| 2:25 | 0:05 | Wrap Up |
| TOTAL | 2:30 | - |

<!-- > -->

## Learning Objectives (5 min)

By the end of this lesson, you will be able to:

1. Run test-first workflows where tests become the spec — the agent builds to pass them, not guessing what you meant
1. Delegate to specialized workers — one writes tests, one implements, one reviews, one designs — each scoped tight with exactly what it needs
1. Watch the red-green-refactor cycle run autonomously — tests fail, code gets written, everything passes, quality improves — repeat
1. Pick the right model for each job — fast cheap models for routine work, powerful models for the hard thinking

<!-- > -->

## Best Practices

Here's what works:

- **Tests first**: Tests are your spec. Write them. Agent builds code to pass them. No guessing. No rework.
- **Sonnet's your default**: It's built for agent work — understands repos, makes multi-file changes, runs tests, keeps going. Use it for most tasks.
- **Pick the right model**: Haiku for routine stuff, Sonnet for normal features, Opus only when you really need the thinking power. Don't burn Opus tokens on work Sonnet handles.
- **Specialized agents work better**: Instead of one agent doing everything, spawn specialists — Test Writer, Code Agent, Reviewer. Each gets a tight scope. Cleaner, faster.
- **Run them in parallel**: Use git worktrees. One agent writes tests, another writes code, another docs. All at once. No stepping on each other.

<!-- > -->

# Topic 1: The 11-Step test-driven development workflow

<!-- v -->

## Overview/TT I (30 min)

- **Full pipeline: specification → test design → test writing → implementation → verification → review**
- **Test-first with agents: why it matters even more — tests are the specification**
- **BLOCKING gates: where the workflow stops until criteria are met**
- **Design exploration phase: exploring 2–4 genuine architectural options before committing**
- **Workflow mapping: how the 11 steps map to the execution workflow from Lesson 3**

<!-- v -->

## Activity 1: Red-Green-Refactor with Agents (35 min)

**Breakout Rooms (teams of 3)**

Build a string utility library (slugify, truncate, capitalize) using strict TDD with Claude Code:

1. **Red**: Write failing tests first (have the agent write them, review before proceeding)
2. **Green**: Let the agent implement just enough to pass
3. **Refactor**: Ask the agent to improve the implementation without breaking tests

Do this for 3 functions. Track: Did the agent try to skip ahead? Did you have to enforce the TDD discipline?

**Deliverable**: Repo with commit history showing red → green → refactor for each function.

<!-- > -->

<!-- .slide: data-background="#087CB8" -->
## [**10m**] BREAK

<!-- > -->

# Topic 2: The specialized agent Orchestra

<!-- v -->

## Overview/TT II (20 min)

- **13 specialized agents: Test Writer, Coding Agent, Code Reviewer, Architecture Designer, and more**
- **Context window management: how specialized agents maintain clean context windows**
- **Delegation patterns: when the orchestrator spawns which agent**
- **Model selection strategy: Haiku for simple reads, Sonnet for standard work, Opus for architecture**

<!-- v -->

## Activity 2: specialized agent Role Play (30 min)

**Breakout Rooms (teams of 4–5)**

Each team member takes on the role of a different specialized agent (Test Writer, Coding Agent, Code Reviewer, Architecture Designer, Documentation Agent). Given a feature request:

1. **Architecture Designer** proposes 2 approaches
2. **Test Writer** writes acceptance tests for the chosen approach
3. **Coding Agent** implements
4. **Code Reviewer** reviews and requests changes
5. **Documentation Agent** documents

Do this on paper/whiteboard first, then execute the real workflow in Claude Code. Compare human role-play to actual agent behavior.

**Deliverable**: Side-by-side comparison of human role-play decisions vs. agent decisions.

<!-- v -->

## Activity 3: Model Selection Strategy (15 min)

**Pairs**

Run the same task three times using different model overrides: `--model haiku`, `--model sonnet`, `--model opus`. Compare: speed, cost (token count), accuracy, and code quality.

**Deliverable**: Comparison table with timing, token usage, and quality notes.

<!-- > -->

## Wrap Up (5 min)

- TDD with agents = tests become the specification the agent implements against
- For next class: Assignment 1 begins — new projects TDD build
- Read: scenario-based acceptance criteria acceptance criteria format

<!-- > -->

## Additional Resources

1. [scenario-based acceptance criteria - Martin Fowler](https://martinfowler.com/bliki/GivenWhenThen.html)
