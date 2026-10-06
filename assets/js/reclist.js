// the media list sorts and filters itself. without this it still renders,
// grouped by media type, and the controls stay hidden.
(function () {
  const list = document.getElementById("reclist");
  if (!list) return;

  const buttons = [...document.querySelectorAll(".sorter__buttons button")];
  const search = document.getElementById("list-search");
  const status = document.getElementById("sort-status");
  const recs = [...list.querySelectorAll(".rec")];
  let mode = "type";

  const TYPE_LABEL = {
    book: "Books",
    essay: "Essays and Manifestos",
    film: "Films",
    tv: "TV and Anime",
    game: "Games",
    audio: "Audio",
  };
  const TYPE_ORDER = Object.keys(TYPE_LABEL);

  const attr = (r, name) => r.getAttribute(name) || "";
  const year = (r) => parseInt(attr(r, "data-year"), 10) || 9999;
  const byYear = (a, b) => year(a) - year(b);

  // one lowercase haystack per entry, so "gibson" and "film" both hit
  recs.forEach((r) => {
    r.dataset.haystack = [
      r.textContent,
      attr(r, "data-author"),
      attr(r, "data-universe"),
      attr(r, "data-type"),
      attr(r, "data-year"),
    ].join(" ").toLowerCase();
  });

  // blanks sort last whatever the order is
  const blanksLast = (rank) => (a, b) => {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    return rank(a, b);
  };
  const alphabetical = blanksLast((a, b) => a.localeCompare(b));
  const numeric = blanksLast((a, b) => parseInt(a, 10) - parseInt(b, 10));

  // rows in, [{ label, rows }] out. one entry per way of sorting.
  const GROUP_BY = {
    type: (rows) => bucket(rows, (r) => attr(r, "data-type"), {
      order: (a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b),
      label: (k) => TYPE_LABEL[k] || k,
    }),
    universe: (rows) => bucket(rows, (r) => attr(r, "data-universe"), {
      order: alphabetical,
      label: (k) => k || "everything else",
    }),
    year: (rows) => bucket(rows, (r) => decade(r), {
      order: numeric,
      label: (k) => k || "no date",
    }),
    title: (rows) => [{ label: "", rows: sortByAttr(rows, "data-title") }],
    author: (rows) => [{ label: "", rows: sortByAttr(rows, "data-author") }],
  };

  function decade(r) {
    const y = parseInt(attr(r, "data-year"), 10);
    return isNaN(y) ? "" : `${Math.floor(y / 10) * 10}s`;
  }

  function sortByAttr(rows, name) {
    const compare = blanksLast((a, b) => a.localeCompare(b));
    return [...rows].sort((a, b) => {
      const result = compare(attr(a, name), attr(b, name));
      return result === 0 ? byYear(a, b) : result;
    });
  }

  function bucket(rows, keyOf, { order, label }) {
    const groups = new Map();
    rows.forEach((r) => {
      const k = keyOf(r);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(r);
    });
    return [...groups.keys()]
      .sort(order)
      .map((k) => ({ label: label(k), rows: groups.get(k).sort(byYear) }));
  }

  function draw({ label, rows }) {
    const section = document.createElement("section");
    section.className = "rec-group";
    if (label) {
      // h2: these sit directly under the post's h1
      const h = document.createElement("h2");
      h.className = "rec-group__title";
      h.textContent = label;
      section.appendChild(h);
    }
    const dl = document.createElement("dl");
    dl.className = "recs";
    rows.forEach((r) => dl.appendChild(r));
    section.appendChild(dl);
    return section;
  }

  function say(text) {
    if (status) status.textContent = text;
  }

  function render() {
    const q = (search ? search.value : "").trim().toLowerCase();
    const rows = q ? recs.filter((r) => r.dataset.haystack.includes(q)) : [...recs];

    list.innerHTML = "";

    if (!rows.length) {
      const none = document.createElement("p");
      none.className = "rec-empty";
      none.textContent = `nothing matches “${q}”. it might still belong on the list, though.`;
      list.appendChild(none);
      say("no matches");
      return;
    }

    const groups = GROUP_BY[mode](rows);
    groups.forEach((g) => list.appendChild(draw(g)));

    if (q) say(`${rows.length} of ${recs.length} showing for “${q}”`);
    else if (mode === "year") say(`grouped by decade, ${groups.length} decades`);
    else say(`${recs.length} entries, sorted by ${mode === "type" ? "media type" : mode}`);
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      mode = btn.getAttribute("data-sort");
      buttons.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
      render();
    });
  });

  if (search) {
    search.addEventListener("input", render);
    search.addEventListener("search", render); // the little x in safari
  }
})();
