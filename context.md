# 詳細背景資訊 - JS7800 Leaderboard 系統

## 專案結構
- **遊戲頁面**: https://js7800.pages.dev/
- **排行榜頁面**: https://js7800.pages.dev/leaderboard/
- **Worker**: `https://js7800-leaderboard-worker.johantw.workers.dev`
- **原作者遊戲**: https://raz0red.github.io/js7800/
- **原作者排行榜**: https://raz0red.github.io/js7800/leaderboard/
- **原作者後端**: https://twitchasylum.com/x/

## 高分系統架構 ✅ 完全正常
```
用戶遊戲破紀錄
    ↓
highscore.js 檢測 SRAM 變化
    ↓
saveSramGlobal() 發 POST 到 Worker
    ↓
Worker 收到 POST
    ├─ 保存到 Cloudflare KV
    └─ proxy 轉發到 twitchasylum.com/x/save.php
    ↓
原作者伺服器更新排行榜 ✅
    ↓
排行榜自動同步（透過快取機制）✅
```

## 高分數據流程
### 讀取流程 ✅ 正常（含智能快取）
```
leaderboard.js 調用端點（/games, /summary, /scores）
    ↓
Worker 檢查 30 秒快取
    ├─ 有快取 → 直接返回 ✅
    └─ 無快取 → 轉發到原作者
    ↓
Worker 檢查 10 秒速率限制
    ├─ 被限制 → 返回快取數據（降級）✅
    └─ 未限制 → 發出新請求
    ↓
原作者返回數據或錯誤頁面
    ├─ 正常回應 → 快取並返回 ✅
    └─ 錯誤（length < 500）→ 使用快取降級 ✅
```

### 保存流程 ✅ 完全正常
```
highscore.js: xhr.send(sramToBase64(sram))
    ↓
POST to: https://js7800-leaderboard-worker.johantw.workers.dev/?sid=xxx&d=xxx
    ↓ Body: Base64 編碼的 SRAM 數據 (~2732 bytes)
    ↓
Worker 收到後:
    ├─ await js7800globalhiscore.put(key, body)  ✅ 保存到 KV
    └─ fetch(twitchasylum.com/x/save.php, POST body)  ✅ proxy 轉發
    ↓
原作者伺服器處理並更新排行榜 ✅
```

## 關鍵代碼位置
- **highscore.js**: `C:\dev\js7800\site\src\js\highscore.js`
  - `saveSramGlobal()` - 發送 POST 到 Worker (第 257 行)
  - `sramToBase64()` - 轉換 SRAM 為 Base64 (第 50 行)
  
- **Worker**: `C:\dev\js7800\cloudflare-worker\leaderboard-worker.js`
  - POST 處理部分 (第 45-97 行)
  - 快取機制 (第 3-37 行)
  - 速率限制檢測 (第 17-22, 102-119 行等)
  - 錯誤回應檢測 (第 24-25 行)
  - KV 存儲: `js7800globalhiscore`
  
- **leaderboard.js**: `C:\dev\js7800\site\leaderboard\src\js\leaderboard.js`
  - `const WORKER_URL = "https://js7800-leaderboard-worker.johantw.workers.dev"`
  - 讀取排行榜: `/games`, `/summary`, `/scores` 端點

## POST 請求格式

### 你的 Worker POST (成功✅):
```
URL: https://js7800-leaderboard-worker.johantw.workers.dev/?sid=7a18043cdb06429e8fb18b52a6520f62&d=6053233cb59c0b4ca633623fd76c4576
Method: POST
Status: 200 OK
Content-Type: text/plain;charset=UTF-8
Body Length: 2732 bytes
Body: Base64 編碼的 SRAM (DQBog6pVnAAGCw4B...)
```

### Worker Proxy 到原作者 (成功✅):
```
URL: https://twitchasylum.com/x/save.php?sid=7a18043cdb06429e8fb18b52a6520f62&d=6053233cb59c0b4ca633623fd76c4576
Method: POST
Status: 200 OK
Content-Type: text/plain;charset=UTF-8
Body Length: 2732 bytes
Response: 通常為空，但伺服器成功處理了數據 ✅
```

## Worker 快取系統 📊

### 快取配置
```javascript
const CACHE_DURATION = 30 * 1000;      // 30 秒快取
const MIN_REQUEST_INTERVAL = 10 * 1000; // 10 秒最小請求間隔
```

### 快取機制
1. **記憶體快取** - 同一 URL 的請求結果快取 30 秒
2. **速率限制檢測** - 10 秒內不重複發送相同請求
3. **錯誤識別** - 識別 data length < 500 或以 `<` 開頭（HTML 錯誤頁）
4. **智能降級** - 被限制時自動使用舊快取而不報錯

### 日誌格式 (分類標籤)
- `[GET]` - GET 請求日誌（讀取高分）
- `[POST]` - POST 請求日誌（保存高分和 proxy 轉發）
- `[SUMMARY]` - /summary 端點日誌（排行榜摘要）
- `[GAMES]` - /games 端點日誌（遊戲列表）
- `[SCORES]` - /scores 端點日誌（特定遊戲排行）

