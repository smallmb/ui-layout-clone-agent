/**
 * 提取当前站点的内部页面和导航关系，统一输出 site_map 字段。
 * 该脚本只保留当前 origin 下的普通页面链接。
 */
(() => {
  const origin = window.location.origin;
  const normalize = (href) => {
    try {
      const url = new URL(href, window.location.href);
      url.hash = '';
      return url;
    } catch {
      return null;
    }
  };

  const collectLinks = (root) => Array.from(root.querySelectorAll('a[href]'))
    .map((anchor) => {
      const url = normalize(anchor.href);
      return url ? {
        url,
        label: (anchor.textContent || '').trim().slice(0, 100)
      } : null;
    })
    .filter((item) => item && item.url.origin === origin)
    .filter((item) => !item.url.pathname.startsWith('/api/'))
    .filter((item) => !item.url.pathname.startsWith('/cdn/'));

  const allLinks = collectLinks(document);
  const unique = [...new Map(allLinks.map((item) => [item.url.href, item])).values()];
  const navRoot = document.querySelector('nav, [role="navigation"], header');
  const footerRoot = document.querySelector('footer, [role="contentinfo"]');

  // 将 URL 转为相对路径，避免把域名写入生成项目的导航配置。
  const toPage = (item) => ({
    path: item.url.pathname || '/',
    title: item.label,
    depth: item.url.pathname.split('/').filter(Boolean).length
  });

  return JSON.stringify({
    extractor: 'extractSiteMap',
    status: 'success',
    data: {
      site_map: {
        baseUrl: origin,
        pages: unique.map(toPage).sort((a, b) => a.depth - b.depth || a.path.localeCompare(b.path)),
        navigation: {
          primary: navRoot ? collectLinks(navRoot).map(toPage) : [],
          footer: footerRoot ? collectLinks(footerRoot).map(toPage) : []
        }
      }
    },
    limitations: [
      'Only links present in the current DOM are collected.',
      'Client-side routes, hidden menus, and authenticated pages may be missing.'
    ]
  }, null, 2);
})();
