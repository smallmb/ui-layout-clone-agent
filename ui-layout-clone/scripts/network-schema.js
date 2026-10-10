/**
 * 分析由页面调用方预先写入 window.__uiLayoutCloneResponses 的 JSON 响应样本。
 * 网络监听器本身应由宿主工具实现，本脚本只负责脱敏和结构推断。
 */
(() => {
  const responses = Array.isArray(window.__uiLayoutCloneResponses)
    ? window.__uiLayoutCloneResponses
    : [];
  const sensitiveKeys = /token|secret|password|cookie|authorization|set-cookie|ssn/i;

  // 递归推断 JSON 类型，同时移除明显的敏感字段和值。
  function infer(value, depth = 0) {
    if (depth > 8) return { type: 'object', truncated: true };
    if (value === null) return { type: 'null' };
    if (Array.isArray(value)) {
      return { type: 'array', itemSchema: value.length ? infer(value[0], depth + 1) : null };
    }
    if (typeof value !== 'object') return { type: typeof value };

    const schema = { type: 'object', properties: {} };
    for (const [key, child] of Object.entries(value)) {
      if (sensitiveKeys.test(key)) {
        schema.properties[key] = { type: 'redacted' };
      } else {
        schema.properties[key] = infer(child, depth + 1);
      }
    }
    return schema;
  }

  const grouped = {};
  for (const response of responses) {
    try {
      const url = new URL(response.url, window.location.href);
      const path = url.pathname;
      if (!grouped[path]) grouped[path] = [];
      grouped[path].push(response);
    } catch {
      // 忽略无法解析的响应 URL，并在限制中说明采集可能不完整。
    }
  }

  const dataModels = {};
  for (const [path, samples] of Object.entries(grouped)) {
    const sample = samples[0] || {};
    dataModels[path] = {
      method: sample.method || 'UNKNOWN',
      status: sample.status || null,
      sampleCount: samples.length,
      schema: infer(sample.body)
    };
  }

  return JSON.stringify({
    extractor: 'interceptNetworkRequests',
    status: responses.length ? 'success' : 'partial',
    data: { data_models: dataModels },
    evidence: { capturedResponseCount: responses.length },
    limitations: [
      'Schemas are inferred from observed samples and are not guaranteed to be complete.',
      'Authentication, cookies, tokens, and other sensitive values are redacted.',
      'Only responses captured by the host network listener are available.'
    ]
  }, null, 2);
})();
