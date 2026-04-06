# What Do You Even Do All Day?

## Agenda

- [Learning Objectives](#learning-objectives)
- [Best Practices](#best-practices)
- [Agent Observability](#agent-observability)
  - [Overview: Agent Observability](#overview-agent-observability)
- [Cost Management and Optimization](#cost-management-and-optimization)
  - [Overview: Cost Management and Optimization](#overview-cost-management-and-optimization)
- [Break & Wrap Up](#break-wrap-up)
- [After Class Challenges](#after-class-challenges)
  - [Challenge 1: Session Audit](#challenge-1-session-audit)
  - [Challenge 2: Model Selection Experiment](#challenge-2-model-selection-experiment)
  - [Challenge 3: Cost Optimization Sprint](#challenge-3-cost-optimization-sprint)
- [Additional Resources](#additional-resources)

## Learning Objectives

By the end of this lesson, you will be able to:

1. Monitor what an AI agent does during a session: tool calls, token usage, model selection, and decision points.
1. Calculate the cost of an agent session and identify where tokens are being spent.
1. Choose the right model (Haiku, Sonnet, Opus) for different task types based on cost/quality tradeoffs.
1. Set up a budget-aware workflow that prevents runaway costs.

## Best Practices

- **Watch before you optimize.** You can't reduce costs you don't understand. Run a few sessions with verbose logging before changing anything.
- **Haiku is your default for routine work.** File reads, routine edits, formatting, boilerplate generation. Save Sonnet and Opus for tasks that actually need them.
- **Set spending limits.** Configure a max budget per session or per day. One runaway premium-model loop can burn through real budget before you notice.
- **Track token usage per task type.** Know what your common workflows cost. "Running tests" might be cheap. "Full codebase review" might be expensive.
- **Subagents on Haiku, orchestrator on Sonnet.** When running parallel agents, the subagents doing focused work can use the cheaper model. The main session doing decomposition and synthesis uses the smarter model.
- **Cache what you can.** If the agent reads the same files every session, consider putting summaries in CLAUDE.md instead of making it re-read them.
- **💼 Use Case.** Compare one `firstbuild` session and one `makeanything` session to see how task size changes token patterns, tool calls, and model choice.
- **🛠️ Pro Tip.** Codex facts: Codex-optimized and smaller coding models reward the same habit as Claude tiers: classify the work before paying for deeper reasoning.

**Builds On:** Day 9 MCP workflows and earlier lessons on verification and scope.

**Feeds:** model-budget decisions for `wiredup`, Tutorial 3, and `makeanything`.

## Agent Observability

### Overview: Agent Observability

Start with one actual student run from `firstbuild` or `wiredup` and ask why it cost what it cost. Observability matters because the session trace explains whether the agent was efficient, confused, or underspecified.

Think about package tracking for something expensive. You do not just click buy and hope it appears. You watch the scan history, the handoffs, the delays, and the delivery proof because each checkpoint tells you whether the system is working or drifting.

AI agents deserve the same scrutiny. They are doing real work on your behalf: reading files, writing code, running commands, making decisions. If you do not observe that path, you cannot improve the process, debug failures, or control costs.

**What "observability" means for AI agents.** In traditional software engineering, observability is the ability to understand a system's internal state by examining its outputs. For a web server, that means logs, metrics, and traces. For an AI agent, it means:

- **Tool call logs**: What tools did the agent use, in what order, with what arguments?
- **Token usage**: How many input and output tokens were consumed? Which model processed them?
- **Decision traces**: Why did the agent choose to read file A before file B? Why did it spawn a subagent?
- **Error recovery**: When something failed, how did the agent respond? Did it retry? Did it try a different approach?

**Where observability came from.** The concept has roots in control theory (1960s) and was popularized in software engineering by Charity Majors and the Honeycomb team around 2017. The key insight: monitoring tells you whether something is broken, but observability tells you why. In the AI agent context, this means going beyond "the task succeeded" to "here's exactly how the agent accomplished it."

**How to observe Claude Code sessions.** Claude Code provides several observability mechanisms:

**Verbose mode.** Run Claude Code with `--verbose` or set the environment variable `CLAUDE_VERBOSE=1`. This prints every tool call, every tool result, and every model response to your terminal. It's noisy but comprehensive:

```bash
$ claude --verbose "Add a health check endpoint to the API"
```

You'll see output like:
```
[Tool: Glob] pattern="src/**/*.py" → 12 files
[Tool: Read] file="src/api/routes.py" → 145 lines
[Tool: Read] file="src/api/middleware.py" → 89 lines
[Model: Sonnet] Deciding to add endpoint to routes.py...
[Tool: Edit] file="src/api/routes.py" → added lines 47-58
[Tool: Bash] command="python -m pytest tests/" → 23 passed, 0 failed
```

This trace tells you exactly what happened. You can see the agent's exploration strategy, the files it chose to read, the edit it made, and the verification step.

**Token tracking.** Every Claude Code session reports token usage at the end. Pay attention to these numbers:

- **Input tokens**: What the agent read (files, tool results, system prompts). This is where costs add up in large codebases.
- **Output tokens**: What the agent generated (code, tool calls, responses). Usually smaller than input.
- **Cache hits**: Tokens that were served from cache instead of being reprocessed. More cache hits = lower costs.

**Session summaries.** After a session ends, review the summary. It tells you: total tokens used, total cost, number of tool calls, and the final result. Over time, these summaries build a dataset of how your workflows perform.

**Why observability matters for learning.** You're building mental models of how agents work. Observability accelerates that process. When you see that the agent read 15 files before making a one-line edit, you learn that your codebase needs better context (maybe a CLAUDE.md that points to the right file). When you see the agent retry a failing test 4 times with the same approach, you learn that it's stuck and needs a different prompt.

**The "what did you do today?" standup.** Here's a practical ritual: at the end of each coding session with Claude Code, review the session log. Ask yourself:

1. Did the agent take the most efficient path?
1. Were there unnecessary file reads? (Context engineering opportunity)
1. Did it recover from errors gracefully?
1. Where did it spend the most tokens? (Cost optimization opportunity)

This five-minute review compounds. After a week, you'll have a much clearer picture of how to improve your workflows.

**🏫 What This Looks Like in Class.** This is one of the easiest habits to bolt onto `firstbuild` and `wiredup` because the sessions are small enough to inspect but large enough to reveal patterns. Students can actually see whether the agent is wandering, rereading, or over-using an expensive model instead of guessing about efficiency from memory.

### Claude Code Workflow: Agent Observability

Run one medium-sized task with verbose logging turned on and treat the session log like an observability trace, not like a wall of text. Pause at each major decision point and ask what signal the student should care about: unnecessary reads, repeated retries, expensive model choices, or missing verification. Then rerun the same task after tightening the scope and improving the context. Students need to see that observability is actionable. It is not a dashboard vanity metric. It is the raw material that tells you whether the agent wandered, looped, or took the shortest path. This is also the right place to normalize post-run review. Professional engineers do not stop at "it worked." They ask how the work happened and whether the path was worth the cost.

### Codex Workflow: Agent Observability

Codex users need the same observability habit, even if the logs and controls look different. Cloud tasks, local shell sessions, reasoning effort, approvals, and final summaries all leave clues about how the work was done and whether the agent stayed inside the intended lane. Students should learn to audit those traces the way they would audit a CI job or a production incident. Did the agent read far more files than necessary? Did it escalate to a heavier model for a routine task? Did it end with evidence or with confidence alone? That is the transferable skill. Claude Code, Codex, and any future coding agent become cheaper and more reliable when engineers review traces instead of treating the run as magic.

## Cost Management and Optimization

### Overview: Cost Management and Optimization

Students with above-average engineering instincts usually want the rate card only after they see a real workflow. Put one actual task on the board, then budget it across Claude Code and Codex options.

AI agents cost money. Every token processed, every model invocation, every tool call has a price. For individual developers, costs are manageable (a few dollars per day on Pro). For teams, they can add up quickly. Understanding the cost model and optimizing your usage is a practical skill that matters in any professional setting.

**The pricing landscape (April 2026).** Anthropic's public Claude pricing and model pages list the following student-relevant options:

| Plan | Monthly Cost | Claude Code Access | Best For |
|---|---|---|---|
| **Pro** | $20 | Yes, with usage limits | Individual developers, daily coding |
| **Max 5x** | $100 | ~88K tokens per 5-hour window | Heavy individual use, complex projects |
| **Max 20x** | $200 | ~220K tokens per 5-hour window | Professional developers, large codebases |
| **API** | Pay-per-token | Unlimited (pay as you go) | Teams, automation, CI/CD integration |

On the API, pricing per million tokens (as of April 2026):

| Model | Input | Output |
|---|---|---|
| **Haiku 4.5** | $1.00 | $5.00 |
| **Sonnet 4.6** | $3.00 | $15.00 |
| **Opus 4.6** | $5.00 | $25.00 |

Opus costs less than its earlier releases but still carries a meaningful premium over Sonnet. Sonnet remains the practical default for most feature work, while Haiku stays attractive for tightly scoped automation and routine subtasks. Those multipliers matter when you're running dozens of sessions per day.

For Codex-side budgeting, OpenAI's current flagship coding model page lists **GPT-5.3-Codex** at **$1.75 input / $14 output per million tokens** with cheaper cached input. That is the right comparison point when students want to estimate the cost of running the same workflow in Codex instead of Claude Code. The exact numbers will keep moving, so the habit to teach is not memorization. It is checking the live rate card before a long project or a heavy week of experimentation.

**Model selection strategy.** The single biggest cost lever is choosing the right model for each task. Here's a practical framework:

**Haiku** for: formatting code, generating boilerplate, routine file reads, running commands, search-and-replace operations, routine test generation. Think of Haiku as your intern: fast, cheap, good for defined tasks.

**Sonnet** for: feature implementation, bug fixing, code review, refactoring, writing tests for complex logic, PR descriptions. Sonnet is your mid-level engineer: reliable, balanced, your daily driver.

**Opus** for: architectural decisions, debugging subtle issues, complex multi-file refactors, understanding deeply nested logic, planning mode for large tasks. Opus is your principal engineer: expensive, but sometimes you need the best.

**Model selection rule of thumb.** Most course tasks can start on a cheaper or mid-tier model, then escalate only when the work is ambiguous, high-stakes, or repo-wide. If you classify the task first, the budget conversation gets much easier.

**Practical cost optimization techniques:**

1. **Front-load context, reduce reads.** If the agent reads the same 10 files in every session, summarize the key information in CLAUDE.md. One CLAUDE.md read is cheaper than 10 file reads.

1. **Use subagents on cheaper models.** When orchestrating parallel agents, the subagents doing focused work can use Haiku. The orchestrator that decomposes and synthesizes can use Sonnet.

1. **Scope your tasks narrowly.** "Fix the bug in the login endpoint" costs less than "review the entire authentication system." Narrow tasks require less context.

1. **Cache aggressively.** Claude Code caches recently read files. If you run multiple sessions on the same codebase without changing files between sessions, cache hits reduce costs.

1. **Set budget alerts.** Configure maximum spend per session. A runaway loop (agent retrying the same failing approach) can burn tokens fast. A budget limit is your circuit breaker.

**Worked cost examples.** Use the published rate cards to estimate your own sessions instead of memorizing stale examples. The right teaching move here is to classify the task, estimate the token shape, and compare the plan against the live pricing page before a heavy project week.

**Budget planning for students.** On the Pro plan ($20/month), you get enough tokens for daily coding sessions with reasonable usage. For this course, Pro covers most workflows. If you're hitting limits on complex tasks, consider the API pay-as-you-go option for specific sessions. The Student Builders program ($50 in free API credits) is a good supplement.

**🏫 What This Looks Like in Class.** The final project is where model budgeting stops being hypothetical. Students who learn to reserve stronger models for planning, debugging, and synthesis usually get further on the same budget than students who throw the most expensive model at every task by default. That is exactly the kind of engineering judgment the course is trying to teach.

### Claude Code Workflow: Cost Management and Optimization

Make students do the math out loud. Pick three real task types from the course: a tiny formatting fix, a medium feature with tests, and a deep repo review. Estimate which model you would use first, then calculate the token and dollar impact using the published rate cards. After that, show the same exercise for Codex-style work. The takeaway should be practical: model choice is budgeting, not vibes. If a task is narrow, do not spend premium reasoning on it. If the task is architectural or long horizon, do not pretend the cheapest model will rescue bad scoping. Students with above-average engineering skills usually like this lesson because it turns AI usage into systems design and capacity planning instead of brand mythology.

### Codex Workflow: Cost Management and Optimization

OpenAI's current model line makes the same point from a different angle. GPT-5.3-Codex is the current flagship coding model, and OpenAI still offers cheaper or older Codex variants for narrower jobs. That means the durable lesson is not "Claude is cheap" or "Codex is expensive." The durable lesson is to classify the work first. Diff review, boilerplate cleanup, and repetitive refactors should run on cheaper or smaller models when possible. Repository-wide reasoning, high-stakes bug hunts, and orchestration deserve stronger models. Once students learn to map task type to model budget, they stop treating the rate card like trivia and start using it as an engineering lever.

## Break & Wrap Up

**🔥 Key takeaway:** Observability and cost management are professional skills. Know what your agent does, how much it costs, and how to optimize both. Start with verbose logging, develop intuition for model selection, and set budget limits.

**🧩 Before next class:** Run one Claude Code session with verbose logging enabled. Review the token usage report. Calculate the cost. Identify one optimization you could make.

### Pro Tip: Classify the Work Before You Pick the Model

Most wasted spend comes from bad task classification, not bad arithmetic. If the task is mechanical, start cheap. If the task is ambiguous or high-stakes, buy more reasoning on purpose. Write that classification into your workflow so the next session does not rediscover it. 💸

### Fun Fact: Curiosity Spikes Create Operational Risk

After the March 2026 Claude Code artifact leak, malware campaigns quickly started targeting people hunting for the package details. That is a useful reminder that "observability" is bigger than terminal logs. Real AI operations also include tracking how the surrounding ecosystem reacts when a tool becomes the story of the week. 👀

### Debrief Questions

Ask which workflow in the course is currently overpowered with an expensive model and which one is underpowered with too little context or reasoning. Students usually discover one obvious budget win immediately.

## After Class Challenges

### Challenge 1: Session Audit

Run 3 different Claude Code tasks with verbose logging:

1. A small task (fix a typo, add a comment).
1. A medium task (implement a feature, write tests).
1. A large task (review a module, refactor a file).

For each, document: total tokens, model used, number of tool calls, estimated cost, and time elapsed. Compare efficiency across tasks.

### Challenge 2: Model Selection Experiment

Run the same task three times, once with each model:

1. Use Haiku. Note quality, speed, and token usage.
1. Use Sonnet. Same notes.
1. Use Opus. Same notes.

Compare: where does the quality difference justify the cost? Where does Haiku perform just as well as Opus? Write up your findings with specific examples.

### Challenge 3: Cost Optimization Sprint

Take your most expensive workflow (from Challenge 1) and optimize it:

1. Identify the biggest token consumers (usually file reads and large outputs).
1. Apply at least 2 optimization techniques: front-load context, narrow scope, use cheaper models for subtasks, cache summaries.
1. Run the optimized version. Compare cost before and after.
1. Document the percentage reduction and which techniques had the biggest impact.

## Additional Resources

### Source Notes

Start with the official docs and current model pages first. The remaining links add historical context, canonical books, or supporting examples.

1. [Claude Code Pricing](https://claude.com/pricing): Official pricing for Pro and Max plans.
1. [Claude Sonnet 4.6](https://www.anthropic.com/claude/sonnet): Official Sonnet 4.6 model page with current API pricing.
1. [Claude Opus 4.6](https://www.anthropic.com/claude/opus): Official Opus 4.6 model page with current API pricing.
1. [Claude Haiku 4.5 System Card](https://assets.anthropic.com/m/99128ddd009bdcb/Claude-Haiku-4-5-System-Card.pdf): Official Anthropic release document for Haiku 4.5.
1. [Claude Code Best Practices: Cost](https://code.claude.com/docs/en/best-practices): Official cost optimization recommendations.
1. [How Claude Code Works: Token Usage](https://code.claude.com/docs/en/how-claude-code-works): Understanding how tokens are consumed.
1. [GPT-5.3-Codex Model](https://developers.openai.com/api/docs/models/gpt-5.3-codex): Official current Codex model page with pricing and context details.
1. [Using Codex With Your ChatGPT Plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan): Official Codex access guide for ChatGPT plans.
1. [OpenAI Pricing](https://platform.openai.com/docs/pricing/): Official API pricing page for current OpenAI models.
