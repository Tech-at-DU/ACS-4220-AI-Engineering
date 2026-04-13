# Instructor Guide

## Table of Contents

1. [Overview](#overview)
1. [Files](#files)
1. [Rubric Exports](#rubric-exports)
1. [Structured Rubric JSON](#structured-rubric-json)
1. [Gradescope Manifest](#gradescope-manifest)
1. [Dry-Run Planner](#dry-run-planner)
1. [Existing Course Mode](#existing-course-mode)
1. [New Course Mode](#new-course-mode)
1. [Tests](#tests)
1. [Current Limits](#current-limits)

## Overview

This repo includes a Node-based Gradescope planning workflow. It does three things today:

1. Exports assignment rubrics from the assignment files.
1. Generates both paste-ready Markdown and structured JSON rubric files.
1. Builds a dry-run Gradescope plan from a checked-in manifest.

The workflow does **not** sync anything to Gradescope yet. That remains intentionally blocked until the assignment type decision is locked.

## Files

1. [automation/gradescope.course.json](automation/gradescope.course.json) is the source of truth for course metadata, due dates, file links, and Gradescope IDs.
1. [Assignments/rubrics](Assignments/rubrics) stores generated rubric exports.
1. [scripts/export-rubrics.mjs](scripts/export-rubrics.mjs) generates rubric exports.
1. [scripts/plan-gradescope-sync.mjs](scripts/plan-gradescope-sync.mjs) builds the dry-run plan.
1. [tests/gradescope-rubrics.test.mjs](tests/gradescope-rubrics.test.mjs), [tests/gradescope-planner.test.mjs](tests/gradescope-planner.test.mjs), and [tests/gradescope-manifest.test.mjs](tests/gradescope-manifest.test.mjs) cover the rubric and planning logic.

## Rubric Exports

Run:

```bash
npm run export:rubrics
```

That command reads each assignment rubric table and writes:

1. `*-rubric.md` for copy/paste into documentation or planning workflows.
1. `*-rubric.json` for machine-readable Gradescope planning and future automation.

The original rubric table remains in each assignment file for students.

## Structured Rubric JSON

Each generated JSON file uses a grid-style shape:

```json
{
  "schemaVersion": 1,
  "rubricType": "performance-level-grid",
  "assignmentTitle": "firstbuild",
  "sourceFile": "Assignments/firstbuild.md",
  "levels": [
    "Needs Improvement",
    "Basic",
    "Proficient",
    "Advanced"
  ],
  "criteria": [
    {
      "title": "Project Setup",
      "ratings": [
        {
          "level": "Needs Improvement",
          "description": "Missing key files or incomplete git history"
        }
      ]
    }
  ]
}
```

This JSON is the machine-readable layer for future UI automation. It exists because Gradescope rubric setup is more structured than a single pasted Markdown block.

## Gradescope Manifest

The manifest in [automation/gradescope.course.json](automation/gradescope.course.json) tracks:

1. Existing course metadata such as `gradescopeCourseId` and timezone.
1. New-course defaults such as `courseNumber`, `term`, `year`, and `school`.
1. The current assignment-type decision state.
1. Every assignment title, due date, and rubric export file.

Keep the manifest in sync with [README.md](README.md). The planner checks for due-date drift against the syllabus deliverables table.

## Dry-Run Planner

Run:

```bash
npm run gradescope:plan
```

This command:

1. Reads the manifest.
1. Reads the syllabus title and deliverables table from [README.md](README.md).
1. Confirms each source assignment exists.
1. Confirms each rubric Markdown and JSON export exists.
1. Verifies due dates against the syllabus.
1. Writes a dry-run plan to [automation/out/gradescope-plan.json](automation/out/gradescope-plan.json).

## Existing Course Mode

The default planner mode assumes the Gradescope course already exists.

In that mode:

1. `gradescopeCourseId` must be present in the manifest.
1. The plan uses the existing course instead of creating a new one.
1. Assignment actions remain `planned` until the assignment type decision is locked.

## New Course Mode

Run:

```bash
npm run gradescope:plan -- --new
```

In `--new` mode:

1. The planner models a new course creation flow.
1. The course title comes from the H1 in [README.md](README.md).
1. The manifest must still provide `courseNumber`, `term`, `year`, and `school`.

This is still planning-only. It does not create a course or sync assignments.

## Tests

Run:

```bash
npm run test:gradescope
```

The test suite covers:

1. Rubric parsing and export formatting.
1. Planner behavior for `--new`.
1. Planner blocking when manifest dates drift from the syllabus.
1. A checked-in manifest smoke test against the repo.

## Current Limits

1. There is no Gradescope sync script in this repo yet.
1. The assignment type is still undecided, so the planner intentionally reports `planned` actions instead of `create` or `update`.
