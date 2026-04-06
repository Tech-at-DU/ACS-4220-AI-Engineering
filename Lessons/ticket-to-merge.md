# Ticket to Merge

## Agenda

- [Learning Objectives](#learning-objectives)
- [Best Practices](#best-practices)
- [The Full Development Loop with AI](#the-full-development-loop-with-ai)
  - [Overview: The Full Development Loop with AI](#overview-the-full-development-loop-with-ai)
- [GitHub Integration with Claude Code](#github-integration-with-claude-code)
  - [Overview: GitHub Integration with Claude Code](#overview-github-integration-with-claude-code)
- [Break & Wrap Up](#break-wrap-up)
- [After Class Challenges](#after-class-challenges)
  - [Challenge 1: Full Loop Sprint](#challenge-1-full-loop-sprint)
  - [Challenge 2: Commit Message Audit](#challenge-2-commit-message-audit)
  - [Challenge 3: PR Review Comparison](#challenge-3-pr-review-comparison)
- [Additional Resources](#additional-resources)

## Learning Objectives

By the end of this lesson, you will be able to:

1. Execute the full development loop with AI assistance: issue → branch → implement → test → PR → review → merge.
1. Use Claude Code's GitHub integration to create branches, generate commits, open PRs, and review code.
1. Write commit messages and PR descriptions that tell a clear story of what changed and why.
1. Identify which parts of the dev loop benefit most from AI assistance and which still need human judgment.

## Best Practices

- **One ticket, one branch, one PR.** Don't bundle unrelated changes. Agents generate cleaner code when the scope is narrow and well-defined.
- **Branch from main, merge to main.** Keep your branch strategy linear. The agent doesn't need to understand your team's complex branching philosophy if there's only one path.
- **Commit early, commit often.** Small commits make it easier to trace what the agent did and roll back if something goes wrong. A commit history should read like a story.
- **Review AI-generated PRs like you'd review a junior engineer's.** Don't rubber-stamp. Read the diff. Check edge cases. Verify tests actually test what they claim.
- **Let the agent write the first draft.** It's seen the full diff. It knows what changed. Edit for accuracy and tone, but don't start from scratch.
- **Automate what you repeat.** If you do the same PR setup every time, encode it in a custom command.
- **💼 Use Case.** Run one-ticket, one-branch, one-PR loops in `firstbuild` and `fixthis` so agent output stays reviewable.
- **🛠️ Pro Tip.** Codex can summarize diffs and draft PR text too, but the human reviewer still decides whether the branch actually satisfies the issue.

**Builds On:** the first two lessons plus Tutorial 1 prompt discipline.

**Feeds:** Day 4 workflow automation and cleaner commit/PR habits in `firstbuild`.

## The Full Development Loop with AI

### Overview: The Full Development Loop with AI

By Day 3, students already have enough `firstbuild` work to feel the drag of manual branching, testing, and PR setup. This topic is really about compressing that glue work without giving up review.

Software development has always been a loop. You identify a problem, plan a solution, write the code, test it, get it reviewed, and ship it. This loop existed before version control, before agile, before pull requests. The tools changed. The loop didn't.

What AI changes isn't the loop itself. It changes who (or what) does the work at each step.

**A brief history of the loop.** In the 1970s, the loop was: write code on paper → punch cards → submit to mainframe → wait hours → check output → repeat. In the 1990s, it became: write code in an IDE → compile → run → debug → commit to CVS. In the 2000s, git and GitHub transformed it: branch → code → test → PR → code review → merge → deploy. Each era's tools compressed the loop. AI compresses it further.

The modern AI-assisted loop looks like this:

1. **Issue**: Someone creates a ticket describing what needs to happen. In 2026, some teams use AI to triage and prioritize issues, but humans still define the "what" and "why."
1. **Branch**: You create a feature branch. Claude Code can do this: "Create a branch called `feature/add-health-endpoint` from main."
1. **Implement**: This is where AI shines brightest. You describe the feature. The agent reads your codebase, writes the code, creates tests, and iterates until things pass.
1. **Test**: The agent runs your test suite and fixes failures. But you verify that the tests actually cover the right behavior. Agents are great at making tests pass, less great at knowing what to test.
1. **PR**: The agent generates a pull request with a title, description, and summary of changes. It's read the full diff, so it describes what changed more accurately than you can from memory.
1. **Review**: This is where human judgment is irreplaceable. You read the diff, check edge cases, verify the approach makes architectural sense. Claude Code can also act as a reviewer, but it supplements rather than replaces human review.
1. **Merge**: If everything looks good, merge and deploy.

**The newsroom analogy.** Think of a small editorial desk. Before AI, one editor chased the sources, drafted the copy, cleaned the wording, checked the facts, and pushed publish. AI-assisted tools are like a copy editor fixing sentences as you type. Agent-driven tools are more like a reporting assistant that can pull the brief, draft the first version, assemble evidence, and prepare it for review. You still decide whether the story is accurate enough to run.

**What the loop looks like in practice.** Here's a real sequence of commands that take you from ticket to merge:

```bash
### Start from the issue
$ claude "Read issue #42 and create a feature branch for it"

### Implement the feature
$ claude "Implement the changes described in issue #42. Write tests first."

### Check the work
$ claude "Run all tests and fix any failures"

### Create the PR
$ claude "Create a PR for this branch. Reference issue #42 in the description."
```

Four commands. The agent handles dozens of intermediate steps: reading the issue, understanding the codebase, writing code, creating test files, running the test suite, fixing failures, staging changes, writing commit messages, pushing the branch, and opening the PR. You specify outcomes. It handles execution.

**Where public examples line up.** Anthropic and OpenAI both publish engineering examples where coding agents handle bounded implementation work, draft reviews, and verification steps once the task is well specified. The repeatable pattern is not “give the agent everything.” It is “bound the work, encode the repo rules, and review the result.”

**Where it breaks down.** The loop struggles with ambiguity. If the ticket says "improve the checkout flow" without specifics, the agent will guess. Guessing at the ticket level is expensive because it cascades through every subsequent step. The clearer your specification, the better the loop works. (That's Day 5's topic: "Words Before Code.")

### Claude Code Workflow: The Full Development Loop with AI

Run one tiny issue from creation to PR in front of the class. Keep the scope small enough that students can see the whole loop without getting lost in domain details. The point is to make the invisible overhead visible: branch naming, issue context, commit hygiene, test runs, PR text, and review. Once students see all the glue work the agent can shoulder, they understand why this is not merely "better autocomplete." It is workflow compression.

### Codex Workflow: The Full Development Loop with AI

Codex supports the same ticket-to-merge operating model when you give it a bounded task, a repository, and a verification contract. The right cross-tool lesson here is that agent leverage increases with workflow clarity. Whether the agent is Claude Code or Codex, it can only accelerate the loop when the issue is specific, the repo rules are encoded, and the review standard is clear.

## GitHub Integration with Claude Code

### Overview: GitHub Integration with Claude Code

Ground this in the actual repo workflow students already use: issue, branch, commit, PR, review. The question is how much of that handoff can be drafted by the agent while the human still owns accuracy.

Git and GitHub aren't just tools developers happen to use. They're the communication layer of modern software teams. Commits tell the story of what changed. PRs are where decisions get made. Issues track what needs to happen. Code review is where knowledge transfers. Every one of these touchpoints is a place where AI can either help or get in the way.

**How Claude Code connects to GitHub.** Claude Code uses the `gh` CLI (GitHub's official command-line tool) under the hood. When you ask it to "create a PR," it's running `gh pr create` with the right flags. When you ask it to "read issue #42," it's running `gh issue view 42`. This means anything you can do with `gh`, the agent can do too.

**The key integrations:**

**Branch management.** The agent creates branches following your team's naming convention (if you've specified one in CLAUDE.md). It checks out existing branches, rebases when needed, and handles the git plumbing you'd rather not think about.

**Commit generation.** One of the most underappreciated features. Claude Code writes commit messages that are actually descriptive. Not "fix stuff" or "WIP." It's read the diff. It knows what changed and can articulate it clearly.

The quality trick: specify your commit message style in CLAUDE.md. "Write commit messages in present tense. Start with a category prefix (feat/fix/docs/refactor). Keep the first line under 72 characters. Add a body explaining why, not what." The agent follows this consistently.

**Pull request creation.** When you ask Claude Code to create a PR, it:

1. Analyzes the diff between your branch and the base branch.
1. Writes a title that summarizes the change.
1. Generates a description covering what changed, why, and how to test it.
1. Links related issues if you've mentioned them.
1. Pushes the branch and opens the PR on GitHub.

The output isn't always perfect. It sometimes over-explains obvious changes or misses strategic context ("this is prep for the upcoming API redesign"). That's why you review the description. But it's a dramatically better starting point than a blank text box.

**PR review as reviewer.** You can point Claude Code at a PR and ask it to review the changes. It reads the diff, identifies potential issues (missing error handling, untested edge cases, inconsistent naming), and provides feedback. Some teams use this as a first-pass filter: the agent catches mechanical issues, humans focus on design and architecture.

**Issue triage.** For repos with many open issues, Claude Code can read through them, categorize by type (bug, feature, documentation), estimate complexity, and suggest which ones are good candidates for AI-assisted implementation.

**The `gh` CLI power moves.** Commands that pair especially well with Claude Code:

```bash
### View PR checks and fix failures
$ claude "Check the CI status of this PR and fix any failing tests"

### Review a specific PR
$ claude "Review PR #87. Focus on security and performance."

### Search for related issues
$ claude "Find open issues related to authentication and summarize them"
```

**Real workflow patterns.** The strongest pattern is "Claude Code as first responder." When a bug report comes in, the agent reads the issue, finds the relevant code, writes a failing test that reproduces the bug, then implements the fix. The developer reviews the PR, verifies the fix makes sense, and merges. The human work shifts from full investigation and implementation to focused review and judgment.

Another pattern: "PR description upgrade." Even if you wrote the code yourself, you can ask Claude Code to write the PR description. It reads your commits, understands the changes, and writes a description that's more thorough than what most developers write by hand. It's leveraging the tool for what it's good at.

**What to watch for.** Agents sometimes create descriptions that sound confident but are subtly wrong. They might describe a function as "handling all edge cases" when it doesn't. They might claim "comprehensive test coverage" when the tests only cover the happy path. Read the description against the actual diff. The description is a draft, not a source of truth.

### Claude Code Workflow: GitHub Integration with Claude Code

Show a draft PR description that is mostly right but still wrong in one or two important places. Then fix it in public. That is a powerful moment because students learn that review is still a human job even when the draft feels polished. The writing looks professional. The facts still need checking.

### Codex Workflow: GitHub Integration with Claude Code

Codex can help with the same workflow in GitHub-centered environments: summarize a diff, draft a PR description, flag likely issues, and propose follow-up tasks. The engineering rule does not change. Treat the agent's PR text as a well-informed draft, not a legal document. Verify it against the actual diff and the real issue scope.

## Break & Wrap Up

**🔥 Key takeaway:** The development loop hasn't changed. The distribution of labor has. AI handles the mechanical parts (branching, committing, describing, initial review). Humans handle the judgment parts (what to build, whether it's correct, whether it fits the architecture).

**🧩 Before next class:** Complete one full loop: pick a small feature or bug, use Claude Code to go from issue to merged PR. You'll share your experience in the Day 4 activity.

### Pro Tip: PR Descriptions Are Interfaces

Good PR text reduces review latency because reviewers do not have to reverse-engineer intent from the diff alone. Let the agent draft it, then edit it until it says what changed, why it changed, and how to verify it. 📨

### Fun Fact: Release Incidents Teach Review Culture

One underrated lesson from public artifact incidents is how fast engineers start reading release notes, package manifests, and commit trails when something goes wrong. Review culture becomes visible the moment the artifact becomes public. 🔍

### Instructor Closing Loop

End the lesson by asking students to name the one part of the loop they are most tempted to skip when an agent is moving fast. Then tie that answer back to review quality. Speed is useful only when the handoff from issue to branch to PR stays legible to the next human in the chain.

## After Class Challenges

### Challenge 1: Full Loop Sprint

Execute the complete development loop on a real task:

1. Create an issue on GitHub describing a feature or bug fix.
1. Use Claude Code to create a branch, implement the change, write tests, and open a PR.
1. Review the PR yourself. Note what the agent got right and what you'd change.
1. Merge the PR.
1. Document the full sequence of commands and the agent's tool calls.

### Challenge 2: Commit Message Audit

Look at your last 10 commit messages. Then:

1. Ask Claude Code to rewrite each one based on the actual diff.
1. Compare: are the AI-generated messages more descriptive? More consistent?
1. Add commit message guidelines to your `CLAUDE.md` based on what you learned.

This builds a context artifact that improves every future commit.

### Challenge 3: PR Review Comparison

Find an open PR in a public repo (or one of your own). Review it yourself first, writing down every issue you spot. Then ask Claude Code to review the same PR. Compare:

1. What did the agent catch that you missed?
1. What did you catch that the agent missed?
1. What did the agent flag that you disagree with?

Write up the comparison. This calibrates your expectations for AI-assisted code review.

## Additional Resources

### Source Notes

Start with the official docs and current model pages first. The remaining links add historical context, canonical books, or supporting examples.

1. [GitHub CLI Documentation](https://cli.github.com/manual/): Complete reference for `gh` commands.
1. [Claude Code Common Workflows](https://code.claude.com/docs/en/common-workflows): Official workflow patterns including GitHub integration.
1. [Conventional Commits](https://www.conventionalcommits.org/): The commit message standard referenced in this lesson.
1. [How to Write Better Commit Messages](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/): Commit message habits that transfer to AI-generated messages.
1. [OpenAI Codex](https://developers.openai.com/codex/): Official Codex documentation for repository workflows and coding tasks.
