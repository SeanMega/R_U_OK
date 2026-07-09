# R_U_OK 5-Hour Iteration Roadmap

目标：把第一版 demo 从“可展示的合规自查界面”推进到“可用真实 Markdown 标准库验证的 LLM wiki 原型”。

## North Star

业务团队在正式 QA/RA/审核前，可以从标准库、项目证据、历史 findings 和风险图谱中得到：

- 近期自查优先级
- 需要准备的证据
- 来源可追溯的要求信号
- 明确的人工复核边界

## Hour 1: Knowledge Ingestion

- 将外部 Markdown 标准库编译为只读 raw source index。
- 保留文件路径、hash、标题、章节信号、语言、大小、领域标签。
- 不复制标准正文，避免 demo 仓库承载版权文本。
- 输出 `standard-index.json` 作为 LLM wiki 编译前的稳定中间层。

## Hour 2: LLM Wiki Seeds

- 为每份标准生成 `requirementSignals`。
- 生成候选实体：clause、obligation、risk、control。
- 生成 review prompts 和 checklist seed。
- 用 readiness score 标识“适合进入 wiki 编译”的文档优先级。

## Hour 3: Product Workflow

- 增加 Standards workbench。
- 支持搜索、领域筛选、要求信号筛选。
- 在详情侧栏展示 wiki path、候选实体、章节信号和 checklist seed。
- Dashboard 保持演示概览，Standards 承担真实库验证。

## Hour 4: Self-Check Intelligence

- Chat 输出不只引用 demo 图谱，也匹配真实标准信号。
- 自查建议保留“计划候选、证据准备、人工复核”口径。
- 后续可把规则匹配替换为本地 LLM 编译或 RAG 检索。

## Hour 5: Demo Hardening

- 增加 `lint:standards` 校验标准索引。
- 运行 `kb:compile`、`lint:standards`、`lint:schema`、`build`。
- 用浏览器验证 Dashboard、Standards、Graph、Kanban、Chat。
- 记录剩余产品路线：真实文档解析、workspace 导入、LLM 编译、导出报告。

## Current Result

- 55 份 Markdown 标准被编译为索引。
- 8 个领域标签。
- 12 类要求信号。
- 49 份文档有要求信号。
- 47 份文档有实体种子。

## Next Product Bets

- 将 selected standard 编译成独立 wiki page。
- 从项目资料中抽 evidence record。
- 将 standard signals 与 findings 自动生成 audit_items。
- 增加 project workspace 管理与导入状态。
- 增加 report draft / Excel export。
