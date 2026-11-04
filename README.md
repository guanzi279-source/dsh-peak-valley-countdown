# 梁文峰 / 梁文谷倒计时

[![npm](https://img.shields.io/npm/v/dsh-peak-valley-countdown)](https://www.npmjs.com/package/dsh-peak-valley-countdown)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

在 DeepSeek Harness 输入框下方显示一枚 DeepSeek 峰谷倒计时徽章：

```text
🌙 谷时　距离梁文峰还有 01:21:24
☀️ 峰时　距离梁文谷还有 02:50:55
```

梁文峰是 DeepSeek 创始人；「梁文谷」是谷时的谐音梗。倒计时指向下一次峰谷切换，跨周末或节假日时自动带天数，例如 `2天 14:00:00`。

## 功能

- 注册在 `conversation.composer.dock`，与 activity、usage 并排显示，不遮挡输入框。
- 谷时显示「距离梁文峰还有 …」，峰时显示「距离梁文谷还有 …」，每秒刷新。
- 固定按北京时间（UTC+8）计算，浏览器所在时区不会改变结果。
- 跨周末、跨法定节假日时显示天数，例如周五 18:00 后显示 `2天 14:00:00`。
- 周末与法定节假日全天按谷时计算；内置 2026 年中国法定节假日表。
- 中英文词条、跟随明暗主题的配色；鼠标悬停显示当前计费规则。
- 不联网、不写文件、不上报任何数据，只读取系统时钟。

## 计费规则

| 时段 | 时间（北京时间） |
| --- | --- |
| 峰时 | 周一至周五 09:00–12:00、14:00–18:00 |
| 谷时 | 其余所有时间，含周末与法定节假日全天 |

规则依据 [DeepSeek API 定价页](https://api-docs.deepseek.com/quick_start/pricing)（官方以 UTC 描述，这里换算为 UTC+8）。DeepSeek 可能调整价格与时段，请以官方页面为准。

### 节假日表

`client.js` 中的 `HOLIDAY_RANGES` 内置了 2026 年安排（依据[国办发明电〔2025〕7号](https://www.gov.cn/zhengce/content/202511/content_7047090.htm)）：

- 元旦 01-01–01-03
- 春节 02-15–02-23
- 清明 04-04–04-06
- 劳动节 05-01–05-05
- 端午 06-19–06-21
- 中秋 09-25–09-27
- 国庆 10-01–10-07

2027 年安排公布后，在 `HOLIDAY_RANGES` 里补一段日期即可；未列出的日期按工作日/周末判断。

## 安装

### 从 npm 安装（推荐）

```sh
dsh plugin --profile web add dsh-peak-valley-countdown
```

### 从 GitHub 安装（源码）

```sh
dsh plugin --profile web add github:guanzi279-source/dsh-peak-valley-countdown
```

安装后刷新页面，徽章出现在输入框下方；如果你的 profile 不是 `web`，把 `--profile web` 换成实际 profile（例如 `desktop`）。

## 使用

安装后无需配置。徽章会自动显示当前时段和倒计时；悬停可查看峰谷规则。倒计时归零时徽章会切换到下一个时段。

## 兼容性

- 在 DeepSeek Harness `0.2.1-rc.2` 的 Web profile 上测试通过。
- 依赖 Web 端 `conversation.composer.dock` 插槽与 `locale` 服务（DSH 0.2.x）。
- 纯 JavaScript，无构建步骤、无运行时依赖；安装时不会执行构建脚本。

## 隐私

插件只读取系统时钟并在本地渲染。没有网络请求、没有遥测、没有持久化存储，也不读取会话内容。

## 项目结构

```text
client.js         浏览器端组件：倒计时计算、渲染、中英文词条
index.js          Host 端空实现
cordis.patch.yml  插件行声明
locale/           Plugin Manager 的中英文标题与描述
icon.svg          插件图标
contrib/          投稿到社区市场的辅助文件
```

## 与同类插件的差异

- 位置是输入框下方的紧凑徽章，而不是侧栏、窗口边框或独立面板。
- 只做「距下一次切换」的倒计时（含跨日天数），不展示价目表。
- 内置 2026 年官方节假日表，周末和节假日全天按谷时计算。

## License

[MIT](LICENSE) © 2026 guanzi279-source

---

## English

A compact composer-dock badge for DeepSeek API peak/off-peak pricing. During off-peak it shows “Liang Wenfeng arrives in …”; during peak it shows “Liang Wengu arrives in …” (梁文谷 is a pun on 谷, “valley”). It counts down to the next transition, adds days across weekends and Chinese public holidays, is fixed to UTC+8, and ships the 2026 Chinese public holiday calendar.

Peak hours are Monday–Friday 09:00–12:00 and 14:00–18:00 Beijing time; all other hours, weekends and public holidays are off-peak, per the [DeepSeek pricing page](https://api-docs.deepseek.com/quick_start/pricing).

Install from npm:

```sh
dsh plugin --profile web add dsh-peak-valley-countdown
```

Or from GitHub source:

```sh
dsh plugin --profile web add github:guanzi279-source/dsh-peak-valley-countdown
```

No network access, no telemetry, no configuration. Tested on DeepSeek Harness 0.2.1-rc.2 Web.
