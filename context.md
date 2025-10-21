# 詳細背景資訊

## 專案結構
- **遊戲頁面**: https://js7800.pages.dev/
- **排行榜頁面**: https://js7800.pages.dev/leaderboard/
- **Worker**: `https://js7800-leaderboard-worker.johantw.workers.dev`
- **原作者遊戲**: https://raz0red.github.io/js7800/
- **原作者排行榜**: https://raz0red.github.io/js7800/leaderboard/
- **原作者後端**: https://twitchasylum.com/x/

## 高分系統架構
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
原作者伺服器更新排行榜
```

## 高分數據流程
### 讀取流程 ✅ 正常
```
leaderboard.js 調用 /games 端點
    ↓ 
Worker 轉發到 twitchasylum.com/x/scoreboard-games.php
    ↓
返回遊戲列表
```

### 保存流程 ❌ 有問題
```
highscore.js: xhr.send(sramToBase64(sram))
    ↓
POST to: https://js7800-leaderboard-worker.johantw.workers.dev/?sid=xxx&d=xxx
    ↓ Body: Base64 編碼的 SRAM 數據 (~2732 bytes)
    ↓
Worker 收到後:
    ├─ await js7800globalhiscore.put(key, body)  ✅
    └─ fetch(twitchasylum.com/x/save.php, POST body)  ❓ 可能沒有正確執行
```

## 關鍵代碼位置
- **highscore.js**: `C:\dev\js7800\site\src\js\highscore.js`
  - `saveSramGlobal()` - 發送 POST 到 Worker (第 257 行)
  - `sramToBase64()` - 轉換 SRAM 為 Base64
  
- **Worker**: `C:\dev\js7800\cloudflare-worker\leaderboard-worker.js`
  - POST 處理部分 (第 45-88 行)
  - 現在包含詳細日誌用於調試
  
- **leaderboard.js**: `C:\dev\js7800\site\leaderboard\src\js\leaderboard.js`
  - `const WORKER_URL = "https://js7800-leaderboard-worker.johantw.workers.dev"`

## 已知的 POST 請求數據
### 你的 Worker POST:
```
URL: https://js7800-leaderboard-worker.johantw.workers.dev/?sid=4fbf6c5b57fc4b4896fe376350a48e28&d=6053233cb59c0b4ca633623fd76c4576
Method: POST
Status: 200 OK
Content-Type: text/plain;charset=UTF-8
Body Length: 2732 bytes
Body: Base64 編碼的 SRAM (DQBog6pVnAAGCw4B...)
```

### 原作者的 POST:
```
URL: https://twitchasylum.com/x//save.php?sid=46c4503fda8c40d183f049e11e2ef323&d=6053233cb59c0b4ca633623fd76c4576
Method: POST
Status: 200 OK
Content-Type: text/plain;charset=UTF-8
Body Length: 2732 bytes
```

## 排行榜頁面修復
### 問題
- leaderboard.js 編譯後，`leaderboard.start()` 沒有被正確呼叫

### 解決方案
- Revert 到 commit 32be642
- leaderboard.js 的 export 需要確保在全域暴露 `start` 函數供 UMD 使用

### 目前狀態
✅ 已恢復正常，可以讀取原作者的排行榜資料

## Worker 的新日誌系統
新 Worker 代碼加入了詳細的 console.log，格式如下：
- `[GET]` - GET 請求日誌
- `[POST]` - POST 請求日誌（包含 KV 存儲和 proxy 轉發）
- `[SUMMARY]` - /summary 端點日誌
- `[GAMES]` - /games 端點日誌
- `[SCORES]` - /scores 端點日誌

### 查看 Worker 日誌方式
1. 登入 Cloudflare Dashboard
2. 進入 Workers 項目
3. 選擇 `js7800-leaderboard-worker`
4. 點擊 **Logs** 標籤
5. 或使用 `wrangler tail` 命令即時查看

### 日誌格式例子 (POST)
```
[POST] Received POST for digest 6053233cb59c0b4ca633623fd76c4576
[POST] Session ID: 4fbf6c5b57fc4b4896fe376350a48e28
[POST] Body length: 2732
[POST] Body preview (first 100 chars): DQBog6pVnAAGCw4BAAsdCwQAAwQRAQ4AEQMfAAAA...
[POST] ✅ Successfully stored leaderboard:6053233cb59c0b4ca633623fd76c4576 to KV
[POST] 🔄 Proxying POST to: https://twitchasylum.com/x/save.php?sid=4fbf6c5b57fc4b4896fe376350a48e28&d=6053233cb59c0b4ca633623fd76c4576
[POST] ✅ Proxy response status: 200 OK
[POST] 📄 Proxy response body: (response content here)
```
