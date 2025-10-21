addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

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
        console.log(`[POST] 📄 Proxy response body: ${proxyResponseText.substring(0, 200)}`);
        
        if (!proxyResponse.ok) {
          console.error(`[POST] ⚠️  Proxy POST returned non-200 status: ${proxyResponse.status}`);
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
      try {
        const originalUrl = `https://twitchasylum.com/x/scoreboard-summary.php`;
        console.log(`[SUMMARY] Fetching from: ${originalUrl}`);
        const response = await fetch(originalUrl);
        const data = await response.text();
        console.log(`[SUMMARY] ✅ Fetched successfully. Data length: ${data.length}`);
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
      try {
        const originalUrl = `https://twitchasylum.com/x/scoreboard-games.php`;
        console.log(`[GAMES] Fetching from: ${originalUrl}`);
        const response = await fetch(originalUrl);
        const data = await response.text();
        console.log(`[GAMES] ✅ Fetched successfully. Data length: ${data.length}`);
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
      try {
        const originalUrl = `https://twitchasylum.com/x/scoreboard-scores.php?d=${digest}`;
        console.log(`[SCORES] Fetching from: ${originalUrl}`);
        const response = await fetch(originalUrl);
        const data = await response.text();
        console.log(`[SCORES] ✅ Fetched successfully. Data length: ${data.length}`);
        return new Response(data, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (error) {
        console.error(`[SCORES] ❌ Error fetching scores for digest ${digest}: ${error.message}`);
        return new Response(`Error fetching scores: ${error.message}`, { status: 500, headers: corsHeaders });
      }
    }
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}