#!/usr/bin/env node
/**
 * 生成通用 image-evidence.json 的无依赖基础提取器。
 * 图片尺寸和工具链状态可以在没有第三方包时获取；OCR、颜色采样和高级区域检测按能力降级。
 */
const fs = require('fs');
const path = require('path');

function hasModule(name) {
  try {
    require.resolve(name);
    return true;
  } catch {
    return false;
  }
}

// 读取常见图片格式的像素尺寸，避免基础模式依赖第三方库。
function readDimensions(buffer, extension) {
  if (extension === '.png' && buffer.toString('ascii', 1, 4) === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (extension === '.gif' && buffer.toString('ascii', 0, 3) === 'GIF') {
    return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }
  if (extension === '.webp' && buffer.toString('ascii', 0, 4) === 'RIFF') {
    const width = buffer.readUIntLE(24, 3) + 1;
    const height = buffer.readUIntLE(27, 3) + 1;
    return { width, height };
  }
  if (extension === '.jpg' || extension === '.jpeg') {
    for (let offset = 2; offset + 9 < buffer.length;) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc3) {
        return {
          width: buffer.readUInt16BE(offset + 7),
          height: buffer.readUInt16BE(offset + 5)
        };
      }
      offset += Math.max(length + 2, 2);
    }
  }
  return null;
}

function createEvidence(sourceFile) {
  const extension = path.extname(sourceFile).toLowerCase();
  const buffer = fs.readFileSync(sourceFile);
  const dimensions = readDimensions(buffer, extension);
  const toolchain = {
    ocr: hasModule('tesseract.js') ? 'available' : 'unavailable',
    image_processing: hasModule('sharp') ? 'available' : 'unavailable',
    pixel_diff: hasModule('pixelmatch') || hasModule('ssim.js') ? 'available' : 'unavailable',
    fallback: []
  };
  if (toolchain.ocr === 'unavailable') toolchain.fallback.push('OCR is unavailable; typography evidence requires an external OCR adapter.');
  if (toolchain.image_processing === 'unavailable') toolchain.fallback.push('Advanced color and region sampling is unavailable; only metadata was extracted.');
  if (toolchain.pixel_diff === 'unavailable') toolchain.fallback.push('Pixel diff engines are unavailable; visual-diff execution is deferred.');

  return {
    $schema: './schemas/image-evidence.schema.json',
    version: '1.0.0',
    metadata: {
      source_file: path.resolve(sourceFile),
      viewport: dimensions || { width: 0, height: 0 },
      coordinate_system: { origin: 'top-left', unit: 'pixel', scale: 1 },
      format: extension.replace('.', '') || 'unknown',
      byte_size: buffer.length
    },
    preprocessing: { resized: false, cropped: false, denoised: false, color_profile: 'unknown', operations: [] },
    toolchain,
    observed: { typography: [], color_palette: [], structural_regions: [], assets: [] },
    inferred: { semantic_roles: [], layout_hypotheses: [], design_tokens: {} },
    unknown: ['OCR text and bounding boxes', 'Exact colors and region geometry', 'Semantic component roles'],
    limitations: ['The dependency-free mode extracts metadata only. Add optional adapters for OCR and pixel analysis.']
  };
}

function main() {
  const input = process.argv[2];
  const output = process.argv[3] || path.resolve('image-evidence.json');
  if (!input) {
    console.error('Usage: node extract-image-evidence.js <image-path> [output-path]');
    process.exitCode = 2;
    return;
  }
  if (!fs.existsSync(input)) {
    console.error(`Image file does not exist: ${input}`);
    process.exitCode = 1;
    return;
  }
  const evidence = createEvidence(input);
  fs.writeFileSync(output, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
  console.log(`Image evidence written to ${output}`);
}

main();
