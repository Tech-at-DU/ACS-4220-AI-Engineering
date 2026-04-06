# Words Before Code

## Agenda

- [Learning Objectives](#learning-objectives)
- [Best Practices](#best-practices)
- [Specification-Driven Development](#specification-driven-development)
  - [Overview: Specification-Driven Development](#overview-specification-driven-development)
- [Quality Gates and Acceptance Criteria](#quality-gates-and-acceptance-criteria)
  - [Overview: Quality Gates and Acceptance Criteria](#overview-quality-gates-and-acceptance-criteria)
- [Break & Wrap Up](#break-wrap-up)
- [After Class Challenges](#after-class-challenges)
  - [Challenge 1: Spec Writing Workshop](#challenge-1-spec-writing-workshop)
  - [Challenge 2: Spec-to-Code Experiment](#challenge-2-spec-to-code-experiment)
  - [Challenge 3: Quality Gate Automation](#challenge-3-quality-gate-automation)
- [Additional Resources](#additional-resources)

## Learning Objectives

By the end of this lesson, you will be able to:

1. Write a specification document that an AI agent can execute without ambiguity.
1. Define quality gates with concrete invocation methods and verifiable success criteria.
1. Write acceptance criteria in Given/When/Then format that serve as both documentation and test blueprints.
1. Explain why specification quality is the single biggest predictor of AI-generated code quality.

## Best Practices

- **Write the spec before you open the terminal.** The spec is the primary artifact. Code is the byproduct. If you can't describe what you want in plain English, the agent definitely can't build it.
- **Make every requirement testable.** "The API should be fast" is not testable. "The API should respond in under 200ms for the agreed percentile target" is testable. If you can't measure it, you can't verify it.
- **Use Given/When/Then.** It forces precision. "Given a user with no items in cart, when they click checkout, then show an empty cart message." No ambiguity.
- **Version your specs.** Start with v1.0 (MVP), then v1.1 (refinements), then v1.2 (stretch). This gives the agent clear phases to work through.
- **Include what you don't want.** Negative requirements prevent the agent from making assumptions. "Do NOT add authentication to this endpoint" saves a 20-minute rabbit hole.
- **Quality gates are checkpoints, not afterthoughts.** Define them upfront: "After each phase, run tests. If any fail, fix before proceeding."
- **💼 Use Case.** Write `spec.md` first whenever a `firstbuild` task spans behavior, tests, and output formatting instead of one obvious file edit.
- **🛠️ Pro Tip.** Codex facts: scoped tasks improve when the spec names files in bounds, proof commands, and what the agent must not change.

**Builds On:** `firstbuild` setup, TDD, and the cost of vague tickets from earlier lessons.

**Feeds:** Day 6 verification work and stronger specs for the rest of the course.

## Specification-Driven Development

### Overview: Specification-Driven Development

Start from a ticket students could actually ship this week, not a history lecture. If the task would be expensive to misunderstand in `firstbuild`, it needs a better spec before any agent touches code.

There's an old saying in construction: "Measure twice, cut once." The software equivalent is: "Specify thoroughly, implement once." But for decades, developers have done the opposite. They sketch a vague idea, start coding, hit a wall, backtrack, redesign, and repeat. The code gets written three times before it works.

AI agents make this pattern worse, not better. Why? Because agents are obedient. Tell them to "build a user dashboard" and they will. They'll make a hundred decisions you didn't specify: what data to show, how to lay it out, what happens on mobile, whether to cache, which API endpoints to hit. Every unspecified decision is a coin flip. Some will match what you wanted. Many won't.

**Specification-driven development** flips this. You invest time upfront writing a detailed description of what the system should do. The spec becomes the source of truth. The agent reads the spec and implements it. If the spec is good, the code is good. If the spec is vague, the code is a guess.

**Where this idea came from.** Formal specification has roots going back to the 1970s. Edsger Dijkstra and Tony Hoare advocated for mathematical proofs of program correctness. That was too rigorous for most teams. In the 1990s, the agile movement swung the other way: "working software over comprehensive documentation." The pendulum swung so far that many teams stopped writing specs entirely.

AI tools are swinging it back. Not to formal proofs (that's overkill), but to a middle ground: structured natural language specs that are detailed enough for an agent to execute. Think of it as writing a production ticket for a fabrication shop. You would not send over “make the bracket better.” You would send dimensions, tolerances, materials, and the tests it has to pass before it ships.

**The `spec.md` pattern.** In this course, every project includes a `spec.md` file. It's a plain English document that describes what the software should do. Here's the structure:

```markdown
### Project: URL Shortener

### Overview
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

**The cost of ambiguity.** A vague ticket is fast to write but creates rework when the agent builds the wrong thing. A detailed spec takes more effort upfront but produces code that's right the first time, or at least close enough that the corrections stay small. The math is clear: invest in specs.

**Real-world examples.** Public guidance from Anthropic and OpenAI both pushes teams toward explicit task framing, acceptance criteria, and verification commands before a coding agent starts editing files. The language varies. The pattern does not. Better specifications reduce guesswork and shorten review.

**🏫 What This Looks Like in Class.** In `firstbuild`, the students who write the spec first usually hit the implementation phase with fewer retries and fewer rewrites. The students who skip the spec often still finish, but they spend their time correcting preventable guesses. This lesson exists to make that cost visible before the final project raises the stakes.

### Claude Code Workflow: Specification-Driven Development

Rewrite one vague ticket in front of the class. Start with something under-specified like "improve signup." Ask students what is missing. They will usually name one or two gaps: validation, success criteria, or edge cases. Keep pushing until the room notices all the hidden decisions packed into those two words. Then turn the vague ticket into a short `spec.md` with scope, out-of-scope items, three quality gates, and a handful of Given/When/Then statements. Only after that should you hand it to an agent. This live rewrite matters because students need to feel how much ambiguity they usually carry around without noticing it. Once they see the agent behave better with the cleaned-up spec, the lesson stops sounding theoretical. It becomes a productivity move they can use the same day on homework, internships, or team tickets.

### Codex Workflow: Specification-Driven Development

The Codex version of spec-first work looks almost identical: the repo still needs a concrete goal, acceptance criteria, and a verification contract before the agent starts editing files. What changes is the interface. With Codex, students can delegate a scoped task in the cloud or from the local shell, but the quality of the result still tracks the quality of the specification. A strong Codex task says what to build, what files or systems matter, how to verify success, and what not to touch. That is why this lesson should not be taught as "how to prompt Claude better." It should be taught as "how to issue an engineering work order that any competent coding agent can execute." Claude Code, Codex, and the next tool after them all reward the same professional habit: crisp specs beat clever prose.

## Quality Gates and Acceptance Criteria

### Overview: Quality Gates and Acceptance Criteria

This shows up the minute a student says it works on my machine while the repo still has no repeatable proof. Quality gates are the class's way of turning a claim into evidence.

A quality gate is a checkpoint. It's a specific moment in the development process where you stop and verify that everything built so far actually works. Without quality gates, you can build for hours, only to discover at the end that the foundation was wrong and everything built on top of it is broken.

**Where quality gates came from.** The concept originates from manufacturing, specifically from quality management systems like Six Sigma and ISO 9001 that emerged in the 1980s. In manufacturing, a quality gate is a literal station on the assembly line where an inspector checks the product before it moves to the next stage. If the car door doesn't fit, you find out at the door station, not after the car is painted.

Software borrowed the idea. In waterfall development, quality gates were formal review meetings. In agile, they became sprint reviews and definition-of-done checklists. In CI/CD, they became automated test suites and deployment checks. Same concept, different packaging: verify before proceeding.

**Why quality gates matter more with AI agents.** Agents are fast. Dangerously fast. A human developer builds slowly enough that they notice problems as they go. An agent can build an entire feature in 90 seconds, and if the approach was wrong, all 90 seconds of work need to be thrown out. Quality gates are the brakes on that speed. They force the agent to stop, verify, and only proceed if the checkpoint passes.

**Anatomy of a good quality gate:**

Every quality gate needs three things:

1. **Invocation**: How do you trigger the check? This must be a concrete command. "Run `pytest tests/test_api.py`" is an invocation. "Check if the API works" is not.

1. **Success criteria**: What does "passing" look like? "Exit code 0" is a success criterion. "Looks good" is not.

1. **Failure response**: What happens if the check fails? Usually: "Fix the issue and re-run the gate before proceeding." The agent needs to know it should loop, not skip.

**The bench-test analogy.** Quality gates are the electrical bench tests you run before a board goes back into the system. Power check first. Signal check second. Full-system behavior after that. Without those checkpoints, the agent can move fast while quietly compounding the wrong assumption.

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
1. **Testing implementation, not behavior**: "The function should use a try/catch block." That's an implementation detail. "The function should return an error message instead of crashing" is a behavior.
1. **Missing the negative cases**: "Given a valid URL, the system shortens it." Great. What about an invalid URL? An empty string? A URL that's 10,000 characters long?
1. **No ordering**: If criteria depend on each other, make the order explicit. "Complete Gate 1 before starting Gate 2."

**Real-world quality gates in AI workflows.** The most effective pattern in practice is a three-gate system:

1. **Gate 1: Tests pass.** Run the full test suite. Zero failures.
1. **Gate 2: Linter passes.** Run the code through your linter/formatter. Zero warnings.
1. **Gate 3: Manual verification.** You, the human, check that the output matches the spec.

The first two gates are automated. The agent can run them itself and loop until they pass. The third gate is where your judgment comes in. This three-gate pattern catches many issues before they reach code review.

**🏫 What This Looks Like in Class.** The cleanest `firstbuild` submissions usually make the same move: they turn the assignment instructions into an execution ladder. Build one thin version, prove it works, then extend it. Students do better when the assignment stops feeling like one giant request and starts feeling like a sequence of checks the agent has to satisfy.

### Claude Code Workflow: Quality Gates and Acceptance Criteria

Take a feature students already understand from an earlier assignment and show how fast the quality gates become the real spec. Run an agent against a version of the task with no gates and watch what happens: the output might look impressive, but it is hard to verify. Then rerun the same task with explicit commands for tests, linting, and manual verification. Students will watch the agent slow down in the best possible way. It becomes more predictable because the stop conditions are explicit. This is the right time to say out loud that speed without gates is fake velocity. Real speed is the ability to finish a task and trust the result. If the room internalizes that sentence, they will write better tickets for the rest of the course.

### Codex Workflow: Quality Gates and Acceptance Criteria

Codex benefits from the same gate structure, and students should be able to translate it directly. A solid Codex task includes the commands that prove the work is acceptable: test commands, lint commands, type checks, screenshots, or manual verification notes. If the work spans multiple files or services, that verification contract matters even more because it prevents the agent from optimizing for a narrow local win. This is also where you can teach a durable cross-tool pattern: every agent task should end with evidence. Claude Code can summarize the checks it ran. Codex can do the same. The point is not to trust the model's confidence. The point is to demand receipts from the workflow.

## Break & Wrap Up

**🔥 Key takeaway:** The spec is the most important artifact in AI-assisted development. Invest upfront in a detailed specification with quality gates and acceptance criteria. It saves rework later.

**🧩 Before next class:** Write a `spec.md` for your `firstbuild` project with at least 3 quality gates and 5 acceptance criteria in Given/When/Then format. You'll use it in Day 6 to test against the real world.

### Pro Tip: Acceptance Criteria Should Sound Like Tests

If a requirement cannot be turned into a command, an assertion, or a concrete human check, it is still too fuzzy. That rule scales from student projects to production teams. Good specs reduce review time because everyone is measuring the same thing instead of arguing over taste. 📋

### Fun Fact: Public Incident Reports Are Great Writing Teachers

One underrated engineering trick is reading postmortems and leak coverage for writing quality, not gossip. Mature teams describe scope, blast radius, mitigation, and follow-up actions with sharp nouns and verbs. That same writing style is exactly what makes agent specifications effective. ✍️

### Debrief Questions

Ask the room which sentence in their own current project spec is still vague enough to cause rework. Then ask how they would prove it passed. Those two prompts usually surface the next revision immediately.

## After Class Challenges

### Challenge 1: Spec Writing Workshop

Write a complete `spec.md` for your `firstbuild` project:

1. Start with a one-paragraph overview of what the project does.
1. Define at least 3 quality gates, each with a concrete invocation and success criteria.
1. Write at least 5 acceptance criteria in Given/When/Then format (include at least 2 negative/edge cases).
1. Version your requirements: v1.0 (MVP), v1.1 (refinements), v1.2 (stretch).
1. Commit the spec before any implementation code.

### Challenge 2: Spec-to-Code Experiment

Test how spec quality affects code quality:

1. Write a deliberately vague spec (3 sentences, no quality gates). Give it to Claude Code. Save the output.
1. Write a detailed spec (full Given/When/Then, quality gates, edge cases). Give the same task to Claude Code. Save the output.
1. Compare: how much rework does each version need? How many edge cases did each handle? How many bugs survived to manual testing?
1. Write up your findings.

### Challenge 3: Quality Gate Automation

Build an automated quality gate system for your project:

1. Create a script (or Claude Code command) that runs all three gates in sequence: tests, linter, and a custom check of your choice.
1. Configure it so Claude Code runs the gates automatically after each implementation phase.
1. Document how the gates caught (or would have caught) a real issue during development.

## Additional Resources

1. [Writing Requirements: An Engineering Perspective by Dani Roxberry](https://droxey.com/docs/#/compsci/sdlc/requirements?id=writing-requirements-an-engineering-perspective)

### Source Notes

Start with the official docs and current model pages first. The remaining links add historical context, canonical books, or supporting examples.

1. [Behavior-Driven Development](https://dannorth.net/introducing-bdd/): Dan North's original article on Given/When/Then.
1. [Writing Good User Stories](https://www.mountaingoatsoftware.com/agile/user-stories): Mike Cohn's guide to user story format.
1. [Claude Code Best Practices: Plan Mode](https://code.claude.com/docs/en/best-practices): How specification connects to Claude Code's planning workflow.
1. [Specification by Example](https://gojko.net/books/specification-by-example/): Gojko Adzic's book on bridging specs and tests.
1. [OpenAI Codex](https://developers.openai.com/codex/): Official Codex documentation for task-based coding workflows.
1. [How OpenAI Uses Codex](https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf): Official examples of spec-driven coding work inside OpenAI.
