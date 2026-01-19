<<<<<<< HEAD
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
  slides.push(...projectCards);

  if (slides.length > 0) {
    updateSlider();
    sliderInitialized = true;
  }

  // Add event listeners for controls
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');

  if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
  });

  // Touch support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (slider) {
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) changeSlide(1); // Swipe left
    if (touchEndX > touchStartX + 50) changeSlide(-1); // Swipe right
  }
}

function changeSlide(direction) {
  currentSlide += direction;

  // Loop around
  if (currentSlide < 0) currentSlide = slides.length - 1;
  if (currentSlide >= slides.length) currentSlide = 0;

  updateSlider();
}

function updateSlider() {
  // Hide all slides
  slides.forEach((slide, index) => {
    slide.style.display = index === currentSlide ? 'flex' : 'none';
  });

  // Update dots
  const dotsContainer = document.getElementById('slider-dots');
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = 'dot' + (index === currentSlide ? ' active' : '');
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    });
  }

  // Update button states
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');

  if (prevBtn) prevBtn.disabled = slides.length <= 1;
  if (nextBtn) nextBtn.disabled = slides.length <= 1;
}

// ===================================
// Form Validation & Submission
// ===================================

document.addEventListener('DOMContentLoaded', function () {
  // Initialize slider
  initializeSlider();

  const form = document.getElementById('audit-form');
  const successMessage = document.getElementById('success-message');

  // Form validation
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Reset previous errors
    clearErrors();

    // Validate form
    let isValid = true;

    // Name validation
    const name = document.getElementById('name');
    if (!name.value.trim()) {
      showError(name, 'Please enter your name');
      isValid = false;
    }

    // Email validation
    const email = document.getElementById('email');
    if (!email.value.trim()) {
      showError(email, 'Please enter your email');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError(email, 'Please enter a valid email address');
      isValid = false;
    }

    // Pillar validation
    const pillar = document.getElementById('pillar');
    if (!pillar.value) {
      showError(pillar, 'Please select your profile');
      isValid = false;
    }

    // Phone validation (optional but validate format if provided)
    const phone = document.getElementById('phone');
    if (phone.value.trim() && !isValidPhone(phone.value)) {
      showError(phone, 'Please enter a valid phone number');
      isValid = false;
    }

    // Website validation (optional but validate format if provided)
    const website = document.getElementById('website');
    if (website.value.trim() && !isValidUrl(website.value)) {
      showError(website, 'Please enter a valid URL (e.g., https://example.com)');
      isValid = false;
    }

    // If form is valid, submit
    if (isValid) {
      submitForm();
    }
  });

  // Clear errors when user starts typing
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', function () {
      clearError(this);
    });
  });
});

// Show error message
function showError(element, message) {
  const formGroup = element.closest('.form-group');
  formGroup.classList.add('error');
  const errorMessage = formGroup.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.textContent = message;
  }
}

// Clear error for specific field
function clearError(element) {
  const formGroup = element.closest('.form-group');
  formGroup.classList.remove('error');
}

// Clear all errors
function clearErrors() {
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach(group => {
    group.classList.remove('error');
  });
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (basic international format)
function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
}

// URL validation
function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// Submit form
function submitForm() {
  const form = document.getElementById('audit-form');
  const successMessage = document.getElementById('success-message');
  const submitButton = form.querySelector('.btn-submit');

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
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxEPBqNQOe_n9zEIKoEyQpC9_W3nNLh02w597sjg7Fn3MbalprCEbCYT_gLIcg8VIuLfg/exec';

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
// Smooth Scroll Enhancement
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ===================================
// Header Scroll Effect
// ===================================

let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
  }

  lastScroll = currentScroll;
});

// ===================================
// Animation on Scroll (Optional Enhancement)
// ===================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe cards for scroll animations
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.pillar-card, .proof-card, .project-card');

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
});
=======
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
  slides.push(...projectCards);

  if (slides.length > 0) {
    updateSlider();
    sliderInitialized = true;
  }

  // Add event listeners for controls
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');

  if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
  });

  // Touch support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (slider) {
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) changeSlide(1); // Swipe left
    if (touchEndX > touchStartX + 50) changeSlide(-1); // Swipe right
  }
}

function changeSlide(direction) {
  currentSlide += direction;

  // Loop around
  if (currentSlide < 0) currentSlide = slides.length - 1;
  if (currentSlide >= slides.length) currentSlide = 0;

  updateSlider();
}

function updateSlider() {
  // Hide all slides
  slides.forEach((slide, index) => {
    slide.style.display = index === currentSlide ? 'flex' : 'none';
  });

  // Update dots
  const dotsContainer = document.getElementById('slider-dots');
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = 'dot' + (index === currentSlide ? ' active' : '');
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    });
  }

  // Update button states
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');

  if (prevBtn) prevBtn.disabled = slides.length <= 1;
  if (nextBtn) nextBtn.disabled = slides.length <= 1;
}

// ===================================
// Form Validation & Submission
// ===================================

document.addEventListener('DOMContentLoaded', function () {
  // Initialize slider
  initializeSlider();

  const form = document.getElementById('audit-form');
  const successMessage = document.getElementById('success-message');

  // Form validation
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Reset previous errors
    clearErrors();

    // Validate form
    let isValid = true;

    // Name validation
    const name = document.getElementById('name');
    if (!name.value.trim()) {
      showError(name, 'Please enter your name');
      isValid = false;
    }

    // Email validation
    const email = document.getElementById('email');
    if (!email.value.trim()) {
      showError(email, 'Please enter your email');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError(email, 'Please enter a valid email address');
      isValid = false;
    }

    // Pillar validation
    const pillar = document.getElementById('pillar');
    if (!pillar.value) {
      showError(pillar, 'Please select your profile');
      isValid = false;
    }

    // Phone validation (optional but validate format if provided)
    const phone = document.getElementById('phone');
    if (phone.value.trim() && !isValidPhone(phone.value)) {
      showError(phone, 'Please enter a valid phone number');
      isValid = false;
    }

    // Website validation (optional but validate format if provided)
    const website = document.getElementById('website');
    if (website.value.trim() && !isValidUrl(website.value)) {
      showError(website, 'Please enter a valid URL (e.g., https://example.com)');
      isValid = false;
    }

    // If form is valid, submit
    if (isValid) {
      submitForm();
    }
  });

  // Clear errors when user starts typing
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', function () {
      clearError(this);
    });
  });
});

// Show error message
function showError(element, message) {
  const formGroup = element.closest('.form-group');
  formGroup.classList.add('error');
  const errorMessage = formGroup.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.textContent = message;
  }
}

// Clear error for specific field
function clearError(element) {
  const formGroup = element.closest('.form-group');
  formGroup.classList.remove('error');
}

// Clear all errors
function clearErrors() {
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach(group => {
    group.classList.remove('error');
  });
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (basic international format)
function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
}

// URL validation
function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// Submit form
function submitForm() {
  const form = document.getElementById('audit-form');
  const successMessage = document.getElementById('success-message');
  const submitButton = form.querySelector('.btn-submit');

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
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxEPBqNQOe_n9zEIKoEyQpC9_W3nNLh02w597sjg7Fn3MbalprCEbCYT_gLIcg8VIuLfg/exec';

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
// Smooth Scroll Enhancement
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ===================================
// Header Scroll Effect
// ===================================

let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
  }

  lastScroll = currentScroll;
});

// ===================================
// Animation on Scroll (Optional Enhancement)
// ===================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe cards for scroll animations
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.pillar-card, .proof-card, .project-card');

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
});
>>>>>>> 72a46df7fc94554b7b00ad25c3686582a6e10af6
