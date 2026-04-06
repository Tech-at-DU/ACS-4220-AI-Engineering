# Debugging the Debugger

## Agenda

- [Learning Objectives](#learning-objectives)
- [Best Practices](#best-practices)
- [When AI Tools Fail](#when-ai-tools-fail)
  - [Overview: When AI Tools Fail](#overview-when-ai-tools-fail)
- [Systematic Debugging of AI Tool Issues](#systematic-debugging-of-ai-tool-issues)
  - [Overview: Systematic Debugging of AI Tool Issues](#overview-systematic-debugging-of-ai-tool-issues)
- [Break & Wrap Up](#break-wrap-up)
- [After Class Challenges](#after-class-challenges)
  - [Challenge 1: Failure Taxonomy](#challenge-1-failure-taxonomy)
  - [Challenge 2: Debug a Stuck Session](#challenge-2-debug-a-stuck-session)
  - [Challenge 3: Resilience Playbook](#challenge-3-resilience-playbook)
- [Additional Resources](#additional-resources)

## Learning Objectives

By the end of this lesson, you will be able to:

1. Identify common AI tool failure modes: hallucinations, context overflow, tool errors, infinite loops, and model confusion.
1. Debug Claude Code issues systematically using logs, verbose mode, and bisection.
1. Recover from stuck sessions without losing work.
1. Build resilience into your workflow so failures are caught early and recovered from quickly.

## Best Practices

- **Read the error, not the vibes.** When Claude Code fails, it produces specific error messages. Read them. "Context window exceeded" is a different problem than "tool execution failed," and they have different fixes.
- **Bisect the problem.** If a complex prompt fails, split it in half. Does the first half work? The second half? Find the smallest prompt that reproduces the failure.
- **Check the obvious first.** API key expired? Internet down? Disk full? Git in a bad state? The most common failures aren't AI problems. They're environment problems.
- **Don't retry the same thing.** If the agent failed with one approach, retrying the exact same prompt will produce the exact same failure. Change something: the prompt, the context, the model, or the scope.
- **Keep escape hatches.** Always know how to stop a running agent (Ctrl+C), how to roll back changes (git stash or git checkout), and how to start a fresh session.
- **Document failures.** Every failure is data. Add it to your CLAUDE.md or a personal "failure log." Patterns will emerge.
- **💼 Use Case.** Keep a failure log during `fixthis` and `wiredup` so repeated integration, environment, or context problems become explicit patterns.
- **🛠️ Pro Tip.** Codex facts: traces only become useful debugging assets when you keep the failing task, the evidence, and the final fix together.

**Builds On:** every failure mode students have already seen across `firstbuild`, `fixthis`, and `wiredup`.

**Feeds:** the final project by turning recurring mistakes into a reusable debugging runbook.

## When AI Tools Fail

### Overview: When AI Tools Fail

By this point in the course, students have already seen real failures in `firstbuild`, `fixthis`, and `wiredup`. This section should start from that lived experience, not from a generic warning that tools can fail.

AI tools fail. Not occasionally. Regularly. The difference between a frustrated developer and an effective one is knowing what the failure modes look like and how to respond to each one.

This isn't a reflection on the tool's quality. It's a reality of working with any complex system. Compilers have bugs. Databases crash. Networks drop packets. AI agents hallucinate, overflow context windows, and get stuck in loops. Professional developers don't avoid tools that fail. They learn how those tools fail and build workflows that handle it.

**The failure taxonomy.** Claude Code failures fall into a few well-defined categories:

**1. Hallucinations.** The agent generates code that references things that don't exist: phantom APIs, invented methods, fictional libraries. You've covered this in Day 6 ("Nothing Survives First Contact"). The fix is verification: check imports, test external calls, validate against documentation.

**2. Context window overflow.** Every Claude Code session has a finite context window (the total amount of text the model can consider at once). When you exceed it, the agent starts "forgetting" earlier parts of the conversation. Symptoms: it repeats questions you already answered, ignores instructions from earlier in the session, or produces output that contradicts previous work.

The context window is like a browser with too many tabs open. The information still exists somewhere, but your active working set stops being usable. The fix: start a new session with a focused prompt, or use subagents to keep individual context windows small.

**3. Tool execution failures.** The agent tries to run a command and it fails. Common causes: file doesn't exist (wrong path), permission denied (need sudo or different user), command not found (tool not installed), network timeout (external service down). The agent usually reports the error and tries to recover, but sometimes it retries the same failing command repeatedly.

**4. Infinite loops.** The agent gets stuck: it tries approach A, fails, tries approach A again, fails again, and keeps going. This usually happens when the agent doesn't have enough context to find an alternative approach. Symptoms: repeated tool calls with the same arguments, token usage climbing rapidly, no progress.

**5. Model confusion.** The agent misunderstands the task. It builds the wrong feature, modifies the wrong file, or solves a problem that wasn't asked for. This usually traces back to ambiguous instructions or conflicting context (your CLAUDE.md says one thing, your prompt says another).

**6. Environment failures.** Not actually AI failures, but they look like them. API key expired. Disk is full. Git has unresolved merge conflicts. The agent tries to work and hits errors that aren't about the task at all. These are the most common "failures" and the easiest to fix once you identify them.

**Why the agent doesn't just tell you what went wrong.** Sometimes it does. Claude Code surfaces errors and explains what happened. But sometimes the agent doesn't know it's wrong. A hallucinated import doesn't generate an error until the code runs. A misunderstood task doesn't generate an error at all (the agent builds the wrong thing successfully). This is why verification workflows matter. You can't rely on the agent to self-report all failures.

**Failure rates by category (rough estimates from community reports):**

| Failure Type | Frequency | Severity | Typical Recovery Pattern |
|---|---|---|---|
| Environment issues | Very common | Low | Check keys, network, disk, git state, then rerun |
| Hallucinations | Common | Medium | Verify imports, APIs, and docs before trusting the output |
| Context overflow | Occasional | Medium | Start a fresh session with tighter scope and cleaner context |
| Model confusion | Occasional | High | Rewrite the task with clearer constraints and expected output |
| Tool execution errors | Common | Low | Inspect the failing tool call, adjust inputs, and retry |
| Infinite loops | Rare | Medium | Stop the run, change approach, and restart with better guardrails |

**🏫 What This Looks Like in Class.** `firstbuild`, `wiredup`, and `fixthis` each tend to produce different kinds of failure. `firstbuild` exposes specification drift. `wiredup` exposes integration and configuration mistakes. `fixthis` exposes context and brownfield confusion. Seeing those categories recur across assignments helps students stop treating failure as random bad luck.

### Claude Code Workflow: When AI Tools Fail

Intentionally create one environment failure and one context failure in class. A missing binary, expired key, bad path, or merge conflict is enough for the environment side. A contradictory instruction file or overloaded context is enough for the agent side. Students need to see that the recovery moves are different. Environment failures want direct systems debugging. Agent failures want scope control, better context, or a changed approach. Watching those two categories side by side gives them a usable failure taxonomy instead of a vague feeling that "the AI broke."

### Codex Workflow: When AI Tools Fail

Codex debugging follows the same discipline. Read the log, inspect the tool history, simplify the task, and change one variable at a time. The names on the controls differ, but the engineering method does not. That is the lesson worth carrying forward. Students should leave knowing that a coding agent is not a mystical black box. It is a software system with boundaries, inputs, traces, and failure modes they can reason about like any other system.

## Systematic Debugging of AI Tool Issues

### Overview: Systematic Debugging of AI Tool Issues

Use one actual broken run as the anchor: a stuck test loop, a bad path, or a confused edit. The method matters because it turns panic into a repeatable recovery script.

Debugging AI tools uses the same principles as debugging any software: reproduce the problem, isolate the cause, fix it, verify the fix. The tools are slightly different, but the methodology is the same.

**Step 1: Reproduce.** Can you make the failure happen again? If yes, you have a reproducible bug and you can systematically narrow the cause. If no (it was a one-time fluke), note it and move on. Intermittent failures are the hardest to debug in any system.

**Step 2: Read the logs.** Claude Code's verbose mode (`--verbose`) is your first debugging tool. It shows every tool call, every response, every decision point. When something goes wrong, the log tells you the sequence of events leading up to the failure.

```bash
$ claude --verbose "the task that failed"
```

Look for:
- Tool calls that returned errors.
- Repeated tool calls with the same arguments (loop detection).
- File reads that returned unexpected content (stale or wrong files).
- Model responses that indicate confusion ("I'm not sure what you mean" or sudden topic changes).

**Step 3: Bisect.** If a complex task fails, simplify it. Split the task in half and try each half separately. If the first half works and the second half fails, you've isolated the problem to the second half. Keep splitting until you find the smallest possible failing case.

This is the same technique as `git bisect` (finding the commit that introduced a bug by binary searching the commit history). It works because it systematically eliminates possibilities.

**Step 4: Check the context.** Many failures trace back to context issues:

- **Too much context**: CLAUDE.md is so long that important instructions get pushed out.
- **Conflicting context**: Global config says "use tabs," project config says "use spaces."
- **Missing context**: The agent doesn't know about a critical file or convention.
- **Stale context**: CLAUDE.md references a file that's been moved or renamed.

Run `claude /init` to regenerate the context and see what the agent actually sees at the start of a session.

**Step 5: Change one thing.** Once you have a hypothesis, test it by changing exactly one variable:

- If you think the model is wrong, try a different model (Sonnet → Opus, or Opus → Sonnet).
- If you think the context is wrong, simplify your CLAUDE.md.
- If you think the prompt is ambiguous, rewrite it with more specificity.
- If you think the task is too big, break it into smaller subtasks.

Only change one thing at a time. If you change three things and it works, you don't know which change fixed it.

**Step 6: Build the fix into your workflow.** Once you've identified and fixed the issue, prevent it from happening again:

- Add a note to CLAUDE.md ("Don't use library X, it causes import errors").
- Create a hook that catches the error pattern.
- Add the failure to your personal "gotcha" log.
- If the fix is broadly useful, contribute it back to the team's config.

**Recovery techniques for common failures:**

**Context overflow recovery:** Start a new session. Summarize the current state in your first message: "I was working on X. Here's what's done and what remains." The fresh context window gives the agent room to work.

**Infinite loop recovery:** Ctrl+C to stop the agent. Review what it was trying to do. Reframe the task with more specific instructions or constraints: "Try approach B instead of approach A."

**Stuck git state recovery:** The agent sometimes leaves git in a state with uncommitted changes, unresolved conflicts, or detached HEAD. Commands to know:

```bash
$ git status                    # See what's going on
$ git stash                     # Save uncommitted work
$ git checkout main             # Get back to a known state
$ git stash pop                 # Restore your saved work
```

**Wrong file modified recovery:** The agent edited the wrong file. Use `git diff` to see what changed, then `git checkout -- path/to/file` to restore the original. If you've already committed, `git revert` creates a new commit that undoes the change.

**The debugging mindset for AI tools.** The temptation when an AI tool fails is to blame the tool: "it's broken," "it's dumb," "it doesn't work." Resist this. Treat the failure like you'd treat any bug: with curiosity, not frustration. What happened? Why? How can I prevent it next time? This mindset turns failures into learning opportunities and makes you a more effective AI engineer.

**🏫 What This Looks Like in Class.** The students who improve fastest are usually the ones who write down one clean failure pattern after each assignment instead of trying to remember all of them at the end. That small habit turns the course into a debugging archive they can reuse on the final project.

### Claude Code Workflow: Systematic Debugging of AI Tool Issues

Run one failed session to ground, then perform a tight bisection on the projector. Strip away one dependency, one instruction, or one model choice at a time until the failure becomes obvious. Students often think debugging agents requires a special AI ritual. It does not. It requires disciplined narrowing. That is exactly why this lesson belongs in an engineering course instead of a hype seminar.

### Codex Workflow: Systematic Debugging of AI Tool Issues

Codex sessions benefit from the same postmortem habit: capture the failing task, keep the evidence, and write the permanent fix into repo instructions or automation if it is likely to recur. That is how teams convert one confusing run into long-term reliability. Cross-tool fluency here matters more than memorizing error strings.

## Break & Wrap Up

**🔥 Key takeaway:** AI tools fail in predictable ways. Learn the failure taxonomy, build a systematic debugging process, and turn every failure into a prevention mechanism. The best AI engineers aren't the ones whose tools never fail. They're the ones who recover fastest.

**🧩 Before next class:** Review your failure log from the entire course. Identify the 3 most common failures you've encountered. For each one, write a prevention strategy and add it to your CLAUDE.md.

### Pro Tip: Keep a Failure Scrapbook

When a session fails in an interesting way, save the prompt, the trace, and the fix. Over time that becomes a private runbook that is more valuable than generic troubleshooting lists. 📓

### Fun Fact: Source Maps Are Accidental Debug Journals

One reason the March 2026 Claude Code artifact leak landed so hard is that source maps preserve the shape of the system that produced them. Debug output can become narrative output the moment it escapes. 🧵

### Instructor Closing Loop

Close the lesson by walking students through one final recovery script they can use under pressure: stop the run, capture the failing context, identify whether the problem is environment or agent behavior, simplify until the failure reproduces cleanly, then write the fix back into the repo if it is likely to happen again. That closing repetition sounds basic, but it is exactly how debugging discipline becomes habit.

## After Class Challenges

### Challenge 1: Failure Taxonomy

Build a personal failure taxonomy from your course experience:

1. Review all the AI-generated code you've written this course.
1. Categorize every failure by type (hallucination, context overflow, tool error, etc.).
1. For each category, note: frequency, typical symptoms, and your best fix.
1. Add the top 5 failure patterns to your CLAUDE.md as warnings.

### Challenge 2: Debug a Stuck Session

Intentionally create a failing scenario and practice the debugging workflow:

1. Give Claude Code a task with deliberately conflicting instructions (e.g., conflicting CLAUDE.md rules).
1. Observe the failure. What happens?
1. Use verbose mode to trace the agent's decision-making.
1. Bisect the problem: simplify until you find the root cause.
1. Fix it and verify the fix.

### Challenge 3: Resilience Playbook

Create a "when things go wrong" playbook for your project:

1. List the 5 most likely failure modes for your specific workflow.
1. For each one, write: symptoms, diagnostic steps, recovery commands.
1. Include git recovery commands for common stuck states.
1. Format it as a `.claude/commands/debug.md` custom command so you can invoke it from Claude Code.

## Additional Resources

### Source Notes

Start with the official docs and current model pages first. The remaining links add historical context, canonical books, or supporting examples.

1. [Claude Code Troubleshooting](https://code.claude.com/docs/en/troubleshooting): Official troubleshooting guide.
1. [Claude Code How It Works](https://code.claude.com/docs/en/how-claude-code-works): Understanding the internals helps debug failures.
1. [Debugging by Thinking](https://jvns.ca/blog/2019/06/23/a-few-debugging-tips/): Julia Evans' debugging tips (applicable to AI tools too).
1. [The Art of Debugging](https://www.amazon.com/Art-Debugging-GDB-DDD-Eclipse/dp/1593271743): Systematic debugging methodology.
1. [OpenAI Codex](https://developers.openai.com/codex/): Official Codex documentation for coding-agent workflows and troubleshooting.
