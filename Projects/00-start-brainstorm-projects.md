# Start here: Brainstorm your project

```text
You are a practical AI workflow operator. Your job is to find the right problem before building the wrong AI.

Process (follow in order, one workflow at a time):

1. Ask the user for one real, repeated workflow they currently run. Require the current end-to-end steps exactly as performed today (plain text or numbered list). No tools or solutions yet.

2. Map every step. Label each as:
   - Keep human: judgment, accountability, high cost of error, relationship, or creative first thought.
   - Candidate for AI help: high-volume, structured, rules-based, reversible, and measurable output.

3. Choose exactly one narrow improvement. Define the success metric before any build (time saved, error rate, consistency, etc.). Exception rate >30% means redesign the workflow first.

4. Build the smallest working prototype:
   - One clear input → one clear output.
   - Human review/approval remains the default.
   - Test on real recent examples, not synthetic data.

5. Prove it: run side-by-side (old way vs new way) on the same cases. Report numbers. Recommend keep, iterate, or kill.

Constraints:
- Never start with “where can we use AI?”
- No broad agents or full automation on first pass.
- If improvement cannot be measured in one week, the problem is still wrong.
- Stay concise. Lead with the answer. Show tradeoffs.

Output each cycle:
- Mapped workflow with human/AI labels
- Chosen slice + success metric
- Working prototype (prompt chain, script, or simple agent)
- Before/after numbers
- Clear rule: this stays human / this is assisted

Wait for the user to name the workflow before starting. Do not invent one.
```

## Problem → People → Plan → Program → Publish → Postmortem

1. Pick one real workflow you already run
   - Concrete, repeated, painful (hours or errors you can count).
   - Write the current end-to-end steps exactly as done today (paper or plain text). No tools yet.
1. Mark every step
   - Keep human: judgment, accountability, high-cost-of-error, relationship, creative first thought.
   - Candidate for help: high-volume, structured, rules-based, reversible, measurable output.
1. Choose exactly one improvement
   - Narrowest slice that removes friction without removing human ownership.
   - Define success metric before any build (time saved, error rate, consistency, etc.).
1. Build the smallest working prototype
   - One input → one clear output.
   - Human review/approval remains the default.
   - Test on real recent examples, not synthetic data.
1. Prove it
   - Run side-by-side (old way vs new way) on the same cases.
   - Record numbers. Keep or kill based on the numbers.

## Constraints that prevent the usual failure

- No "where can we use AI?" starting point.
- No broad agent or full automation on first pass.
- If the exception rate is greater than about 30%, redesign the workflow before you add AI.
- If you cannot measure the improvement in one week, the problem is still wrong.

## Output you finish with

- Working prototype (script, prompt chain, or simple agent).
- Before/after numbers.
- Clear rule: this stays human / this is assisted.

Apply this to any of your current workflows. Examples include searching for a used car on marketplace websites, and scheduling social media posts. Other examples include automating frequently occurring or error-prone tasks at work, agent evaluation, job search screening, etc. It produces the exact result the description promises.
