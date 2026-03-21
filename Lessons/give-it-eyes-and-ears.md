<!-- .slide: data-background="./Images/header.svg" data-background-repeat="none" data-background-size="40% 40%" data-background-position="center 10%" class="header" -->
# Give It Eyes and Ears

<!-- > -->

## Minute-by-Minute

| **Elapsed** | **Time** | **Activity** |
|:-----------:|:--------:|:-------------|
| 0:00 | 0:05 | Objectives |
| 0:05 | 0:25 | Overview: MCP Architecture |
| 0:30 | 0:35 | Activity 1: Connect external context tools |
| 1:05 | 0:10 | BREAK |
| 1:15 | 0:20 | Browser Automation with Chrome MCP |
| 1:35 | 0:30 | Activity 2: Visual Verification Pipeline |
| 2:05 | 0:20 | Activity 3: Build a Custom MCP Tool |
| 2:25 | 0:05 | Wrap Up |
| TOTAL | 2:30 | - |

<!-- > -->

## Learning Objectives (5 min)

By the end of this lesson, you will be able to:

1. Understand how to connect external systems to your agent — APIs, live databases, browsers — so it works with real data, not hallucinations
1. Plug in live documentation sources and watch the agent stop guessing API signatures — getting current, accurate info on demand
1. Give your agent the ability to see and interact with web pages — taking screenshots, clicking buttons, validating output visually
1. Wire up the tools your team actually uses — Jira, Figma, GitHub, your internal tools — so the agent operates in your ecosystem, not isolated in code

<!-- > -->

## Best Practices

Here's what works:

- **Start with MCP for live docs**: Use external context tools or similar to feed real API docs to the agent. No more hallucinated API calls when it can just read the actual docs.
- **MCP is now standard**: It hit the Linux Foundation in 2025—OpenAI, Anthropic, and IDEs all support it. Learn it like you'd learn Git.
- **Compare before and after**: Run the same build without MCP, then with it. The difference is stark (hallucinations gone, correct APIs). That proof matters when you're convincing people to set this up.
- **Visual verification is powerful**: Take screenshots between iterations. The agent can see what it built and fix styling or layout without you repeating yourself.
- **Layer the servers**: external context tools for docs, Chrome MCP for visual checks, custom tools for your internal systems. That's a full development ecosystem.

<!-- > -->

# Topic 1: MCP Architecture

<!-- v -->

## Overview/TT I (25 min)

- **Model Context Protocol: a standard for connecting AI agents to external tools and data**
- **Architecture: Host (Claude Code) → Client → Server → Tools/Resources**
- **external context tools: live documentation lookup — no more hallucinated API references**
- **Why MCP matters: agents can now read live docs, query databases, control browsers, and more**
- **Configuration: `claude mcp add` and the `.mcp.json` file**

<!-- v -->

## Activity 1: Connect external context tools & Build with Live Docs (35 min)

**Breakout Rooms (teams of 3)**

1. Install and configure the external context tools MCP server
2. Build a small feature using a library you haven't used before (e.g., Hono, Drizzle ORM, or Effect-TS)
3. Run the same build twice: once without external context tools, once with it
4. Compare: did the agent hallucinate APIs without external context tools? Did it use correct, current APIs with it?

**Deliverable**: Side-by-side comparison showing hallucinated vs. correct API usage.

<!-- > -->

<!-- .slide: data-background="#087CB8" -->
## [**10m**] BREAK

<!-- > -->

# Topic 2: Browser Automation & Chrome MCP

<!-- v -->

## Overview/TT II (20 min)

- **Chrome MCP connector: giving agents the ability to see and interact with web pages**
- **Use cases: visual verification, form testing, screenshot-based debugging**
- **The verification loop: build → deploy locally → screenshot → verify → iterate**
- **Combining tool integration servers: external context tools for docs + Chrome for verification**

<!-- v -->

## Activity 2: Visual Verification Pipeline (30 min)

**Breakout Rooms (teams of 3)**

Build a simple web page (landing page or dashboard) using Claude Code with both tool integration servers active:

1. Use external context tools for correct Tailwind CSS / framework documentation
2. Use Chrome MCP to take screenshots after each iteration
3. Have the agent evaluate its own output visually and make corrections

**Deliverable**: Before/after screenshots showing agent self-correction via visual feedback.

<!-- v -->

## Activity 3: Sketch a Custom MCP Tool (20 min)

**Breakout Rooms (teams of 3)**

Design (don't build) a custom MCP server for your team's workflow. Ideas: a Jira MCP that pulls ticket details, a Figma MCP that reads design specs, a database MCP that lets agents query staging data.

Write the tool specification: name, description, input schema, output format, and 3 example invocations.

**Deliverable**: MCP tool specification document.

<!-- > -->

## Wrap Up (5 min)

- MCP turns agents from code-only tools into full-stack development partners
- **Assignment 2 due next class (Wed, Apr 22)**
- Read: agent-driven SDLC transformation resources

<!-- > -->

## Additional Resources

1. [Model Context Protocol Specification](https://modelcontextprotocol.io)
1. [external context tools MCP Server](https://github.com/upstash/external context tools)
