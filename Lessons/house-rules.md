# House Rules

## Agenda

- [Learning Objectives](#learning-objectives)
- [Best Practices](#best-practices)
- [Coding Conventions and Linting with AI](#coding-conventions-and-linting-with-ai)
  - [Overview: Coding Conventions and Linting with AI](#overview-coding-conventions-and-linting-with-ai)
- [Team Configuration Patterns](#team-configuration-patterns)
  - [Overview: Team Configuration Patterns](#overview-team-configuration-patterns)
- [Break & Wrap Up](#break-wrap-up)
- [After Class Challenges](#after-class-challenges)
  - [Challenge 1: Team Config Setup](#challenge-1-team-config-setup)
  - [Challenge 2: Convention Enforcement Experiment](#challenge-2-convention-enforcement-experiment)
  - [Challenge 3: Onboarding Command](#challenge-3-onboarding-command)
- [Additional Resources](#additional-resources)

## Learning Objectives

By the end of this lesson, you will be able to:

1. Configure coding conventions in `CLAUDE.md` so AI-generated code matches your team's style without manual cleanup.
1. Set up linting and formatting tools that run automatically through hooks.
1. Design a `.claude/` directory structure that works for a team, not just an individual.
1. Explain the difference between advisory instructions (CLAUDE.md) and enforced rules (hooks), and when to use each.

## Best Practices

- **Let linters lint.** Don't waste CLAUDE.md instructions on formatting rules your linter already handles. Tabs vs. spaces, semicolons, line length: those belong in `.eslintrc` or `ruff.toml`, not in your AI config.
- **Hooks for hard rules.** If a rule is non-negotiable (no commits to main, no `console.log` in production code, always run tests before committing), use a PreToolUse or PostToolUse hook. Hooks enforce the rule. `CLAUDE.md` only advises the model.
- **Share configs through the repo.** Check `.claude/` into version control. When a teammate clones the repo, they get the same commands, settings, and conventions.
- **Separate global from project.** Your personal preferences (`~/.claude/CLAUDE.md`) shouldn't conflict with project conventions (`./CLAUDE.md`). If they do, project wins.
- **Version your conventions.** When team standards change, update CLAUDE.md in the same PR. The convention and the config evolve together.
- **Audit regularly.** Every few weeks, check what instructions the agent actually follows. Remove what it ignores. Strengthen what matters.
- **💼 Use Case.** Add shared commands, hooks, and conventions as soon as `fixthis` or `makeanything` starts involving repeated workflows or multiple contributors.
- **🛠️ Pro Tip.** Codex facts: cross-session consistency comes from repo rules plus automated checks, not from increasingly long style prompts.

**Builds On:** Day 7 brownfield exploration and the repo patterns students uncovered there.

**Feeds:** `fixthis` hardening, `makeanything` team defaults, and shared project automation.

## Coding Conventions and Linting with AI

### Overview: Coding Conventions and Linting with AI

Students see this the first time `fixthis` produces code that works but looks foreign to the repo. The practical problem is drift, and the solution is layered enforcement instead of one giant instruction file.

Every team has rules. Some are written down ("use camelCase for variables"). Most aren't ("we don't use ternaries because Sarah thinks they're unreadable"). These unwritten rules cause friction when a new person joins, whether that person is human or an AI agent.

Coding conventions are the shared agreements that make a codebase feel like it was written by one person instead of twelve. They cover naming, formatting, error handling patterns, import ordering, comment style, and dozens of other micro-decisions that individually don't matter much but collectively determine whether a codebase is pleasant or painful to work with.

**A brief history of code style enforcement.** In the early days of programming, conventions were tribal knowledge passed down through code review. "We don't do it that way here." In the 1990s, tools like `lint` (originally for C) started automating style checks. The 2000s brought language-specific formatters: `gofmt` for Go (2012) was revolutionary because it eliminated style debates entirely. Go has one format. Period. Python followed with `black` ("the uncompromising code formatter") in 2018. JavaScript got `prettier` around the same time.

The philosophy shifted from "let's agree on a style" to "let the tool decide, and nobody argues." This philosophy is even more important with AI agents.

**Why conventions matter more with AI.** When a human developer joins your team, they absorb conventions gradually through code review and osmosis. An AI agent doesn't absorb anything. Every session starts fresh. If you don't explicitly tell it your conventions, it'll use whatever patterns are most common in its training data. That might be camelCase when your project uses snake_case. Or semicolons when your project omits them.

The result: AI-generated code that works perfectly but looks nothing like the rest of your codebase. Every PR requires manual reformatting. That's wasted time.

**The three layers of convention enforcement:**

1. **Linter/Formatter** (automated, runs on file save or CI): Handles syntactic style. Indentation, line length, import ordering, trailing commas. Tools: `ruff`, `eslint`, `prettier`, `black`, `gofmt`. These catch most routine style issues automatically.

1. **CLAUDE.md** (advisory, loaded at session start): Handles semantic conventions that linters can't catch. "Use factory functions instead of classes." "Error messages should include the HTTP status code." "Test files go in `__tests__/` not `tests/`." The agent often follows these, but they are still advisory.

1. **Hooks** (enforced, runs on every tool use): Handles non-negotiable rules. "Run `ruff check` after every file edit." "Block any `Bash` command that includes `rm -rf`." "Run tests before every commit." Hooks enforce the rule on every run.

**Setting up the stack.** Here's a practical example for a Python project:

```toml
### ruff.toml (linter config - handles formatting)
line-length = 88
target-version = "py312"
select = ["E", "F", "I", "N"]
```

```markdown
### CLAUDE.md (semantic conventions - handles patterns)
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

**The workshop-floor analogy.** Think about a shared machine shop. Some constraints are physical interlocks that stop dangerous actions. Those are hooks. Some live in the posted operating sheet beside the machine. Those are `CLAUDE.md` conventions. Others are routine cleanup and measurement habits that good tooling catches automatically. A reliable shop needs all three layers at once.

**🏫 What This Looks Like in Class.** `fixthis` is where students feel the difference between advisory and enforced rules. If the repo conventions only live in a paragraph nobody reads, drift shows up immediately. If the conventions live in tooling, commands, and repo instructions, the assignment starts behaving like a maintained project instead of a loose pile of files.

### Claude Code Workflow: Coding Conventions and Linting with AI

Students understand this lesson fastest when they watch the three layers disagree and then converge. Start with a repo that has no tooling. Ask Claude Code to add a helper function. Let it produce code in a style that is merely plausible. Then add a linter config and rerun the task. Students will see the syntactic layer tighten immediately. After that, add a short `CLAUDE.md` convention like "all HTTP calls go through `httpx`" and run the task again. Finally, add a hook that runs the linter or blocks a forbidden pattern. The comparison is the lesson. They will see that formatters clean syntax, instruction files shape patterns, and hooks enforce non-negotiable policy. That live contrast matters because beginners often stuff everything into one giant prompt and then wonder why the result drifts. This lesson teaches that reliable agent behavior comes from layered controls, not louder phrasing.

### Codex Workflow: Coding Conventions and Linting with AI

The Codex version of this stack lives in project-level instructions, tool configuration, and approval rules. Instead of telling students to memorize vendor-specific nouns, teach the invariant: frontier coding agents need one place for repo-wide guidance, one place for enforced checks, and one place for task-specific context. In Claude Code that often means `CLAUDE.md` plus hooks. In Codex it looks more like `AGENTS.md`, tool permissions, planning, and automated verification commands. The engineering principle is identical. If formatting can be enforced by a formatter, keep it out of the instruction file. If a rule is dangerous to violate, make the toolchain stop the run. And if a rule is team culture rather than syntax, put it where every session can load it cheaply. That cross-tool framing is what keeps students from turning every new agent into a fresh learning curve.

## Team Configuration Patterns

### Overview: Team Configuration Patterns

Use the course repo itself as the anchor: when commands, hooks, and lint rules are shared, the next session starts faster and reviews get quieter. That is the team configuration story in one sentence.

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

**🏫 What This Looks Like in Class.** The final project is where students can actually use this pattern with teammates. The students who encode setup, review, and test behavior once usually spend less time explaining their repo every time someone else touches it. That is the same scaling win teams chase in production.

### Claude Code Workflow: Team Configuration Patterns

Demo a clean onboarding path. Clone a repo with a shared `.claude/` directory, then run the onboarding command and the review command in front of students. Narrate what the agent can infer because the team bothered to encode it once. Then compare that with a repo that has no shared config and ask the tool to do the same review. The point is not to shame the unconfigured repo. The point is to show the cost of tribal knowledge. On a team, undocumented workflow is latency. Every missing command becomes repeated explanation, every missing convention becomes review churn, and every unowned config file becomes silent drift. This topic is also a good place to talk about change control: when a rule changes, ship the code change and the config change in the same PR. That habit is the difference between "AI adoption" as a demo and "AI adoption" as an operating model.

### Codex Workflow: Team Configuration Patterns

Codex teams solve the same scaling problem with shared repo instructions, reusable workflows, and automation that can run in local or cloud environments. If a team wants Codex to create branches, review diffs, or plan safe file edits consistently, those expectations must live in the repository rather than in one developer's head. Students should hear that clearly: the winning habit is not "pick the smartest model." It is "build a shared execution environment." Claude Code commands, Codex task plans, GitHub automations, and worktree policies all become more reliable when the repository tells the agent what good work looks like. That is why platform teams matter in AI-assisted development. Somebody has to own the defaults.

## Break & Wrap Up

**🔥 Key takeaway:** Your `.claude/` directory is team infrastructure, not personal preference. Check it in. Review changes. Encode your team's knowledge in custom commands so every developer and every AI session benefits from collective experience.

**🧩 Before next class:** Review your `fixthis` project's `.claude/` setup. Add at least one custom command that captures something you've learned about the codebase.

### Pro Tip: Treat Release Config Like Production Code

One strong lesson from the March 31, 2026 Claude Code packaging mistake is that operational files are not "just tooling." Packaging rules, ignore files, build flags, and publish commands decide what the outside world can inspect. Review them as seriously as app code. If you ship a package, maintain an explicit allowlist of files, automate provenance, and make the release path reproducible. 🔐

### Fun Fact: The Internet Made `.npmignore` Famous Again

Most students do not expect package manifests to become headline material. Then a public artifact leak happens and suddenly everyone is reading `files`, `.npmignore`, and source-map settings like they are thriller novels. It is funny, but it also makes an important point: boring config often decides whether your sharp engineering work stays private, reproducible, and safe. 📦

### Debrief Questions

Close by asking which rules belong in the linter, which belong in agent instructions, and which deserve a hard stop in hooks. If students can sort rules into those three buckets without guessing, they understood the lesson at the systems level.

## After Class Challenges

### Challenge 1: Team Config Setup

Build a complete `.claude/` directory for your project:

1. Create (or refine) a project CLAUDE.md with conventions specific to your codebase.
1. Create a `settings.json` with at least one PostToolUse hook (e.g., run your linter after every edit).
1. Create at least 2 custom commands: one for code review, one for your team's most common workflow.
1. Test each component. Verify the hook runs, the commands work, and the CLAUDE.md is respected.

### Challenge 2: Convention Enforcement Experiment

Test the three layers of enforcement:

1. Add a convention to CLAUDE.md only ("Always use `httpx` instead of `requests`"). Ask Claude Code to make an HTTP call. Does it follow the convention?
1. Now add it as a hook (PostToolUse that greps for `import requests` and warns). Does enforcement improve?
1. Run 5 tasks with each setup. Track compliance rates. Document the difference.

### Challenge 3: Onboarding Command

Create a `/project:onboard` command for your project:

1. Write the command template in `.claude/commands/onboard.md`.
1. It should read key files and generate: project overview, setup instructions, key directories, testing approach, and conventions summary.
1. Test it on a fresh Claude Code session. Does the summary accurately describe your project?
1. Ask a classmate to run it on your repo. Does it give them enough context to start contributing?

## Additional Resources

### Source Notes

Start with the official docs and current model pages first. The remaining links add historical context, canonical books, or supporting examples.

1. [Claude Code Configuration](https://code.claude.com/docs/en/configuration): Official docs on CLAUDE.md, settings, and hooks.
1. [Claude Code Custom Commands](https://code.claude.com/docs/en/common-workflows): How to create and share slash commands.
1. [Ruff: Python Linter](https://docs.astral.sh/ruff/): The recommended Python linter for Claude Code workflows.
1. [EditorConfig](https://editorconfig.org/): Cross-editor convention sharing (pairs well with CLAUDE.md).
1. [How OpenAI Uses Codex](https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf): Official patterns for turning coding-agent behavior into repeatable team workflows.
1. [package.json `files`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#files): Official npm guidance on shipping only the files you intend to publish.
1. [Source Map](https://developer.mozilla.org/en-US/docs/Glossary/Source_map): MDN explanation of how debug artifacts can reveal original source structure.
