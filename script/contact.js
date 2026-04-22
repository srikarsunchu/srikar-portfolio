import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initAnimations } from "./anime.js";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  initAnimations();

  const services = document.querySelectorAll(".contact-service");
  services.forEach((service) => {
    gsap.fromTo(
      service,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: service,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  const methods = document.querySelectorAll(".contact-method");
  if (methods.length) {
    gsap.fromTo(
      methods,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".contact-methods",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }


});
