# Extractors

该目录包含 `ui-layout-clone` 的标准提取实现。Skill 正文中的内联脚本只作为算法说明和降级参考；运行环境具备文件访问能力时，优先调用这里的脚本。

## 统一约定

每个 Extractor 应返回 JSON 字符串，结构为：

```json
{
  "extractor": "extractor-name",
  "status": "success | partial | failed | unavailable",
  "data": {},
  "evidence": {},
  "limitations": []
}
```

## 运行边界

- `semantic-dom.js`：提取语义 DOM、Shadow DOM、同源 iframe，并记录跨域限制。
- `design-tokens.js`：提取 computed style、CSS Variables、流体 CSS 和主题线索。
- `interactive-states.js`：只提取静态交互线索，不主动触发动作。
- `network-schema.js`：读取宿主写入的 `window.__uiLayoutCloneResponses`，只做脱敏和 Schema 推断。
- `site-map.js`：提取当前 DOM 可见的内部页面和导航关系。

Extractor 不得读取或输出密码、Cookie、Token、Authorization Header 或其他不必要的个人数据。
