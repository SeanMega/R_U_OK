# R_U_OK Data Model

版本：v0.3

## 1. 数据层级

```mermaid
flowchart TD
  A["Raw Sources"] --> B["Source Index"]
  B --> C["Wiki Seeds"]
  C --> D["Compiled Wiki Pages"]
  D --> E["Typed Entities"]
  E --> F["Typed Relations"]
  F --> G["Self-check Answers"]
  E --> H["Audit Items"]
  I["Findings"] --> H
  I --> E
```

## 2. StandardIndex

文件：`src/data/standard-index.json`

字段：

- `generatedAt`
- `sourceRoot`
- `strategy`
- `copyrightBoundary`
- `totalDocuments`
- `domains`
- `requirementSignals`
- `documents`

### StandardDocument

字段：

- `id`
- `fileName`
- `sourcePath`
- `hash`
- `title`
- `language`
- `sizeKb`
- `headingCount`
- `topHeadings`
- `domains`
- `requirementSignals`
- `candidateEntities`
- `reviewPrompts`
- `readinessScore`
- `wikiSeed`

说明：

- `hash` 用于检测来源文件变更。
- `topHeadings` 是章节信号，不是标准正文副本。
- `readinessScore` 用于排序，不是合规评分。
- `wikiSeed` 指向建议编译路径。

## 3. KnowledgeBase

文件：`src/data/knowledge-base.json`

字段：

- `version`
- `workspace`
- `sources`
- `entities`
- `relations`
- `findings`
- `auditItems`
- `wikiPages`

## 4. Entity

通用字段：

- `id`
- `type`
- `title`
- `summary`
- `severity`
- `sourceRefs`

类型：

- `clause`
- `obligation`
- `risk`
- `control`
- `evidence`

## 5. Relation

字段：

- `id`
- `from`
- `to`
- `type`

关系类型：

- `creates_obligation`
- `identifies_risk`
- `satisfied_by`
- `mitigates`
- `indicates_risk`
- `drives_audit_item`
- `addresses_risk`
- `checks_control`

## 6. Finding

字段：

- `id`
- `findingType`
- `sourceFunction`
- `sourceEvent`
- `findingDate`
- `status`
- `description`
- `relatedRisks`
- `relatedControls`
- `affectedFunctions`
- `recurrenceSignal`
- `evidenceRefs`
- `owner`
- `dueDate`

## 7. AuditItem

字段：

- `id`
- `auditCycle`
- `auditScope`
- `priority`
- `status`
- `rationale`
- `targetFunctions`
- `sourceFindings`
- `sourceRisks`
- `sourceControls`
- `sourceClauses`
- `suggestedChecks`
- `evidenceNeeded`
- `owner`
- `dueDate`

## 8. 数据隔离原则

- 基础库为只读。
- 项目工作区独立保存。
- 真实项目资料不写入公开 demo 数据。
- 标准索引仅保存元数据和派生信号。

