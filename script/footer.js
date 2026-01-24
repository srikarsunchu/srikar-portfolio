import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

gsap.registerPlugin(ScrollTrigger);

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Formspree endpoint
const FORMSPREE_ENDPOINT = "https://formspree.io/f/myzndvlb";

class FooterEmailForm {
  constructor() {
    this.form = document.getElementById("footer-email-form");
    this.input = document.getElementById("footer-email");
    this.button = this.form?.querySelector('button[type="submit"]');
    this.feedback = document.getElementById("footer-email-feedback");
    
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.input.addEventListener("input", () => this.clearFeedback());
  }

  async handleSubmit(e) {
    e.preventDefault();

    const email = this.input.value.trim();

    // Validate email
    if (!this.validateEmail(email)) {
      this.showFeedback("Please enter a valid email address", "error");
      return;
    }

    // Show loading state
    this.setLoadingState(true);

    try {
      // Submit to Formspree
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        this.showFeedback("Thanks! You're on the list ✓", "success");
        this.form.reset();
        
        // Optional: Track with analytics
        this.trackSubmission(email);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      this.showFeedback("Something went wrong. Please try again.", "error");
    } finally {
      this.setLoadingState(false);
    }
  }

  validateEmail(email) {
    return EMAIL_REGEX.test(email);
  }

  setLoadingState(isLoading) {
    if (isLoading) {
      this.button.classList.add("loading");
      this.button.disabled = true;
      this.input.disabled = true;
    } else {
      this.button.classList.remove("loading");
      this.button.disabled = false;
      this.input.disabled = false;
    }
  }

  showFeedback(message, type) {
    this.feedback.textContent = message;
    this.feedback.className = `footer-email-feedback ${type}`;
    
    // Animate feedback in
    gsap.fromTo(
      this.feedback,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );

    // Auto-hide success message after 5 seconds
    if (type === "success") {
      setTimeout(() => this.clearFeedback(), 5000);
    }
  }

  clearFeedback() {
    if (this.feedback.textContent) {
      gsap.to(this.feedback, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          this.feedback.textContent = "";
          this.feedback.className = "footer-email-feedback";
        },
      });
    }
  }

  trackSubmission(email) {
    // Add your analytics tracking here
    console.log("Email submitted:", email);
  }
}

// Footer 3D Scene Class
class Footer3DScene {
  constructor() {
    this.container = document.getElementById("footer-canvas");
    this.footerContainer = document.querySelector(".footer-container");
    
    if (!this.container || !this.footerContainer) return;
    
    this.mouse = { x: 0, y: 0 };
    this.model = null;
    this.modelBaseRotationX = 0.5;
    this.modelBaseZ = -1;
    
    this.init();
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.container.offsetWidth / this.container.offsetHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 0.75);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(1, 1, 0);
    this.scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Load 3D model
    this.loadModel();

    // Setup scroll animation
    this.setupScrollAnimation();

    // Mouse tracking
    this.setupMouseTracking();

    // Handle resize
    this.setupResize();

    // Start animation loop
    this.animate();
  }

  loadModel() {
    const loader = new GLTFLoader();
    
    loader.load(
      "/model.glb",
      (gltf) => {
        this.model = gltf.scene;

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        this.model.position.sub(center);
        this.model.position.y = 0;
        this.model.position.z = -1;
        this.model.rotation.x = 0.5;

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1 / maxDim;
        this.model.scale.setScalar(scale);

        this.scene.add(this.model);
      },
      (progress) => {
        // Loading progress
        const percent = (progress.loaded / progress.total) * 100;
        console.log(`Loading 3D model: ${percent.toFixed(0)}%`);
      },
      (error) => {
        console.warn("Could not load 3D model:", error);
      }
    );
  }

  setupScrollAnimation() {
    ScrollTrigger.create({
      trigger: "footer",
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const yValue = -35 * (1 - progress);
        gsap.set(this.footerContainer, { y: `${yValue}%` });

        // Update model position based on scroll
        this.modelBaseZ = -1 * (1 - progress);
        this.modelBaseRotationX = 0.5 * (1 - progress);
      },
    });
  }

  setupMouseTracking() {
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  setupResize() {
    window.addEventListener("resize", () => {
      if (!this.container) return;
      
      this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.model) {
      // Smooth mouse-following rotation
      const targetRotationY = this.mouse.x * 0.3;
      const targetRotationX = -this.mouse.y * 0.2 + this.modelBaseRotationX;

      this.model.rotation.y += (targetRotationY - this.model.rotation.y) * 0.05;
      this.model.rotation.x += (targetRotationX - this.model.rotation.x) * 0.05;
      this.model.position.z += (this.modelBaseZ - this.model.position.z) * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new FooterEmailForm();
  new Footer3DScene();
});
