# 🍟 规则列表

| 序号 | 名称 | Loon 链接 | 备注 |
|:--:|:--|:--|:--|
| 1 | 京东去广告 | [Raw 链接](https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/jd_splash_ad_block.plugin) ｜ [一键导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2FThelongdarkorg%2Floon-plugins%2Fmain%2Fjd_splash_ad_block.plugin) | 京东 App 全量去广告（开屏 / 首页 / 购物车 / 推荐 / 极速版等）；纯本地规则，零远程脚本、不上报、不联网；需开启 MITM 并信任证书 |
| 2 | B站去广告 | [Raw 链接](https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/bilibili_splash_ad_block.plugin) ｜ [一键导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2FThelongdarkorg%2Floon-plugins%2Fmain%2Fbilibili_splash_ad_block.plugin) | 过滤 B站 App 广告（开屏 / 首页推荐 / 竖屏流 / 直播间 / 播放页推广位等）；纯本地规则，零远程脚本、不上报、不联网；需开启 MITM 并信任证书 |
| 3 | 淘宝去广告 | [Raw 链接](https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/taobao_splash_ad_block.plugin) ｜ [一键导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2FThelongdarkorg%2Floon-plugins%2Fmain%2Ftaobao_splash_ad_block.plugin) | 过滤淘宝 / 闲鱼 App 广告（广告下发接口 / 广告图直链 / 开屏 / 埋点统计域名）；纯本地规则，零远程脚本、不上报、不联网；需开启 MITM 并信任证书 |
| 4 | 知乎去广告 | [Raw 链接](https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/zhihu_splash_ad_block.plugin) ｜ [一键导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2FThelongdarkorg%2Floon-plugins%2Fmain%2Fzhihu_splash_ad_block.plugin) | 过滤知乎 App 广告（开屏 / 信息流 / 回答页 / 搜索 / 直答推荐位 / 评论区调查），并移除 HTTPDNS 与 QUIC 传输配置；纯本地规则，零远程脚本、不上报、不联网；需开启 MITM 并信任证书 |
| 5 | 金十去广告 | [Raw 链接](https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/jin10_splash_ad_block.plugin) ｜ [一键导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2FThelongdarkorg%2Floon-plugins%2Fmain%2Fjin10_splash_ad_block.plugin) | 过滤金十数据 App 广告（开屏 / 侧滑页 / 消息 / 浮窗 / 横幅 / 信息流 / 弹窗 / 搜索热词）；纯本地规则，零远程脚本、不上报、不联网；需开启 MITM 并信任证书 |
| 6 | 拼多多开屏 | [Raw 链接](https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/pinduoduo_splash_ad_block.plugin) ｜ [一键导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2FThelongdarkorg%2Floon-plugins%2Fmain%2Fpinduoduo_splash_ad_block.plugin) | 拦截拼多多 App 开屏广告（api.cappuccino.splash）；2026-06 整治后多数设备已无开屏，本插件为防御性拦截；需开启 MITM 并信任证书 |
| 7 | 联通开屏 | [Raw 链接](https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/chinaunicom_splash_ad_block.plugin) ｜ [一键导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2FThelongdarkorg%2Floon-plugins%2Fmain%2Fchinaunicom_splash_ad_block.plugin) | 拦截中国联通 App 开屏欢迎广告（m.client.10010.com/uniAdmsInterface/getWelcomeAd）；App 设置内亦有关闭开屏开关，本插件为网络层兜底；需开启 MITM 并信任证书 |
| 8 | 酷安开屏 | [Raw 链接](https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/coolapk_splash_ad_block.plugin) ｜ [一键导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2FThelongdarkorg%2Floon-plugins%2Fmain%2Fcoolapk_splash_ad_block.plugin) | 拦截酷安 App 开屏广告（穿山甲/pangle SDK 下发）；已在网络层拦截 pangle 广告域名，若仍出现请用 GKD 精准跳过；需开启 MITM 并信任证书 |
| 9 | 途虎开屏 | [Raw 链接](https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/tuhu_splash_ad_block.plugin) ｜ [一键导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2FThelongdarkorg%2Floon-plugins%2Fmain%2Ftuhu_splash_ad_block.plugin) | 拦截途虎养车 App 开屏/弹窗广告（mkt-gateway.tuhu.cn）；最佳努力规则，若仍出现请用 GKD 精准跳过；需开启 MITM 并信任证书 |
| 10 | 水印相机 | [Raw 链接](https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/watermark_camera_splash_ad_block.plugin) ｜ [一键导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2FThelongdarkorg%2Floon-plugins%2Fmain%2Fwatermark_camera_splash_ad_block.plugin) | 拦截今日水印相机 App 开屏广告（穿山甲/pangle SDK，包名 com.xhey.xcamera）；已拦截 pangle 广告域名，或在 App 内关闭「个性化广告/摇一摇广告」；需开启 MITM 并信任证书 |
| 11 | 美柚开屏 | [Raw 链接](https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/meiyou_splash_ad_block.plugin) ｜ [一键导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2FThelongdarkorg%2Floon-plugins%2Fmain%2Fmeiyou_splash_ad_block.plugin) | 拦截美柚 App 开屏广告（自营广告平台「女人通」+ 穿山甲 SDK，包名 com.lingan.seeyou）；采用域名级 REJECT（免 MITM 生效）+ 接口拦截；若仍出现请抓包反馈真实域名或改用 GKD；需开启 MITM 并信任证书 |
| 12 | 东财开屏 | [Raw 链接](https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/eastmoney_splash_ad_block.plugin) ｜ [一键导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2FThelongdarkorg%2Floon-plugins%2Fmain%2Feastmoney_splash_ad_block.plugin) | 拦截东方财富 App 开屏/广告（emdcadvertise.eastmoney.com）；需开启 MITM 并信任证书 |
| 13 | 小红书开屏+无水印 | [Raw 链接](https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/xiaohongshu_splash_ad_block.plugin) ｜ [一键导入](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2FThelongdarkorg%2Floon-plugins%2Fmain%2Fxiaohongshu_splash_ad_block.plugin) | 拦截小红书 App 开屏广告；并把笔记接口的图片/视频链接重写为无水印直链，保存到相册即无水印（纯本地内联脚本，零远程代码）；需开启 MITM 并信任证书 |

