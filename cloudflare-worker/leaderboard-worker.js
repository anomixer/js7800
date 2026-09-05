// 記憶體快取（Worker 實例存活期間有效）
const requestCache = {};
const CACHE_DURATION = 3 * 1000; // 記憶體短快取 3 秒（防突發連擊，並確保多邊緣節點秒級同步）
const MIN_REQUEST_INTERVAL = 3 * 1000; // 最小請求間隔 3 秒
const lastRequestTime = {};

// 標準瀏覽器標頭，避免被原作者 cPanel / ModSecurity 阻擋 (403)
const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Origin': 'https://raz0red.github.io',
  'Referer': 'https://raz0red.github.io/js7800/'
};

function getCacheKey(url, method = 'GET') {
  return `${method}:${url}`;
}

function isCacheValid(key) {
  const cached = requestCache[key];
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_DURATION;
}

function isRateLimited(key) {
  const lastTime = lastRequestTime[key];
  if (!lastTime) return false;
  return Date.now() - lastTime < MIN_REQUEST_INTERVAL;
}

function setCacheAndTime(key, data) {
  requestCache[key] = {
    data: data,
    timestamp: Date.now()
  };
  lastRequestTime[key] = Date.now();
}

function getFromCache(key) {
  const cached = requestCache[key];
  return cached ? cached.data : null;
}

