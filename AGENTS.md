# JS7800 專案架構與開發規範指引 (AGENTS.md)

本文件整合了 JS7800 專案架構、全球排行榜（Global Leaderboard）即時同步機制、多語系支援 (i18n) 以及開發部署規範，供開發者與 AI 助理作為主要參考依據。

---

## 1. 專案概述與站點資訊

- **Fork 來源**: [raz0red/js7800](https://github.com/raz0red/js7800)
- **線上站點**:
  - **Cloudflare Pages 主站**: https://js7800.pages.dev/
  - **Cloudflare Pages 排行榜**: https://js7800.pages.dev/leaderboard/
  - **GitHub Pages 鏡像站**: https://anomixer.github.io/js7800/
  - **GitHub Pages 排行榜**: https://anomixer.github.io/js7800/leaderboard/
  - **Cloudflare Worker 後端**: `https://js7800-leaderboard-worker.johantw.workers.dev`
- **原作者站點**:
  - **原作者遊戲**: https://raz0red.github.io/js7800/
  - **原作者排行榜**: https://raz0red.github.io/js7800/leaderboard/
  - **原作者後端 API**: `https://twitchasylum.com/x/`

---

## 2. 全球排行榜 (Leaderboard) 架構與數據流程

為了同時解決原作者伺服器的 **CORS 跨域封鎖** 與 **Cloudflare WAF 403 阻擋**，本專案採用了「**雙軌寫入 + 進站即時靜默觸發 + 8 並發 Master SRAM 合流 + KV 智慧鏡像**」四位一體的高可用架構。

### 2.1 玩家進站與遊戲啟動流程（Read & Sync Flow）

```
玩家進入遊戲首頁 (js7800.pages.dev) 或 排行榜頁面
    ↓
前端在背景發動靜默請求：GET /trigger-sync（非阻塞，玩家 0 感知）
    ↓
Worker 60 秒防抖檢查 ➔ 觸發 GitHub Actions（8 並發極速同步）：
    ├─ 1. 智慧比對 Summary（若無新紀錄，0 次 KV 寫入，100% 0 元帳單保證）
    └─ 2. 若有新紀錄 ➔ 8 並發批次抓取 48 款遊戲（3 秒內完成）：
            ├─ 抓取 load.php ➔ 寫入 KV leaderboard:{digest}（同步全球 Master SRAM）✅
            └─ 抓取 scoreboard-scores.php ➔ 寫入 KV cache:scores:{digest}（同步排行榜 JSON）✅
    ↓
玩家挑選遊戲並點擊開始：
    ↓
highscore.js 讀取 KV 中的 Master SRAM（包含全世界玩家與本站玩家的合流最高分）
    ↓
遊戲開頭畫面即時、正確顯示世界第一名紀錄（絕不覆蓋他人成績）🎉
```

---

### 2.2 高分保存流程 (Save Flow) 與同步時效說明 (Sync Timing)
當玩家在遊戲中打破紀錄時，遊戲系統會觸發**兩階段寫入（Two-stage Write）**，每次均發動雙軌同步：

```
【階段 1：打破分數】遊戲結束時分數打破紀錄 ➔ 遊戲寫入 SRAM（第 1 次觸發，預設 initials）
【階段 2：輸入簽名】玩家輸入 3 字英文字母（如 ORZ）並確認 ➔ 遊戲寫入最終 SRAM（第 2 次觸發）
    ↓
highscore.js 檢測 SRAM 變化（2 秒 debounce 防抖處理）
    ↓
每次寫入均同步發動雙軌保存：

軌道 1 (前端直連寫入原作者官方 DB):
    fetch(twitchasylum.com/x/save.php, mode: no-cors, 玩家真實家用 IP)
    ├─ 100% 穿透 WAF，即時寫入原作者 MySQL 資料庫（永久保存世界紀錄）✅
    └─ 【上游時效】：原作者官網（raz0red.github.io）白名單直連其 MySQL，故上游為「0 秒秒更」⚡

軌道 2 (Worker 即時備份 SRAM 並調度 Actions 搬運):
    XHR POST → Cloudflare Worker /?sid=...&d=...
    ├─ 備份 Base64 SRAM 至 KV leaderboard:{digest} ✅
    ├─ 觸發 GitHub Actions 雲端工作流程（繞過原作者對外之 CORS 與 Worker WAF 403 封鎖）✅
    ├─ Actions 雲端虛擬機開機、抓取最新成績並以 Smart Diff 寫入 KV ✅
    └─ 【本站時效】：虛擬機啟動、拉取到寫入 KV 總耗時約「18 秒更」，之後任何節點刷新必見最新榜單 ⏱️
```

- **POST 請求格式（軌道 2）**:
  - **URL**: `https://js7800-leaderboard-worker.johantw.workers.dev/?sid=[SessionID]&d=[GameDigest]`
  - **Method**: `POST`
  - **Content-Type**: `text/plain;charset=UTF-8`
  - **Body**: Base64 編碼的 SRAM 數據 (~2.7KB)

- **時差與兩階段存檔注意事項**：
  - 階段 1（剛 Game Over）時，玩家尚未選字，SRAM 包含的是預設或前次簽名（如 NIK）；
  - 階段 2（約 20 秒後輸入完成）時，SRAM 才更新為玩家簽名（如 ORZ）；
  - 若在剛輸入完成的前 18 秒內刷新本站榜單，Actions 虛擬機仍在同步中，可能暫時看到階段 1 的舊簽名；
  - 待輸入完成後約 18 秒（Actions 執行完畢），重新整理榜單即會完整呈現階段 2 的最終簽名。

---

### 2.3 排行榜頁面讀取流程 (Leaderboard Web Flow)
排行榜前端調用 `/games`、`/summary`、`/scores` 端點，透過「記憶體快取 + KV 持久快取降級」保護：

```
leaderboard.js 調用端點（/games, /summary, /scores）
    ↓
Worker 檢查記憶體快取 (3 秒)
    ├─ 有效 → 直接返回 JSON ✅
    └─ 無快取 / 過期 → 準備請求
    ↓
Worker 讀取 Cloudflare KV 鏡像
    └─ 毫秒級極速回傳合流後的完整排行榜 JSON，零 CORS 報錯、零 WAF 阻擋 ✅
```

---

### 2.4 Cloudflare Worker 與 KV 配置
- **Worker 原始碼**: `cloudflare-worker/leaderboard-worker.js`
- **設定檔**: `cloudflare-worker/wrangler.toml`
- **KV Namespace**: `js7800globalhiscore` (ID: `6e6d5e88c82f4d72a6c510818c307860`)
- **Key 命名規範**:
  - SRAM 高分數據: `leaderboard:{game_digest}`
  - 遊戲列表備份: `cache:games`
  - 排行榜摘要備份: `cache:summary`
  - 單一遊戲排行備份: `cache:scores:{game_digest}`
- **快取參數**:
  - `CACHE_DURATION = 3 * 1000` (記憶體短快取 3 秒，確保全球邊緣節點極速秒級同步)
  - `MIN_REQUEST_INTERVAL = 3 * 1000` (3 秒)

### 2.5 Worker 端點一覽

| 端點 | Method | 說明 |
|---|---|---|
| `/?d={digest}` | GET | 讀取 SRAM（從 KV 或原作者 load.php） |
| `/?sid={sid}&d={digest}` | POST | 寫入 SRAM 到 KV，清除快取 |
| `/games` | GET | 遊戲列表（KV 鏡像） |
| `/summary` | GET | 全站排行摘要（KV 鏡像） |
| `/scores?d={digest}` | GET | 單一遊戲排行（KV 鏡像） |
| `/trigger-sync` | GET/POST | 網頁進站靜默觸發 GitHub Actions 同步全站榜單與 Master SRAM（60 秒防抖） |
| `/refresh?d={digest}` | GET | 強制清除快取 + 背景 5-retry 更新 KV |
| `/push-scores?d={digest}` | POST | 直接接受 JSON 推送至 KV（備用） |
| `/push-summary` | POST | 直接接受 JSON 推送至 KV（備用） |

---

## 3. 多語言支援架構 (i18n)

本專案支援 **11 種語言**，包含遊戲模擬器主介面、排行榜、說明對話框、關於頁面與文檔：

| 語言代碼 | 語言名稱 | 主介面 / 排行榜 | 說明檔案 (Help) | README |
|---|---|---|---|---|
| `en` | English (預設) | ✅ | `overview.html` 等 | [README.md](README.md) |
| `zh-tw` | 繁體中文 | ✅ | `overview-zh-TW.html` 等 | [README.zh-TW.md](README.zh-TW.md) |
| `zh-cn` | 简体中文 | ✅ | `overview-zh-CN.html` 等 | [README.zh-CN.md](README.zh-CN.md) |
| `ja` | 日本語 | ✅ | `overview-ja.html` 等 | [README.ja.md](README.ja.md) |
| `ko` | 한국어 | ✅ | `overview-ko.html` 等 | [README.ko.md](README.ko.md) |
| `de` | Deutsch | ✅ | `overview-de.html` 等 | [README.de.md](README.de.md) |
| `es` | Español | ✅ | `overview-es.html` 等 | [README.es.md](README.es.md) |
| `fr` | Français | ✅ | `overview-fr.html` 等 | [README.fr.md](README.fr.md) |
| `it` | Italiano | ✅ | `overview-it.html` 等 | [README.it.md](README.it.md) |
| `pt` | Português | ✅ | `overview-pt.html` 等 | [README.pt.md](README.pt.md) |
| `ru` | Русский | ✅ | `overview-ru.html` 等 | [README.ru.md](README.ru.md) |

### 語系同步機制
1. **偵測優先級**: localStorage 中的 `locale` 鍵值 > 瀏覽器語言 (`navigator.language`) > 預設 `en`。
2. **排行榜與主模擬器同步**: 排行榜透過 `site/leaderboard/src/js/i18n-leaderboard.js` 讀取相同之 localStorage 設定。

---

## 4. 關鍵原始碼目錄與職責

| 目錄 / 檔案 | 職責說明 |
|---|---|
| `src/js/common/i18n.js` | 主模擬器核心多語系字典與語言切換邏輯 |
| `src/js/web/cbar.js` | 控制列與頂部按鈕互動邏輯 |
| `site/src/js/site.js` | 模擬器主頁進入點，進站時靜默觸發 `/trigger-sync` |
| `site/src/js/highscore.js` | 本地高分偵測、SRAM 轉換、雙軌寫入與 /refresh 觸發 |
| `site/src/js/settings-dialog.js` | 設定對話框（包含 11 種語言切換選單） |
| `site/src/js/help-dialog.js` | 依語系載入對應語系的 Help HTML 文件 |
| `site/src/js/about-tab.js` | 關於頁面的多語系內容 |
| `site/leaderboard/src/js/leaderboard.js` | 全球排行榜頁面邏輯（資料請求、DOM 渲染、進站觸發 `/trigger-sync`） |
| `site/leaderboard/src/js/i18n-leaderboard.js` | 全球排行榜專用多語系字典與翻譯函數 |
| `cloudflare-worker/leaderboard-worker.js` | Cloudflare Worker 代理後端、KV 存儲、速率限制、/trigger-sync 調度 |
| `cloudflare-worker/wrangler.toml` | Cloudflare Worker 與 KV Namespace 設定檔 |
| `scripts/sync-leaderboard.js` | 核心同步腳本（8 並發批次抓取、Master SRAM 同步、Smart Diff 比對、KV Bulk 寫入） |
| `.github/workflows/sync-leaderboard.yml` | GitHub Actions 工作流程（15 分鐘 Cron + 手動觸發 + 自動清理舊 Runs） |
| `site/deploy/js/site.min.js` | **編譯後前端 JS（已納入 git，Cloudflare Pages 直接部署）** |
| `site/deploy/leaderboard/js/leaderboard.min.js` | **編譯後排行榜 JS（已納入 git，Cloudflare Pages 直接部署）** |

---

## 5. 開發、建置與部署指南

### 5.1 本地建置與測試
```bash
# 安裝相依套件
npm install

# 編譯前端專案 (輸出 site/deploy/js/site.min.js 等)
# Windows PowerShell:
$env:NODE_OPTIONS="--openssl-legacy-provider"; npm run build
# Windows CMD:
cmd.exe /c "set NODE_OPTIONS=--openssl-legacy-provider && npm run build"
```

> **重要**: `site/deploy/js/site.min.js` 與 `site/deploy/leaderboard/js/leaderboard.min.js` 已從 `.gitignore` 移除，**每次修改 JS source 後必須重新 build 並 commit 才能讓 Cloudflare Pages 部署生效**。

### 5.2 部署 Cloudflare Worker
```bash
cd cloudflare-worker
npx wrangler deploy
```

- **查看實時 Worker 日誌**:
  ```bash
  cd cloudflare-worker
  npx wrangler tail
  ```

### 5.3 手動強制更新 KV 快取（緊急同步用）
可從本機直接執行內建腳本手動同步全部遊戲榜單至 Cloudflare KV：
```bash
npm run syncLeaderboard
```

### 5.4 GitHub Actions 全自動進站事件同步
專案已配置 `.github/workflows/sync-leaderboard.yml`，支援：
1. **網頁進站事件觸發**：玩家造訪網頁時靜默呼叫 Worker `/trigger-sync`，Worker 透過 GitHub API 自動調度同步。
2. **破紀錄存檔觸發**：玩家打破紀錄存檔完成後，自動調度 GitHub Actions 抓取官方最新 JSON 寫入 KV。
3. **Smart Diff 0 寫入保護**：Summary 比對無變動時 0 次 KV 寫入，完全不消耗每日 1,000 次寫入限額。
4. **自動清理歷史 Runs**：每次執行完畢自動刪除舊紀錄，僅保留最近 6 筆，避免 Workflow 頁面氾濫。

**GitHub Repository Secrets 設定指南**：
請在 GitHub 倉庫頁面進入 **Settings** -> **Secrets and variables** -> **Actions**，新增以下兩個 Repository Secrets：
1. `CLOUDFLARE_API_TOKEN`：具備 `Account.Workers KV Storage (Edit)` 權限的 Cloudflare API Token。
2. `CLOUDFLARE_ACCOUNT_ID`：您的 Cloudflare 帳戶 ID（可在 Cloudflare Dashboard 右側欄複製）。
3. `KV_NAMESPACE_ID`（選填，預設已內嵌）：`6e6d5e88c82f4d72a6c510818c307860`。

---

## 6. 重要問題與踩坑紀錄

### 6.1 原作者 cPanel 403 與 HTML 快取錯誤（2026-08-26 修復）
- **現象**: 瀏覽器出現 `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON` (HTTP 200)。
- **原因**: 原作者伺服器為 cPanel，Worker 未帶瀏覽器標頭時被判定為機器人並回傳 6.5KB 的 403 HTML。舊 Worker 未檢查 `response.ok` 且錯誤檢測漏抓換行開頭的 HTML，將 403 HTML 誤當 JSON 回傳。
- **解法**: 
  1. Worker 請求帶上 `FETCH_HEADERS`（含 `User-Agent`、`Accept`、`Referer`）。
  2. 加入 `isValidJson()` 驗證與 `response.ok` 檢查。
  3. 引入 KV 持久快取降級機制，發生異常時自動回傳 KV 快取的最後一份有效 JSON。

### 6.2 全球排行榜按鈕圖示重複顯示修復
- **現象**: Play 與 Refresh 按鈕各自出現兩個重複圖示。
- **原因**: HTML 中已靜態定義 `<img>`，JS 的 `start()` 函數又動態建立並 append 了 `<img>`。
- **解法**: 在 `leaderboard.js` 中移除重複建立圖片邏輯，僅綁定 `onclick` 事件。

### 6.3 遊戲載入高分 SRAM (GET /?d=...) 403 錯誤修復（2026-08-26）
- **現象**: 在模擬器開啟遊戲（如 2048）時跳出 `Failed to load resource: 403 ()` 或 `Error loading global high scores (403)`。
- **原因**: 遊戲初始化時 `highscore.js` 會呼叫 `GET /?d=[digest]` 讀取 SRAM 高分。若 KV 尚未建立該遊戲的 SRAM，Worker 會向原作者 `load.php?d=...` 請求，但被原作者阻擋 403，Worker 舊邏輯將 403 直接拋回給前端。
- **解法**:
  1. 將所有 48 款遊戲的初始 SRAM 同步至遠端 Cloudflare KV。
  2. Worker 在 `GET /` 遇到 upstream 異常或無存檔時，回傳空字串 `""` (HTTP 200 OK)，讓模擬器正常初始化預設 SRAM，避免跳出 403 紅框錯誤。

### 6.4 雙重封鎖：瀏覽器 CORS + Worker WAF（2026-08-26 確認）
- **現象**: 存檔成功後，排行榜 KV 快取無法自動更新為最新分數。
- **原因**: twitchasylum.com 對排行榜讀取端點（scoreboard-scores.php 等）設定了雙重封鎖：
  1. **瀏覽器端 CORS 封鎖**: 伺服器回傳 `Access-Control-Allow-Origin: https://raz0red.github.io`，從 `https://js7800.pages.dev` 發起的 `fetch()` 被瀏覽器強制攔截，無法讀取回應。
  2. **Worker 端 WAF 封鎖**: twitchasylum.com 的 WAF 識別出 Cloudflare Worker 的雲端 IP（ASN 13335），對排行榜讀取請求回傳 403。
  - **注意**: `save.php` 的 POST 寫入不受影響，因為使用 `mode: no-cors` 由玩家真實家用 IP 直連，WAF 不阻擋。
- **解法**:
  1. **靜默觸發 + GitHub Actions 8 並發同步**：進站與存檔時由 GitHub Actions（微軟 Azure/GitHub IP，不受 WAF 403 阻擋）並發拉取最新榜單與 Master SRAM 寫入 KV。
  2. **Master SRAM 全球合流**：每次同步拉取 `load.php`，確保永遠合流原作者站點其他玩家的最新高分，絕不覆蓋他人成績。
  3. **Smart Diff 0 元防護**：以 Summary 比對變動，無變更時 0 次 KV 寫入，每日用量 < 2%，絕不產生超額帳單。

### 6.5 Worker 記憶體降級幽靈快取與 KV 寫入暴量修復（2026-09-05）
- **現象**: 破紀錄存檔後，原作者站點立即更新，但本站排行榜卡住 15 分鐘以上無法更新，手動多次觸發 Actions 還消耗大量 KV 寫入額度。
- **原因**: 
  1. Worker 降級邏輯將過期的記憶體快取作為優先級 A（即使已過期）回傳。由於 upstream 必定被 403 阻擋，Worker 一旦載入過舊資料便永久回傳該記憶體快取，阻斷了向 KV 讀取新資料的路徑。
  2. `sync-leaderboard.js` 舊邏輯在 Summary 變動時無差別全量寫入 48 款遊戲的 Scores 與 SRAM（單次消耗 98 次寫入）。
- **解法**:
  1. Worker GET 端點改為「KV 優先（KV-first）+ 3 秒記憶體防刷」，記憶體快取超過 3 秒一律直讀 KV，徹底破除幽靈快取死鎖，KV 一有新資料 3 秒內全球生效。
  2. `sync-leaderboard.js` 引入 `recentScores` 精準 Diff，分析出真正有變動的 digest，只同步有新成績的該款遊戲，單次寫入量從 98 次暴跌至 3 次（省下 97% 額度）。
