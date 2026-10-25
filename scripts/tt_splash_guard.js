// ============================================================
// 天天基金 —— 开屏素材兜底拦截（按图片尺寸比例精确识别）
// ============================================================
// 背景（2026-10-25，第 11~12 次抓包）：
//   ① App 开屏 campaign 内置在安装包/缓存中，接口不下发 URL；逐张 URL 黑名单永远漏。
//   ② 曾按「无 Referer」判断（http-request 阶段），但首页有一处大图也无 Referer，
//     被误伤成透明（用户截图：搜索栏下方、九宫格上方出现空白块）。
//   ⇒ 改用**图片尺寸比例**识别：开屏素材是固定模板，实测两张开屏图：
//        N0ded877 = 834 × 1005  (0.830)
//        N4f64e4d = 1668 × 2010 (0.830)
//      比例均 ≈ 0.83；首页图样本完全不同：
//        750×640 (1.17)、30×30 (1.00)、148×60 (2.47)。
//
// 本脚本（http-response 阶段）：
//   · 仅处理 j5.dfcfw.com/WG/conf/ 下的 PNG；
//   · 解析 IHDR 得到宽高，若 0.78 ≤ 宽/高 ≤ 0.88 **且请求无 Referer**
//     → 判定为开屏素材，返回 1×1 全透明 PNG；
//   · 其余情况（比例不符 / 带 Referer / 非 PNG / 解析失败）→ 原样放行。
//   双条件（比例 + 无 Referer）把误伤概率压到最低。
//
// 为什么不直接 reject：
//   拒绝会让 App 走「加载失败 → 回退本地缓存旧广告图」分支；返回合法透明图则是
//   「加载成功」，App 不会回退，且会把该 URL 的缓存覆盖为透明。
//
// Loon 用法（[Script] 段）：
//   http-response ^https?:\/\/j5\.dfcfw\.com\/WG\/conf\/ script-path=tt_splash_guard.js, requires-body=true, binary-body-mode=true, tag=天天基金开屏图兜底
// ============================================================

(function () {
  var url = ($request && $request.url) || '';
  if (!/^https?:\/\/j5\.dfcfw\.com\/WG\/conf\//i.test(url)) { $done({}); return; }

  // 带 Referer 的页面内图片直接放行（第二重保险）
  var headers = ($request && $request.headers) || {};
  for (var k in headers) {
    if (k.toLowerCase() === 'referer') {
      var v = headers[k];
      if (v && String(v).trim()) { $done({}); return; }
      break;
    }
  }

  var b64 = ($response && $response.body) || '';
  if (!b64 || typeof b64 !== 'string') { $done({}); return; }

  // 轻量 base64 解码（只取前 32 字节，避免大图全量解码）
  var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  function head32(s) {
    var out = [], val = 0, bits = 0;
    for (var i = 0; i < s.length && out.length < 32; i++) {
      var ch = s.charAt(i);
      if (ch === '=') break;
      var idx = ALPHA.indexOf(ch);
      if (idx < 0) continue;
      val = (val << 6) | idx;
      bits += 6;
      if (bits >= 8) { bits -= 8; out.push((val >> bits) & 0xff); }
    }
    return out;
  }

  var h = head32(b64);
  if (h.length < 24) { $done({}); return; }

  // PNG 签名: 89 50 4E 47 0D 0A 1A 0A
  var isPng = (h[0] === 0x89 && h[1] === 0x50 && h[2] === 0x4e && h[3] === 0x47 &&
               h[4] === 0x0d && h[5] === 0x0a && h[6] === 0x1a && h[7] === 0x0a);
  if (!isPng) { $done({}); return; }

  // IHDR: 宽在 16..19，高在 20..23（大端）
  var w = ((h[16] << 24) | (h[17] << 16) | (h[18] << 8) | h[19]) >>> 0;
  var ht = ((h[20] << 24) | (h[21] << 16) | (h[22] << 8) | h[23]) >>> 0;
  if (!w || !ht) { $done({}); return; }

  var ratio = w / ht;
  // 开屏模板比例实测 0.830（834×1005 / 1668×2010）
  if (!(ratio >= 0.78 && ratio <= 0.88)) { $done({}); return; }

  // 命中：返回 1×1 全透明 PNG（RGBA 0,0,0,0，70 字节）
  $done({
    body: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgYGBgAAAABQABeqhXUAAAAABJRU5ErkJggg=='
  });
})();
