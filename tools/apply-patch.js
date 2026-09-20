#!/usr/bin/env node
/**
 * Apply a Grok Bot patch JSON onto data/tracker-state.json
 * Usage: node tools/apply-patch.js data/patches/your-patch.json [--dry-run]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STATE_PATH = path.join(ROOT, 'data', 'tracker-state.json');

function log(...args) {
  console.log('[apply-patch]', ...args);
}

function fail(msg) {
  console.error('[apply-patch] ERROR:', msg);
  process.exit(1);
}

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function avgOverall(fighter) {
  if (!fighter.subcats?.length) return fighter.overall || 0;
  const sum = fighter.subcats.reduce((a, s) => a + (s.pct || 0), 0);
  return Math.round(sum / fighter.subcats.length);
}

function monthLabel(iso) {
  const d = new Date(iso);
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function applyOp(state, op) {
  log('op:', op.op, JSON.stringify(op).slice(0, 180));
  switch (op.op) {
    case 'prepend_headline': {
      const f = state.fighters[op.fighterId];
      if (!f) fail(`Unknown fighterId ${op.fighterId}`);
      const hl = { ...op.headline, fighterId: op.fighterId };
      f.headlines = [hl, ...(f.headlines || [])].slice(0, 20);
      break;
    }
    case 'set_subcat_pct': {
      const f = state.fighters[op.fighterId];
      const s = f?.subcats?.find(x => x.id === op.subcatId);
      if (!s) fail(`Unknown subcat ${op.fighterId}/${op.subcatId}`);
      if (typeof op.pct !== 'number' || op.pct < 0 || op.pct > 100) fail('pct must be 0-100');
      // Guardrails: no giant unexplained jumps
      const delta = Math.abs(op.pct - s.pct);
      if (delta > 15 && !op.force) {
        fail(`pct jump ${s.pct}->${op.pct} exceeds 15 without force:true (${op.reason || 'no reason'})`);
      }
      s.pct = op.pct;
      if (op.desc) s.desc = op.desc;
      break;
    }
    case 'set_milestone': {
      const f = state.fighters[op.fighterId];
      const s = f?.subcats?.find(x => x.id === op.subcatId);
      const m = s?.milestones?.find(x => x.id === op.milestoneId);
      if (!m) fail(`Unknown milestone ${op.milestoneId}`);
      if (typeof op.done === 'boolean') m.done = op.done;
      if (typeof op.partial === 'boolean') m.partial = op.partial;
      if (m.done) m.partial = false;
      break;
    }
    case 'set_subcat_desc': {
      const f = state.fighters[op.fighterId];
      const s = f?.subcats?.find(x => x.id === op.subcatId);
      if (!s) fail(`Unknown subcat ${op.subcatId}`);
      s.desc = op.desc;
      break;
    }
    case 'recompute_overall': {
      const f = state.fighters[op.fighterId];
      if (!f) fail(`Unknown fighterId ${op.fighterId}`);
      f.overall = avgOverall(f);
      log('recomputed overall (avg of subcats)', op.fighterId, f.overall);
      break;
    }
    case 'set_overall': {
      const f = state.fighters[op.fighterId];
      if (!f) fail(`Unknown fighterId ${op.fighterId}`);
      if (typeof op.overall !== 'number' || op.overall < 0 || op.overall > 100) {
        fail('overall must be 0-100');
      }
      const delta = Math.abs(op.overall - f.overall);
      if (delta > 15 && !op.force) {
        fail(`overall jump ${f.overall}->${op.overall} exceeds 15 without force:true`);
      }
      f.overall = op.overall;
      break;
    }
    case 'set_threat': {
      const f = state.fighters[op.fighterId];
      if (!f) fail(`Unknown fighterId ${op.fighterId}`);
      f.threat = op.threat;
      if (op.threatColor) f.threatColor = op.threatColor;
      break;
    }
    case 'set_meta': {
      Object.assign(state.meta, op.fields || {});
      break;
    }
    case 'draft_social_post': {
      // Stored for review / future MCP posting — never auto-publishes from this tool
      if (!state.pendingPosts) state.pendingPosts = [];
      state.pendingPosts.push({
        id: `post_${Date.now()}`,
        channel: op.channel || 'x',
        createdAt: new Date().toISOString(),
        status: 'pending_approval',
        ...op.post
      });
      log('queued social draft for approval on channel', op.channel || 'x');
      break;
    }
    case 'set_social_channel': {
      const ch = state.social.channels[op.channelId];
      if (!ch) fail(`Unknown channel ${op.channelId}`);
      Object.assign(ch, op.fields || {});
      break;
    }
    default:
      fail(`Unknown op: ${op.op}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const patchPath = args.find(a => !a.startsWith('--'));
  if (!patchPath) fail('Usage: node tools/apply-patch.js <patch.json> [--dry-run]');

  const absPatch = path.resolve(patchPath);
  log('loading state', STATE_PATH);
  log('loading patch', absPatch, dryRun ? '(dry-run)' : '');

  const state = loadJson(STATE_PATH);
  const patch = loadJson(absPatch);

  if (patch.schemaVersion !== 1) fail(`Unsupported patch schemaVersion ${patch.schemaVersion}`);
  if (!Array.isArray(patch.ops) || !patch.ops.length) fail('Patch has no ops');

  for (const op of patch.ops) applyOp(state, op);

  const now = new Date().toISOString();
  state.meta.lastUpdated = now;
  state.meta.lastUpdatedLabel = monthLabel(now);
  state.meta.dataSource = state.meta.dataSource || 'grok-bot-patch';
  state.changelog = [
    {
      id: patch.patchId || `chg_${Date.now()}`,
      at: now,
      by: patch.createdBy || 'apply-patch',
      type: 'patch',
      summary: patch.summary || 'Applied patch',
      patchId: patch.patchId
    },
    ...(state.changelog || [])
  ].slice(0, 100);

  if (dryRun) {
    log('DRY RUN OK — would write state with overall scores:',
      Object.fromEntries(Object.entries(state.fighters).map(([k, v]) => [k, v.overall])));
    log('pendingPosts:', (state.pendingPosts || []).length);
    return;
  }

  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
  log('wrote', STATE_PATH);
  log('done. Redeploy or refresh the site to pick up changes.');
}

main();
