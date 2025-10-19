addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const digest = url.searchParams.get('d')
  const session_id = url.searchParams.get('sid') // For POST, though not strictly used by KV key

  // Set CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Allow all origins for now, user can restrict later
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS preflight request
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!digest) {
    return new Response('Missing game digest (d) parameter', { status: 400, headers: corsHeaders });
  }

  const key = `leaderboard:${digest}`; // Use a prefix for KV keys

  if (request.method === 'GET') {
    let data = await js7800globalhiscore.get(key); // js7800globalhiscore is bound via Cloudflare dashboard

    if (data === null) {
      // Data not in our KV, try to fetch from original source
      console.log(`KV miss for ${key}, fetching from original source.`);
      try {
        const originalUrl = `https://twitchasylum.com/x/load.php?d=${digest}`;
        const response = await fetch(originalUrl);

        if (response.ok) {
          data = await response.text();
          // Optionally, store this fetched data in KV for future requests
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
    const body = await request.text(); // Assuming the body is the base64 SRAM string
    await js7800globalhiscore.put(key, body);
    console.log(`Stored ${key} with new data.`);
    return new Response('OK', { headers: corsHeaders });
  }

  return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
}
