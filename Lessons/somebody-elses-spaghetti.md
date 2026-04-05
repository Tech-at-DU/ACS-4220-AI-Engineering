# Somebody Else's Spaghetti

## Learning Objectives

By the end of this lesson, you will be able to:

1. Use Claude Code to explore and understand an unfamiliar codebase without reading every file.
2. Build a mental model of a legacy system's architecture using targeted agent queries.
3. Add features and fix bugs in code you didn't write, using AI to bridge the knowledge gap.
4. Explain the difference between greenfield and brownfield development and why most real jobs are brownfield.

## Best Practices

- **Read before you write.** Before making any changes, use Claude Code to map the codebase. Ask it to explain the architecture, list the entry points, and trace the data flow.
- **Don't refactor and fix at the same time.** Separate "understanding" from "changing." First understand the existing code. Then make your targeted change. Resist the urge to clean up everything.
- **Write a characterization test.** Before modifying legacy code, write a test that captures the current behavior. This ensures your change doesn't break something that was working.
- **Ask "why" before "what."** Before changing code, ask the agent why it's written that way. Sometimes the weird pattern exists for a good reason.
- **Lean on git blame.** The commit history tells you who wrote the code, when, and (if the messages are good) why. Ask Claude Code to trace the history of a confusing function.
- **Document as you go.** Every time you figure out something about the codebase, add it to the project's CLAUDE.md. Future you (and future agents) will benefit.

# Topic 1: Brownfield Development

## Overview

Your first few months as a professional developer will probably go something like this: you get hired, you're excited to build something new, and then your manager assigns you to fix a bug in a 50,000-line codebase that was started three years before you joined. The original developer left the company. There are no docs. The test coverage is 12%. The variable names are single letters in some files and full sentences in others. Welcome to brownfield development.

**Greenfield vs. brownfield.** These terms come from urban planning. A greenfield site is an empty plot of land. You can build whatever you want, however you want. A brownfield site is land that's been used before (often an old factory or gas station). Before you can build anything new, you have to deal with what's already there: foundations, contamination, old pipes, weird zoning restrictions.

In software, greenfield means starting from scratch: new repo, new architecture, your decisions. Brownfield means working with existing code: someone else's decisions, someone else's patterns, someone else's bugs. The assignments in Weeks 1-3 of this course are greenfield. This week shifts to brownfield, because that's where you'll spend most of your career.

**The numbers.** Most studies estimate that 70-80% of a professional developer's time is spent on existing code, not new code. You're reading, understanding, debugging, extending, and refactoring code that someone else wrote. The ratio might be even higher in large organizations where the codebase is decades old. This is the reality of the job, and it's the reality that AI tools can help with the most.

**Why brownfield is hard for humans.** When you open a 50,000-line codebase for the first time, you face several compounding problems:

1. **Scale**: You can't read all of it. There's too much. You need to find the relevant parts without reading the irrelevant parts.
2. **Context**: You don't know the history. Why is this function 300 lines long? Was the original developer lazy, or is there a reason?
3. **Conventions**: Every codebase has unwritten rules. Maybe error handling works differently in the API layer vs. the data layer. Maybe there's a utility function for date formatting that everyone uses but nobody documented.
4. **Fear**: Changing code you don't understand is scary. You might break something that was working. Legacy codebases often have subtle dependencies that aren't obvious from the code alone.

**Why brownfield is where AI agents shine.** Every one of those problems is something Claude Code can help with:

- **Scale**: The agent can read the entire codebase. It doesn't get tired, bored, or overwhelmed. Ask it to summarize the project structure and it reads every file.
- **Context**: The agent can trace history using git blame and commit logs. "Why is this function 300 lines long?" might have an answer in the commit that created it.
- **Conventions**: The agent can identify patterns by reading many files. "What error handling pattern does this project use?" is a question it can answer by scanning the codebase.
- **Fear**: The agent can write characterization tests that capture current behavior before you change anything. If your change breaks something, the test catches it.

**The moving-into-a-new-apartment analogy.** When you move into a furnished apartment someone else decorated, you don't rip out the kitchen cabinets on day one. You live there for a while. You figure out which drawers stick, where the water pressure drops, which light switch controls which outlet. Then you start making changes, one at a time, verifying that nothing breaks.

Brownfield development works the same way. Explore first. Understand the quirks. Then make targeted changes with tests guarding the existing behavior.

**Brownfield code exploration sequence with Claude Code:**

```bash
# Step 1: Get the big picture
$ claude "Summarize this project's architecture. What are the main modules
         and how do they connect?"

# Step 2: Find the relevant code
$ claude "I need to fix a bug in the payment flow. Trace the code path
         from the /checkout endpoint to the Stripe API call."

# Step 3: Understand the history
$ claude "Why does processPayment() have three retry loops?
         Check git blame for the history."

# Step 4: Write a safety net
$ claude "Write characterization tests for processPayment()
         that capture its current behavior."

# Step 5: Make the change
$ claude "Now fix the bug: payments fail when the currency is EUR.
         Keep all existing tests passing."
```

Five steps. Explore, trace, understand, protect, then change. This sequence works for almost any brownfield task.

# Topic 2: AI-Assisted Code Exploration

## Overview

Before AI agents, exploring an unfamiliar codebase meant grep, find, and a lot of patience. You'd search for a function name, open the file, read the function, notice it calls another function, search for that one, open that file, and so on. It's detective work. Slow, methodical detective work.

Claude Code turns this into a conversation.

