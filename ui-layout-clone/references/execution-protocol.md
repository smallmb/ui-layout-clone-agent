# 执行增强协议

> 本文是 skill `ui-layout-clone` 的按需参考文档，仅在 SKILL.md 路由指向此处时阅读。

> 何时读：Extractor 规范、Advanced 共享上下文协议、Diff/Patch 安全修改机制。生成代码前阅读。

## 执行增强

### Extractors 提取器规范

具体提取逻辑应优先复用稳定的 Extractor，而不是每次临时编写不一致的脚本。可用提取器包括：

| Extractor | 用途 | 输出 |
|---|---|---|
| `extractSemanticDOM` | 提取语义 DOM 和组件层级 | `semantic_tree` |
| `extractDesignTokens` | 提取 computed style 和视觉变量 | `tokens.json` |
| `extractInteractiveStates` | 记录 hover、focus、click、scroll 状态 | `interactions` |
| `interceptNetworkRequests` | 捕获允许分析的 JSON 请求并推断 Schema | `data_models` |
| `extractSiteMap` | 提取内部页面和导航关系 | `site_map` |
| `extractRuntimeAssets` | 收集图片、字体、动画、模型和音频资源 | `assets` |

Extractor 必须遵守以下规则：

- 输入、输出和失败状态必须明确
- 不抓取不必要的敏感数据、Cookie、Token 或个人信息
- 不能将样本数据直接当作完整 API Schema
- 提取失败时返回部分结果和 `limitations`，不能伪造完整结果
- 复杂脚本应放在 Skill 的 `scripts/` 或 `references/` 目录中，由流程文档调用

每个 Extractor 的标准输出：

```yaml
extractor_result:
  name: "extractSemanticDOM"
  status: "success | partial | failed | unavailable"
  data: {}
  evidence: []
  limitations: []
```

### Advanced 模式共享上下文协议

仅当 Phase 3 选择 `Advanced` 模式时，必须创建 `.layout-clone/shared-context.json`。Simple 模式不创建，Standard 模式按需创建。

```json
{
  "version": "1.0.0",
  "mode": "advanced",
  "strategy": "full-clone",
  "targetProject": {
    "framework": "react",
    "language": "typescript",
    "cssSolution": "existing-project-solution",
    "stateManagement": "existing-solution",
    "animationLibrary": "existing-solution"
  },
  "reference": {
    "analysisPath": ".layout-clone/reference.md",
    "tokensPath": ".layout-clone/tokens.json"
  },
  "planPath": ".layout-clone/implementation-plan.md",
  "components": {},
  "protectedAreas": [],
  "constraints": {
    "noNewDependencies": true,
    "preserveBusinessLogic": true,
    "assignedFilesOnly": true
  }
}
```

子 Agent 必须只修改分配给自己的文件，并返回文件清单、接口要求、依赖和未完成项。主 Agent 负责合并、冲突处理、构建检查和最终验证。

### Diff & Patch 修改安全机制

生成或修改已有项目时，必须优先采用局部修改：

1. 先在 `implementation-plan.md` 中列出文件和修改范围
2. 优先创建独立组件或样式模块
3. 对大型业务文件使用局部 Patch，不得无理由全量覆写
4. 修改前识别 API、认证、路由、全局状态和业务数据边界
5. 修改后检查 diff，确认没有越过 `protected_areas`
6. 输出修改摘要和未解决冲突

如果实现必须修改受保护文件，必须暂停生成并请求用户确认。没有确认时，只能提供补丁建议或在独立文件中实现替代方案。

