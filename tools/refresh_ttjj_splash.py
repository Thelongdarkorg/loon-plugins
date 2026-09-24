#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""自动刷新天天基金开屏图黑名单（AUTO-SPLASH-URLS 区块）。

流程：
  1. POST 开屏下发接口 GetAppStartImg，取 datas[].ImgUrl（真实生产 URL）。
  2. 读取插件内 BEGIN/END 区块现有规则，按 8 位日期保留近 30 天条目（过期条目删除）。
  3. 新旧并集去重，按日期倒序重写区块。
  4. 无变化则不改动文件（workflow 检测 diff 后跳过提交）。

仅依赖标准库。由 .github/workflows/refresh-ttjj-splash.yml 每日调用，也可手动运行。
"""
import json
import re
import time
import urllib.request
from datetime import date, datetime, timedelta

PLUGIN = "tiantianjijin_splash_ad_block.plugin"
API = "https://appactive.1234567.com.cn/AppoperationApi/OperationService/GetAppStartImg"
MARK_BEGIN = "# >>> AUTO-SPLASH-URLS BEGIN"
MARK_END = "# <<< AUTO-SPLASH-URLS END <<<"
MARK_BEGIN_NEW = ("# >>> AUTO-SPLASH-URLS BEGIN"
                  "（每日 08:30/20:30 由 GitHub Actions 自动刷新，请勿手改本区块）>>>")
RETENTION_DAYS = 30


def fetch_urls():
    """请求开屏下发接口，返回 ImgUrl 列表。带 5 次重试。"""
    body = json.dumps({}).encode("utf-8")
    last_err = None
    for attempt in range(1, 6):
        try:
            req = urllib.request.Request(
                API,
                data=body,
                method="POST",
                headers={
                    "Content-Type": "application/json;charset=UTF-8",
                    "User-Agent": "EMPro/10.0",
                    "Accept": "*/*",
                    "Connection": "close",
                },
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            urls = []
            for item in (data.get("datas") or []):
                u = (item.get("ImgUrl") or "").strip()
                if u:
                    urls.append(u)
            if not urls:
                raise ValueError("response has no ImgUrl: %s" % json.dumps(data)[:200])
            return urls
        except Exception as err:  # noqa: BLE001
            last_err = err
            print("[warn] attempt %d failed: %r" % (attempt, err))
            time.sleep(5)
    raise SystemExit("[fatal] failed to fetch splash API after 5 attempts: %r" % last_err)


def url_to_rule(url):
    """素材 URL -> Loon 规则行：^https?:\\/\\/...(?:\\?.*)?$ reject"""
    m = re.match(r"^https?://", url)
    rest = url[m.end():] if m else url
    escaped = re.escape(rest).replace("/", "\\/")
    return "^https?:\\/\\/" + escaped + "(?:\\?.*)?$ reject"


def rule_date(rule):
    """从规则行提取 8 位日期（conf\\/<YYYYMMDD>\\/），失败返回 None。"""
    m = re.search(r"conf\\/(\\d{8})\\/", rule)
    if not m:
        return None
    try:
        return datetime.strptime(m.group(1), "%Y%m%d").date()
    except ValueError:
        return None


def load_existing_block(lines):
    """提取现有区块内的规则行（BEGIN 按前缀匹配，兼容旧标记文案）。"""
    rules, in_block = [], False
    for raw in lines:
        s = raw.rstrip("\r\n")
        if s.startswith(MARK_BEGIN):
            in_block = True
            continue
        if s.startswith(MARK_END):
            in_block = False
            continue
        if in_block and s.strip().startswith("^https?:"):
            rules.append(s.strip())
    return rules


def main():
    fresh_urls = fetch_urls()
    print("[info] API returned %d ImgUrl(s)" % len(fresh_urls))

    with open(PLUGIN, "r", encoding="utf-8") as fh:
        lines = fh.readlines()
    old_rules = load_existing_block(lines)
    cutoff = date.today() - timedelta(days=RETENTION_DAYS)

    merged = {}  # rule -> 排序用日期
    for u in fresh_urls:
        r = url_to_rule(u)
        merged[r] = rule_date(r) or date.today()
    kept = 0
    for r in old_rules:
        d = rule_date(r)
        if d is None or d >= cutoff:  # 无日期的保守保留
            merged[r] = d or date(2000, 1, 1)
            kept += 1
    dropped = len(old_rules) - kept

    ordered = sorted(merged.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)
    block = [MARK_BEGIN_NEW] + [r for r, _ in ordered] + [MARK_END]

    out, in_block, replaced = [], False, False
    for raw in lines:
        s = raw.rstrip("\r\n")
        if s.startswith(MARK_BEGIN):
            in_block = True
            out.extend(block)
            replaced = True
            continue
        if s.startswith(MARK_END):
            in_block = False
            continue
        if not in_block:
            out.append(s)

    if not replaced:
        raise SystemExit("[fatal] AUTO-SPLASH-URLS block not found in %s" % PLUGIN)

    new_text = "\n".join(out) + "\n"
    with open(PLUGIN, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(new_text)

    added = sorted(set(url_to_rule(u) for u in fresh_urls) - set(old_rules))
    print("[info] fresh=%d kept_old=%d dropped_expired=%d total=%d added_new=%d"
          % (len(fresh_urls), kept, dropped, len(ordered), len(added)))
    for r in added:
        print("[add] %s" % r)
    if new_text == "".join(lines):
        print("[info] file unchanged")


if __name__ == "__main__":
    main()
