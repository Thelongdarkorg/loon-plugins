// ============================================================
// 天天基金 —— 开屏素材替换为 1×1 透明图（http-request 阶段）
// ============================================================
// 背景（2026-10-25 第 12 次抓包）：
//   把开屏图 URL 加入 reject-img 后，抓包显示请求确实被拦（无响应体），
//   **但 App 仍显示完整广告** —— 说明图片加载失败后，App 回退了
//   本地缓存 / 内置兜底素材。硬拒（reject / reject-img）这条路走不通。
//
// 正确做法：让 App「加载成功」，但拿到一张 1×1 全透明 PNG：
//   · App 不会回退缓存（它认为图片已就绪）；
//   · 该 URL 的缓存会被这张透明图覆盖，之后渲染即为空白。
//   该方案对应 08:35 版，当时用户实测「开屏广告已被拦住」。
//
// 与 08:35 版的区别（修正其副作用）：
//   08:35 按「无 Referer」判断，误伤了首页那张同样不带 Referer 的图（出现空白块）。
//   本版改为**按 URL 名单精确命中**：只有名单内的批次目录 / 文件 hash 才替换，
//   其余图片一律原样放行，不再依赖 Referer，不会再误伤首页图。
//
// 维护方式：出现新的开屏素材时，把它所属的日期目录加入 DIRS，
//   或把文件名 hash 加入 HASHES 即可（两者取并集）。
//
// Loon 用法（[Script] 段）：
//   http-request ^https?:\/\/j5\.dfcfw\.com\/WG\/conf\/
//     script-path=scripts/tt_splash_1x1.js, tag=天天基金开屏图替换
// ============================================================

(function () {
  var url = ($request && $request.url) || '';

  // 只处理 j5 素材目录下的图片
  if (!/^https?:\/\/j5\.dfcfw\.com\/WG\/conf\/[^?]+\.(?:png|webp|jpg|jpeg)(?:\?.*)?$/i.test(url)) {
    $done({});
    return;
  }

  // ---------- 开屏素材名单 ----------
  // 批次目录（整批拦，应对同批次未知文件）
  var DIRS = [
    '/WG/conf/20261015/'
  ];
  // 精确文件 hash（文件名前缀，命中即拦；跨目录也生效）
  var HASHES = [
    'N0ded877',   // 20261015  834×1005  「EveryClaw 接微信了」
    'N4f64e4d',   // 20261015 1668×2010
    'N8d0fc64',   // 20261015  834×1005
    'Na47e86a'    // 20261015  834×1005
  ];

  var hit = false;
  var i;
  for (i = 0; i < DIRS.length; i++) {
    if (url.indexOf(DIRS[i]) >= 0) { hit = true; break; }
  }
  if (!hit) {
    for (i = 0; i < HASHES.length; i++) {
      if (url.indexOf(HASHES[i]) >= 0) { hit = true; break; }
    }
  }

  if (!hit) {
    $done({});   // 非开屏素材：原样放行（首页图、图标、运营图等）
    return;
  }

  // 命中：返回 1×1 全透明 PNG（70 字节，PIL 已验证 RGBA=(0,0,0,0)）
  $done({
    response: {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store',
        'Content-Length': '70'
      },
      body: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgYGBgAAAABQABeqhXUAAAAABJRU5ErkJggg=='
    }
  });
})();
