const { cors, readLocalState, readGithubState } = require('../lib/githubState');

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'GET only' }));
  }

  try {
    const ghToken = process.env.GITHUB_TOKEN;
    let state;
    if (ghToken) {
      ({ state } = await readGithubState(ghToken));
      console.log('[api/state] github', state.meta?.lastUpdated);
    } else {
      state = readLocalState();
      console.log('[api/state] local fallback');
    }
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(state));
  } catch (err) {
    console.error('[api/state] ERROR', err);
    try {
      const state = readLocalState();
      console.log('[api/state] recovered via local after error');
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(state));
    } catch (e2) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: err.message }));
    }
  }
};
