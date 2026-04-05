# Memory Is Everything

## Learning Objectives

By the end of this lesson, you will be able to:

1. Design a `CLAUDE.md` file that gives an agent the right context without overwhelming it.
2. Explain the context hierarchy: global config, project root, subdirectory overrides, and session-level `@` mentions.
3. Build custom slash commands that encode your team's workflows into reusable tools.
4. Articulate why context engineering has replaced "prompt engineering" as the core skill.

## Best Practices

- **Less is more.** Keep your root `CLAUDE.md` under 100 lines. Every instruction competes for the model's attention budget. If it doesn't apply to every session, it doesn't belong at the root.
- **Pointers, not copies.** Don't paste code snippets into `CLAUDE.md`. They go stale. Reference file paths instead: "See `src/config/db.ts` for the database connection pattern." The agent reads the file when it needs to.
- **Layer your context.** Global config for personal preferences, project root for repo-wide rules, subdirectory files for module-specific instructions. Each layer narrows the focus.
- **Use hooks for enforcement.** `CLAUDE.md` instructions get followed about 70% of the time. Hooks enforce rules at 100%. If something is critical (like "never commit to main"), make it a hook.
- **Custom commands save tokens.** A `.claude/commands/review.md` file that encodes your review checklist replaces a long prompt you'd type every time.
- **Run `/init` on new repos.** It generates a starter `CLAUDE.md` by scanning your codebase. Not perfect, but better than a blank file.

# Topic 1: The Context Hierarchy

## Overview

Here's a question that seems obvious but most people get wrong: what does your AI tool actually know when you start a session?

If you've ever started a new job, you know the answer depends entirely on the documentation. Some teams hand you a wiki with everything: architecture diagrams, coding standards, deployment procedures, a glossary of internal jargon. You're productive in days. Other teams hand you a laptop and say "ask Steve." Steve is on vacation. You spend two weeks reading source code and guessing.

Claude Code's `CLAUDE.md` system is the difference between those two onboarding experiences. It's a layered documentation system that tells the agent everything it needs to know about your project, your team, and your preferences before it writes a single line of code.

**The hierarchy, from broadest to narrowest.**

Think of it like a funnel. At the top, rules that apply to everything you do. At the bottom, rules that only matter for one specific folder.

1. **Global config** (`~/.claude/CLAUDE.md`): Personal preferences that follow you everywhere. Your coding style, your preferred test framework, your pet peeves. This loads in every session across every project. Example: "Always use TypeScript strict mode. Prefer `vitest` over `jest`. Write commit messages in present tense."

2. **Project root** (`./CLAUDE.md`): Repo-specific instructions. Tech stack, architecture decisions, how to run tests, environment setup. This is the most important file in your project for AI-assisted development. Example: "This is a Django 5.1 app. Run tests with `python manage.py test`. Use `ruff` for linting. The database is PostgreSQL."

3. **Subdirectory overrides** (`./src/api/CLAUDE.md`): Module-specific rules that only load when the agent works in that directory. Useful for monorepos or projects with distinct subsystems. Example: "This directory contains the REST API. All endpoints follow the pattern in `src/api/templates/endpoint.py`. Responses use camelCase JSON keys."

4. **Session-level context** (`@` mentions and `/init`): Temporary context you inject during a conversation. `@filename` pulls a specific file into the agent's attention. `/init` generates a `CLAUDE.md` by scanning the repo.

**Why layers matter.** Without layering, you'd need one massive file that covers everything. That file would be thousands of lines, most of it irrelevant to any given task. The model has a hard limit on how many instructions it can reliably follow (roughly 150-200 for frontier models, and Claude Code's own system prompt uses about 50 of those). Every irrelevant instruction in your `CLAUDE.md` pushes out a relevant one.

**The employee handbook analogy.** Your global config is your personal work philosophy (how you like to communicate, your coding principles). Your project `CLAUDE.md` is the team handbook (how this specific team operates). Subdirectory files are desk manuals for specific roles. And `@` mentions are like tapping someone on the shoulder and saying "look at this specific thing right now."

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

**Real-world usage.** At Anthropic, the team that builds Claude Code maintains a `CLAUDE.md` that specifies their TypeScript conventions, test patterns, and architectural principles. When a new engineer joins, they clone the repo and Claude Code already knows how the team works. Open source projects like Sentry and Supabase have started shipping `CLAUDE.md` files so that contributors using AI tools automatically follow project conventions.

**What changed in 2026.** The biggest shift is **hooks** (PreToolUse and PostToolUse). Before hooks, `CLAUDE.md` was the only way to guide behavior, and it was advisory. Hooks are enforced at 100%. A PreToolUse hook can block the agent from running `rm -rf` or committing to main. A PostToolUse hook can automatically run your linter after every file edit. The combination of `CLAUDE.md` (advisory) and hooks (enforced) gives you both flexibility and safety.

# Topic 2: Context Engineering as a Discipline

## Overview

You've probably heard the term "prompt engineering." It was everywhere in 2023 and 2024. The idea was that if you phrased your request just right, with perfect wording and the right magic incantations, the AI would give you better results. People wrote entire books about prompt templates. Job postings asked for "prompt engineering experience."

Here's the thing: prompt engineering was always the wrong frame.

It's like optimizing the wording of your order at a restaurant while ignoring the fact that the kitchen doesn't have the ingredients. You can ask for the perfect steak with exquisite politeness, but if the fridge is empty, you're getting nothing. The ingredients matter more than the order.

