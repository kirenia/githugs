// two small things every page wants
(function () {
  // off-site links open in their own tab and say so
  document.querySelectorAll('a[href^="http"]').forEach((a) => {
    if (a.hostname === location.hostname) return;
    // some are already set to open a new tab in the markup. they get the note too
    if (!a.target) {
      a.target = "_blank";
      a.rel = (a.rel ? a.rel + " " : "") + "noopener noreferrer";
    }
    if (a.target !== "_blank") return;
    const note = document.createElement("span");
    note.className = "visually-hidden";
    note.textContent = " (opens in a new tab)";
    a.appendChild(note);
  });

  // how many people are in the discord right now. the widget has to be on
  // in server settings for this to answer; if it doesn't the line just
  // stays as it is.
  const hq = document.querySelector("[data-hq]");
  if (hq && window.fetch) {
    const guild = hq.dataset.hqGuild;
    const label = hq.querySelector("[data-hq-text]");
    fetch("https://discord.com/api/guilds/" + guild + "/widget.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (typeof d.presence_count !== "number") return;
        hq.classList.toggle("is-quiet", d.presence_count === 0);
        // only the first text node so the new tab note after it survives.
        // the tail is its own span so a phone can drop it and keep the count
        label.firstChild.nodeValue = d.presence_count + " online";
        const where = document.createElement("span");
        where.className = "hq__where";
        where.textContent = " in githugs hq";
        label.insertBefore(where, label.firstChild.nextSibling);
      })
      .catch(() => {});
  }

  // my last post on bluesky, laid out the way those old cover pages did a
  // tweet: face and name on top, the post underneath, a small date below.
  // public.api.bsky.app needs no key and sends cors headers. reposts and
  // replies are skipped so it only ever shows something i wrote. if
  // anything fails it stays hidden.
  const skeet = document.querySelector("[data-skeet]");
  if (skeet && window.fetch) {
    const actor = skeet.dataset.skeetActor;
    const api =
      "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed" +
      "?actor=" + encodeURIComponent(actor) +
      "&limit=20&filter=posts_no_replies";

    // day before month. the year only shows when it is not this one
    const stamp = (d) => {
      const opts = { day: "numeric", month: "long" };
      if (d.getFullYear() !== new Date().getFullYear()) opts.year = "numeric";
      return d.toLocaleDateString("en-GB", opts);
    };

    const el = (tag, cls, text) => {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text) n.textContent = text;
      return n;
    };

    fetch(api)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const mine = (d.feed || []).find(
          (x) => !x.reason && x.post && x.post.author.handle === actor
        );
        if (!mine) return;
        const who = mine.post.author;
        const rec = mine.post.record;
        const rkey = mine.post.uri.split("/").pop();
        const when = new Date(rec.createdAt);

        // avatar in column one, everything else in column two, so the
        // post and the date line up under the name like the old pages did
        const parts = [];
        if (who.avatar) {
          const img = el("img", "skeet__avatar");
          // the plain url is a 1000px file for a 40px circle. bluesky
          // serves a 128px one at the same path, so ask for that instead
          img.src = who.avatar.replace("/img/avatar/plain/", "/img/avatar_thumbnail/plain/");
          img.alt = "";           // decorative, the name is right there
          img.width = 40;
          img.height = 40;
          img.loading = "lazy";
          parts.push(img);
        }
        // name on one line, handle and date together on the next, so the
        // date costs no extra height
        const names = el("div", "skeet__who");
        const meta = el("p", "skeet__meta");
        const date = el("a", "skeet__when");
        date.href = "https://bsky.app/profile/" + actor + "/post/" + rkey;
        date.rel = "noopener noreferrer";
        date.target = "_blank";
        date.append(
          el("span", null, stamp(when)),
          el("span", "visually-hidden",
            " - read this post on Bluesky, posted " + when.toLocaleString())
        );
        meta.append(
          el("span", "skeet__handle", "@" + actor),
          el("span", "skeet__dot", "\u00b7"),
          date
        );
        names.append(el("span", "skeet__name", who.displayName || actor), meta);
        parts.push(names);

        // the butterfly sits out in the top corner the way the bird used to
        const mark = el("i", "fa-brands fa-bluesky skeet__mark");
        mark.setAttribute("aria-hidden", "true");
        parts.push(mark);

        const body = el("p", "skeet__text", rec.text.replace(/\s+/g, " ").trim());

        skeet.append(...parts, body);
        skeet.hidden = false;
      })
      .catch(() => {});
  }

  // for whoever opens the console
  const mono = "font-family: 'Fira Code', ui-monospace, monospace;";
  console.log(
    "%cgithugs(lol)\n" +
    "%coh hi! you found the console! welcome :)\n\n" +
    "%cfound a bug? tell me. githugs@proton.me\nthere is a cheat code. you know the one\nxo kire",
    mono + "font-size: 20px; font-weight: 700; color: #ff79c6;",
    mono + "font-size: 12px; line-height: 1.6; color: #8be9fd;",
    mono + "font-size: 12px; line-height: 1.6; color: #6272a4;"
  );
})();
