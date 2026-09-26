// ============================================
// 天天基金 GetAppStartImg 开屏数据清空 (无广告结构化响应)
// ============================================
// 背景 (2026-09-26 第四轮抓包实锤):
//   旧方案 reject-dict 返回 {} → App 解析后缺少 resultCode 等字段 →
//   视为接口异常 → 每轮冷启动重试 3 次 → 最终走 App 内置兜底开屏
//   (素材打进 App 包, 不走网络, 抓包无任何图片请求痕迹 → 无从拦截)。
//
// 本脚本策略: 不拒绝、不返回空壳, 而是返回「结构合法的无广告响应」:
//   保留原响应全部其他字段 (resultCode / message 等), 仅清空
//   datas[] 数组 (开屏图列表) → App 解析成功 + 无任何开屏素材 → 不弹。
//
// 兜底说明: 若 App 本地缓存了旧素材 URL, 由插件 AUTO 块的精确 URL
//   拦截兜住; 若未来服务端变更结构, 本脚本解析失败时原样放行, 无副作用。
// ============================================

if (!$response.body) $done({});
let obj;
try { obj = JSON.parse($response.body); } catch (e) { $done({}); }

try {
  // 已知结构 (2026-09-18 取证): {"resultCode":0, ..., "datas":[{Title, ImgUrl, ...}]}
  if (obj && Array.isArray(obj.datas)) obj.datas = [];
  // 兼容包装层: {"data": {"datas": [...]}}
  if (obj && obj.data && Array.isArray(obj.data.datas)) obj.data.datas = [];
  // 兼容 AdvList 命名
  if (obj && Array.isArray(obj.AdvList)) obj.AdvList = [];
} catch (e) {}

$done({ body: JSON.stringify(obj) });