> **关于穿山甲/pangle SDK 类开屏（酷安 / 今日水印相机 / 美柚）**：这 3 款 App 的开屏广告由字节穿山甲（pangle）SDK 在端上直接弹出，网络层没有「只属于该 App」的独立广告接口。本仓库的做法是在网络层拦截 pangle 的广告投放域名（`api-access.pangolin-sdk-toutiao.com` / `*.pangle.cn`）来中和开屏。**副作用**：所有使用 pangle 的广告（含其他 App）都会被一并拦截；极少数 App 若强依赖 pangle 响应可能异常，停用对应插件即可。需要「只拦这一款 App 的开屏、不影响其他」请用 GKD（基于无障碍/Activity 选择器精准跳过）。

---

## 安装说明

### 方式一：一键导入（手机点开即跳 Loon）
点击上表「**一键导入**」链接，会经 Loon 官方中转页 `nsloon.com` 自动跳转并打开 Loon 完成安装。

### 方式二：Raw 链接手动导入
1. 复制上表「**Raw 链接**」地址：
   ```
   https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/jd_splash_ad_block.plugin
   ```
2. Loon → 配置 → 插件 → 右上角 `+` → URL → 粘贴安装。

### 前置：开启 MITM
Loon → 设置 → 中间件(MITM) → 开启，并按提示到 iOS「设置 → 通用 → 关于本机 → 证书信任设置」信任证书。

> 注意：京东 `functionId=start` 规则可能使京东「比价」功能失效，不需要可在插件中删除该行。

## 新增规则

新插件请按表格格式在上方补一行，文件头部需包含：

```
#!name=中文名称
#!desc=一句话说明（用途 + 依赖）
#!author=FFDNS[https://github.com/Thelongdarkorg/loon-plugins]
```

正文规则上方加 `#` 中文注释，说明拦的是什么。**不要使用 `script-path=` 指向远程脚本**。

## 安全说明

- 本仓库规则均为**本地生效**：开屏/广告拦截用纯 `reject` 规则；部分插件（如小红书）额外使用**内联本地脚本**（`script-content=`，代码写在插件文件内，不从任何远程地址拉取），**零远程脚本、不上报、不联网**。
- 安装 URL 请确保来自本仓库（公开只读，只有你能编辑）。
- 无水印类功能（小红书）仅用于**个人收藏**，请尊重原作者版权，勿商用或二次分发。
