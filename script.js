// ===================================
// Past Projects Slider
// ===================================

let currentSlide = 0;
const slides = [];
let sliderInitialized = false;

function initializeSlider() {
  if (sliderInitialized) return;

  const slider = document.getElementById('projects-slider');
  if (!slider) return;

  const projectCards = slider.querySelectorAll('.project-card');
  if (projectCards.length === 0) return;

  // Clear existing slides
  slides.length = 0;

  // Add slides
  projectCards.forEach((card, index) => {
    slides.push(card);
    if (index === 0) {
      card.style.display = 'flex';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    } else {
      card.style.display = 'none';
    }
  });

  // Create dots
  const dotsContainer = document.getElementById('slider-dots');
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = 'dot' + (index === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  sliderInitialized = true;
}

function showSlide(index) {
  if (slides.length === 0) return;

  // Hide all slides
  slides.forEach(slide => {
    slide.style.display = 'none';
  });

  // Show current slide
  slides[index].style.display = 'flex';
  slides[index].style.opacity = '1';
  slides[index].style.transform = 'translateY(0)';

  // Update dots
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  if (slides.length === 0) return;
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  if (slides.length === 0) return;
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function goToSlide(index) {
  if (slides.length === 0) return;
  currentSlide = index;
  showSlide(currentSlide);
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeSlider();

  // Add event listeners for navigation buttons
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Auto-advance slider every 5 seconds
  setInterval(() => {
    if (slides.length > 0) {
      nextSlide();
    }
  }, 5000);
});

// ===================================
// Form Validation & Submission
// ===================================

const form = document.getElementById('audit-form');
const submitButton = form?.querySelector('button[type="submit"]');
const successMessage = document.getElementById('success-message');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (basic international format)
const phoneRegex = /^[\d\s\-\+\(\)]+$/;

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  let isValid = true;
  let errorMessage = '';

  // Required field validation
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = `Please enter your ${fieldName}`;
  }

  // Email validation
  if (fieldName === 'email' && value && !emailRegex.test(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid email address';
  }

  // Phone validation
  if (fieldName === 'phone' && value && !phoneRegex.test(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid phone number';
  }

  // Show/hide error message
  const errorElement = field.parentElement.querySelector('.error-message');
  if (errorElement) {
    if (isValid) {
      field.parentElement.classList.remove('error');
      errorElement.style.display = 'none';
    } else {
      field.parentElement.classList.add('error');
      errorElement.textContent = errorMessage;
      errorElement.style.display = 'block';
    }
  }

  return isValid;
}

// Add real-time validation
if (form) {
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.parentElement.classList.contains('error')) {
        validateField(input);
      }
    });
  });
}

// Form submission
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isFormValid = true;

    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      return;
    }

    // Submit form
    submitForm();
  });
}

function submitForm() {
  // Get form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    company: document.getElementById('company').value,
    pillar: document.getElementById('pillar').value,
    website: document.getElementById('website').value,
    message: document.getElementById('message').value,
    timestamp: new Date().toISOString()
  };

  // Disable submit button
  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';

  // Log to console
  console.log('Technical Audit Request:', formData);

  // TODO: Replace this URL with your Google Apps Script Web App URL
  // See google-sheets-setup.md in the brain folder for setup instructions
  const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

  // Submit to Google Sheets
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors', // Required for Google Apps Script
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
    .then(() => {
      // Show success message
      successMessage.classList.add('show');

      // Reset form
      form.reset();

      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = 'Book Free Technical Audit';

      // Hide success message after 5 seconds
      setTimeout(() => {
        successMessage.classList.remove('show');
      }, 5000);
    })
    .catch((error) => {
      console.error('Error submitting form:', error);

      // Show error message
      alert('There was an error submitting your request. Please try again or contact us directly.');

      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = 'Book Free Technical Audit';
    });
}

// ===================================
// Sticky Header
// ===================================

let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    header.classList.remove('scroll-up');
    return;
  }

  if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
    // Scroll Down
    header.classList.remove('scroll-up');
    header.classList.add('scroll-down');
  } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
    // Scroll Up
    header.classList.remove('scroll-down');
    header.classList.add('scroll-up');
  }

  lastScroll = currentScroll;
});

// ===================================
// Scroll Animations
// ===================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with fade-in-on-scroll class (except project cards which are handled by slider)
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.pillar-card, .service-card, .proof-card');
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
});
