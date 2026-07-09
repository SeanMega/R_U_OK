# R_U_OK Functional Specification

版本：v0.3

## 1. 页面结构

### 1.1 Dashboard

目的：展示系统状态、演示路径和核心价值。

必须展示：

- Wiki pages 数量
- Typed relations 数量
- Risk signals 数量
- Standard docs 数量
- 真实 Markdown 基础库领域分布
- 近期风险焦点
- 进入 Standards、Readiness 和 Chat 的入口

### 1.2 Standards

目的：让用户验证真实标准库是否能成为 LLM wiki 的基础。

功能：

- 搜索标准文件名、标题、领域、要求信号。
- 按 domain 筛选。
- 按 requirement signal 筛选。
- 展示 readiness score。
- 展示标准详情：
  - 文件名
  - hash
  - recommended wiki path
  - LLM wiki tags
  - candidate entities
  - heading signals
  - checklist seed

交互规则：

- 选择标准后右侧详情更新。
- 过滤后列表按 readiness score 降序。
- 长标题必须换行，不得撑破布局。

### 1.3 Readiness

目的：把标准库信号转成可执行的自查准备工作。

功能：

- 支持选择场景：
  - R&D verification
  - QA CAPA readiness
  - RA submission
  - Supplier change
- 展示当前 selected standard。
- 计算 scenario fit score。
- 生成 checklist。
- 生成 evidence bundle。
- 生成 audit candidate preview。
- 展示人工复核边界。

交互规则：

- 切换场景后 checklist、evidence bundle、fit score 和 audit candidate 更新。
- 输出只能是 candidate，不得自动进入正式计划。
- 场景生成逻辑应优先使用 requirement signals，其次使用 review prompts。

### 1.4 Graph

目的：展示知识不是散点检索结果，而是可追溯关系链路。

功能：

- 展示 clause、obligation、risk、control、evidence 节点。
- 展示 typed relation。
- 点击节点显示详情。
- 节点详情展示来源引用和相关关系。

### 1.5 Kanban

目的：展示 findings 如何驱动自查计划候选。

四列：

- Finding input
- Plan candidate
- Risk focus
- Evidence control

卡片内容：

- 标题
- 风险/优先级
- rationale 或 description
- owner、status、due date

### 1.6 Chat

目的：回答自查问题，并保持合规边界。

输入：

- 自然语言问题。

输出：

- 初步自查建议
- rationale
- suggested checks
- evidence needed
- sources
- matched standard signals
- artificial review boundary

禁止输出：

- “已合规”
- “无需审核”
- “可直接提交”
- “正式审核通过”

## 2. 核心流程

### 2.1 标准库编译流程

1. 用户准备 Markdown 标准目录。
2. 运行 `npm run kb:compile`。
3. 系统生成 `src/data/standard-index.json`。
4. Standards 页面显示标准索引。
5. `npm run lint:standards` 校验结构。

### 2.2 自查计划候选流程

1. 输入 finding。
2. 系统关联 related risks 和 controls。
3. 系统生成 audit item candidate。
4. Kanban 展示候选项。
5. 用户人工确认后进入正式自查计划。

### 2.3 Readiness 场景自查流程

1. 用户选择标准或使用默认 selected standard。
2. 用户选择 R&D、QA、RA 或供应商场景。
3. 系统匹配场景 focus signals 和标准 requirement signals。
4. 系统生成 checklist、evidence bundle 和 audit candidate preview。
5. 用户人工确认是否进入正式自查计划。

### 2.4 Chat 自查问答流程

1. 用户输入问题。
2. 系统识别意图和关键词。
3. 匹配 audit_items、risks、controls、standards。
4. 生成建议、检查项、证据准备和来源。
5. 输出人工复核提示。

## 3. 权限与边界

MVP 暂不实现登录。产品设计上保留三类角色：

- Viewer：查看基础库、图谱和回答。
- Reviewer：确认 checklist、audit item、evidence。
- Admin：重建基础库、维护标准版本、管理工作区。

## 4. 状态定义

Finding status：

- triage
- open
- in_review
- closed

Audit item status：

- candidate
- accepted
- in_progress
- done
- rejected

Recurrence signal：

- isolated
- recurring
- systemic
