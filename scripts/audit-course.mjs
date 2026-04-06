import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const lessonsDir = path.join(root, "Lessons");
const assignmentsDir = path.join(root, "Assignments");
const readmePath = path.join(root, "README.md");
const markdownFiles = walkMarkdown(root).filter(
  (file) =>
    !file.includes(`${path.sep}node_modules${path.sep}`) &&
    !file.includes(`${path.sep}.git${path.sep}`),
);

const technicalLectureWpm = 80;
const topLevelAssignmentFiles = fs
  .readdirSync(assignmentsDir)
  .filter(
    (file) =>
      file.endsWith(".md") &&
      !file.startsWith("Sample_") &&
      !file.includes("rubrics"),
  )
  .sort();

const bannedTerms = [
  /\bsimple\b/gi,
  /\beasy\b/gi,
  /\bobviously\b/gi,
  /\byou must\b/gi,
];

const titleCaseStopwords = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "from",
  "in",
  "into",
  "nor",
  "of",
  "on",
  "or",
  "over",
  "per",
  "so",
  "the",
  "to",
  "up",
  "via",
  "vs",
  "vs.",
  "with",
  "yet",
]);

const titleCaseAllowlist = new Set([
  "ACS",
  "AI",
  "API",
  "BDD",
  "CI",
  "CLI",
  "CLAUDE",
  "Codex",
  "CSV",
  "CI/CD",
  "DU",
  "GitHub",
  "Gradescope",
  "JSON",
  "LSP",
  "MCP",
  "OpenAI",
  "PR",
  "README",
  "ROI",
  "SSE",
  "SQL",
  "SVN",
  "TDD",
  "URL",
  "URLs",
  "VSCode",
  "makeanything",
]);

const nonPrimaryIncidentDomains = new Set(["axios.com"]);

const companyAnecdotePattern =
  /\b(Stripe|Shopify|Vercel|Linear|Sentry|Supabase)\b/;
const percentagePattern = /\b\d+(?:\.\d+)?%/;
const dynamicCountPattern = /\b\d+\+\b/;
const pricingPattern = /\$\d/;
const tokenWindowPattern = /\b\d+[Kk]\b/;
const pricingKeywordPattern =
  /\b(per million tokens|pricing|rate card|Max 5x|Max 20x|GPT-5\.3-Codex)\b/i;
const allowedPercentageContextPattern =
  /\b(code coverage|coverage|pass|5-hour|Q&A|minutes?)\b/i;
const futureDependencyArtifacts = ["firstbuild", "fixthis", "wiredup", "makeanything"];
const futureDependencyAllowancePattern =
  /\b(plan|scaffold|proposal|idea|ideas|architecture|poc|proof of concept)\b/i;

function walkMarkdown(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkMarkdown(fullPath));
      continue;
    }
    if (entry.isFile() && fullPath.endsWith(".md")) {
      out.push(fullPath);
    }
  }
  return out;
}

