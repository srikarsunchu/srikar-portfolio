// Hover scramble for footer column labels
function initFooterLabelScramble() {
  if (window.innerWidth < 1200) return;

  const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

  document.querySelectorAll(".footer-col-links").forEach((col) => {
    const label = col.querySelector(".footer-col-label");
    if (!label) return;

    // Store original text once from aria-label (set in HTML, never mutated)
    const originalText = label.getAttribute("aria-label") || label.textContent;
    const chars = originalText.split("");
    let isScrambling = false;

    col.addEventListener("mouseenter", () => {
      if (isScrambling) return;
      isScrambling = true;

      let iteration = 0;

      const interval = setInterval(() => {
        label.textContent = chars
          .map((char, i) => {
            // leave the arrow and spaces untouched
            if (char === " " || char === "▶") return char;
            // chars before iteration threshold have resolved
            if (i < Math.floor(iteration)) return chars[i];
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join("");

        iteration += 1.2;

        if (iteration >= chars.length) {
          clearInterval(interval);
          label.textContent = originalText;
          isScrambling = false;
        }
      }, 45);
    });
  });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initFooterLabelScramble();
});
