# dsh-plugin.org 提交正文（复制到提交页 / Issue）

### 仓库地址
https://github.com/guanzi279-source/dsh-peak-valley-countdown

### 一句话价值
在 DeepSeek Harness 输入框下方显示距离下一次峰时/谷时切换的倒计时：谷时等「梁文峰」，峰时等「梁文谷」，并处理周末与法定节假日。

### 能力分类
界面与体验

### 安装命令
dsh plugin --profile web add dsh-peak-valley-countdown

（仅源码安装：dsh plugin --profile web add github:guanzi279-source/dsh-peak-valley-countdown）

### 兼容与运行要求
DeepSeek Harness 0.2.1-rc.2 Web profile；依赖 conversation.composer.dock 插槽与 locale 服务；纯 JavaScript，无构建、无运行时依赖。

### 许可证
MIT

### 截图 / 演示
安装后输入框下方的实际文案：
- 谷时：🌙 谷时　距离梁文峰还有 01:21:24
- 峰时：☀️ 峰时　距离梁文谷还有 02:50:55

### 补充说明
不联网、不写文件、不上报数据，只读取系统时钟。峰时规则为北京时间周一至周五 09:00–12:00、14:00–18:00；周末与法定节假日全天谷时。内置 2026 年节假日表，2027 年安排公布后需在 client.js 的 HOLIDAY_RANGES 中补充。

### 提交前自查
- [x] 仓库已公开
- [x] 已添加 GitHub topic：dsh-plugin
- [x] README 包含安装命令
- [x] 插件导出 apply(ctx) 模块
- [x] 仓库根目录包含 package.json
