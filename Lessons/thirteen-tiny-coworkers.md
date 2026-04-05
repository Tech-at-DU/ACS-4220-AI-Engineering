# Thirteen Tiny Coworkers

## Learning Objectives

By the end of this lesson, you will be able to:

1. Implement the red/green/refactor TDD cycle with Claude Code writing the tests and you guiding the specification.
2. Spawn subagents using the Task tool and explain when delegation beats doing it yourself.
3. Use git worktrees to run parallel agents without merge conflicts.
4. Recognize the signs that a task should be split across multiple agents vs. handled in one session.

## Best Practices

- **Tests first, always.** Write the failing test before the implementation. Agents are excellent at making tests pass. They're terrible at knowing what to test. That's your job.
- **One agent, one concern.** If a task touches multiple unrelated systems (frontend, backend, database), split it across subagents. Each one stays focused and produces cleaner output.
- **Trust but verify.** Subagents work in isolation. When they return, review what they did before merging. Parallel doesn't mean unsupervised.
- **Worktrees prevent chaos.** Every subagent should get its own git worktree. This gives it an isolated copy of the repo. No merge conflicts mid-task.
- **Keep the orchestrator light.** The main session should decompose work and review results. Don't use it for heavy implementation. That's what subagents are for.
- **Name your agents.** When spawning multiple subagents, give them descriptive names. "test-agent" and "api-agent" are easier to track than "agent-1" and "agent-2."

# Topic 1: Test-Driven Development with AI

## Overview

Test-Driven Development was formalized by Kent Beck in the early 2000s. The idea was radical at the time: write the test before the code. Not after. Not at the same time. Before. You write a test that describes what the code should do, watch it fail (red), write the minimum code to make it pass (green), then clean up the code while keeping tests green (refactor). Red, green, refactor. That's the whole cycle.

TDD was controversial for years. Critics said it was slow, that writing tests first was unnatural, that it produced brittle test suites. Proponents said it produced better-designed code, caught bugs earlier, and served as living documentation. Both sides had valid points.

Then AI agents showed up, and TDD stopped being controversial. It became essential.

**Why TDD works even better with AI.** Here's the core insight: AI agents are phenomenally good at making tests pass. Give an agent a failing test and say "make this green," and it'll find a way. It might refactor the code. It might add a missing function. It might fix a typo. Whatever it takes to turn red into green.

But agents are not good at knowing what to test. They don't understand your business logic. They don't know that the "discount" field should never go negative, or that the API should return a 403 (not a 404) when a user lacks permissions, or that the date format needs to match what the mobile app expects. That knowledge lives in your head, in the product spec, in the conversation you had with the PM last Tuesday.

TDD gives you the perfect division of labor: **you decide what to test, the agent figures out how to make it pass.** You're the architect. The agent is the builder. The tests are the blueprints.

**The recipe analogy.** Imagine you're teaching someone to cook a dish they've never made. You could describe every step and hope they get it right. Or you could write down exactly what the final dish should taste like, look like, and smell like (the acceptance criteria), then let them figure out the technique. If the result matches the criteria, they nailed it. If not, they iterate. TDD works the same way. The tests are your acceptance criteria. The agent is the cook.

**The red/green/refactor cycle with Claude Code:**

```bash
# Red: Write a failing test
$ claude "Write a test for a function called calculate_discount
         that takes a price and a percentage.
         It should return the discounted price.
         Edge case: percentage > 100 should raise ValueError."

# Green: Make it pass
$ claude "Implement calculate_discount to make all tests pass."

# Refactor: Clean up
$ claude "Refactor calculate_discount for clarity. Keep all tests green."
```

Three steps. The agent handles the code. You handle the specification. If you skip the "red" step and just say "build a discount calculator," the agent will write both the code and the tests. The tests will pass. But they'll test whatever the agent decided to implement, not what you actually needed. You've lost control of the specification.

**Real-world patterns.** Companies like Vercel and Linear require test-first workflows when using AI agents internally. Their reasoning: without tests, there's no way to verify that the agent built what was requested. The tests are the contract between the human and the machine. Some teams go further and write the tests by hand (no AI), then let the agent implement the code. This guarantees the specification is human-authored.

**Common mistakes beginners make with AI + TDD:**

1. **Letting the agent write both tests and code.** The tests become tautological. They test what the code does, not what it should do.
2. **Skipping the refactor step.** Agent-generated code works but can be verbose or use odd patterns. The refactor step is where you shape it to fit your codebase's style.
3. **Testing implementation instead of behavior.** "Assert that the function calls `sort()`" is an implementation test. "Assert that the output is sorted" is a behavior test. Behavior tests survive refactoring. Implementation tests break.
4. **Not specifying edge cases.** If you don't mention what happens when the input is `None`, the agent won't test for it. Be explicit about boundaries.

