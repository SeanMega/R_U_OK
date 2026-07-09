import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../src/data/knowledge-base.json", import.meta.url)));

const required = ["entities", "relations", "auditItems", "findings", "wikiPages", "projectFiles", "evidenceRecords"];
for (const key of required) {
  if (!Array.isArray(data[key])) {
    throw new Error(`${key} must be an array`);
  }
}

const ids = new Set(data.entities.map((entity) => entity.id));
const projectFileIds = new Set(data.projectFiles.map((file) => file.id));

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

for (const file of data.projectFiles) {
  for (const field of ["id", "name", "path", "kind", "function", "status", "linkedEvidence"]) {
    if (file[field] === undefined) {
      throw new Error(`project file ${file.id || "<unknown>"} missing ${field}`);
    }
  }
}

for (const record of data.evidenceRecords) {
  for (const field of ["id", "title", "sourceFile", "evidenceType", "coverage", "confidence", "linkedEntities", "gaps", "suggestedActions"]) {
    if (record[field] === undefined) {
      throw new Error(`evidence record ${record.id || "<unknown>"} missing ${field}`);
    }
  }
  if (!projectFileIds.has(record.sourceFile)) {
    throw new Error(`evidence record ${record.id} references unknown project file ${record.sourceFile}`);
  }
  for (const entityId of record.linkedEntities) {
    if (!ids.has(entityId)) {
      throw new Error(`evidence record ${record.id} references unknown entity ${entityId}`);
    }
  }
}

console.log(
  `Schema OK: ${data.entities.length} entities, ${data.relations.length} relations, ${data.projectFiles.length} project files, ${data.evidenceRecords.length} evidence records`
);
