/**
 * JS7800 Global Leaderboard Sync Script
 * 
 * Fetches latest scores & summary from upstream (twitchasylum.com)
 * and writes them directly to Cloudflare KV (js7800globalhiscore).
 * 
 * Supports:
 * 1. Cloudflare REST API (via CLOUDFLARE_API_TOKEN & CLOUDFLARE_ACCOUNT_ID) - Recommended for CI/CD
 * 2. Wrangler CLI fallback (via npx wrangler kv) - For local execution
 */

const fs = require('fs');
const { execSync } = require('child_process');

const KV_NAMESPACE_ID = process.env.KV_NAMESPACE_ID || '6e6d5e88c82f4d72a6c510818c307860';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://raz0red.github.io/js7800/'
};

async function fetchJson(url) {
  try {
    const res = await fetch(url, { headers: FETCH_HEADERS });
    if (!res.ok) {
      console.warn(`[FETCH] ⚠️ ${url} returned status ${res.status}`);
      return null;
    }
    const text = await res.text();
    const trimmed = text.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      console.warn(`[FETCH] ⚠️ ${url} returned non-JSON response (length ${text.length})`);
      return null;
    }
    return text;
  } catch (err) {
    console.error(`[FETCH] ❌ Error fetching ${url}:`, err.message);
    return null;
  }
}

