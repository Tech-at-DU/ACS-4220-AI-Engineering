<!-- .slide: data-background="./Images/header.svg" data-background-repeat="none" data-background-size="40% 40%" data-background-position="center 10%" class="header" -->
# House Rules

<!-- > -->

## Minute-by-Minute

| **Elapsed** | **Time** | **Activity** |
|:-----------:|:--------:|:-------------|
| 0:00 | 0:05 | Objectives |
| 0:05 | 0:25 | Overview: Context Tuning |
| 0:30 | 0:35 | Activity 1: Context Audit |
| 1:05 | 0:10 | BREAK |
| 1:15 | 0:20 | Scoped Agent Rules |
| 1:35 | 0:30 | Activity 2: Write Scoped Rules |
| 2:05 | 0:20 | Activity 3: legacy systems Feature Build |
| 2:25 | 0:05 | Wrap Up |
| TOTAL | 2:30 | - |

<!-- > -->

## Learning Objectives (5 min)

By the end of this lesson, you will be able to:

1. Document project conventions where the agent actually finds them — specific files, folders, behaviors — so it doesn't have to guess
1. Write rules that lock down consistency across a team — testing patterns, naming, file organization — making sure everyone (humans and agents) follows the same playbook
1. Connect the dots between rules and output — when things go wrong, you'll know if it's a context gap or a spec gap in seconds
1. Add a feature to an existing project using the full workflow — specs, tests, code, review — with your house rules making sure quality stays constant

<!-- > -->

## Best Practices

Here's what works:

- **Scope rules to file patterns**: Use globs like `*.test.ts` or `src/api/**`. Broad rules are noise; scoped rules actually matter.
- **One rule = one convention**: Don't mash "follow the spec, use our naming, never repeat code" into one rule. Split it: "Use PascalCase for components," "Test files use AAA pattern."
- **Version-control rules as code**: Treat them like infrastructure. Review in PRs, document clearly, iterate as you learn.
- **Put local rules in AGENTS.md**: Drop subdirectory-specific rules in AGENTS.md inside those folders. Rules in `src/api/AGENTS.md` stay in the API layer.
- **Test by triggering**: Write a small task that should hit the rule. If it doesn't apply, the rule is broken or too narrow. Verify behavior actually changed before committing.

<!-- > -->

# Topic 1: Context Tuning

<!-- v -->

## Overview/TT I (25 min)

- **Context tuning: the iterative process of refining what the agent knows**
- **Adding context: new CLAUDE.md entries, AGENTS.md, custom commands (slash commands your team can reuse)**
- **Removing context: when too much information causes confusion**
- **Restructuring: moving context to the right scope level (global vs. directory vs. file)**
- **The debugging framework: output wrong → check context → check spec → check model**

<!-- v -->

## Activity 1: Context Audit (35 min)

**Breakout Rooms (teams of 3)**

Take the context store you built in Lesson 7 and stress-test it:

1. Ask Claude Code 5 specific questions about the codebase (e.g., "How do I add a new API endpoint?")
2. For each wrong or incomplete answer, identify the missing context
3. Update the CLAUDE.md/AGENTS.md to fix the gap
4. Re-ask and verify improvement

**Deliverable**: Before/after log showing 5 questions, original answers, context fixes, and improved answers.

<!-- > -->

<!-- .slide: data-background="#087CB8" -->
## [**10m**] BREAK

<!-- > -->

# Topic 2: Scoped Agent Rules

<!-- v -->

## Overview/TT II (20 min)

- **Agent rules: instructions that apply to specific contexts**
- **Scoping with globs: `*.test.ts` rules only apply when touching test files**
- **Path-based scoping: rules for `src/api/` vs. `src/ui/`**
- **Topic-based rules: "when working on authentication, always..."**
- **Priority levels: how to resolve conflicting rules**

<!-- v -->

## Activity 2: Write Scoped Rules for a Real Project (30 min)

**Breakout Rooms (teams of 3)**

For your Assignment 2 project:

1. Write 3 glob-scoped rules (e.g., "For `*.test.*` files, always use describe/it blocks with AAA pattern")
2. Write 2 path-scoped rules (e.g., "In `src/api/`, always validate request bodies with zod")
3. Write 1 topic-scoped rule (e.g., "When modifying database schemas, always create a migration")

Test each rule by triggering it with a relevant task.

**Deliverable**: Rules committed to the repo with evidence they changed agent behavior.

<!-- v -->

## Activity 3: legacy systems Feature Build (20 min)

**Breakout Rooms (teams of 3)**

Using your full context setup (CLAUDE.md, AGENTS.md, scoped rules), add a small feature to the existing codebase using the complete TDD workflow. This is a dry run for Assignment 2.

**Deliverable**: Working feature with tests, built using the full workflow.

<!-- > -->

## Wrap Up (5 min)

- Context tuning is ongoing — treat it like code, iterate and improve
- Continue working on Assignment 2

<!-- > -->

## Additional Resources

1. [Claude Code CLAUDE.md Best Practices](https://docs.anthropic.com/en/docs/claude-code)
