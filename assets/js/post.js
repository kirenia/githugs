// two things a post gets. both are extras: with js off the post is whole
(function () {
  // 1. the reading bar. a thin line across the top that fills as you read.
  //    built here so a page with js off has no empty bar sitting there
  const post = document.querySelector(".post");
  if (post) {
    const bar = document.createElement("div");
    bar.className = "progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    let queued = false;
    const fill = () => {
      queued = false;
      // how far through the post, so the footer doesn't count
      const end = post.offsetTop + post.offsetHeight - window.innerHeight;
      const read = end > 0 ? Math.min(Math.max(window.scrollY / end, 0), 1) : 1;
      bar.style.setProperty("--read", read);
    };
    const ask = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(fill);
    };
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", ask);
    fill();
  }

  // 2. tables. on a phone css turns each row into its own little card and
  //    every cell needs to say which column it came from, so the heading
  //    is copied onto the cell. the roles keep it a table for a screen
  //    reader once css has changed how it is laid out
  document.querySelectorAll(".post-content table").forEach((table) => {
    const heads = [...table.querySelectorAll("thead th")].map((th) => th.textContent.trim());
    if (!heads.length) return;
    table.setAttribute("role", "table");
    table.querySelectorAll("thead, tbody").forEach((g) => g.setAttribute("role", "rowgroup"));
    table.querySelectorAll("tr").forEach((tr) => tr.setAttribute("role", "row"));
    table.querySelectorAll("th").forEach((th) => th.setAttribute("role", "columnheader"));
    table.querySelectorAll("tbody tr").forEach((tr) => {
      [...tr.children].forEach((cell, i) => {
        cell.setAttribute("role", "cell");
        if (heads[i]) cell.dataset.label = heads[i];
      });
    });
    table.classList.add("is-stacked");
  });
})();
