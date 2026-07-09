import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  Archive,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileSearch,
  FileText,
  GitFork,
  LayoutDashboard,
  ListChecks,
  Lock,
  MessageSquareText,
  Network,
  Search,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import data from "./data/knowledge-base.json";
import standardIndexData from "./data/standard-index.json";
import "./styles.css";

type EntityType = "clause" | "obligation" | "risk" | "control" | "evidence";
type Severity = "critical" | "high" | "medium" | "low";

type Source = {
  id: string;
  title: string;
  kind: string;
  path: string;
};

type Entity = {
  id: string;
  type: EntityType;
  title: string;
  summary: string;
  severity: Severity;
  sourceRefs: string[];
};

type Relation = {
  id: string;
  from: string;
  to: string;
  type: string;
};

type Finding = {
  id: string;
  findingType: string;
  sourceFunction: string;
  sourceEvent: string;
  findingDate: string;
  status: string;
  description: string;
  relatedRisks: string[];
  relatedControls: string[];
  affectedFunctions: string[];
  recurrenceSignal: string;
  evidenceRefs: string[];
  owner: string;
  dueDate: string;
};

type AuditItem = {
  id: string;
  auditCycle: string;
  auditScope: string;
  priority: Severity;
  status: string;
  rationale: string;
  targetFunctions: string[];
  sourceFindings: string[];
  sourceRisks: string[];
  sourceControls: string[];
  sourceClauses: string[];
  suggestedChecks: string[];
  evidenceNeeded: string[];
  owner: string;
  dueDate: string;
};

type WikiPage = {
  id: string;
  title: string;
  entityRefs: string[];
  summary: string;
  sourceRefs: string[];
};

type KnowledgeBase = {
  version: string;
  workspace: { id: string; name: string; mode: string; boundary: string };
  sources: Source[];
  entities: Entity[];
  relations: Relation[];
  findings: Finding[];
  auditItems: AuditItem[];
  wikiPages: WikiPage[];
};

type StandardDocument = {
  id: string;
  fileName: string;
  hash: string;
  title: string;
  language: string;
  sizeKb: number;
  headingCount: number;
  topHeadings: Array<{ level: number; text: string }>;
  domains: string[];
  requirementSignals: string[];
  candidateEntities: Array<{ type: string; title: string }>;
  reviewPrompts: string[];
  readinessScore: number;
  wikiSeed: { pageId: string; recommendedPath: string; tags: string[] };
};

type StandardIndex = {
  generatedAt: string;
  sourceRoot: string;
  strategy: string;
  copyrightBoundary: string;
  totalDocuments: number;
  domains: Array<{ domain: string; count: number }>;
  requirementSignals: Array<{ signal: string; count: number }>;
  documents: StandardDocument[];
};

const kb = data as KnowledgeBase;
const standardIndex = standardIndexData as StandardIndex;

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "standards", label: "Standards", icon: FileText },
  { id: "readiness", label: "Readiness", icon: ListChecks },
  { id: "graph", label: "Graph", icon: Network },
  { id: "kanban", label: "Kanban", icon: ClipboardList },
  { id: "chat", label: "Chat", icon: MessageSquareText }
] as const;

type NavId = (typeof navItems)[number]["id"];

const typeLabel: Record<EntityType, string> = {
  clause: "Clause",
  obligation: "Obligation",
  risk: "Risk",
  control: "Control",
  evidence: "Evidence"
};

const severityLabel: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low"
};

const readinessScenarios = [
  {
    id: "rd-verification",
    label: "R&D verification",
    owner: "R&D Reviewer",
    functions: ["R&D", "QA", "RA"],
    focusSignals: ["design_control", "verification_validation", "risk_file"],
    evidence: ["追溯矩阵", "验证/确认报告", "原始测试记录", "偏差处理记录", "风险管理文件"]
  },
  {
    id: "qa-capa",
    label: "QA CAPA readiness",
    owner: "QA Lead",
    functions: ["QA", "Manufacturing"],
    focusSignals: ["capa_feedback", "post_market", "training_competence"],
    evidence: ["CAPA 台账", "根因分析记录", "有效性确认记录", "趋势分析", "培训记录"]
  },
  {
    id: "ra-submission",
    label: "RA submission",
    owner: "RA Owner",
    functions: ["RA", "R&D", "QA"],
    focusSignals: ["verification_validation", "risk_file", "biological_evaluation", "electrical_safety"],
    evidence: ["注册资料清单", "claims 对照表", "检测报告", "风险管理报告", "说明书与标签"]
  },
  {
    id: "supplier-change",
    label: "Supplier change",
    owner: "Supplier Quality",
    functions: ["Supplier Quality", "QA", "Manufacturing"],
    focusSignals: ["supplier_control", "verification_validation", "sampling_plan"],
    evidence: ["供应商资质", "质量协议", "来料检验记录", "变更影响评估", "CoA/CoC"]
  }
] as const;

