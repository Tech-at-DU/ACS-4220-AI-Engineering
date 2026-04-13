import { promises as fs } from "node:fs";
import path from "node:path";
import {
  extractAssignmentTitle,
  sanitizeHeadingTitle,
  stripMarkdown
} from "./gradescope-rubrics.mjs";

export function normalizeTitle(text) {
  return sanitizeHeadingTitle(text, "")
    .replace(/:[a-z0-9_+-]+:/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function extractReadmeTitle(readmeText, fallback = "") {
  const match = readmeText.match(/^#\s+(.+)$/m);
  return sanitizeHeadingTitle(match ? match[1] : fallback, fallback);
}

export function formatDateForReadme(iso, timezone) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(iso));
}

export function extractDeliverables(readmeText) {
  const start = readmeText.indexOf("📚 Assignment |");
  const end = readmeText.indexOf("\n## Evaluation");
  if (start === -1 || end === -1) {
    return new Map();
  }

  const lines = readmeText
    .slice(start, end)
    .split(/\r?\n/)
    .filter((line) => line.includes("|"));

  const entries = new Map();
  for (const line of lines.slice(2)) {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length < 3) {
      continue;
    }

    const title = stripMarkdown(parts[0]);
    const dueDate = parts[2].replace(/_\(.*?\)_/g, "").trim();
    if (title && dueDate) {
      entries.set(normalizeTitle(title), dueDate);
    }
  }

  return entries;
}

export async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function validateIsoDate(label, value, errors) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    errors.push(`${label} is not a valid ISO date: ${value}`);
  }
}

function ensureString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function resolveCoursePlan({ manifest, readmeTitle, createNewCourse }) {
  const errors = [];
  const warnings = [];
  const creationDefaults = manifest.course.creationDefaults ?? {};
  const assignmentTypeDecision = manifest.course.assignmentTypeDecision ?? {};
  const selectedType = assignmentTypeDecision.selectedType ?? null;
  const choiceLocked = assignmentTypeDecision.choiceLocked === true;
  const syncReady = choiceLocked && ensureString(selectedType);

  if (createNewCourse) {
    for (const field of ["courseNumber", "term", "school"]) {
      if (!ensureString(creationDefaults[field])) {
        errors.push(`course.creationDefaults.${field} is required for --new`);
      }
    }

    if (!Number.isInteger(creationDefaults.year)) {
      errors.push(`course.creationDefaults.year must be an integer for --new`);
    }
  } else if (!ensureString(manifest.course.gradescopeCourseId)) {
    errors.push(`course.gradescopeCourseId is required when using an existing course`);
  }

  if (choiceLocked && !ensureString(selectedType)) {
    errors.push(`course.assignmentTypeDecision.selectedType is required when choiceLocked is true`);
  }

  if (
    choiceLocked &&
    Array.isArray(assignmentTypeDecision.candidateTypes) &&
    assignmentTypeDecision.candidateTypes.length > 0 &&
    !assignmentTypeDecision.candidateTypes.includes(selectedType)
  ) {
    errors.push(`Selected assignment type must be one of the candidate types`);
  }

  return {
    action: createNewCourse ? "create" : "use-existing",
    resolvedTitle: createNewCourse
      ? readmeTitle
      : creationDefaults.courseName ?? readmeTitle,
    timezone: manifest.course.timezone,
    gradescopeCourseId: manifest.course.gradescopeCourseId ?? null,
    gradescopeCourseUrl: manifest.course.gradescopeCourseUrl ?? null,
    syncReady,
    syncBlockedReason: syncReady
      ? null
      : assignmentTypeDecision.blockedReason ??
        "Assignment type decision is not locked.",
    selectedAssignmentType: selectedType,
    errors,
    warnings,
    creationDefaults
  };
}

export function rubricMarkdownHasPlanHeader(text) {
  if (typeof text !== "string" || text.length === 0) return false;
  return /^#{1,6}\s[^\n]*\bplan/im.test(text);
}

function summarizeAssignmentAction({ errors, rubricMarkdownText, gradescopeAssignmentId }) {
  if (errors.length > 0) {
    return "blocked";
  }

  if (rubricMarkdownHasPlanHeader(rubricMarkdownText)) {
    return "planned";
  }

  const hasId =
    typeof gradescopeAssignmentId === "string" &&
    gradescopeAssignmentId.trim().length > 0;
  return hasId ? "update" : "create";
}