**What the data says.** Anthropic's internal metrics show that test-first workflows with Claude Code produce 40% fewer bugs that make it to code review compared to code-first workflows. The reason isn't that the code is inherently better. It's that bugs get caught earlier, during the red/green cycle, before they compound.

# Topic 2: Parallel Agents and Subagent Orchestration

## Overview

Here's a scenario you'll hit eventually: you need to build a feature that touches the API, the database schema, and the frontend component. Each piece is independent enough to work on separately, but they all need to come together at the end. If you do them sequentially in one Claude Code session, it takes three rounds of heavy context. If you could work on all three simultaneously, you'd finish in one-third the time.

That's what parallel agents do.

**The project manager analogy.** Think about how a good project manager operates. They don't personally write the backend, design the UI, and update the database. They break the work into pieces, assign each piece to the right person, provide enough context for each person to work independently, then bring the pieces together at the end. That's exactly what you do with subagents. You're the PM. Each subagent is a specialist.

**Where this came from.** The idea of multi-agent systems isn't new. Researchers at Stanford, MIT, and Google explored "agent swarms" as early as 2023. But the practical implementation in developer tools is recent. Claude Code's Task tool (released in 2025) formalized the pattern by letting you spawn subagents from within a session. Each subagent gets its own context window, its own tool access, and (optionally) its own git worktree.

The breakthrough that made it practical was **git worktree isolation**. Before worktrees, parallel agents working on the same repo would create merge conflicts constantly. Agent A edits `server.py` line 42. Agent B also edits `server.py` line 42. Chaos. Git worktrees solve this by giving each agent a complete, isolated copy of the repo on a separate branch. They work in parallel without stepping on each other. When they're done, you merge the branches.

**How the Task tool works:**

```bash
# In your main Claude Code session:
$ claude "I need three things done in parallel:
  1. Add a /users endpoint to the API
  2. Create the users database migration
  3. Build a user profile React component
  Use subagents for each. Give each one a worktree."
```

The main session (the "orchestrator") decomposes the work, spawns three subagents, and waits for results. Each subagent:

1. Gets its own git worktree (isolated repo copy on a temporary branch).
2. Receives a focused prompt with only the context it needs.
3. Reads the codebase, implements the change, and runs relevant tests.
4. Returns a summary of what it did.
5. The worktree gets cleaned up automatically if no changes were made.

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
2. **Provide shared context.** If all subagents need to know the database schema, mention it in each prompt. Don't assume they'll discover it.
3. **Review before merging.** Each subagent works in isolation. It doesn't know what the other agents did. Conflicts can emerge at merge time. Review each branch before combining them.
4. **Start with two agents, not ten.** Orchestrating many agents is a skill. Build it gradually.

## Break & Wrap Up

**Key takeaway:** TDD gives you control of the specification while the agent handles implementation. Subagents let you parallelize work that would otherwise be sequential. Both skills compound over time.

**Before next class:** Write tests first for at least one feature in your `firstbuild` project. Try spawning a subagent for an independent task. Both experiences feed into the Day 5 workflow.

## After Class Challenges

### Challenge 1: Red/Green/Refactor Sprint

Pick a feature from your `firstbuild` project and implement it using strict TDD:

1. Write a failing test (you write the spec, Claude Code writes the test code).
2. Ask Claude Code to implement until the test passes.
3. Refactor the implementation while keeping tests green.
4. Repeat for at least 2 more features.
5. Your commit history should show tests committed before implementation for each feature.

### Challenge 2: Parallel Agent Experiment

Identify a task with at least two independent parts. Spawn subagents:

1. Decompose the task into 2-3 independent pieces.
2. Spawn a subagent for each piece using the Task tool with worktree isolation.
3. Review each agent's output before merging.
4. Document: how long did parallel execution take vs. your estimate for sequential? What conflicts (if any) emerged at merge time?

### Challenge 3: Test Quality Review

After completing Challenge 1, review your test suite:

1. Are you testing behavior or implementation?
2. Did you cover edge cases (null inputs, empty strings, boundary values)?
3. Ask Claude Code to identify untested paths in your code. Compare its findings with your own assessment.
4. Write a brief reflection: what did the agent miss that you caught? What did it catch that you missed?

## Additional Resources

1. [Test-Driven Development by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530): Kent Beck's original book on TDD.
2. [Claude Code Multi-Agent Workflows](https://code.claude.com/docs/en/common-workflows): Official docs on subagents and worktrees.
3. [Building a C Compiler with Parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler): Anthropic's case study on 16-agent orchestration.
4. [Claude Code Subagents: How They Work](https://www.morphllm.com/claude-subagents): Community deep dive on the Task tool.
