/**
 * Shared patch applicator for CLI + Vercel API.
 * Throws Error on validation failure (API); CLI wraps with process.exit.
 */
function log(...args) {
  console.log('[apply-patch]', ...args);
}

function avgOverall(fighter) {
  if (!fighter.subcats?.length) return fighter.overall || 0;
  const sum = fighter.subcats.reduce((a, s) => a + (s.pct || 0), 0);
  return Math.round(sum / fighter.subcats.length);
}

function monthLabel(iso) {
  const d = new Date(iso);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function applyOp(state, op) {
  log('op:', op.op, JSON.stringify(op).slice(0, 180));
  switch (op.op) {
    case 'prepend_headline': {
      const f = state.fighters[op.fighterId];
      if (!f) throw new Error(`Unknown fighterId ${op.fighterId}`);
      const hl = { ...op.headline, fighterId: op.fighterId };
      f.headlines = [hl, ...(f.headlines || [])].slice(0, 20);
      break;
    }
    case 'set_subcat_pct': {
      const f = state.fighters[op.fighterId];
      const s = f?.subcats?.find((x) => x.id === op.subcatId);
      if (!s) throw new Error(`Unknown subcat ${op.fighterId}/${op.subcatId}`);
      if (typeof op.pct !== 'number' || op.pct < 0 || op.pct > 100) {
        throw new Error('pct must be 0-100');
      }
      const delta = Math.abs(op.pct - s.pct);
      if (delta > 15 && !op.force) {
        throw new Error(
          `pct jump ${s.pct}->${op.pct} exceeds 15 without force:true (${op.reason || 'no reason'})`
        );
      }
      s.pct = op.pct;
      if (op.desc) s.desc = op.desc;
      break;
    }
    case 'set_milestone': {
      const f = state.fighters[op.fighterId];
      const s = f?.subcats?.find((x) => x.id === op.subcatId);
      const m = s?.milestones?.find((x) => x.id === op.milestoneId);
      if (!m) throw new Error(`Unknown milestone ${op.milestoneId}`);
      if (typeof op.done === 'boolean') m.done = op.done;
      if (typeof op.partial === 'boolean') m.partial = op.partial;
      if (m.done) m.partial = false;
      break;
    }
    case 'set_subcat_desc': {
      const f = state.fighters[op.fighterId];
      const s = f?.subcats?.find((x) => x.id === op.subcatId);
      if (!s) throw new Error(`Unknown subcat ${op.subcatId}`);
      s.desc = op.desc;
      break;
    }
    case 'recompute_overall': {
      const f = state.fighters[op.fighterId];
      if (!f) throw new Error(`Unknown fighterId ${op.fighterId}`);
      f.overall = avgOverall(f);
      log('recomputed overall (avg of subcats)', op.fighterId, f.overall);
      break;
    }
    case 'set_overall': {
      const f = state.fighters[op.fighterId];
      if (!f) throw new Error(`Unknown fighterId ${op.fighterId}`);
      if (typeof op.overall !== 'number' || op.overall < 0 || op.overall > 100) {
        throw new Error('overall must be 0-100');
      }
      const delta = Math.abs(op.overall - f.overall);
      if (delta > 15 && !op.force) {
        throw new Error(`overall jump ${f.overall}->${op.overall} exceeds 15 without force:true`);
      }
      f.overall = op.overall;
      break;
    }
    case 'set_threat': {
      const f = state.fighters[op.fighterId];
      if (!f) throw new Error(`Unknown fighterId ${op.fighterId}`);
      f.threat = op.threat;
      if (op.threatColor) f.threatColor = op.threatColor;
      break;
    }
    case 'set_meta': {
      Object.assign(state.meta, op.fields || {});
      break;
    }
    case 'draft_social_post': {
      if (!state.pendingPosts) state.pendingPosts = [];
      state.pendingPosts.push({
        id: `post_${Date.now()}`,
        channel: op.channel || 'x',
        createdAt: new Date().toISOString(),
        status: 'pending_approval',
        ...op.post,
      });
      log('queued social draft for approval on channel', op.channel || 'x');
      break;
    }
    case 'set_social_channel': {
      const ch = state.social.channels[op.channelId];
      if (!ch) throw new Error(`Unknown channel ${op.channelId}`);
      Object.assign(ch, op.fields || {});
      break;
    }
    case 'set_brand_voice': {
      if (!state.social) state.social = {};
      state.social.brandVoice = {
        ...(state.social.brandVoice || {}),
        ...(op.brandVoice || op.fields || {}),
      };
      log('updated brandVoice');
      break;
    }
    default:
      throw new Error(`Unknown op: ${op.op}`);
  }
}

/**
 * @param {object} state
 * @param {object} patch
 * @returns {object} mutated state
 */
function applyPatch(state, patch) {
  if (patch.schemaVersion !== 1) {
    throw new Error(`Unsupported patch schemaVersion ${patch.schemaVersion}`);
  }
  if (!Array.isArray(patch.ops) || !patch.ops.length) {
    throw new Error('Patch has no ops');
  }
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
      patchId: patch.patchId,
    },
    ...(state.changelog || []),
  ].slice(0, 100);

  return state;
}

module.exports = { applyPatch, applyOp, avgOverall, monthLabel };
