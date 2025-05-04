/*
   PawsHome Pet Adoption Center
   Main JavaScript File
*/

document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", function (e) {
      e.preventDefault();
      navMenu.classList.toggle("active");

      // Toggle hamburger menu animation
      const spans = this.querySelectorAll("span");
      spans.forEach((span) => span.classList.toggle("active"));

      // Toggle aria-expanded attribute
      const isExpanded = navMenu.classList.contains("active");
      this.setAttribute("aria-expanded", isExpanded);

      // Prevent scrolling when menu is open
      document.body.classList.toggle("menu-open");
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      navMenu &&
      navMenu.classList.contains("active") &&
      !event.target.closest(".nav-menu") &&
      !event.target.closest(".mobile-menu-btn")
    ) {
      navMenu.classList.remove("active");

      if (mobileMenuBtn) {
        const spans = mobileMenuBtn.querySelectorAll("span");
        spans.forEach((span) => span.classList.remove("active"));
        mobileMenuBtn.setAttribute("aria-expanded", false);
      }
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: "smooth",
        });

        // Update URL without page reload
        history.pushState(null, null, targetId);
      }
    });
  });

  // Animate statistics counter
  const statNumbers = document.querySelectorAll(".stat-number");

  function animateCounter(element) {
    const target = parseInt(element.getAttribute("data-count"));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += step;

      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  // Initialize counters when they come into view
  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((stat) => {
      observer.observe(stat);
    });
  }

  // Form validation (for contact/adoption forms)
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      let isValid = true;

      // Check required fields
      const requiredFields = form.querySelectorAll("[required]");
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          showError(field, "This field is required");
        } else {
          clearError(field);
        }
      });

      // Check email format
      const emailFields = form.querySelectorAll('input[type="email"]');
      emailFields.forEach((field) => {
        if (field.value.trim() && !isValidEmail(field.value)) {
          isValid = false;
          showError(field, "Please enter a valid email address");
        }
      });

      // Check phone format
      const phoneFields = form.querySelectorAll('input[type="tel"]');
      phoneFields.forEach((field) => {
        if (field.value.trim() && !isValidPhone(field.value)) {
          isValid = false;
          showError(field, "Please enter a valid phone number");
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });
  });

  function showError(field, message) {
    // Clear any existing error
    clearError(field);

    // Add error class to the field
    field.classList.add("error");

    // Create and append error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    // Insert error message after the field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
  }

  function clearError(field) {
    // Remove error class
    field.classList.remove("error");

    // Remove any existing error message
    const errorMessage = field.parentNode.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone);
  }

  // Responsive image loading
  const responsiveImages = document.querySelectorAll("[data-src]");

  if (responsiveImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute("data-src");
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      });
    });

    responsiveImages.forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Add active class to current page in navigation
  const currentLocation = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-menu a");

  navLinks.forEach((link) => {
    if (
      link.getAttribute("href") === currentLocation ||
      (currentLocation.endsWith("/") &&
        link.getAttribute("href") === "index.html")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
