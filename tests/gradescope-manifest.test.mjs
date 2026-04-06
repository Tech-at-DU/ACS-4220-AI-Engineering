import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildGradescopePlan } from "../scripts/lib/gradescope-planner.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("the checked-in Gradescope manifest builds a clean dry-run plan", async () => {
  const plan = await buildGradescopePlan({
    rootDir: ROOT,
    createNewCourse: false
  });

  assert.equal(plan.summary.blockedCount, 0);
  assert.equal(plan.summary.syncReady, false);
  assert.equal(plan.summary.plannedCount, plan.items.length);
  assert.equal(plan.items.length, 8);
  assert.ok(
    plan.items.every(
      (item) =>
        item.rubricMarkdownFile.endsWith(".md") &&
        item.rubricJsonFile.endsWith(".json")
    )
  );
});
