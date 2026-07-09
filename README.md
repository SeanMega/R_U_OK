# R_U_OK

问己合规，预见风险。

R_U_OK 是一个面向医疗器械研发、生产、质量、注册和供应链团队的本地合规智能自查 Agent demo。当前版本聚焦 Hackathon 3-5 分钟演示路径：真实 Markdown 标准库索引、LLM wiki 图谱、Findings 驱动自查计划、带引用的自查问答。

## Demo 范围

- 只读基础知识库：法规/标准条款、义务、风险、控制措施。
- Standards workbench：浏览真实 Markdown 标准库索引，按领域和要求信号筛选。
- LLM wiki 模式：raw source、compiled wiki page、typed graph、review boundary。
- Kanban：finding input、plan candidate、risk focus、evidence/control 四列。
- Chat/RAG：规则化本地回答，返回来源引用、matched standard signals 与人工复核提示。
- 本地优先：示例数据在仓库内，不依赖真实敏感资料。

## 快速开始

```bash
npm install
npm run dev
```

打开终端显示的本地地址，默认是 `http://127.0.0.1:5173/`。

## 验证

```bash
npm run kb:compile
npm run lint:standards
npm run lint:schema
npm run build
```

`npm run kb:compile` 默认读取：

```text
/Users/sean/Downloads/Knowladge base/standard/markdown
```

也可以指定路径：

```bash
npm run kb:compile -- /path/to/markdown-standards
```

编译策略只保存元数据、章节信号、领域标签、要求信号、候选实体和 review prompts，不复制大段标准正文。

## 演示问题

在 Chat 输入：

```text
根据当前风险图谱，近期自查应该优先关注哪些主题？
```

系统会根据内置 LLM wiki 图谱返回初步自查建议、来源引用、证据准备项和人工复核边界。

## 产品文档

- [产品规格](docs/product-spec.md)
- [扩展 PRD](docs/expanded-prd.md)
- [功能规格](docs/functional-spec.md)
- [数据模型](docs/data-model.md)
- [技术设计](docs/technical-design.md)
- [验收标准](docs/acceptance-criteria.md)
- [5 小时迭代路线](docs/iteration-roadmap.md)
- [演示讲稿](docs/demo-script.md)
