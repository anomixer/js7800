[English](README.md) | [繁體中文](README.zh-TW.md) | **简体中文**

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![Actions Status](https://github.com/raz0red/js7800/workflows/Build/badge.svg)](https://github.com/raz0red/js7800/actions)

# JS7800

由 raz0red 移植

JS7800 是由 Greg Stanton 最初开发的 ProSystem Atari 7800 模拟器的增强版 JavaScript 移植。

https://raz0red.github.io/js7800/

为了能正确且流畅地运行（无延迟等），JS7800 需要在配置优良的系统上使用更新版本的现代浏览器（Chrome、Firefox、Safari）。

[![JS7800](https://github.com/raz0red/js7800/raw/master/screenshots/screenshot.png)](https://raz0red.github.io/js7800/)

## Fork 信息

这是原始 [raz0red/js7800](https://github.com/raz0red/js7800) 存储库的一个分支 (fork)，其修改是为了支持多国语言并改善本地开发体验。

### 修改内容

*   **多语言支持**: UI 现已支持英文、繁体中文和简体中文。
*   **自动语言检测**: 首次加载时，应用程序将尝试匹配浏览器的偏好语言。语言也可以在“设定”菜单中手动变更。
*   **默认使用本地高分**: 高分存储的默认值已变更为“本地”，以避免因全球排行榜无法访问而产生的网络错误。
*   **已翻译文档**: README 和内部说明文件皆已翻译。

### 如何在本地运行

1.  **安装依赖套件:**
    ```sh
    npm install
    ```

2.  **构建网站:**
    ```sh
    npm run buildSite
    ```

3.  **启动服务器:**
    在项目根目录下，对 `site/deploy` 文件夹启动服务器。您可以使用 `npx` 或 Python 内建的网页服务器。

    *   **使用 Node.js:**
        ```sh
        npx http-server site/deploy -p 8081
        ```

    *   **使用 Python 3:**
        ```sh
        python -m http.server 8081 --directory site/deploy
        ```
    
    然后，在您的浏览器中打开 `http://localhost:8081`。

### 限制

*   **全球排行榜无法访问**: 原始的全球排行榜服务，其高分数据取自 <https://twitchasylum.com/x>，受 CORS 政策保护，仅允许来自官方 `raz0red.github.io` 域的请求。因此，此功能在此分支中无法运作。请确保在“设定”中将“高分”的存储位置设为“本地”以避免错误。

## 功能

*   全球高分追踪（适用于兼容 HSC 的游戏）
*   可自定义的键盘映射
*   游戏手柄兼容性（支持 Robotron 风格游戏的双模拟摇杆）
*   全屏支持
*   多种长宽比
*   可启用/停用视频滤镜
*   支持拖放本地文件和远程文件链接
*   支持卡带列表（参见 [JS7800 Wiki](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists)）
*   光线枪支持（通过鼠标）
*   扩展模块（XM）支持
*   增强的 bank switching 和卡带检测

## 未来规划

*   移动设备支持（虚拟按钮、适当的屏幕尺寸等）
    *   （部分功能已在 [webЯcade](https://www.webrcade.com) 中提供）
*   旋钮控制器支持（通过鼠标）
*   更新模拟核心，以集成来自优秀的 [A7800 模拟器](http://7800.8bitdev.org/index.php/A7800_Emulator) 的准确性和兼容性改进
*   保存/加载状态支持（已在 [webЯcade](https://www.webrcade.com) 中提供）
*   基于网络的多人游戏支持
*   改进的卡带浏览器，包含详细描述和屏幕截图（已在 [webЯcade](https://www.webrcade.com) 中提供）

## 文档

JS7800 通过模拟器画面正下方的控制列中的“帮助/信息”按钮提供集成文档。

有关 ["卡带列表"](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists) 格式、["请求参数"](https://github.com/raz0red/js7800/wiki/Request%20Parameters) 等更多信息，请参阅 [JS7800 Wiki](https://github.com/raz0red/js7800/wiki)。

## 更新日志

### 24年1月25日 (0.0.9)
    - 支持 Souper
    - 支持 Activision OM ROM 布局
    - 修正 Pole Position II 赛道选择问题（由 AtariAge 的 RevEng 修正）
    - Tower Toppler 和 Jinks 的复合视频平滑处理（由 AtariAge 的 RevEng 处理）
    - 更新调色板（由 AtariAge 的 Trebor 贡献）
    - 更新 Popeye (JS7800 Demo 2.41)（由 AtariAge 的 darryl1970 贡献）

### 23年8月16日 (0.0.8)
    - 修正 TIA 保真度问题（由 AtariAge 的 RevEng 贡献）

### 23年8月13日 (0.0.7)
    - 重写 Pokey（由 AtariAge 的 RevEng 贡献）
    - 修正 RIOT 中断镜像问题（由 AtariAge 的 RevEng 贡献）
    - 新增 Drelbs homebrew
    - 新增最新版 Arkanoid homebrew（因 RIOT 修正而可运作）
    - 新增数个基于 Pokey 的 demo

### 23年8月10日 (0.0.6)
    - 更新调色板（由 AtariAge 的 Trebor 贡献）
    - 调整 YM-2151 默认音量
    - 修正卡带标头中的电视类型

### 23年7月30日 (0.0.5)
    - 支持 Banksets
    - 修正 Maria 背景颜色问题（Keystone Koppers）
    - 修正卡带标头（修正了数个需要特殊版本的 ROM）
    - 改善周期准确性（解决数个游戏的小问题）
    - 支持 YM-2151 homebrew 自动检测
    - 支持 Pokey 滤镜（由 AtariAge 的 RevEng 贡献）
    - 支持 7800 诊断卡带
    - 支持保存状态（仅能通过 webЯcade 访问）
    - 新增至默认游戏列表：IE78 (Demo)、Bad Apple (Demo)、Bankset Tests、
      Baby Pac-Man、7800 Test、Keystone Koppers (Demo)、Galaxian、PentaGo!
    - 更新数个游戏至最新版本
    - 为以下游戏新增高分支持：1942、Galaxian、Keystone Koppers、PentaGo!、
      以及已支持游戏的最新版本。

### 21年1月5日 (0.0.4)
    - 为 "Popeye" 新增全球高分支持
    - 为最新版 "Pac-Man Collection!" 新增全球高分支持
    - 更新至 "Dragon's Cache"、"Dragon's Descent"、"Popeye"、
      "Spire of the Ancients"、"E.X.O" 和 "Knight Guy: Castle Days" 的最新版本

### 20年9月3日 (0.0.3)
    - 新增对未记载的 ASR 和 ANC 操作码的支持（修正 "Popeye 7800: Mini-game" 的图形小问题）
    - 为最新版 "Pac-Man XM" 新增全球高分支持
    - 将 "Popeye 7800: Mini-game" 和 "Knight Guy: Castle Days" 新增至开发中游戏的默认列表
    - 更新至 "Dragon's Cache"、"Dragon's Descent"、"GoSub" 和
      "Spire of the Ancients" 的最新版本
    - 更新至 "Dragon's Descent" 最新版本需要重置该游戏的全球高分（因最新版修改了高分存储方式）

### 20年6月18日 (0.0.2)
    - 更新 XM 实现以与已发布的硬件保持一致
    - 初步支持 Yamaha (YM2151) 声音芯片
    - 可停用垂直同步（在设定对话框的“高级”分页）
    - 将 Zanac 和 Side-Crawler's Dance 的 Yamaha 音乐 demo 新增至默认卡带列表
    - 将 XM 内存测试新增至默认卡带列表
    - 默认情况下，全球高分服务器不支持的游戏，其高分将存储在本地
    - 解决了当本地存储被停用时，全球高分不受支持的缺陷

### 20年5月26日 (0.0.1)
    - 可在“暗色”和“亮色”变化中选择调色板（“冷色”、“暖色”和“热色”）
    - “全屏”缩放选项（整数 vs. 填满）
    - “全球排行榜”页面
    - 通过控制列启动“全球排行榜”

### 20年5月16日 (0.0.0)
    - 初始版本
