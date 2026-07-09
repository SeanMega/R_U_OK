# R_U_OK Demo PRD

版本：v0.2 demo  
日期：2026-07-09  
目标：在本地完成一个可演示、可解释、可继续扩展的医疗器械合规自查 Agent。

## 1. 产品定位

R_U_OK 不判断“是否合规”，只回答“现在有哪些风险值得提前看、证据是否准备充分、下一步自查计划候选是什么”。它服务于正式 QA/RA/审核前的准备阶段。

## 2. Demo 用户故事

1. 研发负责人打开 Dashboard，看到基础知识库中有条款、义务、风险、控制和证据样例。
2. QA 在 Graph 中查看 `要求 -> 风险 -> 控制 -> 证据` 的链路，确认系统不是只做关键词检索。
3. 质量负责人进入 Kanban，看到历史 finding 自动驱动出自查计划候选。
4. RA 在 Chat 中询问近期自查重点，系统返回结构化建议、来源引用和人工复核提示。

## 3. LLM Wiki 知识库模式

Demo 采用四层结构：

- Raw sources：原始法规、标准、SOP、项目资料和 finding 摘要，不直接覆盖。
- Compiled wiki：将来源编译成面向实体的 Markdown/wiki 节点，每个节点保留来源引用。
- Typed graph：将 wiki 节点转换为 clause、obligation、risk、control、evidence、finding、audit_item 等强类型实体和关系。
- Review boundary：所有输出都使用“候选、提示、初步建议”口径，并展示人工复核。

这参考了 LLM Wiki 的“由 LLM 编译持久知识库”思路，同时引入 GraphRAG 式关系遍历：先看实体与关系，再组织回答。

## 4. Demo 功能边界

P0：

- Dashboard 展示知识库规模、风险热区和本地边界。
- Graph 展示核心节点和关系链路。
- Kanban 展示 findings、audit_items、risk focus、evidence/control。
- Chat 支持至少一个高质量自查问题，并带引用。
- 样例数据可重复加载，schema lint 可通过。

P1：

- 职能筛选。
- 节点详情侧栏。
- 自查计划 owner/due date。

暂不做：

- 真实 LLM 调用。
- PDF/Word 自动解析。
- 质量系统写回。
- 正式审核批准。

## 5. 演示验收

演示者应能在 3-5 分钟内讲清：

- R_U_OK 解决的是前置自查和证据准备。
- LLM wiki 把散落资料编译成可追溯节点，而不是每次临时检索。
- Findings 会驱动 audit item 候选，但仍需 QA/RA 人工确认。
- 输出不会宣称项目已经合规。
