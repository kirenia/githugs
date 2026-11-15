// the fun stuff. none of it carries meaning and the site is whole without it
(function () {
  const me = document.currentScript;
  const root = document.documentElement;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 1. stickers you can peel off and move. mouse only so a thumb that is
  //    scrolling never grabs one. the offset is two custom properties and
  //    css does the moving so the tilt and the hover still work
  if (window.matchMedia("(pointer: fine)").matches) {
    document
      .querySelectorAll(".scatter .sticker, .page > .sticker, .post-content > .sticker")
      .forEach((sticker) => {
        let startX = 0, startY = 0, x = 0, y = 0, held = false;
        sticker.draggable = false;
        sticker.classList.add("sticker--loose");

        sticker.addEventListener("pointerdown", (e) => {
          if (e.button !== 0) return;
          held = true;
          startX = e.clientX - x;
          startY = e.clientY - y;
          sticker.setPointerCapture(e.pointerId);
          sticker.classList.add("is-held");
        });

        sticker.addEventListener("pointermove", (e) => {
          if (!held) return;
          x = e.clientX - startX;
          y = e.clientY - startY;
          sticker.style.setProperty("--dx", x + "px");
          sticker.style.setProperty("--dy", y + "px");
        });

        const drop = () => {
          held = false;
          sticker.classList.remove("is-held");
        };
        sticker.addEventListener("pointerup", drop);
        sticker.addEventListener("pointercancel", drop);
      });
  }

  // 2. the code. up up down down left right left right b a jacks you in
  //    (or out) and it rains stickers
  const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let at = 0;

  const rain = () => {
    const files = ((me && me.dataset.stickers) || "").split(",").filter(Boolean);
    const path = (me && me.dataset.stickerPath) || "/assets/img/stickers/";
    if (!files.length) return;

    const sky = document.createElement("div");
    sky.className = "rain";
    sky.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 30; i++) {
      const drop = document.createElement("img");
      drop.src = path + files[Math.floor(Math.random() * files.length)];
      drop.alt = "";
      drop.style.left = Math.random() * 100 + "%";
      drop.style.width = 2.5 + Math.random() * 3 + "rem";
      drop.style.animationDelay = Math.random() * 1.2 + "s";
      drop.style.animationDuration = 2.2 + Math.random() * 1.8 + "s";
      drop.style.setProperty("--spin", Math.round(Math.random() * 720 - 360) + "deg");
      sky.appendChild(drop);
    }
    document.body.appendChild(sky);
    setTimeout(() => sky.remove(), 5500);
  };

  document.addEventListener("keydown", (e) => {
    // not while someone is typing in a field
    if (e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    at = key === code[at] ? at + 1 : key === code[0] ? 1 : 0;
    if (at < code.length) return;
    at = 0;

    const jack = document.querySelector("[data-theme-toggle]");
    if (jack) jack.click();
    // reduced motion gets the theme flip and nothing that moves
    if (calm.matches) return;
    root.classList.add("glitch");
    setTimeout(() => root.classList.remove("glitch"), 600);
    rain();
  });
})();
