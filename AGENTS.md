# ACS 4220: AI Engineering — Project Instructions

## Brand Voice

All `.md` files follow droxey's brand voice (enforced globally via `~/.Codex/AGENTS.md`).

## Working Rules

- Make minimal necessary changes.
- Fix root causes, not surface symptoms.
- Treat docs and course ops as part of the product.
- Cite external material clearly. If outside material informs a lesson, assignment, or README update, add the source link in `Additional Resources` or the relevant resources section so the course does not drift into plagiarism or academic dishonesty.
- When content changes affect navigation or schedule, update [README.md](README.md) and [_sidebar.md](_sidebar.md) in the same pass.
- After Markdown edits, run `npm run lint:md`.

## Content Structure

### Lesson Plans

Every lesson should follow this order:

1. Learning Objectives ("By the end of this lesson, you will be able to...")
1. Best Practices (5-6 bullets)
1. Topic 1: Overview (600-1200 words, origins + analogies + real-world examples)
1. Topic 2: Overview (600-1200 words, same depth)
1. Break & Wrap Up (combined, key takeaway + before-next-class task)
1. After Class Challenges (3 challenges, mix of context-building and standalone)
1. Additional Resources (4-5 links, include current April 2026 tool/model/workflow context when relevant)

**Never include**: Minute-by-minute tables, time markers like `(10 min)`, Reveal.js markup, mid-lesson activity sections.

### Assignments

1. Purpose (Why should I do this?)
1. Setup (How to start)
1. Instructions / Deliverables (What to do)
1. Rubric: Needs Improvement / Basic / Proficient / Advanced (always 4 levels, never 3)
1. Submission (Where to turn in)
1. Resources (Where to learn more)

## README and Tutorials

Keep the three tutorial files linked in the syllabus and sidebar.

README should preserve:

- Tutorial milestones in the schedule
- The Coursera certification callout for Tutorial 3
- Claude Code student access options in Additional Resources
- Link the word [Gradescope](https://www.gradescope.com/courses/1293005) instead of pasting or describing the raw URL in prose

## Token & Tool Optimization

### Model Routing

- **Default**: Sonnet 4.6 for implementation, edits, reviews
- **Planning**: Opus for architecture decisions, complex multi-file reasoning
- **Routine**: Haiku for formatting, boilerplate, simple reads

### Context Discipline

- **Subagents**: Use for any exploration reading 3+ files, research, or validation
- **Compaction**: After completing each discrete task, compact. Preserve: modified file list, test commands, architectural decisions
- **Scope narrowly**: One lesson or assignment per task. Don't load all 12 lessons at once
- **Front-load context**: Key patterns are in this file — don't re-read lesson files to discover structure

### File Editing

- Use `Edit` over `Write` for existing files (sends diff, not full content)
- Read only the lines you need (`offset` + `limit` params) — not entire files
- Batch independent edits in parallel tool calls

## Project Layout

```
Lessons/      # 12 lesson plans (weeks 1-6, 2 per week)
Assignments/  # 3 assignments + 3 tutorials + final project
Images/       # Slide headers and diagrams
.claude/      # Claude Code config (CLAUDE.md, settings.json)
```

- [README.md](README.md) is the syllabus
- [_sidebar.md](_sidebar.md) is the Docsify navigation
- Markdown lint config lives in [.markdownlint.jsonc](.markdownlint.jsonc)

## Gotchas

- Lesson filenames use slugs (e.g., `copilot-neq-coworker.md`), not numbers
- README.md serves as the syllabus — has schedule table, deliverables, and resources
- `_sidebar.md` is the Docsify navigation — update when adding/renaming files
