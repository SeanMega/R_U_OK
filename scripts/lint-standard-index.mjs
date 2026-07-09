import { readFileSync } from "node:fs";

const index = JSON.parse(readFileSync(new URL("../src/data/standard-index.json", import.meta.url)));

if (!Array.isArray(index.documents) || index.documents.length === 0) {
  throw new Error("standard index must include documents");
}

if (!Array.isArray(index.domains) || index.domains.length === 0) {
  throw new Error("standard index must include domain summaries");
}

if (!Array.isArray(index.requirementSignals) || index.requirementSignals.length === 0) {
  throw new Error("standard index must include requirement signal summaries");
}

for (const doc of index.documents) {
  for (const field of ["id", "fileName", "sourcePath", "hash", "title", "language", "wikiSeed"]) {
    if (doc[field] === undefined) {
      throw new Error(`${doc.id || "<unknown>"} missing ${field}`);
    }
  }
  if (!Array.isArray(doc.topHeadings) || doc.topHeadings.length === 0) {
    throw new Error(`${doc.id} must include heading signals`);
  }
  if (!Array.isArray(doc.domains)) {
    throw new Error(`${doc.id} domains must be an array`);
  }
  if (!Array.isArray(doc.requirementSignals)) {
    throw new Error(`${doc.id} requirementSignals must be an array`);
  }
  if (!Array.isArray(doc.candidateEntities)) {
    throw new Error(`${doc.id} candidateEntities must be an array`);
  }
  for (const entity of doc.candidateEntities) {
    if (entity.type === "risk" || entity.type === "gap") {
      throw new Error(`${doc.id} standard candidate entity must be neutral, got ${entity.type}`);
    }
  }
  if (!Number.isInteger(doc.readinessScore) || doc.readinessScore < 0 || doc.readinessScore > 100) {
    throw new Error(`${doc.id} readinessScore must be 0-100`);
  }
}

const withSignals = index.documents.filter((doc) => doc.requirementSignals.length > 0).length;
const withEntities = index.documents.filter((doc) => doc.candidateEntities.length > 0).length;
console.log(
  `Standard index OK: ${index.documents.length} docs, ${index.domains.length} domains, ${index.requirementSignals.length} signals, ${withSignals} docs with signals, ${withEntities} docs with entity seeds`
);
