# Thirteen Tiny Coworkers

## Agenda

- [Learning Objectives](#learning-objectives)
- [Best Practices](#best-practices)
- [Test-Driven Development with AI](#test-driven-development-with-ai)
  - [Overview: Test-Driven Development with AI](#overview-test-driven-development-with-ai)
- [Parallel Agents and Subagent Orchestration](#parallel-agents-and-subagent-orchestration)
  - [Overview: Parallel Agents and Subagent Orchestration](#overview-parallel-agents-and-subagent-orchestration)
- [Break & Wrap Up](#break-wrap-up)
- [After Class Challenges](#after-class-challenges)
  - [Challenge 1: Red/Green/Refactor Sprint](#challenge-1-redgreenrefactor-sprint)
  - [Challenge 2: Parallel Agent Experiment](#challenge-2-parallel-agent-experiment)
  - [Challenge 3: Test Quality Review](#challenge-3-test-quality-review)
- [Additional Resources](#additional-resources)

## Learning Objectives

By the end of this lesson, you will be able to:

1. Implement the red/green/refactor TDD cycle with Claude Code writing the tests and you guiding the specification.
1. Spawn subagents using the Task tool and explain when delegation beats doing it yourself.
1. Use git worktrees to run parallel agents without merge conflicts.
1. Recognize the signs that a task should be split across multiple agents vs. handled in one session.

## Best Practices

- **Tests first, always.** Write the failing test before the implementation. Agents are excellent at making tests pass. They're terrible at knowing what to test. That's your job.
- **One agent, one concern.** If a task touches multiple unrelated systems (frontend, backend, database), split it across subagents. Each one stays focused and produces cleaner output.
- **Trust but verify.** Subagents work in isolation. When they return, review what they did before merging. Parallel doesn't mean unsupervised.
- **Worktrees prevent chaos.** Every subagent should get its own git worktree. This gives it an isolated copy of the repo. No merge conflicts mid-task.
- **Keep the orchestrator light.** The main session should decompose work and review results. Don't use it for heavy implementation. That's what subagents are for.
- **Name your agents.** When spawning multiple subagents, give them descriptive names. "test-agent" and "api-agent" are easier to track than "agent-1" and "agent-2."
- **💼 Use Case.** Use strict TDD for `firstbuild` features with fuzzy edge cases, then split `wiredup` into separate agent lanes when the work truly diverges.
- **🛠️ Pro Tip.** Codex facts: parallel agent work scales best when each task owns a distinct write surface and a concrete verification command.

**Builds On:** Day 3's ticket-to-merge workflow and early `firstbuild` implementation work.

**Feeds:** test-first `firstbuild` submissions and later multi-agent work in `wiredup` and `makeanything`.

## Test-Driven Development with AI

### Overview: Test-Driven Development with AI

The practical version is direct: a student wants to add one feature to `firstbuild` without arguing later about what the feature meant. Writing the failing test first is how the class turns agent speed into something reviewable.

Test-Driven Development was formalized by Kent Beck in the early 2000s. The idea was radical at the time: write the test before the code. Not after. Not at the same time. Before. You write a test that describes what the code should do, watch it fail (red), write the minimum code to make it pass (green), then clean up the code while keeping tests green (refactor). Red, green, refactor. That's the whole cycle.

TDD was controversial for years. Critics said it was slow, that writing tests first was unnatural, that it produced brittle test suites. Proponents said it produced better-designed code, caught bugs earlier, and served as living documentation. Both sides had valid points.

Then AI agents showed up, and TDD stopped being controversial. It became essential.

**Why TDD works even better with AI.** Here's the core insight: AI agents are phenomenally good at making tests pass. Give an agent a failing test and say "make this green," and it'll find a way. It might refactor the code. It might add a missing function. It might fix a typo. Whatever it takes to turn red into green.

But agents are not good at knowing what to test. They don't understand your business logic. They don't know that the "discount" field should never go negative, or that the API should return a 403 (not a 404) when a user lacks permissions, or that the date format needs to match what the mobile app expects. That knowledge lives in your head, in the product spec, in the conversation you had with the PM last Tuesday.

TDD gives you the perfect division of labor: **you decide what to test, the agent figures out how to make it pass.** You're the architect. The agent is the builder. The tests are the blueprints.

**The grading-rubric analogy.** Imagine handing someone an assignment without telling them how it will be evaluated. They might produce something polished and still miss the target. TDD fixes that by publishing the rubric first. The failing test says what counts as correct before the implementation starts, so the agent is solving toward an explicit standard instead of inventing its own.

**The red/green/refactor cycle with Claude Code:**

```bash
### Red: Write a failing test
$ claude "Write a test for a function called calculate_discount
         that takes a price and a percentage.
         It should return the discounted price.
         Edge case: percentage > 100 should raise ValueError."

### Green: Make it pass
$ claude "Implement calculate_discount to make all tests pass."

### Refactor: Clean up
$ claude "Refactor calculate_discount for clarity. Keep all tests green."
```

Three steps. The agent handles the code. You handle the specification. If you skip the "red" step and just say "build a discount calculator," the agent will write both the code and the tests. The tests will pass. But they'll test whatever the agent decided to implement, not what you actually needed. You've lost control of the specification.

**Real-world patterns.** Teams using coding agents in serious repos usually pair them with stronger tests, clearer specs, and tighter review. The reason is straightforward: without a failing test or an acceptance contract, the agent can produce code that looks complete while still drifting from the real requirement.

**Common mistakes beginners make with AI + TDD:**

1. **Letting the agent write both tests and code.** The tests become tautological. They test what the code does, not what it should do.
1. **Skipping the refactor step.** Agent-generated code works but can be verbose or use odd patterns. The refactor step is where you shape it to fit your codebase's style.
1. **Testing implementation instead of behavior.** "Assert that the function calls `sort()`" is an implementation test. "Assert that the output is sorted" is a behavior test. Behavior tests survive refactoring. Implementation tests break.
1. **Not specifying edge cases.** If you don't mention what happens when the input is `None`, the agent won't test for it. Be explicit about boundaries.

**Why teams like the pattern.** Test-first work narrows the agent's job from “figure out what good means” to “make this requirement pass without breaking the rest.” That usually produces cleaner review conversations because the human and the tool are debating evidence instead of intention.

**🏫 What This Looks Like in Class.** `firstbuild` is where this lesson stops being theory. Students usually discover that the first version of a feature feels obvious until they try to write the failing test and realize they still have unresolved rules about edge cases, naming, or return values. That moment is the point. TDD with agents forces hidden assumptions into the open early enough to keep the build cheap.

### Claude Code Workflow: Test-Driven Development with AI

Show one strict red/green/refactor loop from end to end. Do not skip the red part, and do not let the agent write the requirement for itself. Students need to see who owns the test and who owns the implementation. That division of labor is the whole point of the lesson.

### Codex Workflow: Test-Driven Development with AI

Codex thrives under the same constraint. If students define the failing test or the acceptance criteria first, the agent becomes an implementation machine instead of a guess generator. That principle transfers cleanly across vendors because it is about control of the contract, not brand-specific prompting.

## Parallel Agents and Subagent Orchestration

### Overview: Parallel Agents and Subagent Orchestration

Students should picture a real split task here, not an abstract swarm: one agent handling tests, one handling implementation, one handling docs or config. The lesson is about decomposing repo work into lanes that can merge cleanly.

Here's a scenario you'll hit eventually: you need to build a feature that touches the API, the database schema, and the frontend component. Each piece is independent enough to work on separately, but they all need to come together at the end. If you do them sequentially in one Claude Code session, it takes three rounds of heavy context. If you could work on all three simultaneously, you'd finish in one-third the time.

That's what parallel agents do.

**The film-crew analogy.** Think about a short shoot with separate camera, sound, and lighting roles. One person can technically do all three, but the quality drops and setup takes longer. A good director breaks the work into lanes, gives each person the shot list, then reviews the combined result. Subagents work the same way. Each one needs a clear lane and a shared brief, or the final cut becomes chaos.

**Where this came from.** The idea of multi-agent systems isn't new. Researchers at Stanford, MIT, and Google explored "agent swarms" as early as 2023. But the practical implementation in developer tools is recent. Claude Code's Task tool (released in 2025) formalized the pattern by letting you spawn subagents from within a session. Each subagent gets its own context window, its own tool access, and (optionally) its own git worktree.

The breakthrough that made it practical was **git worktree isolation**. Before worktrees, parallel agents working on the same repo would create merge conflicts constantly. Agent A edits `server.py` line 42. Agent B also edits `server.py` line 42. Chaos. Git worktrees solve this by giving each agent a complete, isolated copy of the repo on a separate branch. They work in parallel without stepping on each other. When they're done, you merge the branches.

**How the Task tool works:**

```bash
### In your main Claude Code session:
$ claude "I need three things done in parallel:
  1. Add a /users endpoint to the API
  2. Create the users database migration
  3. Build a user profile React component
  Use subagents for each. Give each one a worktree."
```

The main session (the "orchestrator") decomposes the work, spawns three subagents, and waits for results. Each subagent:

1. Gets its own git worktree (isolated repo copy on a temporary branch).
1. Receives a focused prompt with only the context it needs.
1. Reads the codebase, implements the change, and runs relevant tests.
1. Returns a summary of what it did.
1. The worktree gets cleaned up automatically if no changes were made.

**When to use subagents vs. doing it yourself:**

| Use Subagents When... | Stay in Main Session When... |
|---|---|
| The task has independent pieces | The task is sequential (each step depends on the last) |
| You need to explore multiple approaches | You need tight back-and-forth iteration |
| The task produces verbose output you don't need to see | You need to see every intermediate step |
| Context would get too large for one session | The task fits comfortably in one context window |

**Anthropic's proof of scale.** The most impressive demonstration of parallel agents came from Anthropic itself. They used 16 parallel Claude Code agents to build a C compiler across 2,000 sessions, producing over 100,000 lines of code. The orchestrator assigned modules (lexer, parser, code generator, optimizer) to different agents. Each agent worked independently with worktree isolation. The result compiled real C programs.

You won't build a compiler in this class. But the pattern scales down too: three agents building three API endpoints, or two agents where one writes tests while the other implements the feature.

**Practical tips for orchestration:**

1. **Decompose clearly.** Vague delegation produces vague results. "Handle the backend" is bad. "Add a POST /users endpoint that accepts {name, email} and returns the created user with a 201 status" is good.
1. **Provide shared context.** If all subagents need to know the database schema, mention it in each prompt. Don't assume they'll discover it.
1. **Review before merging.** Each subagent works in isolation. It doesn't know what the other agents did. Conflicts can emerge at merge time. Review each branch before combining them.
1. **Start with two agents, not ten.** Orchestrating many agents is a skill. Build it gradually.

**🏫 What This Looks Like in Class.** `wiredup` is a better parallel-agent assignment than `firstbuild` because it naturally splits into separate concerns: server setup, configuration, and validation. That gives students a real reason to delegate instead of spawning subagents for the sake of novelty. The assignment itself becomes the evidence for when orchestration is justified.

### Claude Code Workflow: Parallel Agents and Subagent Orchestration

Run a two-agent demo, not a ten-agent circus. One agent writes or updates the tests. One agent implements the feature. Then compare the results and show the merge review. That is enough to make the orchestration pattern concrete without turning the class into terminal theater.

### Codex Workflow: Parallel Agents and Subagent Orchestration

Codex supports parallel coding work too, whether that happens through cloud tasks or multi-step repo delegation. The engineering rule stays the same: decompose by ownership. If two agents need to edit the same file at the same time, your task split is weak. If each agent owns a clean slice and the orchestrator only integrates, the system scales.

## Break & Wrap Up

**🔥 Key takeaway:** TDD gives you control of the specification while the agent handles implementation. Subagents let you parallelize work that would otherwise be sequential. Both skills compound over time.

**🧩 Before next class:** Write tests first for at least one feature in your `firstbuild` project. Try spawning a subagent for an independent task. Both experiences feed into the Day 5 workflow.

### Pro Tip: Decompose by Write Ownership

The cleanest parallel runs happen when each agent owns a disjoint part of the repo. Split by responsibility, not by vague ambition. 🧩

### Fun Fact: Multi-Agent Systems Look a Lot Like Project Management

When engineers got a glimpse of recent internal agent orchestration details in public reporting, one of the funniest reactions was how un-magical the winning pattern looked. Strong multi-agent work is mostly scoping, ownership, handoff, and review. In other words: project management with sharper tools. 🏗️

### Instructor Closing Loop

Close by connecting the two halves of the lesson. TDD gives each agent a target. Orchestration gives each agent a lane. Without the first, parallel work becomes parallel guessing. Without the second, test-first work still gets bottlenecked in one overloaded session. Students who can say that back to you understood the system rather than the slogans.

## After Class Challenges

### Challenge 1: Red/Green/Refactor Sprint

Pick a feature from your `firstbuild` project and implement it using strict TDD:

1. Write a failing test (you write the spec, Claude Code writes the test code).
1. Ask Claude Code to implement until the test passes.
1. Refactor the implementation while keeping tests green.
1. Repeat for at least 2 more features.
1. Your commit history should show tests committed before implementation for each feature.

### Challenge 2: Parallel Agent Experiment

Identify a task with at least two independent parts. Spawn subagents:

1. Decompose the task into 2-3 independent pieces.
1. Spawn a subagent for each piece using the Task tool with worktree isolation.
1. Review each agent's output before merging.
1. Document: how long did parallel execution take vs. your estimate for sequential? What conflicts (if any) emerged at merge time?

### Challenge 3: Test Quality Review

After completing Challenge 1, review your test suite:

1. Are you testing behavior or implementation?
1. Did you cover edge cases (null inputs, empty strings, boundary values)?
1. Ask Claude Code to identify untested paths in your code. Compare its findings with your own assessment.
1. Write a brief reflection: what did the agent miss that you caught? What did it catch that you missed?

## Additional Resources

### Source Notes

Start with the official docs and current model pages first. The remaining links add historical context, canonical books, or supporting examples.

1. [Test-Driven Development by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530): Kent Beck's original book on TDD.
1. [Claude Code Multi-Agent Workflows](https://code.claude.com/docs/en/common-workflows): Official docs on subagents and worktrees.
1. [Building a C Compiler with Parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler): Anthropic's case study on 16-agent orchestration.
1. [Claude Code Subagents: How They Work](https://www.morphllm.com/claude-subagents): Community deep dive on the Task tool.
1. [OpenAI Codex](https://developers.openai.com/codex/): Official Codex documentation for coding-agent workflows and task decomposition.
