import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { initAnimations } from "./anime";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  initAnimations();

  const animeTextParagraphs = document.querySelectorAll(".anime-text p");
  const wordHighlightBgColor = "191, 188, 180";

  const keywords = [
    "addict",
    "Adobe",
    "films",
    "jazz",
    "typography",
    "invisible",
    "honest",
    "intention",
    "craft",
    "espresso",
    "interfaces",
    "obsessing",
  ];

  animeTextParagraphs.forEach((paragraph) => {
    const text = paragraph.textContent;
    const words = text.split(/\s+/);
    paragraph.innerHTML = "";

    words.forEach((word) => {
      if (word.trim()) {
        const wordContainer = document.createElement("div");
        wordContainer.className = "word";

        const wordText = document.createElement("span");
        wordText.textContent = word;

        const normalizedWord = word.toLowerCase().replace(/[.,!?;:"]/g, "");
        if (keywords.includes(normalizedWord)) {
          wordContainer.classList.add("keyword-wrapper");
          wordText.classList.add("keyword", normalizedWord);
        }

        wordContainer.appendChild(wordText);
        paragraph.appendChild(wordContainer);
      }
    });
  });

  const animeTextContainers = document.querySelectorAll(
    ".anime-text-container"
  );

  animeTextContainers.forEach((container) => {
    ScrollTrigger.create({
      trigger: container,
      pin: container,
      start: "top top",
      end: `+=${window.innerHeight * 4}`,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const words = Array.from(
          container.querySelectorAll(".anime-text .word")
        );
        const totalWords = words.length;

        words.forEach((word, index) => {
          const wordText = word.querySelector("span");

          if (progress <= 0.7) {
            const progressTarget = 0.7;
            const revealProgress = Math.min(1, progress / progressTarget);

            const overlapWords = 15;
            const totalAnimationLength = 1 + overlapWords / totalWords;

            const wordStart = index / totalWords;
            const wordEnd = wordStart + overlapWords / totalWords;

            const timelineScale =
              1 /
              Math.min(
                totalAnimationLength,
                1 + (totalWords - 1) / totalWords + overlapWords / totalWords
              );

            const adjustedStart = wordStart * timelineScale;
            const adjustedEnd = wordEnd * timelineScale;
            const duration = adjustedEnd - adjustedStart;

            const wordProgress =
              revealProgress <= adjustedStart
                ? 0
                : revealProgress >= adjustedEnd
                ? 1
                : (revealProgress - adjustedStart) / duration;

            word.style.opacity = wordProgress;

            const backgroundFadeStart =
              wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
            const backgroundOpacity = Math.max(0, 1 - backgroundFadeStart);
            word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${backgroundOpacity})`;

            const textRevealThreshold = 0.9;
            const textRevealProgress =
              wordProgress >= textRevealThreshold
                ? (wordProgress - textRevealThreshold) /
                  (1 - textRevealThreshold)
                : 0;
            wordText.style.opacity = Math.pow(textRevealProgress, 0.5);
          } else {
            const reverseProgress = (progress - 0.7) / 0.3;
            word.style.opacity = 1;
            const targetTextOpacity = 1;

            const reverseOverlapWords = 5;
            const reverseWordStart = index / totalWords;
            const reverseWordEnd =
              reverseWordStart + reverseOverlapWords / totalWords;

            const reverseTimelineScale =
              1 /
              Math.max(
                1,
                (totalWords - 1) / totalWords + reverseOverlapWords / totalWords
              );

            const reverseAdjustedStart =
              reverseWordStart * reverseTimelineScale;
            const reverseAdjustedEnd = reverseWordEnd * reverseTimelineScale;
            const reverseDuration = reverseAdjustedEnd - reverseAdjustedStart;

            const reverseWordProgress =
              reverseProgress <= reverseAdjustedStart
                ? 0
                : reverseProgress >= reverseAdjustedEnd
                ? 1
                : (reverseProgress - reverseAdjustedStart) / reverseDuration;

            if (reverseWordProgress > 0) {
              wordText.style.opacity =
                targetTextOpacity * (1 - reverseWordProgress);
              word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${reverseWordProgress})`;
            } else {
              wordText.style.opacity = targetTextOpacity;
              word.style.backgroundColor = `rgba(${wordHighlightBgColor}, 0)`;
            }
          }
        });
      },
    });
  });

  const animateOnScroll = true;

  const config = {
    gravity: { x: 0, y: 1 },
    restitution: 0.5,
    friction: 0.15,
    frictionAir: 0.02,
    density: 0.002,
    wallThickness: 200,
  };

  let engine,
    runner,
    bodies = [],
    topWall = null;

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function initPhysics(container) {
    engine = Matter.Engine.create();
    engine.gravity = config.gravity;

    engine.constraintIterations = 15;
    engine.positionIterations = 25;
    engine.velocityIterations = 20;

    engine.enableSleeping = true;
    engine.timing.timeScale = 1;

    const containerRect = container.getBoundingClientRect();
    const wallThickness = config.wallThickness;
    const floorOffset = 8;

    const walls = [
      Matter.Bodies.rectangle(
        containerRect.width / 2,
        containerRect.height - floorOffset + wallThickness / 2,
        containerRect.width + wallThickness * 2,
        wallThickness,
        { isStatic: true }
      ),
      Matter.Bodies.rectangle(
        -wallThickness / 2,
        containerRect.height / 2,
        wallThickness,
        containerRect.height + wallThickness * 2,
        { isStatic: true }
      ),
      Matter.Bodies.rectangle(
        containerRect.width + wallThickness / 2,
        containerRect.height / 2,
        wallThickness,
        containerRect.height + wallThickness * 2,
        { isStatic: true }
      ),
    ];
    Matter.World.add(engine.world, walls);

    const objects = container.querySelectorAll(".object");
    objects.forEach((obj, index) => {
      const objRect = obj.getBoundingClientRect();

      const startX =
        Math.random() * (containerRect.width - objRect.width) +
        objRect.width / 2;
      const startY = -500 - index * 200;
      const startRotation = (Math.random() - 0.5) * Math.PI;

      const body = Matter.Bodies.rectangle(
        startX,
        startY,
        objRect.width,
        objRect.height,
        {
          restitution: config.restitution,
          friction: config.friction,
          frictionAir: config.frictionAir,
          density: config.density,
          chamfer: { radius: 10 },
          slop: 0.02,
        }
      );

      Matter.Body.setAngle(body, startRotation);

      bodies.push({
        body: body,
        element: obj,
        width: objRect.width,
        height: objRect.height,
      });

      Matter.World.add(engine.world, body);
    });

    Matter.Events.on(engine, "beforeUpdate", function () {
      bodies.forEach(({ body }) => {
        const maxVelocity = 250;

        if (Math.abs(body.velocity.x) > maxVelocity) {
          Matter.Body.setVelocity(body, {
            x: body.velocity.x > 0 ? maxVelocity : -maxVelocity,
            y: body.velocity.y,
          });
        }
        if (Math.abs(body.velocity.y) > maxVelocity) {
          Matter.Body.setVelocity(body, {
            x: body.velocity.x,
            y: body.velocity.y > 0 ? maxVelocity : -maxVelocity,
          });
        }
      });
    });

    setTimeout(() => {
      topWall = Matter.Bodies.rectangle(
        containerRect.width / 2,
        -wallThickness / 2,
        containerRect.width + wallThickness * 2,
        wallThickness,
        { isStatic: true }
      );
      Matter.World.add(engine.world, topWall);
    }, 3000);

    setInterval(() => {
      if (bodies.length > 0 && Math.random() < 0.3) {
        const randomBody = bodies[Math.floor(Math.random() * bodies.length)];
        const randomForce = {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.01,
        };
        Matter.Body.applyForce(
          randomBody.body,
          randomBody.body.position,
          randomForce
        );
      }
    }, 2000);

    runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    function updatePositions() {
      bodies.forEach(({ body, element, width, height }) => {
        const x = clamp(
          body.position.x - width / 2,
          0,
          containerRect.width - width
        );
        const y = clamp(
          body.position.y - height / 2,
          -height * 3,
          containerRect.height - height - floorOffset
        );

        element.style.left = x + "px";
        element.style.top = y + "px";
        element.style.transform = `rotate(${body.angle}rad)`;
      });

      requestAnimationFrame(updatePositions);
    }
    updatePositions();
  }

  if (animateOnScroll) {
    document.querySelectorAll("section").forEach((section) => {
      if (section.querySelector(".object-container")) {
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          once: true,
          onEnter: () => {
            const container = section.querySelector(".object-container");
            if (container && !engine) {
              initPhysics(container);
            }
          },
        });
      }
    });
  } else {
    window.addEventListener("load", () => {
      const container = document.querySelector(".object-container");
      if (container) {
        initPhysics(container);
      }
    });
  }

  // Skills section pin
  ScrollTrigger.create({
    trigger: ".about-skills",
    start: "top top",
    end: `+=${window.innerHeight * 3}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
  });

  // Film gallery video interactions
  const filmCards = document.querySelectorAll(".film-card-video");

  filmCards.forEach((filmCard) => {
    const video = filmCard.querySelector("video");

    // Ensure autoplay works on load
    video.play().catch(() => {
      // If autoplay fails (some browsers block it), show the play button
      filmCard.classList.remove("playing");
    });

    filmCard.addEventListener("click", () => {
      if (video.paused) {
        // Play this video
        video.play();
        filmCard.classList.add("playing");
      } else {
        // Pause this video
        video.pause();
        filmCard.classList.remove("playing");
      }
    });

    // Handle play/pause events
    video.addEventListener("play", () => {
      filmCard.classList.add("playing");
    });

    video.addEventListener("pause", () => {
      filmCard.classList.remove("playing");
    });
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
    scrub: 1,
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
    scrub: 1,
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
