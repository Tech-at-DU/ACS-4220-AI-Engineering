# Give It Eyes and Ears

## Agenda

- [Learning Objectives](#learning-objectives)
- [Best Practices](#best-practices)
- [Model Context Protocol](#model-context-protocol)
  - [Overview: Model Context Protocol](#overview-model-context-protocol)
- [Building and Connecting MCP Servers](#building-and-connecting-mcp-servers)
  - [Overview: Building and Connecting MCP Servers](#overview-building-and-connecting-mcp-servers)
- [Break & Wrap Up](#break-wrap-up)
- [After Class Challenges](#after-class-challenges)
  - [Challenge 1: Connect and Explore](#challenge-1-connect-and-explore)
  - [Challenge 2: Build Your First MCP Server](#challenge-2-build-your-first-mcp-server)
  - [Challenge 3: Hallucination Comparison](#challenge-3-hallucination-comparison)
- [Additional Resources](#additional-resources)

## Learning Objectives

By the end of this lesson, you will be able to:

1. Explain what the Model Context Protocol (MCP) is, why it was created, and what problem it solves.
1. Describe the MCP architecture: hosts, clients, servers, resources, and tools.
1. Build a basic MCP server that exposes a tool Claude Code can call.
1. Connect an existing MCP server to your Claude Code setup and use it in a workflow.

## Best Practices

- **Start by connecting, not building.** There is already a large and growing MCP server ecosystem. Before building your own, check whether a good server already exists. The MCP registry is your first stop.
- **One server, one concern.** A GitHub server. A Slack server. A database server. Don't build a mega-server that does everything.
- **Test servers locally first.** Use `stdio` transport during development. Switch to `SSE` for production deployments.
- **Validate tool inputs.** Your MCP server receives tool calls from an AI agent. The agent might send malformed data. Validate before executing.
- **Document your tools clearly.** The tool descriptions are what the agent reads to decide when and how to call each tool. Vague descriptions produce wrong calls.
- **Scope permissions tightly.** If your MCP server connects to a database, give it read-only access unless writes are explicitly needed.
- **💼 Use Case.** Reach for MCP in `wiredup` when the agent needs live data or tool access instead of stale prompt context.
- **🛠️ Pro Tip.** Codex facts: Claude and Codex both benefit from narrow servers with typed inputs and read-only defaults until writes are clearly justified.

**Builds On:** verification habits from Day 6 and repo/tool discipline from Days 7 and 8.

**Feeds:** `wiredup` and Tutorial 3 architecture choices around MCP and live context.

## Model Context Protocol

### Overview: Model Context Protocol

Students feel this most clearly in `wiredup`, when the agent needs live docs, browser state, or external data instead of stale repo context. MCP matters because it changes what the tool can verify right now.

Until late 2024, every AI tool had its own way of connecting to external services. Want Claude to read your GitHub issues? Write a custom integration. Want it to query your database? Another custom integration. Want it to check your Slack messages? Another one. Every tool, every service, every connection was bespoke.

This is the same problem the web faced in the 1990s. Every browser rendered HTML differently. Every server spoke a slightly different protocol. Then HTTP and HTML became standards, and suddenly any browser could talk to any server. The web exploded.

**MCP is that standardization moment for AI tools.**

The Model Context Protocol was introduced by Anthropic in November 2024 as an open standard for connecting AI systems to external tools and data sources. Instead of building custom integrations for every AI-tool-to-service combination, define a universal protocol that any AI tool can use to talk to any service.

Before MCP, connecting AI tools to services looked like this:

```
Claude Code  →  custom GitHub integration
Claude Code  →  custom Slack integration
ChatGPT      →  different GitHub integration
ChatGPT      →  different Slack integration
```

Every combination required custom code. N tools times M services equals N×M integrations. That doesn't scale.

With MCP:

```
Claude Code  →  MCP  →  GitHub MCP Server
ChatGPT      →  MCP  →  GitHub MCP Server
Any AI Tool  →  MCP  →  Any MCP Server
```

One protocol. N tools plus M servers. Each tool implements the MCP client once. Each service implements the MCP server once. Everything connects.

**Where the idea came from.** MCP's design borrows heavily from the Language Server Protocol (LSP), which solved a similar N×M problem for code editors in 2016. Before LSP, every editor needed a custom plugin for every programming language. VSCode supported Python differently than Vim supported Python. LSP standardized the communication, and suddenly one language server could power every editor. If you've used VSCode's Python support, you've benefited from LSP. MCP does the same thing, but for AI tools instead of code editors.

**The architecture.** MCP has three main components:

1. **Hosts**: AI applications that want to access external data and tools. Claude Code is a host. So is the Claude desktop app.

1. **Servers**: Programs that provide data and tools. A GitHub MCP server exposes tools like "list issues," "create PR," and "read file." A database MCP server exposes "run query" and "list tables." Servers are where the integration logic lives.

1. **The protocol**: JSON-RPC 2.0 messages over a transport layer (stdio for local servers, SSE for remote ones). The host sends a request ("call this tool with these arguments"), the server executes it, and returns the result.

**What servers expose:**

- **Resources**: Read-only data sources. A file system server might expose project files. A database server might expose table schemas. Resources are for reading, not acting.
- **Tools**: Executable functions that perform actions. "Create a GitHub issue," "Send a Slack message," "Run a SQL query." Tools are for doing things.

**The ecosystem today (April 2026).** MCP now has a broad server ecosystem and official documentation for multiple SDKs. The safe teaching point is not the exact count. It is that students should assume useful servers may already exist, then verify against the official registry or SDK docs before they build from scratch.

The governance story matters because MCP is now positioned as shared ecosystem infrastructure rather than a single-vendor curiosity. That makes the protocol more useful as a long-term investment and a better teaching target for students who will use multiple hosts over time.

**Why this matters professionally.** MCP is increasingly important in multi-tool AI workflows because it gives hosts and services a shared integration boundary. Understanding how to build and configure MCP servers means you can extend an AI tool to work with real services in a way that transfers beyond one vendor.

**🏫 What This Looks Like in Class.** `wiredup` turns the protocol conversation into something concrete. Students move from abstract "AI can use tools" language to a real integration contract: what the server exposes, what the host can call, and how they prove it actually works. That assignment is where this lesson becomes muscle memory instead of trivia.

### Claude Code Workflow: Model Context Protocol

Draw the before-and-after picture on the board before you touch code. First show the messy world where every AI tool needs a custom integration for every service. Then redraw the picture with one host implementation and one server implementation connected through MCP. Once students see the N×M problem visually, the protocol stops sounding abstract. After that, connect a real server and ask a concrete question that the model cannot answer from its training data alone, like "list my open issues" or "show the current table schema." The jump in answer quality is the payoff. This live segment should emphasize that protocols are force multipliers. The agent becomes more useful not because the base model got smarter, but because the system acquired reliable access to live, structured context.

### Codex Workflow: Model Context Protocol

This is where students should stop thinking of MCP as "the Claude protocol." OpenAI now ships tooling that can work with MCP as part of the broader ecosystem, which means the same server investment can benefit Codex-style workflows too. That is the real industry story. If your team builds a GitHub server, a docs server, or a deployment-status server, you do not want that work trapped inside one vendor. You want it to become reusable infrastructure. Teach students to think like platform engineers here: the host may change, the models will definitely change, but the clean server boundary is durable. Claude Code is one host. Codex-enabled workflows are another. MCP is the connective tissue that keeps those investments from fragmenting.

## Building and Connecting MCP Servers

### Overview: Building and Connecting MCP Servers

Anchor this to one narrow student workflow that currently requires copy-paste, tab switching, or manual lookups. If a tiny server can remove that friction, the protocol becomes real.

Understanding what MCP is matters less than knowing how to use it. Here's the practical side: connecting existing servers and building your own.

**Connecting an existing MCP server.** The fastest way to extend Claude Code's capabilities:

1. **Find the server.** Check the MCP registry or the [official server list](https://github.com/modelcontextprotocol).

1. **Install it:**

```bash
### Example: installing the GitHub MCP server
$ npm install -g @modelcontextprotocol/server-github
```

1. **Configure Claude Code to use it:**

```json
{
  "mcpServers": {
    "github": {
      "command": "mcp-server-github",
      "args": [],
      "env": {
        "GITHUB_TOKEN": "your-token-here"
      }
    }
  }
}
```

1. **Test it.** Start a Claude Code session. "List my open GitHub issues" should work.

Four steps. The server handles the GitHub API. Claude Code handles the agent logic. MCP connects them.

**Building your own MCP server.** When no existing server does what you need, you build one. The most common reason: internal services that no public server covers.

A minimal MCP server in Python using FastMCP:

```python
from fastmcp import FastMCP

mcp = FastMCP("my-tool-server")

@mcp.tool()
def lookup_user(user_id: str) -> dict:
    """Look up a user by their ID and return their profile information."""
    # Your actual lookup logic here
    return {"id": user_id, "name": "Jane Doe", "role": "engineer"}

@mcp.tool()
def list_active_projects() -> list:
    """List all currently active projects with their status and owners."""
    return [
        {"name": "Project Alpha", "status": "active", "owner": "jane"},
        {"name": "Project Beta", "status": "review", "owner": "bob"}
    ]

if __name__ == "__main__":
    mcp.run()
```

That's a working MCP server. Two tools, each with a clear description and typed parameters. Claude Code can discover these tools, understand what they do, and call them with the right arguments.

**Key decisions when building a server:**

**Transport: stdio vs. SSE.** Stdio is the default for local development. The host launches the server as a subprocess and communicates through stdin/stdout. Fast, no network config, works out of the box. SSE (Server-Sent Events) is for production deployments where the server handles multiple clients or runs remotely. Start with stdio. Move to SSE when you need to scale.

**Tool descriptions are critical.** The agent decides which tool to call based entirely on the description string. "Does stuff with users" produces bad results. "Look up a user by their ID and return their profile including name, email, and role" tells the agent exactly when and how to use the tool.

**Input validation.** Always validate what the agent sends:

```python
@mcp.tool()
def lookup_user(user_id: str) -> dict:
    """Look up a user by their ID."""
    if not user_id or not user_id.isalnum():
        return {"error": "Invalid user ID. Must be alphanumeric."}
    # ... actual lookup
```

**Security scoping.** Your MCP server bridges an AI agent and a real service. Scope permissions carefully. Read-only database connections unless writes are explicitly needed. Minimal API token permissions. Principle of least privilege.

**Real-world MCP patterns:**

| Pattern | Example | Why It Works |
|---|---|---|
| **Documentation lookup** | Server that queries internal docs | Agent answers "how does our auth work?" without pasting docs |
| **Database explorer** | Read-only SQL access | Agent analyzes data, generates reports, debugs data issues |
| **Deployment status** | Server that checks CI/CD pipelines | Agent tells you if the build is green before merging |
| **Notification sender** | Server that posts to Slack/Teams | Agent notifies your team when tasks complete |

**🏫 What This Looks Like in Class.** Most students do not need a giant server to learn the pattern. A tiny JSON-backed tool or a read-only SQLite wrapper is enough to prove the interface. That keeps the engineering lesson focused on protocol design, not on wrestling an unnecessary amount of infrastructure.

**Testing your MCP server:**

```bash
### Run the server and send a test request
$ echo '{"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "lookup_user", "arguments": {"user_id": "123"}}, "id": 1}' | python my_server.py
```

If the server returns the expected response, it's ready to connect.

### Claude Code Workflow: Building and Connecting MCP Servers

Have students watch you connect one existing server and build one tiny custom server in the same class period. The contrast matters. Installing a mature GitHub server shows how much leverage you can get from the ecosystem immediately. Building a tiny internal server from a JSON file or SQLite database shows that custom integrations are not reserved for large companies. Walk through the part that beginners usually skip: naming tools clearly and validating inputs. Those two details decide whether the agent uses the server correctly. If the descriptions are vague, the model guesses. If the validation is weak, the server becomes a foot-gun. That is serious engineering knowledge hidden inside what looks like a small wrapper script.

### Codex Workflow: Building and Connecting MCP Servers

The Codex equivalent of this build-versus-connect decision is the same one students will make with any agent platform: should I expose a clean tool boundary, or should I keep stuffing raw reference material into prompts? Clean tools win once the task repeats. If students later automate repo triage, product analytics checks, or internal documentation search through Codex, the engineering move is still to expose narrow capabilities with typed inputs and clear outputs. MCP makes that portable. The deeper lesson is not about one protocol file. It is about respecting interfaces. Good tool descriptions, minimal permissions, and predictable outputs make agents safer because they reduce the room for hallucination and overreach.

## Break & Wrap Up

**🔥 Key takeaway:** MCP is the universal protocol for connecting AI tools to external services. Learning to connect and build MCP servers makes you dramatically more effective because you can extend your tools to work with anything.

**🧩 Before next class:** Connect at least one MCP server to your Claude Code setup. Try using its tools in a real workflow. If you're ambitious, build a minimal server with one custom tool.

### Pro Tip: Build the Smallest Useful Server

If you can answer the workflow with two read-only tools, stop there. Small servers are easier to secure, easier to document, and easier for models to use correctly. Most early MCP pain comes from overbuilt servers, not underbuilt ones. 🧰

### Fun Fact: Protocols Win Because Everyone Gets Bored of Custom Glue

The funny part of every standards story is that nobody adopts a protocol because it feels glamorous. They adopt it because they are tired of writing the same custom bridge over and over. That is why MCP spread so fast once teams saw live tool access working across vendors. 🔌

### Debrief Questions

Ask which capability in the students' current projects would be worth turning into a server first: docs lookup, database read access, deployment status, or issue triage. If they can name one concrete internal data source, they are ready to build the next thing.

## After Class Challenges

### Challenge 1: Connect and Explore

Connect two MCP servers to your Claude Code setup:

1. Install the GitHub MCP server and configure it with your token.
1. Install one additional server of your choice (filesystem, database, or another service).
1. Use each server's tools in at least one real task.
1. Document: what tools are available, what worked well, what surprised you.

### Challenge 2: Build Your First MCP Server

Build a minimal MCP server with Python (FastMCP) or TypeScript:

1. Choose a data source: a JSON file, a SQLite database, or an API.
1. Implement at least 2 tools with clear descriptions and typed parameters.
1. Add input validation for each tool.
1. Connect it to Claude Code and verify the agent discovers and uses your tools.
1. Push the server code to your project repo.

### Challenge 3: Hallucination Comparison

Use your MCP server to compare AI output quality:

1. Ask Claude Code a question about your data **without** MCP connected. Note the response.
1. Ask the same question **with** your MCP server connected. Note the response.
1. Compare accuracy, confidence, and detail level.
1. Write up the comparison. How much does real data access reduce hallucination?

## Additional Resources

### Source Notes

Start with the official docs and current model pages first. The remaining links add historical context, canonical books, or supporting examples.

1. [Model Context Protocol Specification](https://modelcontextprotocol.io): The official MCP spec and documentation.
1. [MCP Server Registry](https://github.com/modelcontextprotocol): Official list of available servers.
1. [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector): Official MCP debugging and testing tool.
1. [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol): Anthropic's announcement and design goals.
1. [Python SDK](https://github.com/modelcontextprotocol/python-sdk): Official Python SDK for building MCP servers.
1. [OpenAI for Developers](https://developers.openai.com/): OpenAI's official developer hub, including Codex and MCP-adjacent app tooling.
