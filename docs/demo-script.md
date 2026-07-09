# R_U_OK Demo Script

建议时长：4 分钟。

## 1. Opening

R_U_OK 是医疗器械团队的本地合规自查 Agent。它不替代 QA、RA 或审核员，只在正式评审前回答：我们现在有哪些证据缺口、证据是否充分、哪些主题应该先查。

## 2. Dashboard

展示四个数字：

- Wiki pages：已编译的样例 wiki 节点。
- Typed relations：要求、控制、证据、缺口之间的关系。
- Gap signals：来自 findings 的证据缺口信号。
- Standard docs：真实 Markdown 标准库验证集。

强调：真实标准库只读，本地运行，系统保存索引和信号，不复制大段标准正文。

## 3. Standards

进入 Standards workbench。

讲解：

- 左侧可以搜索标准、按领域筛选、按要求信号筛选。
- 每份标准有 readiness score，用来判断是否适合优先进入 LLM wiki 编译。
- 右侧展示 wiki path、领域标签、候选实体、章节信号和 checklist seed。

推荐演示：

- 选择 `Risk Management` 或 `Verification Validation`。
- 展示 ISO 13485 / ISO 14971 / GB 9706 / GB/T 16886 等标准如何被识别为合规知识种子。

## 4. Graph

展示要求、义务、控制、证据、缺口之间的 typed graph。

讲解：

普通 RAG 可能只返回相似段落；R_U_OK 先把知识编译为节点和关系，再回答自查问题，所以能解释 finding 如何驱动 audit item。

## 5. Kanban

展示四列：

- Finding input
- Plan candidate
- Evidence gaps
- Evidence control

强调：这些都是自查计划候选，不是正式审核结论。

## 6. Chat

输入：

```text
根据当前知识库和项目证据，近期自查应该优先关注哪些证据缺口或主题？
```

展示回答包括：

- 自查优先主题
- suggested checks
- evidence needed
- matched standard signals
- 人工复核边界

## Closing

R_U_OK 的核心价值不是“替人判断合规”，而是把分散的标准、项目证据、缺口和 findings 组织成可追溯的知识链路，让团队更早发现缺口，更快准备证据。
