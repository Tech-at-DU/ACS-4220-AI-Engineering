import path from "node:path";
import { fileURLToPath } from "node:url";
import { exportRubrics } from "./lib/gradescope-rubrics.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rawOutDir = process.env.RUBRIC_OUT_DIR ?? "Assignments/rubrics";
const OUT_DIR = path.isAbsolute(rawOutDir)
  ? rawOutDir
  : path.join(ROOT, rawOutDir);

await exportRubrics({
  rootDir: ROOT,
  outDir: OUT_DIR
});
