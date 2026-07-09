# R_U_OK Acceptance Criteria

版本：v0.3

## 1. Demo 验收

- 应用可通过 `npm run dev` 本地启动。
- Dashboard、Standards、Readiness、Graph、Kanban、Chat 均可访问。
- 页面不依赖外部真实敏感数据。
- 3-5 分钟内能讲清业务痛点、产品边界和演示流程。

## 2. 标准库验收

- `npm run kb:compile` 能从 Markdown 标准目录生成 `standard-index.json`。
- `standard-index.json` 至少包含：
  - documents
  - domains
  - requirementSignals
  - candidateEntities
  - reviewPrompts
  - readinessScore
- `npm run lint:standards` 必须通过。
- 标准索引不得复制大段标准正文。

## 3. 知识图谱验收

- `knowledge-base.json` 包含 entities、relations、findings、auditItems、wikiPages。
- `npm run lint:schema` 必须通过。
- Graph 页面能展示节点、关系和节点详情。
- 节点详情必须展示来源引用。

## 4. Readiness 验收

- Readiness 页面必须支持至少 4 个场景。
- 页面必须展示 selected standard。
- 页面必须展示 scenario fit score。
- 页面必须生成 checklist。
- 页面必须生成 evidence bundle。
- 页面必须生成 audit candidate preview。
- 页面必须提示人工复核边界。

## 5. Kanban 验收

- Kanban 必须包含四列：
  - Finding input
  - Plan candidate
  - Risk focus
  - Evidence control
- 自查计划候选必须包含 rationale。
- 自查计划候选必须包含 suggested checks 和 evidence needed。
- 页面必须避免暗示正式批准。

## 6. Chat 验收

- Chat 输入默认问题后应返回结构化回答。
- 回答必须包含：
  - 自查主题
  - rationale
  - suggested checks
  - evidence needed
  - sources
  - matched standard signals
  - 人工复核边界
- 回答不得包含：
  - “已合规”
  - “无需 QA/RA 审核”
  - “可直接提交”
  - “正式通过”

## 7. 构建验收

以下命令必须全部通过：

```bash
npm run kb:compile
npm run lint:standards
npm run lint:schema
npm run build
```

## 8. 浏览器验收

人工或自动检查：

- Sidebar 显示 Dashboard、Standards、Readiness、Graph、Kanban、Chat。
- Standards 至少显示 10 个标准卡片。
- Standards 详情显示 checklist seed。
- Readiness 显示 checklist、evidence bundle 和 audit candidate。
- Chat 显示 matched standard signals。
- 页面在桌面和移动宽度下不出现明显文本重叠。
