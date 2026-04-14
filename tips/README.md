# Tips

Field notes, fixes, and quick wins for working with AI tooling in this course.

---

## Claude Tokens Getting Torched? You're Not Crazy

Two open bugs in Claude Code are bleeding your quota every single session — here's what's happening and how to stop it.

### Bug 1: Git Status in the System Prompt

[anthropics/claude-code#47107](https://github.com/anthropics/claude-code/issues/47107) — By default, Claude Code stuffs `git status` and recent commits into the system prompt. That block changes every time you commit, which means the cache key is stale on every run. You're eating ~6k cache-write tokens you already paid for. Every. Time.

### Bug 2: Skills + CLAUDE.md Don't Get Cache-Marked

[anthropics/claude-code#47098](https://github.com/anthropics/claude-code/issues/47098) — The user-message block that holds your skills and project context doesn't get a `cache_control` marker, so it never actually hits the cache on session restarts. Those 11k tokens get re-written instead of re-read.

### Fix It Now

**Option A — env var (per-shell, instant):**

```bash
# drop this in your .zshrc / .zshenv / .bashrc / .bashenv
export CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS=1
```

**Option B — project settings (committed, whole team gets it):**

```json
// .claude/settings.json
{
  "env": {
    "CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS": "1"
  }
}
```

This repo already has Option B committed. If you're working on a different project, add the env var to your shell rc.

> Source: [HN thread](https://news.ycombinator.com/item?id=47754795)

---

## Additional Resources

- [Claude Code Docs](https://docs.anthropic.com/en/docs/claude-code/overview)
- [anthropics/claude-code issues](https://github.com/anthropics/claude-code/issues)
