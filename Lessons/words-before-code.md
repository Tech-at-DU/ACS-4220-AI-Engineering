# Words Before Code

## Learning Objectives

By the end of this lesson, you will be able to:

1. Write a specification document that an AI agent can execute without ambiguity.
2. Define quality gates with concrete invocation methods and verifiable success criteria.
3. Write acceptance criteria in Given/When/Then format that serve as both documentation and test blueprints.
4. Explain why specification quality is the single biggest predictor of AI-generated code quality.

## Best Practices

- **Write the spec before you open the terminal.** The spec is the primary artifact. Code is the byproduct. If you can't describe what you want in plain English, the agent definitely can't build it.
- **Make every requirement testable.** "The API should be fast" is not testable. "The API should respond in under 200ms for 95% of requests" is testable. If you can't measure it, you can't verify it.
- **Use Given/When/Then.** It forces precision. "Given a user with no items in cart, when they click checkout, then show an empty cart message." No ambiguity.
- **Version your specs.** Start with v1.0 (MVP), then v1.1 (refinements), then v1.2 (stretch). This gives the agent clear phases to work through.
- **Include what you don't want.** Negative requirements prevent the agent from making assumptions. "Do NOT add authentication to this endpoint" saves a 20-minute rabbit hole.
- **Quality gates are checkpoints, not afterthoughts.** Define them upfront: "After each phase, run tests. If any fail, fix before proceeding."

# Topic 1: Specification-Driven Development

## Overview

There's an old saying in construction: "Measure twice, cut once." The software equivalent is: "Specify thoroughly, implement once." But for decades, developers have done the opposite. They sketch a vague idea, start coding, hit a wall, backtrack, redesign, and repeat. The code gets written three times before it works.

AI agents make this pattern worse, not better. Why? Because agents are obedient. Tell them to "build a user dashboard" and they will. They'll make a hundred decisions you didn't specify: what data to show, how to lay it out, what happens on mobile, whether to cache, which API endpoints to hit. Every unspecified decision is a coin flip. Some will match what you wanted. Many won't.

**Specification-driven development** flips this. You invest time upfront writing a detailed description of what the system should do. The spec becomes the source of truth. The agent reads the spec and implements it. If the spec is good, the code is good. If the spec is vague, the code is a guess.

**Where this idea came from.** Formal specification has roots going back to the 1970s. Edsger Dijkstra and Tony Hoare advocated for mathematical proofs of program correctness. That was too rigorous for most teams. In the 1990s, the agile movement swung the other way: "working software over comprehensive documentation." The pendulum swung so far that many teams stopped writing specs entirely.

