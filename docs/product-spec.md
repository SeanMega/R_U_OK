# R_U_OK Product Specification

版本：v0.3  
日期：2026-07-09  
状态：MVP product spec

## 1. 产品一句话

R_U_OK 是面向医疗器械研发、生产、质量、注册和供应链团队的本地合规智能自查 Agent，用 LLM wiki 和知识图谱把标准要求、项目证据、历史 findings 和自查计划连接起来，帮助团队在正式 QA/RA/审核前提前发现风险和证据缺口。

## 2. 产品边界

R_U_OK 做：

- 初步自查建议
- 风险关注点提示
- 证据准备提示
- 自查计划候选
- 来源引用和人工复核提示
- 本地知识库和项目工作区隔离

R_U_OK 不做：

- 正式合规结论
- QA/RA/审核员审批替代
- 对外注册提交判断
- 质量系统自动写回
- 未授权敏感资料上传

## 3. 目标用户

| 用户 | 核心任务 | 价值 |
| --- | --- | --- |
| R&D | 验证报告、技术报告、设计变更自查 | 提前发现追溯链路和证据缺口 |
| QA | CAPA、偏差、投诉、审核发现趋势分析 | 生成自查计划候选和风险摘要 |
| RA | 注册资料、技术文件、claims 一致性检查 | 提醒资料完整性和高风险表述 |
| Manufacturing | 批记录、设备、培训、现场自查 | 识别执行证据和历史复发风险 |
| Supplier Quality | 供应商变更、来料异常、供应商审核 | 关联供应商证据和内部质量信号 |

## 4. 核心对象

- Standard source：只读标准、法规、SOP、模板、内部要求。
- Project source：用户本地项目资料、报告、记录、台账。
- Evidence record：从项目资料中抽取或登记的证据记录，包含覆盖度、缺口和建议动作。
- Wiki page：由来源编译出的稳定知识页。
- Entity：clause、obligation、risk、control、evidence、finding、audit_item。
- Relation：实体之间的 typed edge。
- Self-check answer：带来源、证据要求和人工复核边界的回答。

## 5. 产品形态

MVP 是本地 Web 应用：

- Dashboard：产品全局概览和演示入口。
- Workspace：项目文件、证据记录、覆盖率和缺口队列。
- Standards：真实 Markdown 标准库 workbench。
- Readiness：把标准信号转成场景化 checklist、证据包和自查计划候选。
- Graph：要求、风险、控制、证据的关系链路。
- Kanban：findings 驱动的自查计划候选。
- Chat：基于知识库的自查问答。

## 6. LLM Wiki 工作流

1. Raw source ingest：接入标准 Markdown 或项目文件。
2. Source index：生成路径、hash、标题、章节信号、领域标签。
3. Wiki seed：生成 requirement signals、candidate entities、review prompts。
4. Wiki compile：将重要来源编译为可追溯 wiki page。
5. Typed graph：抽取实体和关系。
6. Self-check workflow：根据场景生成 checklist、audit_items、answer。
7. Human review：所有输出进入人工确认。

## 7. MVP 成功标准

功能成功：

- 能导入 50+ 份 Markdown 标准并生成索引。
- 能展示项目工作区、项目文件和 evidence records。
- 能展示标准领域、要求信号和候选实体。
- 能按 R&D、QA、RA、供应商等场景生成 readiness checklist 和 evidence bundle。
- 能展示 typed graph。
- 能展示 findings 驱动的自查计划候选。
- Chat 能输出建议、证据准备项、来源和人工复核提示。

业务成功：

- 3-5 分钟内讲清产品边界和核心价值。
- 用户理解 R_U_OK 是自查准备工具，不是审批工具。
- 用户能说出至少 2 个想接入的真实场景。

## 8. 非功能要求

- Local-first：项目资料默认不离开本机。
- Traceable：每个建议尽量回到来源、实体或关系。
- Read-only base：基础库不可由普通用户误改。
- Rebuildable：索引和样例数据可重复生成。
- Explainable：回答必须展示来源和人工复核边界。
- Extensible：后续可接真实 LLM、向量库、图数据库和文档解析器。

## 9. 版本路线

| 阶段 | 名称 | 目标 |
| --- | --- | --- |
| v0.1 | Demo seed | 样例图谱、Kanban、Chat |
| v0.2 | Standards index | 接入真实 Markdown 标准库 |
| v0.3 | Productized MVP | 完整产品文档、标准工作台、校验脚本 |
| v0.4 | Workspace ingest | 本地项目资料导入和 evidence records |
| v0.5 | LLM wiki compiler | LLM 生成 wiki pages、实体、关系 |
| v0.6 | Review workflow | 人工确认、导出报告、审计记录 |
