# What Do You Even Do All Day?

## Learning Objectives

By the end of this lesson, you will be able to:

1. Monitor what an AI agent does during a session: tool calls, token usage, model selection, and decision points.
2. Calculate the cost of an agent session and identify where tokens are being spent.
3. Choose the right model (Haiku, Sonnet, Opus) for different task types based on cost/quality tradeoffs.
4. Set up a budget-aware workflow that prevents runaway costs.

## Best Practices

- **Watch before you optimize.** You can't reduce costs you don't understand. Run a few sessions with verbose logging before changing anything.
- **Haiku is your default for routine work.** File reads, simple edits, formatting, boilerplate generation. Save Sonnet and Opus for tasks that actually need them.
- **Set spending limits.** Configure a max budget per session or per day. One runaway Opus loop can burn through $20 before you notice.
- **Track token usage per task type.** Know what your common workflows cost. "Running tests" might be cheap. "Full codebase review" might be expensive.
- **Subagents on Haiku, orchestrator on Sonnet.** When running parallel agents, the subagents doing focused work can use the cheaper model. The main session doing decomposition and synthesis uses the smarter model.
- **Cache what you can.** If the agent reads the same files every session, consider putting summaries in CLAUDE.md instead of making it re-read them.

# Topic 1: Agent Observability

## Overview

When you hire a contractor to renovate your kitchen, you don't just hand them the keys and come back in a month. You check in. You look at the work in progress. You ask questions when something looks off. You review invoices.

AI agents deserve the same scrutiny. They're doing real work on your behalf: reading files, writing code, running commands, making decisions. If you don't observe what they're doing, you can't improve the process, debug failures, or control costs.

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
2. Were there unnecessary file reads? (Context engineering opportunity)
3. Did it recover from errors gracefully?
4. Where did it spend the most tokens? (Cost optimization opportunity)

This five-minute review compounds. After a week, you'll have a much clearer picture of how to improve your workflows.

# Topic 2: Cost Management and Optimization

## Overview

AI agents cost money. Every token processed, every model invocation, every tool call has a price. For individual developers, costs are manageable (a few dollars per day on Pro). For teams, they can add up quickly. Understanding the cost model and optimizing your usage is a practical skill that matters in any professional setting.

**The pricing landscape (April 2026).** Claude Code access comes through several plans:

| Plan | Monthly Cost | Claude Code Access | Best For |
|---|---|---|---|
| **Pro** | $20 | Yes, with usage limits | Individual developers, daily coding |
| **Max 5x** | $100 | ~88K tokens per 5-hour window | Heavy individual use, complex projects |
| **Max 20x** | $200 | ~220K tokens per 5-hour window | Professional developers, large codebases |
| **API** | Pay-per-token | Unlimited (pay as you go) | Teams, automation, CI/CD integration |

On the API, pricing per million tokens (as of April 2026):

| Model | Input | Output |
|---|---|---|
| **Haiku 4.5** | $0.80 | $4.00 |
| **Sonnet 4.6** | $3.00 | $15.00 |
| **Opus 4.6** | $15.00 | $75.00 |

Opus costs 5x more than Sonnet, which costs ~4x more than Haiku. Those multipliers matter when you're running dozens of sessions per day.

**Model selection strategy.** The single biggest cost lever is choosing the right model for each task. Here's a practical framework:

**Haiku** for: formatting code, generating boilerplate, simple file reads, running commands, search-and-replace operations, simple test generation. Think of Haiku as your intern: fast, cheap, good for defined tasks.

**Sonnet** for: feature implementation, bug fixing, code review, refactoring, writing tests for complex logic, PR descriptions. Sonnet is your mid-level engineer: reliable, balanced, your daily driver.

**Opus** for: architectural decisions, debugging subtle issues, complex multi-file refactors, understanding deeply nested logic, planning mode for large tasks. Opus is your principal engineer: expensive, but sometimes you need the best.

