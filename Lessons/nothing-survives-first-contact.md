# Nothing Survives First Contact

## Agenda

- [Learning Objectives](#learning-objectives)
- [Best Practices](#best-practices)
- [Testing Strategies with AI Tools](#testing-strategies-with-ai-tools)
  - [Overview: Testing Strategies with AI Tools](#overview-testing-strategies-with-ai-tools)
- [When AI-Generated Code Meets Reality](#when-ai-generated-code-meets-reality)
  - [Overview: When AI-Generated Code Meets Reality](#overview-when-ai-generated-code-meets-reality)
- [Break & Wrap Up](#break-wrap-up)
- [After Class Challenges](#after-class-challenges)
  - [Challenge 1: Hallucination Hunt](#challenge-1-hallucination-hunt)
  - [Challenge 2: Test Gap Analysis](#challenge-2-test-gap-analysis)
  - [Challenge 3: Verification Pipeline](#challenge-3-verification-pipeline)
- [Additional Resources](#additional-resources)

## Learning Objectives

By the end of this lesson, you will be able to:

1. Choose the right testing strategy (unit, integration, end-to-end) for different types of AI-generated code.
1. Detect hallucinations in AI-generated code: APIs that don't exist, methods with wrong signatures, invented libraries.
1. Build a verification workflow that catches agent mistakes before they reach code review.
1. Explain why "the tests pass" doesn't mean "the code is correct."

## Best Practices

- **Never trust, always verify.** AI-generated code can look perfect and be subtly wrong. It might call a library function that doesn't exist, use deprecated syntax, or handle errors in a way that silently swallows exceptions.
- **Test the boundaries, not the middle.** Agents handle the happy path well. They miss edge cases: empty inputs, null values, extremely large data, concurrent access, timezone differences.
- **Run the code.** Reading AI-generated code is not enough. Execute it. Watch what happens with real inputs. Many bugs only surface at runtime.
- **Check external references.** If the agent uses a library you haven't seen, verify it exists and does what the agent claims. Hallucinated imports are one of the most common AI coding failures.
- **Build a verification checklist.** After the agent finishes, run through: Do tests pass? Does the linter pass? Do imports resolve? Do API endpoints actually exist? Does the behavior match the spec?
- **Keep a "gotcha" log.** Document every time the agent produces incorrect code. Patterns will emerge. Add the most common failures to your CLAUDE.md.
- **💼 Use Case.** Run the verification checklist before merging any `wiredup` or API-facing assignment code that touches external docs, packages, or services.
- **🛠️ Pro Tip.** Codex-generated code needs the same external reference checks as Claude output; passing tests are evidence, not proof of correctness.

**Builds On:** the spec and quality-gate habits from Day 5.

**Feeds:** `wiredup` integrations and every later lesson that touches external systems.

## Testing Strategies with AI Tools

### Overview: Testing Strategies with AI Tools

Use a feature from `firstbuild` or `wiredup` that already looked fine until an ugly edge case showed up. That is the concrete reason this lesson exists: passing tests are not the same as validated behavior.

The title of this lesson is borrowed from a military maxim often attributed to Helmuth von Moltke: "No plan survives first contact with the enemy." In software, the enemy is reality. Your code works perfectly in your head, in the spec, and in the happy-path test. Then a real user submits a form with emoji in the name field and everything breaks.

Testing is how you make contact with reality before your users do.

**The testing pyramid (and why it still applies).** The testing pyramid was introduced by Mike Cohn in his 2009 book "Succeeding with Agile." The idea is straightforward: build your test suite like a pyramid.

At the base, **unit tests**. Lots of them. They test individual functions in isolation. They're fast, cheap to write, and cheap to run. A single function that calculates tax? Unit test it with 20 different inputs.

In the middle, **integration tests**. Fewer of these. They test how components work together. Does the API endpoint correctly call the database layer and return formatted results? Integration tests are slower and more complex, but they catch problems that unit tests miss (like a function that works perfectly in isolation but receives the wrong data type from its caller).

At the top, **end-to-end tests**. The fewest of these. They test the entire system from the user's perspective. Does clicking "Submit" on the form actually create a record in the database and send a confirmation email? End-to-end tests are expensive to write, slow to run, and fragile (they break when any layer changes), but they're the closest thing to reality.

**How AI changes the pyramid.** AI agents are good at generating unit tests. Give Claude Code a function and say "write tests for this," and you'll get reasonable coverage of the happy path plus a few edge cases. Integration tests are harder for agents because they require understanding how components connect. End-to-end tests are hardest because they require understanding the full user flow and often need real infrastructure (databases, APIs, browsers).

The practical impact: **agents shift the economics of the pyramid.** Unit tests become almost free to write (let the agent generate them). That means you can afford to invest more human time on integration and end-to-end tests, where your judgment matters more.

**Test-first vs. test-after with agents.** This connects directly to Day 4's TDD lesson. Here's the key distinction:

- **Test-first**: You specify what to test, the agent writes the test, then implements the code. You control the specification.
- **Test-after**: The agent writes the code, then you (or the agent) write tests to cover it. The tests verify what was built, not what was needed.

Test-first is almost always better with AI agents. Here's why: when an agent writes tests after the code, it tends to write tests that pass. Of course they pass. The agent wrote both the code and the tests. They agree with each other. But "the tests agree with the code" is not the same as "the code does what the user needs."

**A concrete example.** You ask the agent: "Build a function that validates email addresses." The agent writes a function and tests. The tests pass. You ship it. A week later, someone reports that `user@company` (no TLD) passes validation. The agent's function used a regex that doesn't check for a TLD. The tests? They tested `user@example.com` (valid) and `not-an-email` (invalid). They never tested the borderline case.

If you'd written the test first (`Given "user@company" when validated then return false`), the agent would have implemented a function that handles that case. The spec drove the implementation.

**Coverage doesn't mean correctness.** 100% code coverage means every line of code was executed during tests. It does not mean every behavior was tested. A function with 100% coverage can still have bugs if the tests only exercise one path through the logic. Don't let the coverage number fool you (or the agent). Focus on behavior coverage: have you tested every meaningful scenario from the user's perspective?

**🏫 What This Looks Like in Class.** `firstbuild` is usually the first place students learn that a green test run can still hide missing behavior. The assignment is small enough that they can trace every requirement, which makes it the right place to build the habit of mapping tests back to acceptance criteria instead of trusting coverage alone.

### Claude Code Workflow: Testing Strategies with AI Tools

Take a function that looks correct, passes the obvious tests, and still fails on one ugly edge case. Then ask the room whether the issue is the code, the test design, or the missing requirement. In most real systems it is a mix of all three. That is why this lesson matters. Students need to feel that verification is a design activity, not a postscript.

### Codex Workflow: Testing Strategies with AI Tools

Codex follows the same trap profile. If the specification is weak, the agent can write code and tests that agree with each other while still missing the user's real requirement. The only durable fix is a stronger contract: better acceptance criteria, better edge-case coverage, and explicit verification steps.

## When AI-Generated Code Meets Reality

### Overview: When AI-Generated Code Meets Reality

Ground this in a live dependency, API, or library call students can check immediately. The practical lesson is that Claude Code and Codex both need a reality check the moment they leave the repo and touch the outside world.

AI-generated code has a specific failure mode that human-written code doesn't: hallucination. In the context of code generation, a hallucination is when the agent produces code that looks correct, follows proper syntax, and might even pass a superficial review, but references things that don't exist.

**Types of code hallucinations:**

1. **Phantom APIs.** The agent calls `response.json().data.items` when the actual API returns `response.json()["results"]`. It's seen enough API patterns to generate plausible-looking code, but it doesn't verify against the actual API documentation.

1. **Invented methods.** The agent calls `string.trimLeft()` in Python (that's a JavaScript method). Or it calls `pandas.DataFrame.to_markdown()` with a parameter that doesn't exist. The method name sounds right. The parameter looks reasonable. Neither is real.

1. **Deprecated patterns.** The agent uses `componentWillMount` in React (deprecated since React 16.3, removed in React 18) or `urllib2` in Python 3 (renamed to `urllib.request`). Training data includes old patterns alongside new ones. The agent doesn't always pick the current one.

1. **Fictional libraries.** This is less common but happens. The agent imports a package that sounds useful (`pip install smartparser`) but doesn't exist on PyPI. It's synthesized a plausible package name from patterns in its training data.

**Why hallucinations happen.** Language models generate code by predicting the most likely next token based on patterns in their training data. If the training data contains thousands of examples of `response.json().data`, the model will produce that pattern even if the specific API you're using structures its response differently. The model is pattern-matching, not verifying.

**The verification workflow.** Every AI-generated code block should go through a verification checklist before you commit it:

1. **Do imports resolve?** Run the file. If it crashes on import, the agent referenced something that doesn't exist.
1. **Do external calls work?** If the code calls an API, test with a real request. If it uses a library method, check the docs.
1. **Do the tests test the right thing?** Read each assertion. Does it verify behavior you care about, or just behavior the agent invented?
1. **Does it handle failure?** What happens when the network is down? When the input is empty? When the file doesn't exist?
1. **Does the output match the spec?** Go back to your `spec.md`. Does the code satisfy every acceptance criterion?

**Building a hallucination radar.** Over time, you develop intuition for spotting hallucinations. Some red flags:

- **Overly specific parameter names.** `response.meta.pagination.next_cursor` is so specific it's suspicious. Check the docs.
- **Perfect error messages.** If the agent writes `raise ValueError("Invalid email: must contain @ and a valid TLD")`, verify that the validation logic actually checks for a TLD.
- **Confident comments.** "This handles all edge cases" in a comment is a warning sign. Does it really?
- **Unfamiliar library versions.** If the agent uses a feature you don't recognize, it might be from a version that doesn't exist yet (or never existed).

**The trust calibration curve.** When you start using AI agents, you'll probably trust the output too much (it looks like code a senior engineer would write). After your first hallucination-induced bug, you'll trust it too little (checking every line obsessively). Over time, you'll calibrate: trust the structure and approach, verify the specifics and edge cases. That calibration is one of the most valuable skills you'll develop in this course.

**What teams do in practice.** Mature teams add import checks, staging checks, contract tests, and human review around AI-generated changes that touch real integrations. The exact toolchain varies by company, but the professional habit is consistent: every external dependency needs a reality check outside the model itself.

**🏫 What This Looks Like in Class.** `wiredup` turns this into a practical lab because MCP and external integrations let an agent sound correct while silently assuming the wrong API shape, missing auth, or a non-existent tool capability. That makes the assignment a good bridge between toy verification and real engineering skepticism.

### Claude Code Workflow: When AI-Generated Code Meets Reality

Have the agent generate a small integration that calls an external API or library method, then verify every assumption against the docs in class. Students should watch how common it is for confident-looking code to drift from reality by one parameter name or one invented helper. That is the right kind of skepticism to teach.

### Codex Workflow: When AI-Generated Code Meets Reality

Codex work deserves the same verification pipeline. Imports, external calls, tests, and behavior still need receipts. Cross-tool literacy here is straightforward: trust the structure, verify the specifics, and never let the agent grade its own homework without an external check.

## Break & Wrap Up

**🔥 Key takeaway:** Testing and verification are your reality check. AI-generated code can be confidently wrong. Build the habit of verifying before trusting, and focus your testing energy on edge cases and integration points where agents are weakest.

**🧩 Before next class:** Review the code you've generated so far in `firstbuild`. Run through the verification checklist on at least three functions. Note any hallucinations or near-misses.

### Pro Tip: Every External Call Gets a Doc Check

If the agent touched a package API, framework helper, or third-party endpoint, verify it against the official docs before you merge. That single habit catches a surprising amount of high-confidence wrongness. ✅

### Fun Fact: Minified Does Not Mean Harmless

One reason the 2026 source-map story resonated with engineers is that it exposed a common false assumption: if the shipped artifact looks opaque, the risk must be low. Source maps proved otherwise. 🕵️

### Instructor Closing Loop

Wrap by naming the three strongest habits students should keep from this lesson: test edge cases first, verify every external reference against docs or live behavior, and never confuse passing tests with validated requirements. That summary takes only a moment to say, but it gives the room a concrete checklist they can use the next time an agent produces code that looks polished before it is proven.

Tell students explicitly that this is one of the habits that separates hobby use from professional use. Professionals assume that any fast implementation path will eventually collide with edge cases, version drift, and bad assumptions. Their advantage is not that they avoid those collisions. Their advantage is that they install verification checkpoints early enough that the collisions stay cheap.

That framing helps students stop treating verification as pessimism. It is not pessimism. It is cost control. The earlier you discover that an agent guessed wrong, the cheaper the correction becomes.

That is why experienced teams keep short, repeatable verification loops close to the implementation step instead of saving all doubt for code review.

## After Class Challenges

### Challenge 1: Hallucination Hunt

Review AI-generated code (from your project or a public example):

1. Find at least 3 instances where the agent's code references external APIs, libraries, or methods.
1. Verify each one against the official documentation. Does the method signature match? Do the parameters exist?
1. Document what you find: correct references, hallucinations, and deprecated patterns.
1. Add any hallucination patterns to your `CLAUDE.md` as warnings for future sessions.

### Challenge 2: Test Gap Analysis

Take your `firstbuild` project's test suite and find the gaps:

1. List every acceptance criterion from your `spec.md`.
1. Map each criterion to the test(s) that verify it. Identify any criteria with no corresponding test.
1. Write tests for the gaps. Focus on edge cases and failure modes.
1. Run the full suite. Did any new tests reveal bugs?

### Challenge 3: Verification Pipeline

Build a verification script that automates the first four steps of the verification checklist:

1. Import check (does the code run without import errors?).
1. Linter check (does it pass your configured linter?).
1. Test check (do all tests pass?).
1. Coverage check (what's the coverage percentage?).
1. Create a custom Claude Code command that runs this pipeline after every implementation task.

## Additional Resources

### Source Notes

Start with the official docs and current model pages first. The remaining links add historical context, canonical books, or supporting examples.

1. [Claude Code Best Practices: Testing](https://code.claude.com/docs/en/best-practices): Official recommendations for testing AI-generated code.
1. [OpenAI Codex](https://developers.openai.com/codex/): Official Codex documentation for task-based coding and review workflows.
1. [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html): Martin Fowler's comprehensive guide to testing strategy.
1. [Succeeding with Agile](https://www.mountaingoatsoftware.com/books/succeeding-with-agile): Mike Cohn's book introducing the test pyramid.
1. [How OpenAI Uses Codex](https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf): Official examples of coding-agent review and verification workflows.
