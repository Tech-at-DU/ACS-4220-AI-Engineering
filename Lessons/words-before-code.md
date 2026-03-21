<!-- .slide: data-background="./Images/header.svg" data-background-repeat="none" data-background-size="40% 40%" data-background-position="center 10%" class="header" -->
# Words Before Code

<!-- > -->

## Minute-by-Minute

| **Elapsed** | **Time** | **Activity** |
|:-----------:|:--------:|:-------------|
| 0:00 | 0:05 | Objectives |
| 0:05 | 0:25 | Overview: Specification as the Primary Artifact |
| 0:30 | 0:35 | Activity 1: Spec Teardown |
| 1:05 | 0:10 | BREAK |
| 1:15 | 0:20 | BLOCKING Gates & Acceptance Criteria |
| 1:35 | 0:35 | Activity 2: Write Specs, Trade, Build |
| 2:10 | 0:15 | Activity 3: Gate Enforcement Drill |
| 2:25 | 0:05 | Wrap Up |
| TOTAL | 2:30 | - |

<!-- > -->

## Learning Objectives (5 min)

By the end of this lesson, you will be able to:

1. See how bad specs create bad code — your descriptions must be clearer than your code, because the agent reads them first
1. Design hard stops that catch failures before they ship — verification gates that agents can't skip, criteria that are measurable
1. Write clear acceptance criteria in concrete language — exact invocations, expected outputs, nothing left to guesswork
1. Know when a spec is ready to hand to an agent — specific enough that they know what you want, abstract enough they can figure out how

<!-- > -->

## Best Practices

Here's what works:

- **Spec > code**: Agents read specs first. Make them precise. Every ambiguity you leave becomes something the agent guesses at, then you fix.
- **Be specific**: Don't write "validate input." Write: "POST /api/users with `{email: 'invalid'}` returns 400, message 'Invalid email format.'" That's what gets built.
- **scenario-based acceptance criteria**: "Given user is logged in, When they click Settings, Then they see their profile." No ambiguity. Agents test it. You measure against it.
- **BLOCKING gates enforce quality**: Define what must be true before moving forward — tests pass, no console warnings, no linting failures. Gates make it non-negotiable.
- **Specs are the bottleneck**: For complex work, the spec matters more than how fast the code gets written. Bad spec? Weeks of rework. Good spec? Clean, fast ship. Invest upfront.

<!-- > -->

# Topic 1: Specification as the Primary Artifact

<!-- v -->

## Overview/TT I (25 min)

- **The inversion: in agent-driven development, writing the spec IS the hard part**
- **Spec quality: Vague specs → vague output. Precise specs → precise output.**
- **Agent-ready specs: concrete invocation, expected behavior, edge cases, success criteria**
- **BLOCKING gates: hard stops where the agent must produce verifiable evidence before proceeding**
- **Cost of ambiguity: rework cycles, context waste, wrong architectural choices**

<!-- v -->

## Activity 1: Spec Teardown (35 min)

**Breakout Rooms (teams of 3)**

Given 3 real task specifications of varying quality (good, mediocre, terrible):

1. Identify every ambiguity, missing detail, and unstated assumption in each
2. Predict what an agent would do wrong with each spec
3. Rewrite the worst spec to be agent-ready

**Deliverable**: Annotated specs with ambiguity callouts and a rewritten version of the worst one.

<!-- > -->

<!-- .slide: data-background="#087CB8" -->
## [**10m**] BREAK

<!-- > -->

# Topic 2: BLOCKING Gates & scenario-based acceptance criteria

<!-- v -->

## Overview/TT II (20 min)

- **BLOCKING gate anatomy: what must be true, how to verify, what happens on failure**
- **Scenario-based acceptance criteria: format for acceptance criteria**
- **Concrete invocation: "Run `curl localhost:3000/api/users` and expect..."**
- **Verifiable success criteria: tests pass, specific output matches, no regressions**

<!-- v -->

## Activity 2: Write Specs, Trade, Build (35 min)

**Breakout Rooms (teams of 3)**

1. Each team writes a specification for a small feature (e.g., "add pagination to a list endpoint")
2. Teams swap specs with another team
3. The receiving team feeds the spec directly to Claude Code — no clarifications allowed
4. Evaluate: did the agent build what the authoring team intended?

**Deliverable**: Original spec, agent output, and a gap analysis showing where the spec failed.

<!-- v -->

## Activity 3: Gate Enforcement Drill (15 min)

**Solo**

Write 3 BLOCKING gates for your Assignment 1 project using scenario-based acceptance criteria. Each gate must have: a concrete invocation method, expected output, and a failure condition.

**Deliverable**: 3 BLOCKING gates committed to your Assignment 1 repo.

<!-- > -->

## Wrap Up (5 min)

- If the agent builds the wrong thing, the spec was wrong — not the agent
- Continue working on Assignment 1

<!-- > -->

## Additional Resources

1. [Writing Effective Acceptance Criteria](https://www.agilealliance.org/glossary/acceptance-criteria/)
