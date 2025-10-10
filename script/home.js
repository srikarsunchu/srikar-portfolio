import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { initAnimations } from "./anime";

document.addEventListener("DOMContentLoaded", () => {
  initAnimations();

  gsap.registerPlugin(ScrollTrigger, SplitText);

  gsap.set(".hero .hero-cards .card", { transformOrigin: "center center" });

  gsap.to(".hero .hero-cards .card", {
    scale: 1,
    duration: 0.75,
    delay: 0.25,
    stagger: 0.1,
    ease: "power4.out",
    onComplete: () => {
      gsap.set("#hero-card-1", { transformOrigin: "top right" });
      gsap.set("#hero-card-3", { transformOrigin: "top left" });
    },
  });

  const smoothStep = (p) => p * p * (3 - 2 * p);

  if (window.innerWidth > 1000) {
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "75% top",
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;

        const heroCardsContainerOpacity = gsap.utils.interpolate(
          1,
          0.5,
          smoothStep(progress)
        );
        gsap.set(".hero-cards", {
          opacity: heroCardsContainerOpacity,
        });

        ["#hero-card-1", "#hero-card-2", "#hero-card-3"].forEach(
          (cardId, index) => {
            const delay = index * 0.9;
            const cardProgress = gsap.utils.clamp(
              0,
              1,
              (progress - delay * 0.1) / (1 - delay * 0.1)
            );

            const y = gsap.utils.interpolate(
              "0%",
              "400%",
              smoothStep(cardProgress)
            );
            const scale = gsap.utils.interpolate(
              1,
              0.75,
              smoothStep(cardProgress)
            );

            let x = "0%";
            let rotation = 0;
            if (index === 0) {
              x = gsap.utils.interpolate("0%", "90%", smoothStep(cardProgress));
              rotation = gsap.utils.interpolate(
                0,
                -15,
                smoothStep(cardProgress)
              );
            } else if (index === 2) {
              x = gsap.utils.interpolate(
                "0%",
                "-90%",
                smoothStep(cardProgress)
              );
              rotation = gsap.utils.interpolate(
                0,
                15,
                smoothStep(cardProgress)
              );
            }

            gsap.set(cardId, {
              y: y,
              x: x,
              rotation: rotation,
              scale: scale,
            });
          }
        );
      },
    });

    ScrollTrigger.create({
      trigger: ".home-services",
      start: "top top",
      end: `+=${window.innerHeight * 4}px`,
      pin: ".home-services",
      pinSpacing: true,
    });

    ScrollTrigger.create({
      trigger: ".home-services",
      start: "top bottom",
      end: `+=${window.innerHeight * 4}`,
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;

        const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
        const headerY = gsap.utils.interpolate(
          "300%",
          "0%",
          smoothStep(headerProgress)
        );
        gsap.set(".home-services-header", {
          y: headerY,
        });

        ["#card-1", "#card-2", "#card-3"].forEach((cardId, index) => {
          const delay = index * 0.5;
          const cardProgress = gsap.utils.clamp(
            0,
            1,
            (progress - delay * 0.1) / (0.9 - delay * 0.1)
          );

          const innerCard = document.querySelector(
            `${cardId} .flip-card-inner`
          );

          let y;
          if (cardProgress < 0.4) {
            const normalizedProgress = cardProgress / 0.4;
            y = gsap.utils.interpolate(
              "-100%",
              "50%",
              smoothStep(normalizedProgress)
            );
          } else if (cardProgress < 0.6) {
            const normalizedProgress = (cardProgress - 0.4) / 0.2;
            y = gsap.utils.interpolate(
              "50%",
              "0%",
              smoothStep(normalizedProgress)
            );
          } else {
            y = "0%";
          }

          let scale;
          if (cardProgress < 0.4) {
            const normalizedProgress = cardProgress / 0.4;
            scale = gsap.utils.interpolate(
              0.25,
              0.75,
              smoothStep(normalizedProgress)
            );
          } else if (cardProgress < 0.6) {
            const normalizedProgress = (cardProgress - 0.4) / 0.2;
            scale = gsap.utils.interpolate(
              0.75,
              1,
              smoothStep(normalizedProgress)
            );
          } else {
            scale = 1;
          }

          let opacity;
          if (cardProgress < 0.2) {
            const normalizedProgress = cardProgress / 0.2;
            opacity = smoothStep(normalizedProgress);
          } else {
            opacity = 1;
          }

          let x, rotate, rotationY;
          if (cardProgress < 0.6) {
            x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
            rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
            rotationY = 0;
          } else if (cardProgress < 1) {
            const normalizedProgress = (cardProgress - 0.6) / 0.4;
            x = gsap.utils.interpolate(
              index === 0 ? "100%" : index === 1 ? "0%" : "-100%",
              "0%",
              smoothStep(normalizedProgress)
            );
            rotate = gsap.utils.interpolate(
              index === 0 ? -5 : index === 1 ? 0 : 5,
              0,
              smoothStep(normalizedProgress)
            );
            rotationY = smoothStep(normalizedProgress) * 180;
          } else {
            x = "0%";
            rotate = 0;
            rotationY = 180;
          }

          gsap.set(cardId, {
            opacity: opacity,
            y: y,
            x: x,
            rotate: rotate,
            scale: scale,
          });

          gsap.set(innerCard, {
            rotationY: rotationY,
          });
        });
      },
    });
  }

  // Featured Work Title Animation
  const featuredTitle = document.querySelector(".featured-work-title-animate");
  
  if (featuredTitle) {
    gsap.to(featuredTitle, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: featuredTitle,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  }

  // Featured Work Animations
  const projectCards = document.querySelectorAll(".featured-project-card");

  projectCards.forEach((card, index) => {
    const wrapper = card.querySelector(".featured-project-link-wrapper");
    const image = card.querySelector(".featured-project-image");
    const content = card.querySelector(".featured-project-content");

    // Main entrance animation
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // Modal Functions
  const modal = document.getElementById("contact-modal");
  const footerContactBtn = document.getElementById("footer-contact-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const modalOverlay = document.getElementById("modal-overlay");
  const contactForm = document.getElementById("contact-form");
  const submitButton = document.getElementById("submit-button");
  const formFeedback = document.getElementById("form-feedback");

  // Open modal from footer button
  if (footerContactBtn) {
    footerContactBtn.addEventListener("click", () => {
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  }

  // Close modal function
  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    clearErrors();
    if (contactForm) contactForm.reset();
  }

  // Red dot - Close
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  // Click outside to close
  if (modalOverlay) {
    modalOverlay.addEventListener("click", closeModal);
  }

  // ESC key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Form Handling
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Clear previous errors
      clearErrors();

      // Get form data
      const formData = new FormData(contactForm);
      const name = formData.get("name").trim();
      const email = formData.get("email").trim();
      const projectType = formData.get("project_type");
      const message = formData.get("message").trim();

      // Validate
      let isValid = true;

      if (!name) {
        showError("name-error", "Name is required");
        isValid = false;
      }

      if (!email) {
        showError("email-error", "Email is required");
        isValid = false;
      } else if (!isValidEmail(email)) {
        showError("email-error", "Please enter a valid email");
        isValid = false;
      }

      if (!projectType) {
        showError("project-type-error", "Please select a project type");
        isValid = false;
      }

      if (!message) {
        showError("message-error", "Please tell us about your project");
        isValid = false;
      }

      if (!isValid) return;

      // Show loading state
      submitButton.disabled = true;
      submitButton.classList.add("loading");

      try {
        // Submit to Formspree
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success
          showFeedback("success", "Thanks! I'll get back to you within 24 hours.");
          contactForm.reset();
          
          // Auto-close after 3 seconds
          setTimeout(() => {
            closeModal();
          }, 3000);
        } else {
          // Error
          showFeedback("error", "Oops! Something went wrong. Please try again.");
        }
      } catch (error) {
        showFeedback("error", "Connection error. Please check your internet and try again.");
      } finally {
        // Reset button
        submitButton.disabled = false;
        submitButton.classList.remove("loading");
      }
    });
  }

  function clearErrors() {
    const errorElements = document.querySelectorAll(".form-error");
    const inputElements = document.querySelectorAll(".form-group input, .form-group select, .form-group textarea");
    
    errorElements.forEach(el => {
      el.classList.remove("visible");
      el.textContent = "";
    });
    
    inputElements.forEach(el => {
      el.classList.remove("error");
    });

    if (formFeedback) {
      formFeedback.classList.remove("visible", "success", "error");
    }
  }

  function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    const inputId = errorId.replace("-error", "");
    const inputElement = document.getElementById(inputId);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add("visible");
    }

    if (inputElement) {
      inputElement.classList.add("error");
    }
  }

  function showFeedback(type, message) {
    if (formFeedback) {
      formFeedback.textContent = message;
      formFeedback.classList.add("visible", type);
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const outroHeader = document.querySelector(".outro h3");
  let outroSplit = null;

  if (outroHeader) {
    outroSplit = SplitText.create(outroHeader, {
      type: "words",
      wordsClass: "outro-word",
    });

    gsap.set(outroSplit.words, { opacity: 0 });
  }

  const outroStrips = document.querySelectorAll(".outro-strip");
  const stripSpeeds = [0.3, 0.4, 0.25, 0.35, 0.2, 0.25];

  ScrollTrigger.create({
    trigger: ".outro",
    start: "top top",
    end: `+=${window.innerHeight * 3}px`,
    pin: true,
    pinSpacing: true,
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;

      if (outroSplit && outroSplit.words.length > 0) {
        if (progress >= 0.25 && progress <= 0.75) {
          const textProgress = (progress - 0.25) / 0.5;
          const totalWords = outroSplit.words.length;

          outroSplit.words.forEach((word, index) => {
            const wordRevealProgress = index / totalWords;

            if (textProgress >= wordRevealProgress) {
              gsap.set(word, { opacity: 1 });
            } else {
              gsap.set(word, { opacity: 0 });
            }
          });
        } else if (progress < 0.25) {
          gsap.set(outroSplit.words, { opacity: 0 });
        } else if (progress > 0.75) {
          gsap.set(outroSplit.words, { opacity: 1 });
        }
      }
    },
  });

  ScrollTrigger.create({
    trigger: ".outro",
    start: "top bottom",
    end: `+=${window.innerHeight * 6}px`,
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;

      outroStrips.forEach((strip, index) => {
        if (stripSpeeds[index] !== undefined) {
          const speed = stripSpeeds[index];
          const movement = progress * 100 * speed;

          gsap.set(strip, {
            x: `${movement}%`,
          });
        }
      });
    },
  });
});
