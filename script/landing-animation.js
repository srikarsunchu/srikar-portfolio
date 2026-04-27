import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(SplitText, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");
CustomEase.create("glide", "0.8, 0, 0.2, 1");

const SEEN_STORAGE_KEY = "srikar:landing-intro-seen";

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(SEEN_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(SEEN_STORAGE_KEY, "1");
  } catch {
    // sessionStorage unavailable (private mode, sandboxed iframe) — silently no-op
  }
}

function lockScroll() {
  try {
    window.__lenis?.stop();
  } catch {
    // lenis may not be initialized yet — fall back to native overflow lock
  }
  document.documentElement.style.overflow = "hidden";
}

function unlockScroll() {
  document.documentElement.style.overflow = "";
  try {
    window.__lenis?.start();
  } catch {
    // ignore
  }
}

function announceComplete() {
  window.__landingIntroComplete = true;
  window.dispatchEvent(new CustomEvent("landingAnimationComplete"));
}

document.addEventListener("DOMContentLoaded", () => {
  const intro = document.querySelector("[data-landing-intro]");
  if (!intro) {
    announceComplete();
    return;
  }

  if (hasSeenIntro()) {
    intro.remove();
    announceComplete();
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    intro.remove();
    markIntroSeen();
    announceComplete();
    return;
  }

  lockScroll();

  const anchorTitle = intro.querySelector(
    ".landing-intro-anchor .landing-intro-title",
  );
  const panelParagraphs = intro.querySelectorAll(".landing-intro-panel p");
  const backdropParagraphs = intro.querySelectorAll(
    ".landing-intro-backdrop p",
  );

  panelParagraphs.forEach((element) => {
    new SplitText(element, {
      type: "lines",
      linesClass: "line",
      mask: "lines",
    });
  });

  backdropParagraphs.forEach((element) => {
    new SplitText(element, {
      type: "lines",
      linesClass: "line",
      mask: "lines",
    });
  });

  const anchorSplit = anchorTitle
    ? new SplitText(anchorTitle, {
        type: "words",
        wordsClass: "word",
        mask: "words",
      })
    : null;

  if (anchorSplit) {
    gsap.set(anchorSplit.words, { yPercent: 110 });
  }

  const tl = gsap.timeline({
    delay: 0.25,
    onComplete: () => {
      intro.remove();
      markIntroSeen();
      unlockScroll();
      announceComplete();
    },
  });

  tl.to(".landing-intro-panel-row p .line", {
    y: "0%",
    duration: 0.65,
    ease: "power3.out",
    stagger: 0.06,
  });

  if (anchorSplit) {
    tl.to(
      anchorSplit.words,
      {
        yPercent: 0,
        duration: 0.9,
        ease: "glide",
        stagger: 0.08,
      },
      "-=0.45",
    );
  }

  tl.to({}, { duration: 0.2 });

  tl.to(
    ".landing-intro-panel",
    {
      clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      duration: 1.05,
      ease: "hop",
    },
    ">",
  )
    .to(
      ".landing-intro-backdrop p .line",
      {
        y: "0%",
        duration: 0.7,
        ease: "power3.out",
        stagger: { each: 0.012 },
      },
      "<",
    )
    .to(
      ".landing-intro-backdrop",
      {
        clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        duration: 1.05,
        ease: "hop",
      },
      "<+0.12",
    )
    .to(
      ".landing-intro-anchor",
      {
        opacity: 0,
        duration: 0.55,
        ease: "power2.in",
      },
      "<+0.1",
    );
});
