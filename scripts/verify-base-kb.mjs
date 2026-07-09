import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const manifestPath = new URL("../src/data/base-knowledge-manifest.json", import.meta.url);
const PROJECT_ROOT = fileURLToPath(new URL("..", import.meta.url));

if (!existsSync(manifestPath)) {
  throw new Error("Base knowledge manifest not found. Run npm run kb:compile first.");
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const configuredSourceRoot = process.argv[2] || process.env.R_U_OK_STANDARD_MD_ROOT || manifest.sourceRoot;
const sourceRoot = isAbsolute(configuredSourceRoot)
  ? configuredSourceRoot
  : resolve(PROJECT_ROOT, configuredSourceRoot);

if (!existsSync(sourceRoot)) {
  throw new Error(`Base knowledge folder not found: ${sourceRoot}`);
}

const expected = new Map(manifest.documents.map((doc) => [doc.fileName, doc]));
const actualFiles = walk(sourceRoot).filter(isKnowledgeMarkdown).sort();
const actual = new Map(actualFiles.map((file) => [basename(file), file]));
const errors = [];

for (const [fileName, doc] of expected) {
  const file = actual.get(fileName);
  if (!file) {
    errors.push(`missing: ${fileName}`);
    continue;
  }
  const hash = hashFile(file);
  if (hash !== doc.hash) {
    errors.push(`changed: ${fileName} expected ${doc.hash}, got ${hash}`);
  }
}

for (const fileName of actual.keys()) {
  if (!expected.has(fileName)) {
    errors.push(`unexpected: ${fileName}`);
  }
}

if (errors.length > 0) {
  throw new Error(`Base knowledge verification failed:\n${errors.map((error) => `- ${error}`).join("\n")}`);
}

console.log(`Base knowledge OK: ${actual.size} documents match ${manifestPath.pathname}`);

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stats = statSync(path);
    return stats.isDirectory() ? walk(path) : [path];
  });
}

function isKnowledgeMarkdown(file) {
  return file.toLowerCase().endsWith(".md") && basename(file).toLowerCase() !== "readme.md";
}

function hashFile(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 12);
}
