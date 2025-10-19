addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname; // Get the path for routing
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
        console.log(`KV miss for ${key}, fetching from original source.`);
        try {
          const originalUrl = `https://twitchasylum.com/x/load.php?d=${digest}`;
          const response = await fetch(originalUrl);

          if (response.ok) {
            data = await response.text();
            await js7800globalhiscore.put(key, data);
            console.log(`Fetched and stored ${key} from original source.`);
          } else {
            console.error(`Failed to fetch from original source: ${response.status} ${response.statusText}`);
            return new Response(`Failed to fetch leaderboard from original source: ${response.statusText}`, { status: response.status, headers: corsHeaders });
          }
        } catch (error) {
          console.error(`Error fetching from original source: ${error.message}`);
          return new Response(`Error fetching leaderboard from original source: ${error.message}`, { status: 500, headers: corsHeaders });
        }
      }
      return new Response(data, { headers: { ...corsHeaders, 'Content-Type': 'text/plain;charset=UTF-8' } });

    } else if (request.method === 'POST') {
      const body = await request.text();
      await js7800globalhiscore.put(key, body);
      console.log(`Stored ${key} with new data.`);
      return new Response('OK', { headers: corsHeaders });
    }
  }
  // --- Handle /summary ---
  else if (path === '/summary') {
    if (request.method === 'GET') {
      try {
        const originalUrl = `https://twitchasylum.com/x/scoreboard-summary.php`;
        const response = await fetch(originalUrl);
        const data = await response.text();
        return new Response(data, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (error) {
        console.error(`Error fetching summary: ${error.message}`);
        return new Response(`Error fetching summary: ${error.message}`, { status: 500, headers: corsHeaders });
      }
    }
  }
  // --- Handle /games ---
  else if (path === '/games') {
    if (request.method === 'GET') {
      try {
        const originalUrl = `https://twitchasylum.com/x/scoreboard-games.php`;
        const response = await fetch(originalUrl);
        const data = await response.text();
        return new Response(data, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (error) {
        console.error(`Error fetching games list: ${error.message}`);
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
        const response = await fetch(originalUrl);
        const data = await response.text();
        return new Response(data, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (error) {
        console.error(`Error fetching scores for digest ${digest}: ${error.message}`);
        return new Response(`Error fetching scores: ${error.message}`, { status: 500, headers: corsHeaders });
      }
    }
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}