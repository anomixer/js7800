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

**注意：**此分支专注于国际化增强，同时保持与原版相同的出色游戏体验、核心模拟和游戏兼容性保持不变。

**立即畅玩**： https://js7800.pages.dev

### 修改内容

*   **多语言支持**: UI 现已支持英文、繁体中文、简体中文、日文和韩文。
*   **自动语言检测**: 首次加载时，应用程序将尝试匹配浏览器的偏好语言。语言也可以在"设定"菜单中手动变更。
*   **全球排行榜多语言支持**: 全球排行榜页面也支持相同的五种语言，并自动与主模拟器的语言设定同步。
*   **默认使用全球高分**: 高分存储的默认值已设为"全球（世界排行榜）"，以通过 Cloudflare Workers 代理与原始排行榜系统无缝同步。
*   **已翻译文档**: README 和内部说明文件皆已翻译。
*   **全球排行榜同步**: 实现 Cloudflare Workers 集成，为分支部署启用全球高分同步功能。

### 如何在本地运行

1.  **安装依赖套件:**
    ```sh
    npm install
    ```

2.  **构建网站:**
    ```sh
    set NODE_OPTIONS=--openssl-legacy-provider
    npm run build
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

### 全球排行榜同步尝试

原始全球排行榜服务 (https://twitchasylum.com/x/) 维护着数百款 Atari 7800 游戏的高分记录，让玩家能在全球范围内竞争。然而，该服务受 CORS 政策保护，仅允许来自官方 `raz0red.github.io` 域的请求，这导致分支无法访问该服务。

#### 解决方案：Cloudflare Workers 代理

我们使用 **Cloudflare Workers** 和 **Cloudflare KV 存储** 实现了自定义解决方案，以在分支部署中启用全球排行榜同步：

**运作原理：**
1. **Cloudflare Worker 作为代理**: 工作者拦截所有排行榜请求并将其转发到原始的 `twitchasylum.com/x/` 服务。
2. **CORS 标头注入**: 工作者添加适当的 CORS 标头 (`Access-Control-Allow-Origin: *`) 以允许来自任何来源的请求。
3. **数据缓存**: 响应被缓存在 Cloudflare KV 存储中，以提高性能并减少对原始服务的依赖。
4. **分数同步**: 当玩家通过模拟器提交高分时，分数会同时存储到本地和全球排行榜（通过工作者）。

**优点：**
- 分支部署中的玩家现在可以查看并在全球排行榜上竞争
- 通过缓存提供更快的响应时间
- 通过回退到缓存数据实现更高的可靠性
- 与现有高分系统无缝集成

#### 部署到 Cloudflare Workers & Pages

##### 步骤 1：设定 Cloudflare 账户

1. 在 [cloudflare.com](https://www.cloudflare.com) 创建免费账户
2. 导航至 **Workers & Pages** 部分
3. 创建新的 Worker 项目

##### 步骤 2：部署 Cloudflare Worker

1. **创建 Worker 脚本:**
   - 在 Cloudflare 仪表板中，进入 **Workers & Pages** → **创建应用程序** → **创建 Worker**
   - 命名（例如 `js7800-leaderboard-worker`）
   - 点击 **创建**

2. **添加 Worker 代码:**
   - 从此存储库的 `cloudflare-worker/leaderboard-worker.js` 复制代码
   - 粘贴到 Cloudflare Worker 编辑器中
   - 保存并部署

3. **创建 KV 命名空间:**
   - 在 Cloudflare 仪表板中进入 **Workers** → **KV**
   - 创建新命名空间：`js7800globalhiscore`
   - 使用相同名称将其绑定到您的工作者

4. **获取 Worker URL:**
   - 部署后，您将获得类似的 URL：`https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev`
   - 更新下列文件中的 `WORKER_URL` 常数：
     - `site/src/js/highscore.js`
     - `site/leaderboard/src/js/leaderboard.js`

##### 步骤 3：部署到 Cloudflare Pages

1. **连接存储库:**
   - 在 Cloudflare 仪表板中，进入 **Pages**
   - 点击 **创建项目** → **连接到 Git**
   - 选择您的 js7800 分支
   - 授权 Cloudflare 访问 GitHub

2. **设定构建设置:**
   - **构建命令**: `npm run build`
   - **构建输出目录**: `site/deploy`
   - **环境变量**:
     ```
     NODE_OPTIONS = --openssl-legacy-provider
     ```

3. **部署:**
   - 点击 **保存并部署**
   - Cloudflare 将自动构建并部署您的网站
   - 您将获得公开 URL，例如 `https://your-project.pages.dev`

##### 步骤 4：验证全球排行榜

1. 导航至您部署的网站：`https://your-project.pages.dev`
2. 前往 **全球排行榜** 页面：`https://your-project.pages.dev/leaderboard/`
3. 选择游戏以查看全球高分
4. 玩游戏并提交高分以验证同步

##### 疑难解答

**Worker 不返回数据：**
- 验证 KV 命名空间是否正确绑定
- 检查浏览器控制台是否有 CORS 错误
- 确保在源文件中正确设定 `WORKER_URL`

**排行榜页面显示"错误"：**
- 检查 Worker 是否已部署并正在响应
- 验证浏览器 DevTools 中的网络请求
- 确保 KV 命名空间包含数据

**Cloudflare Pages 上的构建失败：**
- 检查 Cloudflare 仪表板中的构建日志
- 确保设定了 `NODE_OPTIONS` 环境变量
- 在本地执行 `npm install` 以验证依赖性

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

JS7800 通过模拟器画面正下方的控制列中的"帮助/信息"按钮提供集成文档。

有关 ["卡带列表"](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists) 格式、["请求参数"](https://github.com/raz0red/js7800/wiki/Request%20Parameters) 等更多信息，请参阅 [JS7800 Wiki](https://github.com/raz0red/js7800/wiki)。