async function writeBulkToCloudflareApi(bulkEntries) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/bulk`;
  console.log(`[CF API] 🚀 Uploading ${bulkEntries.length} keys via Cloudflare KV Bulk API...`);
  
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bulkEntries)
  });

  const result = await res.json();
  if (result.success) {
    console.log(`[CF API] ✅ Successfully synchronized ${bulkEntries.length} keys to Cloudflare KV!`);
    return true;
  } else {
    console.error('[CF API] ❌ Bulk upload failed:', JSON.stringify(result.errors, null, 2));
    return false;
  }
}

function writeViaWrangler(key, valueText) {
  const tempFile = `temp_kv_${Date.now()}_${Math.floor(Math.random() * 1000)}.json`;
  try {
    fs.writeFileSync(tempFile, valueText);
    const cmd = `npx wrangler kv key put --remote --namespace-id ${KV_NAMESPACE_ID} ${key} --path ${tempFile}`;
    execSync(cmd, { stdio: 'pipe' });
    console.log(`[WRANGLER] ✅ Stored ${key}`);
  } catch (e) {
    console.warn(`[WRANGLER] ⚠️ Failed to write ${key}:`, e.message);
  } finally {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
}

async function main() {
  console.log('=== JS7800 Leaderboard Sync Starting ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);

  const bulkEntries = [];

  // 1. Fetch Summary from upstream
  console.log('\n[1/3] Fetching summary...');
  const summaryJson = await fetchJson('https://twitchasylum.com/x/scoreboard-summary.php');

  // Check if summary changed compared to current KV cache
  let existingSummary = null;
  if (CF_API_TOKEN && CF_ACCOUNT_ID) {
    try {
      const getRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/values/cache:summary`, {
        headers: { 'Authorization': `Bearer ${CF_API_TOKEN}` }
      });
      if (getRes.ok) existingSummary = await getRes.text();
    } catch (e) {
      console.warn('⚠️ Could not fetch existing summary from KV:', e.message);
    }
  }

  const isSummaryChanged = !existingSummary || (summaryJson && summaryJson.trim() !== existingSummary.trim());
  console.log(`✅ Summary fetched. Changed: ${isSummaryChanged ? 'YES (Will sync all games to KV)' : 'NO (No new scores detected - 0 KV writes will be consumed)'}`);

  // 2. Fetch Games List
  console.log('\n[2/3] Fetching games list...');
  const gamesJson = await fetchJson('https://twitchasylum.com/x/scoreboard-games.php');
  let digests = [];
  if (gamesJson) {
    try {
      const parsed = JSON.parse(gamesJson);
      if (Array.isArray(parsed.games)) {
        digests = parsed.games.map(g => g.digest).filter(Boolean);
      } else if (typeof parsed === 'object' && parsed !== null) {
        digests = Object.values(parsed).filter(d => typeof d === 'string' && d.length >= 10);
      }
      console.log(`✅ Games list fetched successfully (${digests.length} games found).`);
    } catch (e) {
      console.warn('⚠️ Could not parse games JSON:', e.message);
    }
  }

  // Fallback digest list if games list failed
  if (digests.length === 0) {
    digests = ['39dc7f6f39f9b3e341a5ffea76e71fb1']; // Pac-Man XM
  }

  // 3. Fetch Scores & Master SRAM only for games that actually changed
  if (isSummaryChanged) {
    if (summaryJson) bulkEntries.push({ key: 'cache:summary', value: summaryJson });
    if (!existingSummary && gamesJson) bulkEntries.push({ key: 'cache:games', value: gamesJson });

    // Determine target digests to sync:
    // If cold start (!existingSummary) or FORCE_SYNC_ALL, sync all games.
    // Otherwise, parse recentScores to pinpoint EXACTLY which games had new scores!
    let targetDigests = [];
    const forceAll = process.env.FORCE_SYNC_ALL === 'true';

    if (!existingSummary || forceAll) {
      targetDigests = digests;
      console.log(`\n[3/3] ⚡ Cold start / forced sync: syncing all ${targetDigests.length} games to KV...`);
    } else {
      const changedDigests = new Set();
      try {
        const oldParsed = JSON.parse(existingSummary);
        const newParsed = JSON.parse(summaryJson);
        const oldScoreKeys = new Set(
          (oldParsed.recentScores || []).map(s => `${s.digest}:${s.epoch}:${s.score}:${s.initials_str}`)
        );
        for (const s of (newParsed.recentScores || [])) {
          const key = `${s.digest}:${s.epoch}:${s.score}:${s.initials_str}`;
          if (!oldScoreKeys.has(key) && s.digest) {
            changedDigests.add(s.digest);
          }
        }
      } catch (e) {
        console.warn('⚠️ Error parsing summary diff:', e.message);
      }

      targetDigests = Array.from(changedDigests);
      console.log(`\n[3/3] 🎯 Smart Diff Analysis: ${targetDigests.length} game(s) had score changes: [${targetDigests.join(', ')}]`);
    }

    if (targetDigests.length > 0) {
      console.log(`⚡ Parallel syncing scores & Master SRAM for ${targetDigests.length} game(s)...`);
      const startTime = Date.now();
      const CHUNK_SIZE = 8;
      for (let i = 0; i < targetDigests.length; i += CHUNK_SIZE) {
        const chunk = targetDigests.slice(i, i + CHUNK_SIZE);
        await Promise.all(chunk.map(async (d) => {
          // 3.1 Fetch Leaderboard JSON
          const scoresJson = await fetchJson(`https://twitchasylum.com/x/scoreboard-scores.php?d=${d}`);
          if (scoresJson) {
            bulkEntries.push({ key: `cache:scores:${d}`, value: scoresJson });
          }

          // 3.2 Fetch Global Master SRAM
          try {
            const sramRes = await fetch(`https://twitchasylum.com/x/load.php?d=${d}`, { headers: FETCH_HEADERS });
            if (sramRes.ok) {
              const sramText = await sramRes.text();
              if (sramText.length > 500 && !sramText.trim().startsWith('<')) {
                bulkEntries.push({ key: `leaderboard:${d}`, value: sramText.trim() });
              }
            }
          } catch (sramErr) {
            console.warn(`SRAM fetch error for ${d}:`, sramErr.message);
          }
        }));
      }
      console.log(`⚡ Target games fetched in ${((Date.now() - startTime) / 1000).toFixed(1)}s!`);
    } else {
      console.log('⏩ No individual game scores changed (only summary metadata updated, 1 write).');
    }
  } else {
    console.log('\n[3/3] ⏩ Summary has not changed. Skipping score sync (0 KV writes consumed, 100% FREE).');
  }

  // 4. Save to Cloudflare KV only if there are changes
  if (bulkEntries.length > 0) {
    console.log(`\n=== Saving ${bulkEntries.length} items to Cloudflare KV ===`);
    if (CF_API_TOKEN && CF_ACCOUNT_ID) {
      await writeBulkToCloudflareApi(bulkEntries);
    } else {
      console.log('ℹ️ CLOUDFLARE_API_TOKEN not provided, using local Wrangler CLI...');
      for (const entry of bulkEntries) {
        writeViaWrangler(entry.key, entry.value);
      }
    }
  } else {
    console.log('\n=== No changes detected. 0 KV writes used ===');
  }

  console.log('\n=== Leaderboard Sync Completed ===');
}

main().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
