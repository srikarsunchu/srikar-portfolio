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

  // Bookshelf generation and animation
  function generateBookshelf(books) {
    const booksWrapper = document.getElementById("books-wrapper");
    const descriptionsContainer = document.getElementById("book-descriptions");
    const overlayText = document.querySelector(".book-title-text");
    
    let activeBookIndex = null;
    let activeTimeline = null;
    const bookTimelines = [];

    // Clear existing content
    booksWrapper.innerHTML = "";
    descriptionsContainer.innerHTML = "";

    // Generate books
    books.forEach((book, index) => {
      // Create book HTML
      const bookHTML = `
        <div class="books__item">
          <div class="books__container">
            <div class="books__cover">
              <div class="books__back-cover"></div>
              <div class="books__inside">
                <div class="books__page"></div>
                <div class="books__page"></div>
                <div class="books__page"></div>
              </div>
              <div class="books__image">
                <img src="${book.coverUrl}" alt="${book.title}" />
                <div class="books__effect"></div>
                <div class="books__light"></div>
              </div>
              <div class="books__hitbox" data-book-index="${index}" data-book-title="${book.title}"></div>
            </div>
          </div>
        </div>
      `;

      // Create description HTML
      const descHTML = `
        <div class="book-description ${book.defaultOpen ? 'active' : ''}" data-book-index="${index}">
          <h3>${book.title}</h3>
          <div class="author">by ${book.author}</div>
          <p>${book.description}</p>
        </div>
      `;

      booksWrapper.innerHTML += bookHTML;
      descriptionsContainer.innerHTML += descHTML;
    });

    // Initialize animations after a brief delay
    setTimeout(() => {
      const bookItems = document.querySelectorAll(".books__item");
      const descriptions = document.querySelectorAll(".book-description");
      const bookShadows = document.querySelectorAll(".book-shadow__item");

      bookItems.forEach((book, index) => {
        const hitbox = book.querySelector(".books__hitbox");
        const bookImage = book.querySelector(".books__image");
        const bookEffect = book.querySelector(".books__effect");
        const pages = book.querySelectorAll(".books__page");
        const bookLight = book.querySelector(".books__light");
        const bookTitle = hitbox.getAttribute("data-book-title");
        const bookShadow = bookShadows[index];

        // Set initial states
        gsap.set(bookImage, {
          boxShadow: "rgba(0, 0, 0, 0.2) 10px -5px 20px, rgba(0, 0, 0, 0.15) 20px 0px 30px"
        });

        gsap.set(bookLight, {
          opacity: 0.1
        });

        gsap.set(pages, {
          x: 0
        });

        // Create hover timeline
        const hoverIn = gsap.timeline({
          paused: true,
          defaults: {
            duration: 0.7,
            ease: "power2.out"
          }
        });

        hoverIn.to(bookImage, {
          translateX: -10,
          scaleX: 0.96,
          boxShadow: "rgba(0, 0, 0, 0.35) 20px 5px 20px, rgba(0, 0, 0, 0.2) 30px 0px 30px"
        }, 0);

        hoverIn.to(bookShadow, {
          width: 130,
          opacity: 0.8
        }, 0);

        hoverIn.to(bookEffect, {
          marginLeft: 10
        }, 0);

        hoverIn.to(bookLight, {
          opacity: 0.2
        }, 0);

        if (pages.length) {
          hoverIn.to(pages[0], {
            x: "2px",
            ease: "power1.inOut"
          }, 0);

          hoverIn.to(pages[1], {
            x: "0px",
            ease: "power1.inOut"
          }, 0);

          hoverIn.to(pages[2], {
            x: "-2px",
            ease: "power1.inOut"
          }, 0);
        }

        bookTimelines[index] = hoverIn;

        // Hover events
        hitbox.addEventListener("mouseenter", () => {
          if (activeBookIndex !== null && activeBookIndex !== index && activeTimeline) {
            activeTimeline.reverse();
          }

          activeBookIndex = index;
          activeTimeline = hoverIn;
          hoverIn.play();

          overlayText.textContent = bookTitle;
          updateDescription(index);
        });
      });

      // Set default open book
      const defaultIndex = books.findIndex(b => b.defaultOpen);
      if (defaultIndex !== -1) {
        activeBookIndex = defaultIndex;
        activeTimeline = bookTimelines[defaultIndex];
        bookTimelines[defaultIndex].play();
        overlayText.textContent = books[defaultIndex].title;
      }

      // Handle mouse leaving bookshelf
      document.querySelector(".bookshelf-container").addEventListener("mouseleave", () => {
        if (defaultIndex !== -1 && activeBookIndex !== defaultIndex && activeTimeline) {
          activeTimeline.reverse();
        }

        activeBookIndex = defaultIndex;
        if (defaultIndex !== -1) {
          activeTimeline = bookTimelines[defaultIndex];
          bookTimelines[defaultIndex].play();
          overlayText.textContent = books[defaultIndex].title;
          updateDescription(defaultIndex);
        }
      });

      // Initialize SplitType for descriptions
      descriptions.forEach((desc) => {
        const titleElement = desc.querySelector("h3");
        const authorElement = desc.querySelector(".author");
        const textElement = desc.querySelector("p");

        if (window.SplitType) {
          try {
            new SplitType(titleElement, {
              types: "lines",
              lineClass: "line"
            });

            new SplitType(authorElement, {
              types: "lines",
              lineClass: "line"
            });

            new SplitType(textElement, {
              types: "lines",
              lineClass: "line"
            });

            desc.querySelectorAll(".line").forEach((line) => {
              const content = line.innerHTML;
              line.innerHTML = `<span class="line-inner">${content}</span>`;
            });
          } catch (e) {
            console.error("Error with SplitType:", e);
          }
        }

        const bookIndex = parseInt(desc.getAttribute("data-book-index"));
        if (books[bookIndex] && !books[bookIndex].defaultOpen) {
          gsap.set(desc.querySelectorAll(".line-inner"), {
            yPercent: 100,
            opacity: 0
          });
        } else {
          gsap.set(desc.querySelectorAll(".line-inner"), {
            yPercent: 0,
            opacity: 1
          });
        }
      });

      // Description update function
      function updateDescription(bookIndex) {
        descriptions.forEach((desc) => {
          const descIndex = parseInt(desc.getAttribute("data-book-index"));

          if (descIndex !== bookIndex && desc.classList.contains("active")) {
            desc.classList.remove("active");
            gsap.to(desc.querySelectorAll(".line-inner"), {
              yPercent: 100,
              opacity: 0,
              duration: 0.4,
              ease: "power1.in",
              stagger: 0.03
            });
          }
        });

        const activeDescription = descriptions[bookIndex];
        if (activeDescription) {
          activeDescription.classList.add("active");
          gsap.fromTo(
            activeDescription.querySelectorAll(".line-inner"),
            { yPercent: 100, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: "power1.out"
            }
          );
        }
      }

      // Initialize default description
      if (defaultIndex !== -1) {
        updateDescription(defaultIndex);
      }
    }, 100);
  }

  // Fetch and populate Currently data
  async function loadCurrentlyData() {
    try {
      const response = await fetch("/currently.json");
      const data = await response.json();

      // Learning
      document.getElementById("learning-title").textContent = data.learning.title;
      document.getElementById("learning-desc").textContent =
        data.learning.description;
      document.getElementById("learning-progress").style.width =
        data.learning.progress + "%";
      document.getElementById("learning-percent").textContent =
        data.learning.progress + "%";

      // Listening
      document.getElementById("listening-title").textContent =
        data.listening.title;
      document.getElementById("listening-artist").textContent =
        data.listening.artist;

      // Create Spotify embed
      const trackId = data.listening.spotifyUrl.split("/track/")[1].split("?")[0];
      const spotifyEmbed = document.getElementById("spotify-embed");
      spotifyEmbed.innerHTML = `<iframe style="border-radius:8px" src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;

      // Obsessing
      document.getElementById("obsessing-title").textContent =
        data.obsessing.title;
      document.getElementById("obsessing-desc").textContent =
        data.obsessing.description;

      // Coffee
      document.getElementById("coffee-order").textContent = data.coffee.order;
      document.getElementById("coffee-desc").textContent =
        data.coffee.description;

      // Exploring
      document.getElementById("exploring-location").textContent =
        data.exploring.location;
      document.getElementById("exploring-desc").textContent =
        data.exploring.description;

      // Reading - Generate bookshelf
      generateBookshelf(data.reading);

      // Watching
      const watchingList = document.getElementById("watching-list");
      watchingList.innerHTML = data.watching
        .map(
          (show) =>
            `<h3 class="currently-title" style="margin-bottom: 0.5rem;">${show}</h3>`
        )
        .join("");
    } catch (error) {
      console.error("Error loading currently data:", error);
    }
  }

  loadCurrentlyData();

  // Currently section scroll animations
  ScrollTrigger.create({
    trigger: ".currently",
    start: "top bottom",
    once: true,
    onEnter: () => {
      gsap.from(".currently-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
  });

  // Gallery scroll animations
  ScrollTrigger.create({
    trigger: ".life-gallery",
    start: "top 80%",
    once: true,
    onEnter: () => {
      gsap.from(".gallery-item", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
  });
});