### 快取相關日誌標籤
- `✅ Returning cached data` - 命中快取，直接返回
- `⏱️ Rate limited, returning cached data` - 被速率限制，返回快取
- `📦 Using cached data as fallback` - 遇到錯誤，使用快取降級
- `⚠️ Received error response` - 檢測到錯誤回應（HTML 頁面）

### 查看 Worker 日誌方式

**方式 1: 實時查看（推薦）**
```bash
cd C:\dev\js7800\cloudflare-worker
wrangler tail
```

**方式 2: Cloudflare Dashboard**
1. 登入 https://dash.cloudflare.com
2. 進入 Workers & Pages
3. 選擇 `js7800-leaderboard-worker`
4. 點擊 **Logs** 標籤

### 典型日誌例子
```
GET https://js7800-leaderboard-worker.johantw.workers.dev/games - Ok
  (log) [GAMES] ✅ Returning cached data

GET https://js7800-leaderboard-worker.johantw.workers.dev/summary - Ok
  (log) [SUMMARY] ⏱️ Rate limited, returning cached data if available
  (log) [SUMMARY] 📦 Using cached data as fallback

POST https://js7800-leaderboard-worker.johantw.workers.dev/?sid=REDACTED&d=REDACTED - Ok
  (log) [POST] Received POST for digest 6053233cb59c0b4ca633623fd76c4576
  (log) [POST] ✅ Successfully stored to KV
  (log) [POST] 🔄 Proxying POST to: https://twitchasylum.com/x/save.php?...
  (log) [POST] ✅ Proxy response status: 200 OK
```

## 排行榜頁面修復與改進 ✅

### UI 改進 (2025-10-23)

#### 問題 1: 按鈕重複顯示 ✅
- **問題**: Play 和 Refresh 按鈕各出現兩個圖示
- **原因**: HTML 已有 img 標籤，JS 又重複添加
- **解決**: 移除 `leaderboard.js` 中的重複圖片創建代碼
- **檔案**: `site/leaderboard/src/js/leaderboard.js`

#### 問題 2: 錯誤訊息改善 ✅
- **問題**: 503 錯誤只顯示 "503: " 不夠友善
- **改善**: 顯示完整 URL 和提示訊息
- **格式**:
  ```
  Error during read attempt: [URL]
  (See console log for details)
  
  Hint: Try refresh this page later.
  ```
- **檔案**: `site/leaderboard/src/js/leaderboard.js`

### 多語系支援 (2025-10-23)

#### Global Leaderboard i18n ✅
- **新增**: `site/leaderboard/src/js/i18n-leaderboard.js`
- **功能**: 
  - 從 localStorage 讀取主模擬器語系設定
  - 自動偵測瀏覽器語言
  - 支援 EN / ZH-TW / ZH-CN
- **整合**: 所有 UI 文字都已翻譯
  - 頁面標題、區塊標題
  - 遊戲選單、表格欄位
  - 按鈕提示、動態文字

#### 主模擬器首頁文字更新 ✅
- **檔案**: `src/js/common/i18n.js`
- **變更**: "view current keyboard mappings" → "change keyboard mappings & languages"
- **影響**: 三種語言（EN / ZH-TW / ZH-CN）

### 早期問題（已解決）
### 問題（已解決）
- leaderboard.js 編譯後，`leaderboard.start()` 沒有被正確呼叫
- 原因: 某些改動導致 UMD export 出現問題

### 解決方案
- Revert 到 commit 32be642（穩定版本）
- 確保 leaderboard.js 的 export 在全域暴露 `start` 函數

### 目前狀態
✅ 已完全恢復，可以讀取原作者的排行榜資料

## 原作者伺服器注意事項 ⚠️
- 有速率限制（約 10 秒內不能連續請求）
- 超過限制返回 HTML 錯誤頁面（data length 288）
- 返回格式: `SyntaxError: Unexpected token '<'`
- **已解決**: Worker 自動識別並使用快取降級

## Cloudflare KV 配置
- **KV Namespace**: `js7800globalhiscore`
- **Key 格式**: `leaderboard:{game_digest}`
- **Value 格式**: Base64 編碼的 SRAM 數據
- **存儲用途**: 持久快取，避免頻繁請求原作者伺服器

## 部署和維護

### 部署新版本 Worker
```bash
cd C:\dev\js7800\cloudflare-worker
wrangler deploy
```

### 同步到 GitHub
```bash
cd C:\dev\js7800
git add .
git commit -m "Worker optimization message"
git push
```

### 版本信息
- **Wrangler 版本**: 4.42.1+
- **Worker 語言**: JavaScript (ES Modules)
- **運行時**: Cloudflare Workers
- **快取策略**: 30 秒記憶體快取 + 10 秒速率限制

## 測試清單 ✅
- ✅ 能讀取原作者的遊戲列表
- ✅ 能讀取原作者的排行榜摘要
- ✅ 能讀取特定遊戲的排行榜
- ✅ 能保存本地高分到 KV
- ✅ 能 proxy 轉發高分到原作者伺服器
- ✅ 原作者排行榜實時更新
- ✅ 頻繁刷新不會出現錯誤（使用快取）
- ✅ 快取機制正常運作
- ✅ 速率限制自動降級
