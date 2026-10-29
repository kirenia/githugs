// posts anything new in _updates/ to every platform that has its secrets set.
// a platform with no secrets is skipped so adding one later means adding
// secrets and nothing else.
//
// .syndicated.json remembers which update went to which platform so a re-run
// cannot double post and adding a platform does not re-post the back
// catalogue to the ones that already had it.
//
// DRY_RUN=true prints what would go out and writes nothing.

import { loadUpdates, loadPosts, readState, writeState } from "./lib/updates.mjs";
import * as bluesky from "./targets/bluesky.mjs";
import * as mastodon from "./targets/mastodon.mjs";

const TARGETS = [bluesky, mastodon];
const dry = process.env.DRY_RUN === "true";

const active = TARGETS.filter((t) => t.configured());
const idle = TARGETS.filter((t) => !t.configured()).map((t) => t.name);

if (active.length === 0) {
  console.error("no platform is configured. nothing to do.");
  process.exit(1);
}
console.log(`posting to: ${active.map((t) => t.name).join(", ")}`);
if (idle.length) console.log(`skipping (no secrets): ${idle.join(", ")}`);

const { state, existed } = await readState();
const items = [...(await loadUpdates()), ...(await loadPosts())];

// without the state file every post looks new. that is almost always a
// missing commit rather than a real back catalogue so stop rather than
// fire off a dozen posts. SEED=true writes the file and sends nothing
if (!existed && items.length > 2) {
  if (process.env.SEED === "true") {
    const seeded = {};
    for (const item of items) seeded[item.slug] = active.map((t) => t.name);
    await writeState(seeded);
    console.log(`no state file. marked ${items.length} items as already sent and posted nothing.`);
    process.exit(0);
  }
  console.error(
    `.syndicated.json is missing and ${items.length} items look new.\n` +
    `that usually means it was not committed. run with SEED=true to write it\n` +
    `and send nothing, or DRY_RUN=true to see what would go out.`
  );
  process.exit(1);
}

let sent = 0;
let failed = 0;

for (const update of items) {
  const already = state[update.slug] || [];
  const todo = active.filter((t) => !already.includes(t.name));
  if (todo.length === 0) continue;

  console.log(`\n${update.slug}`);
  for (const target of todo) {
    try {
      await target.post(update, { dry });
      if (!dry) {
        state[update.slug] = [...(state[update.slug] || []), target.name];
        console.log(`  posted to ${target.name}`);
      }
      sent++;
    } catch (err) {
      // one platform being down must not stop the others or lose the record
      failed++;
      console.error(`  ${target.name} failed: ${err.message}`);
    }
  }
}

if (sent === 0 && failed === 0) {
  console.log("nothing new to post");
} else {
  console.log(`\n${sent} posted, ${failed} failed`);
}

if (!dry) await writeState(state);
if (failed > 0) process.exit(1);