**The 80/20 rule for model selection.** In practice, about 80% of your agent tasks can be handled by Haiku or Sonnet. The remaining 20% genuinely benefit from Opus. If you're using Opus for everything, you're overspending. If you're using Haiku for everything, you're underperforming.

**Practical cost optimization techniques:**

1. **Front-load context, reduce reads.** If the agent reads the same 10 files in every session, summarize the key information in CLAUDE.md. One CLAUDE.md read is cheaper than 10 file reads.

2. **Use subagents on cheaper models.** When orchestrating parallel agents, the subagents doing focused work can use Haiku. The orchestrator that decomposes and synthesizes can use Sonnet.

3. **Scope your tasks narrowly.** "Fix the bug in the login endpoint" costs less than "review the entire authentication system." Narrow tasks require less context.

4. **Cache aggressively.** Claude Code caches recently read files. If you run multiple sessions on the same codebase without changing files between sessions, cache hits reduce costs.

5. **Set budget alerts.** Configure maximum spend per session. A runaway loop (agent retrying the same failing approach) can burn tokens fast. A budget limit is your circuit breaker.

**Real cost examples.** To make this concrete:

- A typical "implement a small feature" session (Sonnet): ~50K tokens, ~$0.50-1.00
- A "full codebase review" session (Sonnet): ~200K tokens, ~$2-4.00
- A parallel build with 5 subagents (Haiku subagents, Sonnet orchestrator): ~300K tokens, ~$2-3.00
- An Opus architectural planning session: ~100K tokens, ~$5-8.00

These are rough estimates. Actual costs depend on codebase size, task complexity, and how many retries the agent needs.

**Budget planning for students.** On the Pro plan ($20/month), you get enough tokens for daily coding sessions with reasonable usage. For this course, Pro covers most workflows. If you're hitting limits on complex tasks, consider the API pay-as-you-go option for specific sessions. The Student Builders program ($50 in free API credits) is a good supplement.

## Break & Wrap Up

**Key takeaway:** Observability and cost management are professional skills. Know what your agent does, how much it costs, and how to optimize both. Start with verbose logging, develop intuition for model selection, and set budget limits.

**Before next class:** Run one Claude Code session with verbose logging enabled. Review the token usage report. Calculate the cost. Identify one optimization you could make.

## After Class Challenges

### Challenge 1: Session Audit

Run 3 different Claude Code tasks with verbose logging:

1. A small task (fix a typo, add a comment).
2. A medium task (implement a feature, write tests).
3. A large task (review a module, refactor a file).

For each, document: total tokens, model used, number of tool calls, estimated cost, and time elapsed. Compare efficiency across tasks.

### Challenge 2: Model Selection Experiment

Run the same task three times, once with each model:

1. Use Haiku. Note quality, speed, and token usage.
2. Use Sonnet. Same notes.
3. Use Opus. Same notes.

Compare: where does the quality difference justify the cost? Where does Haiku perform just as well as Opus? Write up your findings with specific examples.

### Challenge 3: Cost Optimization Sprint

Take your most expensive workflow (from Challenge 1) and optimize it:

1. Identify the biggest token consumers (usually file reads and large outputs).
2. Apply at least 2 optimization techniques: front-load context, narrow scope, use cheaper models for subtasks, cache summaries.
3. Run the optimized version. Compare cost before and after.
4. Document the percentage reduction and which techniques had the biggest impact.

## Additional Resources

1. [Claude Code Pricing](https://claude.com/pricing): Official pricing for all plans.
2. [Claude API Pricing](https://www.anthropic.com/pricing): Token-level pricing for API usage.
3. [Claude Code Best Practices: Cost](https://code.claude.com/docs/en/best-practices): Official cost optimization recommendations.
4. [How Claude Code Works: Token Usage](https://code.claude.com/docs/en/how-claude-code-works): Understanding how tokens are consumed.
