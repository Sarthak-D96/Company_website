document.addEventListener('DOMContentLoaded', () => {
  // MOBILE NAVIGATION DRAWER
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      
      // Toggle icon representation
      if (navMenu.classList.contains('active')) {
        menuToggle.textContent = '✕';
      } else {
        menuToggle.textContent = '☰';
      }
    });

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link, .btn');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      });
    });
  }

  // ACCESSIBLE FORM HANDLING & USER FEEDBACK STATE MACHINE
  const contactForm = document.getElementById('consultation-form');
  const successAlert = document.getElementById('form-success');
  const errorAlert = document.getElementById('form-error');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Hide previous alerts
      successAlert.style.display = 'none';
      errorAlert.style.display = 'none';

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      // Enter loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Request...';

      // Gather form values
      const formData = {
        name: document.getElementById('contact-name').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        subject: document.getElementById('contact-subject').value.trim(),
        message: document.getElementById('contact-message').value.trim()
      };

      // Basic client-side validation check
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        errorAlert.style.display = 'block';
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        return;
      }

      try {
        // Simulate API post request delay (1.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Output successful result
        successAlert.style.display = 'block';
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        contactForm.reset();
        
      } catch (err) {
        console.error('Submission error:', err);
        errorAlert.style.display = 'block';
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } finally {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  // INTERSECTION OBSERVER FOR SCROLL REVEAL ANIMATIONS
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply reveal class targets dynamically
  const elementsToReveal = document.querySelectorAll('.service-card, .about-feature-item, .info-item, .contact-form');
  
  // Apply initial inline CSS rules for transition effect
  elementsToReveal.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    revealOnScroll.observe(el);
  });

  // Dynamic CSS injector for revealed class
  const style = document.createElement('style');
  style.textContent = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
});
