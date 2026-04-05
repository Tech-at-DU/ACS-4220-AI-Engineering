# Copilot ≠ Coworker

## Learning Objectives

By the end of this lesson, you will be able to:

1. Spot the difference between autocomplete and autonomous execution and explain why it changes how you work.
2. Trace the full agent loop: prompt → tool call → observe → iterate. Watch code go from thought to working product.
3. Explain why context (what your tools know) matters more than prompts (how you phrase things).
4. Use Claude Code's core primitives: `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, and model selection.

## Best Practices

- **Know the spectrum.** Copilot gives you inline suggestions you accept or reject. Claude Code reads your entire repo and runs multi-step plans on its own. Pick the right tool for the job: autocomplete for quick one-liners, agents when you need something bigger.
- **Context beats prompts.** The context you give tools (`CLAUDE.md`, custom commands, repo structure) matters more than perfect phrasing. A well-informed agent makes good decisions even with a vague instruction. A tool starved for context struggles even with a perfect prompt.
- **Watch the loop.** Agents plan → use tools → observe results → iterate. Learn this cycle so you know when to step in and when to let the agent keep going.
- **Start small.** Your first agent tasks should target one file, one goal. Build trust before handing off bigger work.
- **Match the model to the task.** Haiku for routine stuff, Sonnet for normal features, Opus when you actually need deep reasoning.

# Topic 1: Agent-Driven vs. AI-Assisted Development

## Overview

Think about the difference between a spell-checker and a ghostwriter. A spell-checker watches you type and flags mistakes. You're still doing all the thinking, all the structuring, all the work. The spell-checker just catches your typos. That's what AI-assisted coding tools like GitHub Copilot do. They watch you type and suggest the next line. You're still driving. The AI is riding shotgun, occasionally pointing out a faster route.

Now picture a ghostwriter. You hand them an outline, explain what you want, and walk away. They come back with a draft. They made decisions you didn't explicitly specify. They chose paragraph structure, transitions, examples. They might even push back on your outline if something doesn't flow. That's closer to what agent-driven tools like Claude Code do. You describe the goal. The agent figures out the steps.

**Where this came from.** The split between "AI-assisted" and "agent-driven" development didn't happen overnight. GitHub Copilot launched in June 2021 as a code completion engine built on OpenAI's Codex. It was the first mainstream tool to put AI directly in your editor, and it was genuinely useful for filling in boilerplate. But it had a clear ceiling: it could only suggest code at the cursor position. It couldn't read other files, run tests, or make multi-step decisions.

The agent paradigm emerged from a different lineage. Researchers at places like DeepMind, Stanford, and Anthropic started asking: what if the model could use tools? What if instead of just predicting the next token, it could call functions, read files, run commands, and loop on the results? This idea, called "tool use" or "function calling," shipped in production APIs starting in late 2023. Claude Code (released in early 2025) was one of the first tools to take this idea and build a full developer workflow around it.

**The spectrum matters because job postings care.** Look at AI engineering roles in 2026. They distinguish between "experience with AI-assisted coding tools" and "experience building agentic workflows." These are different skills. AI-assisted tools require you to be a fast, precise driver who can evaluate suggestions quickly. Agent-driven tools require you to be a clear communicator who can specify goals, design context, and evaluate autonomous output. This course focuses on the second skill set, but you need to understand both ends of the spectrum.

**Real-world examples.** Stripe uses Claude Code internally for migrating API endpoints between service versions. A developer describes the migration rules, the agent reads the old endpoint, writes the new one, generates tests, and opens a PR. Shopify reported that agent-driven workflows handle about 30% of their frontend component generation. At Anthropic itself, the team that built Claude Code used Claude Code to build Claude Code (yes, recursively) with 16 parallel agents compiling 100,000+ lines of C compiler code.

**The mental model shift.** When you use autocomplete, you think in keystrokes: "What's the next line of code?" When you use an agent, you think in outcomes: "What should this function do when it's done?" That shift from keystrokes to outcomes is the single biggest adjustment you'll make in this course. It changes how you plan, how you test, and how you communicate with your tools.

# Topic 2: The Agent Loop and Claude Code Primitives

## Overview

Every agent-driven tool runs on the same fundamental cycle. Understanding this loop is like understanding how an engine works before you learn to drive. You don't need to rebuild the engine, but you need to know what's happening under the hood so you can diagnose problems when something goes wrong.

**The agent loop, step by step:**

1. **You send a message.** This could be a prompt in the terminal, a description in a `CLAUDE.md` file, or a task delegated from another agent.
2. **The agent builds context.** Before doing anything, Claude Code assembles everything it knows: your system prompt, the current git status (branch, recent commits, working tree), any `CLAUDE.md` files it finds, and the list of tools available to it.
3. **The agent reasons and picks a tool.** Based on context, it decides what to do first. Maybe it needs to read a file to understand the codebase. Maybe it needs to run a command to check test status. It picks a tool and specifies the arguments.
4. **The tool executes.** The tool runs and returns results. A `Read` call returns file contents. A `Bash` call returns command output. A `Grep` call returns matching lines.
5. **The agent observes the result.** It reads the tool output and decides: am I done, or do I need another step?
6. **Repeat.** Steps 3-5 loop until the agent produces a final response with no tool calls. That's when it's "done."