function getSections(text) {
  const sections = [];
  let inCodeFence = false;
  let offset = 0;
  const lines = text.split("\n");

  for (const line of lines) {
    if (line.startsWith("```")) {
      inCodeFence = !inCodeFence;
    }

    if (!inCodeFence && /^## (.+)$/.test(line)) {
      sections.push({
        name: line.replace(/^## /, ""),
        start: offset,
        headingLength: line.length,
      });
    }

    offset += line.length + 1;
  }

  return sections.map((section, index) => ({
    ...section,
    end: index + 1 < sections.length ? sections[index + 1].start : text.length,
  }));
}

function getSectionBody(text, headingName) {
  const section = getSections(text).find((candidate) => candidate.name === headingName);
  if (!section) {
    return "";
  }
  return text.slice(section.start + section.headingLength, section.end).trim();
}

function wordCount(text) {
  return (text.match(/\b[\w`.+#/-]+\b/g) || []).length;
}

function countListItems(text) {
  return (text.match(/^\d+\. |^- /gm) || []).length;
}

function countCodeLines(text) {
  let total = 0;
  const blocks = [...text.matchAll(/```[\s\S]*?```/g)];
  for (const block of blocks) {
    total += block[0].split("\n").length - 2;
  }
  return total;
}

function countEmoji(text) {
  return (text.match(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu) || [])
    .length;
}

function extractLectureWords(text) {
  const sections = getSections(text);
  let total = 0;
  const topicCounts = {};
  const bestPracticesIndex = sections.findIndex(
    (section) => section.name === "Best Practices",
  );
  const breakIndex = sections.findIndex(
    (section) => section.name === "Break & Wrap Up",
  );

  let topicNumber = 0;
  for (const [index, section] of sections.entries()) {
    const isCoreSection =
      section.name === "Learning Objectives" ||
      section.name === "Best Practices" ||
      section.name === "Break & Wrap Up";
    const isLessonBodySection =
      bestPracticesIndex !== -1 &&
      breakIndex !== -1 &&
      index > bestPracticesIndex &&
      index < breakIndex;

    if (!isCoreSection && !isLessonBodySection) {
      continue;
    }

    const body = text
      .slice(section.start + section.headingLength, section.end)
      .trim();
    const wc = wordCount(body);
    total += wc;

    if (isLessonBodySection && topicNumber < 2) {
      topicNumber += 1;
      topicCounts[`topic${topicNumber}`] = wc;
    }
  }

  const listItems = countListItems(text);
  const codeLines = countCodeLines(text);
  const speakingMinutes =
    total / technicalLectureWpm + listItems * 0.08 + Math.min(codeLines * 0.08, 6);

  return {
    totalWords: total,
    topic1Words: topicCounts.topic1 ?? 0,
    topic2Words: topicCounts.topic2 ?? 0,
    speakingMinutes: Number(speakingMinutes.toFixed(1)),
  };
}

function findBannedTerms(text) {
  const hits = [];
  for (const pattern of bannedTerms) {
    for (const match of text.matchAll(pattern)) {
      const line = text.slice(0, match.index).split("\n").length;
      hits.push({ term: match[0], line });
    }
  }
  return hits;
}

function stripInlineCode(text) {
  return text.replace(/`[^`]+`/g, "");
}

function headingNeedsTitleCase(heading) {
  const cleaned = stripInlineCode(
    heading
      .replace(/^#+\s*/, "")
      .replace(/^\p{Emoji_Presentation}+/gu, "")
      .replace(/^:[\w+-]+:\s*/g, "")
      .replace(/\([^)]*\)/g, (match) => match)
      .trim(),
  );

  if (!cleaned || cleaned === cleaned.toUpperCase()) {
    return false;
  }

  const segments = cleaned.split(":").map((segment) => segment.trim());
  return segments.some((segment) => {
    const tokens = segment
      .split(/(\s+|[?&/()])/)
      .filter((token) => token && !/^\s+$/.test(token));

    const words = tokens.filter((token) => /[A-Za-z]/.test(token));
    if (words.length === 0) {
      return false;
    }

    return words.some((word, index) => {
      const bare = word.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "");
      if (!bare) {
        return false;
      }
      if (
        titleCaseAllowlist.has(bare) ||
        titleCaseAllowlist.has(bare.toLowerCase()) ||
        titleCaseAllowlist.has(bare.toUpperCase())
      ) {
        return false;
      }
      const isFirst = index === 0;
      const isLast = index === words.length - 1;
      const expectedLower = titleCaseStopwords.has(bare.toLowerCase());
      if (expectedLower && !isFirst && !isLast) {
        return bare !== bare.toLowerCase();
      }
      return bare[0] !== bare[0].toUpperCase();
    });
  });
}

function collectHeadingIssues(filePath, text) {
  const issues = [];
  let inCodeFence = false;
  const lines = text.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) {
      continue;
    }
    if (/^#{1,3}\s+/.test(line) && headingNeedsTitleCase(line)) {
      issues.push({ line: index + 1, heading: line });
    }
  }
  return issues;
}

function extractHeadings(text, level = 2) {
  const headings = [];
  const prefix = "#".repeat(level);
  let inCodeFence = false;
  const lines = text.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) {
      continue;
    }
    if (line.startsWith(`${prefix} `)) {
      const headingText = line.slice(level + 1).trim();
      headings.push({ line: index + 1, text: headingText });
    }
  }

  return headings;
}

function extractTocEntries(text) {
  const entries = [];
  const lines = text.split("\n");
  let inCodeFence = false;
  let inToc = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) {
      continue;
    }
    if (/^#{2,3}\s+Table of Contents$/.test(line.trim())) {
      inToc = true;
      continue;
    }
    if (!inToc) {
      continue;
    }
    if (/^##\s+/.test(line)) {
      break;
    }
    const match = line.match(/\[(.+?)\]\(#.+?\)/);
    if (match) {
      entries.push(match[1]);
    }
  }

  return entries;
}

