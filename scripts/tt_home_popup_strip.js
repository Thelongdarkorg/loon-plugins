// tt_home_popup_strip.js — 自托管脚本：删除天天基金 GetAppHome 响应里的 HomePopupAd 全屏弹窗模块
//
// 背景（2026-09-26 两次真机抓包）：
//   天天基金新版把「开屏式全屏弹窗」并入 appconfig2.1234567.com.cn/config/GetAppHome
//   → datas.SpecialModules[]（ModuleCode=HomePopupAd，ModuldType=94，
//     含 ImgUrl / IntervalDay=7（每 7 天弹一次）/ StartTime~EndTime 活动期）。
//   素材提前缓存本地、冷启动无图片下载请求 → 拦 URL 无效，必须在决策层删除该模块。
//
// 行为：只删 ModuleCode === 'HomePopupAd' 的模块；
//   搜索热词(SearchHotWordHome)、10 个首页 Module 等其余数据原样保留；
//   响应不是 JSON / 结构异常时原样放行，绝不误伤。
// 零第三方依赖、零外联、可逐行审计。
//
// Loon 用法（[Script] 段）：
//   http-response ^https?:\/\/appconfig2\.1234567\.com\.cn\/config\/GetAppHome script-path=tt_home_popup_strip.js, requires-body=true

if (!$response.body) $done({});
let obj;
try { obj = JSON.parse($response.body); } catch (e) { $done({}); }

try {
  const sm = obj && obj.datas && obj.datas.SpecialModules;
  if (Array.isArray(sm)) {
    obj.datas.SpecialModules = sm.filter(m => m && m.ModuleCode !== 'HomePopupAd');
  }
} catch (e) {}

$done({ body: JSON.stringify(obj) });
