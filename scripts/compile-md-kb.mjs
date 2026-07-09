import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const DEFAULT_SOURCE_ROOT = "/Users/sean/Downloads/Knowladge base/standard/markdown";
const sourceRoot = process.argv[2] || process.env.R_U_OK_STANDARD_MD_ROOT || DEFAULT_SOURCE_ROOT;
const outputPath = new URL("../src/data/standard-index.json", import.meta.url);

if (!existsSync(sourceRoot)) {
  throw new Error(`Markdown knowledge base folder not found: ${sourceRoot}`);
}

const files = walk(sourceRoot).filter((file) => file.toLowerCase().endsWith(".md")).sort();
const documents = files.map((file) => compileDocument(file));
const domains = summarizeDomains(documents);
const requirementSignals = summarizeSignals(documents);

const index = {
  generatedAt: new Date().toISOString(),
  sourceRoot,
  strategy: "llm-wiki-ready-standard-index",
  copyrightBoundary:
    "This index stores metadata, heading signals, tags, and derived review prompts only. It intentionally avoids copying standard body text.",
  totalDocuments: documents.length,
  domains,
  requirementSignals,
  documents
};

mkdirSync(new URL("../src/data", import.meta.url), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(index, null, 2)}\n`);
console.log(`Compiled ${documents.length} markdown standards into ${outputPath.pathname}`);

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stats = statSync(path);
    return stats.isDirectory() ? walk(path) : [path];
  });
}

function compileDocument(file) {
  const text = readFileSync(file, "utf8");
  const fileName = basename(file);
  const id = fileName.replace(/\.md$/i, "").replace(/\s+/g, "-");
  const hash = createHash("sha256").update(text).digest("hex").slice(0, 12);
  const headings = extractHeadings(text);
  const title = headings[0]?.text || fileName.replace(/\.md$/i, "");
  const keywordText = `${fileName}\n${headings.map((heading) => heading.text).join("\n")}`;
  const domains = inferDomains(keywordText);
  const requirementSignals = inferRequirementSignals(keywordText);
  const candidateEntities = inferCandidateEntities(keywordText);

  return {
    id,
    fileName,
    sourcePath: file,
    hash,
    title: normalizeWhitespace(title),
    language: detectLanguage(text),
    sizeKb: Math.round(Buffer.byteLength(text, "utf8") / 1024),
    headingCount: headings.length,
    topHeadings: headings.slice(0, 18),
    domains,
    requirementSignals,
    candidateEntities,
    reviewPrompts: buildReviewPrompts(domains, requirementSignals, candidateEntities),
    readinessScore: scoreDocument({ headings, domains, requirementSignals, candidateEntities }),
    wikiSeed: buildWikiSeed(id, domains)
  };
}

function extractHeadings(text) {
  const lines = text.split(/\r?\n/);
  const headings = [];
  for (const line of lines) {
    const hashHeading = line.match(/^(#{1,4})\s+(.+)$/);
    if (hashHeading) {
      const clean = cleanHeading(hashHeading[2]);
      if (isUsefulHeading(clean)) {
        headings.push({ level: hashHeading[1].length, text: clean });
      }
      continue;
    }

    const numberedHeading = line.match(/^((?:\d+\.){0,3}\d+)\s+(.{2,120})$/);
    if (numberedHeading) {
      const clean = cleanHeading(`${numberedHeading[1]} ${numberedHeading[2]}`);
      if (isUsefulHeading(clean)) {
        headings.push({ level: numberedHeading[1].split(".").length, text: clean });
      }
    }
  }

  return dedupeHeadings(headings).slice(0, 120);
}

function cleanHeading(value) {
  return normalizeWhitespace(
    value
      .replace(/!\[[^\]]*]\([^)]+\)/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/[#*_`]/g, "")
      .replace(/\s+\.{2,}\s*\d*$/g, "")
  );
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function isUsefulHeading(value) {
  if (!value) return false;
  if (value.length < 3 || value.length > 160) return false;
  if (/^(page|contents|目\s*次|copyright protected document)$/i.test(value)) return false;
  if (/^(foreword|前言|introduction|引言)$/i.test(value)) return true;
  return /[A-Za-z\u4e00-\u9fa5]/.test(value);
}

function dedupeHeadings(headings) {
  const seen = new Set();
  const result = [];
  for (const heading of headings) {
    const key = heading.text.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(heading);
    }
  }
  return result;
}

function detectLanguage(text) {
  const sample = text.slice(0, 8000);
  const chineseChars = (sample.match(/[\u4e00-\u9fa5]/g) || []).length;
  const latinChars = (sample.match(/[A-Za-z]/g) || []).length;
  if (chineseChars > latinChars * 0.35) return "zh";
  return "en";
}