function extractLinks(sectionBody) {
  return [...sectionBody.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)].map(
    (match) => ({
      label: match[1],
      url: match[2],
    }),
  );
}

function isPrimarySource(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  const host = parsed.hostname.replace(/^www\./, "");
  if (
    [
      "anthropic.com",
      "docs.anthropic.com",
      "code.claude.com",
      "claude.com",
      "developers.openai.com",
      "help.openai.com",
      "openai.com",
      "modelcontextprotocol.io",
    ].includes(host)
  ) {
    return true;
  }

  if (host === "github.com") {
    return /^\/(anthropics|openai|modelcontextprotocol)\//.test(parsed.pathname);
  }

  return false;
}

function collectAdditionalResourceMeta(text) {
  const additionalResources = getSectionBody(text, "Additional Resources");
  const links = extractLinks(additionalResources);
  const primaryLinks = links.filter((link) => isPrimarySource(link.url));
  const unlabeledPublicReporting = [];

  for (const link of links) {
    let parsed;
    try {
      parsed = new URL(link.url);
    } catch {
      continue;
    }
    const host = parsed.hostname.replace(/^www\./, "");
    if (!nonPrimaryIncidentDomains.has(host)) {
      continue;
    }
    const lineMatch = additionalResources
      .split("\n")
      .find((line) => line.includes(link.url));
    if (
      lineMatch &&
      /(incident|leak|artifact|source map|source-map|scrutiny)/i.test(lineMatch) &&
      !/public reporting/i.test(lineMatch)
    ) {
      unlabeledPublicReporting.push({
        url: link.url,
        line: lineMatch.trim(),
      });
    }
  }

  return {
    links,
    primaryLinks,
    hasPrimarySourceLink: primaryLinks.length > 0,
    unlabeledPublicReporting,
  };
}

function lineNumberFromIndex(text, index) {
  return text.slice(0, index).split("\n").length;
}

function collectVolatileClaims(filePath, text) {
  const relativePath = path.relative(root, filePath);
  const basename = path.basename(filePath);
  const hits = [];
  let inCodeFence = false;
  const lines = text.split("\n");
  let currentHeading = "";

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) {
      continue;
    }
    if (/^#{1,3}\s+/.test(line)) {
      currentHeading = line.replace(/^#{1,3}\s+/, "").trim();
    }
    if (!line.trim()) {
      continue;
    }

    const isReadmePricingSection =
      relativePath === "README.md" &&
      ["Claude Code Access for Students", "Codex Access for Students"].includes(
        currentHeading,
      );
    const isLessonPricingSection =
      basename === "what-do-you-even-do-all-day.md" &&
      currentHeading.includes("Cost Management and Optimization");

    if (
      pricingPattern.test(line) &&
      !isReadmePricingSection &&
      !isLessonPricingSection
    ) {
      hits.push({
        line: index + 1,
        type: "pricing-outside-source-of-truth",
        text: line.trim(),
      });
      continue;
    }

    if (
      tokenWindowPattern.test(line) &&
      pricingKeywordPattern.test(line) &&
      !isReadmePricingSection &&
      !isLessonPricingSection
    ) {
      hits.push({
        line: index + 1,
        type: "token-window-outside-allowed-section",
        text: line.trim(),
      });
      continue;
    }

    if (
      companyAnecdotePattern.test(line) &&
      (percentagePattern.test(line) ||
        /\b(reported|internally|uses?|use|reduction|metrics|fewer|common)\b/i.test(line))
    ) {
      hits.push({
        line: index + 1,
        type: "company-anecdote",
        text: line.trim(),
      });
      continue;
    }

    if (
      percentagePattern.test(line) &&
      !allowedPercentageContextPattern.test(line) &&
      !isReadmePricingSection &&
      !isLessonPricingSection
    ) {
      hits.push({
        line: index + 1,
        type: "unsupported-percentage",
        text: line.trim(),
      });
      continue;
    }

    if (dynamicCountPattern.test(line) && /\b(server|servers|tools|models)\b/i.test(line)) {
      hits.push({
        line: index + 1,
        type: "dynamic-count",
        text: line.trim(),
      });
    }
  }

  return hits;
}

