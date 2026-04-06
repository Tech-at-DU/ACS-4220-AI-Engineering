# :test_tube: Tutorial 1: The Prompt Lab

_Work through Anthropic's interactive prompt engineering tutorial — then prove you can apply what you learned._

## Purpose (Why Should I Do This?)

Every interaction with an AI tool starts with a prompt. The difference between "kind of works" and "nails it every time" comes down to how well you structure your instructions. This tutorial gives you a sandbox to experiment with techniques like system prompts, output formatting, role assignment, and chain-of-thought reasoning — all skills you'll use in every assignment after this.

### Table of Contents

1. [Purpose (Why Should I Do This?)](#purpose-why-should-i-do-this)
1. [Getting Started](#getting-started)
1. [Instructions](#instructions)
1. [Cross-Tool Takeaway](#cross-tool-takeaway)
1. [Rubric](#rubric)
1. [Submission](#submission)
1. [Resources](#resources)

## Getting Started

You'll complete **Anthropic's Prompt Engineering Interactive Tutorial** — a hands-on experience where you write prompts, see Claude's responses in real time, and iterate until you understand what works and why.

This isn't a passive reading exercise. Each chapter has an **Example Playground** where you modify prompts and immediately see results. You're expected to experiment, break things, and figure out the patterns.

**External Tutorial:** [Anthropic Prompt Engineering Interactive Tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial)

**Alternative (zero setup):** [Google Sheets Version](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — recommended if you want to start experimenting immediately without installing anything.

### Enrollment Steps

**Choose your path:**

**Path A — Google Sheets (Recommended for speed)**
1. Open the [Google Sheets tutorial](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview).
1. Follow the instructions in each tab to run prompts directly in the sheet.
1. No API key required for the interactive examples.

**Path B — Jupyter Notebooks (Recommended for depth)**
1. Clone the repository:

    ```bash
    $ git clone https://github.com/anthropics/prompt-eng-interactive-tutorial.git
    $ cd prompt-eng-interactive-tutorial
    ```

1. Install dependencies:

    ```bash
    $ pip install -r requirements.txt
    ```

1. Set your API key:

    ```bash
    $ export ANTHROPIC_API_KEY=your_key_here
    ```

1. Launch the notebooks:

    ```bash
    $ jupyter notebook
    ```

## Instructions

Complete each task in the order they appear. Use [GitHub Task List](https://help.github.com/en/github/managing-your-work-on-github/about-task-lists) syntax to track your progress.

### Part 1 — Complete the Tutorial

- [ ] Work through **all 9 chapters** of the tutorial.
- [ ] For each chapter, experiment with at least **2 variations** beyond the provided examples in the playground.
- [ ] Take screenshots or copy your best prompt/response pair from each chapter.

### Part 2 — Apply What You Learned

- [ ] Create a new file called `prompt-lab-journal.md` in a small standalone repo called `prompt-lab`.
- [ ] For **3 chapters** of your choice, write a short entry (3-5 sentences) explaining:
  - What the technique does.
  - A real scenario where you'd use it in your own work.
  - The best prompt you wrote and why it worked.
- [ ] Write **one prompt** that combines at least 3 techniques from different chapters. Include the prompt text, Claude's response, and a brief explanation of which techniques you combined.
- [ ] **Add, commit, and push to GitHub**.

### Stretch Challenges

- [ ] Complete the tutorial using **both paths** (Sheets and Notebooks) and note the differences in your journal.
- [ ] Create a `CLAUDE.md` prompt template that incorporates techniques from at least 4 chapters — one you'd actually use in a real project.
- [ ] Find a prompt pattern the tutorial doesn't cover. Document it in your journal with an example.

## Cross-Tool Takeaway

The tutorial is Claude-centered, but the engineering takeaway transfers cleanly. A good agent prompt or task brief defines the goal, the structure of the output, the evidence you expect back, and the edge cases that matter. Claude uses one surface for that. Codex uses another. The core move is the same: write instructions that reduce guessing and give you something concrete to verify.

## Rubric

| | **Needs Improvement** | **Basic** | **Proficient** | **Advanced** |
|:--|:--|:--|:--|:--|
| **Tutorial Completion** | Fewer than 5 chapters completed | All 9 chapters completed; minimal experimentation | All chapters completed with evidence of experimentation beyond examples | Deep exploration; discovered edge cases or limitations |
| **Journal Quality** | Missing or surface-level entries | 3 entries present but lack specificity | Entries show clear understanding; real scenarios are concrete and relevant | Entries demonstrate insight; identifies non-obvious applications |
| **Combined Prompt** | Missing or uses fewer than 3 techniques | Combines 3 techniques but execution is rough | Clean combination of 3+ techniques with clear explanation | Sophisticated prompt that demonstrates mastery; would work in production |
| **Commit Quality** | Missing commits or disorganized | Single commit with everything | Logical commits showing progression through the tutorial | Commit messages tell the story of your learning |

## Submission

Add `prompt-lab-journal.md` to your `prompt-lab` repo and submit the GitHub link via [Gradescope](https://www.gradescope.com/courses/1293005).

## Resources

### Lesson Plans

- [**Day 01**: Copilot ≠ Coworker](../Lessons/copilot-neq-coworker.md): How AI dev tools differ from autocomplete.
- [**Day 02**: Memory Is Everything](../Lessons/memory-is-everything.md): How context shapes every response.

### External

- [Anthropic Prompt Engineering Docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview): The full reference behind the tutorial.
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook): More advanced patterns and recipes.
