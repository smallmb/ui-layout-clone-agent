# 图片与设计稿视觉复刻

> 本文是 skill `ui-layout-clone` 的按需参考文档，仅在 SKILL.md 路由指向此处时阅读。

> 何时读：参考输入为图片/PNG/JPG/WEBP/截图/设计稿时阅读。Image Extraction Phase 的完整流程、输出结构与 Image Evidence 数据契约。

## 目录

- Image Extraction Phase: 图片与设计稿视觉复刻
  - 图片分析流程
  - 图片分析输出结构
  - Image Evidence Layer v1.0
  - 图像工具链能力探测

## Image Extraction Phase: 图片与设计稿视觉复刻

**输入**: PNG、JPG、JPEG、WEBP、GIF、SVG、截图或设计稿图片。

**目标**: 从图片中提取可观察的视觉结构，生成适配目标项目的页面。图片分析只描述可见事实；无法确认的 DOM、交互、API、字体文件和资源来源必须标记为推断或未知。

### 图片分析流程

1. 读取图片尺寸、方向和可用分辨率
2. 分析页面边界、背景、主要区域和视觉层级
3. 识别 Header、Hero、导航、卡片、表单、按钮、列表、Footer 等可见组件
4. 估算颜色、字体层级、间距、圆角、阴影、对齐方式和容器宽度
5. 推断桌面端与移动端可能的重排方式；没有移动端图片时必须标记为推断
6. 将结果写入 `.layout-clone/reference.md`，并记录观察项、推断项和未知项
7. 结合 Phase 2 的目标项目分析生成实现计划
8. 生成代码后按照 Phase 4 的固定视口截图流程进行视觉验证

### 图片分析输出结构

```yaml
image_reference:
  source: "图片路径或上传标识"
  dimensions: "1440x900"
  layout_skeleton: []
  component_inventory: []
  visual_hierarchy: []
  design_system:
    colors: []
    typography: []
    spacing: []
    radius: []
    shadows: []
  observation: []
  inference: []
  unknown: []
  limitations: []
```

如果图片分辨率不足、存在裁切、文字无法识别或包含复杂图形，必须记录在 `limitations` 中，不得用虚构信息补全。

### Image Evidence Layer v1.0

图片模式必须优先生成 `.layout-clone/image-evidence.json`，并遵循 `schemas/image-evidence.schema.json`。该文件是确定性测量、模型解释和后续视觉 Diff 之间的通用数据契约，不绑定电商、SaaS、官网或移动端等具体业务。

执行原则：

- CV 或工具直接测量的内容写入 `observed`
- LLM 或算法推导的内容写入 `inferred`
- 无法从图片确认的内容写入 `unknown`
- 所有推断都必须带 `confidence` 和 `evidence_refs`（如有）
- 所有坐标使用左上角原点和输入图片像素单位
- 图片经过缩放、裁切、去噪或颜色转换时，必须写入 `preprocessing`
- CV 负责测量，LLM 负责语义解释，浏览器负责运行验证，Diff 负责纠偏

标准顶层结构：

```json
{
  "$schema": "./schemas/image-evidence.schema.json",
  "version": "1.0.0",
  "metadata": {
    "source_file": "input.png",
    "viewport": { "width": 1440, "height": 900 },
    "coordinate_system": { "origin": "top-left", "unit": "pixel", "scale": 1 }
  },
  "preprocessing": {},
  "observed": {
    "typography": [],
    "color_palette": [],
    "structural_regions": [],
    "assets": []
  },
  "inferred": {
    "semantic_roles": [],
    "layout_hypotheses": [],
    "design_tokens": {}
  },
  "unknown": [],
  "limitations": []
}
```

OCR 的像素高度不能直接等同于 CSS `font-size`；颜色采样不能单独决定 background、foreground 或 border 语义；边缘检测不能单独决定区域是 Button、Card 还是普通 Container。这些内容必须进入 `inferred` 并保留置信度。

### 图像工具链能力探测

执行图片分析前，先检查本地或服务器是否具备 OCR、图像处理和 Diff 工具。探测结果写入 `image-evidence.json` 的 `toolchain` 字段：

```yaml
toolchain:
  ocr: "available | unavailable | cloud-only"
  image_processing: "available | unavailable"
  pixel_diff: "available | unavailable"
  fallback: []
```

没有 Tesseract、OpenCV、Sharp、pixelmatch 或 SSIM 时，不得假设它们存在；继续执行可用的测量，并记录降级项。

默认调用 `scripts/extract-image-evidence.js` 生成基础证据文件。无第三方依赖时至少提取图片格式、尺寸、文件大小和工具链状态；OCR、颜色采样、区域检测和像素 Diff 通过可选适配器扩展。输出必须通过 `schemas/image-evidence.schema.json` 的必填字段检查。

Phase B 使用 `schemas/visual-diff.schema.json` 记录参考截图、生成截图、差异率、可选 SSIM、区域差异和限制。Schema 先行，不强制当前环境安装特定 PixelMatch、Sharp 或 SSIM 实现。

---

