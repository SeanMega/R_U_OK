# R_U_OK Design Input PRD

版本：v0.1  
日期：2026-07-09  
用途：产品与交互设计输入  
状态：MVP 设计基线

## 1. 产品定位

R_U_OK 是正式 QA/RA/审核前使用的本地合规自查准备工具。

它帮助用户回答：

- 当前项目资料是否存在明显证据缺口？
- 哪些法规、标准或内部要求可能没有被充分覆盖？
- 哪些风险关注点需要优先人工复核？
- 哪些 AI 建议可以转成自查计划候选？

R_U_OK 不输出正式合规结论，不替代 QA/RA/审核员判断，不自动批准或提交任何资料。

## 2. MVP 目标用户

MVP 优先服务三类用户：

| 用户 | 典型任务 | 核心诉求 |
| --- | --- | --- |
| QA | 评审前准备、findings 复盘、自查计划准备 | 快速看见风险焦点和证据缺口 |
| RA | 注册资料或技术文件预检查 | 确认来源、证据和高风险表述 |
| 项目负责人 | 项目评审前 readiness check | 知道哪些问题需要补证据或找负责人确认 |

R&D、生产、供应链是后续扩展角色，不作为 MVP 设计主线。

## 3. 核心场景

在正式评审、注册提交准备或质量自查会议前，用户进入一个本地项目工作区，查看项目资料被系统识别出的证据状态、风险关注点和自查计划候选，并决定哪些建议需要接受、修改、驳回或补充证据。

## 4. 用户主流程

1. 用户进入项目工作区。
2. 系统展示项目资料、证据记录和证据覆盖状态。
3. 系统提示证据缺口和风险关注点。
4. 用户查看要求、证据、风险、控制之间的来源链路。
5. 用户对 AI 建议执行接受、修改、驳回或标记补证据。
6. 用户得到一组自查计划候选和证据准备清单。

## 5. 核心页面

### 5.1 Dashboard

目的：让用户快速理解当前项目是否值得进一步自查。

必须展示：

- 项目名称和当前工作区状态。
- 项目资料数量。
- 证据记录数量。
- 证据缺口数量。
- 高优先级风险关注点数量。
- 进入 Workspace、Readiness、Trace、Kanban、Chat 的入口。

不得展示为“合规评分”或“通过率”。

### 5.2 Workspace

目的：展示本地项目资料如何被识别为 evidence records。

必须展示：

- 项目文件列表。
- 每个文件关联的 evidence records。
- evidence coverage：complete、partial、missing。
- evidence gap queue。
- suggested actions。

关键交互：

- 选择文件后更新 evidence records。
- 点击 evidence record 可查看来源、覆盖状态、缺口和建议动作。
- 用户可以将 evidence gap 标记为“需补充证据”。

### 5.3 Readiness

目的：把项目资料和标准要求转成可执行的评审前准备事项。

必须展示：

- 当前自查场景。
- checklist candidate。
- evidence bundle。
- risk focus。
- audit item candidate。
- 人工复核边界。

关键交互：

- 用户可以接受、修改或驳回 checklist / audit item candidate。
- 被接受的建议进入 Kanban。
- 被驳回的建议保留驳回原因。

### 5.4 Trace

目的：解释系统为什么提出某个风险或建议。

必须展示：

- Requirement / clause。
- Project evidence。
- Risk。
- Control。
- Source reference。

关键交互：

- 点击风险或建议后，展示其关联来源链路。
- 来源不足时明确提示“当前资料不足，需人工确认”。

### 5.5 Kanban

目的：承载人工处理后的自查计划候选。

四列：

- Finding input。
- Plan candidate。
- Risk focus。
- Evidence control。

卡片必须包含：

- 标题。
- 优先级。
- rationale。
- suggested checks。
- evidence needed。
- owner。
- status。

状态至少包括：

- candidate。
- accepted。
- in_progress。
- done。
- rejected。

### 5.6 Chat

目的：用自然语言解释当前项目的自查重点。

