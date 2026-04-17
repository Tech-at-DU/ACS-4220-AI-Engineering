import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, cpSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const REPO_ROOT = "/home/runner/work/ACS-4220-AI-Engineering/ACS-4220-AI-Engineering";
const SCRIPT_SOURCE = path.join(REPO_ROOT, "scripts", "generate-llms-artifacts.py");

test("generate-llms-artifacts uses tracked markdown files only", () => {
  const tempRoot = mkdtempSync(path.join(tmpdir(), "llms-artifacts-"));
  const tempRepo = path.join(tempRoot, "repo");

  mkdirSync(tempRepo, { recursive: true });
  mkdirSync(path.join(tempRepo, "scripts"), { recursive: true });
  mkdirSync(path.join(tempRepo, ".claude"), { recursive: true });
  mkdirSync(path.join(tempRepo, "Lessons"), { recursive: true });
  mkdirSync(path.join(tempRepo, "node_modules", "demo"), { recursive: true });
  mkdirSync(path.join(tempRepo, "automation", "out"), { recursive: true });

  cpSync(SCRIPT_SOURCE, path.join(tempRepo, "scripts", "generate-llms-artifacts.py"));

  writeFileSync(
    path.join(tempRepo, ".gitignore"),
    "node_modules/\nautomation/out/\n",
    "utf8",
  );
  writeFileSync(path.join(tempRepo, "README.md"), "# Course Home\n", "utf8");
  writeFileSync(path.join(tempRepo, ".claude", "CLAUDE.md"), "# Repo Rules\n", "utf8");
  writeFileSync(path.join(tempRepo, "Lessons", "week-1.md"), "# Week 1\n", "utf8");
  writeFileSync(
    path.join(tempRepo, "node_modules", "demo", "ignored.md"),
    "# Ignored dependency markdown\n",
    "utf8",
  );
  writeFileSync(
    path.join(tempRepo, "automation", "out", "ignored.md"),
    "# Generated automation markdown\n",
    "utf8",
  );

  execFileSync("git", ["init"], { cwd: tempRepo, stdio: "pipe" });
  execFileSync("git", ["add", ".gitignore", "README.md", ".claude/CLAUDE.md", "Lessons/week-1.md"], {
    cwd: tempRepo,
    stdio: "pipe",
  });

  execFileSync("python3", [path.join(tempRepo, "scripts", "generate-llms-artifacts.py")], {
    cwd: tempRepo,
    stdio: "pipe",
  });

  const sitemap = readFileSync(path.join(tempRepo, "SITEMAP.md"), "utf8");
  const llms = readFileSync(path.join(tempRepo, "llms.txt"), "utf8");
  const full = readFileSync(path.join(tempRepo, "llms-full.txt"), "utf8");

  assert.match(sitemap, /## \.claude/);
  assert.match(sitemap, /\.claude\/CLAUDE\.md/);
  assert.doesNotMatch(sitemap, /node_modules\/demo\/ignored\.md/);
  assert.doesNotMatch(sitemap, /automation\/out\/ignored\.md/);

  assert.match(llms, /## \.claude/);
  assert.match(llms, /\.claude\/CLAUDE\.md/);
  assert.doesNotMatch(llms, /node_modules\/demo\/ignored\.md/);
  assert.doesNotMatch(llms, /automation\/out\/ignored\.md/);

  assert.match(full, /FILE: README\.md/);
  assert.match(full, /FILE: \.claude\/CLAUDE\.md/);
  assert.match(full, /FILE: Lessons\/week-1\.md/);
  assert.doesNotMatch(full, /Ignored dependency markdown/);
  assert.doesNotMatch(full, /Generated automation markdown/);
});