function parseReadmeDeliverableDates(readmeText) {
  const deliverables = getSectionBody(readmeText, "Schedule");
  const dates = new Map();
  for (const line of deliverables.split("\n")) {
    const match = line.match(
      /(Assignments\/([^)]+\.md)).*?\|\s+([A-Z][a-z]+ \d{1,2}, \d{4})/,
    );
    if (!match) {
      continue;
    }
    const fullPath = match[1];
    const basename = path.basename(fullPath);
    const date = new Date(`${match[3]} 12:00:00 UTC`);
    if (!Number.isNaN(date.getTime())) {
      if (!dates.has(basename) || date < dates.get(basename)) {
        dates.set(basename, date);
      }
    }
  }
  return dates;
}

function collectFutureDependencies(filePath, text, dueDate, artifactDates) {
  if (!dueDate) {
    return [];
  }

  const currentBasename = path.basename(filePath);
  const activeBody = text.split(/\n## Resources\n/)[0];
  const hits = [];
  const lines = activeBody.split("\n");
  let inCodeFence = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) {
      continue;
    }

    for (const artifact of futureDependencyArtifacts) {
      const artifactFile =
        artifact === "makeanything" ? "makeanything.md" : `${artifact}.md`;
      const artifactDate = artifactDates.get(artifactFile);
      if (!artifactDate || artifactDate <= dueDate || artifactFile === currentBasename) {
        continue;
      }
      if (!new RegExp(`\\b${artifact}\\b`, "i").test(line)) {
        continue;
      }
      if (futureDependencyAllowancePattern.test(line)) {
        continue;
      }
      hits.push({
        line: index + 1,
        artifact,
        text: line.trim(),
      });
    }
  }

  return hits;
}

function normalizeH2Headings(headings) {
  return headings
    .map((heading) => heading.text)
    .filter((heading) => heading !== "Table of Contents");
}

const readmeText = fs.readFileSync(readmePath, "utf8");
const deliverableDates = parseReadmeDeliverableDates(readmeText);

