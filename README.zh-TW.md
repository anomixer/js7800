[English](README.md) | **繁體中文** | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![Actions Status](https://github.com/raz0red/js7800/workflows/Build/badge.svg)](https://github.com/raz0red/js7800/actions)

# JS7800

由 raz0red 移植

JS7800 是由 Greg Stanton 最初開發的 ProSystem Atari 7800 模擬器的增強版 JavaScript 移植。

https://raz0red.github.io/js7800/

為了能正確且流暢地運行（無延遲等），JS7800 需要在配置優良的系統上使用更新版本的現代瀏覽器（Chrome、Firefox、Safari）。

[![JS7800](https://github.com/raz0red/js7800/raw/master/screenshots/screenshot.png)](https://raz0red.github.io/js7800/)

## Fork 資訊

這是原始 [raz0red/js7800](https://github.com/raz0red/js7800) 儲存庫的一個分支 (fork)，其修改是為了支援多國語言並改善本地開發體驗。

**注意：**此分支專注於國際化增強，同時保持與原版相同的出色遊戲體驗、核心模擬和遊戲相容性保持不變。

**立即暢玩**： https://js7800.pages.dev

### 修改內容

*   **多語言支援**: UI 現已支援英文、繁體中文、簡體中文、日文和韓文。
*   **自動語言偵測**: 首次載入時，應用程式將嘗試匹配瀏覽器的偏好語言。語言也可以在「設定」選單中手動變更。
*   **全球排行榜多語言支援**: 全球排行榜頁面也支援相同的五種語言，並自動與主模擬器的語言設定同步。
*   **預設使用全球高分**: 高分儲存的預設值已設為「全球（世界排行榜）」，以透過 Cloudflare Workers 代理與原始排行榜系統無縫同步。
*   **已翻譯文件**: README 和內部說明檔案皆已翻譯。
*   **全球排行榜同步**: 實現 Cloudflare Workers 整合，為分支部署啟用全球高分同步功能。

### 如何在本地執行

1.  **安裝依賴套件:**
    ```sh
    npm install
    ```

2.  **建置網站:**
    ```sh
    set NODE_OPTIONS=--openssl-legacy-provider
    npm run build
    ```

3.  **啟動伺服器:**
    在專案根目錄下，對 `site/deploy` 資料夾啟動伺服器。您可以使用 `npx` 或 Python 內建的網頁伺服器。

    *   **使用 Node.js:**
        ```sh
        npx http-server site/deploy -p 8081
        ```

    *   **使用 Python 3:**
        ```sh
        python -m http.server 8081 --directory site/deploy
        ```
    
    然後，在您的瀏覽器中開啟 `http://localhost:8081`。

### 全球排行榜同步嘗試

原始全球排行榜服務 (https://twitchasylum.com/x/) 維護著數百款 Atari 7800 遊戲的高分紀錄，讓玩家能在全球範圍內競爭。然而，該服務受 CORS 政策保護，僅允許來自官方 `raz0red.github.io` 網域的請求，這導致分支無法存取該服務。

#### 解決方案：Cloudflare Workers 代理

我們使用 **Cloudflare Workers** 和 **Cloudflare KV 儲存** 實現了自訂解決方案，以在分支部署中啟用全球排行榜同步：

**運作原理：**
1. **Cloudflare Worker 作為代理**: 工作者攔截所有排行榜請求並將其轉發到原始的 `twitchasylum.com/x/` 服務。
2. **CORS 標頭注入**: 工作者添加適當的 CORS 標頭 (`Access-Control-Allow-Origin: *`) 以允許來自任何來源的請求。
3. **資料快取**: 回應被快取在 Cloudflare KV 儲存中，以提高效能並減少對原始服務的依賴。
4. **分數同步**: 當玩家透過模擬器提交高分時，分數會同時儲存到本機和全球排行榜（透過工作者）。

**優點：**
- 分支部署中的玩家現在可以查看並在全球排行榜上競爭
- 透過快取提供更快的回應時間
- 透過回退到快取資料實現更高的可靠性
- 與現有高分系統無縫整合

#### 部署到 Cloudflare Workers & Pages

##### 步驟 1：設定 Cloudflare 帳戶

1. 在 [cloudflare.com](https://www.cloudflare.com) 建立免費帳戶
2. 導航至 **Workers & Pages** 部分
3. 建立新的 Worker 專案

##### 步驟 2：部署 Cloudflare Worker

1. **建立 Worker 指令碼:**
   - 在 Cloudflare 儀表板中，進入 **Workers & Pages** → **建立應用程式** → **建立 Worker**
   - 命名（例如 `js7800-leaderboard-worker`）
   - 點擊 **建立**

2. **新增 Worker 程式碼:**
   - 從此儲存庫的 `cloudflare-worker/leaderboard-worker.js` 複製程式碼
   - 貼到 Cloudflare Worker 編輯器中
   - 儲存並部署

3. **建立 KV 命名空間:**
   - 在 Cloudflare 儀表板中進入 **Workers** → **KV**
   - 建立新命名空間：`js7800globalhiscore`
   - 使用相同名稱將其綁定到您的工作者

4. **取得 Worker URL:**
   - 部署後，您將獲得類似的 URL：`https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev`
   - 更新下列檔案中的 `WORKER_URL` 常數：
     - `site/src/js/highscore.js`
     - `site/leaderboard/src/js/leaderboard.js`

##### 步驟 3：部署到 Cloudflare Pages

1. **連接儲存庫:**
   - 在 Cloudflare 儀表板中，進入 **Pages**
   - 點擊 **建立專案** → **連接到 Git**
   - 選擇您的 js7800 分支
   - 授權 Cloudflare 存取 GitHub

2. **設定建置設定:**
   - **建置命令**: `npm run build`
   - **建置輸出目錄**: `site/deploy`
   - **環境變數**:
     ```
     NODE_OPTIONS = --openssl-legacy-provider
     ```

3. **部署:**
   - 點擊 **儲存並部署**
   - Cloudflare 將自動建置並部署您的網站
   - 您將獲得公開 URL，例如 `https://your-project.pages.dev`

##### 步驟 4：驗證全球排行榜

1. 導航至您部署的網站：`https://your-project.pages.dev`
2. 前往 **全球排行榜** 頁面：`https://your-project.pages.dev/leaderboard/`
3. 選擇遊戲以查看全球高分
4. 玩遊戲並提交高分以驗證同步

##### 疑難排解

**Worker 不返回資料：**
- 驗證 KV 命名空間是否正確綁定
- 檢查瀏覽器控制台是否有 CORS 錯誤
- 確保在來源檔案中正確設定 `WORKER_URL`

**排行榜頁面顯示「錯誤」：**
- 檢查 Worker 是否已部署並正在回應
- 驗證瀏覽器 DevTools 中的網路請求
- 確保 KV 命名空間包含資料

**Cloudflare Pages 上的建置失敗：**
- 檢查 Cloudflare 儀表板中的建置日誌
- 確保設定了 `NODE_OPTIONS` 環境變數
- 在本地執行 `npm install` 以驗證依賴性

## 功能

*   全球高分追蹤（適用於相容 HSC 的遊戲）
*   可自訂的鍵盤對應
*   遊戲手把相容性（支援 Robotron 風格遊戲的雙類比搖桿）
*   全螢幕支援
*   多種長寬比
*   可啟用/停用視訊濾鏡
*   支援拖放本機檔案和遠端檔案連結
*   支援卡帶清單（參見 [JS7800 Wiki](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists)）
*   光線槍支援（透過滑鼠）
*   擴充模組（XM）支援
*   增強的 bank switching 和卡帶偵測

## 未來規劃

*   行動裝置支援（虛擬按鈕、適當的螢幕尺寸等）
    *   （部分功能已在 [webЯcade](https://www.webrcade.com) 中提供）
*   旋鈕控制器支援（透過滑鼠）
*   更新模擬核心，以整合來自優秀的 [A7800 模擬器](http://7800.8bitdev.org/index.php/A7800_Emulator) 的準確性和相容性改進
*   儲存/載入狀態支援（已在 [webЯcade](https://www.webrcade.com) 中提供）
*   基於網路的多人遊戲支援
*   改進的卡帶瀏覽器，包含詳細描述和螢幕截圖（已在 [webЯcade](https://www.webrcade.com) 中提供）

## 文件

JS7800 透過模擬器畫面正下方的控制列中的「說明/資訊」按鈕提供整合文件。

有關 ["卡帶清單"](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists) 格式、["請求參數"](https://github.com/raz0red/js7800/wiki/Request%20Parameters) 等更多資訊，請參閱 [JS7800 Wiki](https://github.com/raz0red/js7800/wiki)。
