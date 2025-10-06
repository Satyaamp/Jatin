// ===========================
// Global InfraTech Group - Main JavaScript
// ===========================

// DOM Elements
const preloader = document.getElementById('preloader');
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const toTopBtn = document.getElementById('toTop');
const contactForm = document.getElementById('contactForm');

// ===========================
// Preloader
// ===========================
function initPreloader() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hide');
      // Initialize AOS after page load
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 800,
          once: true,
          offset: 100,
          easing: 'ease-out-cubic'
        });
      }
    }, 1500);
  });
}

// ===========================
// Navbar Scroll Effects
// ===========================
function initNavbarScrollEffects() {
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class for backdrop blur effect
    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Show/hide back-to-top button
    if (currentScrollY > 300) {
      toTopBtn.classList.add('visible');
    } else {
      toTopBtn.classList.remove('visible');
    }
    
    lastScrollY = currentScrollY;
  });
}

// ===========================
// Mobile Navigation
// ===========================
function initMobileNav() {
  navToggle.addEventListener('click', () => {
    const isOpen = header.classList.contains('nav-open');
    
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });
  
  // Close mobile nav when clicking on nav links
  const navLinks = primaryNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });
  
  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && header.classList.contains('nav-open')) {
      closeMobileNav();
    }
  });
  
  // Close mobile nav on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) {
      closeMobileNav();
    }
  });
}

function openMobileNav() {
  header.classList.add('nav-open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Close navigation');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  header.classList.remove('nav-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
  document.body.style.overflow = '';
}

// ===========================
// Smooth Scrolling
// ===========================
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===========================
// Parallax Effects
// ===========================
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;
  
  function updateParallax() {
    const scrollTop = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5;
      const yPos = -(scrollTop * speed);
      
      element.style.transform = `translateY(${yPos}px)`;
    });
  }
  
  // Throttle scroll events for better performance
  let ticking = false;
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', () => {
    requestTick();
    ticking = false;
  });
}

// ===========================
// Gallery Lightbox
// ===========================
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const imgSrc = item.href;
      const caption = item.dataset.caption || '';
      
      openLightbox(imgSrc, caption);
    });
  });
  
  // Close lightbox events
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Close lightbox with escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

function openLightbox(imgSrc, caption) {
  lightboxImg.src = imgSrc;
  lightboxImg.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  
  // Clear image src to prevent memory leaks
  setTimeout(() => {
    lightboxImg.src = '';
    lightboxImg.alt = '';
    lightboxCaption.textContent = '';
  }, 300);
}

// ===========================
// Contact Form
// ===========================
function initContactForm() {
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', handleFormSubmit);
  
  // Real-time validation
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);
  
  // Validate all fields
  const isValid = validateForm(data);
  
  if (isValid) {
    submitForm(data);
  }
}

function validateForm(data) {
  let isValid = true;
  
  // Clear previous errors
  clearAllErrors();
  
  // Validate name
  if (!data.name || data.name.trim().length < 2) {
    showFieldError('name', 'Name must be at least 2 characters long');
    isValid = false;
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    showFieldError('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  // Validate message
  if (!data.message || data.message.trim().length < 10) {
    showFieldError('message', 'Message must be at least 10 characters long');
    isValid = false;
  }
  
  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  
  if (fieldName === 'name' && value.length < 2) {
    showFieldError(fieldName, 'Name must be at least 2 characters long');
    return false;
  }
  
  if (fieldName === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showFieldError(fieldName, 'Please enter a valid email address');
      return false;
    }
  }
  
  if (fieldName === 'message' && value.length < 10) {
    showFieldError(fieldName, 'Message must be at least 10 characters long');
    return false;
  }
  
  clearFieldError(field);
  return true;
}

function showFieldError(fieldName, message) {
  const field = contactForm.querySelector(`[name="${fieldName}"]`);
  const errorElement = contactForm.querySelector(`#${fieldName}Error`);
  
  if (field && errorElement) {
    field.classList.add('error');
    errorElement.textContent = message;
    errorElement.setAttribute('aria-live', 'polite');
  }
}

function clearFieldError(field) {
  const fieldName = field.name;
  const errorElement = contactForm.querySelector(`#${fieldName}Error`);
  
  if (errorElement) {
    field.classList.remove('error');
    errorElement.textContent = '';
  }
}

function clearAllErrors() {
  const errorElements = contactForm.querySelectorAll('.error');
  errorElements.forEach(element => {
    element.textContent = '';
    element.previousElementSibling.classList.remove('error');
  });
}

async function submitForm(data) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const statusElement = document.getElementById('formStatus');
  
  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  
  try {
    // Simulate API call (replace with actual endpoint)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show success message
    showFormStatus('success', 'Thank you! Your message has been sent successfully.');
    contactForm.reset();
    
  } catch (error) {
    // Show error message
    showFormStatus('error', 'Sorry, there was an error sending your message. Please try again.');
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  }
}

function showFormStatus(type, message) {
  const statusElement = document.getElementById('formStatus');
  
  statusElement.className = `form-status ${type}`;
  statusElement.textContent = message;
  statusElement.setAttribute('aria-live', 'polite');
  
  // Clear status after 5 seconds
  setTimeout(() => {
    statusElement.textContent = '';
    statusElement.className = 'form-status';
  }, 5000);
}

// ===========================
// Back to Top Button
// ===========================
function initBackToTop() {
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===========================
// Intersection Observer for Animations
// ===========================
function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Observe elements that should animate
  const animatedElements = document.querySelectorAll('.card, .sust-item, .exec, .about-media, .about-content');
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// ===========================
// Performance Optimizations
// ===========================
function initPerformanceOptimizations() {
  // Lazy load images
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // Preload critical resources
  const criticalImages = [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// ===========================
// Keyboard Navigation
// ===========================
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Skip to main content with Tab key
    if (e.key === 'Tab' && !e.shiftKey) {
      const skipLink = document.querySelector('.skip-link');
      if (document.activeElement === skipLink) {
        e.preventDefault();
        const main = document.getElementById('main');
        main.focus();
        main.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}

// ===========================
// Error Handling
// ===========================
function initErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // Could send error reports to analytics service
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // Could send error reports to analytics service
  });
}

// ===========================
// Initialize All Functions
// ===========================
function init() {
  // Core functionality
  initPreloader();
  initNavbarScrollEffects();
  initMobileNav();
  initSmoothScrolling();
  initParallaxEffects();
  initLightbox();
  initContactForm();
  initBackToTop();
  
  // Enhanced features
  initIntersectionObserver();
  initPerformanceOptimizations();
  initKeyboardNavigation();
  initErrorHandling();
  
  console.log('Global InfraTech Group website initialized successfully');
}

// ===========================
// DOM Ready
// ===========================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ===========================
// Export for testing (if needed)
// ===========================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    init,
    openLightbox,
    closeLightbox,
    validateForm,
    showFormStatus
  };
}
