import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { initAnimations } from "./anime";
import { createRampenSau } from "./rampensau";
import { createTypographySpecimen } from "./typography-specimen";
import { createSwissGrid } from "./swiss-grid";
import { createGeometricShapes } from "./geometric-shapes";
import { createColorBlock } from "./color-block";
import { createLinePattern } from "./line-pattern";

document.addEventListener("DOMContentLoaded", () => {
  initAnimations();

  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Initialize Bauhaus geometric components
  createRampenSau("#rampensau-1", { size: 200, autoRotate: true, rotateInterval: 5000 });
  createTypographySpecimen("#typography-1", { size: 200, letter: 'S' });
  createSwissGrid("#swiss-grid-1", { size: 200, gridSize: 4 });
  createGeometricShapes("#geometric-shapes-1", { size: 200 });
  createRampenSau("#rampensau-2", { size: 200, autoRotate: true, rotateInterval: 6000 });
  createColorBlock("#color-block-1", { size: 200, autoRotate: true, rotateInterval: 3500 });
  createLinePattern("#line-pattern-1", { size: 200, lineCount: 8, orientation: 'vertical' });
  createRampenSau("#rampensau-3", { size: 200, autoRotate: true, rotateInterval: 4500 });
  createRampenSau("#rampensau-4", { size: 200, autoRotate: true, rotateInterval: 5500 });

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

  const spotlightImages = document.querySelector(".home-spotlight-images");
  const containerHeight = spotlightImages.offsetHeight;
  const viewportHeight = window.innerHeight;

  const initialOffset = containerHeight * 0.05;
  const totalMovement = containerHeight + initialOffset + viewportHeight;

  const spotlightHeader = document.querySelector(".spotlight-mask-header h3");
  let headerSplit = null;

  if (spotlightHeader) {
    headerSplit = SplitText.create(spotlightHeader, {
      type: "words",
      wordsClass: "spotlight-word",
    });

    gsap.set(headerSplit.words, { opacity: 0 });
  }

  ScrollTrigger.create({
    trigger: ".home-spotlight",
    start: "top top",
    end: `+=${window.innerHeight * 7}px`,
    pin: true,
    pinSpacing: true,
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;

      if (progress <= 0.5) {
        const animationProgress = progress / 0.5;

        const startY = 5;
        const endY = -(totalMovement / containerHeight) * 100;

        const currentY = startY + (endY - startY) * animationProgress;

        gsap.set(spotlightImages, {
          y: `${currentY}%`,
        });
      }

      const maskContainer = document.querySelector(
        ".spotlight-mask-image-container"
      );
      const maskImage = document.querySelector(".spotlight-mask-image");

      if (maskContainer && maskImage) {
        if (progress >= 0.25 && progress <= 0.75) {
          const maskProgress = (progress - 0.25) / 0.5;
          const maskSize = `${maskProgress * 475}%`;

          const imageScale = 1.25 - maskProgress * 0.25;

          maskContainer.style.setProperty("-webkit-mask-size", maskSize);
          maskContainer.style.setProperty("mask-size", maskSize);

          gsap.set(maskImage, {
            scale: imageScale,
          });
        } else if (progress < 0.25) {
          maskContainer.style.setProperty("-webkit-mask-size", "0%");
          maskContainer.style.setProperty("mask-size", "0%");

          gsap.set(maskImage, {
            scale: 1.25,
          });
        } else if (progress > 0.75) {
          maskContainer.style.setProperty("-webkit-mask-size", "475%");
          maskContainer.style.setProperty("mask-size", "475%");

          gsap.set(maskImage, {
            scale: 1,
          });
        }
      }

      if (headerSplit && headerSplit.words.length > 0) {
        if (progress >= 0.75 && progress <= 0.95) {
          const textProgress = (progress - 0.75) / 0.2;
          const totalWords = headerSplit.words.length;

          headerSplit.words.forEach((word, index) => {
            const wordRevealProgress = index / totalWords;

            if (textProgress >= wordRevealProgress) {
              gsap.set(word, { opacity: 1 });
            } else {
              gsap.set(word, { opacity: 0 });
            }
          });
        } else if (progress < 0.75) {
          gsap.set(headerSplit.words, { opacity: 0 });
        } else if (progress > 0.95) {
          gsap.set(headerSplit.words, { opacity: 1 });
        }
      }
    },
  });

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
