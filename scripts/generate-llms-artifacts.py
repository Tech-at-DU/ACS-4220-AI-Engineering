#!/usr/bin/env python3
"""Generate SITEMAP.md, llms.txt, and llms-full.txt from repository markdown files."""

from __future__ import annotations

from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_SITEMAP = REPO_ROOT / "SITEMAP.md"
OUTPUT_LLMS = REPO_ROOT / "llms.txt"
OUTPUT_LLMS_FULL = REPO_ROOT / "llms-full.txt"

EXCLUDE_MARKDOWN = {
    "SITEMAP.md",
}


def markdown_files() -> list[Path]:
    files = []
    for abs_path in REPO_ROOT.rglob("*.md"):
        if ".git" in abs_path.parts:
            continue
        rel_path = abs_path.relative_to(REPO_ROOT)
        if rel_path.name in EXCLUDE_MARKDOWN:
            continue
        files.append(rel_path)
    return sorted(files)


def read_h1(path: Path) -> str:
    abs_path = REPO_ROOT / path
    try:
        with abs_path.open("r", encoding="utf-8") as f:
            for line in f:
                stripped = line.strip()
                if stripped.startswith("# "):
                    return stripped[2:].strip()
    except OSError:
        return path.stem
    return path.stem.replace("-", " ").replace("_", " ").strip().title()


def grouped_files(files: list[Path]) -> dict[str, list[Path]]:
    groups: dict[str, list[Path]] = defaultdict(list)
    for path in files:
        parts = path.parts
        top = "Root" if len(parts) == 1 else parts[0]
        groups[top].append(path)
    return dict(sorted(groups.items(), key=lambda kv: kv[0].lower()))


def write_sitemap(files: list[Path]) -> None:
    groups = grouped_files(files)
    lines = [
        "# Course Markdown Sitemap",
        "",
        "> Generated from markdown files in this repository.",
        "",
    ]

    for group, group_files in groups.items():
        lines.append(f"## {group}")
        lines.append("")
        for path in group_files:
            title = read_h1(path)
            lines.append(f"- [{title}]({path.as_posix()})")
        lines.append("")

    OUTPUT_SITEMAP.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def write_llms_txt(files: list[Path]) -> None:
    groups = grouped_files(files)
    lines = [
        "# ACS 4220: AI Engineering",
        "",
        "> Agent index for course docs. Start with README.md, then follow lesson, assignment, and operations links.",
        "",
        "Use this file as a navigation map. Prefer markdown files directly instead of rendered HTML when both exist.",
        "",
    ]

    preferred_order = ["Root", "Lessons", "Assignments", "tips", "Labs", "scripts"]
    seen = set()
    for group in preferred_order:
        if group not in groups:
            continue
        seen.add(group)
        lines.append(f"## {group}")
        lines.append("")
        for path in groups[group]:
            title = read_h1(path)
            lines.append(f"- [{title}]({path.as_posix()}): {path.as_posix()}")
        lines.append("")

    for group, group_files in groups.items():
        if group in seen:
            continue
        lines.append(f"## {group}")
        lines.append("")
        for path in group_files:
            title = read_h1(path)
            lines.append(f"- [{title}]({path.as_posix()}): {path.as_posix()}")
        lines.append("")

    lines.extend(
        [
            "## Optional",
            "",
            "- [Complete markdown corpus](llms-full.txt): Full text export of markdown files for offline ingest.",
            "- [Markdown sitemap](SITEMAP.md): Human-readable map grouped by top-level directory.",
        ]
    )

    OUTPUT_LLMS.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def write_llms_full(files: list[Path]) -> None:
    lines = [
        "# ACS 4220: AI Engineering — llms-full",
        "",
        "> Concatenated markdown corpus for this repository.",
        "",
    ]

    for path in files:
        abs_path = REPO_ROOT / path
        try:
            content = abs_path.read_text(encoding="utf-8").rstrip()
        except OSError:
            content = ""
        lines.extend(
            [
                f"---",
                f"FILE: {path.as_posix()}",
                "---",
                "",
                content,
                "",
            ]
        )

    OUTPUT_LLMS_FULL.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    files = markdown_files()
    write_sitemap(files)
    write_llms_txt(files)
    write_llms_full(files)
    print(f"Generated {OUTPUT_SITEMAP.name}, {OUTPUT_LLMS.name}, and {OUTPUT_LLMS_FULL.name} from {len(files)} markdown files.")


if __name__ == "__main__":
    main()
