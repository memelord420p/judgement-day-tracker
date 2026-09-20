#!/usr/bin/env node
/**
 * Apply a Grok Bot patch JSON onto data/tracker-state.json
 * Usage: node tools/apply-patch.js data/patches/your-patch.json [--dry-run]
 */
const fs = require('fs');
const path = require('path');
const { applyPatch } = require('../lib/applyPatch');

const ROOT = path.resolve(__dirname, '..');
const STATE_PATH = path.join(ROOT, 'data', 'tracker-state.json');

function log(...args) {
  console.log('[apply-patch]', ...args);
}

function fail(msg) {
  console.error('[apply-patch] ERROR:', msg);
  process.exit(1);
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const patchPath = args.find((a) => !a.startsWith('--'));
  if (!patchPath) fail('Usage: node tools/apply-patch.js <patch.json> [--dry-run]');

  const absPatch = path.resolve(patchPath);
  log('loading state', STATE_PATH);
  log('loading patch', absPatch, dryRun ? '(dry-run)' : '');

  const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  const patch = JSON.parse(fs.readFileSync(absPatch, 'utf8'));

  try {
    applyPatch(state, patch);
  } catch (e) {
    fail(e.message);
  }

  if (dryRun) {
    log(
      'DRY RUN OK — overall:',
      Object.fromEntries(Object.entries(state.fighters).map(([k, v]) => [k, v.overall]))
    );
    log('pendingPosts:', (state.pendingPosts || []).length);
    return;
  }

  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
  log('wrote', STATE_PATH);
  log('done. Push / redeploy, or POST to /api/patch for live ingest.');
}

main();
