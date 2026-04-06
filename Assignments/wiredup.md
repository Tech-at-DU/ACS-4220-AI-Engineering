# :electric_plug: Wiredup

_Connect your dev tools to the outside world — live docs, browsers, databases, and anything else you can think of!_

## Purpose (Why Should I Do This?)

Context is everything. Your tools can't help if they're working with stale or incorrect information. This project teaches you to integrate live data sources—up-to-date documentation, real browser interactions, actual database queries—so your AI partners make better decisions. You'll measure the difference yourself: hallucinations vs. reality.

### Table of Contents

1. [Purpose (Why Should I Do This?)](#purpose-why-should-i-do-this)
1. [Setup](#setup)
1. [Instructions](#instructions)
1. [Rubric](#rubric)
1. [Submission](#submission)
1. [Resources](#resources)

## Setup

### Project Structure

```bash
wiredup/
├── README.md
├── CLAUDE.md
├── .mcp.json              (or equivalent config)
├── evidence/
│   ├── live-docs-usage.md
│   └── hallucination-comparison.md
├── src/
│   └── (your application code)
└── tests/
    └── (your tests)
```

1. Visit [github.com/new](https://github.com/new) and create a new repository named `wiredup`.
1. Set up your project and configure at least **2 protocol servers**:

    ```bash
    $ mkdir wiredup && cd wiredup
    $ git init
    $ git remote add origin git@github.com:YOUR_GITHUB_USERNAME/wiredup.git
    ```

1. **Required**: Set up Context7 for live library docs.
1. **Pick one more**: Chrome for visual verification, a database connector, or something custom you design.

## Instructions

Complete each task in the order they appear. Use [GitHub Task List](https://help.github.com/en/github/managing-your-work-on-github/about-task-lists) syntax to track your progress.

### V1.0 — Configuration & Live Docs

- [ ] Configure at least **2 protocol servers** (`.mcp.json` or CLI).
- [ ] Build a feature that needs a third-party library API.
- [ ] Capture evidence of your tools querying live docs while you build (screenshots, logs, transcripts).
- [ ] Save this evidence in `evidence/live-docs-usage.md`.
- [ ] **Add, commit, and push to GitHub**.

### V1.1 — Second Integration

- [ ] Use your second protocol server in real development — screenshots, database queries, custom tool calls.
- [ ] Document what it did and how it changed your workflow.
- [ ] **Add, commit, and push to GitHub**.

### V1.2 — Hallucination Comparison & Polish

- [ ] Compare agent output _with_ vs. _without_ live docs for the same API call.
- [ ] Document the comparison in `evidence/hallucination-comparison.md`, side-by-side.
- [ ] Complete the feature using test-first workflow. Include design docs for any architecture choices.
- [ ] Write a brief summary in your README: which servers you used, how they changed your workflow, what's next.
- [ ] **Add, commit, and push to GitHub**.

### Stretch Challenges

- [ ] Configure and use a **third** protocol server.
- [ ] Design and build a **custom tool** that solves a problem specific to your project.
- [ ] Complete a Level 4 architectural task with thorough design exploration.

## Rubric

| | **Needs Improvement** | **Basic** | **Proficient** | **Advanced** |
|:--|:--|:--|:--|:--|
| **Protocol Configuration** | Incomplete or missing server setup | 2 servers configured; basic functionality | 2+ servers properly configured and integrated; clear `.mcp.json` | 3+ servers; custom tools built; advanced configuration |
| **Live Documentation** | No evidence of live docs usage | Docs used occasionally; limited impact captured | Evidence of live doc queries reducing hallucinations; clear before/after in writeup | Quantified improvement; demonstrates mastery of live context |
| **Integration Quality** | Minimal real-world use | Servers used in 1-2 tasks; some friction evident | Servers integrated seamlessly into workflow; clear impact on development | Sophisticated integration; evidence of workflow optimization |
| **Evidence & Documentation** | Missing or unclear evidence | Basic evidence in files; minimal comparison | Clear, well-organized evidence; side-by-side hallucination comparison | Compelling narrative showing tangible impact on code quality |
| **Feature Implementation** | Incomplete or broken tests | Feature works; some test issues | All tests pass; feature well-designed; uses protocol servers meaningfully | Sophisticated design; advanced use of multiple integrations |

## Submission

Submit your GitHub repo link via [Gradescope](https://www.gradescope.com/courses/1293005).

## Resources

### Lesson Plans

- [**Day 09**: Give It Eyes and Ears](../Lessons/give-it-eyes-and-ears.md): Connecting your dev tools to live documentation, browsers, and external services.
- [**Day 10**: What Do You Even Do All Day?](../Lessons/what-do-you-even-do-all-day.md): How the developer's daily routine changes with more capable tools.

### Reference

- [Model Context Protocol Specification](https://modelcontextprotocol.io): The protocol your tools use to talk to external services.
- [Context7](https://github.com/upstash/context7): Live library documentation server.