function inferDomains(text) {
  const rules = [
    ["quality_system", /13485|42061|0287|质量管理|quality management/i],
    ["risk_management", /14971|0316|risk management|风险管理/i],
    ["biocompatibility", /16886|biological evaluation|生物学评价/i],
    ["electrical_safety", /9706|60601|electrical|电气|医用电气/i],
    ["sterilization", /18279|18280|灭菌|sterilization|ethylene oxide|radiation/i],
    ["ivd_equipment", /生化分析仪|发光免疫|in vitro|ivd|分析仪/i],
    ["sampling_inspection", /2828|sampling|抽样/i],
    ["supplier_material", /supplier|采购|材料|物料|purchasing/i]
  ];
  return rules.filter(([, pattern]) => pattern.test(text)).map(([domain]) => domain);
}

function inferCandidateEntities(text) {
  const entities = [];
  const add = (type, title, evidencePattern) => {
    if (evidencePattern.test(text)) entities.push({ type, title });
  };
  add("clause", "质量管理体系要求", /quality management|质量管理|13485|42061/i);
  add("clause", "风险管理过程要求", /risk management|风险管理|14971|0316/i);
  add("obligation", "设计开发与追溯义务", /design and development|设计和开发|traceability|追溯/i);
  add("obligation", "生产和上市后信息收集义务", /post-production|上市后|生产后|information collection/i);
  add("evaluation_topic", "生物学评价主题", /biological evaluation|生物学评价|16886/i);
  add("process_requirement", "灭菌过程确认要求", /sterilization|灭菌|18279|18280/i);
  add("safety_performance_topic", "电气安全与基本性能主题", /electrical|电气|9706|60601/i);
  add("control", "风险管理文件与评审控制", /risk management file|风险管理文档|risk management review|风险管理评审/i);
  add("control", "采购与供应商控制", /purchasing|采购|supplier|供应商/i);
  return entities;
}

function inferRequirementSignals(text) {
  const rules = [
    ["document_control", /document control|control of documents|文件控制|记录控制/i],
    ["design_control", /design and development|设计和开发|设计开发/i],
    ["risk_file", /risk management file|风险管理文档|风险管理文件/i],
    ["verification_validation", /verification|validation|验证|确认/i],
    ["post_market", /post-production|上市后|生产后|信息收集/i],
    ["supplier_control", /purchasing|supplier|采购|供应商/i],
    ["sterilization_validation", /sterilization|灭菌|sterile barrier|无菌屏障/i],
    ["biological_evaluation", /biological evaluation|生物学评价|毒性|刺激|致敏/i],
    ["electrical_safety", /electrical safety|basic safety|essential performance|电气安全|基本性能/i],
    ["sampling_plan", /sampling|AQL|抽样|接收质量限/i],
    ["training_competence", /competence|training|能力|培训/i],
    ["capa_feedback", /corrective action|preventive action|CAPA|纠正|预防/i]
  ];
  return rules.filter(([, pattern]) => pattern.test(text)).map(([signal]) => signal);
}

function buildReviewPrompts(domains, signals, entities) {
  const prompts = [];
  const add = (condition, prompt) => {
    if (condition) prompts.push(prompt);
  };

  add(domains.includes("quality_system"), "确认该标准与质量手册、程序文件、记录控制和管理评审的覆盖关系。");
  add(domains.includes("risk_management"), "检查风险管理计划、风险分析、风险控制、剩余风险评价和风险管理报告是否形成闭环。");
  add(domains.includes("biocompatibility"), "核对生物学评价项目选择、样品代表性、测试报告和毒理学评价依据是否可追溯。");
  add(domains.includes("sterilization"), "核对灭菌过程开发、确认、常规监视和放行记录是否支持无菌状态声明。");
  add(domains.includes("electrical_safety"), "确认基本安全和基本性能要求是否映射到型式试验、风险控制和说明书警示。");
  add(signals.includes("supplier_control"), "确认采购信息、供应商资质、质量协议和来料检验策略是否与物料重要度匹配。");
  add(signals.includes("post_market"), "确认生产和上市后信息是否进入风险管理和 CAPA 触发机制。");
  add(entities.some((entity) => entity.type === "control"), "将控制措施映射到 evidence_needed，避免只有要求没有证据。");

  return prompts.slice(0, 5);
}

function scoreDocument({ headings, domains, requirementSignals, candidateEntities }) {
  let score = 35;
  score += Math.min(headings.length, 80) * 0.35;
  score += Math.min(domains.length, 4) * 8;
  score += Math.min(requirementSignals.length, 8) * 5;
  score += Math.min(candidateEntities.length, 6) * 4;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function buildWikiSeed(id, domains) {
  const primaryDomain = domains[0] || "general_standard";
  return {
    pageId: `WIKI-${id}`,
    recommendedPath: `readonly/wiki/${primaryDomain}/${id}.md`,
    tags: domains
  };
}

function summarizeDomains(documents) {
  const counts = {};
  for (const doc of documents) {
    for (const domain of doc.domains) {
      counts[domain] = (counts[domain] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count);
}

function summarizeSignals(documents) {
  const counts = {};
  for (const doc of documents) {
    for (const signal of doc.requirementSignals) {
      counts[signal] = (counts[signal] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([signal, count]) => ({ signal, count }))
    .sort((a, b) => b.count - a.count);
}