This is called a "tool calling loop" or "agentic loop." It's the same pattern whether you're using Claude Code, OpenAI's Codex agent, or any other tool-using AI system. The specifics differ, but the loop is universal.

**An analogy that sticks.** Think of a contractor renovating your kitchen. You don't hand them a hammer and say "swing." You say "I want an island with a butcher block top and outlets on both sides." The contractor looks at the space (reads context), decides to start with electrical (picks a tool), runs the wiring (executes), checks the building code (observes), then moves to framing (next loop). If the inspection fails, they don't give up. They fix the issue and loop again. Claude Code works the same way. You specify the outcome. It figures out the sequence.

**Claude Code's toolbox.** Here are the primitives the agent uses during every loop:

| Tool | What It Does | When the Agent Uses It |
|------|-------------|----------------------|
| `Read` | Reads a file's contents | Understanding existing code before making changes |
| `Write` | Creates a new file from scratch | Generating new files (tests, configs, modules) |
| `Edit` | Makes targeted changes to existing files | Modifying specific lines without rewriting the whole file |
| `Bash` | Runs shell commands | Installing dependencies, running tests, checking git status |
| `Glob` | Finds files by pattern | Locating all `*.test.js` files or finding config files |
| `Grep` | Searches file contents | Finding where a function is called, locating TODOs |
| `Task` | Spawns a subagent | Delegating a subtask to keep the main context clean |

**Model selection matters.** Claude Code can use different models for different tasks. Think of it like hiring for different roles:

- **Haiku** is the intern. Fast, cheap, good for routine tasks like formatting, simple edits, and boilerplate generation. Use it when speed matters more than depth.
- **Sonnet** is the mid-level engineer. Balanced cost and capability. Good for most feature work, debugging, and code review. This is your default.
- **Opus** is the principal engineer. Slower, more expensive, but handles complex architectural decisions, subtle bugs, and multi-file refactors that Sonnet misses. Use it when you need the best reasoning available.

You'll develop intuition for which model fits which task. The general rule: start with Sonnet, drop to Haiku for simple stuff, escalate to Opus when Sonnet isn't cutting it.

**CLAUDE.md: persistent memory.** The most important file in any Claude Code project is `CLAUDE.md`. It lives at the root of your repo and gets loaded into every session automatically. Think of it as your project's employee handbook: it tells the agent what tech stack you're using, what coding conventions to follow, how to run tests, and any special rules. Without it, the agent starts every session from zero. With it, the agent hits the ground running.

Best practice for `CLAUDE.md`: keep it under 100 lines. Include only what's universally relevant. If the agent needs detailed reference docs, point to them with file paths instead of pasting them inline. The reason? Claude Code's system prompt already uses about 50 of the ~150-200 instructions the model can reliably follow. Every line in your `CLAUDE.md` competes for that attention budget.

## Break & Wrap Up

**Key takeaway:** Context design is the core skill. Not prompting, not asking nicely. Designing what your tools know so they can make good decisions without you micromanaging every step.

**Before next class:** Have Claude Code installed, your API key configured, and a `CLAUDE.md` committed to a repo. You'll need all three for Day 2.

## After Class Challenges

### Challenge 1: Copilot vs. Claude Code Side-by-Side

Build a `GET /health` endpoint that returns JSON status. Do it twice:

1. **Round 1**: Use only inline autocomplete/suggestions (Copilot-style). Count how many manual steps you perform.
2. **Round 2**: Describe the same task to Claude Code in a single prompt. Watch the agent loop. How many tools does it use? How many steps does it take autonomously?

Write up a brief comparison: what was faster? What was more predictable? Where did each approach struggle?

### Challenge 2: Agent Loop Observation Lab

Give Claude Code a multi-file task: "Create a Python CLI tool with `click` that converts CSV to JSON, with unit tests." Document:

1. Every tool call the agent makes (`Read`, `Write`, `Bash`, etc.)
2. When and why it spawns subagents
3. How it recovers from errors (wrong file path, failing test, etc.)

Create a shared doc listing the tool calls in order, annotated with why each step happened. This builds your intuition for how the loop works in practice.

### Challenge 3: Your First CLAUDE.md

Create a `CLAUDE.md` file for a personal project repo (or a fresh repo). Include: project description, tech stack, coding conventions, testing expectations, and one custom rule. Push it and verify Claude Code reads it on the next invocation. This is the first artifact that trains your personal Claude Code to understand your work.

## Additional Resources

1. [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code): Official reference for everything covered today.
2. [How Claude Code Works](https://code.claude.com/docs/en/how-claude-code-works): Deep dive into the agent loop architecture.
3. [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices): Anthropic's official recommendations for CLAUDE.md and workflow design.
4. [Building a C Compiler with Parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler): Anthropic's case study on 16 parallel agents building 100,000+ lines of code.
