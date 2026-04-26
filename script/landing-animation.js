import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(SplitText, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");
CustomEase.create("glide", "0.8, 0, 0.2, 1");

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

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    intro.remove();
    announceComplete();
    return;
  }

  const anchorH1 = intro.querySelector(".landing-intro-anchor h1");
  const panelParagraphs = intro.querySelectorAll(".landing-intro-panel p");

  panelParagraphs.forEach((element) => {
    new SplitText(element, {
      type: "lines",
      linesClass: "line",
      mask: "lines",
    });
  });

  const anchorSplit = anchorH1
    ? new SplitText(anchorH1, {
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
      announceComplete();
    },
  });

  tl.to(".landing-intro-panel-row p .line", {
    y: "0%",
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.06,
  });

  if (anchorSplit) {
    tl.to(
      anchorSplit.words,
      {
        yPercent: 0,
        duration: 1.1,
        ease: "glide",
        stagger: 0.08,
      },
      "-=0.45",
    );
  }

  tl.to({}, { duration: 0.55 });

  tl.to(
    ".landing-intro-panel",
    {
      clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      duration: 1.4,
      ease: "hop",
    },
    ">",
  )
    .to(
      ".landing-intro-backdrop",
      {
        clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        duration: 1.4,
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
