import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const menu = document.querySelector(".menu");
const menuToggle = document.querySelector(".menu-toggle");
const menuHeader = document.querySelector(".menu-header");
const menuOverlay = document.querySelector(".menu-overlay");
const menuItems = document.querySelectorAll(".menu-nav li");
const menuFooter = document.querySelector(".menu-footer");
const menuLogo = document.querySelector(".menu-logo img");
const hamburgerMenu = document.querySelector(".menu-hamburger-icon");

let isOpen = false;
let lastScrollY = window.scrollY;
let isMenuVisible = true;
let isAnimating = false;
let splitTexts = [];
let footerSplitTexts = [];

function scrambleText(elements, duration = 0.4) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

  elements.forEach((char, index) => {
    const originalText = char.textContent;
    let iterations = 0;
    const maxIterations = Math.floor(Math.random() * 6) + 3;

    gsap.set(char, { opacity: 1 });

    const scrambleInterval = setInterval(() => {
      char.textContent = chars[Math.floor(Math.random() * chars.length)];
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(scrambleInterval);
        char.textContent = originalText;
      }
    }, 25);

    setTimeout(() => {
      clearInterval(scrambleInterval);
      char.textContent = originalText;
    }, duration * 1000);
  });
}

function initMenu() {
  gsap.set(menuOverlay, {
    scaleY: 0,
    transformOrigin: "top center",
  });

  menuItems.forEach((item) => {
    const link = item.querySelector("a");
    if (link) {
      const split = new SplitText(link, {
        type: "words",
        mask: "words",
      });
      splitTexts.push(split);

      gsap.set(split.words, {
        yPercent: 120,
      });
    }
  });

  const footerElements = document.querySelectorAll(
    ".menu-social a, .menu-social span, .menu-time"
  );
  footerElements.forEach((element) => {
    const split = new SplitText(element, {
      type: "chars",
    });
    footerSplitTexts.push(split);

    gsap.set(split.chars, {
      opacity: 0,
    });

    if (element.classList.contains("menu-time")) {
      gsap.set(element, { opacity: 0 });
    }
  });

  gsap.set(menuItems, {
    opacity: 1,
  });

  gsap.set(menuFooter, {
    opacity: 1,
    y: 20,
  });
}

function toggleMenu() {
  if (isAnimating) return;

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openMenu() {
  isOpen = true;
  isAnimating = true;
  if (hamburgerMenu) {
    hamburgerMenu.classList.add("open");
  }
  if (menuLogo) {
    menuLogo.classList.add("rotated");
  }

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
    },
  });

  tl.to(menuOverlay, {
    duration: 0.5,
    scaleY: 1,
    ease: "power3.out",
  });

  const allWords = splitTexts.reduce((acc, split) => {
    return acc.concat(split.words);
  }, []);

  tl.to(
    allWords,
    {
      duration: 0.75,
      yPercent: 0,
      stagger: 0.05,
      ease: "power4.out",
    },
    "-=0.3"
  );

  tl.to(
    menuFooter,
    {
      duration: 0.3,
      y: 0,
      ease: "power2.out",
      onComplete: () => {
        const timeElement = document.querySelector(".menu-time");
        if (timeElement) {
          gsap.set(timeElement, { opacity: 1 });
        }

        const allFooterChars = footerSplitTexts.reduce((acc, split) => {
          return acc.concat(split.chars);
        }, []);

        allFooterChars.forEach((char, index) => {
          setTimeout(() => {
            scrambleText([char], 0.4);
          }, index * 30);
        });
      },
    },
    "-=1"
  );
}

function closeMenu() {
  isOpen = false;
  isAnimating = true;
  if (hamburgerMenu) {
    hamburgerMenu.classList.remove("open");
  }
  if (menuLogo) {
    menuLogo.classList.remove("rotated");
  }

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
    },
  });

  const allWords = splitTexts.reduce((acc, split) => {
    return acc.concat(split.words);
  }, []);

  tl.to([menuFooter], {
    duration: 0.3,
    y: 20,
    ease: "power2.in",
    onStart: () => {
      const timeElement = document.querySelector(".menu-time");
      if (timeElement) {
        gsap.set(timeElement, { opacity: 0 });
      }

      const allFooterChars = footerSplitTexts.reduce((acc, split) => {
        return acc.concat(split.chars);
      }, []);
      gsap.set(allFooterChars, { opacity: 0 });
    },
  });

  tl.to(
    allWords,
    {
      duration: 0.25,
      yPercent: 120,
      stagger: -0.025,
      ease: "power2.in",
    },
    "-=0.25"
  );

  tl.to(
    menuOverlay,
    {
      duration: 0.5,
      scaleY: 0,
      ease: "power3.inOut",
    },
    "-=0.2"
  );
}

function handleScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    if (isOpen) {
      closeMenu();
    }
    if (isMenuVisible) {
      menu.classList.add("hidden");
      isMenuVisible = false;
    }
  } else if (currentScrollY < lastScrollY) {
    if (!isMenuVisible) {
      menu.classList.remove("hidden");
      isMenuVisible = true;
    }
  }

  lastScrollY = currentScrollY;
}

function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour12: false,
  });
  const timeElement = document.querySelector(".menu-time");
  if (timeElement) {
    if (!isOpen) {
      timeElement.textContent = `${timeString} LOCAL`;
    } else {
      const timeSplit = footerSplitTexts.find(
        (split) => split.element === timeElement
      );

      if (timeSplit && timeSplit.chars) {
        const newText = `${timeString} LOCAL`;
        const oldChars = timeSplit.chars;

        newText.split("").forEach((char, index) => {
          if (oldChars[index]) {
            oldChars[index].textContent = char;
          }
        });
      }
    }
  }
}

function init() {
  initMenu();

  if (menuHeader) {
    menuHeader.addEventListener("click", toggleMenu);
  }

  menuItems.forEach((item) => {
    const link = item.querySelector("a");
    if (link) {
      link.addEventListener("click", () => {
        if (isOpen) {
          closeMenu();
        }
      });
    }
  });

  window.addEventListener("scroll", handleScroll);

  updateTime();
  setInterval(updateTime, 1000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
