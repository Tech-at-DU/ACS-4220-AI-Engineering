# :mortar_board: Tutorial 3: Mastering Claude AI

_Complete the Coursera specialization modules on MCP, RAG, and the Agent SDK — the architecture behind your final project._

## Purpose (Why should I do this?)

Your final project requires you to build something real, end-to-end, using everything you've learned. This specialization teaches the architectural patterns that separate a demo from a production system: how to connect Claude to external data with RAG, extend its capabilities through MCP, and orchestrate autonomous agents with the Agent SDK. These are the skills employers are hiring for right now.

### Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Deliverables](#deliverables)
4. [Resources](#resources)

## Overview

You'll work through targeted modules from **Mastering Claude AI**, Anthropic's multi-course Coursera specialization. You don't need to complete the entire specialization — focus on the three modules that directly power your final project.

**External Course:** [Mastering Claude AI (Coursera Specialization)](https://www.coursera.org/specializations/mastering-claude-ai-prompting-apis-rag-and-mcp)

> :star: **Certification Opportunity:** Complete the full specialization with paid enrollment and you'll earn an industry-recognized Coursera certificate. If you're graduating in May and building your portfolio, this is a strong credential to carry into interviews. Free audit covers all the same content without the certificate.

**Required Modules:**

1. **RAG with Claude** — How to give Claude access to your own data at query time.
2. **MCP Integration** — How to build and connect protocol servers (the architecture behind Day 9's lesson).
3. **Agent SDK** — How to build autonomous agents that plan, execute, and recover from errors.

## Getting Started

1. **Enroll** at [Coursera](https://www.coursera.org/specializations/mastering-claude-ai-prompting-apis-rag-and-mcp). Free audit is available (no certificate). Paid tier includes graded assignments and certificates.
2. **Navigate to the required modules** — you can skip earlier modules if you've already covered that material in class.
3. Have your `wiredup` repo and final project ideas handy — you'll connect what you learn directly to your own work.

## Instructions

Complete each task in the order they appear. Use [GitHub Task List](https://help.github.com/en/github/managing-your-work-on-github/about-task-lists) syntax to track your progress.

### Part 1 — Complete the Required Modules

- [ ] Complete the **RAG with Claude** module. Take notes on the retrieval patterns covered.
- [ ] Complete the **MCP Integration** module. Compare their approach with what you built in the `wiredup` assignment.
- [ ] Complete the **Agent SDK** module. Identify at least 2 patterns you could use in your final project.
- [ ] Take screenshots of your progress/completion for each module.

### Part 2 — Architecture Proposal

- [ ] Create a file called `architecture.md` in your **final project** repo.
- [ ] Write a **1-page architecture proposal** for your [MakeAnything](MakeAnything.md) final project that incorporates at least 2 of the 3 patterns (RAG, MCP, Agent SDK).
- [ ] Include a **system diagram** (text-based is fine — use Mermaid, ASCII, or a screenshot of a sketch).
- [ ] For each pattern you're using, explain:
  - Why this pattern fits your project.
  - What data or services it connects to.
  - One risk or limitation you anticipate.
- [ ] **Add, commit, and push to GitHub**.

### Part 3 — Proof of Concept

- [ ] Build a **working prototype** of one architectural component from your proposal.
- [ ] It doesn't need to be polished — it needs to prove the pattern works for your use case.
- [ ] Write a brief `poc-notes.md` documenting: what you built, what worked, what surprised you.
- [ ] **Add, commit, and push to GitHub**.

### Stretch Challenges

- [ ] Complete **all modules** in the specialization (not the required 3).
- [ ] Build a working MCP server that connects to a real external service and demo it to a classmate.
- [ ] Implement a multi-agent architecture where agents have different roles (planner, executor, reviewer) and coordinate on a task.

## Rubric

| | **Needs Improvement** | **Basic** | **Proficient** | **Advanced** |
|:--|:--|:--|:--|:--|
| **Module Completion** | Fewer than 2 modules completed | All 3 required modules completed | Completed with detailed notes showing engagement | Completed full specialization; earned certificate |
| **Architecture Proposal** | Missing or vague; no diagram | Proposal present; uses 1 pattern; diagram is unclear | Clear proposal with 2+ patterns; readable diagram; honest risk assessment | Production-quality proposal; could guide actual implementation |
| **Proof of Concept** | No prototype or non-functional | Prototype attempted but incomplete | Working prototype that validates the chosen pattern | Prototype demonstrates multiple patterns working together |
| **Connection to Final Project** | Tutorial work disconnected from project | Some connection but surface-level | Clear thread from tutorial → proposal → prototype → final project plan | Tutorial directly accelerated final project; evidence of iteration |

## Submission

Add `architecture.md` and `poc-notes.md` to your **final project** repo and submit the GitHub link via [Gradescope](https://gradescope.com).

## Resources

### Lesson Plans

- [**Day 09**: Give It Eyes and Ears](../Lessons/give-it-eyes-and-ears.md): MCP servers and extending Claude's capabilities.
- [**Day 10**: What Do You Even Do All Day?](../Lessons/what-do-you-even-do-all-day.md): Agent observability and monitoring.
- [**Day 11**: One Config to Rule Them All](../Lessons/one-config-to-rule-them-all.md): Deploying AI tools across a team.
- [**Day 12**: Debugging the Debugger](../Lessons/debugging-the-debugger.md): When the tool itself fails.

### External

- [Mastering Claude AI (Coursera)](https://www.coursera.org/specializations/mastering-claude-ai-prompting-apis-rag-and-mcp): The full specialization.
- [Model Context Protocol Spec](https://modelcontextprotocol.io): MCP reference documentation.
- [Claude Agent SDK](https://docs.anthropic.com/en/docs/agents): Official agent architecture docs.
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook): RAG patterns and advanced recipes.