**Context engineering** is the discipline of designing what your AI tools know, not how you ask them. It's the shift from "How do I phrase this prompt?" to "What information does this tool need to make a good decision?" That second question is harder, more interesting, and more valuable.

**Where the term came from.** The phrase gained traction in the AI developer community during late 2024 and early 2025. Anthropic's engineering blog used it to describe the practice of designing CLAUDE.md files, custom commands, and project structures that feed the right information to the agent at the right time. It caught on because it reframed the conversation from clever wording to system design.

The underlying insight isn't new. Software engineers have always known that garbage in equals garbage out. Context engineering is just that principle applied to AI tools. The "garbage" isn't bad data. It's missing data. An agent with no context about your project will write generic code that doesn't match your conventions, ignores your architecture, and breaks your tests. An agent with good context writes code that fits.

**The three dimensions of context.** When you're designing context for an AI tool, you're making decisions along three axes:

1. **Relevance**: Is this information useful for the task at hand? A rule about database naming conventions matters when the agent writes a migration. It doesn't matter when it's updating a README.

2. **Freshness**: Is this information current? Code snippets pasted into CLAUDE.md go stale the moment someone refactors. File path references stay accurate because the agent reads the current version.

3. **Priority**: Which instructions matter most? If you have 200 lines of instructions and the model reliably follows 150, the bottom 50 get dropped. Put your most important rules first.

**The new hire test.** Here's a practical exercise: imagine hiring a mid-level engineer who's never seen your codebase. What would you put in their onboarding doc? That's your `CLAUDE.md`. What would you tell them on their first day? That's your session context. What would you let them discover on their own by reading code? That's what you leave out.

If you'd tell a new hire "we use tabs, not spaces" but you wouldn't write it in the onboarding doc because your linter catches it, then it doesn't belong in `CLAUDE.md` either. Let the linter do linting. Use hooks if you need enforcement.

**Why this matters for your career.** AI engineering job descriptions in 2026 don't ask "can you write good prompts?" They ask "can you design context systems that make AI tools effective across a team?" That's a system design question. It involves understanding your codebase, your team's workflows, your deployment pipeline, and how to encode all of that into artifacts that AI tools can consume. It's closer to DevOps than it is to creative writing.

**The context budget.** Here's a number to keep in your head: frontier thinking models reliably follow about 150-200 instructions. Claude Code's own system prompt takes roughly 50 of those. That leaves you about 100-150 instruction slots across your global config, project CLAUDE.md, and subdirectory files combined.

That's not a lot. It means every instruction has to earn its place. "Use camelCase for variables" is worth a slot if your project mixes conventions. It's not worth it if your linter already enforces it. "Never push directly to main" is worth a slot (or better yet, a hook). "Be nice in code review comments" is not worth a slot because the agent doesn't write code review comments unless you specifically ask.

**Measuring context quality.** How do you know if your context is good? Run the same task twice: once with your CLAUDE.md, once without. Compare the output. If the context version follows your conventions, uses the right patterns, and requires fewer corrections, your context is working. If both versions look the same, your context isn't adding value. Cut what doesn't help. Add what's missing.

## Break & Wrap Up

**Key takeaway:** The quality of your AI tool's output is directly proportional to the quality of context you provide. Design your `CLAUDE.md` like you'd design an onboarding system for a new team member.

**Before next class:** Refine the `CLAUDE.md` you created in Lesson 1. Add at least one custom command in `.claude/commands/`. You'll use both in the Day 3 workflow.

## After Class Challenges

### Challenge 1: Context Hierarchy Buildout

Set up the full context hierarchy for your project:

1. Create or update your global `~/.claude/CLAUDE.md` with your personal coding preferences.
2. Create or update your project root `CLAUDE.md` with project-specific instructions.
3. Create at least one subdirectory `CLAUDE.md` with module-specific rules.
4. Test the hierarchy: ask Claude Code to do a task that touches both the root and subdirectory contexts. Verify it follows rules from both levels.

### Challenge 2: Custom Command Workshop

Create three custom slash commands in `.claude/commands/`:

1. A **review** command that runs your project's specific code review checklist.
2. A **test** command that runs tests and summarizes results in a specific format.
3. A **setup** command that onboards a fresh checkout (install deps, set up env, verify everything works).

Test each command and iterate until the output is consistently useful. These become part of your personal toolkit for every future project.

### Challenge 3: Context Quality Benchmark

Run an experiment:

1. Pick a task you've already done (or a new small feature).
2. Run it with an empty CLAUDE.md. Save the output.
3. Run the same task with your current CLAUDE.md. Save the output.
4. Compare: Did the context version follow conventions better? Require fewer corrections? Fewer loops?
5. Write up what you learned in a short doc. What instructions made the biggest difference?

This trains your intuition for what belongs in context and what's noise.

## Additional Resources

1. [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices): Official guide to CLAUDE.md and context design.
2. [Writing a Good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md): Community deep dive on what works and what doesn't.
3. [Context Engineering from Anthropic](https://01.me/en/2025/12/context-engineering-from-claude/): Analysis of Anthropic's context engineering practices.
4. [How I Use Every Claude Code Feature](https://blog.sshh.io/p/how-i-use-every-claude-code-feature): Developer walkthrough of the full Claude Code toolkit.
