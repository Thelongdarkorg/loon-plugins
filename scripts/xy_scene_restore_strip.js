// xy_scene_restore_strip.js — 自托管脚本：改写闲鱼开屏决策口 scene.restore，阻止每日开屏弹窗
//
// 背景（2026-09-25 真机抓包）：
//   闲鱼冷启动开屏不走素材下载接口（素材本地缓存），
//   而是请求 acs.m.goofish.com/gw/mtop.idle.idleadv.scene.restore
//   （restoreStage=appLaunch，携带本地缓存的一批广告素材 caidListStr），
//   服务端返回 data.trackParams.stageMatch="true" 即允许渲染本地缓存的开屏图。
//   服务端频控按自然日重置 → 每天 0 点后首次冷启动必弹一次。
//
// 行为：把 data.trackParams.stageMatch 改写为 "false"（App 明确收到「场景不匹配」→ 不展示）；
//   响应非 JSON / 结构异常时原样放行，绝不误伤。零第三方依赖、零外联、可逐行审计。
//
// Loon 用法（[Script] 段）：
//   http-response ^https?:\/\/acs\.m\.goofish\.com\/gw\/mtop\.idle\.idleadv\.scene\.restore\/ script-path=xy_scene_restore_strip.js, requires-body=true

if (!$response.body) $done({});
let obj;
try { obj = JSON.parse($response.body); } catch (e) { $done({}); }

try {
  const tp = obj && obj.data && obj.data.trackParams;
  if (tp && typeof tp === 'object') tp.stageMatch = 'false';
} catch (e) {}

$done({ body: JSON.stringify(obj) });