const lessonReports = [];
for (const lessonFile of fs
  .readdirSync(lessonsDir)
  .filter((file) => file.endsWith(".md"))
  .sort()) {
  const fullPath = path.join(lessonsDir, lessonFile);
  const text = fs.readFileSync(fullPath, "utf8");
  const lecture = extractLectureWords(text);
  const resourceMeta = collectAdditionalResourceMeta(text);
  lessonReports.push({
    file: path.relative(root, fullPath),
    htmlComments: (text.match(/<!--/g) || []).length,
    funFactCount: (text.match(/^### Fun Fact:/gm) || []).length,
    proTipCount: (text.match(/^### Pro Tip:/gm) || []).length,
    codexRefs: (text.match(/\b(Codex|OpenAI)\b/g) || []).length,
    hasSourceNotes: text.includes("### Source Notes"),
    hasStrategyUseCase:
      text.includes("**💼 Use Case.**") || text.includes("**Use Case.**"),
    hasStrategyProTip:
      text.includes("**🛠️ Pro Tip.**") || text.includes("**Pro Tip.**"),
    hasBuildBridge: text.includes("**Builds On:**"),
    hasFeedsBridge: text.includes("**Feeds:**"),
    emojiCount: countEmoji(text),
    bannedTerms: findBannedTerms(text),
    volatileClaimHits: collectVolatileClaims(fullPath, text),
    primarySourceLinks: resourceMeta.primaryLinks.length,
    hasPrimarySourceLink: resourceMeta.hasPrimarySourceLink,
    unlabeledPublicReporting: resourceMeta.unlabeledPublicReporting,
    ...lecture,
  });
}

const assignmentReports = topLevelAssignmentFiles.map((assignmentFile) => {
  const fullPath = path.join(assignmentsDir, assignmentFile);
  const text = fs.readFileSync(fullPath, "utf8");
  const tocEntries = extractTocEntries(text);
  const h2Headings = normalizeH2Headings(extractHeadings(text, 2));
  const dueDate = deliverableDates.get(assignmentFile) ?? null;
  const futureDependencies = collectFutureDependencies(
    fullPath,
    text,
    dueDate,
    deliverableDates,
  );
  return {
    file: path.relative(root, fullPath),
    tocEntries,
    h2Headings,
    tocMatchesH2:
      tocEntries.length === h2Headings.length &&
      tocEntries.every((entry, index) => entry === h2Headings[index]),
    futureDependencies,
    dueDate: dueDate ? dueDate.toISOString().slice(0, 10) : null,
  };
});

const readmeResourceMeta = collectAdditionalResourceMeta(readmeText);
const readmeReport = {
  file: "README.md",
  hasPrimarySourceLink: readmeResourceMeta.hasPrimarySourceLink,
  primarySourceLinks: readmeResourceMeta.primaryLinks.length,
  unlabeledPublicReporting: readmeResourceMeta.unlabeledPublicReporting,
  volatileClaimHits: collectVolatileClaims(readmePath, readmeText),
  deliverableDates: Object.fromEntries(
    [...deliverableDates.entries()].map(([key, value]) => [
      key,
      value.toISOString().slice(0, 10),
    ]),
  ),
};

const headingIssues = markdownFiles.flatMap((filePath) => {
  const text = fs.readFileSync(filePath, "utf8");
  return collectHeadingIssues(filePath, text).map((issue) => ({
    file: path.relative(root, filePath),
    ...issue,
  }));
});

const report = {
  generatedAt: new Date().toISOString(),
  readme: readmeReport,
  lessons: lessonReports,
  assignments: assignmentReports,
  headingIssues,
  summary: {
    lessonsWithComments: lessonReports.filter((lesson) => lesson.htmlComments > 0)
      .length,
    lessonsMissingCodex: lessonReports.filter((lesson) => lesson.codexRefs === 0)
      .length,
    lessonsMissingSourceNotes: lessonReports.filter(
      (lesson) => !lesson.hasSourceNotes,
    ).length,
    lessonsMissingStrategyUseCase: lessonReports.filter(
      (lesson) => !lesson.hasStrategyUseCase,
    ).length,
    lessonsMissingStrategyProTip: lessonReports.filter(
      (lesson) => !lesson.hasStrategyProTip,
    ).length,
    lessonsMissingBuildBridge: lessonReports.filter(
      (lesson) => !lesson.hasBuildBridge,
    ).length,
    lessonsMissingFeedsBridge: lessonReports.filter(
      (lesson) => !lesson.hasFeedsBridge,
    ).length,
    lessonsWithLightEmojiDensity: lessonReports.filter(
      (lesson) => lesson.emojiCount < 4,
    ).length,
    lessonsMissingFunFact: lessonReports.filter((lesson) => lesson.funFactCount === 0)
      .length,
    lessonsMissingProTip: lessonReports.filter((lesson) => lesson.proTipCount === 0)
      .length,
    lessonsBelowTopicFloor: lessonReports.filter(
      (lesson) => lesson.topic1Words < 600 || lesson.topic2Words < 600,
    ).length,
    lessonsBelowSpeakingFloor: lessonReports.filter(
      (lesson) => lesson.speakingMinutes < 30,
    ).length,
    lessonsWithBannedTerms: lessonReports.filter(
      (lesson) => lesson.bannedTerms.length > 0,
    ).length,
    lessonsWithVolatileClaims: lessonReports.filter(
      (lesson) => lesson.volatileClaimHits.length > 0,
    ).length,
    lessonsMissingPrimarySources: lessonReports.filter(
      (lesson) => !lesson.hasPrimarySourceLink,
    ).length,
    lessonsWithUnlabeledPublicReporting: lessonReports.filter(
      (lesson) => lesson.unlabeledPublicReporting.length > 0,
    ).length,
    assignmentsWithTocMismatch: assignmentReports.filter(
      (assignment) => !assignment.tocMatchesH2,
    ).length,
    assignmentsWithFutureDependencies: assignmentReports.filter(
      (assignment) => assignment.futureDependencies.length > 0,
    ).length,
    readmeVolatileClaims: readmeReport.volatileClaimHits.length,
    readmeMissingPrimarySources: readmeReport.hasPrimarySourceLink ? 0 : 1,
    readmeUnlabeledPublicReporting: readmeReport.unlabeledPublicReporting.length,
    headingIssues: headingIssues.length,
  },
};

const outDir = path.join(root, "automation", "out");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "course-audit.json");
fs.writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`);

console.log(`Wrote ${path.relative(root, outFile)}`);
console.log(JSON.stringify(report.summary, null, 2));
