from pathlib import Path
import os
import re


ROOT = Path(__file__).resolve().parents[1]
ASSIGNMENTS = sorted((ROOT / "Assignments").glob("*.md"))
raw_out_dir = os.environ.get("RUBRIC_OUT_DIR", "Assignments/rubrics")
OUT_DIR = Path(raw_out_dir).expanduser()
if not OUT_DIR.is_absolute():
    OUT_DIR = ROOT / OUT_DIR
OUT_DIR.mkdir(parents=True, exist_ok=True)
for old_file in OUT_DIR.glob("*-rubric.md"):
    old_file.unlink()
for old_file in OUT_DIR.glob("*-rubric.csv"):
    old_file.unlink()


def extract_title(text: str, fallback: str) -> str:
    match = re.search(r"^#\s+(.+)$", text, re.M)
    title = match.group(1).strip() if match else fallback
    return re.sub(r"^:[^:]+:\s*", "", title).strip()


def extract_rubric_table(text: str) -> list[str]:
    rubric = text.split("## Rubric", 1)[1]
    table_lines: list[str] = []
    started = False
    for line in rubric.splitlines():
        if line.strip().startswith("|"):
            table_lines.append(line.rstrip())
            started = True
        elif started:
            break
    return table_lines


def display_path(path: Path) -> str:
    try:
        return str(path.relative_to(ROOT))
    except ValueError:
        return str(path)


for path in ASSIGNMENTS:
    if path.name.startswith("Sample_"):
        continue

    text = path.read_text(encoding="utf-8", errors="replace")
    if "## Rubric" not in text:
        continue

    title = extract_title(text, path.stem)
    table_lines = extract_rubric_table(text)
    if len(table_lines) < 3:
        continue

    headers = [cell.strip() for cell in table_lines[0].strip("|").split("|")]
    levels = headers[1:]
    paste_lines: list[str] = []

    for row in table_lines[2:]:
        cols = [cell.strip() for cell in row.strip("|").split("|")]
        criterion = cols[0].replace("**", "").strip()
        paste_lines.append(f"## {criterion}")
        paste_lines.append("")
        for level, desc in zip(levels, cols[1:]):
            clean_level = level.replace("**", "").strip()
            paste_lines.append(f"- **{clean_level}**: {desc}")
        paste_lines.append("")

    md_lines = [f"# {title} Rubric", ""]
    md_lines.append(f"Source: [../{path.name}](../{path.name})")
    md_lines.append("")
    md_lines.append("## Paste-Ready Markdown")
    md_lines.append("")
    md_lines.append("```md")
    md_lines.extend(paste_lines)
    md_lines.append("```")

    base_name = f"{path.stem}-rubric"
    md_path = OUT_DIR / f"{base_name}.md"

    md_path.write_text("\n".join(md_lines).rstrip() + "\n", encoding="utf-8")

    print(f"Wrote {display_path(md_path)}")
    print(f"Sections: {len(table_lines) - 2}")
