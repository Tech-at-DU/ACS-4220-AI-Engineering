# ACS 4220 Project Instructions

## Working Rules

- Make minimal necessary changes.
- Fix root causes, not surface symptoms.
- Treat docs and course ops as part of the product.
- Cite external material clearly. If outside material informs a lesson, assignment, or README update, add the source link in `Additional Resources` or the relevant resources section so the course does not drift into plagiarism or academic dishonesty.
- When content changes affect navigation or schedule, update [README.md](README.md) and [_sidebar.md](_sidebar.md) in the same pass.
- After Markdown edits, run `npm run lint:md`.

## Lesson Contract

Every lesson should follow this order:

1. Learning Objectives
1. Best Practices
1. Topic 1
1. Topic 2
1. Break & Wrap Up
1. After Class Challenges
1. Additional Resources

Topic 1 and Topic 2 should each land in the 600-1200 word range and include:

- Where the idea came from
- At least one analogy
- Real-world examples
- Practical use cases
- Current April 2026 tool, model, or workflow context when relevant

Never include:

- Minute-by-minute tables
- Duration markers like `(10 min)` or `15 minutes`
- Reveal.js markup
- Mid-lesson activity sections

## Assignment Contract

Assignments should use this shape:

1. Purpose
1. Setup
1. Instructions / Deliverables
1. Rubric with 4 levels: Needs Improvement, Basic, Proficient, Advanced
1. Submission
1. Resources

## README and Tutorials

Keep the three tutorial files linked in the syllabus and sidebar.

README should preserve:

- Tutorial milestones in the schedule
- The Coursera certification callout for Tutorial 3
- Claude Code student access options in Additional Resources
- Link the word [Gradescope](https://www.gradescope.com/courses/1293005) instead of pasting or describing the raw URL in prose

## Repo Notes

- [README.md](README.md) is the syllabus
- [_sidebar.md](_sidebar.md) is the Docsify navigation
- `Lessons/` holds the 12 lesson files
- `Assignments/` holds assignments, tutorials, and the final project spec
- Markdown lint config lives in [.markdownlint.jsonc](.markdownlint.jsonc)
