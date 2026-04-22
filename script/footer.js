import gsap from "gsap";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Formspree endpoint
const FORMSPREE_ENDPOINT = "https://formspree.io/f/myzndvlb";

class FooterEmailForm {
  constructor() {
    this.form = document.getElementById("footer-email-form");
    this.input = document.getElementById("footer-email");
    this.button = this.form?.querySelector('button[type="submit"]');
    this.feedback = document.getElementById("footer-email-feedback");
    
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.input.addEventListener("input", () => this.clearFeedback());
  }

  async handleSubmit(e) {
    e.preventDefault();

    const email = this.input.value.trim();

    // Validate email
    if (!this.validateEmail(email)) {
      this.showFeedback("Please enter a valid email address", "error");
      return;
    }

    // Show loading state
    this.setLoadingState(true);

    try {
      // Submit to Formspree
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        this.showFeedback("Thanks! You're on the list ✓", "success");
        this.form.reset();
        
        // Optional: Track with analytics
        this.trackSubmission(email);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      this.showFeedback("Something went wrong. Please try again.", "error");
    } finally {
      this.setLoadingState(false);
    }
  }

  validateEmail(email) {
    return EMAIL_REGEX.test(email);
  }

  setLoadingState(isLoading) {
    if (isLoading) {
      this.button.classList.add("loading");
      this.button.disabled = true;
      this.input.disabled = true;
    } else {
      this.button.classList.remove("loading");
      this.button.disabled = false;
      this.input.disabled = false;
    }
  }

  showFeedback(message, type) {
    this.feedback.textContent = message;
    this.feedback.className = `footer-email-feedback ${type}`;
    
    // Animate feedback in
    gsap.fromTo(
      this.feedback,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );

    // Auto-hide success message after 5 seconds
    if (type === "success") {
      setTimeout(() => this.clearFeedback(), 5000);
    }
  }

  clearFeedback() {
    if (this.feedback.textContent) {
      gsap.to(this.feedback, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          this.feedback.textContent = "";
          this.feedback.className = "footer-email-feedback";
        },
      });
    }
  }

  trackSubmission(email) {
    // Add your analytics tracking here
    console.log("Email submitted:", email);
  }
}

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
  new FooterEmailForm();
  initFooterLabelScramble();
});
