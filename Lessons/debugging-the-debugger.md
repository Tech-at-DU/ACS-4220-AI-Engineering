<!-- .slide: data-background="./Images/header.svg" data-background-repeat="none" data-background-size="40% 40%" data-background-position="center 10%" class="header" -->
# Debugging the Debugger

<!-- > -->

## Minute-by-Minute

| **Elapsed** | **Time** | **Activity** |
|:-----------:|:--------:|:-------------|
| 0:00 | 0:05 | Objectives |
| 0:05 | 0:25 | Overview: The debugging framework |
| 0:30 | 0:35 | Activity 1: Debug a Broken Agent Workflow |
| 1:05 | 0:10 | BREAK |
| 1:15 | 0:20 | Measuring Impact |
| 1:35 | 0:30 | Activity 2: Before/After Impact Analysis |
| 2:05 | 0:20 | Activity 3: Final Project Planning |
| 2:25 | 0:05 | Wrap Up |
| TOTAL | 2:30 | - |

<!-- > -->

## Learning Objectives (5 min)

By the end of this lesson, you will be able to:

1. Diagnose exactly where agent output went wrong — is the instructions incomplete? Is the requirements fuzzy? Is it the wrong model for the job? — and fix the root cause
1. Tune execution methodically — change one thing, measure the result, repeat — instead of randomizing settings and hoping
1. Prove that workflow acceleration actually happened — measure cycle time, quality, confidence — and show the business case for building this way
1. Build feedback loops that keep improving output — execution data feeds back into instructions, specs, and tool choices — continuous improvement without rewriting

<!-- > -->

## Best Practices

Here's what works:

- **Debugging hierarchy**: Context → Spec → Model → Tool. Most wrong output comes from missing context or fuzzy specs. Check context first (easiest fix), then spec, then model.
- **Change one thing at a time**: A/B test context, then spec, then model independently. Change three things at once and you won't know what fixed it.
- **Log execution traces**: What did the agent try? Which tools? What decisions? You can't debug what you can't see. AgentOps and Langfuse make this automatic.
- **Measure before and after**: Time, quality, test coverage, rework cycles. Run the same task without agents, then with them. Numbers beat opinions when talking to leadership.
- **Learn failure patterns**: Agents fail predictably (hallucinated features, wrong tool choice, planning breaks, execution errors). Know the categories. Identify the failure type and you're halfway to the fix.

<!-- > -->

# Topic 1: The debugging framework

<!-- v -->

## Overview/TT I (25 min)

- **The debugging hierarchy: context → specification → model → tool**
- **Context problems: missing information, conflicting rules, stale context, wrong scope**
- **Specification problems: ambiguous requirements, missing edge cases, untestable criteria**
- **Model problems: wrong model for the task, token limits, capability gaps**
- **Systematic tuning: change one variable at a time, measure the result**

<!-- v -->

## Activity 1: Debug a Broken Agent Workflow (35 min)

**Breakout Rooms (teams of 3)**

The instructor provides a repo with intentionally broken agent configuration — wrong rules, conflicting CLAUDE.md entries, missing context, and a bad spec. The agent produces incorrect output.

1. Identify all the problems using the debugging framework
2. Fix them one at a time, testing after each fix
3. Get the agent producing correct output

**Deliverable**: Bug report listing each problem found, the debugging step that revealed it, and the fix applied.

<!-- > -->

<!-- .slide: data-background="#087CB8" -->
## [**10m**] BREAK

<!-- > -->

# Topic 2: Measuring Impact

<!-- v -->

## Overview/TT II (20 min)

- **What to measure: cycle time, spec-to-PR time, defect rate, context accuracy, developer satisfaction**
- **Before/after comparison: same task, with and without the agent-driven workflow**
- **Qualitative metrics: developer confidence, code review quality, onboarding speed**
- **Presenting impact to leadership: the business case for agent-driven development**

<!-- v -->

## Activity 2: Before/After Impact Analysis (30 min)

**Breakout Rooms (teams of 3)**

Using data from your assignments and class activities:

1. Estimate time-to-completion for a representative task before this course vs. now
2. Compare code quality metrics (test coverage, defect rate if available)
3. Assess subjective confidence: how comfortable are you shipping agent-assisted code?
4. Build a one-slide impact summary you could present to a team lead

**Deliverable**: One-slide impact summary with quantitative and qualitative metrics.

<!-- v -->

## Activity 3: Final Project Planning (20 min)

**Solo / Pairs**

Finalize your final project plan:

1. What will you build?
2. Which workflow features will you demonstrate? (must include TDD, context design, and at least one advanced topic)
3. What are your BLOCKING gates and success criteria?
4. What tool integration servers will you use?

**Deliverable**: Final project proposal — due by end of class.

<!-- > -->

## Wrap Up (5 min)

- Week 7 is final project work time and presentations
- Mon, May 4: Lab day — work on final project, instructor available for help
- Wed, May 6: Final Project presentations

<!-- > -->

## Additional Resources

1. [Measuring Developer Productivity](https://queue.acm.org/detail.cfm?id=3595878)
