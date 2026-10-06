// ============================================================
// 东风本田 App —— 禁用开屏启动视频（恢复默认静态启动图）
// ============================================================
// 抓包分析（2026-10-06）：
//   接口 api.dongfeng-honda.com/appv3/api ，请求体 {"codes":"icon_switch"}
//   响应：
//     {"dataList":[{"code":"icon_switch",
//       "description":"启动图标切换\niconType图片切换的id，launchType 启动图切换id\n
//                      needChange:1是可以动态切换 0是禁用动态切换恢复默认图标",
//       "value":"{\"iconType\":\"default\",\"needChange\":\"1\",\"launchType\":\"pet_crv\"}"}],
//      "msg":"SUCCESS","result":1}
//
//   关键点：
//     · launchType = 「启动图切换 id」（本例 pet_crv），App 据此加载对应的
//       动态启动图（用户看到的就是开屏视频/动态画面）；
//     · needChange = 是否允许动态切换，官方描述明确：0 = 禁用动态切换、恢复默认图标。
//     · 整轮抓包中没有任何视频文件下载请求 → 启动视频为 App 内置资源，
//       按 launchType 选择播放，因此拦 URL 无效，必须在配置层关闭动态切换。
//
// 本脚本行为：
//   仅当响应中存在 code === 'icon_switch' 时才改写（把 value 内的
//   needChange 置为 0、launchType 置空 → App 回落默认静态启动图）；
//   其余任何响应（包括本接口下的其它业务数据）**原样放行、不重新序列化**，
//   避免大整数精度丢失与无谓的性能开销。
//
// ⚠️ 该接口是 App 的统一 API 入口（/appv3/api），脚本会对该入口的每个响应执行，
//    但只有命中 icon_switch 才会改写。
//
// Loon 用法（[Script] 段）：
//   http-response ^https?:\/\/api\.dongfeng-honda\.com\/appv3\/api script-path=dfb_launch_strip.js, requires-body=true
// ============================================================

(function () {
  if (!$response.body) { $done({}); return; }

  let obj;
  try { obj = JSON.parse($response.body); } catch (e) { $done({}); return; }

  let modified = false;
  try {
    const list = obj && obj.dataList;
    if (Array.isArray(list)) {
      for (const item of list) {
        if (!item || item.code !== 'icon_switch') continue;

        let v;
        if (typeof item.value === 'string') {
          try { v = JSON.parse(item.value); } catch (e) { v = {}; }
        } else if (item.value && typeof item.value === 'object') {
          v = item.value;
        } else {
          v = {};
        }
        if (!v || typeof v !== 'object') v = {};

        if (v.iconType === undefined) v.iconType = 'default'; // 保留原图标设置，仅缺失时补默认
        v.needChange = '0';   // 官方语义：0 = 禁用动态切换，恢复默认图标/启动图
        v.launchType = '';    // 清空启动图切换 id，避免按 id 加载动态启动图

        item.value = JSON.stringify(v);
        modified = true;
      }
    }
  } catch (e) {}

  // 只有真正改写了才回写 body；否则原样放行
  if (modified) $done({ body: JSON.stringify(obj) });
  else $done({});
})();