回答必须包含：

- 初步自查建议。
- rationale。
- suggested checks。
- evidence needed。
- sources。
- 人工复核提示。

禁止输出：

- “已合规”。
- “无需 QA/RA 审核”。
- “可直接提交”。
- “正式审核通过”。
- “资料完整，无需补充”。

资料不足时必须明确说：

> 当前资料不足，无法形成可靠自查建议，需要补充证据或人工确认。

## 6. 核心功能需求

| 编号 | 需求 | 优先级 |
| --- | --- | --- |
| DI-01 | 用户可以进入一个本地项目工作区 | P0 |
| DI-02 | 系统展示项目文件和 evidence records | P0 |
| DI-03 | 系统展示 evidence coverage 和 evidence gaps | P0 |
| DI-04 | 系统将证据关联到要求、风险和控制 | P0 |
| DI-05 | 系统生成 risk focus 和 checklist candidate | P0 |
| DI-06 | 系统生成 audit item candidate | P0 |
| DI-07 | 用户可以接受、修改、驳回或标记补证据 | P0 |
| DI-08 | 系统展示来源引用和 trace 链路 | P0 |
| DI-09 | Chat 回答必须带来源、证据要求和人工复核边界 | P0 |
| DI-10 | 系统不得输出正式合规结论 | P0 |
| DI-11 | 用户可以导出 checklist 或 evidence gap list | P1 |
| DI-12 | 管理员可以重建基础知识库索引 | P1 |

## 7. AI 建议处理规则

所有 AI 输出默认都是 candidate。

用户必须能够对 candidate 执行以下动作：

- 接受：进入自查计划候选或 Kanban。
- 修改：用户编辑标题、检查项、证据需求、owner 或 due date。
- 驳回：用户选择或填写驳回原因。
- 标记补证据：进入 evidence gap queue。

未经过人工处理的 candidate 不得显示为正式计划、正式发现或正式结论。

## 8. 风险优先级规则

MVP 风险优先级由以下信号共同决定：

- 证据缺口程度。
- 关联要求的重要性。
- finding 是否 recurring 或 systemic。
- 影响职能数量。
- 是否关联关键控制措施。

风险优先级只用于排序和提示，不代表合规判定。

## 9. 来源与证据规则

每条建议应尽量关联到至少一个来源：

- 标准、法规、SOP 或内部要求。
- 项目文件。
- evidence record。
- finding。
- risk 或 control。

当来源不足时，系统必须降低确定性表达，并提示人工确认。

不得在没有来源的情况下输出强结论。

## 10. 非目标

MVP 不做：

- 正式合规结论。
- QA/RA/审核员审批替代。
- 自动注册提交判断。
- 自动写回 QMS、PLM、ERP 或生产系统。
- 多人权限和企业账号体系。
- 未脱敏真实敏感数据的公开演示。

## 11. MVP 成功标准

产品成功：

- 用户能在 3-5 分钟内理解当前项目的主要证据缺口和风险关注点。
- 用户能看懂至少一条“要求 -> 证据 -> 风险 -> 控制”的来源链路。
- 用户能将至少一个 AI 建议接受为自查计划候选。
- 用户不会误以为系统给出了正式合规结论。

设计成功：

- 页面围绕项目自查任务组织，而不是围绕技术概念组织。
- 每个风险或建议都能进入解释视图。
- 关键动作清晰：接受、修改、驳回、补证据。
- coverage、confidence、risk priority 不被表现成合规评分。

## 12. 当前仍需确认的设计输入

以下问题需要在进入高保真设计或开发前确认：

- MVP 默认主场景是否锁定“QA/RA 评审前准备”？
- Workspace 是否需要真实文件上传，还是先使用预置样例数据？
- “修改 AI 建议”是否在 MVP 中支持自由编辑，还是只支持状态处理？
- 是否需要 P1 导出 checklist / evidence gap list？
- 风险优先级是否允许用户手动调整？
- Chat 回答是否保存为项目记录？
