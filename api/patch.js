const { applyPatch } = require('../lib/applyPatch');
const {
  cors,
  authorize,
  readGithubState,
  writeGithubState,
} = require('../lib/githubState');

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'POST only' }));
  }

  try {
    authorize(req);
    const ghToken = process.env.GITHUB_TOKEN;
    if (!ghToken) throw new Error('GITHUB_TOKEN not configured');

    let patch = req.body;
    if (typeof patch === 'string') patch = JSON.parse(patch);
    if (!patch || typeof patch !== 'object') throw new Error('Expected JSON patch body');
    console.log('[api/patch] patchId', patch.patchId, 'ops', patch.ops?.length);

    const { state, sha } = await readGithubState(ghToken);
    const next = applyPatch(JSON.parse(JSON.stringify(state)), patch);
    const msg = `🤖 tracker patch ${patch.patchId || 'manual'} — ${
      patch.summary || 'update'
    } (auto; not manually QA'd)`;
    await writeGithubState(ghToken, next, sha, msg);

    if (process.env.VERCEL_DEPLOY_HOOK_URL) {
      console.log('[api/patch] deploy hook');
      fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' }).catch((e) =>
        console.error('[api/patch] deploy hook error', e)
      );
    }

    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({
        ok: true,
        patchId: patch.patchId,
        lastUpdated: next.meta.lastUpdated,
        overall: {
          t800: next.fighters.t800.overall,
          t1000: next.fighters.t1000.overall,
          skynet: next.fighters.skynet.overall,
        },
        pendingPosts: (next.pendingPosts || []).length,
      })
    );
  } catch (err) {
    console.error('[api/patch] ERROR', err);
    res.statusCode = err.statusCode || 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: false, error: err.message || String(err) }));
  }
};
