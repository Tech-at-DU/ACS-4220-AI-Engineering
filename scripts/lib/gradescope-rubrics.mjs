import { promises as fs } from "node:fs";
import path from "node:path";

export function stripMarkdown(text) {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();
}

export function sanitizeHeadingTitle(text, fallback = "") {
  return stripMarkdown(text)
    .replace(/^:[^:]+:\s*/g, "")
    .replace(/^[\p{Extended_Pictographic}\p{Emoji_Presentation}\s]+/gu, "")
    .replace(/\s+/g, " ")
    .trim() || fallback;
}

export function extractAssignmentTitle(text, fallback) {
  const match = text.match(/^#\s+(.+)$/m);
  return sanitizeHeadingTitle(match ? match[1] : fallback, fallback);
}

export function extractRubricTable(text) {
  const parts = text.split("## Rubric", 2);
  if (parts.length < 2) {
    return [];
  }

  const tableLines = [];
  let started = false;
  for (const line of parts[1].split(/\r?\n/)) {
    if (line.trim().startsWith("|")) {
      tableLines.push(line.trimEnd());
      started = true;
    } else if (started) {
      break;
    }
  }

  return tableLines;
}

export function parseRubricTable(tableLines) {
  if (tableLines.length < 3) {
    return null;
  }

  const headers = tableLines[0]
    .slice(1, -1)
    .split("|")
    .map((cell) => stripMarkdown(cell).trim());
  const levels = headers.slice(1);

  if (levels.length === 0) {
    return null;
  }

  const criteria = tableLines.slice(2).map((row) => {
    const cols = row
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim());
    const title = stripMarkdown(cols[0]).trim();
    const ratings = levels.map((level, index) => ({
      level,
      description: cols[index + 1] ?? ""
    }));

    return {
      title,
      ratings
    };
  });

  return {
    levels,
    criteria
  };
}

export function buildStructuredRubric({
  assignmentTitle,
  sourceFile,
  sourceBasename,
  levels,
  criteria
}) {
  return {
    schemaVersion: 1,
    rubricType: "performance-level-grid",
    assignmentTitle,
    sourceFile,
    sourceBasename,
    levelCount: levels.length,
    criterionCount: criteria.length,
    levels,
    criteria
  };
}

export function buildMarkdownExport(rubric) {
  const lines = [
    `# ${rubric.assignmentTitle} Rubric`,
    "",
    `Source: [../${rubric.sourceBasename}](../${rubric.sourceBasename})`,
    "",
    "## Paste-Ready Markdown",
    "",
    "```md"
  ];

  for (const criterion of rubric.criteria) {
    lines.push(`## ${criterion.title}`);
    lines.push("");

    for (const rating of criterion.ratings) {
      lines.push(`- **${rating.level}**: ${rating.description}`);
    }

    lines.push("");
  }

  lines.push("```");
  return `${lines.join("\n").replace(/\n+$/, "")}\n`;
}

export function parseAssignmentRubric(text, fallbackTitle, sourceFile) {
  const assignmentTitle = extractAssignmentTitle(text, fallbackTitle);
  const tableLines = extractRubricTable(text);
  const parsedTable = parseRubricTable(tableLines);

  if (!parsedTable) {
    return null;
  }

  return buildStructuredRubric({
    assignmentTitle,
    sourceFile,
    sourceBasename: path.basename(sourceFile),
    levels: parsedTable.levels,
    criteria: parsedTable.criteria
  });
}

async function prepareOutDir(outDir) {
  await fs.mkdir(outDir, { recursive: true });
  for (const name of await fs.readdir(outDir)) {
    if (
      name.endsWith("-rubric.md") ||
      name.endsWith("-rubric.json") ||
      name.endsWith("-rubric.csv")
    ) {
      await fs.unlink(path.join(outDir, name));
    }
  }
}

export async function exportRubrics({
  rootDir,
  assignmentsDir = path.join(rootDir, "Assignments"),
  outDir = path.join(rootDir, "Assignments", "rubrics"),
  logger = console
}) {
  await prepareOutDir(outDir);

  const assignmentNames = (await fs.readdir(assignmentsDir))
    .filter((name) => name.endsWith(".md"))
    .sort();
  const exports = [];

  for (const name of assignmentNames) {
    if (name.startsWith("Sample_")) {
      continue;
    }

    const sourcePath = path.join(assignmentsDir, name);
    const sourceText = await fs.readFile(sourcePath, "utf8");
    if (!sourceText.includes("## Rubric")) {
      continue;
    }

    const rubric = parseAssignmentRubric(
      sourceText,
      path.parse(name).name,
      path.posix.join("Assignments", name)
    );
    if (!rubric) {
      continue;
    }

    const baseName = `${path.parse(name).name}-rubric`;
    const markdownPath = path.join(outDir, `${baseName}.md`);
    const jsonPath = path.join(outDir, `${baseName}.json`);

    await fs.writeFile(markdownPath, buildMarkdownExport(rubric));
    await fs.writeFile(`${jsonPath}`, `${JSON.stringify(rubric, null, 2)}\n`);

    const markdownDisplay = path.relative(rootDir, markdownPath);
    const jsonDisplay = path.relative(rootDir, jsonPath);

    logger.log(`Wrote ${markdownDisplay}`);
    logger.log(`Wrote ${jsonDisplay}`);
    logger.log(`Sections: ${rubric.criterionCount}`);

    exports.push({
      sourceFile: path.posix.join("Assignments", name),
      markdownFile: markdownDisplay,
      jsonFile: jsonDisplay,
      rubric
    });
  }

  return exports;
}
