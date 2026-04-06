# Memory Is Everything

## Agenda

- [Learning Objectives](#learning-objectives)
- [Best Practices](#best-practices)
- [The Context Hierarchy](#the-context-hierarchy)
  - [Overview: The Context Hierarchy](#overview-the-context-hierarchy)
- [Context Engineering as a Discipline](#context-engineering-as-a-discipline)
  - [Overview: Context Engineering as a Discipline](#overview-context-engineering-as-a-discipline)
- [Break & Wrap Up](#break-wrap-up)
- [After Class Challenges](#after-class-challenges)
  - [Challenge 1: Context Hierarchy Buildout](#challenge-1-context-hierarchy-buildout)
  - [Challenge 2: Custom Command Workshop](#challenge-2-custom-command-workshop)
  - [Challenge 3: Context Quality Benchmark](#challenge-3-context-quality-benchmark)
- [Additional Resources](#additional-resources)

## Learning Objectives

By the end of this lesson, you will be able to:

1. Design a `CLAUDE.md` file that gives an agent the right context without overwhelming it.
1. Explain the context hierarchy: global config, project root, subdirectory overrides, and session-level `@` mentions.
1. Build custom slash commands that encode your team's workflows into reusable tools.
1. Articulate why context engineering has replaced "prompt engineering" as the core skill.

## Best Practices

- **Less is more.** Keep your root `CLAUDE.md` under 100 lines. Every instruction competes for the model's attention budget. If it doesn't apply to every session, it doesn't belong at the root.
- **Pointers, not copies.** Don't paste code snippets into `CLAUDE.md`. They go stale. Reference file paths instead: "See `src/config/db.ts` for the database connection pattern." The agent reads the file when it needs to.
- **Layer your context.** Global config for personal preferences, project root for repo-wide rules, subdirectory files for module-specific instructions. Each layer narrows the focus.
- **Use hooks for enforcement.** `CLAUDE.md` instructions are advisory. Hooks and automated checks are the enforcement layer. If something is critical (like "never commit to main"), make it a hook.
- **Custom commands save tokens.** A `.claude/commands/review.md` file that encodes your review checklist replaces a long prompt you'd type every time.
- **Run `/init` on new repos.** It generates a starter `CLAUDE.md` by scanning your codebase. Not perfect, but better than a blank file.
- **💼 Use Case.** Move repeated setup, test commands, and architecture hints into repo context when `fixthis` or `makeanything` keeps rereading the same files.
- **🛠️ Pro Tip.** Codex facts: repo instructions and verification notes work best when they stay short, current, and committed with the codebase.

**Builds On:** Day 1's agent loop and the first project-level instruction file.

**Feeds:** `firstbuild`, Day 3 workflow design, and every later repo configuration choice.

## The Context Hierarchy

### Overview: The Context Hierarchy

Students hit this immediately when the same `firstbuild` task behaves differently before and after a repo instruction file exists. The practical problem is not abstract memory. It is whether the agent can find the right commands, files, and conventions without wasting the session.

Here's a question that seems obvious but most people get wrong: what does your AI tool actually know when you start a session?

If you've ever started a new job, you know the answer depends entirely on the documentation. Some teams hand you a wiki with everything: architecture diagrams, coding standards, deployment procedures, a glossary of internal jargon. You're productive in days. Other teams hand you a laptop and say "ask Steve." Steve is on vacation. You spend two weeks reading source code and guessing.

Claude Code's `CLAUDE.md` system is the difference between those two onboarding experiences. It's a layered documentation system that tells the agent everything it needs to know about your project, your team, and your preferences before it writes a single line of code.

**The hierarchy, from broadest to narrowest.**

Think of it like zoom levels on a map. At the widest level you see the whole city. As you zoom in, only the streets and landmarks relevant to your exact destination stay visible.

1. **Global config** (`~/.claude/CLAUDE.md`): Personal preferences that follow you everywhere. Your coding style, your preferred test framework, your pet peeves. This loads in every session across every project. Example: "Always use TypeScript strict mode. Prefer `vitest` over `jest`. Write commit messages in present tense."

1. **Project root** (`./CLAUDE.md`): Repo-specific instructions. Tech stack, architecture decisions, how to run tests, environment setup. This is the most important file in your project for AI-assisted development. Example: "This is a Django 5.1 app. Run tests with `python manage.py test`. Use `ruff` for linting. The database is PostgreSQL."

1. **Subdirectory overrides** (`./src/api/CLAUDE.md`): Module-specific rules that only load when the agent works in that directory. Useful for monorepos or projects with distinct subsystems. Example: "This directory contains the REST API. All endpoints follow the pattern in `src/api/templates/endpoint.py`. Responses use camelCase JSON keys."

1. **Session-level context** (`@` mentions and `/init`): Temporary context you inject during a conversation. `@filename` pulls a specific file into the agent's attention. `/init` generates a `CLAUDE.md` by scanning the repo.

**Why layers matter.** Without layering, you'd need one massive file that covers everything. That file would be thousands of lines, most of it irrelevant to any given task. Frontier coding agents follow short, prioritized instruction sets more reliably than sprawling ones. Every irrelevant instruction in `CLAUDE.md` pushes out a more relevant one.

**The runbook-stack analogy.** Your global config is the personal operating guide you carry everywhere. Your project `CLAUDE.md` is the repo runbook. Subdirectory files are service-specific playbooks. And `@` mentions are the incident note that says, “look at this file before you touch anything else.”

**The `.claude/` directory.** Beyond `CLAUDE.md`, the `.claude/` directory holds your project's AI infrastructure:

```
.claude/
├── commands/          # Custom slash commands
│   ├── review.md      # /project:review
│   └── deploy.md      # /project:deploy
├── settings.json      # Project settings (permissions, allowed tools)
└── CLAUDE.md          # (alternative location for project instructions)
```

**Custom commands** are templates that encode workflows. A `review.md` file might contain: "Read the diff of the current branch against main. Check for: missing tests, hardcoded secrets, unused imports, inconsistent naming. Report issues as a numbered list." Now every team member runs `/project:review` and gets the same checklist. No one forgets the security check because they're in a hurry.

**Real-world usage.** Public repos increasingly ship agent instructions, reusable commands, and verification notes directly with the codebase because that shortens onboarding for both humans and tools. The exact filenames differ across ecosystems, but the operating pattern is the same: put durable guidance where the next session can load it cheaply.

**What changed in 2026.** The biggest shift is **hooks** (PreToolUse and PostToolUse). Before hooks, `CLAUDE.md` was the only way to guide behavior, and it was advisory. Hooks enforce rules on every run. A PreToolUse hook can block the agent from running `rm -rf` or committing to main. A PostToolUse hook can automatically run your linter after every file edit. The combination of `CLAUDE.md` (advisory) and hooks (enforced) gives you both flexibility and safety.

### Claude Code Workflow: The Context Hierarchy

Show one task with weak context and the same task with layered context. The output difference is the whole argument for this lesson. Students should see fewer unnecessary reads, faster file targeting, and less style drift when the hierarchy is clean. That direct comparison makes context engineering feel like performance engineering instead of prompt superstition.

### Codex Workflow: The Context Hierarchy

Codex relies on the same underlying discipline even though the file names differ. Shared repo instructions, task-specific mentions, tool boundaries, and verification rules all shape whether the agent acts like it belongs in the repo. The product names change. The systems job does not.

## Context Engineering as a Discipline

### Overview: Context Engineering as a Discipline

Use a real repo task here: ask for a test update with no repo guidance, then with good guidance. That side-by-side is the practical anchor for why context engineering matters more than clever wording.

You've probably heard the term "prompt engineering." It was everywhere in 2023 and 2024. The idea was that phrasing alone could rescue weak context. People wrote entire books about prompt templates. Job postings asked for "prompt engineering experience."

Here's the thing: prompt engineering was always the wrong frame.

It is like rewriting the perfect support ticket subject line while leaving out the logs, reproduction steps, and affected service. The phrasing may sound sharp. The missing context still guarantees slower, worse work.

**Context engineering** is the discipline of designing what your AI tools know, not how you ask them. It's the shift from "How do I phrase this prompt?" to "What information does this tool need to make a good decision?" That second question is harder, more interesting, and more valuable.

**Where the term came from.** The phrase gained traction in the AI developer community during late 2024 and early 2025. Anthropic's engineering blog used it to describe the practice of designing CLAUDE.md files, custom commands, and project structures that feed the right information to the agent at the right time. It caught on because it reframed the conversation from clever wording to system design.

The underlying insight isn't new. Software engineers have always known that garbage in equals garbage out. Context engineering is just that principle applied to AI tools. The "garbage" isn't bad data. It's missing data. An agent with no context about your project will write generic code that doesn't match your conventions, ignores your architecture, and breaks your tests. An agent with good context writes code that fits.

**The three dimensions of context.** When you're designing context for an AI tool, you're making decisions along three axes:

1. **Relevance**: Is this information useful for the task at hand? A rule about database naming conventions matters when the agent writes a migration. It doesn't matter when it's updating a README.

1. **Freshness**: Is this information current? Code snippets pasted into CLAUDE.md go stale the moment someone refactors. File path references stay accurate because the agent reads the current version.

1. **Priority**: Which instructions matter most? If you have 200 lines of instructions and the model reliably follows 150, the bottom 50 get dropped. Put your most important rules first.

**The new hire test.** Here's a practical exercise: imagine hiring a mid-level engineer who's never seen your codebase. What would you put in their onboarding doc? That's your `CLAUDE.md`. What would you tell them on their first day? That's your session context. What would you let them discover on their own by reading code? That's what you leave out.

If you'd tell a new hire "we use tabs, not spaces" but you wouldn't write it in the onboarding doc because your linter catches it, then it doesn't belong in `CLAUDE.md` either. Let the linter do linting. Use hooks if you need enforcement.

**Why this matters professionally.** The more serious the repo and the team workflow become, the less useful one-off prompting gets on its own. The durable skill is designing context systems that make AI tools effective across a team. That is a system design question. It involves understanding your codebase, your workflows, your deployment pipeline, and how to encode all of that into artifacts that AI tools can consume. It's closer to DevOps than it is to creative writing.

**The context budget.** Keep one practical number in your head: instruction space is scarce. Short, current guidance survives contact with real sessions better than encyclopedic guidance.

That's not a lot. It means every instruction has to earn its place. "Use camelCase for variables" is worth a slot if your project mixes conventions. It's not worth it if your linter already enforces it. "Never push directly to main" is worth a slot (or better yet, a hook). "Be nice in code review comments" is not worth a slot because the agent doesn't write code review comments unless you specifically ask.

**Measuring context quality.** How do you know if your context is good? Run the same task twice: once with your CLAUDE.md, once without. Compare the output. If the context version follows your conventions, uses the right patterns, and requires fewer corrections, your context is working. If both versions look the same, your context isn't adding value. Cut what doesn't help. Add what's missing.

### Claude Code Workflow: Context Engineering as a Discipline

Have students watch a before-and-after benchmark. Pick a small but meaningful task, then compare the run with empty context against the run with a tuned instruction hierarchy. Count the file reads, corrections, and style mismatches. That makes "context quality" measurable instead of mystical.

### Codex Workflow: Context Engineering as a Discipline

Codex benefits from the same experiment. If `AGENTS.md`, workflow notes, or repo rules do not change the result, they are probably noise. If they reduce search, improve verification, and cut rework, they are doing real engineering work. Students need that falsifiable mindset early.

## Break & Wrap Up

**🔥 Key takeaway:** The quality of your AI tool's output is directly proportional to the quality of context you provide. Design your `CLAUDE.md` like you'd design an onboarding system for a new team member.

**🧩 Before next class:** Refine the `CLAUDE.md` you created in Lesson 1. Add at least one custom command in `.claude/commands/`. You'll use both in the Day 3 workflow.

### Pro Tip: Point to Living Files, Not Stale Snippets

Context ages badly when you paste examples that later drift from the codebase. References to real files stay current because the agent reads the source of truth when it needs it. 🔗

### Fun Fact: "Memory" Usually Means Summaries Plus Handoffs

The recent public fascination with leaked agent internals made memory look magical. In practice, the useful engineering pattern is usually disciplined summarization, clean state handoff, and a narrow working set. 🧠

### Instructor Closing Loop

End by asking students what belongs in permanent repo context, what belongs in a task-level mention, and what should stay out of the context stack entirely because a tool can enforce it better. That final classification exercise turns the lesson into a reusable design habit instead of a collection of tips.

## After Class Challenges

### Challenge 1: Context Hierarchy Buildout

Set up the full context hierarchy for your project:

1. Create or update your global `~/.claude/CLAUDE.md` with your personal coding preferences.
1. Create or update your project root `CLAUDE.md` with project-specific instructions.
1. Create at least one subdirectory `CLAUDE.md` with module-specific rules.
1. Test the hierarchy: ask Claude Code to do a task that touches both the root and subdirectory contexts. Verify it follows rules from both levels.

### Challenge 2: Custom Command Workshop

Create three custom slash commands in `.claude/commands/`:

1. A **review** command that runs your project's specific code review checklist.
1. A **test** command that runs tests and summarizes results in a specific format.
1. A **setup** command that onboards a fresh checkout (install deps, set up env, verify everything works).

Test each command and iterate until the output is consistently useful. These become part of your personal toolkit for every future project.

### Challenge 3: Context Quality Benchmark

Run an experiment:

1. Pick a task you've already done (or a new small feature).
1. Run it with an empty CLAUDE.md. Save the output.
1. Run the same task with your current CLAUDE.md. Save the output.
1. Compare: Did the context version follow conventions better? Require fewer corrections? Fewer loops?
1. Write up what you learned in a short doc. What instructions made the biggest difference?

This trains your intuition for what belongs in context and what's noise.

## Additional Resources

### Source Notes

Start with the official docs and current model pages first. The remaining links add historical context, canonical books, or supporting examples.

1. [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices): Official guide to CLAUDE.md and context design.
1. [Claude Code Configuration](https://code.claude.com/docs/en/configuration): Official docs on settings, hooks, and project-level controls.
1. [Claude Code Common Workflows](https://code.claude.com/docs/en/common-workflows): Official workflow patterns for reusable commands and repo context.
1. [OpenAI Codex](https://developers.openai.com/codex/): Official Codex documentation for repo-aware coding workflows.
1. [How OpenAI Uses Codex](https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf): Official examples of repo instructions and coding-agent workflow design.
