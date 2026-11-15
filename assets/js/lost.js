// the 404 page. shows the path that was asked for in the little terminal
(function () {
  const slot = document.querySelector("[data-lost-path]");
  if (!slot) return;
  // textContent so whatever is in the address bar stays text. long ones get cut
  let path = location.pathname;
  try { path = decodeURIComponent(path); } catch (e) {}
  slot.textContent = path.length > 60 ? path.slice(0, 57) + "..." : path;
})();
