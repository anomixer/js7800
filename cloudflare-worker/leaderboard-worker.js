addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// 簡單的記憶體快取（請注意：Worker 每次都會重新啟動，所以這只在單次連接中有效）
const requestCache = {};
const CACHE_DURATION = 30 * 1000; // 30 秒快取
const MIN_REQUEST_INTERVAL = 10 * 1000; // 10 秒最小間隔
const lastRequestTime = {};

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

// 檢查是否是錯誤回應（data length 288 通常是錯誤頁面）
function isErrorResponse(text) {
  return text.length < 500 || text.startsWith('<');
}

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname
  const digest = url.searchParams.get('d')
  const session_id = url.searchParams.get('sid')

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // --- Handle / (individual game scores) ---
  if (path === '/') {
    if (!digest) {
      return new Response('Missing game digest (d) parameter', { status: 400, headers: corsHeaders });
    }
    const key = `leaderboard:${digest}`;

    if (request.method === 'GET') {
      let data = await js7800globalhiscore.get(key);

      if (data === null) {
        console.log(`[GET] KV miss for ${key}, fetching from original source.`);
        try {
          const originalUrl = `https://twitchasylum.com/x/load.php?d=${digest}`;
          console.log(`[GET] Fetching from: ${originalUrl}`);
          const response = await fetch(originalUrl);

          if (response.ok) {
            data = await response.text();
            await js7800globalhiscore.put(key, data);
            console.log(`[GET] Fetched and stored ${key} from original source. Data length: ${data.length}`);
          } else {
            console.error(`[GET] Failed to fetch from original source: ${response.status} ${response.statusText}`);
            return new Response(`Failed to fetch leaderboard from original source: ${response.statusText}`, { status: response.status, headers: corsHeaders });
          }
        } catch (error) {
          console.error(`[GET] Error fetching from original source: ${error.message}`);
          return new Response(`Error fetching leaderboard from original source: ${error.message}`, { status: 500, headers: corsHeaders });
        }
      } else {
        console.log(`[GET] KV hit for ${key}. Data length: ${data.length}`);
      }
      return new Response(data, { headers: { ...corsHeaders, 'Content-Type': 'text/plain;charset=UTF-8' } });

    } else if (request.method === 'POST') {
      const body = await request.text();
      console.log(`[POST] Received POST for digest ${digest}`);
      console.log(`[POST] Session ID: ${session_id}`);
      console.log(`[POST] Body length: ${body.length}`);
      console.log(`[POST] Body preview (first 100 chars): ${body.substring(0, 100)}`);
      
      // Save to KV
      try {
        await js7800globalhiscore.put(key, body);
        console.log(`[POST] ✅ Successfully stored ${key} to KV`);
      } catch (kvError) {
        console.error(`[POST] ❌ Error storing to KV: ${kvError.message}`);
      }
      
      // Proxy POST to original save.php to update global leaderboard
      try {
        const originalUrl = `https://twitchasylum.com/x/save.php?sid=${session_id}&d=${digest}`;
        console.log(`[POST] 🔄 Proxying POST to: ${originalUrl}`);
        
        const proxyResponse = await fetch(originalUrl, {
          method: 'POST',
          body: body,
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8'
          }
        });
        
        const proxyResponseText = await proxyResponse.text();
        console.log(`[POST] ✅ Proxy response status: ${proxyResponse.status} ${proxyResponse.statusText}`);
        console.log(`[POST] 📄 Proxy response body length: ${proxyResponseText.length}`);
        console.log(`[POST] 📄 Proxy response body: ${proxyResponseText.substring(0, 500)}`);
        console.log(`[POST] 📋 Proxy response headers: Content-Type=${proxyResponse.headers.get('content-type')}`);
        
        if (!proxyResponse.ok) {
          console.error(`[POST] ⚠️  Proxy POST returned non-200 status: ${proxyResponse.status}`);
        }
        
        if (proxyResponseText.length === 0) {
          console.warn(`[POST] ⚠️  WARNING: Proxy response body is empty!`);
        }
      } catch (proxyError) {
        console.error(`[POST] ❌ Error proxying to original save.php: ${proxyError.message}`);
        console.error(`[POST] Stack: ${proxyError.stack}`);
      }
      
      return new Response('OK', { headers: corsHeaders });
    }
  }
  // --- Handle /summary ---
  else if (path === '/summary') {
    if (request.method === 'GET') {
      const cacheKey = getCacheKey('https://twitchasylum.com/x/scoreboard-summary.php');
      
      // 檢查快取
      if (isCacheValid(cacheKey)) {
        console.log(`[SUMMARY] ✅ Returning cached data`);
        return new Response(getFromCache(cacheKey), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      // 檢查速率限制
      if (isRateLimited(cacheKey)) {
        console.log(`[SUMMARY] ⏱️  Rate limited, returning cached data if available`);
        const cached = getFromCache(cacheKey);
        if (cached) {
          return new Response(cached, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
      
      try {
        const originalUrl = `https://twitchasylum.com/x/scoreboard-summary.php`;
        console.log(`[SUMMARY] Fetching from: ${originalUrl}`);
        const response = await fetch(originalUrl);
        const data = await response.text();
        
        // 檢查是否是錯誤回應
        if (isErrorResponse(data)) {
          console.warn(`[SUMMARY] ⚠️  Received error response (length: ${data.length}), likely rate limited`);
          const cached = getFromCache(cacheKey);
          if (cached) {
            console.log(`[SUMMARY] 📦 Using cached data as fallback`);
            return new Response(cached, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
          }
          return new Response(`Error fetching summary: Server rate limited or error`, { status: 503, headers: corsHeaders });
        }
        
        console.log(`[SUMMARY] ✅ Fetched successfully. Data length: ${data.length}`);
        setCacheAndTime(cacheKey, data);
        return new Response(data, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (error) {
        console.error(`[SUMMARY] ❌ Error fetching summary: ${error.message}`);
        return new Response(`Error fetching summary: ${error.message}`, { status: 500, headers: corsHeaders });
      }
    }
  }
  // --- Handle /games ---
  else if (path === '/games') {
    if (request.method === 'GET') {
      const cacheKey = getCacheKey('https://twitchasylum.com/x/scoreboard-games.php');
      
      // 檢查快取
      if (isCacheValid(cacheKey)) {
        console.log(`[GAMES] ✅ Returning cached data`);
        return new Response(getFromCache(cacheKey), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      // 檢查速率限制
      if (isRateLimited(cacheKey)) {
        console.log(`[GAMES] ⏱️  Rate limited, returning cached data if available`);
        const cached = getFromCache(cacheKey);
        if (cached) {
          return new Response(cached, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
      
      try {
        const originalUrl = `https://twitchasylum.com/x/scoreboard-games.php`;
        console.log(`[GAMES] Fetching from: ${originalUrl}`);
        const response = await fetch(originalUrl);
        const data = await response.text();
        
        // 檢查是否是錯誤回應
        if (isErrorResponse(data)) {
          console.warn(`[GAMES] ⚠️  Received error response (length: ${data.length}), likely rate limited`);
          const cached = getFromCache(cacheKey);
          if (cached) {
            console.log(`[GAMES] 📦 Using cached data as fallback`);
            return new Response(cached, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
          }
          return new Response(`Error fetching games: Server rate limited or error`, { status: 503, headers: corsHeaders });
        }
        
        console.log(`[GAMES] ✅ Fetched successfully. Data length: ${data.length}`);
        setCacheAndTime(cacheKey, data);
        return new Response(data, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (error) {
        console.error(`[GAMES] ❌ Error fetching games list: ${error.message}`);
        return new Response(`Error fetching games list: ${error.message}`, { status: 500, headers: corsHeaders });
      }
    }
  }
  // --- Handle /scores ---
  else if (path === '/scores') {
    if (request.method === 'GET') {
      if (!digest) {
        return new Response('Missing game digest (d) parameter', { status: 400, headers: corsHeaders });
      }
      
      const cacheKey = getCacheKey(`https://twitchasylum.com/x/scoreboard-scores.php?d=${digest}`);
      
      // 檢查快取
      if (isCacheValid(cacheKey)) {
        console.log(`[SCORES] ✅ Returning cached data for ${digest}`);
        return new Response(getFromCache(cacheKey), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      // 檢查速率限制
      if (isRateLimited(cacheKey)) {
        console.log(`[SCORES] ⏱️  Rate limited, returning cached data if available`);
        const cached = getFromCache(cacheKey);
        if (cached) {
          return new Response(cached, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
      
      try {
        const originalUrl = `https://twitchasylum.com/x/scoreboard-scores.php?d=${digest}`;
        console.log(`[SCORES] Fetching from: ${originalUrl}`);
        const response = await fetch(originalUrl);
        const data = await response.text();
        
        // 檢查是否是錯誤回應
        if (isErrorResponse(data)) {
          console.warn(`[SCORES] ⚠️  Received error response (length: ${data.length}), likely rate limited`);
          const cached = getFromCache(cacheKey);
          if (cached) {
            console.log(`[SCORES] 📦 Using cached data as fallback`);
            return new Response(cached, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
          }
          return new Response(`Error fetching scores: Server rate limited or error`, { status: 503, headers: corsHeaders });
        }
        
        console.log(`[SCORES] ✅ Fetched successfully. Data length: ${data.length}`);
        setCacheAndTime(cacheKey, data);
        return new Response(data, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (error) {
        console.error(`[SCORES] ❌ Error fetching scores for digest ${digest}: ${error.message}`);
        return new Response(`Error fetching scores: ${error.message}`, { status: 500, headers: corsHeaders });
      }
    }
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}