AI tools are swinging it back. Not to formal proofs (that's overkill), but to a middle ground: structured natural language specs that are detailed enough for an agent to execute. Think of it as writing a really good work order for a contractor. You wouldn't hand a contractor a napkin sketch and say "build something nice." You'd specify dimensions, materials, finishes, and constraints.

**The `spec.md` pattern.** In this course, every project includes a `spec.md` file. It's a plain English document that describes what the software should do. Here's the structure:

```markdown
# Project: URL Shortener

## Overview
A CLI tool that shortens URLs and stores them in a local SQLite database.

## Quality Gates
1. **Gate 1**: `python cli.py shorten https://example.com` returns a short code.
   Success: stdout contains a 6-character alphanumeric code.
2. **Gate 2**: `python cli.py expand abc123` returns the original URL.
   Success: stdout contains the original URL.
3. **Gate 3**: `python -m pytest tests/` passes with 0 failures.
   Success: exit code 0, all tests green.

## Acceptance Criteria
- Given a valid URL, when I run `shorten`, then I get a unique short code.
- Given a short code that exists, when I run `expand`, then I get the original URL.
- Given a short code that doesn't exist, when I run `expand`, then I get an error message.
- Given a URL that's already shortened, when I run `shorten` again, then I get the same short code.
```

This spec is 20 lines. An agent can read it and build the entire tool. Every quality gate has a concrete invocation ("run this command") and a verifiable success criterion ("output contains X"). No ambiguity.

**Why specs matter more with AI.** A human developer can ask clarifying questions mid-implementation: "Hey, what should happen when the URL is malformed?" An agent doesn't ask. It guesses. And its guesses are plausible enough that you might not notice they're wrong until the feature ships and a user hits the edge case.

The spec is your chance to answer every question in advance. If you find yourself thinking "the agent should probably figure that out," stop. Write it down. Every unspecified behavior is a bug waiting to happen.

**The cost of ambiguity.** A vague ticket takes about 5 minutes to write but creates 30-60 minutes of rework when the agent builds the wrong thing. A detailed spec takes 15-20 minutes to write but produces code that's right the first time (or at least right enough to need only minor corrections). The math is clear: invest in specs.

**Real-world examples.** Linear (the project management tool) requires structured specs for any feature that will be implemented by AI agents. Their template includes: problem statement, proposed solution, acceptance criteria, out-of-scope items, and success metrics. They reported a 60% reduction in "back-and-forth" cycles after adopting the practice.

At Anthropic, internal Claude Code users follow a similar pattern. The engineering blog describes "spec-first development" as the primary workflow: write the spec, commit it, then point Claude Code at the spec and say "implement this."

# Topic 2: Quality Gates and Acceptance Criteria

## Overview

A quality gate is a checkpoint. It's a specific moment in the development process where you stop and verify that everything built so far actually works. Without quality gates, you can build for hours, only to discover at the end that the foundation was wrong and everything built on top of it is broken.

**Where quality gates came from.** The concept originates from manufacturing, specifically from quality management systems like Six Sigma and ISO 9001 that emerged in the 1980s. In manufacturing, a quality gate is a literal station on the assembly line where an inspector checks the product before it moves to the next stage. If the car door doesn't fit, you find out at the door station, not after the car is painted.

Software borrowed the idea. In waterfall development, quality gates were formal review meetings. In agile, they became sprint reviews and definition-of-done checklists. In CI/CD, they became automated test suites and deployment checks. Same concept, different packaging: verify before proceeding.

**Why quality gates matter more with AI agents.** Agents are fast. Dangerously fast. A human developer builds slowly enough that they notice problems as they go. An agent can build an entire feature in 90 seconds, and if the approach was wrong, all 90 seconds of work need to be thrown out. Quality gates are the brakes on that speed. They force the agent to stop, verify, and only proceed if the checkpoint passes.

**Anatomy of a good quality gate:**

Every quality gate needs three things:

1. **Invocation**: How do you trigger the check? This must be a concrete command. "Run `pytest tests/test_api.py`" is an invocation. "Check if the API works" is not.

2. **Success criteria**: What does "passing" look like? "Exit code 0" is a success criterion. "Looks good" is not.

3. **Failure response**: What happens if the check fails? Usually: "Fix the issue and re-run the gate before proceeding." The agent needs to know it should loop, not skip.

**The traffic light analogy.** Quality gates are traffic lights on the road from spec to shipped code. Green: everything checks out, proceed to the next phase. Red: something failed, stop and fix before continuing. Without traffic lights, the agent speeds through every intersection. It might arrive faster, but it might also cause a pileup.

**Given/When/Then format.** This is the standard way to write acceptance criteria in behavior-driven development (BDD). It originated with Dan North in 2003 as part of the BDD movement, which was itself a response to TDD's focus on technical correctness over business behavior.

The format:

- **Given**: The starting state. What conditions exist before the action?
- **When**: The action. What does the user (or system) do?
- **Then**: The expected result. What should happen?

```
Given a registered user with a valid session token,
When they request GET /api/profile,
Then they receive a 200 response with their name, email, and avatar URL.
```

This format works exceptionally well with AI agents because it's structured enough to translate directly into test code. An agent reading the criteria above can generate a test that creates a user, authenticates them, calls the endpoint, and asserts the response fields. No interpretation needed.

**Versioned requirements.** For larger projects, break the spec into versions:

- **v1.0 (MVP)**: The minimum viable product. What must work for the first demo?
- **v1.1 (Refinements)**: Edge cases, error handling, input validation.
- **v1.2 (Stretch)**: Performance optimization, additional features, polish.

This gives the agent (and you) clear phases. Complete v1.0 and verify all its quality gates pass before starting v1.1. Each version builds on the last, and quality gates ensure the foundation is solid before you add another floor.

**Common mistakes with acceptance criteria:**

1. **Too vague**: "The system should handle errors gracefully." What does "gracefully" mean? Return a 500? Log and retry? Show a friendly message? Specify it.
2. **Testing implementation, not behavior**: "The function should use a try/catch block." That's an implementation detail. "The function should return an error message instead of crashing" is a behavior.
3. **Missing the negative cases**: "Given a valid URL, the system shortens it." Great. What about an invalid URL? An empty string? A URL that's 10,000 characters long?
4. **No ordering**: If criteria depend on each other, make the order explicit. "Complete Gate 1 before starting Gate 2."

**Real-world quality gates in AI workflows.** The most effective pattern in practice is a three-gate system:

1. **Gate 1: Tests pass.** Run the full test suite. Zero failures.
2. **Gate 2: Linter passes.** Run the code through your linter/formatter. Zero warnings.
3. **Gate 3: Manual verification.** You, the human, check that the output matches the spec.

The first two gates are automated. The agent can run them itself and loop until they pass. The third gate is where your judgment comes in. This three-gate pattern catches about 90% of issues before they reach code review.

## Break & Wrap Up

**Key takeaway:** The spec is the most important artifact in AI-assisted development. Invest 15-20 minutes writing a detailed specification with quality gates and acceptance criteria. It saves hours of rework.

**Before next class:** Write a `spec.md` for your `firstbuild` project with at least 3 quality gates and 5 acceptance criteria in Given/When/Then format. You'll use it in Day 6 to test against the real world.

## After Class Challenges

### Challenge 1: Spec Writing Workshop

Write a complete `spec.md` for your `firstbuild` project:

1. Start with a one-paragraph overview of what the project does.
2. Define at least 3 quality gates, each with a concrete invocation and success criteria.
3. Write at least 5 acceptance criteria in Given/When/Then format (include at least 2 negative/edge cases).
4. Version your requirements: v1.0 (MVP), v1.1 (refinements), v1.2 (stretch).
5. Commit the spec before any implementation code.

### Challenge 2: Spec-to-Code Experiment

Test how spec quality affects code quality:

1. Write a deliberately vague spec (3 sentences, no quality gates). Give it to Claude Code. Save the output.
2. Write a detailed spec (full Given/When/Then, quality gates, edge cases). Give the same task to Claude Code. Save the output.
3. Compare: how much rework does each version need? How many edge cases did each handle? How many bugs survived to manual testing?
4. Write up your findings.

### Challenge 3: Quality Gate Automation

Build an automated quality gate system for your project:

1. Create a script (or Claude Code command) that runs all three gates in sequence: tests, linter, and a custom check of your choice.
2. Configure it so Claude Code runs the gates automatically after each implementation phase.
3. Document how the gates caught (or would have caught) a real issue during development.

## Additional Resources

1. [Behavior-Driven Development](https://dannorth.net/introducing-bdd/): Dan North's original article on Given/When/Then.
2. [Writing Good User Stories](https://www.mountaingoatsoftware.com/agile/user-stories): Mike Cohn's guide to user story format.
3. [Claude Code Best Practices: Plan Mode](https://code.claude.com/docs/en/best-practices): How specification connects to Claude Code's planning workflow.
4. [Specification by Example](https://gojko.net/books/specification-by-example/): Gojko Adzic's book on bridging specs and tests.
