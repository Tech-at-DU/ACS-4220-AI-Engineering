# Lab: Agent Web Reading Comprehension

> **How Well Does Your AI Agent Actually Read the Web?**

|Course        |Duration |Format      |Difficulty  |
|--------------|---------|------------|------------|
|AI Engineering|75–90 min|Hands-on Lab|Intermediate|

-----

## Overview

AI agents don’t browse the web the way humans do. They use HTTP fetchers, HTML-to-text converters, and context windows with hard token limits. Each layer can silently lose content. This lab makes those failure modes visible and measurable.

You’ll run an open-source benchmark that plants hidden markers (canary tokens) across 10 documentation pages, each designed to trigger a different failure mode. Your agent reads the pages, reports what it found, and you score the results against ground truth.

> **Why This Matters:** Production agents that browse the web fail silently. A page looks like it loaded, the agent sounds confident, but 40% of the content was truncated or never rendered. If you’re building agents that consume documentation, research, or real-time data, you need to understand where your pipeline breaks.

## Learning Objectives

By the end of this lab, you will be able to:

1. Identify the specific pipeline stages where web content is lost (fetching, parsing, serialization, context window)
1. Measure agent reading fidelity using canary token injection
1. Distinguish between content the agent never received vs. content it received but hallucinated about
1. Apply at least two workarounds (content negotiation headers, direct JS file fetching) to recover lost content
1. Evaluate tradeoffs between different web fetching strategies for agent pipelines

## Prerequisites

- An AI agent with web browsing capability (Claude, ChatGPT, Gemini, or a custom agent)
- Basic understanding of HTTP (status codes, headers, content types)
- Familiarity with HTML, JavaScript, and how SPAs render content
- Optional: `curl` or a similar CLI HTTP client for the extension exercises

-----

## Part 1: Baseline Run (30 min)

Run the test as-is with your agent. No tricks, no workarounds. This establishes your baseline score.

### Instructions

1. Navigate your agent to `https://agentreadingtest.com/start/`
1. Tell the agent: *“Go to this URL and follow the instructions.”*
1. Let it work through all 10 tasks without intervention. Don’t coach it.
1. When it finishes, have it visit `https://agentreadingtest.com/results/` and follow the final instructions.
1. Paste the agent’s canary token list into the scoring form at `https://agentreadingtest.com/score/`.
1. Record your baseline score (out of 20).

> ⚠️ **Important:** Don’t help the agent during the baseline run. If it skips a page, misreads content, or hallucinates an answer, let it. The point is to see where it fails on its own.

### What You’re Measuring

The test plants 23 canary markers across 10 pages. Each marker is a unique string like `CANARY-TRUNC-10K-fox` embedded at a known position. 16 of the 23 are scored; the rest provide diagnostic signal.

|# |Page                 |Failure Mode       |What Breaks                                                                                        |
|--|---------------------|-------------------|---------------------------------------------------------------------------------------------------|
|1 |API Reference        |Truncation         |Page is ~130K chars. Does the agent read the Schema Registry section buried 75K chars deep?        |
|2 |Connection Pooling   |Boilerplate burial |Real content starts after ~80K of inline CSS. Does the fetcher consume its budget on styling?      |
|3 |Real-Time Analytics  |SPA shell          |Content is rendered by JavaScript. Static HTML is just a loading spinner.                          |
|4 |Multi-Language SDK   |Tabbed content     |8 language tabs serialized into one page. Does the agent reach Ruby (tab 4) and Swift (tab 8)?     |
|5 |Authentication Config|Soft 404           |HTTP 200, but the body says “page not found.” Does the agent notice?                               |
|6 |Event Filtering      |Broken code fence  |A malformed markdown code fence corrupts downstream content parsing.                               |
|7 |Webhook Config       |Content negotiation|Server returns different content based on `Accept` header. Markdown version has a different marker.|
|8 |Migration Guide      |Cross-host redirect|301 redirect to a different domain. Does the fetcher follow it?                                    |
|9 |Container Deployment |Ambiguous headers  |Three platform sections with identical “Step 1/2/3” headers. Can the agent find the AWS section?   |
|10|Event Streams API    |Chrome-heavy page  |First 50% is navigation sidebar. Real content starts halfway through.                              |

### Record Your Results

|Metric                                          |Your Result|
|------------------------------------------------|-----------|
|Canary token score (of 16)                      |           |
|Qualitative points (of 4)                       |           |
|Total score (of 20)                             |           |
|Tasks where agent hallucinated                  |           |
|Tasks where agent correctly identified a problem|           |

-----

## Part 2: Failure Analysis (20 min)

Now that you have a baseline, analyze where and why your agent failed. For each missed marker, determine the root cause.

### Failure Classification

Every miss falls into one of four categories:

|Category                |Description                                                                   |Example                                             |
|------------------------|------------------------------------------------------------------------------|----------------------------------------------------|
|Never fetched           |The HTTP request failed, was blocked, or redirected and not followed.         |Cross-host redirect not followed (Task 8)           |
|Fetched but truncated   |Content was retrieved but exceeded the tool’s token/character limit.          |Schema Registry section cut at 75K chars (Task 1)   |
|Fetched but not rendered|HTML was retrieved but JS-dependent content wasn’t executed.                  |SPA loading spinner instead of real content (Task 3)|
|Delivered but misread   |Content reached the agent but it hallucinated or failed to extract the answer.|Treating a soft 404 as real documentation (Task 5)  |

### Analysis Questions

