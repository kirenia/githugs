// two small things every page wants
(function () {
  // off-site links open in their own tab and say so
  document.querySelectorAll('a[href^="http"]').forEach((a) => {
    if (a.hostname === location.hostname || a.target) return;
    a.target = "_blank";
    a.rel = (a.rel ? a.rel + " " : "") + "noopener noreferrer";
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
        label.textContent = d.presence_count + " online in githugs hq";
      })
      .catch(() => {});
  }

  // zen mode. strips the theme off and leaves plain html inter and a
  // serif for headings. the choice sticks and head.html applies it
  // before paint on the next page so nothing flashes.
  const zenBtn = document.querySelector("[data-zen-toggle]");
  if (zenBtn) {
    const theme = document.getElementById("theme-css");
    const icons = document.getElementById("icon-css");
    let fontsIn = !!document.querySelector('link[href*="Newsreader"]');

    const paint = (on) => {
      document.documentElement.dataset.zen = on ? "on" : "";
      if (theme) theme.disabled = on;
      if (icons) icons.disabled = on;
      zenBtn.setAttribute("aria-pressed", String(on));
      // the button says where it will take you: zen then back to neon
      zenBtn.textContent = on ? "neon" : "zen";
      if (on && !fontsIn) {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href =
          "https://fonts.googleapis.com/css2?family=Inter:wght@400;600" +
          "&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&display=swap";
        document.head.appendChild(l);
        fontsIn = true;
      }
    };

    paint(document.documentElement.dataset.zen === "on");

    zenBtn.addEventListener("click", () => {
      const on = document.documentElement.dataset.zen !== "on";
      paint(on);
      try {
        localStorage.setItem("zen", on ? "on" : "off");
      } catch (e) {}
    });
  }

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
