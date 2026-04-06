import test from "node:test";
import assert from "node:assert/strict";
import {
  buildMarkdownExport,
  buildStructuredRubric,
  parseAssignmentRubric
} from "../scripts/lib/gradescope-rubrics.mjs";

test("parseAssignmentRubric builds a structured rubric from an assignment table", () => {
  const source = `# :rocket: Sample Assignment

## Rubric

| | **Needs Improvement** | **Basic** | **Proficient** | **Advanced** |
|:--|:--|:--|:--|:--|
| **Scope** | Missing work | Partial work | Strong work | Excellent work |
| **Quality** | Broken | Mixed | Solid | Production-ready |
`;

  const rubric = parseAssignmentRubric(
    source,
    "sample-assignment",
    "Assignments/sample-assignment.md"
  );

  assert.ok(rubric);
  assert.equal(rubric.assignmentTitle, "Sample Assignment");
  assert.deepEqual(rubric.levels, [
    "Needs Improvement",
    "Basic",
    "Proficient",
    "Advanced"
  ]);
  assert.equal(rubric.criteria.length, 2);
  assert.equal(rubric.criteria[0].title, "Scope");
  assert.equal(rubric.criteria[0].ratings[2].description, "Strong work");
});

test("buildMarkdownExport keeps bold rubric levels in a fenced Markdown block", () => {
  const rubric = buildStructuredRubric({
    assignmentTitle: "Sample Assignment",
    sourceFile: "Assignments/sample-assignment.md",
    sourceBasename: "sample-assignment.md",
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
  });

  const markdown = buildMarkdownExport(rubric);
  assert.match(markdown, /## Paste-Ready Markdown/);
  assert.match(markdown, /```md/);
  assert.match(markdown, /\*\*Needs Improvement\*\*/);
  assert.match(markdown, /\*\*Advanced\*\*/);
});