1. Which failure category caused the most point loss?
1. Did your agent ever confidently answer a question using content it never received? How can you tell?
1. Look at Task 5 (soft 404). Did your agent fabricate authentication options, or did it correctly identify the error page? What does this tell you about the agent’s relationship to its own uncertainty?
1. Look at Task 1 (truncation). Did your agent find the Schema Registry section? If so, how many characters deep was it? If not, what was the last section it successfully read?
1. Compare your agent’s task summaries against the reference answers on the scoring page. Where did the agent sound correct but get specific values wrong?

> **On Hallucination Detection:** The scoring page warns: *“Agents are unreliable self-reporters. They consistently claimed correct results they hadn’t actually found, pattern-matched vague recollections against expected answers, and hallucinated specific values.”*
> 
> **Your job in this section is to be the skeptic.** Look for concrete, verifiable details (exact parameter names, specific numeric values, particular class names) rather than vague confirmations.

-----

## Part 3: Workaround Engineering (25 min)

Now try to improve your score. Apply workarounds to recover content your agent missed on the baseline run.

### Workaround 1: Content Negotiation Headers

Some documentation servers return different content based on the `Accept` header. The content-negotiation test page (Task 7) serves markdown when the client requests it.

**Try this:** Use `curl -H "Accept: text/markdown"` to fetch the webhook configuration page. Compare the response to what your agent’s default fetcher returned.

```bash
# Default fetch (HTML version)
curl -s https://agentreadingtest.com/tasks/content-negotiation/ | grep CANARY

# Markdown version
curl -s -H "Accept: text/markdown" https://agentreadingtest.com/tasks/content-negotiation/ | grep CANARY
```

**Question:** Did the markdown version contain a different canary marker? What does this imply for building agent pipelines that consume documentation sites?

### Workaround 2: Direct JS File Fetching

When a page is an SPA shell (Task 3), the real content lives in JavaScript bundles. You can often extract it without a headless browser.

**Try this:**

1. Fetch the raw HTML of the SPA page: `curl -s https://agentreadingtest.com/tasks/spa-shell/`
1. Find the `<script src="...">` tag in the HTML.
1. Fetch the JS file directly: `curl -s https://agentreadingtest.com/tasks/spa-shell/app.js`
1. Extract the content from the JavaScript source.

```bash
# Step 1: Find the script tag
curl -s https://agentreadingtest.com/tasks/spa-shell/ | grep "<script"

# Step 2: Fetch the JS bundle
curl -s https://agentreadingtest.com/tasks/spa-shell/app.js | head -60
```

**Question:** Did the JS file contain both the missing canary marker and the aggregation types the agent couldn’t find? When would this workaround fail in production?

### Workaround 3: Measuring Truncation

For the truncation test (Task 1), the page is ~130K characters. If your agent’s fetcher truncates at a lower limit, you can measure exactly where content is cut.

**Try this:**

```bash
# Measure full page size
curl -s https://agentreadingtest.com/tasks/truncation/ | wc -c

# Find where each canary marker sits
curl -s https://agentreadingtest.com/tasks/truncation/ | grep -b "CANARY"
```

**Question:** At what byte offset does each truncation marker appear? How does this compare to your agent’s context window or fetcher limit?

### Re-Score

After applying workarounds, compile your updated canary token list and re-score.

|Metric              |Baseline|After Workarounds|Delta|
|--------------------|--------|-----------------|-----|
|Canary score (of 16)|        |                 |     |
|Qualitative (of 4)  |        |                 |     |
|Total (of 20)       |        |                 |     |

-----

## Part 4: Reflection & Writeup (15 min)

Write a short post-lab reflection (300–500 words) addressing these prompts:

1. **Pipeline Anatomy:** Draw or describe the stages your agent’s web reading pipeline goes through, from URL to final response. Where does each failure mode from Part 2 occur in this pipeline?
1. **Silent Failures:** Why are web reading failures particularly dangerous compared to other types of agent failures? What makes them hard to detect from the agent’s output alone?
1. **Design Implications:** If you were building a production agent that needed to reliably consume web documentation, what architectural decisions would you make based on what you learned? Consider: fetcher selection, content negotiation, fallback strategies, and validation.
1. **Hallucination vs. Missing Data:** How do you distinguish between an agent that didn’t receive content and an agent that received content but misinterpreted it? Which is more dangerous in production, and why?

-----

## Stretch Goals

For students who finish early or want to go deeper:

- **Cross-Agent Comparison:** Run the same test on two different agents (e.g., Claude vs. ChatGPT vs. a custom LangChain agent). Compare their failure profiles. Do they fail on the same pages or different ones?
- **Build a Canary System:** Design a canary token injection system for your own documentation. How would you plant markers at known positions and automatically score agent reading fidelity?
- **Headless Browser Integration:** Set up Playwright or Puppeteer as a fallback fetcher for your agent. Measure the latency and cost tradeoff vs. the reading fidelity improvement.
- **Read the Spec:** The Agent Reading Test is a companion to the [Agent-Friendly Documentation Spec](https://agentdocsspec.com). Read the spec and evaluate one real-world documentation site against its recommendations.

-----

## Submission

- Your baseline and improved score screenshots from `agentreadingtest.com/score/`
- The failure analysis table from Part 2
- Your before/after comparison table from Part 3
- Your 300–500 word reflection from Part 4

## Resources

- Agent Reading Test: `https://agentreadingtest.com/start/`
- Scoring Page: `https://agentreadingtest.com/score/`
- Agent-Friendly Documentation Spec: `https://agentdocsspec.com`
- Source Code: `https://github.com/agent-ecosystem/agent-reading-test`

-----

*Tech at Dominican University of California — AI Engineering*