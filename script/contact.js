import gsap from "gsap";
import { initAnimations } from "./anime.js";
import ContactGridAnimation from "./contact-animation.js";

function fadeInAnimation(element, delay = 0) {
  gsap.set(element, {
    opacity: 0,
    scale: 0.95,
  });

  const tl = gsap.timeline({ delay: delay });

  tl.to(element, {
    duration: 1,
    opacity: 1,
    scale: 1,
    ease: "power2.out",
  });

  return tl;
}

document.addEventListener("DOMContentLoaded", () => {
  initAnimations();

  const contactAnimationContainer = document.querySelector("#contact-animation");
  if (contactAnimationContainer) {
    // Initialize the generative grid animation
    const animation = new ContactGridAnimation(contactAnimationContainer);
    
    // Fade in the animation container
    fadeInAnimation(contactAnimationContainer, 0.5);
  }
});
