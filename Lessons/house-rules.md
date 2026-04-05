# House Rules

## Learning Objectives

By the end of this lesson, you will be able to:

1. Configure coding conventions in `CLAUDE.md` so AI-generated code matches your team's style without manual cleanup.
2. Set up linting and formatting tools that run automatically through hooks.
3. Design a `.claude/` directory structure that works for a team, not just an individual.
4. Explain the difference between advisory instructions (CLAUDE.md) and enforced rules (hooks), and when to use each.

## Best Practices

- **Let linters lint.** Don't waste CLAUDE.md instructions on formatting rules your linter already handles. Tabs vs. spaces, semicolons, line length: those belong in `.eslintrc` or `ruff.toml`, not in your AI config.
- **Hooks for hard rules.** If a rule is non-negotiable (no commits to main, no `console.log` in production code, always run tests before committing), use a PreToolUse or PostToolUse hook. Hooks enforce at 100%. CLAUDE.md suggests at ~70%.
- **Share configs through the repo.** Check `.claude/` into version control. When a teammate clones the repo, they get the same commands, settings, and conventions.
- **Separate global from project.** Your personal preferences (`~/.claude/CLAUDE.md`) shouldn't conflict with project conventions (`./CLAUDE.md`). If they do, project wins.
- **Version your conventions.** When team standards change, update CLAUDE.md in the same PR. The convention and the config evolve together.
- **Audit regularly.** Every few weeks, check what instructions the agent actually follows. Remove what it ignores. Strengthen what matters.

# Topic 1: Coding Conventions and Linting with AI

## Overview

Every team has rules. Some are written down ("use camelCase for variables"). Most aren't ("we don't use ternaries because Sarah thinks they're unreadable"). These unwritten rules cause friction when a new person joins, whether that person is human or an AI agent.

Coding conventions are the shared agreements that make a codebase feel like it was written by one person instead of twelve. They cover naming, formatting, error handling patterns, import ordering, comment style, and dozens of other micro-decisions that individually don't matter much but collectively determine whether a codebase is pleasant or painful to work with.

**A brief history of code style enforcement.** In the early days of programming, conventions were tribal knowledge passed down through code review. "We don't do it that way here." In the 1990s, tools like `lint` (originally for C) started automating style checks. The 2000s brought language-specific formatters: `gofmt` for Go (2012) was revolutionary because it eliminated style debates entirely. Go has one format. Period. Python followed with `black` ("the uncompromising code formatter") in 2018. JavaScript got `prettier` around the same time.

The philosophy shifted from "let's agree on a style" to "let the tool decide, and nobody argues." This philosophy is even more important with AI agents.

**Why conventions matter more with AI.** When a human developer joins your team, they absorb conventions gradually through code review and osmosis. An AI agent doesn't absorb anything. Every session starts fresh. If you don't explicitly tell it your conventions, it'll use whatever patterns are most common in its training data. That might be camelCase when your project uses snake_case. Or semicolons when your project omits them.

The result: AI-generated code that works perfectly but looks nothing like the rest of your codebase. Every PR requires manual reformatting. That's wasted time.

**The three layers of convention enforcement:**

1. **Linter/Formatter** (automated, runs on file save or CI): Handles syntactic style. Indentation, line length, import ordering, trailing commas. Tools: `ruff`, `eslint`, `prettier`, `black`, `gofmt`. These catch 80% of style issues automatically.

2. **CLAUDE.md** (advisory, loaded at session start): Handles semantic conventions that linters can't catch. "Use factory functions instead of classes." "Error messages should include the HTTP status code." "Test files go in `__tests__/` not `tests/`." The agent follows these about 70% of the time.

3. **Hooks** (enforced, runs on every tool use): Handles non-negotiable rules. "Run `ruff check` after every file edit." "Block any `Bash` command that includes `rm -rf`." "Run tests before every commit." Hooks enforce at 100%.

**Setting up the stack.** Here's a practical example for a Python project:

```toml
# ruff.toml (linter config - handles formatting)
line-length = 88
target-version = "py312"
select = ["E", "F", "I", "N"]
```

```markdown
# CLAUDE.md (semantic conventions - handles patterns)
## Conventions
- Use `httpx` for HTTP requests, never `requests`.
- Error handling: catch specific exceptions, never bare `except`.
- All API responses use the format: {"data": ..., "error": null}
- Database queries go through the repository pattern in `src/repos/`.
```

```json
// .claude/settings.json (hooks - handles enforcement)
{
  "hooks": {
    "PostToolUse": [
      {
        "tool": "Edit",
        "command": "ruff check --fix $FILE"
      }
    ]
  }
}
```

The linter catches formatting. CLAUDE.md guides patterns. Hooks enforce the linter runs. Three layers, each handling what it's best at.

**The "house rules" analogy.** Think about renting an apartment. Some rules are structural (you can't remove a load-bearing wall). Those are hooks. Some rules are in the lease (no pets over 25 pounds, quiet hours after 10 PM). Those are CLAUDE.md. And some rules are common sense (don't leave dishes in the sink for a week). Those are conventions your linter catches. A good setup has all three layers working together.

# Topic 2: Team Configuration Patterns

## Overview

