# llms-sitemap skill

Generate and maintain three docs artifacts for this course repo:

1. `SITEMAP.md` — full markdown map of the repo.
1. `llms.txt` — compact agent navigation index.
1. `llms-full.txt` — concatenated markdown corpus.

## Why this shape (April 2026)

This skill follows the `llms.txt` proposal format and observed agent-doc best practices:

- Keep `llms.txt` small and structured (H1, summary blockquote, H2 sections, markdown links).
- Keep complete corpus in a companion file (`llms-full.txt`) instead of overloading `llms.txt`.
- Prefer markdown links and markdown sources to reduce agent conversion loss.

References:

- [llmstxt.org](https://llmstxt.org/)
- [Agent Docs Spec](https://www.agentdocsspec.com/spec/)

## Inputs

- Repository markdown files (`**/*.md`, excluding `.git` internals and generated `SITEMAP.md` source recursion).

## Command

```bash
python3 scripts/generate-llms-artifacts.py
```

## Output contract

- `SITEMAP.md` grouped by top-level directory.
- `llms.txt` with concise discovery-first sections.
- `llms-full.txt` containing each markdown file with clear file delimiters.

## Validation checklist

1. Run markdown lint:

   ```bash
   npm run lint:md
   ```

1. Sanity-check size and structure:

   ```bash
   wc -c llms.txt llms-full.txt SITEMAP.md
   rg "^# |^## |^> |^- \[" llms.txt
   ```

1. If new markdown files are added or renamed, rerun the generator.
