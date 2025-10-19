[English](README.md) | **繁體中文** | [简体中文](README.zh-CN.md)

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

### 修改內容

*   **多語言支援**: UI 現已支援英文、繁體中文和簡體中文。
*   **自動語言偵測**: 首次載入時，應用程式將嘗試匹配瀏覽器的偏好語言。語言也可以在「設定」選單中手動變更。
*   **預設使用本地高分**: 高分儲存的預設值已變更為「本地」，以避免因全球排行榜無法存取而產生的網路錯誤。
*   **已翻譯文件**: README 和內部說明檔案皆已翻譯。

### 如何在本地執行

1.  **安裝依賴套件:**
    ```sh
    npm install
    ```

2.  **建置網站:**
    ```sh
    npm run buildSite
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

### 限制

*   **全球排行榜無法存取**: 原始的全球排行榜服務，其高分資料取自 https://twitchasylum.com/x，受 CORS 政策保護，僅允許來自官方 `raz0red.github.io` 網域的請求。因此，此功能在此分支中無法運作。請確保在「設定」中將「高分」的儲存位置設為「本地」以避免錯誤。

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

## 更新日誌

### 24年1月25日 (0.0.9)
    - 支援 Souper
    - 支援 Activision OM ROM 版面配置
    - 修正 Pole Position II 賽道選擇問題（由 AtariAge 的 RevEng 修正）
    - Tower Toppler 和 Jinks 的複合視訊平滑處理（由 AtariAge 的 RevEng 處理）
    - 更新調色盤（由 AtariAge 的 Trebor 貢獻）
    - 更新 Popeye (JS7800 Demo 2.41)（由 AtariAge 的 darryl1970 貢獻）

### 23年8月16日 (0.0.8)
    - 修正 TIA 保真度問題（由 AtariAge 的 RevEng 貢獻）

### 23年8月13日 (0.0.7)
    - 重寫 Pokey（由 AtariAge 的 RevEng 貢獻）
    - 修正 RIOT 中斷鏡像問題（由 AtariAge 的 RevEng 貢獻）
    - 新增 Drelbs homebrew
    - 新增最新版 Arkanoid homebrew（因 RIOT 修正而可運作）
    - 新增數個基於 Pokey 的 demo

### 23年8月10日 (0.0.6)
    - 更新調色盤（由 AtariAge 的 Trebor 貢獻）
    - 調整 YM-2151 預設音量
    - 修正卡帶標頭中的電視類型

### 23年7月30日 (0.0.5)
    - 支援 Banksets
    - 修正 Maria 背景顏色問題（Keystone Koppers）
    - 修正卡帶標頭（修正了數個需要特殊版本的 ROM）
    - 改善週期準確性（解決數個遊戲的小問題）
    - 支援 YM-2151 homebrew 自動偵測
    - 支援 Pokey 濾鏡（由 AtariAge 的 RevEng 貢獻）
    - 支援 7800 診斷卡帶
    - 支援儲存狀態（僅能透過 webЯcade 存取）
    - 新增至預設遊戲清單：IE78 (Demo)、Bad Apple (Demo)、Bankset Tests、
      Baby Pac-Man、7800 Test、Keystone Koppers (Demo)、Galaxian、PentaGo!
    - 更新數個遊戲至最新版本
    - 為以下遊戲新增高分支援：1942、Galaxian、Keystone Koppers、PentaGo!、
      以及已支援遊戲的最新版本。

### 21年1月5日 (0.0.4)
    - 為 "Popeye" 新增全球高分支援
    - 為最新版 "Pac-Man Collection!" 新增全球高分支援
    - 更新至 "Dragon's Cache"、"Dragon's Descent"、"Popeye"、
      "Spire of the Ancients"、"E.X.O" 和 "Knight Guy: Castle Days" 的最新版本

### 20年9月3日 (0.0.3)
    - 新增對未記載的 ASR 和 ANC 操作碼的支援（修正 "Popeye 7800: Mini-game" 的圖形小問題）
    - 為最新版 "Pac-Man XM" 新增全球高分支援
    - 將 "Popeye 7800: Mini-game" 和 "Knight Guy: Castle Days" 新增至開發中遊戲的預設清單
    - 更新至 "Dragon's Cache"、"Dragon's Descent"、"GoSub" 和
      "Spire of the Ancients" 的最新版本
    - 更新至 "Dragon's Descent" 最新版本需要重設該遊戲的全球高分（因最新版修改了高分儲存方式）

### 20年6月18日 (0.0.2)
    - 更新 XM 實作以與已發布的硬體保持一致
    - 初步支援 Yamaha (YM2151) 聲音晶片
    - 可停用垂直同步（在設定對話框的「進階」分頁）
    - 將 Zanac 和 Side-Crawler's Dance 的 Yamaha 音樂 demo 新增至預設卡帶清單
    - 將 XM 記憶體測試新增至預設卡帶清單
    - 預設情況下，全球高分伺服器不支援的遊戲，其高分將儲存在本機
    - 解決了當本機儲存被停用時，全球高分不受支援的缺陷

### 20年5月26日 (0.0.1)
    - 可在「暗色」和「亮色」變化中選擇調色盤（「冷色」、「暖色」和「熱色」）
    - 「全螢幕」縮放選項（整數 vs. 填滿）
    - 「全球排行榜」頁面
    - 透過控制列啟動「全球排行榜」

### 20年5月16日 (0.0.0)
    - 初始版本
