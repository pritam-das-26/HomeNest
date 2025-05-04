/*
   PawsHome Pet Adoption Center
   Animations JavaScript File
*/

document.addEventListener("DOMContentLoaded", function () {
  // Check if Intersection Observer is supported
  const hasIntersectionObserver = "IntersectionObserver" in window;

  // Scroll-based animations using Intersection Observer
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  if (animatedElements.length > 0) {
    // Check if user prefers reduced motion
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && hasIntersectionObserver) {
      const animationObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Add visible class to trigger animation
              entry.target.classList.add("visible");

              // Unobserve after animation is triggered
              animationObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1, // Trigger when 10% of the element is visible
          rootMargin: "0px 0px -50px 0px", // Adjust trigger point (negative value delays trigger)
        }
      );

      animatedElements.forEach((element) => {
        animationObserver.observe(element);
      });
    } else {
      // If user prefers reduced motion or IntersectionObserver is not supported, show all elements without animation
      animatedElements.forEach((element) => {
        element.classList.add("visible");
      });
    }
  }

  // Parallax effect for elements with .parallax class
  const parallaxElements = document.querySelectorAll(".parallax");

  if (
    parallaxElements.length > 0 &&
    window.matchMedia &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    // Use a throttled scroll event to improve performance
    let lastScrollTime = 0;
    const scrollThreshold = 10; // ms

    window.addEventListener(
      "scroll",
      function () {
        const now = Date.now();
        if (now - lastScrollTime > scrollThreshold) {
          lastScrollTime = now;

          parallaxElements.forEach((element) => {
            // Use multiple fallbacks for scroll position
            const scrollPosition =
              window.pageYOffset ||
              window.scrollY ||
              document.documentElement.scrollTop ||
              0;
            const speed = element.getAttribute("data-speed") || 0.5;
            const yPos = -(scrollPosition * speed);

            // Use string concatenation instead of template literals for older browsers
            element.style.backgroundPosition = "50% " + yPos + "px";
          });
        }
      },
      { passive: true }
    ); // Use passive event listener for better performance
  } else {
    // Make sure parallax elements still look good without the effect
    parallaxElements.forEach((element) => {
      element.style.backgroundPosition = "center center";
    });
  }

  // Animate elements when they come into view
  function createScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      // Fallback for browsers without IntersectionObserver support
      document.querySelectorAll("[data-animation]").forEach((element) => {
        const animationType = element.getAttribute("data-animation");
        if (animationType) {
          element.classList.add(`animate-${animationType}`);

          const delay = element.getAttribute("data-delay");
          if (delay) {
            element.classList.add(`delay-${delay}`);
          }
        }
      });
      return;
    }

    // Only create animations if user doesn't prefer reduced motion
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Show elements without animation if reduced motion is preferred
      document.querySelectorAll("[data-animation]").forEach((element) => {
        element.style.opacity = "1";
      });
      return;
    }

    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    try {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;

            // Get animation type from data attribute
            const animationType = element.getAttribute("data-animation");

            if (animationType) {
              // Add the animation class
              element.classList.add("animate-" + animationType);

              // Add delay class if specified
              const delay = element.getAttribute("data-delay");
              if (delay) {
                element.classList.add("delay-" + delay);
              }
            }

            // Unobserve after animation is triggered
            observer.unobserve(element);
          }
        });
      }, options);

      // Observe elements with data-animation attribute
      document.querySelectorAll("[data-animation]").forEach((element) => {
        observer.observe(element);
      });
    } catch (error) {
      // Fallback if there's an error with IntersectionObserver
      console.error("Animation error:", error);
      document.querySelectorAll("[data-animation]").forEach((element) => {
        element.style.opacity = "1";
      });
    }
  }

  // Call the function to set up scroll animations
  createScrollAnimations();

  // Smooth reveal for sections
  function revealSections() {
    const sections = document.querySelectorAll("section");

    // If no sections or IntersectionObserver not supported, make all sections visible
    if (
      sections.length === 0 ||
      !("IntersectionObserver" in window) ||
      (window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      sections.forEach((section) => {
        if (!section.classList.contains("animate-on-scroll")) {
          section.style.opacity = "1";
        }
      });
      return;
    }

    try {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("section-visible");
              entry.target.style.opacity = "1";
              sectionObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
        }
      );

      sections.forEach((section) => {
        if (!section.classList.contains("animate-on-scroll")) {
          section.style.opacity = "0";
          section.style.transition = "opacity 0.6s ease";
          sectionObserver.observe(section);
        }
      });
    } catch (error) {
      // Fallback if there's an error
      console.error("Section reveal error:", error);
      sections.forEach((section) => {
        if (!section.classList.contains("animate-on-scroll")) {
          section.style.opacity = "1";
        }
      });
    }
  }

  // Make all sections with section-visible class visible immediately
  document.querySelectorAll(".section-visible").forEach((section) => {
    section.style.opacity = "1";
  });

  // Call the function to set up section reveals
  revealSections();

  // Animate on hover
  const hoverElements = document.querySelectorAll("[data-hover-animation]");

  // Only add hover animations if reduced motion is not preferred
  if (
    !(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
  ) {
    hoverElements.forEach((element) => {
      const animationType = element.getAttribute("data-hover-animation");
      if (!animationType) return;

      try {
        // Use traditional function syntax for IE compatibility
        element.addEventListener("mouseenter", function () {
          this.classList.add("hover-" + animationType);
        });

        element.addEventListener("mouseleave", function () {
          this.classList.remove("hover-" + animationType);
        });
      } catch (error) {
        console.error("Hover animation error:", error);
      }
    });
  }
});
