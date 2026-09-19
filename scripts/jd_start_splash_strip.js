// jd_start_splash_strip.js — 自托管「京东启动/开屏广告」剥离脚本
//
// 来源与可信度：
//   真实字段名提取自社区已验证脚本 RuCu6/QuanX jingdong.js（Moli-X/Tool 维护版
//   Loon/Plugin/Kelee/Script/JD_remove_ads.js，2026-06 版本）。
//   所有删除字段均对照真实响应结构，非猜测。
//
// 作用域（仅处理启动/开屏/首页相关接口，不碰比价/订单等业务）：
//   functionId=start        → 开屏大图列表 images[] + 每日展示次数 showTimesDaily
//   functionId=welcomeHome  → 首屏浮层/悬浮推广（落在首屏，常被当成「开屏后又弹」）
//   functionId=deliverLayer → 物流页顶部 banner 推广（与开屏同源）
//
// 设计：只删广告字段、保留其余启动数据，避免 reject-dict 返回 {} 搞崩 App 启动。
// 零第三方依赖，全部逻辑可逐行审计。不引用 rucu6.pages.dev / 任何外部域名。
//
// Loon 用法：
//   http-response ^https://api\.m\.jd\.com/client\.action\?functionId=(start|welcomeHome|deliverLayer) script-path=jd_start_splash_strip.js, requires-body=true

const url = $request.url;
if (!$response.body) $done({});
let obj;
try { obj = JSON.parse($response.body); } catch (e) { $done({}); return; }

if (url.includes("functionId=start")) {
  // 开屏广告：开屏大图列表 + 每日展示次数上限
  if (obj && Array.isArray(obj.images) && obj.images.length > 0) obj.images = [];
  if (obj && obj.showTimesDaily) obj.showTimesDaily = 0;
} else if (url.includes("functionId=welcomeHome")) {
  // 首页浮层推广（落在首屏，易被当成「开屏后又弹」）
  if (obj && Array.isArray(obj.floorList) && obj.floorList.length > 0) {
    const delTypes = ["bottomXview", "float", "photoCeiling", "ruleFloat", "searchIcon", "topRotate", "tabBarAtmosphere"];
    obj.floorList = obj.floorList.filter(i => !delTypes.includes(i && i.type));
  }
  if (obj && Array.isArray(obj.webViewFloorList) && obj.webViewFloorList.length > 0) obj.webViewFloorList = [];
} else if (url.includes("functionId=deliverLayer")) {
  // 物流页顶部 banner 推广
  if (obj && obj.bannerInfo) delete obj.bannerInfo;
  if (obj && Array.isArray(obj.floors) && obj.floors.length > 0) {
    obj.floors = obj.floors.filter(i => !["banner", "jdDeliveryBanner"].includes(i && i.mId));
  }
}

$done({ body: JSON.stringify(obj) });