// 嚴格檢查是否為合法的 JSON 字串
function isValidJson(text) {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return false;
  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const path = url.pathname
    const digest = url.searchParams.get('d')
    const session_id = url.searchParams.get('sid')
    const kv = env.js7800globalhiscore;

    // 禁用瀏覽器客戶端快取，確保前端每次拿到的都是 Worker 最新資料
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // --- Handle / (individual game SRAM high scores) ---
    if (path === '/') {
      if (!digest) {
        return new Response('Missing game digest (d) parameter', { status: 400, headers: corsHeaders });
      }
      const key = `leaderboard:${digest}`;

      // 讀取高分 SRAM
      if (request.method === 'GET') {
        let data = null;
        if (kv) {
          try {
            data = await kv.get(key);
          } catch (kvErr) {
            console.warn(`[GET] KV get error: ${kvErr.message}`);
          }
        }

        if (data === null) {
          console.log(`[GET] KV miss for ${key}, fetching from original source.`);
          try {
            const originalUrl = `https://twitchasylum.com/x/load.php?d=${digest}`;
            const response = await fetch(originalUrl, { headers: FETCH_HEADERS });

            if (response.ok) {
              const fetchedData = await response.text();
              if (fetchedData.length > 500 && !fetchedData.trim().startsWith('<')) {
                data = fetchedData;
              }
            }
          } catch (error) {
            console.error(`[GET] Error fetching from original source: ${error.message}`);
          }
        }

        // 若無現存存檔，回傳空字串 (200 OK)，讓模擬器正常初始化預設 SRAM
        const returnData = data !== null ? data : '';
        return new Response(returnData, { headers: { ...corsHeaders, 'Content-Type': 'text/plain;charset=UTF-8' } });

      // 寫入高分 SRAM (破紀錄)
      } else if (request.method === 'POST') {
        const body = await request.text();
        console.log(`[POST] Received high score POST for digest ${digest}, Session ID: ${session_id}, Body length: ${body.length}`);
        
        // 1. 立即儲存最新 SRAM 到 KV (永久備份)
        if (kv) {
          try {
            await kv.put(key, body);
            console.log(`[POST] ✅ Successfully stored ${key} to KV`);
          } catch (kvError) {
            console.error(`[POST] ❌ Error storing to KV: ${kvError.message}`);
          }
        }
        
        // 2. 立即強制清除該遊戲與 Summary 的記憶體快取
        const scoresMemoryKey = getCacheKey(`https://twitchasylum.com/x/scoreboard-scores.php?d=${digest}`);
        const summaryMemoryKey = getCacheKey('https://twitchasylum.com/x/scoreboard-summary.php');
        delete requestCache[scoresMemoryKey];
        delete requestCache[summaryMemoryKey];
        delete lastRequestTime[scoresMemoryKey];
        delete lastRequestTime[summaryMemoryKey];
        
        // 3. Proxy 轉發 POST 到原作者 save.php 完成伺服器寫入
        try {
          const originalUrl = `https://twitchasylum.com/x/save.php?sid=${session_id}&d=${digest}`;
          console.log(`[POST] 🔄 Proxying POST to: ${originalUrl}`);
          
          const proxyResponse = await fetch(originalUrl, {
            method: 'POST',
            body: body,
            headers: {
              ...FETCH_HEADERS,
              'Content-Type': 'text/plain;charset=UTF-8'
            }
          });
          
          console.log(`[POST] ✅ Proxy response status: ${proxyResponse.status} ${proxyResponse.statusText}`);
        } catch (proxyError) {
          console.error(`[POST] ❌ Error proxying to original save.php: ${proxyError.message}`);
        }

        // 4. 寫入完成後，觸發 GitHub Actions 同步排行榜（由 GitHub Actions 抓取官方 JSON 寫入 KV）
        if (env.GITHUB_TOKEN) {
          ctx.waitUntil((async () => {
            try {
              console.log('[POST] 🚀 Dispatching GitHub Actions sync after score save...');
              await fetch('https://api.github.com/repos/anomixer/js7800/actions/workflows/sync-leaderboard.yml/dispatches', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
                  'Accept': 'application/vnd.github.v3+json',
                  'User-Agent': 'JS7800-Worker'
                },
                body: JSON.stringify({ ref: 'cf-pages' })
              });
            } catch (ghErr) {
              console.warn('[POST] GitHub dispatch error:', ghErr.message);
            }
          })());
        }
        
        return new Response('OK', { headers: corsHeaders });
      }
    }

    // 處理 JSON GET 請求（/summary, /games, /scores）
    // 架構原則：以 Cloudflare KV 為主要資料庫，輔以 3 秒短暫記憶體快取避免高頻連擊
    async function getJsonFromKvWithMemoryCache(originalUrl, kvCacheKey, logTag) {
      const memoryKey = getCacheKey(originalUrl);

      // 1. 記憶體快取在有效期間內（3 秒）直接回傳
      if (isCacheValid(memoryKey)) {
        const cached = getFromCache(memoryKey);
        if (cached && isValidJson(cached)) {
          return new Response(cached, { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Data-Source': 'memory-cache' } });
        }
      }

      // 2. 超過 3 秒或無快取，直接讀取 Cloudflare KV (單日 1000 萬次免費讀取，10ms 極速)
      if (kv && kvCacheKey) {
        try {
          const kvData = await kv.get(kvCacheKey);
          if (kvData && isValidJson(kvData)) {
            setCacheAndTime(memoryKey, kvData);
            return new Response(kvData, { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Data-Source': 'kv' } });
          }
        } catch (kvErr) {
          console.warn(`[${logTag}] ⚠️ KV read error: ${kvErr.message}`);
        }
      }

      // 3. 若 KV 尚未建立或為空（Cold Start），才嘗試向上游拉取
      try {
        console.log(`[${logTag}] KV miss, fetching from upstream: ${originalUrl}`);
        const response = await fetch(originalUrl, { headers: FETCH_HEADERS });
        const data = await response.text();

        if (response.ok && isValidJson(data)) {
          console.log(`[${logTag}] ✅ Upstream returned valid JSON`);
          setCacheAndTime(memoryKey, data);
          return new Response(data, { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Data-Source': 'upstream' } });
        }
      } catch (upstreamErr) {
        console.warn(`[${logTag}] ⚠️ Upstream fetch error: ${upstreamErr.message}`);
      }

      // 4. 若 upstream 也失敗，最後檢查記憶體是否有任何舊快取可用（僅作為 emergency fallback）
      const emergencyCache = getFromCache(memoryKey);
      if (emergencyCache && isValidJson(emergencyCache)) {
        return new Response(emergencyCache, { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Data-Source': 'emergency-fallback' } });
      }

      // 5. 無任何資料
      return new Response(JSON.stringify({ error: `Data unavailable for ${logTag}` }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // --- Handle /debug-upstream ---
    if (path === '/debug-upstream') {
      const targetUrl = digest 
        ? `https://twitchasylum.com/x/scoreboard-scores.php?d=${digest}`
        : 'https://twitchasylum.com/x/scoreboard-summary.php';
      try {
        const r = await fetch(targetUrl, { headers: FETCH_HEADERS });
        const text = await r.text();
        return new Response(JSON.stringify({
          targetUrl,
          status: r.status,
          statusText: r.statusText,
          headers: Object.fromEntries(r.headers.entries()),
          bodySnippet: text.slice(0, 500),
          isValidJson: isValidJson(text)
        }, null, 2), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // --- Handle /summary ---
    if (path === '/summary') {
      if (request.method === 'GET') {
        return await getJsonFromKvWithMemoryCache(
          'https://twitchasylum.com/x/scoreboard-summary.php',
          'cache:summary',
          'SUMMARY'
        );
      }
    }

    // --- Handle /games ---
    if (path === '/games') {
      if (request.method === 'GET') {
        return await getJsonFromKvWithMemoryCache(
          'https://twitchasylum.com/x/scoreboard-games.php',
          'cache:games',
          'GAMES'
        );
      }
    }

    // --- Handle /scores ---
    if (path === '/scores') {
      if (request.method === 'GET') {
        if (!digest) {
          return new Response(JSON.stringify({ error: 'Missing game digest (d) parameter' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        return await getJsonFromKvWithMemoryCache(
          `https://twitchasylum.com/x/scoreboard-scores.php?d=${digest}`,
          `cache:scores:${digest}`,
          `SCORES:${digest}`
        );
      }
    }

    // --- Handle /push-scores (瀏覽器直接推送最新 scores JSON 到 KV) ---
    if (path === '/push-scores') {
      if (request.method === 'POST') {
        if (!digest) {
          return new Response(JSON.stringify({ error: 'Missing game digest (d) parameter' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        try {
          const body = await request.text();
          if (!isValidJson(body)) {
            return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
          }
          // 直接更新 KV 與記憶體快取
          const scoresKvKey = `cache:scores:${digest}`;
          const scoresMemoryKey = getCacheKey(`https://twitchasylum.com/x/scoreboard-scores.php?d=${digest}`);
          if (kv) {
            await kv.put(scoresKvKey, body);
          }
          setCacheAndTime(scoresMemoryKey, body);
          console.log(`[PUSH-SCORES] ✅ KV & memory cache updated for ${scoresKvKey}`);
          return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        } catch (e) {
          console.error('[PUSH-SCORES] Error:', e.message);
          return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
    }

    // --- Handle /push-summary (瀏覽器直接推送最新 summary JSON 到 KV) ---
    if (path === '/push-summary') {
      if (request.method === 'POST') {
        try {
          const body = await request.text();
          if (!isValidJson(body)) {
            return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
          }
          const summaryMemoryKey = getCacheKey('https://twitchasylum.com/x/scoreboard-summary.php');
          if (kv) {
            await kv.put('cache:summary', body);
          }
          setCacheAndTime(summaryMemoryKey, body);
          console.log('[PUSH-SUMMARY] ✅ KV & memory cache updated for cache:summary');
          return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        } catch (e) {
          console.error('[PUSH-SUMMARY] Error:', e.message);
          return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
    }

    // --- Handle /refresh (瀏覽器觸發 Worker 背景重試更新 KV) ---
    if (path === '/refresh') {
      if (request.method === 'GET') {
        if (!digest) {
          return new Response(JSON.stringify({ error: 'Missing digest' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        const scoresMemoryKey = getCacheKey(`https://twitchasylum.com/x/scoreboard-scores.php?d=${digest}`);
        const summaryMemoryKey = getCacheKey('https://twitchasylum.com/x/scoreboard-summary.php');
        // 立即清除快取，確保下次讀取會拿最新資料
        delete requestCache[scoresMemoryKey];
        delete requestCache[summaryMemoryKey];
        delete lastRequestTime[scoresMemoryKey];
        delete lastRequestTime[summaryMemoryKey];

        // 背景多次 retry 更新 KV
        // 立即清除快取，確保下次讀取會拿最新資料
        delete requestCache[scoresMemoryKey];
        delete requestCache[summaryMemoryKey];
        delete lastRequestTime[scoresMemoryKey];
        delete lastRequestTime[summaryMemoryKey];
        console.log(`[REFRESH] 🧹 Memory cache purged for digest ${digest}`);

        return new Response(JSON.stringify({ ok: true, digest, message: 'Cache purged' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // --- Handle /trigger-sync (網頁載入時由瀏覽器靜默呼叫，觸發 GitHub Actions 同步) ---
    if (path === '/trigger-sync') {
      if (request.method === 'GET' || request.method === 'POST') {
        const now = Date.now();
        let dispatchResult = 'skipped';
        // 防抖限制：最多每 60 秒觸發一次 GitHub Actions，避免多用戶同時進入浪費 Actions 額度
        if (!globalThis.lastDispatchTime || (now - globalThis.lastDispatchTime > 60000)) {
          globalThis.lastDispatchTime = now;
          if (env.GITHUB_TOKEN) {
            try {
              console.log('[TRIGGER-SYNC] 🚀 Dispatching GitHub Actions sync-leaderboard workflow...');
              const ghRes = await fetch('https://api.github.com/repos/anomixer/js7800/actions/workflows/sync-leaderboard.yml/dispatches', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
                  'Accept': 'application/vnd.github.v3+json',
                  'User-Agent': 'JS7800-Worker'
                },
                body: JSON.stringify({ ref: 'cf-pages' })
              });
              const ghBody = await ghRes.text();
              dispatchResult = `status: ${ghRes.status}, body: ${ghBody || 'OK (204 No Content)'}`;
              console.log(`[TRIGGER-SYNC] GitHub dispatch status: ${ghRes.status}`);
            } catch (ghErr) {
              dispatchResult = `error: ${ghErr.message}`;
              console.warn('[TRIGGER-SYNC] GitHub dispatch error:', ghErr.message);
            }
          } else {
            dispatchResult = 'env.GITHUB_TOKEN is missing or undefined';
          }
        } else {
          dispatchResult = `rate_limited (last dispatched ${Math.round((now - globalThis.lastDispatchTime)/1000)}s ago)`;
        }
        return new Response(JSON.stringify({ ok: true, dispatchResult }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
}