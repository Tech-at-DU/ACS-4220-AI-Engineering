# 🤖 ACS 4220: AI Engineering

<!-- omit in toc -->
## Table of Contents

1. [Course Description](#course-description)
1. [Prerequisites](#prerequisites)
1. [Learning Outcomes](#learning-outcomes)
1. [Schedule](#schedule)
   1. [Deliverables](#deliverables)
1. [Evaluation](#evaluation)
   1. [Assignments](#assignments)
   1. [Final Project](#final-project)
   1. [Final Presentation](#final-presentation)
1. [Late Assignment Policy](#late-assignment-policy)
1. [Instructor Automation](#instructor-automation)
1. [Course Documentation Ops](#course-documentation-ops)
1. [Additional Resources](#additional-resources)


## Course Description

_This course treats AI engineering like a real job. You will ship real work with coding agents that plan, use tools, inspect a codebase, and operate against live verification steps. We use Claude Code and Codex as parallel workflow hosts for the same engineering habits: scoped tasks, durable repo instructions, live context, tool use, verification, and review. By the end of the course, you will know how to design the context those systems receive, evaluate the work they produce, and decide when a faster agent loop is worth the risk and cost._

## Prerequisites

- [ACS 1220](https://github.com/Tech-at-DU/ACS-1220-Authentication-and-Associations)
- Comfort with Git, the command line, and reading small-to-medium codebases. This course is beginner-friendly for AI tooling, but it expects above-average engineering maturity.

## Learning Outcomes

By the end of the course, you will be able to&hellip;

1. Explain how modern coding agents generate output from training patterns, provided context, tool results, and verification loops rather than deterministic human-style reasoning.
1. Compare assistant-style autocomplete workflows with agent-driven workflows and choose the right one for the task.
1. Design and implement agent-assisted features in new and existing codebases using durable repo context, tests, and review.
1. Evaluate failure modes, costs, and integration tradeoffs when using Claude Code, Codex, MCP servers, and related tooling.


## Schedule

_Product details in this course are current as of April 2026. Before you buy a plan, depend on a specific model, or build against a platform feature, verify the live vendor docs linked in [Additional Resources](#additional-resources)._

**Course Dates:** Monday, March 23 through Wednesday, May 6, 2026 _(7 weeks)_<br>
**Class Times:** Monday, Wednesday 1:00pm - 3:30pm PST _(14 sessions, see below)_

| Date | Day | Class Topics | Tutorial Milestone |
| :---: | :---: | ------------------------------------------------------------------------- | --- |
| `03/23` | `01`  | **[Copilot ≠ Coworker](Lessons/copilot-neq-coworker.md)** | :test_tube: [The Prompt Lab](Assignments/tutorial-1-prompt-engineering.md) — Start tutorial, chapters 1–4 |
| `03/25` | `02`  | **[Memory Is Everything](Lessons/memory-is-everything.md)** | :test_tube: Complete chapters 5–9 |
| `03/30` | `03`  | **[Ticket to Merge](Lessons/ticket-to-merge.md)** | :test_tube: **Due:** Journal + combined prompt |
| `04/01` | `04`  | **[Thirteen Tiny Coworkers](Lessons/thirteen-tiny-coworkers.md)** | :rocket: [Claude Code in Action](Assignments/tutorial-2-claude-code-in-action.md) — Start course |
| `04/06` | `05`  | **[Words Before Code](Lessons/words-before-code.md)** | :rocket: Complete all modules + before/after audit |
| `04/08` | `06`  | **[Nothing Survives First Contact](Lessons/nothing-survives-first-contact.md)** | :rocket: **Due:** Apply new technique + `workflow-audit.md` |
| `04/13` | `07`  | **[Somebody Else's Spaghetti](Lessons/somebody-elses-spaghetti.md)** | |
| `04/15` | `08`  | **[House Rules](Lessons/house-rules.md)** | :mortar_board: [Mastering Claude AI](Assignments/tutorial-3-mastering-claude-ai.md) — Start RAG module |
| `04/20` | `09`  | **[Give It Eyes and Ears](Lessons/give-it-eyes-and-ears.md)** | :mortar_board: Complete MCP module |
| `04/22` | `10`  | **[What Do You Even Do All Day?](Lessons/what-do-you-even-do-all-day.md)** | :mortar_board: Complete Agent SDK module |
| `04/27` | `11`  | **[One Config to Rule Them All](Lessons/one-config-to-rule-them-all.md)** | :mortar_board: **Due:** `architecture.md` + proof of concept |
| `04/29` | `12`  | **[Debugging the Debugger](Lessons/debugging-the-debugger.md)** | |
| `05/04` | `13`  | Lab Day for [Final Project](Assignments/makeanything.md) | |
| `05/06` | `14`  | [**Final Presentations**](Assignments/makeanything.md) | |

### Deliverables

_ALL deliverables **must** be submitted to [Gradescope](https://www.gradescope.com/courses/1293005) by **11:59PM PST** on the date due._

📚 Assignment | 🔗 Criteria | 📆 Due Date
:-- | --- | ---
:test_tube: **[Tutorial 1: The Prompt Lab](Assignments/tutorial-1-prompt-engineering.md)** | [Requirements](Assignments/tutorial-1-prompt-engineering.md) | March 30, 2026 _(Monday)_
**[firstbuild](Assignments/firstbuild.md)** | [Requirements](Assignments/firstbuild.md) | April 8, 2026 _(Wednesday)_
:rocket: **[Tutorial 2: Claude Code in Action](Assignments/tutorial-2-claude-code-in-action.md)** | [Requirements](Assignments/tutorial-2-claude-code-in-action.md) | April 8, 2026 _(Wednesday)_
**[fixthis](Assignments/fixthis.md)** | [Requirements](Assignments/fixthis.md) | April 22, 2026 _(Wednesday)_
:mortar_board: **[Tutorial 3: Mastering Claude AI](Assignments/tutorial-3-mastering-claude-ai.md)** :star: | [Requirements](Assignments/tutorial-3-mastering-claude-ai.md) | April 27, 2026 _(Monday)_
**[wiredup](Assignments/wiredup.md)** | [Requirements](Assignments/wiredup.md) | April 29, 2026 _(Wednesday)_
**Final Presentation** | [Requirements](Assignments/makeanything.md) | May 6, 2026 _(Wednesday)_
**Final Project** | [Requirements](Assignments/makeanything.md) | May 8, 2026 _(Friday)_

## Evaluation

We're using [Gradescope](https://www.gradescope.com/courses/1293005) for all submissions and feedback. When grades post, you'll get notified right away so you can see your feedback. You can submit a regrade request if you think there's a mistake.

Your [Gradescope](https://www.gradescope.com/courses/1293005) login is your Dominican University email.

**To pass this course, complete the following**:

- Complete all [assignments](#deliverables), the [final project](#final-project), and the [final presentation](#final-presentation) as assigned in class and described in the sections below.
- Make up all activities, classwork, and drills from all absences.
- Actively participate in class and abide by the attendance policy.

### Assignments

Three hands-on assignments build on each other throughout the course. Each one validates a core skill set — you'll build something new, fix something old, and wire tools together. Three interactive tutorials reinforce foundational skills at key moments — prompt engineering, CLI mastery, and advanced architecture patterns. All assignments and tutorials must be turned in on [Gradescope](https://www.gradescope.com/courses/1293005).

:star: **Coursera Certification Opportunity:** Tutorial 3 ([Mastering Claude AI](Assignments/tutorial-3-mastering-claude-ai.md)) is part of a Coursera specialization that offers a completion certificate with paid enrollment. If you're graduating in May and building your portfolio, it can serve as one more signal of serious follow-through alongside the actual project work you show. Free audit covers all the course content without the certificate.

### Final Project

Complete the final project according to the associated [project rubric](Assignments/makeanything.md). This is your portfolio piece — choose something you care about and demonstrate end-to-end mastery of the workflow.

### Final Presentation

The delivery of a live presentation is required to pass this course. **Presentations will be delivered on Zoom during the final day of class**.

Your **7 minute presentation** should include a working demo, a walkthrough of your development process, and lessons learned. Up to three minutes of Q&A will follow.

**Your final presentation will be evaluated based on the rubric in the [Final Project](Assignments/makeanything.md) spec. An average score of 2.5 or higher on the rubric is required to pass.**

## Late Assignment Policy

The **absolute last day** to submit any assignment will be **Friday, May 8 at 11:59 PM**.

If you require accommodations or have extenuating circumstances such as prolonged illness, please contact your instructor to request an extension.

## Instructor Automation

Instructors managing Gradescope setup can use the Node-based planning workflow documented in [instructors.md](instructors.md). The guide covers rubric export, structured rubric JSON, the Gradescope manifest, the `gradescope:plan` dry-run, the `--new` course-planning flag, and the test suite.

## Course Documentation Ops

Use these generated artifacts for fast navigation and agent ingestion:

- [SITEMAP.md](SITEMAP.md): Full markdown sitemap grouped by top-level directory.
- [llms.txt](llms.txt): Compact `llms.txt` index for agent discovery.
- [llms-full.txt](llms-full.txt): Full markdown corpus export for offline context loading.
- [llms-sitemap skill](.codex/skills/llms-sitemap/SKILL.md): Skill instructions for regenerating all three files.

## Additional Resources

### Tips

- [Tips](tips/README.md): Field notes, fixes, and quick wins for working with AI tooling in this course — including how to stop Claude Code from burning tokens on git status every session.

### Source Notes

Start with the official docs and current model pages first. The remaining links add historical context, canonical books, or supporting examples.

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code): Official reference for the primary tool used in this course.
- [OpenAI Codex](https://developers.openai.com/codex/): Official Codex documentation for cross-tool translation of the workflows we practice in class.
- [Using Codex With Your ChatGPT Plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan): Official access overview for the Codex app, CLI, IDE extension, and cloud tasks.
- [GPT-5.3-Codex Model](https://developers.openai.com/api/docs/models/gpt-5.3-codex): Official model page for current Codex pricing, context window, and reasoning settings.
- [Model Context Protocol](https://modelcontextprotocol.io): Specification for connecting AI tools to external services and data.
- [Context7 MCP Server](https://github.com/upstash/context7): Live library documentation for your development workflow.
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook): Recipes and patterns for building with Claude.
- [How OpenAI Uses Codex](https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf): Official engineering examples showing how Codex is used in production workflows.

### Claude Code Access for Students

You need access to Claude Code to complete coursework. Use this section as the source of truth for plan choices, then verify the live [Claude pricing page](https://claude.com/pricing) before you purchase because limits and packaging can change.

| Option | Cost | What You Get |
|---|---|---|
| **Claude Pro** | `$20/month` monthly or `$17/month` billed annually | Includes Claude Code for normal coursework usage |
| **Claude Max** | From `$100/month` | Higher-usage tier for heavy project weeks or power users |
| **Claude API** | Pay as you go | Best fit when you want explicit budget control or automation |

**Free and discounted options:**

- **[Anthropic Student Builders Program](https://www.anthropic.com/students)**: Apply for ~$50 in free API credits. Ideal supplement to a Pro plan for heavy assignment weeks.
- **[GitHub Student Developer Pack](https://education.github.com/pack)**: Check for bundled Anthropic credits — offerings update regularly.
- **University `.edu` Partnerships**: Anthropic offers institutional access programs. Check with your department for any existing agreements.

**Recommendation for this course:** Start with **Claude Pro**. It covers daily coding sessions and most assignments. Apply for the **Student Builders Program** early in the semester for extra API credits during project-heavy weeks.

### Codex Access for Students

Codex is optional in this course, but it is useful for cross-tool comparison and extra reps on agent workflows. As of April 2026, OpenAI's help center says Codex is included with ChatGPT Plus, Pro, Business, and Enterprise/Edu, with limited-time access on some lower tiers. If you want API-first usage instead of the ChatGPT plan path, budget from the live [GPT-5.3-Codex model page](https://developers.openai.com/api/docs/models/gpt-5.3-codex) and current OpenAI pricing docs before you commit to a heavier workflow.
