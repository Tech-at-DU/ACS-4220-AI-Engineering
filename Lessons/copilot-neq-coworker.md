# Copilot ≠ Coworker

## Agenda

- [Learning Objectives](#learning-objectives)
- [Best Practices](#best-practices)
- [Agent-Driven vs. AI-Assisted Development](#agent-driven-vs-ai-assisted-development)
  - [Overview: Agent-Driven vs. AI-Assisted Development](#overview-agent-driven-vs-ai-assisted-development)
- [The Agent Loop and Claude Code Primitives](#the-agent-loop-and-claude-code-primitives)
  - [Overview: The Agent Loop and Claude Code Primitives](#overview-the-agent-loop-and-claude-code-primitives)
- [Break & Wrap Up](#break-wrap-up)
- [After Class Challenges](#after-class-challenges)
  - [Challenge 1: Copilot vs. Claude Code Side-by-Side](#challenge-1-copilot-vs-claude-code-side-by-side)
  - [Challenge 2: Agent Loop Observation Lab](#challenge-2-agent-loop-observation-lab)
  - [Challenge 3: Your First CLAUDE.md](#challenge-3-your-first-claudemd)
- [Additional Resources](#additional-resources)

## Learning Objectives

By the end of this lesson, you will be able to:

1. Spot the difference between autocomplete and autonomous execution and explain why it changes how you work.
1. Trace the full agent loop: prompt → tool call → observe → iterate. Watch code go from thought to working product.
1. Explain why context (what your tools know) matters more than prompts (how you phrase things).
1. Use Claude Code's core primitives: `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, and model selection.

## Best Practices

- **Know the spectrum.** Copilot gives you inline suggestions you accept or reject. Claude Code reads your entire repo and runs multi-step plans on its own. Pick the right tool for the job: autocomplete for quick one-liners, agents when you need something bigger.
- **Context beats prompts.** The context you give tools (`CLAUDE.md`, custom commands, repo structure) matters more than perfect phrasing. A well-informed agent makes good decisions even with a vague instruction. A tool starved for context struggles even with a perfect prompt.
- **Watch the loop.** Agents plan → use tools → observe results → iterate. Learn this cycle so you know when to step in and when to let the agent keep going.
- **Start small.** Your first agent tasks should target one file, one goal. Build trust before handing off bigger work.
- **Match the model to the task.** Haiku for routine stuff, Sonnet for normal features, Opus when you actually need deep reasoning.
- **💼 Use Case.** Use agent mode once a `firstbuild` change crosses file boundaries or needs tests, search, and verification in one pass.
- **🛠️ Pro Tip.** Codex and Claude both get more reliable when repo instructions define scope and success before the agent starts exploring.

**Builds On:** ACS 1220 engineering fundamentals and the first day of repo setup.

**Feeds:** Tutorial 1, Day 2 context work, and the first `firstbuild` repo decisions.

## Agent-Driven vs. AI-Assisted Development

### Overview: Agent-Driven vs. AI-Assisted Development

Start this lesson with the repo open and a tiny task in front of you: add one endpoint, one CLI command, or one test. That concrete assignment move is where students feel the difference between inline help and an agent that can inspect, plan, edit, and verify across the repo.

Think about the difference between a spell-checker and a ghostwriter. A spell-checker watches you type and flags mistakes. You're still doing all the thinking, all the structuring, all the work. The spell-checker just catches your typos. That's what AI-assisted coding tools like GitHub Copilot do. They watch you type and suggest the next line. You're still driving. The AI is riding shotgun, occasionally pointing out a faster route.

Now picture a ghostwriter. You hand them an outline, explain what you want, and walk away. They come back with a draft. They made decisions you didn't explicitly specify. They chose paragraph structure, transitions, examples. They might even push back on your outline if something doesn't flow. That's closer to what agent-driven tools like Claude Code do. You describe the goal. The agent figures out the steps.

**Why the market split.** The split between "AI-assisted" and "agent-driven" development didn't happen overnight. GitHub Copilot launched in June 2021 as a code completion engine built on OpenAI's Codex. It was the first mainstream tool to put AI directly in your editor, and it was genuinely useful for filling in boilerplate. But it had a clear ceiling: it could only suggest code at the cursor position. It couldn't read other files, run tests, or make multi-step decisions.

The agent paradigm emerged from a different lineage. Researchers at places like DeepMind, Stanford, and Anthropic started asking: what if the model could use tools? What if instead of just predicting the next token, it could call functions, read files, run commands, and loop on the results? This idea, called "tool use" or "function calling," shipped in production APIs starting in late 2023. Claude Code helped turn that tool-use pattern into a full terminal-based developer workflow.

**The spectrum matters because the work is different.** AI-assisted tools require you to be a fast, precise driver who can evaluate suggestions quickly. Agent-driven tools require you to be a clear communicator who can specify goals, design context, and evaluate autonomous output. This course focuses on the second skill set, but you need to understand both ends of the spectrum.

**What public case studies show.** Anthropic has publicly shown Claude Code coordinating parallel work on a C compiler, and OpenAI has published examples of Codex handling code review, bug fixing, and test-heavy tasks across internal workflows. The transferable lesson is not a magic percentage of delegated work. It is that agents create leverage when the task is scoped, the repo is legible, and review stays human-owned.

**The mental model shift.** When you use autocomplete, you think in keystrokes: "What's the next line of code?" When you use an agent, you think in outcomes: "What should this function do when it's done?" That shift from keystrokes to outcomes is the single biggest adjustment you'll make in this course. It changes how you plan, how you test, and how you communicate with your tools.

### Claude Code Workflow: Agent-Driven vs. AI-Assisted Development

Run the same small task three ways in class: plain autocomplete, Claude Code, and Codex. Keep the task narrow enough that students can watch the difference in posture instead of drowning in implementation details. A health-check endpoint or CLI converter works well because the output is quick to verify. First, use autocomplete and narrate the micro-decisions you still have to make yourself: which file to open, which imports to add, where to put the test, how to run it. Then switch to Claude Code and ask for the full outcome in one prompt. Let students watch the agent inspect the repo, choose files, run tests, and summarize the result. Finally, show Codex handling the same style of task through an agent run, not as a single next-line suggestion. The point is not "which tool is cooler." The point is that the interface changes the kind of thinking the engineer has to do. Autocomplete rewards local code fluency. Agents reward scoped specs, clear constraints, and good review habits.

### Codex Workflow: Agent-Driven vs. AI-Assisted Development

The OpenAI version of this idea is Codex acting as a coding agent instead of an inline autocomplete engine. In practical terms, you give Codex a task like "inspect this repo, add the endpoint, run tests, and explain the diff," and it works through the repository with tools and a plan. The same mental shift applies: you stop thinking about the next line and start thinking about the execution contract. What files should be in bounds? What counts as success? Which tests or linters should run before the task is considered complete? Students should leave this topic knowing that Claude Code and Codex live on the same side of the spectrum: both are outcome-driven agents. The real engineering question is not "Anthropic or OpenAI?" It is "am I using the tool in assistant mode or operator mode?" That distinction will shape how much leverage they get from any frontier coding system released after this class.

## The Agent Loop and Claude Code Primitives

### Overview: The Agent Loop and Claude Code Primitives

In class, this shows up the moment a student asks for a multi-file change in `firstbuild`. Claude Code and Codex both have to gather context, choose tools, run checks, and explain their work, so the useful question is not which brand they picked. It is which loop the agent is actually running for them.

Every agent-driven tool runs on the same fundamental cycle. Understanding this loop is like understanding how an engine works before you learn to drive. You don't need to rebuild the engine, but you need to know what's happening under the hood so you can diagnose problems when something goes wrong.

**The agent loop, step by step:**

1. **You send a message.** This could be a prompt in the terminal, a description in a `CLAUDE.md` file, or a task delegated from another agent.
1. **The agent builds context.** Before doing anything, Claude Code assembles everything it knows: your system prompt, the current git status (branch, recent commits, working tree), any `CLAUDE.md` files it finds, and the list of tools available to it.
1. **The agent reasons and picks a tool.** Based on context, it decides what to do first. Maybe it needs to read a file to understand the codebase. Maybe it needs to run a command to check test status. It picks a tool and specifies the arguments.
1. **The tool executes.** The tool runs and returns results. A `Read` call returns file contents. A `Bash` call returns command output. A `Grep` call returns matching lines.
1. **The agent observes the result.** It reads the tool output and decides: am I done, or do I need another step?
1. **Repeat.** Steps 3-5 loop until the agent produces a final response with no tool calls. That's when it's "done."

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

- **Haiku** is the intern. Fast, cheap, good for routine tasks like formatting, routine edits, and boilerplate generation. Use it when speed matters more than depth.
- **Sonnet** is the mid-level engineer. Balanced cost and capability. Good for most feature work, debugging, and code review. This is your default.
- **Opus** is the principal engineer. Slower, more expensive, but handles complex architectural decisions, subtle bugs, and multi-file refactors that Sonnet misses. Use it when you need the best reasoning available.

You'll develop intuition for which model fits which task. The general rule: start with Sonnet, drop to Haiku for routine work, escalate to Opus when Sonnet isn't cutting it.

**CLAUDE.md: persistent memory.** The most important file in any Claude Code project is `CLAUDE.md`. It lives at the root of your repo and gets loaded into every session automatically. Think of it as your project's employee handbook: it tells the agent what tech stack you're using, what coding conventions to follow, how to run tests, and any special rules. Without it, the agent starts every session from zero. With it, the agent hits the ground running.

Best practice for `CLAUDE.md`: keep it under 100 lines. Include only what's universally relevant. If the agent needs detailed reference docs, point to them with file paths instead of pasting them inline. Frontier coding agents follow short, prioritized instruction sets more reliably than sprawling ones. Every extra line in `CLAUDE.md` competes with something more important.

### Claude Code Workflow: The Agent Loop and Claude Code Primitives

Open a verbose session and narrate the loop in plain language while the terminal scrolls. Students need to watch the boring parts: file discovery, command execution, retries, and final verification. Pause after each tool call and ask, "Was that step necessary?" That question trains judgment faster than any slogan about agentic systems. Then show how the same loop appears in Codex: the agent still has to gather context, decide whether to ask for approval, edit files, and justify its final answer. The surface controls differ, but the loop is the same. This is also the right place to point out that persistent project instructions matter more than clever phrasing. A clean `CLAUDE.md` or `AGENTS.md` turns a wandering agent into a predictable one because it reduces search cost and narrows the space of acceptable actions.

### Codex Workflow: The Agent Loop and Claude Code Primitives

Codex uses the same core ideas with different control surfaces. In this repo, students can already see the pattern: a project-level `AGENTS.md`, tool access rules, planning, approvals, and model selection. That is the Codex equivalent of persistent agent context. If you want Codex to behave like a reliable teammate, you do the same engineering work you would do for Claude Code: define scope, encode repo rules, tell it how to verify, and keep the instructions short enough that the important parts stay salient. This is a strong place to teach transfer rather than vendor loyalty. Claude Code names the persistent file `CLAUDE.md`. Codex leans on `AGENTS.md` and tool configuration. Different nouns. Same systems thinking. Students who understand that pattern will adapt faster than students who memorize one vendor's syntax.

## Break & Wrap Up

**🔥 Key takeaway:** Context design is the core skill. Not prompting, not asking nicely. Designing what your tools know so they can make good decisions without you micromanaging every step.

**🧩 Before next class:** Have Claude Code installed, your API key configured, and a `CLAUDE.md` committed to a repo. You'll need all three for Day 2.

### Pro Tip: Put the Operating Contract in Version Control

The fastest way to waste money with agents is to keep re-explaining the job. Put the operating contract in files that ship with the repo: project instructions, test commands, naming conventions, and safety rules. That advice got louder after the March 31, 2026 Claude Code packaging incident because it reminded everyone that build artifacts and config files are not side details. They are part of the product. Treat them with the same code review discipline as application code. 📦

### Fun Fact: Debug Assets Are Real Assets

Source maps feel like temporary debug helpers until they leave your laptop. Then they become a roadmap to how your product is actually built. That public Claude Code source-map mistake landed because a debugging artifact crossed a release boundary. It is a fun story on the internet, but it is an even better engineering lesson for students: if a file ships, it is production material whether you intended it or not. 🧠

### Debrief Questions

Ask the room three closing questions before you move on. When does autocomplete feel faster than an agent? When does an agent become worth the setup cost? And what repo instructions would make tomorrow's session cheaper than today's? Those questions turn the lesson from tool fandom into engineering judgment, which is the habit you actually want students to build.

## After Class Challenges

### Challenge 1: Copilot vs. Claude Code Side-by-Side

Build a `GET /health` endpoint that returns JSON status. Do it twice:

1. **Round 1**: Use only inline autocomplete/suggestions (Copilot-style). Count how many manual steps you perform.
1. **Round 2**: Describe the same task to Claude Code in a single prompt. Watch the agent loop. How many tools does it use? How many steps does it take autonomously?

Write up a brief comparison: what was faster? What was more predictable? Where did each approach struggle?

### Challenge 2: Agent Loop Observation Lab

Give Claude Code a multi-file task: "Create a Python CLI tool with `click` that converts CSV to JSON, with unit tests." Document:

1. Every tool call the agent makes (`Read`, `Write`, `Bash`, etc.)
1. When and why it spawns subagents
1. How it recovers from errors (wrong file path, failing test, etc.)

Create a shared doc listing the tool calls in order, annotated with why each step happened. This builds your intuition for how the loop works in practice.

### Challenge 3: Your First CLAUDE.md

Create a `CLAUDE.md` file for a personal project repo (or a fresh repo). Include: project description, tech stack, coding conventions, testing expectations, and one custom rule. Push it and verify Claude Code reads it on the next invocation. This is the first artifact that trains your personal Claude Code to understand your work.

## Additional Resources

### Source Notes

Start with the official docs and current model pages first. The remaining links add historical context, canonical books, or supporting examples.

1. [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code): Official reference for everything covered today.
1. [How Claude Code Works](https://code.claude.com/docs/en/how-claude-code-works): Deep dive into the agent loop architecture.
1. [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices): Anthropic's official recommendations for CLAUDE.md and workflow design.
1. [Building a C Compiler with Parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler): Anthropic's case study on 16 parallel agents building 100,000+ lines of code.
1. [How OpenAI Uses Codex](https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf): Official examples of Codex handling coding work across OpenAI teams.
1. [Claude Code Source Leak Scrutiny](https://www.axios.com/2026/04/02/gottheimer-anthropic-source-code-leaks): Public reporting on the March 31, 2026 release incident and the follow-on questions it raised.
1. [Source Map](https://developer.mozilla.org/en-US/docs/Glossary/Source_map): MDN's explanation of how source maps can reconstruct original code during debugging.