When you're working solo, your `.claude/` directory is personal. You set it up however you want. When you're on a team, it becomes shared infrastructure. The decisions you make about that directory affect every developer on the team and every AI session they run.

**The `.claude/` directory as team infrastructure:**

```
.claude/
├── CLAUDE.md              # Project conventions (shared)
├── settings.json          # Permissions and hook configuration
├── commands/
│   ├── review.md          # /project:review - team code review checklist
│   ├── test.md            # /project:test - run tests with standard output
│   ├── deploy-check.md    # /project:deploy-check - pre-deployment verification
│   └── onboard.md         # /project:onboard - explain the project to a new dev
└── hooks/
    ├── pre-commit.sh      # Runs before git commits
    └── post-edit.sh       # Runs after file edits
```

Every file in this directory is checked into version control. When a new developer clones the repo, they get the full AI configuration automatically. When someone updates a convention, the change goes through a PR like any code change.

**Project-level vs. global config:**

| Config Level | Location | Scope | Checked In? |
|---|---|---|---|
| **Global** | `~/.claude/CLAUDE.md` | All projects, all sessions | No (personal) |
| **Project** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | This repo only | Yes (shared) |
| **Subdirectory** | `./src/api/CLAUDE.md` | This directory only | Yes (shared) |

When there's a conflict, project overrides global. If your global config says "use tabs" but the project says "use spaces," the project wins. This is correct because project conventions should be consistent across the team regardless of individual preferences.

**Custom commands as team knowledge.** The most underused feature in team setups is custom commands. A custom command is a markdown file in `.claude/commands/` that encodes a workflow. When any team member runs `/project:review`, they get the same review checklist. When they run `/project:onboard`, they get the same project explanation.

This captures institutional knowledge. The senior developer who knows "you always need to check cache invalidation when modifying user endpoints" can encode that in the review command. Now every developer (and every AI session) benefits from that experience.

**Example: a team review command:**

```markdown
<!-- .claude/commands/review.md -->
Review the current branch against main. Check for:

1. Missing or incomplete tests for new functionality
2. Hardcoded values that should be environment variables
3. API endpoints missing authentication middleware
4. Database queries that could cause N+1 problems
5. Error responses that leak internal details

For each issue found, explain: what's wrong, why it matters, and how to fix it.
```

Now `/project:review` runs this checklist consistently across the team.

**Onboarding with AI config.** One of the strongest patterns is the "onboard" command:

```bash
$ claude /project:onboard
```

The agent reads the project's README, CLAUDE.md, architecture docs, and key files, then generates a summary for the new developer. This cuts onboarding time dramatically.

**Configuration governance.** Who gets to change the shared `.claude/` config? Treat it like code: changes go through PRs and code review. This ensures conventions change deliberately, not accidentally.

**Scaling to larger teams.** For teams of 5+ developers:

- **Module-specific CLAUDE.md files**: Each team owns their module's conventions. The frontend team manages `src/frontend/CLAUDE.md`. The API team manages `src/api/CLAUDE.md`.
- **Command libraries**: Create commands for common workflows. New team members get productive faster because workflows are encoded, not tribal.
- **Hook standardization**: Agree on which hooks run globally (linter, test runner) and which are optional (verbose logging, coverage checks).

## Break & Wrap Up

**Key takeaway:** Your `.claude/` directory is team infrastructure, not personal preference. Check it in. Review changes. Encode your team's knowledge in custom commands so every developer and every AI session benefits from collective experience.

**Before next class:** Review your `fixthis` project's `.claude/` setup. Add at least one custom command that captures something you've learned about the codebase.

## After Class Challenges

### Challenge 1: Team Config Setup

Build a complete `.claude/` directory for your project:

1. Create (or refine) a project CLAUDE.md with conventions specific to your codebase.
2. Create a `settings.json` with at least one PostToolUse hook (e.g., run your linter after every edit).
3. Create at least 2 custom commands: one for code review, one for your team's most common workflow.
4. Test each component. Verify the hook runs, the commands work, and the CLAUDE.md is respected.

### Challenge 2: Convention Enforcement Experiment

Test the three layers of enforcement:

1. Add a convention to CLAUDE.md only ("Always use `httpx` instead of `requests`"). Ask Claude Code to make an HTTP call. Does it follow the convention?
2. Now add it as a hook (PostToolUse that greps for `import requests` and warns). Does enforcement improve?
3. Run 5 tasks with each setup. Track compliance rates. Document the difference.

### Challenge 3: Onboarding Command

Create a `/project:onboard` command for your project:

1. Write the command template in `.claude/commands/onboard.md`.
2. It should read key files and generate: project overview, setup instructions, key directories, testing approach, and conventions summary.
3. Test it on a fresh Claude Code session. Does the summary accurately describe your project?
4. Ask a classmate to run it on your repo. Does it give them enough context to start contributing?

## Additional Resources

1. [Claude Code Configuration](https://code.claude.com/docs/en/configuration): Official docs on CLAUDE.md, settings, and hooks.
2. [Claude Code Custom Commands](https://code.claude.com/docs/en/common-workflows): How to create and share slash commands.
3. [Ruff: Python Linter](https://docs.astral.sh/ruff/): The recommended Python linter for Claude Code workflows.
4. [EditorConfig](https://editorconfig.org/): Cross-editor convention sharing (pairs well with CLAUDE.md).
