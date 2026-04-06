import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function runCommand(command, args, outputDir) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    env: { ...process.env, RUBRIC_OUT_DIR: outputDir },
    encoding: "utf8",
  });

  if (result.status !== 0) {
    const stdout = result.stdout?.trim() ?? "";
    const stderr = result.stderr?.trim() ?? "";
    throw new Error(
      [
        `Command failed: ${command} ${args.join(" ")}`,
        stdout && `stdout:\n${stdout}`,
        stderr && `stderr:\n${stderr}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    );
  }
}

async function listFiles(dir) {
  return (await fs.readdir(dir))
    .filter((name) => name.endsWith(".md"))
    .sort();
}

async function compareDirectories(leftDir, rightDir) {
  const leftFiles = await listFiles(leftDir);
  const rightFiles = await listFiles(rightDir);
  const diffs = [];

  if (JSON.stringify(leftFiles) !== JSON.stringify(rightFiles)) {
    diffs.push("File sets differ.");
    diffs.push(`Python: ${leftFiles.join(", ") || "(none)"}`);
    diffs.push(`Node: ${rightFiles.join(", ") || "(none)"}`);
    return diffs;
  }

  for (const name of leftFiles) {
    const left = await fs.readFile(path.join(leftDir, name), "utf8");
    const right = await fs.readFile(path.join(rightDir, name), "utf8");
    if (left !== right) {
      diffs.push(`Content mismatch: ${name}`);
    }
  }

  return diffs;
}

const pythonDir = await fs.mkdtemp(path.join(os.tmpdir(), "rubric-python-"));
const nodeDir = await fs.mkdtemp(path.join(os.tmpdir(), "rubric-node-"));

try {
  runCommand("python3", ["scripts/export_rubrics.py"], pythonDir);
  runCommand(process.execPath, ["scripts/export-rubrics.mjs"], nodeDir);

  const diffs = await compareDirectories(pythonDir, nodeDir);
  if (diffs.length > 0) {
    console.error("Rubric exporter parity check failed.");
    for (const diff of diffs) {
      console.error(diff);
    }
    process.exitCode = 1;
  } else {
    const files = await listFiles(nodeDir);
    console.log(`Rubric exporter parity check passed for ${files.length} file(s).`);
  }
} finally {
  await fs.rm(pythonDir, { recursive: true, force: true });
  await fs.rm(nodeDir, { recursive: true, force: true });
}
