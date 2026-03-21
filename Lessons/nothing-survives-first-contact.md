<!-- .slide: data-background="./Images/header.svg" data-background-repeat="none" data-background-size="40% 40%" data-background-position="center 10%" class="header" -->
# Nothing Survives First Contact

<!-- > -->

## Minute-by-Minute

| **Elapsed** | **Time** | **Activity** |
|:-----------:|:--------:|:-------------|
| 0:00 | 0:05 | Objectives |
| 0:05 | 0:25 | Overview: Multi-Phase Builds |
| 0:30 | 0:35 | Activity 1: Phase 1 Build + Curveball |
| 1:05 | 0:10 | BREAK |
| 1:15 | 0:20 | Handling Requirement Changes Mid-Build |
| 1:35 | 0:35 | Activity 2: The Requirements Change Drill |
| 2:10 | 0:15 | Activity 3: Retrospective — What Broke? |
| 2:25 | 0:05 | Wrap Up |
| TOTAL | 2:30 | - |

<!-- > -->

## Learning Objectives (5 min)

By the end of this lesson, you will be able to:

1. Structure work in phases — stable checkpoints you can lock down, flexibility in what comes next
1. Absorb requirement changes mid-build — updating specs and continuing without losing momentum
1. Spot architectural weaknesses during design exploration — knowing which choices make future changes easier
1. Tell the difference between essential and flexible — what you can patch and what could break your foundation

<!-- > -->

## Best Practices

Here's what works:

- **Changes aren't failures**: Real projects shift mid-build. Update the spec, re-run tests, let the agent code. Tests catch breaks. Good architecture absorbs surprises.
- **Phase boundaries matter**: Each phase is solid ground. You don't lock everything down (that's waterfall). Lock the core design for this phase, iterate on details next. Flexible without chaos.
- **Spec first, code second**: When requirements change, update your spec and gates before touching code. Spec guides the work. Tests prove it works.
- **Loose coupling wins**: Architectures that decompose cleanly (pluggable pieces, not tightly bound) tolerate change. Small changes stay small. Tightly coupled architecture makes changes harder everywhere.
- **Spec-first beats iterate-and-fix**: Prompt-and-iterate (describe, code, fix, repeat) works for tiny tasks. Spec-first (spec, tests, code) scales. Pick by what you're actually building.

<!-- > -->

# Topic 1: Multi-Phase Builds

<!-- v -->

## Overview/TT I (25 min)

- **Multi-phase shipping**: why real projects don't ship in one pass
- **Phase boundaries**: when to checkpoint, what to lock down, what stays flexible
- **Design exploration**: choosing architectures that tolerate change
- **Context management**: what to carry forward, what to discard

<!-- v -->

## Activity 1: Phase 1 Build + Curveball (35 min)

**Breakout Rooms (teams of 3)**

Build Phase 1 of a task management API (CRUD for tasks, with tests). Halfway through, the instructor drops a curveball requirement via Slack: "Tasks now need to support subtasks with a parent-child relationship."

1. Assess impact on current architecture
2. Decide: adapt in place or restructure?
3. Update specs and continue building

**Deliverable**: Working Phase 1 with the curveball integrated. Git log showing how the team adapted.

<!-- > -->

<!-- .slide: data-background="#087CB8" -->
## [**10m**] BREAK

<!-- > -->

# Topic 2: Handling Requirement Changes

<!-- v -->

## Overview/TT II (20 min)

- **Requirement changes: not failures — they're the job**
- **Agent-friendly change management: update the spec, re-run affected gates**
- **Architectural resilience: which choices are brittle vs. resilient**
- **Test safety nets: if tests still pass, the change landed clean**

<!-- v -->

## Activity 2: The Requirements Change Drill (35 min)

**Breakout Rooms (teams of 3)**

Starting from a provided working codebase, apply 3 sequential requirement changes (each delivered 10 minutes apart):

1. Change 1: Add a new field to the data model
2. Change 2: Add role-based access control
3. Change 3: Switch the database from SQLite to PostgreSQL

For each change: update the spec first, then let the agent implement. Track how many tests break and how quickly the agent recovers.

**Deliverable**: Final working codebase with all 3 changes applied. Test results after each change.

<!-- v -->

## Activity 3: Retrospective — What Broke? (15 min)

**Full Class Discussion**

Each team shares: which change was hardest? What architectural decision made it harder or easier? What would you do differently in the design exploration phase?

<!-- > -->

## Wrap Up (5 min)

- **Assignment 1 due next class (Wed, Apr 8)**
- The best architecture is the one that tolerates the changes you didn't predict

<!-- > -->

## Additional Resources

1. [Evolutionary Architecture - ThoughtWorks](https://www.thoughtworks.com/insights/blog/microservices/evolutionary-architecture)
