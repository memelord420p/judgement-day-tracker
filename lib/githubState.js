const fs = require('fs');
const path = require('path');

const REPO = process.env.GITHUB_REPO || 'memelord420p/judgement-day-tracker';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const STATE_PATH = 'data/tracker-state.json';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
}

function readLocalState() {
  const p = path.join(process.cwd(), STATE_PATH);
  console.log('[githubState] reading local', p);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

async function readGithubState(token) {
  const url = `https://api.github.com/repos/${REPO}/contents/${STATE_PATH}?ref=${BRANCH}`;
  console.log('[githubState] GET', url);
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'judgement-day-tracker',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub read failed ${res.status}: ${text.slice(0, 200)}`);
  }
  const body = await res.json();
  const json = Buffer.from(body.content, 'base64').toString('utf8');
  return { state: JSON.parse(json), sha: body.sha };
}

async function writeGithubState(token, state, sha, message) {
  const content = Buffer.from(JSON.stringify(state, null, 2) + '\n', 'utf8').toString('base64');
  const url = `https://api.github.com/repos/${REPO}/contents/${STATE_PATH}`;
  console.log('[githubState] PUT', url);
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'judgement-day-tracker',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, content, sha, branch: BRANCH }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub write failed ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

function authorize(req) {
  const secret = (process.env.INGEST_SECRET || '').trim();
  if (!secret) throw new Error('INGEST_SECRET not configured on Vercel');

  const header = req.headers.authorization || req.headers.Authorization || '';
  let token = '';
  if (typeof header === 'string' && header.toLowerCase().startsWith('bearer ')) {
    token = header.slice(7).trim();
  }
  // Alternate header — easier for some agents / curl variants
  const alt = req.headers['x-ingest-secret'] || req.headers['X-Ingest-Secret'];
  if (!token && alt) token = String(alt).trim();

  // Strip accidental wrapping quotes from agent copy-paste
  if (
    (token.startsWith('"') && token.endsWith('"')) ||
    (token.startsWith("'") && token.endsWith("'"))
  ) {
    token = token.slice(1, -1).trim();
  }

  console.log('[auth] bearerPresent=', Boolean(header), 'altPresent=', Boolean(alt), 'tokenLen=', token.length, 'secretLen=', secret.length);

  if (!token || token !== secret) {
    const err = new Error(
      'Unauthorized — use Authorization: Bearer <INGEST_SECRET> or header X-Ingest-Secret: <INGEST_SECRET> (no quotes)'
    );
    err.statusCode = 401;
    throw err;
  }
}

module.exports = {
  REPO,
  BRANCH,
  STATE_PATH,
  cors,
  readLocalState,
  readGithubState,
  writeGithubState,
  authorize,
};
