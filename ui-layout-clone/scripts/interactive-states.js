/**
 * 记录页面可观察的交互入口和 CSS 状态配置。
 * 该脚本不会主动触发提交、支付或破坏性操作，只提取静态状态线索。
 */
(() => {
  const selectors = [
    'button', '[role="button"]', 'a[href]', 'input', 'textarea', 'select',
    '[role="tab"]', '[role="menuitem"]', 'summary', '[tabindex]'
  ];
  const elements = selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)));
  const unique = [...new Set(elements)];

  // 读取元素的稳定信息，避免保存完整 HTML 或用户输入内容。
  const readElement = (element, index) => {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      index,
      tag: element.tagName.toLowerCase(),
      role: element.getAttribute('role') || undefined,
      type: element.getAttribute('type') || undefined,
      label: (element.getAttribute('aria-label') || element.textContent || '').trim().slice(0, 100),
      href: element.tagName.toLowerCase() === 'a' ? element.getAttribute('href') : undefined,
      disabled: element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true',
      focusable: element.tabIndex >= 0,
      visible: rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden',
      transition: style.transition || 'none',
      cursor: style.cursor || 'auto',
      hasHoverRuleHint: Boolean(style.transition && style.transition !== 'all 0s ease 0s')
    };
  };

  return JSON.stringify({
    extractor: 'extractInteractiveStates',
    status: 'success',
    data: {
      interactiveElements: unique.slice(0, 300).map(readElement),
      eventHints: {
        clickable: unique.filter((element) => element.matches('button, [role="button"], a[href]')).length,
        formControls: unique.filter((element) => element.matches('input, textarea, select')).length,
        tabs: unique.filter((element) => element.matches('[role="tab"]')).length,
        expandable: document.querySelectorAll('details, summary, [aria-expanded]').length
      }
    },
    limitations: [
      'This extractor does not execute user actions or capture hidden application state.',
      'JavaScript event listeners and library-specific variants require runtime inspection.'
    ]
  }, null, 2);
})();
