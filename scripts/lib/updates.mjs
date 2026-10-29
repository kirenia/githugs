// reading _updates/ and remembering what already went out. shared by every
// target so they all agree on what "new" means.

import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

export const ROOT = process.cwd();
const UPDATES = path.join(ROOT, "_updates");
const POSTS = path.join(ROOT, "_posts");
const SITE = "https://githugs.lol";
const STATE = path.join(ROOT, ".syndicated.json");

// front matter: only the handful of keys these files use so no yaml library
export function parse(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (v === "true") v = true;
    else if (v === "false") v = false;
    data[kv[1]] = v;
  }
  return { data, body: m[2].trim() };
}

// state is { slug: ["bluesky" "mastodon"] } so adding a platform later
// does not re-post everything that already went to the old ones.
// the second value says whether the file was actually there. a missing
// state file and a full back catalogue means something went wrong, not that
// everything is new
export async function readState() {
  const raw = await readFile(STATE, "utf8").catch(() => null);
  return raw ? { state: JSON.parse(raw), existed: true } : { state: {}, existed: false };
}

export async function writeState(state) {
  await writeFile(STATE, JSON.stringify(state, null, 2) + "\n");
}

// announcements from _updates/. short their own link no permalink of
// their own.
export async function loadUpdates() {
  const files = (await readdir(UPDATES)).filter((f) => f.endsWith(".md")).sort();
  const out = [];
  for (const file of files) {
    const parsed = parse(await readFile(path.join(UPDATES, file), "utf8"));
    if (!parsed) continue;
    const { data, body } = parsed;
    if (data.draft === true || data.past === true) continue;
    if (!data.title) continue;
    out.push({ slug: "update:" + file.replace(/\.md$/, ""), data, body });
  }
  return out;
}

// blog posts from _posts/. the link is the post's own permalink built the
// same way _config.yml builds it: /:year/:month/:day/:title/
export async function loadPosts() {
  const files = (await readdir(POSTS)).filter((f) => /\.(md|markdown)$/.test(f)).sort();
  const out = [];
  for (const file of files) {
    const parsed = parse(await readFile(path.join(POSTS, file), "utf8"));
    if (!parsed) continue;
    const { data } = parsed;
    if (data.draft === true) continue;
    if (!data.title) continue;
    // a stub that only forwards somewhere else is not a post to announce
    if (data.redirect_to) continue;

    const m = file.match(/^(\d{4})-(\d{2})-(\d{2})-(.+?)\.(md|markdown)$/);
    if (!m) continue;
    const [, y, mo, d, title] = m;
    const link = `${SITE}/${y}/${mo}/${d}/${title}/`;

    out.push({
      slug: "post:" + file.replace(/\.(md|markdown)$/, ""),
      data: { ...data, link },
      // the blurb not the whole post
      body: (data.description || "").trim(),
    });
  }
  return out;
}

export function mimeOf(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

// a frame size so a wide photo is not letterboxed inside a tall box
export function imageSize(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) break;
    const marker = buf[i + 1];
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    const len = buf.readUInt16BE(i + 2);
    const isFrame =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isFrame) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}
