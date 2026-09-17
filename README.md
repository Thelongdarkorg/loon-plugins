# 🍟 规则列表

| 序号 | 规则名称 | Loon 链接 | 备注 |
|:--:|:--|:--|:--|
| 1 | 京东开屏广告拦截 | [Raw 链接、一键导入](https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/jd_splash_ad_block.plugin) | 拦截京东 / 京东金融 / 京东极速版 / 京东云路由 App 开屏广告；需开启 MITM 并信任证书 |

---

## 安装说明

1. Loon → 设置 → 中间件(MITM) → 开启，并按提示到 iOS「设置 → 通用 → 关于本机 → 证书信任设置」信任证书。
2. 点击上表「**Raw 链接、一键导入**」或复制链接：
   ```
   https://raw.githubusercontent.com/Thelongdarkorg/loon-plugins/main/jd_splash_ad_block.plugin
   ```
3. Loon → 配置 → 插件 → 右上角 `+` → URL → 粘贴安装。

> 注意：`functionId=start` 规则可能使京东「比价」功能失效，不需要可在插件中删除该行。

## 新增规则

新插件请按表格格式在上方补一行，文件头部需包含：

```
#!name=中文名称
#!desc=一句话说明（用途 + 依赖）
#!author=
```

正文规则上方加 `#` 中文注释，说明拦的是什么。**不要使用 `script-path=` 指向远程脚本**。

## 安全说明

- 本仓库规则均为纯本地 `reject` 规则，零远程脚本、不上报。
- 安装 URL 请确保来自本仓库。
