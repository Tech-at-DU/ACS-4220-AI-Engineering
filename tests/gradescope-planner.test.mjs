import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { buildGradescopePlan } from "../scripts/lib/gradescope-planner.mjs";

async function withTempRepo(run) {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "gradescope-plan-"));
  try {
    await fs.mkdir(path.join(rootDir, "Assignments", "rubrics"), { recursive: true });
    await fs.mkdir(path.join(rootDir, "automation"), { recursive: true });
    await fs.writeFile(
      path.join(rootDir, "README.md"),
      `# Demo Course Title

## Schedule

### Deliverables

📚 Assignment | 🔗 Criteria | 📆 Due Date
:-- | --- | ---
**[Sample Assignment](Assignments/sample-assignment.md)** | [Requirements](Assignments/sample-assignment.md) | March 30, 2026 _(Monday)_

## Evaluation
`,
      "utf8"
    );
    await fs.writeFile(
      path.join(rootDir, "Assignments", "sample-assignment.md"),
      `# Sample Assignment

## Rubric

| | **Needs Improvement** | **Basic** | **Proficient** | **Advanced** |
|:--|:--|:--|:--|:--|
| **Scope** | Missing work | Partial work | Strong work | Excellent work |
`,
      "utf8"
    );
    await fs.writeFile(
      path.join(rootDir, "Assignments", "rubrics", "sample-assignment-rubric.md"),
      `# Sample Assignment Rubric

## Paste-Ready Markdown

\`\`\`md
## Scope

- **Needs Improvement**: Missing work
- **Basic**: Partial work
- **Proficient**: Strong work
- **Advanced**: Excellent work
\`\`\`
`,
      "utf8"
    );
    await fs.writeFile(
      path.join(rootDir, "Assignments", "rubrics", "sample-assignment-rubric.json"),
      `${JSON.stringify(
        {
          schemaVersion: 1,
          rubricType: "performance-level-grid",
          assignmentTitle: "Sample Assignment",
          sourceFile: "Assignments/sample-assignment.md",
          sourceBasename: "sample-assignment.md",
          levelCount: 4,
          criterionCount: 1,
          levels: ["Needs Improvement", "Basic", "Proficient", "Advanced"],
          criteria: [
            {
              title: "Scope",
              ratings: [
                { level: "Needs Improvement", description: "Missing work" },
                { level: "Basic", description: "Partial work" },
                { level: "Proficient", description: "Strong work" },
                { level: "Advanced", description: "Excellent work" }
              ]
            }
          ]
        },
        null,
        2
      )}\n`,
      "utf8"
    );

    await run(rootDir);
  } finally {
    await fs.rm(rootDir, { recursive: true, force: true });
  }
}

test("buildGradescopePlan uses the README title when planning a new course", async () => {
  await withTempRepo(async (rootDir) => {
    const manifest = {
      schemaVersion: 1,
      course: {
        mode: "existing",
        gradescopeCourseId: "1293005",
        gradescopeCourseUrl: "https://www.gradescope.com/courses/1293005",
        readmeTitleFile: "README.md",
        timezone: "America/Los_Angeles",
        creationDefaults: {
          courseNumber: "ACS 4220",
          courseName: null,
          term: "Spring",
          year: 2026,
          school: "Dominican University of California",
          useReadmeTitleWhenNew: true
        },
        assignmentTypeDecision: {
          choiceLocked: false,
          selectedType: null,
          candidateTypes: ["Homework / Problem Set", "Online Assignment"],
          blockedReason: "Do not implement Gradescope sync until the assignment type is locked."
        },
        defaults: {
          points: 100
        }
      },
      assignments: [
        {
          slug: "sample-assignment",
          title: "Sample Assignment",
          assignmentTypeOverride: null,
          releaseAt: "2026-03-23T08:00:00-07:00",
          dueAt: "2026-03-30T23:59:00-07:00",
          points: 100,
          sourceFile: "Assignments/sample-assignment.md",
          rubricMarkdownFile: "Assignments/rubrics/sample-assignment-rubric.md",
          rubricJsonFile: "Assignments/rubrics/sample-assignment-rubric.json",
          gradescopeAssignmentId: null
        }
      ]
    };

    const manifestPath = path.join(rootDir, "automation", "gradescope.course.json");
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

    const plan = await buildGradescopePlan({
      rootDir,
      manifestPath,
      createNewCourse: true
    });

    assert.equal(plan.summary.courseAction, "create");
    assert.equal(plan.summary.resolvedCourseTitle, "Demo Course Title");
    assert.equal(plan.summary.syncReady, false);
    assert.equal(plan.summary.plannedCount, 1);
    assert.equal(plan.items[0].action, "planned");
  });
});

test("buildGradescopePlan blocks items when README due dates drift from the manifest", async () => {
  await withTempRepo(async (rootDir) => {
    const manifest = {
      schemaVersion: 1,
      course: {
        mode: "existing",
        gradescopeCourseId: "1293005",
        gradescopeCourseUrl: "https://www.gradescope.com/courses/1293005",
        readmeTitleFile: "README.md",
        timezone: "America/Los_Angeles",
        creationDefaults: {
          courseNumber: "ACS 4220",
          courseName: null,
          term: "Spring",
          year: 2026,
          school: "Dominican University of California",
          useReadmeTitleWhenNew: true
        },
        assignmentTypeDecision: {
          choiceLocked: true,
          selectedType: "Homework / Problem Set",
          candidateTypes: ["Homework / Problem Set", "Online Assignment"],
          blockedReason: "Do not implement Gradescope sync until the assignment type is locked."
        },
        defaults: {
          points: 100
        }
      },
      assignments: [
        {
          slug: "sample-assignment",
          title: "Sample Assignment",
          assignmentTypeOverride: null,
          releaseAt: "2026-03-23T08:00:00-07:00",
          dueAt: "2026-04-01T23:59:00-07:00",
          points: 100,
          sourceFile: "Assignments/sample-assignment.md",
          rubricMarkdownFile: "Assignments/rubrics/sample-assignment-rubric.md",
          rubricJsonFile: "Assignments/rubrics/sample-assignment-rubric.json",
          gradescopeAssignmentId: null
        }
      ]
    };

    const manifestPath = path.join(rootDir, "automation", "gradescope.course.json");
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

    const plan = await buildGradescopePlan({
      rootDir,
      manifestPath,
      createNewCourse: false
    });

    assert.equal(plan.summary.blockedCount, 1);
    assert.equal(plan.items[0].action, "blocked");
    assert.match(
      plan.items[0].errors.join("\n"),
      /README due date mismatch/
    );
  });
});
