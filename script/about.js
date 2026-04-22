import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { initAnimations } from "./anime";

function scrambleOnHover(elements) {
  const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

  elements.forEach((el) => {
    const originalText = el.getAttribute("aria-label") || el.textContent.trim();
    const chars = originalText.split("");
    let isScrambling = false;

    el.addEventListener("mouseenter", () => {
      if (isScrambling) return;
      isScrambling = true;

      let iteration = 0;

      const interval = setInterval(() => {
        el.textContent = chars
          .map((char, i) => {
            if (char === " ") return char;
            if (i < Math.floor(iteration)) return chars[i];
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join("");

        iteration += 1.2;

        if (iteration >= chars.length) {
          clearInterval(interval);
          el.textContent = originalText;
          isScrambling = false;
        }
      }, 45);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  scrambleOnHover(document.querySelectorAll(".home-spotlight-bottom-bar p.mono .scramble-text"));

  initAnimations();

  // Broadsheet editorial hero entrance
  const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });
  heroTl
    .from(".about-hero-eyebrow", { y: 20, opacity: 0, duration: 0.6 })
    .from(".about-hero-name span", { y: 80, opacity: 0, duration: 0.9, stagger: 0.08 }, "-=0.3")
    .from(".about-hero-role", { y: 20, opacity: 0, duration: 0.6 }, "-=0.5")
    .from(".about-hero-quote", { y: 20, opacity: 0, duration: 0.7 }, "-=0.4")
    .fromTo(
      ".about-hero-plate-frame img",
      { scale: 1.08, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2 },
      "-=1.3"
    )
    .from(".about-hero-plate figcaption", { y: 10, opacity: 0, duration: 0.5 }, "-=0.3")
    .from([".about-hero-headrule", ".about-hero-footrule"], { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");

  const animeTextParagraphs = document.querySelectorAll(".anime-text p");
  const wordHighlightBgColor = "191, 188, 180";

  const keywords = [
    "design",
    "engineer",
    "storytelling",
    "interfaces",
    "narrative",
  ];

  animeTextParagraphs.forEach((paragraph) => {
    // Extract links before processing
    const links = {};
    const linkElements = paragraph.querySelectorAll('a');
    linkElements.forEach((link, index) => {
      const placeholder = `__LINK_${index}__`;
      links[placeholder] = link.cloneNode(true);
      link.replaceWith(placeholder);
    });

    const text = paragraph.textContent;
    const words = text.split(/\s+/);
    paragraph.innerHTML = "";

    words.forEach((word) => {
      if (word.trim()) {
        // Check if this word contains a link placeholder (might have punctuation attached)
        const linkMatch = word.match(/__LINK_(\d+)__/);
        if (linkMatch) {
          const placeholder = linkMatch[0];
          const linkElement = links[placeholder];
          const punctuation = word.replace(placeholder, ''); // Get any punctuation like comma
          
          const wordContainer = document.createElement("div");
          wordContainer.className = "word";
          
          const linkText = linkElement.textContent;
          const wordText = document.createElement("span");
          wordText.appendChild(linkElement);
          
          // Add punctuation after link if present
          if (punctuation) {
            wordText.appendChild(document.createTextNode(punctuation));
          }
          
          const normalizedWord = linkText.toLowerCase().replace(/[.,!?;:"]/g, "");
          if (keywords.includes(normalizedWord)) {
            wordContainer.classList.add("keyword-wrapper");
            wordText.classList.add("keyword", normalizedWord);
          }
          
          wordContainer.appendChild(wordText);
          paragraph.appendChild(wordContainer);
        } else {
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

  const bioIllustration = document.querySelector(".anime-text-illustration");
  if (bioIllustration) {
    gsap.fromTo(
      bioIllustration,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".anime-text-container",
          start: "top 82%",
          once: true,
        },
      }
    );
  }

  // Set currently section hidden initially; animate in when it enters the viewport
  gsap.set(".currently", { opacity: 0, y: 24 });
  gsap.fromTo(
    ".currently",
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".currently",
        start: "top 85%",
        once: true,
      },
    }
  );

  // Bookshelf generation and animation
  function generateBookshelf(books) {
    const booksWrapper = document.getElementById("books-wrapper");
    const descriptionsContainer = document.getElementById("book-descriptions");
    
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

          updateDescription(index);
        });
      });

      // Set default open book
      const defaultIndex = books.findIndex(b => b.defaultOpen);
      if (defaultIndex !== -1) {
        activeBookIndex = defaultIndex;
        activeTimeline = bookTimelines[defaultIndex];
        bookTimelines[defaultIndex].play();
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

    // ── Scroll-driven horizontal pan ──────────────────────────────────
    if (window.innerWidth >= 768) {
      // Wait one frame so DOM has laid out and scrollWidth is accurate
      requestAnimationFrame(() => {
        const booksWrapper   = document.querySelector(".books-wrapper");
        const bookShadow     = document.querySelector(".book-shadow");
        const container      = document.querySelector(".bookshelf-container");
        if (!booksWrapper || !container) return;

        const containerWidth = container.offsetWidth;
        const totalWidth     = booksWrapper.scrollWidth;

        // Start: books left-aligned; End: last book at right edge
        const startX = 0;
        const endX   = containerWidth - totalWidth;

        gsap.set([booksWrapper, bookShadow], { x: startX });

        const pinEnd = `+=${window.innerHeight * 2.5}`;

        ScrollTrigger.create({
          trigger: ".currently",
          start: "top top",
          end: pinEnd,
          pin: true,
          pinSpacing: true,
        });

        gsap.to([booksWrapper, bookShadow], {
          x: endX,
          ease: "none",
          scrollTrigger: {
            trigger: ".currently",
            start: "top top",
            end: pinEnd,
            scrub: 3,
          },
        });
      });
    }
  }

  // Fetch and populate Currently data
  async function loadCurrentlyData() {
    try {
      const response = await fetch("/currently.json");
      const data = await response.json();

      // Reading - Generate bookshelf
      generateBookshelf(data.reading);

      const activeBookEl = document.getElementById("currently-active-book");
      if (activeBookEl) {
        activeBookEl.textContent = "Books that shape my taste";
      }
    } catch (error) {
      console.error("Error loading currently data:", error);
    }
  }

  loadCurrentlyData();

  // Currently section entry animation
  gsap.fromTo(
    ".currently-reading-headline",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: ".currently", start: "top 75%" },
    }
  );

  gsap.fromTo(
    ".currently-editorial-index",
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: ".currently", start: "top 75%" },
    }
  );

});
