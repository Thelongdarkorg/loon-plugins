// ============================================================
// 天天基金 —— 开屏素材兜底拦截（按图片尺寸比例精确识别）
// ============================================================
// 背景（2026-10-25，抓包 1~4）：
//   ① App 开屏 campaign 内置在安装包/缓存里，接口不下发 URL；
//      逐张 URL 黑名单永远落后于 campaign 轮换。
//   ② 开屏素材是固定模板：实测 4 张全部为 834×1005 或 1668×2010，宽高比 0.830；
//      首页图片样本：750×640(1.17)、30×30(1.00)、148×60(2.47)、420×230(1.83)。
//   ③ 曾按「无 Referer」判断，误伤首页一张无 Referer 的大图（用户截图空白）→ 废弃。
//
// ⚠️ 2026-10-25 08:45 版失效原因（已修正）：
//    Loon 文档：`binary-body-mode=true` 时 `$response.body` 是 **Uint8Array**（不是 base64 字符串）。
//    上一版按 base64 字符串解析（charAt / indexOf），对 Uint8Array 直接抛错 →
//    脚本异常 → Loon 原样放行 → 开屏图（0.83 比例）也被放行。
//    ✅ 本版按 Uint8Array 读取前 24 字节，返回值也用 Uint8Array 构造。
//
// 逻辑：
//   · 只处理 j5.dfcfw.com/WG/conf/ 下的响应；
//   · 带 Referer 的页面内图片 → 放行（第二重保险）；
//   · PNG 宽高比 0.78~0.88 且无 Referer → 判定为开屏素材，
//     返回 1×1 全透明 PNG（Uint8Array，70 字节，RGBA 0,0,0,0）；
//   · 其余一律原样放行。
//
// 为什么不 reject：拒绝会让 App 走「加载失败 → 回退本地缓存旧广告图」；
//   返回合法透明图则是「加载成功」，不会回退，且会把该 URL 的缓存覆盖为透明。
//
// Loon 用法（[Script] 段）：
//   http-response ^https?:\/\/j5\.dfcfw\.com\/WG\/conf\/ script-path=tt_splash_guard.js, requires-body=true, binary-body-mode=true, tag=天天基金开屏图兜底
// ============================================================

(function () {
  var url = ($request && $request.url) || '';
  if (!/^https?:\/\/j5\.dfcfw\.com\/WG\/conf\//i.test(url)) { $done({}); return; }

  // 带 Referer 的页面内图片直接放行
  var headers = ($request && $request.headers) || {};
  for (var k in headers) {
    if (k.toLowerCase() === 'referer') {
      var v = headers[k];
      if (v && String(v).trim()) { $done({}); return; }
      break;
    }
  }

  // binary-body-mode=true → $response.body 为 Uint8Array（Loon 文档明确）
  var body = ($response && $response.body) || null;
  if (!body) { $done({}); return; }

  var h = body;
  if (typeof body === 'string') {
    // 极端情况下（未按 binary 模式返回）做二进制字符串兜底
    h = [];
    for (var i = 0; i < Math.min(24, body.length); i++) h.push(body.charCodeAt(i) & 0xff);
  }
  if (!h || h.length < 24) { $done({}); return; }

  // PNG 签名 89 50 4E 47 0D 0A 1A 0A
  if (!(h[0] === 0x89 && h[1] === 0x50 && h[2] === 0x4e && h[3] === 0x47 &&
        h[4] === 0x0d && h[5] === 0x0a && h[6] === 0x1a && h[7] === 0x0a)) {
    $done({});
    return;
  }

  // IHDR：宽 16..19，高 20..23（大端）
  var w = ((h[16] << 24) | (h[17] << 16) | (h[18] << 8) | h[19]) >>> 0;
  var ht = ((h[20] << 24) | (h[21] << 16) | (h[22] << 8) | h[23]) >>> 0;
  if (!w || !ht) { $done({}); return; }

  var ratio = w / ht;
  // 开屏模板实测 0.830（834×1005 / 1668×2010）
  if (!(ratio >= 0.78 && ratio <= 0.88)) { $done({}); return; }

  // 命中：返回 1×1 全透明 PNG（RGBA 0,0,0,0）
  $done({
    body: new Uint8Array([
      137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
      0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137,
      0, 0, 0, 13, 73, 68, 65, 84, 120, 218, 99, 96, 96, 96, 96,
      0, 0, 0, 5, 0, 1, 122, 168, 87, 80, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
    ])
  });
})();
