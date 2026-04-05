# Ticket to Merge

## Learning Objectives

By the end of this lesson, you will be able to:

1. Execute the full development loop with AI assistance: issue → branch → implement → test → PR → review → merge.
2. Use Claude Code's GitHub integration to create branches, generate commits, open PRs, and review code.
3. Write commit messages and PR descriptions that tell a clear story of what changed and why.
4. Identify which parts of the dev loop benefit most from AI assistance and which still need human judgment.

## Best Practices

- **One ticket, one branch, one PR.** Don't bundle unrelated changes. Agents generate cleaner code when the scope is narrow and well-defined.
- **Branch from main, merge to main.** Keep your branch strategy linear. The agent doesn't need to understand your team's complex branching philosophy if there's only one path.
- **Commit early, commit often.** Small commits make it easier to trace what the agent did and roll back if something goes wrong. A commit history should read like a story.
- **Review AI-generated PRs like you'd review a junior engineer's.** Don't rubber-stamp. Read the diff. Check edge cases. Verify tests actually test what they claim.
- **Let the agent write the first draft.** It's seen the full diff. It knows what changed. Edit for accuracy and tone, but don't start from scratch.
- **Automate what you repeat.** If you do the same PR setup every time, encode it in a custom command.

# Topic 1: The Full Development Loop with AI

## Overview

Software development has always been a loop. You identify a problem, plan a solution, write the code, test it, get it reviewed, and ship it. This loop existed before version control, before agile, before pull requests. The tools changed. The loop didn't.

What AI changes isn't the loop itself. It changes who (or what) does the work at each step.

**A brief history of the loop.** In the 1970s, the loop was: write code on paper → punch cards → submit to mainframe → wait hours → check output → repeat. In the 1990s, it became: write code in an IDE → compile → run → debug → commit to CVS. In the 2000s, git and GitHub transformed it: branch → code → test → PR → code review → merge → deploy. Each era's tools compressed the loop. AI compresses it further.

The modern AI-assisted loop looks like this:

1. **Issue**: Someone creates a ticket describing what needs to happen. In 2026, some teams use AI to triage and prioritize issues, but humans still define the "what" and "why."
2. **Branch**: You create a feature branch. Claude Code can do this: "Create a branch called `feature/add-health-endpoint` from main."
3. **Implement**: This is where AI shines brightest. You describe the feature. The agent reads your codebase, writes the code, creates tests, and iterates until things pass.
4. **Test**: The agent runs your test suite and fixes failures. But you verify that the tests actually cover the right behavior. Agents are great at making tests pass, less great at knowing what to test.
5. **PR**: The agent generates a pull request with a title, description, and summary of changes. It's read the full diff, so it describes what changed more accurately than you can from memory.
6. **Review**: This is where human judgment is irreplaceable. You read the diff, check edge cases, verify the approach makes architectural sense. Claude Code can also act as a reviewer, but it supplements rather than replaces human review.
7. **Merge**: If everything looks good, merge and deploy.

**The kitchen analogy.** Think of a restaurant kitchen. Before AI, you were the chef doing everything: prep, cook, plate, clean. AI-assisted tools (Copilot) are like a sous chef who chops vegetables when you point at them. Agent-driven tools (Claude Code) are like a line cook who can take a ticket, read the recipe, prep the ingredients, cook the dish, and plate it. You're still the executive chef. You design the menu, taste the food, and decide when it's ready to serve. But you're not chopping onions anymore.

**What the loop looks like in practice.** Here's a real sequence of commands that take you from ticket to merge:

```bash
# Start from the issue
$ claude "Read issue #42 and create a feature branch for it"

# Implement the feature
$ claude "Implement the changes described in issue #42. Write tests first."

# Check the work
$ claude "Run all tests and fix any failures"

# Create the PR
$ claude "Create a PR for this branch. Reference issue #42 in the description."
```

Four commands. The agent handles dozens of intermediate steps: reading the issue, understanding the codebase, writing code, creating test files, running the test suite, fixing failures, staging changes, writing commit messages, pushing the branch, and opening the PR. You specify outcomes. It handles execution.

**Where teams actually use this.** Stripe's API team uses agent-driven workflows for migrating endpoints between service versions. The developer writes a migration spec, and the agent handles implementation, tests, and the PR. Shopify's frontend team reports that about 30% of their component generation now goes through this loop with minimal human intervention. The pattern works best for well-defined, repeatable tasks where the codebase has good documentation.

**Where it breaks down.** The loop struggles with ambiguity. If the ticket says "improve the checkout flow" without specifics, the agent will guess. Guessing at the ticket level is expensive because it cascades through every subsequent step. The clearer your specification, the better the loop works. (That's Day 5's topic: "Words Before Code.")

# Topic 2: GitHub Integration with Claude Code

## Overview

Git and GitHub aren't just tools developers happen to use. They're the communication layer of modern software teams. Commits tell the story of what changed. PRs are where decisions get made. Issues track what needs to happen. Code review is where knowledge transfers. Every one of these touchpoints is a place where AI can either help or get in the way.

