<!-- .slide: data-background="./Images/header.svg" data-background-repeat="none" data-background-size="40% 40%" data-background-position="center 10%" class="header" -->
# Copilot ≠ Coworker

<!-- > -->

## Minute-by-Minute

| **Elapsed** | **Time** | **Activity** |
|:-----------:|:--------:|:-------------|
| 0:00 | 0:10 | Objectives & Setup Check |
| 0:10 | 0:25 | Overview: agent-driven vs. AI-assisted |
| 0:35 | 0:30 | Activity 1: Copilot vs. Claude Code |
| 1:05 | 0:10 | BREAK |
| 1:15 | 0:25 | The execution cycle & Tool Use |
| 1:40 | 0:35 | Activity 2: execution cycle Observation |
| 2:15 | 0:10 | Activity 3: First CLAUDE.md |
| 2:25 | 0:05 | Wrap Up |
| TOTAL | 2:30 | - |

<!-- > -->

## Why You Should Know This (5 min)

Every AI engineering job posting in 2026 distinguishes between AI-assisted coding (autocomplete, inline suggestions) and agent-driven coding (autonomous multi-step execution). You need to know the difference, articulate it in interviews, and operate fluently in both modes.

<!-- > -->

## Learning Objectives (5 min)

By the end of this lesson, you will be able to:

1. Spot the difference between autocomplete and autonomous execution — and why it matters for every task you ship
1. Trace the full loop: plan, execute, verify, iterate — watching code go from thought to working product
1. Understand that what your tools know (context) matters more than how you phrase things (prompts)
1. Delegate your first real task to an agent and see it close autonomously

<!-- > -->

## Best Practices

Here's what actually works:

- **Know the spectrum**: Copilot gives you inline suggestions you copy-paste. Claude Code reads your entire repo and runs multi-step plans on its own. Pick the right tool — autocomplete for quick fixes, agents when you need something bigger.
- **Context beats prompts**: The context you give tools (CLAUDE.md, custom commands, repo structure) matters more than perfect wording. A well-informed agent makes good calls even with vague instructions. A tool starved for context struggles even with perfect phrasing.
- **Watch the loop**: Agents plan → use tools → see what happened → iterate. Know this cycle so you recognize when to step in and when to let them keep going.
- **Start small**: First agent tasks get one file, one goal. Once you trust it, hand off bigger work.
- **Match the model to the task**: Haiku for routine stuff, Sonnet for normal features, Opus when you actually need the firepower.

<!-- > -->

## Initial Exercise (10 min)

**Environment check**: Verify everyone has Claude Code installed, API keys configured, and can run `claude` from the terminal. Troubleshoot together.

<!-- > -->

# Topic 1: agent-driven vs. AI-assisted

<!-- v -->

## Overview/TT I (25 min)

- **The spectrum from autocomplete → copilot → agent** (and what each means)
- **AI-assisted: human drives, AI suggests** (Copilot, Cursor tab-complete)
- **agent-driven: human specifies, AI executes multi-step plans autonomously**
- **context design as the core skill** — why "prompt engineering" undersells it
- **The execution cycle: how agents work step-by-step** (plan → select tool → execute → observe → iterate)
- **specialized agent delegation**: keeping context windows clean

<!-- v -->

## Activity 1: Copilot vs. Claude Code Side-by-Side (30 min)

**Breakout Rooms (teams of 3)**

Build a simple REST endpoint (e.g., `GET /health` that returns JSON status). Do it twice:

1. **Round 1**: Use only inline autocomplete/suggestions (Copilot-style). Note how many manual steps you perform.
2. **Round 2**: Describe the same task to Claude Code in a single prompt. Observe the execution cycle — how many tools does it use? How many steps does it take autonomously?

**Deliverable**: Each team shares a brief comparison — what was faster? What was more predictable? Where did each approach struggle?

<!-- > -->

<!-- .slide: data-background="#087CB8" -->
## [**10m**] BREAK

<!-- > -->

# Topic 2: Claude Code Primitives

<!-- v -->

## Overview/TT II (25 min)

- **Tool use**: `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`
- **Model selection**: Haiku (fast/cheap) → Sonnet (balanced) → Opus (complex reasoning)
- **CLAUDE.md as persistent project instructions**
- **Specialized agent spawning with the Task tool**
- **Parallel execution with git worktrees**

<!-- v -->

## Activity 2: execution cycle Observation Lab (35 min)

**Breakout Rooms (teams of 3)**

Give Claude Code a multi-file task: "Create a Python CLI tool with `click` that converts CSV to JSON, with unit tests." Watch it work and document:

1. Every tool call the agent makes (Read, Write, Bash, etc.)
2. When and why it spawns specialized agents
3. How it recovers from errors (wrong file path, failing test, etc.)

**Deliverable**: A shared doc listing the tool calls in order, annotated with why each step happened.

<!-- v -->

## Activity 3: Your First CLAUDE.md (10 min)

**Solo / Pairs**

Create a CLAUDE.md file for a personal project repo (or a fresh repo). Include at least: project description, tech stack, coding conventions, and one custom rule. Push it and verify Claude Code reads it on the next invocation.

<!-- > -->

## Wrap Up (5 min)

- Key takeaway: context design > prompt engineering
- For next class: have Claude Code working, CLAUDE.md committed to a repo
- Read: Claude Code docs on tools and commands

<!-- > -->

## Additional Resources

1. [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
1. [Anthropic's Guide to context design](https://www.anthropic.com/engineering/claude-code-best-practices)
