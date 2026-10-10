/**
 * 从代表性页面节点提取 computed style，生成可审计的视觉变量摘要。
 * 结果是提取摘要，不能替代参考项目的原始设计令牌文件。
 */
(() => {
  const selectors = [
    'header', 'nav', 'main', 'aside', 'footer', 'section', 'article',
    'h1', 'h2', 'h3', 'h4', 'button', 'a', 'input',
    '[class*="card" i]', '[class*="modal" i]', '[class*="sidebar" i]'
  ];
  const values = {
    colors: new Set(),
    fontFamilies: new Set(),
    fontSizes: new Set(),
    fontWeights: new Set(),
    spacing: new Set(),
    radius: new Set(),
    shadows: new Set(),
    cssVariables: new Set(),
    fluidValues: new Set(),
    containerQueries: new Set(),
    themes: new Set()
  };

  // 将 CSS 复合值中的像素尺寸拆出，便于形成间距候选值。
  function collectPixels(value) {
    return (value.match(/\d+(?:\.\d+)?px/g) || []).forEach((item) => values.spacing.add(item));
  }

  // 保留 rem、em、clamp 等原始 CSS 线索，避免 computed style 抹平流体设计意图。
  function collectModernCssValue(value) {
    (value.match(/(?:clamp|min|max)\([^)]*\)|\d+(?:\.\d+)?(?:rem|em|vw|vh|%)\b/g) || [])
      .forEach((item) => values.fluidValues.add(item));
  }

  // 读取当前可访问样式表中的变量、容器查询和主题选择器。
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules || [])) {
        const text = rule.cssText || '';
        (text.match(/--[a-zA-Z0-9_-]+\s*:\s*[^;]+/g) || [])
          .forEach((item) => values.cssVariables.add(item.trim()));
        if (text.includes('@container')) values.containerQueries.add(text.slice(0, 300));
        if (text.includes('prefers-color-scheme') || /data-theme\s*=/.test(text)) {
          values.themes.add(text.slice(0, 300));
        }
        collectModernCssValue(text);
      }
    } catch {
      // 跨域样式表不可读取时保留限制信息，不中断其他样式表分析。
    }
  }

  for (const selector of selectors) {
    for (const element of Array.from(document.querySelectorAll(selector)).slice(0, 8)) {
      const style = window.getComputedStyle(element);
      if (style.color && style.color !== 'rgb(0, 0, 0)') values.colors.add(style.color);
      if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        values.colors.add(style.backgroundColor);
      }
      if (style.fontFamily) values.fontFamilies.add(style.fontFamily.split(',')[0].replace(/"/g, '').trim());
      if (style.fontSize) values.fontSizes.add(style.fontSize);
      if (style.fontWeight) values.fontWeights.add(style.fontWeight);
      if (style.borderRadius && style.borderRadius !== '0px') values.radius.add(style.borderRadius);
      if (style.boxShadow && style.boxShadow !== 'none') values.shadows.add(style.boxShadow);
      collectPixels(`${style.padding} ${style.margin} ${style.gap}`);
      collectModernCssValue(`${style.fontSize} ${style.lineHeight} ${style.width} ${style.height}`);
    }
  }

  // 使用稳定排序，保证同一页面多次提取时结果容易比较。
  const sortValues = (set) => Array.from(set).sort((a, b) => {
    const aNumber = parseFloat(a);
    const bNumber = parseFloat(b);
    return Number.isNaN(aNumber) || Number.isNaN(bNumber) ? a.localeCompare(b) : aNumber - bNumber;
  });

  return JSON.stringify({
    extractor: 'extractDesignTokens',
    status: 'success',
    evidence: { selectors, sampledElementsPerSelector: 8 },
    data: {
      tokens: {
        color: Object.fromEntries(sortValues(values.colors).map((value, index) => [
          index === 0 ? 'primary' : `color-${index}`, { '$type': 'color', '$value': value }
        ])),
        typography: {
          fontFamily: sortValues(values.fontFamilies).map((value) => ({ '$type': 'fontFamily', '$value': value })),
          fontSize: sortValues(values.fontSizes).map((value) => ({ '$type': 'dimension', '$value': value })),
          fontWeight: sortValues(values.fontWeights).map((value) => ({ '$type': 'fontWeight', '$value': value }))
        },
        spacing: Object.fromEntries(sortValues(values.spacing).map((value, index) => [
          `space-${index}`, { '$type': 'dimension', '$value': value }
        ])),
        borderRadius: Object.fromEntries(sortValues(values.radius).map((value, index) => [
          `radius-${index}`, { '$type': 'dimension', '$value': value }
        ])),
        boxShadow: Object.fromEntries(sortValues(values.shadows).map((value, index) => [
          `shadow-${index}`, { '$type': 'shadow', '$value': value }
        ])),
        cssVariables: sortValues(values.cssVariables),
        fluidValues: sortValues(values.fluidValues),
        containerQueries: sortValues(values.containerQueries),
        themes: sortValues(values.themes)
      },
      rawValues: {
        colors: sortValues(values.colors),
        fontFamilies: sortValues(values.fontFamilies),
        fontSizes: sortValues(values.fontSizes),
        fontWeights: sortValues(values.fontWeights),
        spacing: sortValues(values.spacing),
        radius: sortValues(values.radius),
        shadows: sortValues(values.shadows)
      }
    },
    limitations: [
      'Values are sampled from computed styles and may not represent the original token source.',
      'Dynamic, hidden, iframe, and shadow-DOM styles may be incomplete.',
      'Cross-origin stylesheets may not be readable due to browser security policy.'
    ]
  }, null, 2);
})();
