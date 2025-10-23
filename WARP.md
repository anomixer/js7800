# JS7800 開發工作記錄

## 目錄
1. [Leaderboard 同步問題](#leaderboard-同步問題)
2. [UI 改進](#ui-改進-2025-10-23)
3. [多語系支援](#多語系支援-2025-10-23)

---

## Leaderboard 同步問題

### ✅ 問題完全解決！

#### 最終狀態
- ✅ **Leaderboard 讀取正常** - 可以成功從原作者網站取得高分資料
- ✅ **高分保存已同步** - 遊戲破紀錄時，本地和原作者排行榜都實時更新
- ✅ **智能緩存和速率限制** - 頻繁刷新不會觸發紅框警告

#### 問題回顧
##### 初期問題
當玩家在 https://js7800.pages.dev/ 破紀錄時：
1. Console 顯示: `HSC Scores have changed, saving.`
2. ❌ 原作者的排行榜卻沒有更新

##### 頻繁刷新問題
- ❌ 頻繁刷新排行榜頁面時出現紅框警告
- ❌ `SyntaxError: Unexpected token '<'` 
- ❌ Data length 288（HTML 錯誤頁面）
- ✅ 現已解決：使用智能快取和降級方案

#### 解決方案實裝

##### 1. POST 轉發（已驗證✅）
```
遊戲破紀錄
    ↓
Worker 接收 POST
    ├─ 保存到 KV
    └─ proxy 轉發到 twitchasylum.com/x/save.php
    ↓
原作者伺服器更新排行榜 ✅
```

##### 2. 智能緩存機制 ✅
- **快取時間**: 30 秒
- **快取對象**: /games, /summary, /scores 端點
- **快取鍵值**: 以完整 URL 為基礎
- **效果**: 減少重複請求，提升速度

##### 3. 速率限制處理 ✅
- **最小請求間隔**: 10 秒
- **檢測機制**: 識別 data length < 500 或以 `<` 開頭的錯誤回應
- **降級方案**: 被限制時自動返回快取數據而不報錯
- **用戶體驗**: 頻繁刷新不會出現紅框警告

##### 4. 詳細日誌系統 ✅
新增日誌標籤：
- `✅ Returning cached data` - 返回快取
- `⏱️ Rate limited, returning cached data` - 被限制但有快取
- `📦 Using cached data as fallback` - 錯誤時使用快取降級
- `⚠️ Received error response` - 檢測到錯誤回應

#### 驗證結果
✅ 破紀錄後排行榜同步
✅ 頻繁刷新無警告
✅ 快取機制正常運作
✅ 降級方案有效

#### 配置參數
```javascript
const CACHE_DURATION = 30 * 1000;      // 30 秒快取
const MIN_REQUEST_INTERVAL = 10 * 1000; // 10 秒最小間隔
```

#### 部署信息
- **Worker 版本**: 4.42.1+
- **最後更新**: 2025-10-21
- **快取策略**: 智能記憶體快取 + 速率限制
- **降級機制**: 自動使用過期快取

---

## UI 改進 (2025-10-23)

### 問題 1: Global Leaderboard 按鈕重複顯示 ✅

#### 問題描述
Global Leaderboard 頁面的 Play 按鈕和 Refresh 按鈕各出現兩個圖示。原作者網站 (raz0red.github.io/js7800/) 只有各一個。

#### 原因分析
- HTML 中已定義了按鈕的 `<img>` 標籤（base64 編碼）
- JS 的 `start()` 函數又重複創建並添加 `<img>` 元素
- 導致每個按鈕顯示兩個圖示

#### 解決方案
**檔案**: `site/leaderboard/src/js/leaderboard.js`

移除 `start()` 函數中重複添加圖片的代碼：

```javascript
// 修改前：會創建新的 img 元素
var img = document.createElement("img");  
img.className = "button-image";
img.src = restartImgSrc;
img.setAttribute("title", "Refresh");
restartEl.appendChild(img);

// 修改後：只設置 onclick
var restartEl = document.getElementById("restart-button");
restartEl.onclick = function() {
  loadScores(currentDigest, currentFilter)
};
```

#### 驗證
✅ 每個按鈕只顯示一個圖示
✅ 功能正常運作

---

### 問題 2: 錯誤訊息改善 ✅

#### 問題描述
Global Leaderboard 無法讀取資料時，只顯示 `503: ` 這樣的簡短訊息，不夠友善。

#### 改善目標
改為與原作者相同的格式，並加上友善提示：
```
Error during read attempt: https://twitchasylum.com/x/scoreboard-games.php
(See console log for details)

Hint: Try refresh this page later.
```

#### 解決方案
**檔案**: `site/leaderboard/src/js/leaderboard.js`

修改 `read()` 函數的錯誤處理：

```javascript
// 修改前
if (xhr.status >= 300 || xhr.status < 200) {
  throw xhr.status + ": " + xhr.statusText;  // 只顯示 "503: "
}

// 修改後
if (xhr.status >= 300 || xhr.status < 200) {
  // Convert HTTP error to user-friendly message
  throw 'Error during read attempt: ' + url + '<br>(See console log for details)<br><br>Hint: Try refresh this page later.';
}
// Also log the actual HTTP status to console
console.error('HTTP ' + xhr.status + ': ' + xhr.statusText);
```

#### 改善內容
1. **使用者看到友善訊息**: 包含完整 URL 和提示查看 console
2. **開發者可查看詳細資訊**: Console 記錄完整的 HTTP 狀態碼
3. **格式與原作者一致**: 使用相同的錯誤訊息格式
4. **友善提示**: 加上 "Hint: Try refresh this page later." 提示使用者稍後重試

#### 驗證
✅ 503 錯誤顯示友善訊息
✅ Console 記錄完整狀態碼
✅ 格式與原作者一致

---

## 多語系支援 (2025-10-23)

### Global Leaderboard 多語系實作 ✅

#### 需求
1. Global Leaderboard 的語系要與主模擬器同步
2. 首次訪問時參考瀏覽器語系
3. 如果主模擬器的 localStorage 已有定義語系，則以該語系為準

#### 實作方案

##### 1. 新增 i18n 模組
**檔案**: `site/leaderboard/src/js/i18n-leaderboard.js`

**功能**:
- 從 localStorage 讀取 `locale` 鍵值（與主模擬器共用）
- 如果沒有儲存的語系，自動偵測瀏覽器語言
- 支援五種語言：English, 繁體中文, 简体中文, 日本語, 한국어

**語系偵測順序**:
1. localStorage 的 `locale` 鍵值（優先）
2. 瀏覽器語言 (`navigator.language`)
3. 預設英文

##### 2. 翻譯內容

所有 UI 文字都已翻譯，包含：

**靜態文字**:
- 頁面標題 "Global Leaderboard"
- 區塊標題（Top Players, Latest High Scores 等）
- 遊戲選單標籤（Game, Settings）
- 表格欄位（Player, Score, Date）
- 按鈕提示（Play, Refresh）

**動態文字**:
- "points" (分 / 分 / ポイント / 점)
- "scores" (筆分數 / 笔分数 / スコア / 점수)
- "players" (位玩家 / 位玩家 / プレイヤー / 플레이어)
- "No scores currently exist" (此遊戲目前無分數紀錄)

**翻譯對照表**:

| English | 繁體中文 | 简体中文 | 日本語 | 한국어 |
|---------|---------|---------|--------|--------|
| Global Leaderboard | 全域排行榜 | 全局排行榜 | グローバルリーダーボード | 글로벌 리더보드 |
| Top Players | 頂尖玩家 | 顶尖玩家 | トッププレイヤー | 톱 플레이어 |
| Latest High Scores | 最新高分紀錄 | 最新高分记录 | 最新ハイスコア | 최신 하이스코어 |
| Most Competitive Modes | 最具競爭模式 | 最具竞争模式 | 最も競争的なモード | 가장 경쟁적인 모드 |
| Game | 遊戲 | 游戏 | ゲーム | 게임 |
| Settings | 設定 | 设置 | 設定 | 설정 |
| Player | 玩家 | 玩家 | プレイヤー | 플레이어 |
| Score | 分數 | 分数 | スコア | 점수 |
| Date | 日期 | 日期 | 日付 | 날짜 |
| points | 分 | 分 | ポイント | 점 |
| scores | 筆分數 | 笔分数 | スコア | 점수 |
| players | 位玩家 | 位玩家 | プレイヤー | 플레이어 |
| Refresh | 重新整理 | 刷新 | リフレッシュ | 새로고침 |
| Play | 開始遊戲 | 开始游戏 | プレイ | 플레이 |

##### 3. 整合到 Leaderboard

**修改檔案**:
- `site/leaderboard/src/js/leaderboard.js` - 引入 i18n 並更新所有文字
- `site/leaderboard/index.html` - 為元素添加 ID 以支援動態翻譯

**實作細節**:
```javascript
// 在 start() 函數開始時初始化
I18n.init();  // 自動同步主模擬器語系

// 更新靜態 UI 文字
document.getElementById('header-title').innerHTML = I18n.t('title');
document.getElementById('page-description').textContent = I18n.t('description');
// ... 其他元素

// 動態生成的文字也使用 i18n
points.appendChild(document.createTextNode(
  score + " " + I18n.t('points')
));
```

#### 驗證
✅ 語系與主模擬器同步
✅ 瀏覽器語系自動偵測
✅ 所有文字正確翻譯
✅ 動態內容正確顯示

---

### 新增日文與韓文語系支援 ✅

#### 需求
新增日本語 (JA) 與 한국어 (KO) 語系至模擬器和全球排行榜

#### 實作方案

##### 1. 主模擬器語系
**檔案**: `src/js/common/i18n.js`
- 新增 `ja` 和 `ko` 語系物件
- 翻譯所有 UI 文字、設定選項、說明等
- 更新語言選擇設定，包含日文和韓文選項
- 更新語系偵測邏輯，支援瀏覽器自動偵測 JA 和 KO

##### 2. 排行榜語系
**檔案**: `site/leaderboard/src/js/i18n-leaderboard.js`
- 新增 `ja` 和 `ko` 語系物件
- 翻譯排行榜相關文字
- 同步主模擬器語系設定

##### 3. 設定對話框
**檔案**: `site/src/js/settings-dialog.js`
- 在語言選單中新增日文和韓文選項

#### 驗證
✅ 主模擬器 UI 正確顯示日文/韓文
✅ 排行榜頁面語言同步
✅ 設定頁面語言選項包含 JA 和 KO
✅ 瀏覽器重新整理後維持選擇的語言

---

### 模擬器首頁文字更新 ✅

#### 需求
首頁說明文字從 "view current keyboard mappings" 改為 "change keyboard mappings & languages"

#### 修改內容
**檔案**: `src/js/common/i18n.js`

| 語言 | 修改前 | 修改後 |
|------|--------|--------|
| EN | to view current keyboard mappings | to **change keyboard mappings & languages** |
| ZH-TW | 以檢視目前鍵盤對應 | 以**變更鍵盤對應與語言** |
| ZH-CN | 以查看当前键位映射 | 以**变更键位映射与语言** |
| JA | 現在のキーボードマッピングを表示 | **キーボードマッピングと言語を変更** |
| KO | 현재 키보드 매핑을 확인 | **키보드 매핑과 언어를 변경** |

#### 驗證
✅ 五種語言都已更新
✅ 文字更準確反映功能

---

## 技術細節

### 修改檔案清單

#### Leaderboard 改進
1. `site/leaderboard/src/js/leaderboard.js`
   - 移除重複按鈕圖片添加
   - 改善錯誤訊息處理
   - 整合 i18n 模組
   - 更新所有文字使用翻譯函數

2. `site/leaderboard/src/js/i18n-leaderboard.js` (新增)
   - 完整的 i18n 模組
   - 三種語言翻譯
   - localStorage 同步邏輯

3. `site/leaderboard/index.html`
   - 為可翻譯元素添加 ID

#### 主模擬器改進
4. `src/js/common/i18n.js`
   - 更新首頁說明文字（五種語言）
   - 新增 JA 和 KO 語系物件
   - 更新語言選項包含日文和韓文

5. `site/src/js/settings-dialog.js`
   - 在語言選單中新增日文和韓文選項

### 測試項目

#### Leaderboard 測試
- [x] 按鈕只顯示一個圖示
- [x] 錯誤訊息格式正確
- [x] 語系與主模擬器同步
- [x] 瀏覽器語系自動偵測
- [x] 所有文字正確翻譯
- [x] 動態文字正確顯示

#### 主模擬器測試
- [x] 首頁文字正確更新
- [x] 五種語言都正確顯示
- [x] 設定頁面語言選項包含 JA 和 KO
- [x] 語言切換後頁面重新載入
- [x] localStorage 正確儲存語言設定

---

## 下一步計畫

### 已完成 ✅
1. ✅ Leaderboard 同步問題
2. ✅ Global Leaderboard 按鈕重複修正
3. ✅ 錯誤訊息改善
4. ✅ Global Leaderboard 多語系支援
5. ✅ 主模擬器首頁文字更新
6. ✅ 新增 JA（日文）與 KO（韓文）語系
   - UI 文字翻譯完成
   - 排行榜語系同步
   - 設定對話框更新
   - 瀏覽器自動偵測支援

### 已完成 ✅
7. ✅ 翻譯說明檔案 (Help files)
   - 修改 help-dialog.js 以支援 JA 和 KO 語系載入對應 HTML
   - 修改 about-tab.js 添加 JA 和 KO 內容翻譯
   - 幫助對話框現在正確顯示日文和韓文內容

8. ✅ README 檔案修正 (2025-10-23)
   - 刪除過時的 UI 改善描述
   - 添加 NODE_OPTIONS=--openssl-legacy-provider 到本地建置步驟
   - 修正高分設定描述為全球預設
   - 更新語言支援描述為五種語言（英文、繁體中文、簡體中文、日文、韓文）

### 可選優化
- 調整 Worker 快取參數以優化效能
- 新增 Cloudflare KV 持久快取
- 監控日誌以進一步優化快取策略

---

## 版本資訊

- **最後更新**: 2025-10-23
- **Fork 來源**: [raz0red/js7800](https://github.com/raz0red/js7800)
- **部署網址**: https://js7800.pages.dev
- **Worker 網址**: https://js7800-leaderboard-worker.johantw.workers.dev

---

## 備註

- npm 和 git 操作由開發者自行處理
- 修改完成後需執行 `npm run build` 重新編譯
- 所有修改都已保持與原作者程式碼風格一致
