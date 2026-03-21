<!-- .slide: data-background="./Images/header.svg" data-background-repeat="none" data-background-size="40% 40%" data-background-position="center 10%" class="header" -->
# What Do You Even Do All Day?

<!-- > -->

## Minute-by-Minute

| **Elapsed** | **Time** | **Activity** |
|:-----------:|:--------:|:-------------|
| 0:00 | 0:05 | Objectives |
| 0:05 | 0:25 | Overview: The agent-driven SDLC Transformation |
| 0:30 | 0:35 | Activity 1: Time Allocation Analysis |
| 1:05 | 0:10 | BREAK |
| 1:15 | 0:20 | Advanced Agent Rules & Model Selection |
| 1:35 | 0:35 | Activity 2: End-to-End task complexity level Task |
| 2:10 | 0:15 | Activity 3: Role Evolution Discussion |
| 2:25 | 0:05 | Wrap Up |
| TOTAL | 2:30 | - |

<!-- > -->

## Learning Objectives (5 min)

By the end of this lesson, you will be able to:

1. Understand how the engineering workflow flips — less time typing, way more time thinking, designing, and verifying — and why that's a promotion, not a replacement
1. See where the agent does repetitive execution and where you make the decisions that matter — architectural choices, trade-offs, quality gates
1. Execute a complete architectural build end-to-end — from creative exploration through implementation to verification — using everything you've learned
1. Own the new role: architect, specification writer, reviewer, debugger — the skills that let you direct agent work and ship with confidence

<!-- > -->

## Best Practices

Here's what actually happens:

- **Time splits differently now**: ~50% writing specs and context, ~10% implementation (agent does this), ~40% review. Old way: ~20% spec, ~60% typing, ~20% review. You're thinking more, not less.
- **Specs are the bottleneck**: A clear spec with blocking gates takes 2 hours and saves 20 hours of agent rework. Fuzzy specs kill productivity.
- **Test-first is mandatory**: Write tests before code. Forces you to think clearly and gives the agent an objective definition of "done."
- **Design multiple options first**: Before code, explore 2-4 architectural approaches. Agents suck at this. Humans are good at it. Pick one, then let the agent execute.
- **Review differently**: Skip line-by-line code review (agent got that right). Focus on architecture, edge cases, and whether it matches the spec. That's where real bugs are.

<!-- > -->

# Topic 1: The agent-driven SDLC Transformation

<!-- v -->

## Overview/TT I (25 min)

- **Traditional SDLC time allocation**: ~20% spec, ~60% implementation, ~20% review/test
- **agent-driven SDLC**: ~50% spec/context, ~10% implementation (agent), ~40% review/verification
- **The developer role shift**: from typist to architect, reviewer, and context engineer
- **What "senior engineer" means now**: specification precision, context design, verification strategy
- **Why this makes engineering harder, not easier**: the thinking is the work

<!-- v -->

## Activity 1: Time Allocation Analysis (35 min)

**Breakout Rooms (teams of 3)**

Using your Assignment 1 and 2 experience, build a time allocation breakdown:

1. How much time did you spend on specification/context vs. implementation vs. review?
2. Compare to what it would have been without agents
3. Where were the bottlenecks? Where did you waste time?
4. What would you do differently?

**Deliverable**: Time allocation pie charts (before/after agents) with written analysis.

<!-- > -->

<!-- .slide: data-background="#087CB8" -->
## [**10m**] BREAK

<!-- > -->

# Topic 2: task complexity level Execution

<!-- v -->

## Overview/TT II (20 min)

- **task complexity level tasks**: architectural changes requiring the full design exploration phase
- **The design exploration phase in detail**: 2–4 genuine design options, trade-off analysis, team discussion
- **Advanced agent rules for complex workflows**
- **MCP-enriched execution**: external context tools for docs, Chrome for verification, custom tools for data

<!-- v -->

## Activity 2: End-to-End task complexity level Task (35 min)

**Breakout Rooms (teams of 3)**

Execute a task complexity level task from scratch with the full MCP-enriched workflow:

**Task**: Add WebSocket real-time notifications to an existing REST API.

1. design exploration phase: propose 2–4 architectural approaches (polling, SSE, WebSocket, hybrid)
2. Evaluate trade-offs using external context tools for library documentation
3. Select an approach and write the full specification with BLOCKING gates
4. Execute the build with TDD
5. Verify with Chrome MCP (visual confirmation of real-time updates)

**Deliverable**: Working implementation with design exploration phase documentation and all gates passed.

<!-- v -->

## Activity 3: Role Evolution Discussion (15 min)

**Full Class Discussion**

Based on your experience in this course so far: what skills matter more now? What skills matter less? How would you describe the AI engineer role to someone interviewing you?

<!-- > -->

## Wrap Up (5 min)

- Assignment 3 begins: MCP-enriched workflow
- The final project should be taking shape — start thinking about your topic

<!-- > -->

## Additional Resources

1. [The agent-driven Era of Software Development](https://www.anthropic.com/engineering)
