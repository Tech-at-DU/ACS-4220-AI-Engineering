<!-- .slide: data-background="./Images/header.svg" data-background-repeat="none" data-background-size="40% 40%" data-background-position="center 10%" class="header" -->
# Memory Is Everything

<!-- > -->

## Minute-by-Minute

| **Elapsed** | **Time** | **Activity** |
|:-----------:|:--------:|:-------------|
| 0:00 | 0:05 | Objectives |
| 0:05 | 0:25 | Overview: context design |
| 0:30 | 0:35 | Activity 1: Context Window Experiment |
| 1:05 | 0:10 | BREAK |
| 1:15 | 0:20 | Commands, Skills, Plugins, MCP |
| 1:35 | 0:30 | Activity 2: Custom Commands |
| 2:05 | 0:20 | Activity 3: Parallel Agents with Worktrees |
| 2:25 | 0:05 | Wrap Up |
| TOTAL | 2:30 | - |

<!-- > -->

## Learning Objectives (5 min)

By the end of this lesson, you will be able to:

1. Stop rewriting prompts and build your project's instruction library — one unified source of truth the agent always reads
1. Write custom commands your whole team will use — reusable workflows that talk directly to how your project works
1. Connect live documentation, external services, and your own tools — expanding what your agents can see and do
1. Run multiple agents simultaneously on isolated branches — no stepping on each other, full parallelism without chaos

<!-- > -->

## Best Practices

Here's what works:

- **CLAUDE.md is your playbook**: Put your project description, tech stack, conventions, and review checklist in `CLAUDE.md` at repo root. Every agent reads it automatically—you write it once, not for every prompt.
- **Custom commands for team workflows**: Create slash commands (`/review`, `/test-plan`, `/deploy`) as markdown templates in `.claude/commands/`. They live in git. Your whole team uses them.
- **Good context beats fancy prompts**: Invest a few minutes in clear project context. This matters more than perfect wording.
- **File-specific rules**: Create rules in `CLAUDE.md` for specific file types (like `*.ts` or `*.py`). This keeps your instructions organized and helps agents know which rules apply where.
- **AGENTS.md for subdirectories**: Different parts of your codebase need different guidance? Create `AGENTS.md` files in those subdirectories. Agents read the most specific file for where they are.

<!-- > -->

# Topic 1: context design

<!-- v -->

## Overview/TT I (25 min)

- **Context window as a finite resource: each model has limits on how much info it can process at once**
- **What goes in the window: system prompt, CLAUDE.md, conversation history, tool results**
- **Specialized agent delegation: breaking big tasks into smaller focused agents to keep the main context clean**
- **AGENTS.md for directory-specific instructions**
- **The difference between prompt engineering and context design: how you word your request vs. what information is available**

<!-- v -->

## Activity 1: Context Window Experiment (35 min)

**Breakout Rooms (teams of 3)**

Run the same complex task (e.g., "refactor this module to use dependency injection") with three different context setups:

1. **No CLAUDE.md** — bare repo, no instructions
2. **Minimal CLAUDE.md** — just tech stack and conventions
3. **Rich CLAUDE.md + AGENTS.md** — detailed project context, architecture notes, testing expectations

Compare the quality and accuracy of output across all three. Document specific differences.

**Deliverable**: Side-by-side comparison showing how context quality changed the agent's behavior.

<!-- > -->

<!-- .slide: data-background="#087CB8" -->
## [**10m**] BREAK

<!-- > -->

# Topic 2: Commands, Skills, Plugins, MCP

<!-- v -->

## Overview/TT II (20 min)

- **Custom slash commands: Creating `.claude/commands/` with markdown templates**
- **Skills and plugins: Extending Claude Code's capabilities**
- **MCP (Model Context Protocol): Connecting agents to external tools and data sources**
- **Parallel agent execution: `git worktrees` for isolated concurrent tasks**

<!-- v -->

## Activity 2: Build a Custom Command (30 min)

**Breakout Rooms (teams of 3)**

Create a custom slash command for your team's workflow. Ideas: `/review` that runs a code review checklist, `/test-plan` that generates a test plan for a given file, or `/doc` that generates documentation for a module.

1. Create the command markdown file in `.claude/commands/`
2. Test it on real code in your repo
3. Iterate on the prompt template based on output quality

**Deliverable**: Working custom command, committed to the repo.

<!-- v -->

## Activity 3: Parallel Agents with Git Worktrees (20 min)

**Pairs**

Set up a git worktree and run two Claude Code agents simultaneously on different tasks in the same repo (e.g., one writing tests, one writing docs). Observe how they work independently without conflicts.

**Deliverable**: Screenshot or terminal output showing both agents working in parallel.

<!-- > -->

## Wrap Up (5 min)

- context design is the #1 skill — everything else flows from it
- For next class: bring a project idea for the workflow walkthrough
- Read: MCP specification overview

<!-- > -->

## Additional Resources

1. [Model Context Protocol Specification](https://modelcontextprotocol.io)
1. [Claude Code Custom Commands](https://docs.anthropic.com/en/docs/claude-code)