export async function buildGradescopePlan({
  rootDir,
  manifestPath = path.join(rootDir, "automation", "gradescope.course.json"),
  createNewCourse = false
}) {
  const manifest = await readJson(manifestPath);
  const readmePath = path.join(rootDir, manifest.course.readmeTitleFile ?? "README.md");
  const readmeText = await fs.readFile(readmePath, "utf8");
  const readmeTitle = extractReadmeTitle(readmeText, manifest.course.creationDefaults?.courseName ?? "");
  const deliverables = extractDeliverables(readmeText);
  const seenSlugs = new Set();
  const seenTitles = new Set();
  const planItems = [];
  const course = resolveCoursePlan({ manifest, readmeTitle, createNewCourse });

  for (const assignment of manifest.assignments) {
    const errors = [];
    const warnings = [];

    if (seenSlugs.has(assignment.slug)) {
      errors.push(`Duplicate slug: ${assignment.slug}`);
    }
    seenSlugs.add(assignment.slug);

    const normalizedTitle = normalizeTitle(assignment.title);
    if (seenTitles.has(normalizedTitle)) {
      errors.push(`Duplicate title: ${assignment.title}`);
    }
    seenTitles.add(normalizedTitle);

    validateIsoDate(`${assignment.slug}.releaseAt`, assignment.releaseAt, errors);
    validateIsoDate(`${assignment.slug}.dueAt`, assignment.dueAt, errors);
    if (new Date(assignment.releaseAt) >= new Date(assignment.dueAt)) {
      errors.push(`releaseAt must be earlier than dueAt`);
    }

    const sourcePath = path.join(rootDir, assignment.sourceFile);
    const rubricMarkdownPath = path.join(rootDir, assignment.rubricMarkdownFile);
    const rubricJsonPath = path.join(rootDir, assignment.rubricJsonFile);

    let sourceTitle = assignment.title;
    try {
      const sourceText = await fs.readFile(sourcePath, "utf8");
      sourceTitle = extractAssignmentTitle(sourceText, assignment.title);
      if (!sourceText.includes("## Rubric")) {
        warnings.push("Source assignment file does not contain a rubric table.");
      }
    } catch {
      errors.push(`Missing source file: ${assignment.sourceFile}`);
    }

    let rubricMarkdownText = "";
    try {
      rubricMarkdownText = await fs.readFile(rubricMarkdownPath, "utf8");
      if (!rubricMarkdownText.includes("## Paste-Ready Markdown")) {
        errors.push(`Rubric Markdown export is missing the paste-ready section.`);
      }
      if (!rubricMarkdownText.includes("```md")) {
        errors.push(`Rubric Markdown export is missing the fenced Markdown block.`);
      }
    } catch {
      errors.push(`Missing rubric Markdown file: ${assignment.rubricMarkdownFile}`);
    }

    try {
      const rubricJson = await readJson(rubricJsonPath);
      if (rubricJson.schemaVersion !== 1) {
        errors.push(`Rubric JSON schemaVersion must be 1.`);
      }
      if (!Array.isArray(rubricJson.criteria) || rubricJson.criteria.length === 0) {
        errors.push(`Rubric JSON must include at least one criterion.`);
      }
      if (!Array.isArray(rubricJson.levels) || rubricJson.levels.length === 0) {
        errors.push(`Rubric JSON must include at least one level.`);
      }
    } catch {
      errors.push(`Missing rubric JSON file: ${assignment.rubricJsonFile}`);
    }

    const expectedReadmeDate = deliverables.get(normalizedTitle);
    const manifestReadmeDate = formatDateForReadme(
      assignment.dueAt,
      manifest.course.timezone
    );

    if (!expectedReadmeDate) {
      warnings.push("README deliverables table does not contain this assignment title.");
    } else if (expectedReadmeDate !== manifestReadmeDate) {
      errors.push(
        `README due date mismatch: README says ${expectedReadmeDate}, manifest says ${manifestReadmeDate}`
      );
    }

    if (
      assignment.sourceFile !== "Assignments/makeanything.md" &&
      normalizeTitle(sourceTitle) !== normalizedTitle
    ) {
      warnings.push(
        `Source file heading is "${sourceTitle}", which differs from manifest title "${assignment.title}".`
      );
    }

    const effectiveAssignmentType =
      assignment.assignmentTypeOverride ??
      course.selectedAssignmentType ??
      null;
    const action = summarizeAssignmentAction({
      errors,
      rubricMarkdownText,
      gradescopeAssignmentId: assignment.gradescopeAssignmentId
    });

    planItems.push({
      slug: assignment.slug,
      title: assignment.title,
      action,
      gradescopeAssignmentId: assignment.gradescopeAssignmentId,
      effectiveAssignmentType,
      releaseAt: assignment.releaseAt,
      dueAt: assignment.dueAt,
      points: assignment.points ?? manifest.course.defaults?.points ?? 100,
      sourceFile: assignment.sourceFile,
      rubricMarkdownFile: assignment.rubricMarkdownFile,
      rubricJsonFile: assignment.rubricJsonFile,
      errors,
      warnings
    });
  }

  const summary = {
    schemaVersion: manifest.schemaVersion,
    courseAction: course.action,
    resolvedCourseTitle: course.resolvedTitle,
    courseAlreadyExists: course.action === "use-existing",
    courseId: course.gradescopeCourseId,
    timezone: manifest.course.timezone,
    syncReady: course.syncReady && course.errors.length === 0,
    syncBlockedReason:
      course.syncReady && course.errors.length === 0 ? null : course.syncBlockedReason,
    totalAssignments: planItems.length,
    plannedCount: planItems.filter((item) => item.action === "planned").length,
    createCount: planItems.filter((item) => item.action === "create").length,
    updateCount: planItems.filter((item) => item.action === "update").length,
    blockedCount: planItems.filter((item) => item.action === "blocked").length
  };

  return {
    generatedAt: new Date().toISOString(),
    manifestPath: path.relative(rootDir, manifestPath),
    readmeTitle,
    course,
    summary,
    items: planItems
  };
}
