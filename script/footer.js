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
    // Example: gtag('event', 'newsletter_signup', { email });
    console.log("Email submitted:", email);
  }
}

// Alternative: Use EmailJS instead of Formspree
// Uncomment and configure if you prefer EmailJS
/*
class FooterEmailFormEmailJS {
  constructor() {
    this.form = document.getElementById("footer-email-form");
    this.input = document.getElementById("footer-email");
    this.button = this.form?.querySelector('button[type="submit"]');
    this.feedback = document.getElementById("footer-email-feedback");
    
    // EmailJS configuration
    this.PUBLIC_KEY = "YOUR_PUBLIC_KEY";
    this.SERVICE_ID = "YOUR_SERVICE_ID";
    this.TEMPLATE_ID = "YOUR_TEMPLATE_ID";
    
    if (this.form) {
      this.initEmailJS();
      this.init();
    }
  }

  initEmailJS() {
    // Load EmailJS script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => {
      emailjs.init(this.PUBLIC_KEY);
    };
    document.head.appendChild(script);
  }

  async handleSubmit(e) {
    e.preventDefault();

    const email = this.input.value.trim();

    if (!this.validateEmail(email)) {
      this.showFeedback("Please enter a valid email address", "error");
      return;
    }

    this.setLoadingState(true);

    try {
      await emailjs.send(this.SERVICE_ID, this.TEMPLATE_ID, {
        user_email: email,
        to_email: "your@email.com", // Your email
      });

      this.showFeedback("Thanks! You're on the list ✓", "success");
      this.form.reset();
    } catch (error) {
      console.error("EmailJS error:", error);
      this.showFeedback("Something went wrong. Please try again.", "error");
    } finally {
      this.setLoadingState(false);
    }
  }

  // ... rest of the methods same as above
}
*/

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new FooterEmailForm();
});

