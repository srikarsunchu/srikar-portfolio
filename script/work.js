import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import slides from "./slides";

document.addEventListener("DOMContentLoaded", () => {
  const totalSlides = slides.length;
  let currentSlide = 1;

  let isAnimating = false;
  let scrollAllowed = false;
  let lastScrollTime = 0;
  let imagesPreloaded = false;

  gsap.set(".slider", {
    opacity: 0,
  });

  gsap.to(".slider", {
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
  });

  function preloadImages() {
    return new Promise((resolve) => {
      let loadedCount = 0;
      const totalImages = slides.length;

      if (totalImages === 0) {
        resolve();
        return;
      }

      slides.forEach((slide) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            imagesPreloaded = true;
            resolve();
          }
        };
        img.src = slide.slideImg;
      });
    });
  }

  function createSlide(slideIndex) {
    const slideData = slides[slideIndex - 1];

    const slide = document.createElement("div");
    slide.className = "slide";

    const slideImg = document.createElement("div");
    slideImg.className = "slide-img";
    const img = document.createElement("img");
    img.src = slideData.slideImg;
    img.alt = "";

    img.style.opacity = "0";

    if (imagesPreloaded) {
      img.style.opacity = "1";
    } else {
      img.onload = () => {
        gsap.to(img, { opacity: 1, duration: 0.3 });
      };
    }

    slideImg.appendChild(img);

    const slideHeader = document.createElement("div");
    slideHeader.className = "slide-header";

    const slideTitle = document.createElement("div");
    slideTitle.className = "slide-title";
    const h2 = document.createElement("h2");
    h2.textContent = slideData.slideTitle;
    slideTitle.appendChild(h2);

    const slideDescription = document.createElement("div");
    slideDescription.className = "slide-description";
    const p = document.createElement("p");
    p.textContent = slideData.slideDescription;
    slideDescription.appendChild(p);

    const slideLink = document.createElement("div");
    slideLink.className = "slide-link";
    const a = document.createElement("a");
    a.href = slideData.slideUrl;
    a.textContent = "View Project";
    slideLink.appendChild(a);

    slideHeader.appendChild(slideTitle);
    slideHeader.appendChild(slideDescription);
    slideHeader.appendChild(slideLink);

    const slideInfo = document.createElement("div");
    slideInfo.className = "slide-info";

    const slideTags = document.createElement("div");
    slideTags.className = "slide-tags";
    const tagsLabel = document.createElement("p");
    tagsLabel.className = "mono";
    tagsLabel.textContent = "Tags";
    slideTags.appendChild(tagsLabel);

    slideData.slideTags.forEach((tag) => {
      const tagP = document.createElement("p");
      tagP.className = "mono";
      tagP.textContent = tag;
      slideTags.appendChild(tagP);
    });

    const slideIndexWrapper = document.createElement("div");
    slideIndexWrapper.className = "slide-index-wrapper";
    const slideIndexCopy = document.createElement("p");
    slideIndexCopy.className = "mono";
    slideIndexCopy.textContent = slideIndex.toString().padStart(2, "0");
    const slideIndexSeparator = document.createElement("p");
    slideIndexSeparator.className = "mono";
    slideIndexSeparator.textContent = "/";
    const slidesTotalCount = document.createElement("p");
    slidesTotalCount.className = "mono";
    slidesTotalCount.textContent = totalSlides.toString().padStart(2, "0");

    slideIndexWrapper.appendChild(slideIndexCopy);
    slideIndexWrapper.appendChild(slideIndexSeparator);
    slideIndexWrapper.appendChild(slidesTotalCount);

    slideInfo.appendChild(slideTags);
    slideInfo.appendChild(slideIndexWrapper);

    slide.appendChild(slideImg);
    slide.appendChild(slideHeader);
    slide.appendChild(slideInfo);

    return slide;
  }

  function splitText(slide) {
    const slideHeader = slide.querySelector(".slide-title h2");
    if (slideHeader) {
      SplitText.create(slideHeader, {
        type: "words",
        wordsClass: "word",
        mask: "words",
      });
    }

    const slideContent = slide.querySelectorAll("p, a");
    slideContent.forEach((element) => {
      SplitText.create(element, {
        type: "lines",
        linesClass: "line",
        mask: "lines",
        reduceWhiteSpace: false,
      });
    });
  }

  function initializeFirstSlide() {
    const slider = document.querySelector(".slider");

    const firstSlide = createSlide(1);
    slider.appendChild(firstSlide);

    splitText(firstSlide);

    const words = firstSlide.querySelectorAll(".word");
    const lines = firstSlide.querySelectorAll(".line");

    gsap.set([...words, ...lines], {
      y: "100%",
      force3D: true,
    });

    const tl = gsap.timeline();

    const headerWords = firstSlide.querySelectorAll(".slide-title .word");
    tl.to(
      headerWords,
      {
        y: "0%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
        force3D: true,
      },
      0.5
    );

    const tagsLines = firstSlide.querySelectorAll(".slide-tags .line");
    const indexLines = firstSlide.querySelectorAll(
      ".slide-index-wrapper .line"
    );
    const descriptionLines = firstSlide.querySelectorAll(
      ".slide-description .line"
    );

    tl.to(
      tagsLines,
      {
        y: "0%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      },
      "-=0.75"
    );

    tl.to(
      indexLines,
      {
        y: "0%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      },
      "<"
    );

    tl.to(
      descriptionLines,
      {
        y: "0%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      },
      "<"
    );

    const linkLines = firstSlide.querySelectorAll(".slide-link .line");
    tl.to(
      linkLines,
      {
        y: "0%",
        duration: 1,
        ease: "power4.out",
      },
      "-=1"
    );

    setTimeout(() => {
      scrollAllowed = true;
      lastScrollTime = Date.now();
    }, 1500);
  }

  function animateSlide(direction) {
    if (isAnimating || !scrollAllowed) return;

    isAnimating = true;
    scrollAllowed = false;

    const slider = document.querySelector(".slider");
    const currentSlideElement = slider.querySelector(".slide");

    if (direction === "down") {
      currentSlide = currentSlide === totalSlides ? 1 : currentSlide + 1;
    } else {
      currentSlide = currentSlide === 1 ? totalSlides : currentSlide - 1;
    }

    const exitY = direction === "down" ? "-200vh" : "200vh";
    const entryY = direction === "down" ? "100vh" : "-100vh";

    gsap.to(currentSlideElement, {
      scale: 0.25,
      opacity: 0,
      rotation: 30,
      y: exitY,
      duration: 2,
      ease: "power4.inOut",
      force3D: true,
      onComplete: () => {
        currentSlideElement.remove();
      },
    });

    setTimeout(() => {
      const newSlide = createSlide(currentSlide);
      const newSlideImg = newSlide.querySelector(".slide-img img");

      gsap.set(newSlide, {
        y: entryY,
        force3D: true,
      });

      gsap.set(newSlideImg, {
        scale: 2,
        force3D: true,
      });

      slider.appendChild(newSlide);

      splitText(newSlide);

      const words = newSlide.querySelectorAll(".word");
      const lines = newSlide.querySelectorAll(".line");

      gsap.set([...words, ...lines], {
        y: "100%",
        force3D: true,
      });

      gsap.to(newSlide, {
        y: 0,
        duration: 1.5,
        ease: "power4.out",
        force3D: true,
        onStart: () => {
          gsap.to(newSlideImg, {
            scale: 1,
            duration: 1.5,
            ease: "power4.out",
            force3D: true,
          });

          const tl = gsap.timeline();

          const headerWords = newSlide.querySelectorAll(".slide-title .word");
          tl.to(
            headerWords,
            {
              y: "0%",
              duration: 1,
              ease: "power4.out",
              stagger: 0.1,
              force3D: true,
            },
            0.75
          );

          const tagsLines = newSlide.querySelectorAll(".slide-tags .line");
          const indexLines = newSlide.querySelectorAll(
            ".slide-index-wrapper .line"
          );
          const descriptionLines = newSlide.querySelectorAll(
            ".slide-description .line"
          );

          tl.to(
            tagsLines,
            {
              y: "0%",
              duration: 1,
              ease: "power4.out",
              stagger: 0.1,
            },
            "-=0.75"
          );

          tl.to(
            indexLines,
            {
              y: "0%",
              duration: 1,
              ease: "power4.out",
              stagger: 0.1,
            },
            "<"
          );

          tl.to(
            descriptionLines,
            {
              y: "0%",
              duration: 1,
              ease: "power4.out",
              stagger: 0.1,
            },
            "<"
          );

          const linkLines = newSlide.querySelectorAll(".slide-link .line");
          tl.to(
            linkLines,
            {
              y: "0%",
              duration: 1,
              ease: "power4.out",
            },
            "-=1"
          );
        },
        onComplete: () => {
          isAnimating = false;
          setTimeout(() => {
            scrollAllowed = true;
            lastScrollTime = Date.now();
          }, 100);
        },
      });
    }, 750);
  }

  function handleScroll(direction) {
    const now = Date.now();

    if (isAnimating || !scrollAllowed) return;
    if (now - lastScrollTime < 1000) return;

    lastScrollTime = now;
    animateSlide(direction);
  }

  async function init() {
    try {
      await preloadImages();
    } catch (error) {
      console.warn("Image preloading failed", error);
    }

    initializeFirstSlide();

    window.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const direction = e.deltaY > 0 ? "down" : "up";
        handleScroll(direction);
      },
      { passive: false }
    );

    let touchStartY = 0;
    let isTouchActive = false;

    window.addEventListener(
      "touchstart",
      (e) => {
        touchStartY = e.touches[0].clientY;
        isTouchActive = true;
      },
      { passive: false }
    );

    window.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        if (!isTouchActive || isAnimating || !scrollAllowed) return;

        const touchCurrentY = e.touches[0].clientY;
        const difference = touchStartY - touchCurrentY;

        if (Math.abs(difference) > 50) {
          isTouchActive = false;
          const direction = difference > 0 ? "down" : "up";
          handleScroll(direction);
        }
      },
      { passive: false }
    );

    window.addEventListener("touchend", () => {
      isTouchActive = false;
    });
  }

  init();
});
