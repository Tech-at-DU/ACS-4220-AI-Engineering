# Give It Eyes and Ears

## Learning Objectives

By the end of this lesson, you will be able to:

1. Explain what the Model Context Protocol (MCP) is, why it was created, and what problem it solves.
2. Describe the MCP architecture: hosts, clients, servers, resources, and tools.
3. Build a basic MCP server that exposes a tool Claude Code can call.
4. Connect an existing MCP server to your Claude Code setup and use it in a workflow.

## Best Practices

- **Start by connecting, not building.** There are 200+ existing MCP servers. Before building your own, check if one already exists. The MCP registry is your first stop.
- **One server, one concern.** A GitHub server. A Slack server. A database server. Don't build a mega-server that does everything.
- **Test servers locally first.** Use `stdio` transport during development. Switch to `SSE` for production deployments.
- **Validate tool inputs.** Your MCP server receives tool calls from an AI agent. The agent might send malformed data. Validate before executing.
- **Document your tools clearly.** The tool descriptions are what the agent reads to decide when and how to call each tool. Vague descriptions produce wrong calls.
- **Scope permissions tightly.** If your MCP server connects to a database, give it read-only access unless writes are explicitly needed.

# Topic 1: Model Context Protocol

## Overview

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

2. **Servers**: Programs that provide data and tools. A GitHub MCP server exposes tools like "list issues," "create PR," and "read file." A database MCP server exposes "run query" and "list tables." Servers are where the integration logic lives.

3. **The protocol**: JSON-RPC 2.0 messages over a transport layer (stdio for local servers, SSE for remote ones). The host sends a request ("call this tool with these arguments"), the server executes it, and returns the result.

**What servers expose:**

- **Resources**: Read-only data sources. A file system server might expose project files. A database server might expose table schemas. Resources are for reading, not acting.
- **Tools**: Executable functions that perform actions. "Create a GitHub issue," "Send a Slack message," "Run a SQL query." Tools are for doing things.

**The ecosystem today (April 2026).** Over 200 server implementations exist, covering GitHub, Slack, Google Drive, PostgreSQL, Notion, Jira, Salesforce, and dozens more. Official SDKs are available in TypeScript, Python, Go (maintained with Google), C# (maintained with Microsoft), and Ruby.

In December 2025, Anthropic donated MCP to the Agentic AI Foundation under the Linux Foundation, co-founded by Anthropic, Block, and OpenAI. This moved it from "Anthropic's protocol" to "the industry's protocol." Major platforms including OpenAI, Google, and Microsoft now support or are implementing MCP compatibility.

**Why this matters for your career.** MCP is becoming the standard way AI tools connect to everything. Understanding how to build and configure MCP servers means you can extend any AI tool to work with any service. That skill transfers across every AI platform, not just Claude.

# Topic 2: Building and Connecting MCP Servers

## Overview

Understanding what MCP is matters less than knowing how to use it. Here's the practical side: connecting existing servers and building your own.

**Connecting an existing MCP server.** The fastest way to extend Claude Code's capabilities:

1. **Find the server.** Check the MCP registry or the [official server list](https://github.com/modelcontextprotocol).

2. **Install it:**

```bash
# Example: installing the GitHub MCP server
$ npm install -g @modelcontextprotocol/server-github
```

3. **Configure Claude Code to use it:**

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

4. **Test it.** Start a Claude Code session. "List my open GitHub issues" should work.

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

**Testing your MCP server:**

```bash
# Run the server and send a test request
$ echo '{"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "lookup_user", "arguments": {"user_id": "123"}}, "id": 1}' | python my_server.py
```

If the server returns the expected response, it's ready to connect.

## Break & Wrap Up

**Key takeaway:** MCP is the universal protocol for connecting AI tools to external services. Learning to connect and build MCP servers makes you dramatically more effective because you can extend your tools to work with anything.

**Before next class:** Connect at least one MCP server to your Claude Code setup. Try using its tools in a real workflow. If you're ambitious, build a minimal server with one custom tool.

## After Class Challenges

### Challenge 1: Connect and Explore

Connect two MCP servers to your Claude Code setup:

1. Install the GitHub MCP server and configure it with your token.
2. Install one additional server of your choice (filesystem, database, or another service).
3. Use each server's tools in at least one real task.
4. Document: what tools are available, what worked well, what surprised you.

### Challenge 2: Build Your First MCP Server

Build a minimal MCP server with Python (FastMCP) or TypeScript:

1. Choose a data source: a JSON file, a SQLite database, or an API.
2. Implement at least 2 tools with clear descriptions and typed parameters.
3. Add input validation for each tool.
4. Connect it to Claude Code and verify the agent discovers and uses your tools.
5. Push the server code to your project repo.

### Challenge 3: Hallucination Comparison

Use your MCP server to compare AI output quality:

1. Ask Claude Code a question about your data **without** MCP connected. Note the response.
2. Ask the same question **with** your MCP server connected. Note the response.
3. Compare accuracy, confidence, and detail level.
4. Write up the comparison. How much does real data access reduce hallucination?

## Additional Resources

1. [Model Context Protocol Specification](https://modelcontextprotocol.io): The official MCP spec and documentation.
2. [MCP Server Registry](https://github.com/modelcontextprotocol): Official list of available servers.
3. [FastMCP Documentation](https://github.com/jlowin/fastmcp): Python framework for building MCP servers quickly.
4. [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol): Anthropic's announcement and design goals.
5. [MCP Roadmap 2026](https://thenewstack.io/model-context-protocol-roadmap-2026/): What's coming next for the protocol.
