<!-- .slide: data-background="./Images/header.svg" data-background-repeat="none" data-background-size="40% 40%" data-background-position="center 10%" class="header" -->
# Ticket to Merge

<!-- > -->

## Minute-by-Minute

| **Elapsed** | **Time** | **Activity** |
|:-----------:|:--------:|:-------------|
| 0:00 | 0:05 | Objectives |
| 0:05 | 0:30 | Overview: Task Entry → PR Creation |
| 0:35 | 0:30 | Activity 1: Classify Real Tasks |
| 1:05 | 0:10 | BREAK |
| 1:15 | 0:25 | task classification Deep Dive |
| 1:40 | 0:30 | Activity 2: Level 1–3 Speed Run |
| 2:10 | 0:15 | Activity 3: Write a Level 4 Spec |
| 2:25 | 0:05 | Wrap Up |
| TOTAL | 2:30 | - |

<!-- > -->

## Learning Objectives (5 min)

By the end of this lesson, you will be able to:

1. Trace the complete path from messy work item to shipped PR — understanding every stage where the agent works and where you guide
1. Classify any task by complexity in seconds — sizing it right and knowing which mode to operate in
1. See how agents explore design options before committing — comparing approaches, not just coding the first idea
1. Write clear requirements that agents actually want to work from — precise enough to avoid surprises, loose enough to let them be smart

<!-- > -->

## Best Practices

Here's what actually works:

- **Size it first**: Level 1 is a one-liner. Level 2 is a standard feature. Level 3 is multi-file refactoring. Level 4 is architecture work. Each one's got its own rhythm. Don't waste time on simple stuff; don't skimp on hard stuff.
- **Spec before code for Level 3+**: 20 minutes writing a good spec (problem, constraints, options, success criteria) saves cycles. Agent's got something real to work from.
- **Be concrete with acceptance criteria**: Don't say "validate input." Say: "POST /api/users with `{email: 'bad'}` returns 400, message 'Invalid email.'" That's what the agent builds.
- **Spec-first wins**: Clear specs upfront beat iterating and fixing endlessly. You get audit trails, clean code, and actually know what you built.
- **Explore designs first**: For Level 4, ask the agent for 2-4 approaches before you pick one. Bad architecture compounds every problem later. Good architecture makes everything easier.

<!-- > -->

# Topic 1: The Full execution workflow

<!-- v -->

## Overview/TT I (30 min)

- **Task entry: natural language → structured specification**
- **The workflow stages: understand → plan → implement → verify → PR**
- **Context flow: how context flows through each stage**
- **Design exploration phase: architecture exploration before implementation**
- **Specification to PR: what happens at each gate**

<!-- v -->

## Activity 1: Classify Real Tasks by Complexity (30 min)

**Breakout Rooms (teams of 3)**

Given a list of 10 real-world engineering tasks (provided by instructor), classify each as Level 1 (quick fix), Level 2 (standard feature), Level 3 (multi-file refactor), or Level 4 (architectural change). For each:

1. Identify the complexity signals (number of files, architectural decisions, test scope)
2. Describe what the workflow looks like at that level
3. Estimate how much of the work is specification vs. implementation

**Deliverable**: Completed classification table with justifications.

<!-- > -->

<!-- .slide: data-background="#087CB8" -->
## [**10m**] BREAK

<!-- > -->

# Topic 2: task classification

<!-- v -->

## Overview/TT II (25 min)

- **Level 1: One-liner — direct fix, no planning needed**
- **Level 2: Standard — clear scope, single feature, test-first**
- **Level 3: Multi-file — requires planning, multiple specialized agents**
- **Level 4: Architectural — design exploration phase mandatory, 2–4 design options, BLOCKING gates**
- **Model selection per level: Haiku for L1, Sonnet for L2–L3, Opus for L4**

<!-- v -->

## Activity 2: Level 1–3 Speed Run (30 min)

**Breakout Rooms (teams of 3)**

Execute one task at each level using Claude Code on a shared starter repo:

1. **Level 1**: Fix a typo in a config file
2. **Level 2**: Add input validation to an existing endpoint with tests
3. **Level 3**: Refactor a module to extract a shared utility, updating all callers

Time each one. Note how the agent's behavior changes at each level.

**Deliverable**: Terminal recordings or logs showing the agent's approach at each level.

<!-- v -->

## Activity 3: Write a Level 4 Specification (15 min)

**Solo**

Draft a task complexity level 4 specification for adding authentication to a REST API. Include: problem statement, constraints, at least 2 architectural options to explore, and success criteria.

**Deliverable**: Specification document ready to feed into the workflow next class.

<!-- > -->

## Wrap Up (5 min)

- The bottleneck shifts: at Level 4, specification precision > implementation speed
- For next class: bring your Level 4 spec from Activity 3
- Read: TDD workflow documentation

<!-- > -->

## Additional Resources

1. [Test-Driven Development by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)
