import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildGradescopePlan } from "./lib/gradescope-planner.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = path.join(ROOT, "automation", "gradescope.course.json");
const PLAN_OUTPUT_DIR = path.join(ROOT, "automation", "out");
const PLAN_OUTPUT_PATH = path.join(PLAN_OUTPUT_DIR, "gradescope-plan.json");
const createNewCourse = process.argv.includes("--new");
const plan = await buildGradescopePlan({
  rootDir: ROOT,
  manifestPath: MANIFEST_PATH,
  createNewCourse
});

await fs.mkdir(PLAN_OUTPUT_DIR, { recursive: true });
await fs.writeFile(
  PLAN_OUTPUT_PATH,
  `${JSON.stringify(plan, null, 2)}\n`
);

console.log("Gradescope Dry-Run Plan");
console.log(`Course Action: ${plan.summary.courseAction}`);
console.log(`Course Title: ${plan.summary.resolvedCourseTitle}`);
if (plan.course.gradescopeCourseId) {
  console.log(`Course ID: ${plan.course.gradescopeCourseId}`);
}
console.log(`Assignments: ${plan.summary.totalAssignments}`);
console.log(
  `Actions: ${plan.summary.plannedCount} planned, ${plan.summary.createCount} create, ${plan.summary.updateCount} update, ${plan.summary.blockedCount} blocked`
);
console.log(`Sync Ready: ${plan.summary.syncReady ? "yes" : "no"}`);
if (plan.summary.syncBlockedReason) {
  console.log(`Sync Blocked Reason: ${plan.summary.syncBlockedReason}`);
}
console.log("");

for (const error of plan.course.errors) {
  console.log(`Course Error: ${error}`);
}
for (const warning of plan.course.warnings) {
  console.log(`Course Warning: ${warning}`);
}
if (plan.course.errors.length > 0 || plan.course.warnings.length > 0) {
  console.log("");
}

for (const item of plan.items) {
  console.log(`[${item.action.toUpperCase()}] ${item.title}`);
  console.log(`  slug: ${item.slug}`);
  console.log(`  type: ${item.effectiveAssignmentType ?? "undecided"}`);
  console.log(`  release: ${item.releaseAt}`);
  console.log(`  due: ${item.dueAt}`);
  console.log(`  source: ${item.sourceFile}`);
  console.log(`  rubric Markdown: ${item.rubricMarkdownFile}`);
  console.log(`  rubric JSON: ${item.rubricJsonFile}`);
  if (item.gradescopeAssignmentId) {
    console.log(`  gradescopeAssignmentId: ${item.gradescopeAssignmentId}`);
  }
  for (const warning of item.warnings) {
    console.log(`  warning: ${warning}`);
  }
  for (const error of item.errors) {
    console.log(`  error: ${error}`);
  }
  console.log("");
}

console.log(`Wrote ${path.relative(ROOT, PLAN_OUTPUT_PATH)}`);

if (plan.summary.blockedCount > 0 || plan.course.errors.length > 0) {
  process.exitCode = 1;
}