**The exploration toolkit.** When you ask Claude Code to understand a codebase, it uses a specific set of tools:

- **`Glob`** to find files by pattern: "Show me all the test files" (`*.test.js`), "Find all migration files" (`migrations/*.sql`).
- **`Grep`** to search file contents: "Where is `processPayment` called?" searches every file for that string.
- **`Read`** to examine specific files: once it knows where something is, it reads the full file to understand the context.
- **`Bash`** to run exploration commands: `git log --oneline -20` for recent history, `wc -l src/**/*.py` for code volume, `tree -L 2` for directory structure.

What makes this powerful is the **chaining**. The agent doesn't just run one search. It runs a search, reads the results, decides what to look at next, reads that, and keeps going until it has enough context to answer your question. A query like "How does authentication work in this project?" might trigger 15-20 tool calls as the agent traces the flow from the login endpoint through middleware, token validation, and session management.

**Dependency mapping.** One of the most useful exploration tasks is mapping dependencies: which modules depend on which other modules, and what's the critical path through the system? This is hard for humans because dependencies are often implicit (a module imports a utility that imports a config that reads an environment variable). The agent can trace these chains across the entire codebase.

```bash
$ claude "Map the dependency chain for the payment module.
         What does it import, directly and transitively?
         Which modules import it?"
```

The output gives you a map of the system. You know which modules are tightly coupled, which are isolated, and which are on the critical path (changing them affects many other modules).

**Architecture recovery.** Many legacy codebases have no architecture documentation. The documentation that existed when the project started is years out of date. Claude Code can recover the architecture by reading the code:

```bash
$ claude "This project has no architecture docs. Based on the code,
         describe the architecture: layers, data flow, external services,
         and any patterns you recognize (MVC, event-driven, microservices, etc.)"
```

The agent reads the directory structure, the imports, the database models, the API routes, and the configuration files. It synthesizes a description that's not perfect but gives you a starting point. You can then refine it, add nuance, and save it as documentation for the next person.

**The archaeological dig analogy.** Exploring a legacy codebase is like an archaeological dig. You don't excavate the entire site. You dig test trenches in strategic locations: the entry points (main files, API routes), the data layer (models, migrations), and the configuration (environment variables, settings files). Each trench reveals a layer of the system's history. AI agents can dig these trenches much faster than you can.

**Real-world code exploration patterns.** Here are the questions developers most commonly ask when joining a new codebase, and how Claude Code answers them:

| Question | What Claude Code Does |
|---|---|
| "What does this project do?" | Reads README, entry points, and route definitions |
| "How is the code organized?" | Runs `tree`, reads directory structure, identifies patterns |
| "Where is feature X implemented?" | Grep for keywords, trace imports, follow the call chain |
| "What's the test setup?" | Finds test configs, reads a sample test, identifies the test framework |
| "What external services does this use?" | Searches for HTTP clients, SDK imports, connection strings |
| "What's the deployment process?" | Reads CI/CD configs, Dockerfiles, deployment scripts |

**Building your exploration as documentation.** The most valuable thing you can do during exploration is capture what you learn. Every time the agent explains something about the codebase, add it to the project's CLAUDE.md or a new `ARCHITECTURE.md` file. The next developer (or the next agent session) starts with that knowledge instead of rediscovering it.

This is context engineering applied to brownfield: you're building up the project's institutional memory so that future AI sessions are more effective.

## Break & Wrap Up

**Key takeaway:** Most professional development is brownfield. AI agents turn codebase exploration from slow detective work into a conversation. The sequence is always the same: explore, understand, protect with tests, then change.

**Before next class:** Clone a public open source project you've never seen before. Use Claude Code to answer: What does it do? How is it organized? What's the test setup? Save the answers as notes for Day 8.

## After Class Challenges

### Challenge 1: Codebase Archeology

Clone an open source project you've never worked with (suggestions: a Flask app, an Express API, a Django project). Use only Claude Code to:

1. Describe the architecture and module structure.
2. Trace the code path for one user-facing feature.
3. Identify the test framework and run the test suite.
4. Find one piece of code that's confusing and ask Claude Code to explain it. Then verify the explanation by reading the code yourself.
5. Document your findings in a short `EXPLORATION.md` file.

### Challenge 2: Characterization Test Suite

Pick a module from the `fixthis` assignment codebase (or the open source project from Challenge 1):

1. Write characterization tests that capture the current behavior of 3-5 functions.
2. Make a small, deliberate change to one function. Verify your characterization tests catch it.
3. Revert the change. Now make the actual change you intended, keeping all tests green.

### Challenge 3: Architecture Recovery Document

For a codebase with no documentation (the `fixthis` repo or an open source project):

1. Ask Claude Code to describe the architecture.
2. Create an `ARCHITECTURE.md` with: project overview, module diagram (text-based), data flow, external dependencies, and known quirks.
3. Review the document yourself. What did the agent get right? What did it miss or get wrong?
4. Commit the corrected version. This becomes real project documentation.

## Additional Resources

1. [Working Effectively with Legacy Code](https://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052): Michael Feathers' definitive book on brownfield development.
2. [Claude Code Common Workflows: Codebase Exploration](https://code.claude.com/docs/en/common-workflows): Official patterns for understanding unfamiliar code.
3. [Characterization Tests](https://michaelfeathers.typepad.com/michael_feathers_blog/2005/09/the_deep_synerg.html): Michael Feathers on testing legacy code without specs.
4. [The Mikado Method](https://www.manning.com/books/the-mikado-method): A technique for making large-scale changes to legacy code safely.
