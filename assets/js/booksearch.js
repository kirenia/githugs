// live filter for /books/. without it the list still renders in full and
// the search box stays hidden, same as the media list post.
(function () {
  const box = document.getElementById("book-search");
  const list = document.getElementById("book-list");
  if (!box || !list) return;

  const books = [...list.children];
  const count = document.getElementById("book-count");
  const empty = document.getElementById("book-empty");

  box.addEventListener("input", () => {
    const q = box.value.trim().toLowerCase();
    let shown = 0;

    books.forEach((li) => {
      const hit = !q || li.dataset.find.includes(q);
      li.hidden = !hit;
      if (hit) shown++;
    });

    empty.hidden = shown > 0;
    count.textContent = q ? shown + " of " + books.length + " books" : "";
  });
})();
