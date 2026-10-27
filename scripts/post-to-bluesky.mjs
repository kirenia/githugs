// posts new entries from _updates/ to bluesky, with the real image and the
// real alt text. runs from .github/workflows/post-updates.yml.
//
// an update is posted once. .bluesky-posted.json remembers which ones, so a
// re-run of the workflow can never post the same thing twice. drafts and
// anything marked past are skipped.

import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const UPDATES = path.join(ROOT, "_updates");
const STATE = path.join(ROOT, ".bluesky-posted.json");
const PDS = "https://bsky.social";
const LIMIT = 300; // bluesky counts graphemes, this is close enough to guard

const HANDLE = process.env.BLUESKY_HANDLE;
const PASSWORD = process.env.BLUESKY_APP_PASSWORD;
const DRY = process.env.DRY_RUN === "true";

if (!HANDLE || !PASSWORD) {
  console.error("missing BLUESKY_HANDLE or BLUESKY_APP_PASSWORD");
  process.exit(1);
}

// front matter: only the handful of keys these files use, so no yaml library
function parse(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (v === "true") v = true;
    else if (v === "false") v = false;
    data[kv[1]] = v;
  }
  return { data, body: m[2].trim() };
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
  if (!res.ok) {
    throw new Error(`${endpoint} ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// bluesky needs byte offsets, not character offsets, for the clickable bits
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

function mimeOf(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

const posted = JSON.parse(await readFile(STATE, "utf8").catch(() => "[]"));
const files = (await readdir(UPDATES)).filter((f) => f.endsWith(".md")).sort();

const queue = [];
for (const file of files) {
  const slug = file.replace(/\.md$/, "");
  if (posted.includes(slug)) continue;
  const parsed = parse(await readFile(path.join(UPDATES, file), "utf8"));
  if (!parsed) continue;
  const { data, body } = parsed;
  if (data.draft === true || data.past === true) continue;
  if (!data.title) continue;
  queue.push({ slug, data, body });
}

if (queue.length === 0) {
  console.log("nothing new to post");
  process.exit(0);
}

const session = DRY
  ? { accessJwt: "dry", did: "dry" }
  : await api("com.atproto.server.createSession", {
      body: { identifier: HANDLE, password: PASSWORD },
    });

for (const { slug, data, body } of queue) {
  let text = data.title;
  if (body) text += `\n\n${body}`;
  if (data.link) text += `\n\n${data.link}`;

  if ([...text].length > LIMIT) {
    console.warn(`${slug}: ${[...text].length} characters, dropping the body`);
    text = data.title + (data.link ? `\n\n${data.link}` : "");
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
    if (!DRY) {
      const { blob } = await api("com.atproto.repo.uploadBlob", {
        token: session.accessJwt,
        raw: bytes,
        type: mimeOf(file),
      });
      record.embed = {
        $type: "app.bsky.embed.images",
        images: [{ image: blob, alt: data.image_alt || "" }],
      };
    }
    if (!data.image_alt) console.warn(`${slug}: no image_alt, posting without alt text`);
  }

  if (DRY) {
    console.log(`would post ${slug}:\n${text}\n`);
  } else {
    await api("com.atproto.repo.createRecord", {
      token: session.accessJwt,
      body: { repo: session.did, collection: "app.bsky.feed.post", record },
    });
    console.log(`posted ${slug}`);
  }
  posted.push(slug);
}

if (!DRY) await writeFile(STATE, JSON.stringify(posted, null, 2) + "\n");
