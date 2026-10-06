// two small things every page wants.
(function () {
  // off-site links open in their own tab, and say so
  document.querySelectorAll('a[href^="http"]').forEach((a) => {
    if (a.hostname === location.hostname || a.target) return;
    a.target = "_blank";
    a.rel = (a.rel ? a.rel + " " : "") + "noopener noreferrer";
    const note = document.createElement("span");
    note.className = "visually-hidden";
    note.textContent = " (opens in a new tab)";
    a.appendChild(note);
  });

  // for whoever opens the console
  const mono = "font-family: 'Fira Code', ui-monospace, monospace;";
  console.log(
    "%cgithugs(lol)\n" +
    "%coh hi! you found the console! welcome :)\n\n" +
    "%cfound a bug? tell me. githugs@proton.me\nxo kire",
    mono + "font-size: 20px; font-weight: 700; color: #ff79c6;",
    mono + "font-size: 12px; line-height: 1.6; color: #8be9fd;",
    mono + "font-size: 12px; line-height: 1.6; color: #6272a4;"
  );
})();
