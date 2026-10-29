// mastodon or anything speaking its api. MASTODON_URL is the instance
// (https://social.lol) MASTODON_TOKEN an access token from
// preferences > development > new application with write:statuses and
// write:media ticked. nothing else.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ROOT, mimeOf } from "../lib/updates.mjs";

const LIMIT = 500; // the default instance limit. a long one just gets the title

export const name = "mastodon";

export function configured() {
  return Boolean(process.env.MASTODON_URL && process.env.MASTODON_TOKEN);
}

function base() {
  return process.env.MASTODON_URL.replace(/\/+$/, "");
}

async function api(endpoint, { body, form } = {}) {
  const headers = { Authorization: `Bearer ${process.env.MASTODON_TOKEN}` };
  if (!form) headers["Content-Type"] = "application/json";
  const res = await fetch(`${base()}${endpoint}`, {
    method: "POST",
    headers,
    body: form || JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`mastodon ${endpoint} ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function post({ slug, data, body }, { dry }) {
  let text = data.title;
  if (body) text += `\n\n${body}`;
  if (data.link) text += `\n\n${data.link}`;

  if ([...text].length > LIMIT) {
    console.warn(`  mastodon: ${[...text].length} characters, dropping the body`);
    text = data.title + (data.link ? `\n\n${data.link}` : "");
  }

  if (dry) {
    console.log(`  mastodon would post:\n${text.replace(/^/gm, "    ")}`);
    return;
  }

  const status = { status: text, visibility: "public", language: "en" };

  if (data.image) {
    const file = path.join(ROOT, data.image.replace(/^\//, ""));
    const bytes = await readFile(file);
    const form = new FormData();
    form.append("file", new Blob([bytes], { type: mimeOf(file) }), path.basename(file));
    if (data.image_alt) form.append("description", data.image_alt);
    else console.warn(`  mastodon: no image_alt, posting without alt text`);
    // v2 hands back the id straight away for a picture this size
    const media = await api("/api/v2/media", { form });
    status.media_ids = [media.id];
  }

  await api("/api/v1/statuses", { body: status });
}
