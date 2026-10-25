// ============================================================
// 天天基金 —— 开屏素材兜底拦截（按请求特征，覆盖未知 campaign）
// ============================================================
// 背景（2026-10-25 第 11 次抓包）：
//   App 的开屏 campaign 列表内置在安装包/本地缓存里，接口不下发 URL。
//   已实测：
//     · 开屏图请求（N0ded877、N4f64e4d 两张，均为 1668×2010 同比例）
//       **不带 Referer**，且 URL 不在 GetAppHome 响应中；
//     · 页面内图片（首页 weex / 九宫格等）请求**带 Referer**
//       （referer: fund://mp.1234567.com.cn/weex/...）。
//   ⇒ 仅靠「逐张 URL 黑名单」永远只能拦住见过的图，清缓存后 App 换一张就漏。
//      本脚本按请求特征补一道兜底：j5 素材目录 + 无 Referer → 判定为开屏素材。
//
// 行为：
//   · URL 不是 j5.dfcfw.com/WG/conf/ 下的图片 → 原样放行；
//   · 带 Referer（页面内图片）→ 原样放行；
//   · 无 Referer → 返回 1×1 透明 PNG（不是拒绝！）
//     理由：返回合法图片，App 判定「加载成功」，不会回退本地缓存的旧广告图，
//     还会把该 URL 的缓存覆盖为透明图，渲染结果为空白。
//     （用 reject 硬失败反而会触发 App「加载失败→用缓存图」分支，实测吃了这个亏。）
//
// ⚠️ 已知风险：若 App 存在「不带 Referer 请求的正常图片」（如后台预加载），
//    会被误判为开屏素材而显示为透明。当前 3 次抓包的样本中未出现该情况。
//    如发现某处正常图片缺失，把该图 URL 告诉我，可在脚本里加白名单。
//
// Loon 用法（[Script] 段）：
//   http-request ^https?:\/\/j5\.dfcfw\.com\/WG\/conf\/ script-path=tt_splash_guard.js, tag=天天基金开屏图兜底
// ============================================================

(function () {
  var url = ($request && $request.url) || '';

  // 只处理 j5 素材目录下的图片文件
  if (!/^https?:\/\/j5\.dfcfw\.com\/WG\/conf\/[^?]+\.(?:png|webp|jpg|jpeg)(?:\?.*)?$/i.test(url)) {
    $done({});
    return;
  }

  // 判断是否带 Referer（HTTP/2 头名可能为小写，统一 toLowerCase）
  var headers = ($request && $request.headers) || {};
  var hasReferer = false;
  for (var k in headers) {
    if (k.toLowerCase() === 'referer') {
      var v = headers[k];
      if (v && String(v).trim()) hasReferer = true;
      break;
    }
  }

  if (hasReferer) {
    // 页面内图片（首页 weex / 九宫格等）：放行
    $done({});
    return;
  }

  // 无 Referer：判定为开屏素材，返回 1×1 透明 PNG
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
