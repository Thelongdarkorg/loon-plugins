// tt_home_popup_strip.js — 自托管脚本：删除天天基金 GetAppHome 响应里的开屏/弹窗广告数据
//
// 背景（2026-09-26 五轮真机抓包 + 开屏截图比对，数据源实锤）：
//
// 【通道 1】datas.SpecialModules[] 里 ModuleCode=HomePopupAd（ModuldType=94）
//   首页全屏弹窗（ImgUrl / IntervalDay=7 / 活动期），素材缓存本地。
//
// 【通道 2】datas.Modules[] 里 ModuleCode=HeadSudokuProduct（首页头部九宫格）
//   的 AdItems[] 数组 —— ★ 冷启动开屏广告的真正数据源 ★
//   证据链（2026-09-26 08:17 用户开屏截图 × 3 与接口数据逐条比对）：
//     - AdItems 条目 BckgrndImg（750×640 横图 + ColorValue 背景色 + ActivityLink）
//       与开屏截图逐像素吻合（"天天skills全面升级"= Ne0f…png，ColorValue #FF4D4D 红底吻合）；
//     - 每次冷启动按 Weight/Sort 轮换一条全屏渲染，
//       "点此跳转详情页"按钮即条目的 ActivityLink（skills / low-code 活动页）；
//     - 删除 HomePopupAd 后开屏依旧 → 开屏不走 HomePopupAd，走 AdItems。
//   清空 AdItems 即掐断开屏素材与跳转链接；Items（活期宝等正常功能格子）原样保留。
//
// 行为：
//   1) SpecialModules 里删除 HomePopupAd；
//   2) HeadSudokuProduct 的 AdItems 清空（Items 正常格子不动）；
//   响应不是 JSON / 结构异常时原样放行，绝不误伤。
// 零第三方依赖、零外联、可逐行审计。
//
// Loon 用法（[Script] 段）：
//   http-response ^https?:\/\/appconfig2\.1234567\.com\.cn\/config\/GetAppHome script-path=tt_home_popup_strip.js, requires-body=true

if (!$response.body) $done({});
let obj;
try { obj = JSON.parse($response.body); } catch (e) { $done({}); }

try {
  // 通道 1：HomePopupAd 全屏弹窗模块
  const sm = obj && obj.datas && obj.datas.SpecialModules;
  if (Array.isArray(sm)) {
    obj.datas.SpecialModules = sm.filter(m => m && m.ModuleCode !== 'HomePopupAd');
  }

  // 通道 2：HeadSudokuProduct.AdItems —— 冷启动开屏广告数据源（2026-09-26 实锤）
  const mods = obj && obj.datas && obj.datas.Modules;
  if (Array.isArray(mods)) {
    for (const m of mods) {
      if (m && m.ModuleCode === 'HeadSudokuProduct' && Array.isArray(m.AdItems)) {
        m.AdItems = [];
      }
    }
  }
} catch (e) {}

$done({ body: JSON.stringify(obj) });
