import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../src/data/knowledge-base.json", import.meta.url)));

const required = ["entities", "relations", "auditItems", "findings", "wikiPages"];
for (const key of required) {
  if (!Array.isArray(data[key])) {
    throw new Error(`${key} must be an array`);
  }
}

const ids = new Set(data.entities.map((entity) => entity.id));

for (const entity of data.entities) {
  for (const field of ["id", "type", "title", "summary", "sourceRefs"]) {
    if (entity[field] === undefined) {
      throw new Error(`entity ${entity.id || "<unknown>"} missing ${field}`);
    }
  }
}

for (const relation of data.relations) {
  if (!ids.has(relation.from) || !ids.has(relation.to)) {
    throw new Error(`relation ${relation.id} references an unknown entity`);
  }
}

for (const item of data.auditItems) {
  if (!item.rationale || !Array.isArray(item.evidenceNeeded) || !Array.isArray(item.suggestedChecks)) {
    throw new Error(`audit item ${item.id} is incomplete`);
  }
}

console.log(`Schema OK: ${data.entities.length} entities, ${data.relations.length} relations`);
