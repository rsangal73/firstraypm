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

// Contact form — show success state
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    successMsg.style.display = 'block';
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
