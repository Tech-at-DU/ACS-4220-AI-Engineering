<!-- .slide: data-background="./Images/header.svg" data-background-repeat="none" data-background-size="40% 40%" data-background-position="center 10%" class="header" -->
# Somebody Else's Spaghetti

<!-- > -->

## Minute-by-Minute

| **Elapsed** | **Time** | **Activity** |
|:-----------:|:--------:|:-------------|
| 0:00 | 0:05 | Objectives |
| 0:05 | 0:25 | Overview: Inherited Codebases vs. New Projects |
| 0:30 | 0:35 | Activity 1: Explore an Unfamiliar Codebase |
| 1:05 | 0:10 | BREAK |
| 1:15 | 0:20 | context stores & Automated Context |
| 1:35 | 0:30 | Activity 2: Build a context store |
| 2:05 | 0:20 | Activity 3: Find the Bug |
| 2:25 | 0:05 | Wrap Up |
| TOTAL | 2:30 | - |

<!-- > -->

## Learning Objectives (5 min)

By the end of this lesson, you will be able to:

1. Navigate massive existing codebases quickly — using agents to scout while you stay focused on what matters
1. Recognize established systems instantly — looking for tests, CI, docs, and the patterns that show what's old vs. new
1. Build project knowledge that agents can actually use — instructions that give them the shortcut instead of making them guess
1. Delegate exploration work to specialized agents while keeping context clean and focused — parallelizing the learning process

<!-- > -->

## Best Practices

Here's what actually works:

- **Start with signals, not code**: Check test files, CI config, README first. Skip the source code browsing—tests and CI tell you the architecture way faster than scanning files.
- **Document as you discover**: Add architecture decisions, naming patterns, and gotchas to CLAUDE.md while you're exploring. Forces you to think clearly and gives the agent something useful.
- **Good code > bad code**: Agents navigate clean, modular code way better than tangled. If the agent's struggling, the codebase probably needs refactoring anyway.
- **Summaries beat dumps**: Have the agent write 2-3 paragraph summaries of each major module. Beats dumping 50 raw files.
- **Test with real questions**: Ask the agent what a new hire would ask ("How do I add an API endpoint?"). If it gets it wrong, you're missing context.

<!-- > -->

# Topic 1: Inheriting a Codebase

<!-- v -->

## Overview/TT I (25 min)

- **New projects vs. existing code**: different skills, different agent strategies
- **Legacy challenges**: existing patterns, implicit conventions, undocumented decisions
- **Agent-assisted exploration**: using specialized agents to read, summarize, and map a codebase
- **Legacy detection**: signals that trigger a different workflow (existing tests, CI config, README)

<!-- v -->

## Activity 1: Explore an Unfamiliar Codebase (35 min)

**Breakout Rooms (teams of 3)**

Clone [SuiteCRM](https://github.com/salesagility/SuiteCRM) (or a similarly large open-source project). You have 35 minutes. Using only Claude Code:

1. Identify the tech stack, entry points, and architecture pattern
2. Map the directory structure and identify the most important modules
3. Find where authentication is handled
4. Locate the test suite and determine test coverage strategy

**Rule**: No reading code manually. Only use Claude Code agent exploration.

**Deliverable**: A written summary of the codebase architecture produced entirely by agent-assisted exploration.

<!-- > -->

<!-- .slide: data-background="#087CB8" -->
## [**10m**] BREAK

<!-- > -->

# Topic 2: context stores & Automated Context

<!-- v -->

## Overview/TT II (20 min)

- **Context store**: `CLAUDE.md` populated from codebase analysis
- **Automated population**: having the agent analyze and document the codebase
- **Legacy CLAUDE.md contents**: architecture, conventions, gotchas, key files
- **Subdirectory context**: `AGENTS.md` for directory-specific guidance

<!-- v -->

## Activity 2: Build a context store from Scratch (30 min)

**Breakout Rooms (teams of 3)**

Using the SuiteCRM repo from Activity 1:

1. Have Claude Code generate a thorough CLAUDE.md by exploring the codebase
2. Create at least 2 AGENTS.md files for key subdirectories
3. Test the context store: ask Claude Code a question about the codebase and compare answers with/without the context store

**Deliverable**: CLAUDE.md + AGENTS.md files with before/after comparison of agent accuracy.

<!-- v -->

## Activity 3: Find the Bug (20 min)

**Breakout Rooms (teams of 3)**

The instructor has introduced a subtle bug into a fork of the starter project. Using Claude Code with your context store, find and fix the bug. First team to submit a passing PR wins.

**Deliverable**: PR with the fix and an explanation of how the agent found it.

<!-- > -->

## Wrap Up (5 min)

- Inherited codebase mastery = context building speed
- Assignment 2 begins: add a feature to an existing codebase

<!-- > -->

## Additional Resources

1. [Working Effectively with Legacy Code - Michael Feathers](https://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052)
