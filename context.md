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
```

## 高分數據流程
### 讀取流程 ✅ 正常
```
leaderboard.js 調用 /games 端點
    ↓ 
Worker 轉發到 twitchasylum.com/x/scoreboard-games.php
    ↓
返回遊戲列表（Base64 編碼 SRAM）
```

### 保存流程 ✅ 正常
```
highscore.js: xhr.send(sramToBase64(sram))
    ↓
POST to: https://js7800-leaderboard-worker.johantw.workers.dev/?sid=xxx&d=xxx
    ↓ Body: Base64 編碼的 SRAM 數據 (~2732 bytes)
    ↓
Worker 收到後:
    ├─ await js7800globalhiscore.put(key, body)  ✅
    └─ fetch(twitchasylum.com/x/save.php, POST body)  ✅ 成功轉發
    ↓
原作者伺服器處理並更新排行榜 ✅
```

## 關鍵代碼位置
- **highscore.js**: `C:\dev\js7800\site\src\js\highscore.js`
  - `saveSramGlobal()` - 發送 POST 到 Worker (第 257 行)
  - `sramToBase64()` - 轉換 SRAM 為 Base64 (第 50 行)
  
- **Worker**: `C:\dev\js7800\cloudflare-worker\leaderboard-worker.js`
  - POST 處理部分 (第 45-97 行)
  - 包含詳細日誌用於調試
  - KV 存儲: `js7800globalhiscore`
  
- **leaderboard.js**: `C:\dev\js7800\site\leaderboard\src\js\leaderboard.js`
  - `const WORKER_URL = "https://js7800-leaderboard-worker.johantw.workers.dev"`
  - 讀取排行榜: `/games`, `/summary`, `/scores` 端點

## POST 請求格式

### 你的 Worker POST (成功✅):
```
URL: https://js7800-leaderboard-worker.johantw.workers.dev/?sid=578831af414f4c3f971b681f1229c098&d=6053233cb59c0b4ca633623fd76c4576
Method: POST
Status: 200 OK
Content-Type: text/plain;charset=UTF-8
Body Length: 2732 bytes
Body: Base64 編碼的 SRAM (DQBog6pVnAAGCw4B...)
```

### Worker Proxy 到原作者 (成功✅):
```
URL: https://twitchasylum.com/x/save.php?sid=578831af414f4c3f971b681f1229c098&d=6053233cb59c0b4ca633623fd76c4576
Method: POST
Status: 200 OK
Content-Type: text/plain;charset=UTF-8
Body Length: 2732 bytes
Response: 通常為空，但伺服器成功處理了數據
```

## Worker 日誌系統 📊

### 日誌格式 (分類標籤)
- `[GET]` - GET 請求日誌（讀取高分）
- `[POST]` - POST 請求日誌（保存高分和 proxy 轉發）
- `[SUMMARY]` - /summary 端點日誌（排行榜摘要）
- `[GAMES]` - /games 端點日誌（遊戲列表）
- `[SCORES]` - /scores 端點日誌（特定遊戲排行）

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

### 典型 POST 日誌例子
```
POST https://js7800-leaderboard-worker.johantw.workers.dev/?sid=REDACTED&d=REDACTED - Ok @ 2025/10/21 下午11:06:19
  (log) [POST] Received POST for digest 6053233cb59c0b4ca633623fd76c4576
  (log) [POST] Session ID: 578831af414f4c3f971b681f1229c098
  (log) [POST] Body length: 2732
  (log) [POST] Body preview (first 100 chars): DQBog6pVnAAGCw4BAAsdCwQAAwQRAQ4AEQMfAAAAAAAAAAAAAAAAABIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
  (log) [POST] ✅ Successfully stored leaderboard:6053233cb59c0b4ca633623fd76c4576 to KV
  (log) [POST] 🔄 Proxying POST to: https://twitchasylum.com/x/save.php?sid=578831af414f4c3f971b681f1229c098&d=6053233cb59c0b4ca633623fd76c4576
  (log) [POST] ✅ Proxy response status: 200 OK
  (log) [POST] 📄 Proxy response body length: 0
  (log) [POST] 📄 Proxy response body: 
  (log) [POST] 📋 Proxy response headers: Content-Type=text/plain;charset=UTF-8
```

## 排行榜頁面修復 ✅
### 問題（已解決）
- leaderboard.js 編譯後，`leaderboard.start()` 沒有被正確呼叫
- 原因: 源碼中的某些改動導致 UMD export 出現問題

### 解決方案
- Revert 到 commit 32be642（穩定版本）
- 確保 leaderboard.js 的 export 在全域暴露 `start` 函數

### 目前狀態
✅ 已完全恢復，可以讀取原作者的排行榜資料

## 原作者伺服器注意事項 ⚠️
- 有速率限制（約 10 秒內不能連續請求多次）
- 超過限制返回: `SyntaxError: Unexpected token '<'`
- Data length 288 通常表示錯誤頁面或速率限制
- 建議每次請求間隔至少 10 秒

## Cloudflare KV 配置
- **KV Namespace**: `js7800globalhiscore`
- **Key 格式**: `leaderboard:{game_digest}`
- **Value 格式**: Base64 編碼的 SRAM 數據
- **存儲用途**: 快速緩存，避免頻繁請求原作者伺服器

## 部署和維護

### 部署新版本 Worker
```bash
cd C:\dev\js7800\cloudflare-worker
wrangler deploy
```

### 查看部署狀態
```bash
wrangler deployments list
```

### 調試時查看即時日誌
```bash
wrangler tail
```

### 版本信息
- **Wrangler 版本**: 4.42.1+
- **Worker 語言**: JavaScript (ES Modules)
- **運行時**: Cloudflare Workers

## 測試清單
- ✅ 能讀取原作者的遊戲列表
- ✅ 能讀取原作者的排行榜摘要
- ✅ 能讀取特定遊戲的排行榜
- ✅ 能保存本地高分到 KV
- ✅ 能 proxy 轉發高分到原作者伺服器
- ✅ 原作者排行榜實時更新
