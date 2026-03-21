<!-- .slide: data-background="./Images/header.svg" data-background-repeat="none" data-background-size="40% 40%" data-background-position="center 10%" class="header" -->
# One Config to Rule Them All

<!-- > -->

## Minute-by-Minute

| **Elapsed** | **Time** | **Activity** |
|:-----------:|:--------:|:-------------|
| 0:00 | 0:05 | Objectives |
| 0:05 | 0:25 | Overview: Team-Scale agent-driven Workflows |
| 0:30 | 0:35 | Activity 1: Team Config Design Sprint |
| 1:05 | 0:10 | BREAK |
| 1:15 | 0:20 | Onboarding & Adoption Strategy |
| 1:35 | 0:30 | Activity 2: New Dev Onboarding Simulation |
| 2:05 | 0:20 | Activity 3: Agent Rules as Code Review |
| 2:25 | 0:05 | Wrap Up |
| TOTAL | 2:30 | - |

<!-- > -->

## Learning Objectives (5 min)

By the end of this lesson, you will be able to:

1. Design shared instruction sets that every agent on your team reads on startup — conventions, decisions, pitfalls — so consistency happens automatically
1. Encode your team's standards as rules the agent enforces — testing patterns, file structure, API design — eliminating review cycles on the same issues
1. Onboard new developers in hours instead of weeks — the agent already knows your codebase, your patterns, your tools — they just start shipping
1. Architect when to standardize team-wide vs. when to keep things local — knowing the difference between "everyone needs this" and "only backend needs this"

<!-- > -->

## Best Practices

Here's what works:

- **Build shared CLAUDE.md as your knowledge base**: Document architecture decisions, tech choices, deployment patterns, gotchas. Every agent reads this on startup. Every new dev too.
- **Lock down security in shared rules**: Use team-level AGENTS.md for the non-negotiables: how you do auth, validation, secrets. These are guard rails everyone hits.
- **Split global from local**: Top-level CLAUDE.md for "how we build." Subdirectory AGENTS.md (src/backend/, src/frontend/) for domain-specific stuff. Keeps rule clutter down.
- **Onboarding gets faster**: Clone repo. Agent already knows your codebase, patterns, tools. New dev starts shipping in days, not weeks.
- **Treat config like code**: Review rules in PRs. Document. Iterate as you learn. It's infrastructure—not an afterthought.

<!-- > -->

# Topic 1: Team-Scale agent-driven Workflows

<!-- v -->

## Overview/TT I (25 min)

- **From individual to team**: shared CLAUDE.md, shared commands, shared MCP config
- **Agent rules as team standards**: enforcing conventions automatically
- **Repository-level vs. organization-level configuration**
- **Version-controlling agent configuration alongside code**
- **The "team agent knowledge base"**: what every agent on the team should know

<!-- v -->

## Activity 1: Team Config Design Sprint (35 min)

**Breakout Rooms (teams of 4–5)**

Design the complete agent configuration for a fictional 5-person startup team:

1. Write a shared CLAUDE.md with team conventions, architecture decisions, and workflow rules
2. Create 3 shared custom commands the whole team would use
3. Define scoped AGENTS.md files for frontend, backend, and infrastructure directories
4. Document what should be shared vs. what should be individual

**Deliverable**: Complete team configuration package (CLAUDE.md, AGENTS.md files, custom commands) in a repo.

<!-- > -->

<!-- .slide: data-background="#087CB8" -->
## [**10m**] BREAK

<!-- > -->

# Topic 2: Onboarding & Adoption

<!-- v -->

## Overview/TT II (20 min)

- **Onboarding with agents: new developer → clone repo → agent already knows the codebase**
- **The onboarding workflow: explore → ask questions → make first PR — all agent-assisted**
- **Adoption strategy: start with power users, measure impact, expand gradually**
- **Common adoption failures: over-configuration, under-documentation, inconsistent usage**

<!-- v -->

## Activity 2: New Dev Onboarding Simulation (30 min)

**Breakout Rooms (teams of 3)**

One team member plays the "new developer" who has never seen the codebase. Using only the team configuration from Activity 1:

1. The "new dev" clones the repo and uses Claude Code to understand the project
2. They ask 5 questions a real new hire would ask
3. They attempt to make a small change using the team workflow
4. Evaluate: how effective was the agent configuration for onboarding?

**Deliverable**: Onboarding experience log with quality ratings and improvement suggestions.

<!-- v -->

## Activity 3: Agent Rules as Code Review (20 min)

**Pairs**

Trade your team configuration with another team. Review their agent rules as if you were reviewing a PR:

1. Are the rules clear and unambiguous?
2. Do any rules conflict with each other?
3. Are there gaps where important conventions aren't covered?
4. Would a new agent (or developer) be confused by anything?

**Deliverable**: Written code review with specific feedback on the other team's agent rules.

<!-- > -->

## Wrap Up (5 min)

- Agent configuration is team infrastructure — treat it with the same care as CI/CD
- **Assignment 3 due next class (Wed, Apr 29)**
- Start working on final project proposals

<!-- > -->

## Additional Resources

1. [Team Conventions in Claude Code](https://docs.anthropic.com/en/docs/claude-code)
