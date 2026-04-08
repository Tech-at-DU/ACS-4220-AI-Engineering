# Lab: Agent Web Reading Comprehension

**Why this matters:** Silent failures are the worst kind. The page appears to load. The agent sounds confident. The output looks polished. Meanwhile, a large chunk of the page may have been truncated, never rendered, or never fetched in the first place. If you are building agents that rely on docs, research, or live web data, you need to know exactly where the pipeline fails and how to prove it.

## Table of Contents

1. [Table of Contents](#table-of-contents)
1. [Overview](#overview)
1. [Vocabulary / Jargon](#vocabulary--jargon)
1. [Learning Objectives](#learning-objectives)
1. [Prerequisites](#prerequisites)
1. [Part 1: Baseline Run (30 min)](#part-1-baseline-run-30-min)
   1. [Instructions](#instructions)
   1. [What You’re Measuring](#what-youre-measuring)
   1. [Record Your Results](#record-your-results)
1. [Part 2: Failure Analysis (20 min)](#part-2-failure-analysis-20-min)
   1. [Failure Classification](#failure-classification)
   1. [Analysis Questions](#analysis-questions)
1. [Part 3: Workaround Engineering (25 min)](#part-3-workaround-engineering-25-min)
   1. [Workaround 1: Content Negotiation Headers](#workaround-1-content-negotiation-headers)
   1. [Workaround 2: Direct JS File Fetching](#workaround-2-direct-js-file-fetching)
   1. [Workaround 3: Measuring Truncation](#workaround-3-measuring-truncation)
   1. [Re-Score](#re-score)
1. [Part 4: Final Answers (15 min)](#part-4-final-answers-15-min)
   1. [Question List](#question-list)
1. [Stretch Goals](#stretch-goals)
1. [Submission](#submission)
1. [Resources](#resources)

---

## Overview

A lot of people talk about web-browsing agents like they “read the internet.”

They do not.

They fetch pages. They flatten markup. They drop scripts. They hit [token](#term-token) budgets. They skip content, [truncate](#term-truncation) content, and then answer in a tone that suggests none of that happened.

That is the problem this lab is built to expose.

You will run an open-source benchmark that hides [canary markers](#term-canary-marker) across 10 documentation pages. A **canary marker** is a deliberately planted, unique string hidden in a page to test whether an agent actually reached that section. It is basically a tracer for the retrieval pipeline. If the agent finds the marker, that content probably made it through. If it misses it, something got dropped, truncated, or skipped.

## Vocabulary / Jargon

Use this section as your shared language for the lab.

- <a id="term-agent"></a> **Agent**: A model or system that can take actions, such as visiting URLs, reading pages, and answering questions.

- <a id="term-web-fetcher"></a> **Web fetcher**: The part of the system that requests a page from a server.

- <a id="term-http"></a> **HTTP**: The protocol browsers and tools use to request and receive web content.

- <a id="term-status-code"></a> **Status code**: The numeric result of an HTTP request, such as `200` for success or `404` for not found.

- <a id="term-header"></a> **Header**: Metadata sent with a request or response, such as content type or accepted formats.

- <a id="term-content-negotiation"></a> **Content negotiation**: A server returning different versions of a page depending on request [headers](#term-header) like `Accept`.

- <a id="term-html"></a> **HTML**: The markup that structures a web page.

- <a id="term-html-to-text-conversion"></a> **HTML-to-text conversion**: The process of stripping or flattening [HTML](#term-html) into plain text for a model to read.

- <a id="term-parsing"></a> **Parsing**: Turning raw page content into a structure the system can process.

- <a id="term-serialization"></a> **Serialization**: Converting structured content into a text form that gets sent into the model context.

- <a id="term-context-window"></a> **Context window**: The maximum amount of text or tokens a model can consider at once.

- <a id="term-token"></a> **Token**: A chunk of text used internally by language models. Context limits are usually measured in tokens.

- <a id="term-truncation"></a> **Truncation**: Content being cut off because of size limits before the relevant section is reached.

- <a id="term-spa"></a> **SPA (single-page app)**: A site where JavaScript renders the actual content after the page shell loads.

- <a id="term-js-bundle"></a> **JS bundle**: A JavaScript file that may contain the real content or the instructions for rendering it.

- <a id="term-static-html"></a> **Static HTML**: The raw [HTML](#term-html) returned before client-side JavaScript runs.

- <a id="term-boilerplate"></a> **Boilerplate**: Repetitive or low-value page content such as giant CSS blocks, nav chrome, or template markup.

- <a id="term-soft-404"></a> **Soft 404**: A page that returns `200 OK` but is actually an error page saying the content does not exist.

- <a id="term-redirect"></a> **Redirect**: A server response telling the client to load a different URL instead.

- <a id="term-cross-host-redirect"></a> **Cross-host redirect**: A [redirect](#term-redirect) that sends the client to a different domain.

- <a id="term-canary-marker"></a> **Canary marker**: A unique hidden string placed at a known location to test whether the agent really read that part of the page.

- <a id="term-hallucination"></a> **Hallucination**: When an agent states something specific as if it were grounded in source material, but it was invented or inferred incorrectly.

- <a id="term-ground-truth"></a> **Ground truth**: The verified correct answer used to score results.

- <a id="term-reading-fidelity"></a> **Reading fidelity**: How accurately the agent received and preserved the actual source content.

- <a id="term-chrome-heavy-page"></a> **Chrome-heavy page**: A page where navigation, menus, sidebars, or page furniture take up much of the available content budget.

## Learning Objectives

By the end of this lab, you will be able to:

1. Identify where web content gets lost in an agent pipeline: fetching, [parsing](#term-parsing), [serialization](#term-serialization), or [context window](#term-context-window) limits
2. Measure [reading fidelity](#term-reading-fidelity) using [canary marker](#term-canary-marker) injection
3. Distinguish between content the agent never received and content it received but misread
4. Apply at least two concrete workarounds to recover missing content
5. Evaluate tradeoffs between different web-fetching strategies for real agent systems

## Prerequisites

- An AI [agent](#term-agent) with web browsing capability, such as ChatGPT, Claude, Gemini, or a custom agent
- Basic understanding of [HTTP](#term-http), including [status codes](#term-status-code), [headers](#term-header), and content types
- Familiarity with [HTML](#term-html), JavaScript, and how [single-page apps](#term-spa) render content
- Optional: `curl` or a similar CLI HTTP client for the extension exercises

---

## Part 1: Baseline Run (30 min)

Start with the agent’s default behavior.

No coaching. No rescue mission. No clever fixes. Let the system show you what it does when left alone.

### Instructions

1. Send your [agent](#term-agent) to `https://agentreadingtest.com/start/`
2. Tell it: *“Go to this URL and follow the instructions.”*
3. Let it work through all 10 tasks without intervention
4. When it finishes, have it visit `https://agentreadingtest.com/results/` and follow the final instructions
5. Paste the agent’s [canary marker](#term-canary-marker) list into the scoring form at `https://agentreadingtest.com/score/`
6. Record your baseline score out of 20

> ⚠️ **Important:** Do not help the agent during the baseline run. If it skips a page, misreads content, or [hallucinates](#term-hallucination) an answer, let it happen. That is the point. You are trying to measure the system you actually have, not the system you wish you had.

### What You’re Measuring

The benchmark hides 23 [canary markers](#term-canary-marker) across 10 pages. Each one is a unique test string placed at a known location so you can verify whether the agent actually reached that part of the page. Sixteen markers count toward the score. The others are there to help you diagnose failures.

| # | Page | Failure Mode | What Breaks |
|---:|---|---|---|
| 1 | API Reference | [Truncation](#term-truncation) | The page is about 130K characters. Can the agent reach the Schema Registry section buried roughly 75K characters in? |
| 2 | Connection Pooling | [Boilerplate](#term-boilerplate) burial | Real content starts after about 80K of inline CSS. Does the [web fetcher](#term-web-fetcher) waste its budget on styling? |
| 3 | Real-Time Analytics | [SPA](#term-spa) shell | The real content is rendered by JavaScript. [Static HTML](#term-static-html) is mostly just a loading spinner. |
| 4 | Multi-Language SDK | Tabbed content | Eight language tabs are serialized into one page. Can the agent reach Ruby in tab 4 and Swift in tab 8? |
| 5 | Authentication Config | [Soft 404](#term-soft-404) | The server returns [HTTP](#term-http) `200`, but the body says “page not found.” Does the agent notice? |
| 6 | Event Filtering | Broken code fence | A malformed markdown code fence corrupts downstream [parsing](#term-parsing). |
| 7 | Webhook Config | [Content negotiation](#term-content-negotiation) | The server returns different content based on the `Accept` [header](#term-header). The markdown version contains a different marker. |
| 8 | Migration Guide | [Cross-host redirect](#term-cross-host-redirect) | The page issues a `301` [redirect](#term-redirect) to another domain. Does the fetcher follow it? |
| 9 | Container Deployment | Ambiguous headers | Three platform sections all use the same “Step 1/2/3” headings. Can the agent find the AWS section specifically? |
| 10 | Event Streams API | [Chrome-heavy page](#term-chrome-heavy-page) | The first half of the page is navigation and chrome. The actual content starts much later. |

### Record Your Results

| Metric | Your Result |
|---|---|
| Canary marker score (of 16) |  |
| Qualitative points (of 4) |  |
| Total score (of 20) |  |
| Tasks where the agent hallucinated |  |
| Tasks where the agent correctly identified a problem |  |

---

## Part 2: Failure Analysis (20 min)

Now look at the misses and figure out **why** they happened.

Do not stop at “the agent got it wrong.” That is not a diagnosis. Your job here is to locate the failure in the pipeline.

### Failure Classification

Every miss should fall into one of these four buckets:

| Category | Description | Example |
|---|---|---|
| Never fetched | The [HTTP](#term-http) request failed, was blocked, or the [redirect](#term-redirect) was not followed | [Cross-host redirect](#term-cross-host-redirect) not followed in Task 8 |
| Fetched but truncated | The content was retrieved, but the tool hit a character or [token](#term-token) limit before the relevant section | Schema Registry section cut off in Task 1 |
| Fetched but not rendered | [HTML](#term-html) was retrieved, but JavaScript-dependent content never executed | [SPA](#term-spa) loading spinner instead of real content in Task 3 |
| Delivered but misread | The content made it to the agent, but the agent [hallucinated](#term-hallucination), skimmed poorly, or extracted the wrong detail | Treating a [soft 404](#term-soft-404) as real docs in Task 5 |

### Analysis Questions

1. Which failure category cost your agent the most points? [Answer in Part 4](#question-1)
2. Did your agent ever answer confidently using content it probably never received? How can you tell? [Answer in Part 4](#question-2)
3. In Task 5, did your agent invent authentication options, or did it correctly recognize the page as an error? What does that tell you about how it handles uncertainty? [Answer in Part 4](#question-3)
4. In Task 1, did your agent reach the Schema Registry section? If yes, how deep into the page was it? If not, what was the last section it appears to have read correctly? [Answer in Part 4](#question-4)
5. Compare the agent’s summaries against the [ground truth](#term-ground-truth) on the scoring page. Where did it sound plausible while still getting concrete details wrong? [Answer in Part 4](#question-5)

> **On hallucination detection:** The scoring page puts it bluntly: *“Agents are unreliable self-reporters. They consistently claimed correct results they hadn’t actually found, pattern-matched vague recollections against expected answers, and hallucinated specific values.”*
>
> Take that seriously. In this section, be skeptical. Look for concrete evidence: exact parameter names, real numeric values, specific class names, or precise strings. Vague confidence does not count.

---

## Part 3: Workaround Engineering (25 min)

Now improve the score.

Your job in this section is not to magically make the agent smarter. It is to change the retrieval path so the agent actually gets better input.

### Workaround 1: Content Negotiation Headers

Some documentation servers return different representations depending on the `Accept` [header](#term-header). In Task 7, the [content-negotiation](#term-content-negotiation) page serves markdown when the client explicitly asks for it.

**Try this:**

```bash
# Default fetch (HTML version)
curl -s https://agentreadingtest.com/tasks/content-negotiation/ | grep CANARY

# Markdown version
curl -s -H "Accept: text/markdown" https://agentreadingtest.com/tasks/content-negotiation/ | grep CANARY
```

**Question:** Did the markdown version contain a different [canary marker](#term-canary-marker)? If so, what does that suggest about how agent pipelines should fetch documentation pages in the real world? [Answer in Part 4](#question-6)

### Workaround 2: Direct JS File Fetching

When a page is really just an [SPA](#term-spa) shell, the useful content may live inside [JS bundles](#term-js-bundle) rather than the initial [static HTML](#term-static-html). You can often recover that content without spinning up a headless browser.

**Try this:**

1. Fetch the raw [HTML](#term-html) for the SPA page: `curl -s https://agentreadingtest.com/tasks/spa-shell/`
2. Find the `<script src="...">` tag
3. Fetch the JavaScript file directly: `curl -s https://agentreadingtest.com/tasks/spa-shell/app.js`
4. Inspect the JS source for the missing content

```bash
# Step 1: Find the script tag
curl -s https://agentreadingtest.com/tasks/spa-shell/ | grep "<script"

# Step 2: Fetch the JS bundle
curl -s https://agentreadingtest.com/tasks/spa-shell/app.js | head -60
```

**Question:** Did the JS file contain both the missing [canary marker](#term-canary-marker) and the aggregation types the agent missed? In what kinds of production systems would this workaround stop working? [Answer in Part 4](#question-7)

### Workaround 3: Measuring Truncation

Task 1 is useful because it lets you measure [truncation](#term-truncation) directly instead of guessing about it. If the full page is around 130K characters and your fetcher cuts off earlier, you can locate exactly where the canaries sit.

**Try this:**

```bash
# Measure full page size
curl -s https://agentreadingtest.com/tasks/truncation/ | wc -c

# Find where each canary marker sits
curl -s https://agentreadingtest.com/tasks/truncation/ | grep -b "CANARY"
```

**Question:** At what byte offset does each [truncation](#term-truncation) marker appear? How does that compare with your agent’s fetch limit, parser behavior, or effective [context window](#term-context-window)? [Answer in Part 4](#question-8)

### Re-Score

After applying your workarounds, compile the updated [canary marker](#term-canary-marker) list and score the run again.

| Metric | Baseline | After Workarounds | Delta |
|---|---:|---:|---:|
| Canary marker score (of 16) |  |  |  |
| Qualitative score (of 4) |  |  |  |
| Total score (of 20) |  |  |  |

---

## Part 4: Final Answers (15 min)

Write clear, direct answers to every question below. Answer them in order.

### Question List

<a id="question-1"></a>
#### Q1. Which failure category cost your agent the most points?

Answer:

<a id="question-2"></a>
#### Q2. Did your agent ever answer confidently using content it probably never received? How can you tell?

Answer:

<a id="question-3"></a>
#### Q3. In Task 5, did your agent invent authentication options, or did it correctly recognize the page as an error? What does that tell you about how it handles uncertainty?

Answer:

<a id="question-4"></a>
#### Q4. In Task 1, did your agent reach the Schema Registry section? If yes, how deep into the page was it? If not, what was the last section it appears to have read correctly?

Answer:

<a id="question-5"></a>
#### Q5. Compare the agent’s summaries against the ground truth on the scoring page. Where did it sound plausible while still getting concrete details wrong?

Answer:

<a id="question-6"></a>
#### Q6. Did the markdown version contain a different canary marker? If so, what does that suggest about how agent pipelines should fetch documentation pages in the real world?

Answer:

<a id="question-7"></a>
#### Q7. Did the JS file contain both the missing canary marker and the aggregation types the agent missed? In what kinds of production systems would this workaround stop working?

Answer:

<a id="question-8"></a>
#### Q8. At what byte offset does each truncation marker appear? How does that compare with your agent’s fetch limit, parser behavior, or effective context window?

Answer:

---

## Stretch Goals

If you finish early or want to push further:

- **Cross-agent comparison:** Run the benchmark with two different [agents](#term-agent), such as ChatGPT, Claude, Gemini, or a custom LangChain-based setup. Compare where they fail. Do they break on the same pages for the same reasons?
- **Build your own canary system:** Design a [canary marker](#term-canary-marker) benchmark for your own documentation. How would you place markers at known offsets and score [reading fidelity](#term-reading-fidelity) automatically?
- **Headless browser fallback:** Add Playwright or Puppeteer as a fallback fetcher. Measure the tradeoff between latency, cost, and improved reading fidelity.
- **Read the spec:** The Agent Reading Test pairs nicely with the [Agent-Friendly Documentation Spec](https://agentdocsspec.com). Read the spec and evaluate a real documentation site against it.

---

## Submission

Turn in the following on Slack #acs-4220:

- Your answers to every question posed in the lab

## Resources

- Agent Reading Test: `https://agentreadingtest.com/start/`
- Scoring Page: `https://agentreadingtest.com/score/`
- Agent-Friendly Documentation Spec: `https://agentdocsspec.com`
- Source Code: `https://github.com/agent-ecosystem/agent-reading-test`
