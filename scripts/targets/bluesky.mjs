// bluesky. app password from BLUESKY_HANDLE + BLUESKY_APP_PASSWORD.
// make the password at bsky.app > settings > privacy and security > app
// passwords. never your real one.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ROOT, mimeOf, imageSize } from "../lib/updates.mjs";

const PDS = "https://bsky.social";
const LIMIT = 300; // bluesky counts graphemes, this is close enough to guard

export const name = "bluesky";

export function configured() {
  return Boolean(process.env.BLUESKY_HANDLE && process.env.BLUESKY_APP_PASSWORD);
}

async function api(endpoint, { token, body, raw, type } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  headers["Content-Type"] = type || "application/json";
  const res = await fetch(`${PDS}/xrpc/${endpoint}`, {
    method: "POST",
    headers,
    body: raw || JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${endpoint} ${res.status}: ${await res.text()}`);
  return res.json();
}

// bluesky needs byte offsets not character offsets for the clickable bits
function linkFacets(text) {
  const facets = [];
  const re = /https?:\/\/[^\s]+/g;
  let m;
  while ((m = re.exec(text))) {
    const before = Buffer.byteLength(text.slice(0, m.index), "utf8");
    facets.push({
      index: { byteStart: before, byteEnd: before + Buffer.byteLength(m[0], "utf8") },
      features: [{ $type: "app.bsky.richtext.facet#link", uri: m[0] }],
    });
  }
  return facets;
}

let session = null;

export async function post({ slug, data, body }, { dry }) {
  let text = data.title;
  if (body) text += `\n\n${body}`;
  if (data.link) text += `\n\n${data.link}`;

  if ([...text].length > LIMIT) {
    console.warn(`  bluesky: ${[...text].length} characters, dropping the body`);
    text = data.title + (data.link ? `\n\n${data.link}` : "");
  }

  if (dry) {
    console.log(`  bluesky would post:\n${text.replace(/^/gm, "    ")}`);
    return;
  }

  if (!session) {
    session = await api("com.atproto.server.createSession", {
      body: {
        identifier: process.env.BLUESKY_HANDLE,
        password: process.env.BLUESKY_APP_PASSWORD,
      },
    });
  }

  const record = {
    $type: "app.bsky.feed.post",
    text,
    createdAt: new Date().toISOString(),
    langs: ["en"],
  };

  const facets = linkFacets(text);
  if (facets.length) record.facets = facets;

  if (data.image) {
    const file = path.join(ROOT, data.image.replace(/^\//, ""));
    const bytes = await readFile(file);
    if (bytes.length > 976560) {
      throw new Error(`${data.image} is ${bytes.length} bytes, over bluesky's blob limit`);
    }
    const { blob } = await api("com.atproto.repo.uploadBlob", {
      token: session.accessJwt,
      raw: bytes,
      type: mimeOf(file),
    });
    const image = { image: blob, alt: data.image_alt || "" };
    const size = imageSize(bytes);
    if (size) image.aspectRatio = size;
    record.embed = { $type: "app.bsky.embed.images", images: [image] };
    if (!data.image_alt) console.warn(`  bluesky: no image_alt, posting without alt text`);
  }

  await api("com.atproto.repo.createRecord", {
    token: session.accessJwt,
    body: { repo: session.did, collection: "app.bsky.feed.post", record },
  });
}