function App() {
  const [active, setActive] = useState<NavId>("dashboard");
  const [selectedEntityId, setSelectedEntityId] = useState("RSK-TRACE-GAP");
  const [selectedStandardId, setSelectedStandardId] = useState("ISO13485-2016(E)");
  const entityMap = useMemo(() => new Map(kb.entities.map((entity) => [entity.id, entity])), []);
  const sourceMap = useMemo(() => new Map(kb.sources.map((source) => [source.id, source])), []);
  const selectedEntity = entityMap.get(selectedEntityId) ?? kb.entities[0];
  const selectedStandard =
    standardIndex.documents.find((doc) => doc.id === selectedStandardId) ??
    standardIndex.documents.find((doc) => doc.domains.includes("quality_system")) ??
    standardIndex.documents[0];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">R</div>
          <div>
            <strong>R_U_OK</strong>
            <span>问己合规，预见风险</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="Demo navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={active === item.id ? "nav-item active" : "nav-item"}
                onClick={() => setActive(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="boundary-panel">
          <Lock size={18} />
          <p>{kb.workspace.boundary}</p>
        </div>
      </aside>

      <section className="main-panel">
        <Header />
        {active === "dashboard" && <Dashboard entityMap={entityMap} sourceMap={sourceMap} setActive={setActive} />}
        {active === "standards" && (
          <Standards selectedStandard={selectedStandard} setSelectedStandardId={setSelectedStandardId} />
        )}
        {active === "readiness" && <Readiness selectedStandard={selectedStandard} />}
        {active === "graph" && (
          <GraphView
            entityMap={entityMap}
            sourceMap={sourceMap}
            selectedEntity={selectedEntity}
            setSelectedEntityId={setSelectedEntityId}
          />
        )}
        {active === "kanban" && <Kanban entityMap={entityMap} />}
        {active === "chat" && <Chat entityMap={entityMap} sourceMap={sourceMap} />}
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Local compliance readiness agent · {kb.version}</p>
        <h1>{kb.workspace.name}</h1>
      </div>
      <div className="status-row">
        <span><ShieldCheck size={16} /> 基础库只读</span>
        <span><Archive size={16} /> 本地样例数据</span>
      </div>
    </header>
  );
}

function Dashboard({
  entityMap,
  sourceMap,
  setActive
}: {
  entityMap: Map<string, Entity>;
  sourceMap: Map<string, Source>;
  setActive: (active: NavId) => void;
}) {
  const counts = countBy(kb.entities, "type");
  const criticalRisks = kb.entities.filter((entity) => entity.type === "risk" && entity.severity === "critical");

  return (
    <div className="page-grid">
      <section className="hero-strip">
        <div>
          <p className="eyebrow">MVP demo path</p>
          <h2>要求、证据、风险、计划，一条链路讲清楚。</h2>
          <p>
            R_U_OK 将只读基础要求和项目样例资料编译成 LLM wiki，再通过图谱和看板给出自查计划候选。
          </p>
        </div>
        <div className="hero-actions">
          <button className="primary-action" onClick={() => setActive("readiness")}>
            <ListChecks size={18} />
            Build readiness plan
          </button>
          <button className="primary-action alt" onClick={() => setActive("chat")}>
            <MessageSquareText size={18} />
            Ask readiness question
          </button>
        </div>
      </section>

      <section className="metric-grid">
        <Metric icon={BookOpen} label="Wiki pages" value={kb.wikiPages.length} tone="ink" />
        <Metric icon={GitFork} label="Typed relations" value={kb.relations.length} tone="teal" />
        <Metric icon={AlertTriangle} label="Risk signals" value={kb.findings.length} tone="red" />
        <Metric icon={Archive} label="Standard docs" value={standardIndex.totalDocuments} tone="gold" />
      </section>

      <section className="dashboard-columns">
        <div className="panel">
          <div className="panel-heading">
            <h3>知识库实体</h3>
            <span>readonly base + workspace</span>
          </div>
          <div className="entity-bars">
            {Object.entries(typeLabel).map(([type, label]) => (
              <div className="entity-bar" key={type}>
                <span>{label}</span>
                <div><i style={{ width: `${((counts[type] ?? 0) / kb.entities.length) * 100}%` }} /></div>
                <strong>{counts[type] ?? 0}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h3>近期风险焦点</h3>
            <span>for human review</span>
          </div>
          <div className="risk-list">
            {[...criticalRisks, ...kb.entities.filter((entity) => entity.type === "risk" && entity.severity === "high")].map((risk) => (
              <article className="risk-row" key={risk.id}>
                <SeverityBadge severity={risk.severity} />
                <div>
                  <strong>{risk.title}</strong>
                  <p>{risk.summary}</p>
                  <small>{risk.sourceRefs.map((ref) => sourceMap.get(ref)?.title ?? ref).join(" · ")}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wiki-band">
        {kb.wikiPages.map((page) => (
          <article className="wiki-item" key={page.id}>
            <BookOpen size={20} />
            <div>
              <h3>{page.title}</h3>
              <p>{page.summary}</p>
              <div className="pill-row">
                {page.entityRefs.slice(0, 5).map((id) => (
                  <span key={id}>{entityMap.get(id)?.title ?? id}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="standard-section">
        <div className="panel-heading">
          <h3>真实 Markdown 基础库验证集</h3>
          <span>{standardIndex.strategy} · {standardIndex.totalDocuments} docs</span>
        </div>
        <div className="domain-grid">
          {standardIndex.domains.slice(0, 8).map((domain) => (
            <div className="domain-chip" key={domain.domain}>
              <strong>{domain.count}</strong>
              <span>{formatDomain(domain.domain)}</span>
            </div>
          ))}
        </div>
        <div className="standard-list">
          {standardIndex.documents
            .filter((doc) => doc.domains.includes("quality_system") || doc.domains.includes("risk_management") || doc.domains.includes("biocompatibility"))
            .slice(0, 6)
            .map((doc) => (
              <article className="standard-row" key={doc.id}>
                <div>
                  <strong>{displayStandardTitle(doc)}</strong>
                  <p>{doc.fileName} · {doc.language.toUpperCase()} · {doc.headingCount} headings · {doc.sizeKb} KB</p>
                </div>
                <div className="pill-row">
                  {doc.domains.slice(0, 3).map((domain) => <span key={domain}>{formatDomain(domain)}</span>)}
                </div>
              </article>
            ))}
        </div>
        <p className="copyright-note">{standardIndex.copyrightBoundary}</p>
        <button className="secondary-action" onClick={() => setActive("standards")}>
          <FileText size={17} />
          Open standards workbench
        </button>
      </section>
    </div>
  );
}

function Standards({
  selectedStandard,
  setSelectedStandardId
}: {
  selectedStandard: StandardDocument;
  setSelectedStandardId: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");
  const [signal, setSignal] = useState("all");
  const filteredDocs = standardIndex.documents
    .filter((doc) => domain === "all" || doc.domains.includes(domain))
    .filter((doc) => signal === "all" || doc.requirementSignals.includes(signal))
    .filter((doc) => {
      const haystack = `${doc.fileName} ${doc.title} ${doc.domains.join(" ")} ${doc.requirementSignals.join(" ")}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    })
    .sort((a, b) => b.readinessScore - a.readinessScore);
  const selected = filteredDocs.find((doc) => doc.id === selectedStandard.id) ?? selectedStandard;
  const checklist = buildStandardChecklist(selected);

  return (
    <div className="standards-layout">
      <section className="standards-main">
        <div className="toolbar">
          <div className="chat-input compact">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search standards"
              placeholder="Search standards, domains, requirement signals"
            />
          </div>
          <select value={domain} onChange={(event) => setDomain(event.target.value)} aria-label="Domain filter">
            <option value="all">All domains</option>
            {standardIndex.domains.map((item) => (
              <option key={item.domain} value={item.domain}>{formatDomain(item.domain)}</option>
            ))}
          </select>
          <select value={signal} onChange={(event) => setSignal(event.target.value)} aria-label="Signal filter">
            <option value="all">All signals</option>
            {standardIndex.requirementSignals.map((item) => (
              <option key={item.signal} value={item.signal}>{formatSignal(item.signal)}</option>
            ))}
          </select>
        </div>

        <div className="signal-strip">
          {standardIndex.requirementSignals.slice(0, 8).map((item) => (
            <button key={item.signal} className="signal-chip" onClick={() => setSignal(item.signal)}>
              <strong>{item.count}</strong>
              <span>{formatSignal(item.signal)}</span>
            </button>
          ))}
        </div>

        <div className="standard-results">
          {filteredDocs.slice(0, 18).map((doc) => (
            <button
              key={doc.id}
              className={doc.id === selected.id ? "standard-card selected" : "standard-card"}
              onClick={() => setSelectedStandardId(doc.id)}
            >
              <div className="score-ring">{doc.readinessScore}</div>
              <div>
                <strong>{displayStandardTitle(doc)}</strong>
                <p>{doc.fileName} · {doc.headingCount} headings · {doc.sizeKb} KB</p>
                <div className="pill-row">
                  {doc.domains.slice(0, 3).map((item) => <span key={item}>{formatDomain(item)}</span>)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <aside className="detail-panel standard-detail">
        <div className="panel-heading">
          <h3>{displayStandardTitle(selected)}</h3>
          <span>{selected.language.toUpperCase()} · {selected.readinessScore}/100</span>
        </div>
        <p>{selected.fileName} · hash {selected.hash} · {selected.wikiSeed.recommendedPath}</p>
        <h4>LLM wiki tags</h4>
        <div className="pill-row">
          {[...selected.domains, ...selected.requirementSignals].slice(0, 10).map((item) => (
            <span key={item}>{formatSignal(item)}</span>
          ))}
        </div>
        <h4>候选实体</h4>
        <div className="entity-seed-list">
          {selected.candidateEntities.length === 0 && <p>暂未识别强实体，可作为 raw source 等待人工或 LLM 编译。</p>}
          {selected.candidateEntities.map((entity) => (
            <div key={`${entity.type}-${entity.title}`}>
              <span>{entity.type}</span>
              <strong>{entity.title}</strong>
            </div>
          ))}
        </div>
        <h4>章节信号</h4>
        <ol className="heading-list">
          {selected.topHeadings.slice(0, 10).map((heading) => (
            <li key={`${heading.level}-${heading.text}`}>{heading.text}</li>
          ))}
        </ol>
        <h4>自查 checklist seed</h4>
        <ul className="checklist-list">
          {checklist.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </aside>
    </div>
  );
}

function Readiness({ selectedStandard }: { selectedStandard: StandardDocument }) {
  const [scenarioId, setScenarioId] = useState<(typeof readinessScenarios)[number]["id"]>("rd-verification");
  const scenario = readinessScenarios.find((item) => item.id === scenarioId) ?? readinessScenarios[0];
  const plan = buildReadinessPlan(selectedStandard, scenario);

  return (
    <div className="readiness-layout">
      <section className="readiness-hero">
        <div>
          <p className="eyebrow">Scenario readiness</p>
          <h2>{scenario.label}</h2>
          <p>
            将当前标准的 LLM wiki 信号转成自查 checklist、证据包和 audit item 候选。输出仍然是准备建议，需要人工确认。
          </p>
        </div>
        <select value={scenarioId} onChange={(event) => setScenarioId(event.target.value as typeof scenarioId)} aria-label="Readiness scenario">
          {readinessScenarios.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </section>

      <section className="readiness-grid">
        <div className="readiness-panel">
          <div className="panel-heading">
            <h3>Selected standard</h3>
            <span>{selectedStandard.readinessScore}/100</span>
          </div>
          <strong>{displayStandardTitle(selectedStandard)}</strong>
          <p>{selectedStandard.fileName} · {selectedStandard.headingCount} heading signals</p>
          <div className="pill-row">
            {selectedStandard.requirementSignals.slice(0, 6).map((signal) => (
              <span key={signal}>{formatSignal(signal)}</span>
            ))}
          </div>
        </div>

        <div className="readiness-panel">
          <div className="panel-heading">
            <h3>Scenario fit</h3>
            <span>{plan.fitScore}%</span>
          </div>
          <div className="fit-meter"><i style={{ width: `${plan.fitScore}%` }} /></div>
          <p>{plan.fitSummary}</p>
          <div className="pill-row">
            {scenario.functions.map((fn) => <span key={fn}>{fn}</span>)}
          </div>
        </div>
      </section>

      <section className="readiness-columns">
        <ReadinessColumn title="Checklist" icon={ListChecks}>
          {plan.checks.map((check) => (
            <label className="check-row" key={check}>
              <input type="checkbox" />
              <span>{check}</span>
            </label>
          ))}
        </ReadinessColumn>

        <ReadinessColumn title="Evidence bundle" icon={Archive}>
          {plan.evidence.map((item) => (
            <article className="evidence-row" key={item}>
              <CheckCircle2 size={16} />
              <span>{item}</span>
            </article>
          ))}
        </ReadinessColumn>

        <ReadinessColumn title="Audit candidate" icon={ClipboardList}>
          <article className="audit-preview">
            <SeverityBadge severity={plan.priority} />
            <h3>{plan.auditScope}</h3>
            <p>{plan.rationale}</p>
            <small>{scenario.owner} · candidate · human review required</small>
          </article>
        </ReadinessColumn>
      </section>

      <section className="review-note">
        <AlertTriangle size={18} />
        <p>Readiness 页面只生成自查准备建议，不代表该标准已完全覆盖，也不替代 QA/RA 对适用性和证据充分性的正式判断。</p>
      </section>
    </div>
  );
}

function GraphView({
  entityMap,
  sourceMap,
  selectedEntity,
  setSelectedEntityId
}: {
  entityMap: Map<string, Entity>;
  sourceMap: Map<string, Source>;
  selectedEntity: Entity;
  setSelectedEntityId: (id: string) => void;
}) {
  return (
    <div className="graph-layout">
      <section className="graph-canvas" aria-label="Knowledge graph">
        {kb.relations.map((relation, index) => {
          const fromIndex = kb.entities.findIndex((entity) => entity.id === relation.from);
          const toIndex = kb.entities.findIndex((entity) => entity.id === relation.to);
          return (
            <div
              key={relation.id}
              className="edge"
              style={{
                left: `${10 + Math.min(fromIndex, toIndex) * 6.5}%`,
                top: `${18 + (index % 7) * 9}%`,
                width: `${12 + Math.abs(toIndex - fromIndex) * 5}%`
              }}
            >
              <span>{relation.type}</span>
            </div>
          );
        })}
        {kb.entities.map((entity, index) => (
          <button
            key={entity.id}
            className={`graph-node ${entity.type} ${entity.id === selectedEntity.id ? "selected" : ""}`}
            style={{
              left: `${8 + (index % 4) * 22}%`,
              top: `${12 + Math.floor(index / 4) * 24}%`
            }}
            onClick={() => setSelectedEntityId(entity.id)}
          >
            <span>{typeLabel[entity.type]}</span>
            <strong>{entity.title}</strong>
          </button>
        ))}
      </section>

      <aside className="detail-panel">
        <div className="panel-heading">
          <h3>{selectedEntity.title}</h3>
          <SeverityBadge severity={selectedEntity.severity} />
        </div>
        <p>{selectedEntity.summary}</p>
        <h4>关系链路</h4>
        <div className="relation-stack">
          {kb.relations
            .filter((relation) => relation.from === selectedEntity.id || relation.to === selectedEntity.id)
            .map((relation) => (
              <div key={relation.id}>
                <span>{entityMap.get(relation.from)?.title}</span>
                <strong>{relation.type}</strong>
                <span>{entityMap.get(relation.to)?.title}</span>
              </div>
            ))}
        </div>
        <h4>来源引用</h4>
        <div className="source-list">
          {selectedEntity.sourceRefs.map((ref) => {
            const source = sourceMap.get(ref);
            return <span key={ref}>{source ? `${source.id} · ${source.title}` : ref}</span>;
          })}
        </div>
      </aside>
    </div>
  );
}

function Kanban({ entityMap }: { entityMap: Map<string, Entity> }) {
  const seededCandidates = standardIndex.documents
    .filter((doc) => doc.readinessScore >= 80 && doc.requirementSignals.length > 0)
    .slice(0, 3)
    .map((doc) => buildReadinessPlan(doc, readinessScenarios[0]));

  return (
    <div className="kanban-board">
      <KanbanColumn title="Finding input" icon={FileSearch}>
        {kb.findings.map((finding) => (
          <article className="kanban-card" key={finding.id}>
            <div className="card-title-row">
              <strong>{finding.id}</strong>
              <span>{finding.recurrenceSignal}</span>
            </div>
            <p>{finding.description}</p>
            <small>{finding.sourceEvent} · {finding.owner} · due {finding.dueDate}</small>
          </article>
        ))}
      </KanbanColumn>

      <KanbanColumn title="Plan candidate" icon={ClipboardList}>
        {kb.auditItems.map((item) => (
          <article className="kanban-card accent" key={item.id}>
            <div className="card-title-row">
              <strong>{item.auditScope}</strong>
              <SeverityBadge severity={item.priority} />
            </div>
            <p>{item.rationale}</p>
            <small>{item.owner} · {item.status} · due {item.dueDate}</small>
          </article>
        ))}
        {seededCandidates.map((item) => (
          <article className="kanban-card seeded" key={item.auditScope}>
            <div className="card-title-row">
              <strong>{item.auditScope}</strong>
              <SeverityBadge severity={item.priority} />
            </div>
            <p>{item.rationale}</p>
            <small>auto-seeded from standards · candidate · human review required</small>
          </article>
        ))}
      </KanbanColumn>

      <KanbanColumn title="Risk focus" icon={AlertTriangle}>
        {kb.entities.filter((entity) => entity.type === "risk").map((risk) => (
          <article className="kanban-card" key={risk.id}>
            <div className="card-title-row">
              <strong>{risk.title}</strong>
              <SeverityBadge severity={risk.severity} />
            </div>
            <p>{risk.summary}</p>
            <small>{risk.id}</small>
          </article>
        ))}
      </KanbanColumn>

      <KanbanColumn title="Evidence control" icon={CheckCircle2}>
        {kb.entities.filter((entity) => entity.type === "evidence" || entity.type === "control").map((entity) => (
          <article className="kanban-card" key={entity.id}>
            <div className="card-title-row">
              <strong>{entity.title}</strong>
              <span>{typeLabel[entity.type]}</span>
            </div>
            <p>{entity.summary}</p>
            <small>{entity.id}</small>
          </article>
        ))}
      </KanbanColumn>
    </div>
  );
}

function Chat({ entityMap, sourceMap }: { entityMap: Map<string, Entity>; sourceMap: Map<string, Source> }) {
  const [question, setQuestion] = useState("根据当前风险图谱，近期自查应该优先关注哪些主题？");
  const answer = buildAnswer(question, entityMap, sourceMap);

  return (
    <div className="chat-layout">
      <section className="chat-panel">
        <div className="chat-input">
          <Search size={18} />
          <input value={question} onChange={(event) => setQuestion(event.target.value)} aria-label="Self-check question" />
        </div>
        <div className="assistant-answer">
          <div className="answer-heading">
            <Sparkles size={20} />
            <div>
              <strong>初步自查建议</strong>
              <span>基于本地 LLM wiki 图谱生成，需人工复核</span>
            </div>
          </div>
          {answer.themes.map((theme) => (
            <article className="answer-block" key={theme.title}>
              <h3>{theme.title}</h3>
              <p>{theme.rationale}</p>
              <ul>
                {theme.checks.map((check) => <li key={check}>{check}</li>)}
              </ul>
              <div className="source-list">
                {theme.sources.map((source) => <span key={source}>{source}</span>)}
              </div>
            </article>
          ))}
          <div className="standards-match">
            <div className="panel-heading">
              <h3>Matched standard signals</h3>
              <span>{answer.standardMatches.length} docs</span>
            </div>
            {answer.standardMatches.map((doc) => (
              <div className="matched-standard" key={doc.id}>
                <strong>{displayStandardTitle(doc)}</strong>
                <span>{doc.fileName} · {doc.readinessScore}/100</span>
              </div>
            ))}
          </div>
          <div className="review-note">
            <AlertTriangle size={18} />
            <p>{answer.boundary}</p>
          </div>
        </div>
      </section>

      <aside className="detail-panel">
        <div className="panel-heading">
          <h3>Query path</h3>
          <span>graph-first RAG</span>
        </div>
        <ol className="query-path">
          <li>识别问题意图：近期自查优先级</li>
          <li>遍历 high/critical risks</li>
          <li>回溯 findings、controls、clauses</li>
          <li>输出 evidence_needed 与人工复核提示</li>
        </ol>
      </aside>
    </div>
  );
}

function buildAnswer(question: string, entityMap: Map<string, Entity>, sourceMap: Map<string, Source>) {
  const targetItems = question.includes("CAPA")
    ? kb.auditItems.filter((item) => item.id === "AUD-READY-002")
    : kb.auditItems;
  const standardMatches = findStandardMatches(question, targetItems);

  return {
    themes: targetItems.map((item) => {
      const risks = item.sourceRisks.map((id) => entityMap.get(id)).filter(Boolean) as Entity[];
      const clauses = item.sourceClauses.map((id) => entityMap.get(id)).filter(Boolean) as Entity[];
      const controls = item.sourceControls.map((id) => entityMap.get(id)).filter(Boolean) as Entity[];
      const refs = [...risks, ...clauses, ...controls].flatMap((entity) => entity.sourceRefs);
      const sources = [...new Set(refs)].map((ref) => {
        const source = sourceMap.get(ref);
        return source ? `${source.id}: ${source.title}` : ref;
      });
      return {
        title: `${severityLabel[item.priority]} · ${item.auditScope}`,
        rationale: item.rationale,
        checks: [...item.suggestedChecks, `证据准备：${item.evidenceNeeded.join("、")}`],
        sources: [
          ...sources,
          ...standardMatches.slice(0, 3).map((doc) => `${doc.id}: ${displayStandardTitle(doc)}`)
        ]
      };
    }),
    standardMatches,
    boundary: "以上内容是自查计划候选和证据准备提示，不代表项目已合规，也不能替代 QA/RA/审核员的正式判断。"
  };
}

function findStandardMatches(question: string, items: AuditItem[]) {
  const text = `${question} ${items.map((item) => `${item.auditScope} ${item.rationale} ${item.suggestedChecks.join(" ")}`).join(" ")}`;
  const desiredSignals = new Set<string>();
  const addIf = (pattern: RegExp, signal: string) => {
    if (pattern.test(text)) desiredSignals.add(signal);
  };

  addIf(/验证|确认|verification|validation/i, "verification_validation");
  addIf(/风险|risk/i, "risk_file");
  addIf(/设计|追溯|design|trace/i, "design_control");
  addIf(/CAPA|纠正|预防|复发/i, "capa_feedback");
  addIf(/供应商|采购|supplier|purchasing/i, "supplier_control");
  addIf(/灭菌|sterilization/i, "sterilization_validation");
  addIf(/生物|biological|毒性/i, "biological_evaluation");
  addIf(/电气|electrical|基本性能/i, "electrical_safety");

  const signals = desiredSignals.size > 0 ? [...desiredSignals] : ["verification_validation", "risk_file", "design_control"];
  return standardIndex.documents
    .filter((doc) => signals.some((signal) => doc.requirementSignals.includes(signal)))
    .sort((a, b) => b.readinessScore - a.readinessScore)
    .slice(0, 5);
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof BookOpen; label: string; value: number; tone: string }) {
  return (
    <div className={`metric-card ${tone}`}>
      <Icon size={20} />
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function KanbanColumn({ title, icon: Icon, children }: { title: string; icon: typeof FileSearch; children: React.ReactNode }) {
  return (
    <section className="kanban-column">
      <div className="column-heading">
        <Icon size={18} />
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

function ReadinessColumn({ title, icon: Icon, children }: { title: string; icon: typeof FileSearch; children: React.ReactNode }) {
  return (
    <section className="readiness-column">
      <div className="column-heading">
        <Icon size={18} />
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`severity ${severity}`}>{severityLabel[severity]}</span>;
}

function countBy<T extends Record<string, unknown>>(items: T[], field: keyof T) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = String(item[field]);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function formatDomain(domain: string) {
  return domain
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function formatSignal(signal: string) {
  return signal
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function displayStandardTitle(doc: StandardDocument) {
  const genericTitles = ["中华人民共和国国家标准", "中华人民共和国医药行业标准"];
  if (genericTitles.includes(doc.title)) {
    return doc.fileName.replace(/\.md$/i, "");
  }
  return doc.title;
}

function buildStandardChecklist(doc: StandardDocument) {
  const checklist = new Set<string>();
  doc.reviewPrompts.forEach((prompt) => checklist.add(prompt));
  if (doc.requirementSignals.includes("design_control")) {
    checklist.add("抽查设计输入、设计输出、验证确认和变更控制是否有同一条追溯链。");
  }
  if (doc.requirementSignals.includes("verification_validation")) {
    checklist.add("确认验证/确认记录是否支持报告结论，并能回溯到原始测试记录。");
  }
  if (doc.requirementSignals.includes("risk_file")) {
    checklist.add("确认风险管理文件是否包含计划、分析、控制、剩余风险评价和评审记录。");
  }
  if (doc.requirementSignals.includes("training_competence")) {
    checklist.add("确认相关岗位培训、能力评价和授权记录与该标准要求相匹配。");
  }
  if (checklist.size === 0) {
    checklist.add("先由 QA/RA 确认该标准适用性，再将关键章节编译为 clause、obligation、risk、control。");
  }
  return [...checklist].slice(0, 6);
}

function buildReadinessPlan(
  doc: StandardDocument,
  scenario: (typeof readinessScenarios)[number]
) {
  const matchedSignals = scenario.focusSignals.filter((signal) => doc.requirementSignals.includes(signal));
  const fitScore = Math.min(100, Math.round((matchedSignals.length / scenario.focusSignals.length) * 70 + doc.readinessScore * 0.3));
  const baseChecks = buildStandardChecklist(doc);
  const signalChecks = matchedSignals.map((signal) => `针对 ${formatSignal(signal)} 抽查来源章节、项目证据和责任人确认记录。`);
  const checks = [...new Set([...baseChecks, ...signalChecks])].slice(0, 7);
  const evidence = [...new Set([...scenario.evidence, ...inferEvidenceFromSignals(doc.requirementSignals)])].slice(0, 8);
  const priority: Severity = fitScore >= 75 ? "critical" : fitScore >= 55 ? "high" : "medium";

  return {
    fitScore,
    priority,
    auditScope: `${scenario.label} · ${displayStandardTitle(doc)}`,
    fitSummary:
      matchedSignals.length > 0
        ? `该标准命中 ${matchedSignals.length}/${scenario.focusSignals.length} 个场景重点信号，适合作为本轮自查计划候选来源。`
        : "该标准与当前场景的直接信号较少，建议先由 QA/RA 判断适用性，再进入自查计划。",
    rationale: `基于 ${doc.fileName} 的章节信号、${doc.requirementSignals.length} 个要求信号和 ${doc.candidateEntities.length} 个候选实体生成。当前结论仅为自查计划候选。`,
    checks,
    evidence
  };
}

function inferEvidenceFromSignals(signals: string[]) {
  const evidence = new Set<string>();
  if (signals.includes("design_control")) {
    evidence.add("设计输入/输出记录");
    evidence.add("设计评审记录");
  }
  if (signals.includes("verification_validation")) {
    evidence.add("验证方案与验证报告");
    evidence.add("原始测试数据");
  }
  if (signals.includes("risk_file")) {
    evidence.add("风险管理计划/报告");
  }
  if (signals.includes("biological_evaluation")) {
    evidence.add("生物学评价报告");
  }
  if (signals.includes("electrical_safety")) {
    evidence.add("电气安全检测报告");
  }
  if (signals.includes("sterilization_validation")) {
    evidence.add("灭菌确认与常规监测记录");
  }
  if (signals.includes("supplier_control")) {
    evidence.add("供应商审核与采购控制记录");
  }
  return [...evidence];
}

createRoot(document.getElementById("root")!).render(<App />);
