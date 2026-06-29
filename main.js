// Header shadow on scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('main-nav');
hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// Close nav on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

// Contact form — submit to Web3Forms and email contact@firstraypm.com
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');
const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

if (form) {
  // Mirror the user's email into the replyto hidden field
  const emailInput = form.querySelector('#email');
  const replytoInput = form.querySelector('[name="replyto"]');
  if (emailInput && replytoInput) {
    emailInput.addEventListener('input', () => { replytoInput.value = emailInput.value; });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const data = new FormData(form);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });
      const json = await res.json();
      if (json.success) {
        form.style.display = 'none';
        successMsg.style.display = 'block';
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send My Request';
      alert('Sorry, something went wrong. Please email us directly at contact@firstraypm.com');
    }
  });
}

// Smooth scroll active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}` ? 'var(--navy)' : '';
      });
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => observer.observe(s));

// Animate elements on scroll
const animateEls = document.querySelectorAll('.service-card, .tenant-card, .testimonial-card, .guarantee-card, .step');
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
animateEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  animObserver.observe(el);
});
