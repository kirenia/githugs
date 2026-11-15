// the copy buttons in the transmit boxes. each one names the id of the thing
// it copies. the label flips to "copied" for a moment so you know it took
(function () {
  const buttons = document.querySelectorAll("[data-copy]");

  buttons.forEach((button) => {
    const source = document.getElementById(button.dataset.copy);

    // nothing to copy or no clipboard: drop the button the text is still there
    if (!source || !navigator.clipboard) {
      button.hidden = true;
      return;
    }

    button.addEventListener("click", () => {
      // only the visible word flips. the hidden one that says what the
      // button copies stays put
      const word = button.querySelector("[data-copy-word]") || button;
      navigator.clipboard.writeText(source.innerText.trim()).then(() => {
        const label = word.textContent;
        word.textContent = "copied";
        setTimeout(() => { word.textContent = label; }, 1500);
      });
    });
  });
})();
