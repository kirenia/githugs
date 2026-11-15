// the tag chips on the blog page. tap one and the list narrows to that tag
(function () {
  const chips = [...document.querySelectorAll("[data-filter]")];
  const rows = [...document.querySelectorAll(".post-list [data-tags]")];
  const status = document.querySelector("[data-filter-status]");
  if (!chips.length || !rows.length) return;

  let now = "";

  const show = (tag, say) => {
    // a tag nobody has falls back to everything
    if (tag && !chips.some((c) => c.dataset.filter === tag)) tag = "";
    now = tag;
    let count = 0;
    rows.forEach((row) => {
      const on = !tag || row.dataset.tags.split(" ").includes(tag);
      row.hidden = !on;
      if (on) count++;
    });
    chips.forEach((chip) => {
      if (chip.dataset.filter === tag) chip.setAttribute("aria-current", "true");
      else chip.removeAttribute("aria-current");
    });
    // the hash so a filtered list can be linked to and survives a reload
    history.replaceState(null, "", tag ? "#" + tag : location.pathname);
    if (say && status) {
      status.textContent = tag
        ? count + (count === 1 ? " post" : " posts") + " tagged " + tag
        : "showing every post";
    }
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", (e) => {
      e.preventDefault();
      // the one that is on switches back off
      show(chip.dataset.filter === now ? "" : chip.dataset.filter, true);
    });
  });

  if (location.hash.length > 1) show(decodeURIComponent(location.hash.slice(1)), false);
})();
