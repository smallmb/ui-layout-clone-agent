/**
 * 提取页面中的语义化 DOM 树，过滤无意义的包装节点。
 * 该脚本可在浏览器控制台、Playwright 或其他页面脚本环境中执行。
 */
(() => {
  const semanticTags = new Set([
    'header', 'nav', 'main', 'aside', 'footer', 'section', 'article',
    'form', 'button', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'input', 'textarea', 'select', 'img', 'video', 'canvas', 'svg'
  ]);
  const semanticRoles = new Set([
    'banner', 'navigation', 'main', 'complementary', 'contentinfo',
    'button', 'link', 'dialog', 'menu', 'menuitem', 'tab', 'tabpanel',
    'search', 'form', 'list', 'listitem', 'heading', 'img'
  ]);

  const limitations = [];

  // 提取节点的稳定属性，避免复制大量编译产物 class。
  function extractNode(element, depth = 0) {
    if (!element || element.nodeType !== 1 || depth > 10) return null;

    const tag = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const isSemantic = semanticTags.has(tag) || semanticRoles.has(role);
    if (!isSemantic && depth > 2) return null;

    const node = {
      tag,
      role: role || undefined,
      id: element.id || undefined,
      ariaLabel: element.getAttribute('aria-label') || undefined,
      text: undefined,
      attributes: {},
      children: []
    };

    // 只保留对还原交互和语义有帮助的属性。
    for (const name of ['type', 'name', 'placeholder', 'href', 'alt', 'value']) {
      const value = element.getAttribute(name);
      if (value) node.attributes[name] = value.slice(0, 200);
    }

    const directText = Array.from(element.childNodes)
      .filter((child) => child.nodeType === 3)
      .map((child) => child.textContent.trim())
      .filter(Boolean)
      .join(' ')
      .slice(0, 200);
    if (directText) node.text = directText;

    for (const child of element.children) {
      const childNode = extractNode(child, depth + 1);
      if (childNode) node.children.push(childNode);
    }

    // 同时遍历可访问的 Shadow DOM；闭合 ShadowRoot 不会暴露给脚本。
    if (element.shadowRoot) {
      for (const child of element.shadowRoot.children) {
        const childNode = extractNode(child, depth + 1);
        if (childNode) node.children.push(childNode);
      }
    }

    // 仅尝试读取同源 iframe；跨域 iframe 按浏览器安全策略记录为限制。
    if (element.tagName.toLowerCase() === 'iframe') {
      try {
        const frameDocument = element.contentDocument;
        if (frameDocument?.body) {
          const frameNode = extractNode(frameDocument.body, depth + 1);
          if (frameNode) node.children.push(frameNode);
        }
      } catch {
        limitations.push('A cross-origin iframe could not be inspected.');
      }
    }

    if (!node.role) delete node.role;
    if (!node.id) delete node.id;
    if (!node.ariaLabel) delete node.ariaLabel;
    if (!node.text) delete node.text;
    if (!Object.keys(node.attributes).length) delete node.attributes;
    if (!node.children.length) delete node.children;
    return node;
  }

  return JSON.stringify({
    extractor: 'extractSemanticDOM',
    status: limitations.length ? 'partial' : 'success',
    data: { semantic_tree: extractNode(document.body) },
    limitations
  }, null, 2);
})();
