// ============================================================
// 天天基金 —— 开屏素材替换为 1×1 透明图（http-request 阶段）
// ============================================================
// 为什么不用 reject / reject-img：
//   硬拒（或断开）会让 App 判定「图片加载失败」，从而回退到本地缓存 /
//   内置兜底素材 —— 表现为「请求明明被拦了，广告还在」。
//   必须返回一张**合法的图片**，App 才会认为加载成功、不回退缓存。
//
// 命中条件（任一满足即替换为 1×1 全透明 PNG）：
//   A. URL 命中「已知开屏批次目录 / 文件 hash」名单（精确，跨批量兜底）；
//   B. 请求**不带 Referer** —— 实测 App 启动阶段拉取开屏素材时无 Referer，
//      而页面内图片（首页 weex / 九宫格 / 运营位）都带
//      `referer: fund://mp.1234567.com.cn/weex/...`。
//   B 是关键：开屏素材会随 campaign 轮换、批次目录会变（20261015 / 2026102x…），
//   只靠名单永远滞后一批。按「无 Referer」可以覆盖所有**没见过的**新素材。
//
// 范围限制：只处理 j5.dfcfw.com/WG/conf/ 下的图片；
//   /WG/appconf/（功能图标）与其他域名一律不碰。
//
// 已知代价：若某张正常图片也不带 Referer，会被替换为透明（显示空白）。
//   首页顶部那块运营模块（HeadSudokuProduct）已在插件里整模块删除，
//   其 banner 图不会再被请求，因此该处不受影响。
//
// Loon 用法（[Script] 段）：
//   http-request ^https?:\/\/j5\.dfcfw\.com\/WG\/conf\/
//     script-path=scripts/tt_splash_1x1.js, tag=天天基金开屏图替换
// ============================================================

(function () {
  var url = ($request && $request.url) || '';

  // 仅处理 j5 素材目录下的图片
  if (!/^https?:\/\/j5\.dfcfw\.com\/WG\/conf\/[^?]+\.(?:png|webp|jpg|jpeg)(?:\?.*)?$/i.test(url)) {
    $done({});
    return;
  }

  // ---------- 条件 A：已知开屏素材名单 ----------
  var DIRS = [
    '/WG/conf/20261015/'
  ];
  var HASHES = [
    'N0ded877',   // 20261015  834×1005
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

  // ---------- 条件 B：无 Referer（覆盖未知批次的新素材）----------
  if (!hit) {
    var headers = ($request && $request.headers) || {};
    var hasReferer = false;
    for (var k in headers) {
      if (k.toLowerCase() === 'referer') {
        if (String(headers[k] || '').trim()) { hasReferer = true; }
        break;
      }
    }
    if (!hasReferer) { hit = true; }
  }

  if (!hit) {
    $done({});   // 页面内图片：原样放行
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
