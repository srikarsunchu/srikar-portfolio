import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(SplitText, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");
CustomEase.create("glide", "0.8, 0, 0.2, 1");

const SEEN_STORAGE_KEY = "srikar:landing-intro-seen-v2";

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

function buildDigitRoller(el) {
  const target = (el.dataset.counterTarget || el.textContent || "").trim();
  el.textContent = "";
  const tracks = [];
  // Each digit track holds 0-9 twice so every digit visibly cycles once
  // before landing on its target — even if the target is 0.
  const cyclesBeforeLanding = 1;
  for (const ch of target) {
    const slot = document.createElement("span");
    slot.className = "intro-counter-slot";
    const track = document.createElement("span");
    track.className = "intro-counter-track";
    const isDigit = /\d/.test(ch);
    if (isDigit) {
      for (let cycle = 0; cycle <= cyclesBeforeLanding; cycle++) {
        for (let i = 0; i < 10; i++) {
          const cell = document.createElement("span");
          cell.className = "intro-counter-cell";
          cell.textContent = String(i);
          track.appendChild(cell);
        }
      }
    } else {
      const cell = document.createElement("span");
      cell.className = "intro-counter-cell";
      cell.textContent = ch;
      track.appendChild(cell);
    }
    slot.appendChild(track);
    el.appendChild(slot);
    if (isDigit)
      tracks.push({
        el: track,
        target: parseInt(ch, 10) + 10 * cyclesBeforeLanding,
      });
  }
  return tracks;
}

function formatPacificTime(date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(date);
    const get = (t) => parts.find((p) => p.type === t)?.value ?? "00";
    return `${get("hour")}:${get("minute")}:${get("second")}`;
  } catch {
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
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
  const panelParagraphs = intro.querySelectorAll(
    ".landing-intro-panel p:not(.intro-clock-row)",
  );
  const backdropParagraphs = intro.querySelectorAll(
    ".landing-intro-backdrop p",
  );

  const clockEl = intro.querySelector("[data-intro-clock]");
  let clockInterval = null;
  if (clockEl) {
    const tick = () => {
      clockEl.textContent = `Local ${formatPacificTime()}`;
    };
    tick();
    clockInterval = setInterval(tick, 100);
  }

  const counterRollEl = intro.querySelector(".intro-counter-roll");
  const counterTracks = counterRollEl ? buildDigitRoller(counterRollEl) : [];

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
        type: "words, chars",
        wordsClass: "word",
        charsClass: "char",
      })
    : null;

  if (anchorSplit) {
    gsap.set(anchorTitle, { opacity: 1 });
    // Drive the variable font's wght axis via a CSS custom property the
    // .char selector consumes inside font-variation-settings. Animating a
    // variable axis reuses one in-memory font instance (no file swap, no
    // glyph rasterization), which is what fixes the Chrome stutter.
    gsap.set(anchorSplit.chars, { opacity: 0, "--anchor-wght": 30 });
  }

  if (clockEl) {
    gsap.set(clockEl, { y: 18, opacity: 0 });
  }

  const tl = gsap.timeline({
    delay: 0.25,
    onComplete: () => {
      if (clockInterval) clearInterval(clockInterval);
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

  if (counterTracks.length) {
    tl.fromTo(
      counterTracks.map((t) => t.el),
      { y: 0 },
      {
        y: (i) => `-${counterTracks[i].target}em`,
        duration: 0.85,
        ease: "expo.out",
        stagger: { each: 0.05, from: "start" },
      },
      "<+0.15",
    );
  }

  if (clockEl) {
    tl.to(
      clockEl,
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: "power3.out",
      },
      "<+0.1",
    );
  }

  if (anchorSplit) {
    tl.to(
      anchorSplit.chars,
      {
        opacity: 1,
        "--anchor-wght": 188,
        duration: 0.85,
        ease: "glide",
        stagger: { each: 0.04, from: "start" },
      },
      "-=0.5",
    );
  }

  tl.to({}, { duration: 0.2 });

  // Shutter wipe: bands retract in alternating directions (L, R, L, R) with stagger.
  // Reads as deliberate engineered geometry, not a single rehearsed sweep.
  const collapseLeft = "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)";
  const collapseRight = "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)";

  tl.to(
    ".landing-intro-panel-band",
    {
      clipPath: (i) => (i % 2 === 0 ? collapseLeft : collapseRight),
      duration: 0.95,
      ease: "hop",
      stagger: { each: 0.12, from: "start" },
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
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        duration: 1.05,
        ease: "hop",
      },
      "<+0.18",
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
