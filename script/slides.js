import elideCardVideo from "../assets/elide.mp4";
import elideCardImage from "../assets/elide1.jpg";

const slides = [
  {
    slideTitle: "Elide",
    year: "2026",
    slideDescription:
      "Marketing site for Elide — a polyglot runtime and build toolchain. One binary, ~5ms cold starts, 100x faster than Next.js. Hand-rolled with Bun, LightningCSS, and Cloudflare Workers. Dark-first design system, auto-cycling code demos, animated benchmarks, and i18n for 8 languages.",
    slideUrl: "/elide-dev",
    slideTags: ["Web Design", "Marketing", "Developer Tools", "Performance"],
    slideImg: elideCardVideo,
    thumbnail: elideCardImage,
  },
  {
    slideTitle: "PointPal",
    year: "2025",
    slideDescription:
      "AI-powered travel platform that finds flights 40-90% cheaper using credit card points. Searches 200+ airlines to optimize point transfers and redemptions. 40,000+ flights booked.",
    slideUrl: "/pointpal",
    slideTags: ["Next.js", "TypeScript", "AI/ML", "Web Design"],
    slideImg: "/gallery-images/pointpal-video.mp4",
    thumbnail: "/gallery-images/pointpal-thumbnail.png",
  },
  {
    slideTitle: "Viral Engine",
    year: "2025",
    slideDescription:
      "Landing page for 24Labs' UGC creator management platform. Designed and built a conversion-focused page that translates a complex CRM dashboard into a clear product narrative for brands scaling user-generated content.",
    slideUrl: "/viral-engine",
    slideTags: ["React", "TypeScript", "Vite", "SaaS"],
    slideImg: "/gallery-images/viral-engine-video.mp4",
    thumbnail: "/gallery-images/viral-engine-thumbnail.png",
  },
  {
    slideTitle: "9M Holdings Inc.",
    year: "2024",
    slideDescription:
      "Co-founded B2B software development agency. Exited via two IP buyouts including a client reporting dashboard platform and CS2 skin trading marketplace API.",
    slideUrl: "/9m-holdings",
    slideTags: ["B2B SaaS", "Automation", "Dashboards"],
    slideImg: "/gallery-images/9mSiteVideo.mp4",
    thumbnail: "/gallery-images/9MThumbnail.png",
  },
  {
    slideTitle: "Roshan Studios",
    year: "2024",
    slideDescription:
      "A web development agency designing websites, branding, and landing pages for the next generation of startups.",
    slideUrl: "/roshan-studios",
    slideTags: ["Next.js", "Web Design", "Landing Pages", "Design Systems"],
    slideImg: "/gallery-images/RoshanStudiosBanner.mp4",
    thumbnail: "/gallery-images/RoshanStudios.jpg",
  },
];

export default slides;
