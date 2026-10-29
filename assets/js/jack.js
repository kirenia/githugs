// jack in to the terminal jack out to daylight
// the pre-paint half of this is inline in _includes/head.html because it has to run before the browser paints anything.
(function () {
  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;

  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  const isDark = () =>
    root.dataset.theme ? root.dataset.theme === "dark" : prefersDark.matches;

  const label = () => {
    btn.textContent = isDark() ? "jack-out" : "jack-in";
  };

  btn.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    try {
      localStorage.setItem("theme", root.dataset.theme);
    } catch (e) {}
    label();
  });

  prefersDark.addEventListener("change", () => {
    if (!root.dataset.theme) label();
  });

  label();
})();