**How Claude Code connects to GitHub.** Claude Code uses the `gh` CLI (GitHub's official command-line tool) under the hood. When you ask it to "create a PR," it's running `gh pr create` with the right flags. When you ask it to "read issue #42," it's running `gh issue view 42`. This means anything you can do with `gh`, the agent can do too.

**The key integrations:**

**Branch management.** The agent creates branches following your team's naming convention (if you've specified one in CLAUDE.md). It checks out existing branches, rebases when needed, and handles the git plumbing you'd rather not think about.

**Commit generation.** One of the most underappreciated features. Claude Code writes commit messages that are actually descriptive. Not "fix stuff" or "WIP." It's read the diff. It knows what changed and can articulate it clearly.

The quality trick: specify your commit message style in CLAUDE.md. "Write commit messages in present tense. Start with a category prefix (feat/fix/docs/refactor). Keep the first line under 72 characters. Add a body explaining why, not what." The agent follows this consistently.

**Pull request creation.** When you ask Claude Code to create a PR, it:

1. Analyzes the diff between your branch and the base branch.
2. Writes a title that summarizes the change.
3. Generates a description covering what changed, why, and how to test it.
4. Links related issues if you've mentioned them.
5. Pushes the branch and opens the PR on GitHub.

The output isn't always perfect. It sometimes over-explains obvious changes or misses strategic context ("this is prep for the upcoming API redesign"). That's why you review the description. But it's a dramatically better starting point than a blank text box.

**PR review as reviewer.** You can point Claude Code at a PR and ask it to review the changes. It reads the diff, identifies potential issues (missing error handling, untested edge cases, inconsistent naming), and provides feedback. Some teams use this as a first-pass filter: the agent catches mechanical issues, humans focus on design and architecture.

**Issue triage.** For repos with many open issues, Claude Code can read through them, categorize by type (bug, feature, documentation), estimate complexity, and suggest which ones are good candidates for AI-assisted implementation.

**The `gh` CLI power moves.** Commands that pair especially well with Claude Code:

```bash
# View PR checks and fix failures
$ claude "Check the CI status of this PR and fix any failing tests"

# Review a specific PR
$ claude "Review PR #87. Focus on security and performance."

# Search for related issues
$ claude "Find open issues related to authentication and summarize them"
```

**Real workflow patterns.** The strongest pattern is "Claude Code as first responder." When a bug report comes in, the agent reads the issue, finds the relevant code, writes a failing test that reproduces the bug, then implements the fix. The developer reviews the PR, verifies the fix makes sense, and merges. Total human time: 10 minutes of review instead of 45 minutes of investigation and coding.

Another pattern: "PR description upgrade." Even if you wrote the code yourself, you can ask Claude Code to write the PR description. It reads your commits, understands the changes, and writes a description that's more thorough than what most developers write by hand. It's leveraging the tool for what it's good at.

**What to watch for.** Agents sometimes create descriptions that sound confident but are subtly wrong. They might describe a function as "handling all edge cases" when it doesn't. They might claim "comprehensive test coverage" when the tests only cover the happy path. Read the description against the actual diff. The description is a draft, not a source of truth.

## Break & Wrap Up

**Key takeaway:** The development loop hasn't changed. The distribution of labor has. AI handles the mechanical parts (branching, committing, describing, initial review). Humans handle the judgment parts (what to build, whether it's correct, whether it fits the architecture).

**Before next class:** Complete one full loop: pick a small feature or bug, use Claude Code to go from issue to merged PR. You'll share your experience in the Day 4 activity.

## After Class Challenges

### Challenge 1: Full Loop Sprint

Execute the complete development loop on a real task:

1. Create an issue on GitHub describing a feature or bug fix.
2. Use Claude Code to create a branch, implement the change, write tests, and open a PR.
3. Review the PR yourself. Note what the agent got right and what you'd change.
4. Merge the PR.
5. Document the full sequence of commands and the agent's tool calls.

### Challenge 2: Commit Message Audit

Look at your last 10 commit messages. Then:

1. Ask Claude Code to rewrite each one based on the actual diff.
2. Compare: are the AI-generated messages more descriptive? More consistent?
3. Add commit message guidelines to your `CLAUDE.md` based on what you learned.

This builds a context artifact that improves every future commit.

### Challenge 3: PR Review Comparison

Find an open PR in a public repo (or one of your own). Review it yourself first, writing down every issue you spot. Then ask Claude Code to review the same PR. Compare:

1. What did the agent catch that you missed?
2. What did you catch that the agent missed?
3. What did the agent flag that you disagree with?

Write up the comparison. This calibrates your expectations for AI-assisted code review.

## Additional Resources

1. [GitHub CLI Documentation](https://cli.github.com/manual/): Complete reference for `gh` commands.
2. [Claude Code Common Workflows](https://code.claude.com/docs/en/common-workflows): Official workflow patterns including GitHub integration.
3. [Conventional Commits](https://www.conventionalcommits.org/): The commit message standard referenced in this lesson.
4. [How to Write Better Commit Messages](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/): Commit message habits that transfer to AI-generated messages.
