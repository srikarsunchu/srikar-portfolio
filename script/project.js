import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initAnimations } from "./anime";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  initAnimations();

  setTimeout(() => {
    initSnapshotsScroll();
  }, 100);
});

function initSnapshotsScroll() {
  const wrapper = document.querySelector(".project-snapshots-wrapper");
  const snapshotsSection = document.querySelector(".project-snapshots");

  if (!wrapper || !snapshotsSection) return;

  const snapshots = wrapper.querySelectorAll(".project-snapshot");
  const snapshotCount = snapshots.length;

  // Set wrapper width dynamically based on number of snapshots
  wrapper.style.width = `${snapshotCount * 100}vw`;

  const progressBarContainer = document.createElement("div");
  progressBarContainer.className = "snapshots-progress-bar";

  for (let i = 0; i < 30; i++) {
    const indicator = document.createElement("div");
    indicator.className = "progress-indicator";
    progressBarContainer.appendChild(indicator);
  }

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressBarContainer.appendChild(progressBar);

  snapshotsSection.appendChild(progressBarContainer);

  ScrollTrigger.refresh();

  const calculateDimensions = () => {
    const wrapperWidth = wrapper.offsetWidth;
    const viewportWidth = window.innerWidth;
    return -(wrapperWidth - viewportWidth);
  };

  let moveDistance = calculateDimensions();

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  ScrollTrigger.create({
    trigger: ".project-snapshots",
    start: "top top",
    end: () => `+=${window.innerHeight * Math.max(snapshotCount, 2)}px`,
    pin: true,
    pinSpacing: true,
    scrub: isSafari && isIOS ? 0.5 : 1,
    invalidateOnRefresh: true,
    onRefresh: () => {
      moveDistance = calculateDimensions();
    },
    onUpdate: (self) => {
      const progress = self.progress;
      const currentTranslateX = progress * moveDistance;

      gsap.set(wrapper, {
        x: currentTranslateX,
        force3D: true,
        transformOrigin: "left center",
      });

      if (progressBar) {
        gsap.set(progressBar, {
          width: `${progress * 100}%`,
        });
      }
    },
  });

  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      moveDistance = calculateDimensions();
      ScrollTrigger.refresh();
    }, 250);
  };

  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", () => {
    setTimeout(handleResize, 500);
  });

  if (isIOS) {
    const setViewportHeight = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };

    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);
    window.addEventListener("orientationchange", () => {
      setTimeout(setViewportHeight, 500);
    });
  }
}
