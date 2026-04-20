// ===== TYPING EFFECT =====
const typedPhrases = [
  'embedded systems.',
  'circuit designs.',
  'IoT devices.',
  'the future of hardware.',
  'things that matter.'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeEffect() {
  const currentPhrase = typedPhrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentPhrase.length) {
    speed = 2000; // pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typedPhrases.length;
    speed = 400; // pause before next word
  }

  setTimeout(typeEffect, speed);
}

// Start typing after page loads
setTimeout(typeEffect, 1500);

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  // Navbar background
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinksContainer.classList.toggle('open');
});

// Close mobile nav on link click
navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinksContainer.classList.remove('open');
  });
});

// ===== PROJECT MODAL =====
const projectModal    = document.getElementById('projectModal');
const projectModalClose = document.getElementById('projectModalClose');
const projectModalHero  = document.getElementById('projectModalHero');
const projectModalMeta  = document.getElementById('projectModalMeta');
const projectModalBody  = document.getElementById('projectModalBody');

function openProjectModal(card) {
  const front   = card.querySelector('.project-card-front');
  const back    = card.querySelector('.project-card-back');
  const details = back.querySelector('.project-details');

  // Hero image
  const heroImg = front.querySelector('img');
  if (heroImg) {
    projectModalHero.src = heroImg.src;
    projectModalHero.alt = heroImg.alt;
    projectModalHero.style.display = 'block';
  } else {
    projectModalHero.style.display = 'none';
  }

  // Title, date, tags
  const title = back.querySelector('h3') ? back.querySelector('h3').textContent : '';
  const date  = front.querySelector('.project-date') ? front.querySelector('.project-date').textContent : '';
  const tags  = [...front.querySelectorAll('.project-tag')].map(t =>
    `<span class="project-tag">${t.textContent}</span>`
  ).join('');

  projectModalMeta.innerHTML = `
    <h3 id="projectModalTitle">${title}</h3>
    <p class="project-date">${date}</p>
    <div class="modal-tags">${tags}</div>
  `;

  // Body content — clone so we don't disturb the hidden source
  projectModalBody.innerHTML = details ? details.innerHTML : '';

  // Make strip images in modal open the lightbox
  projectModalBody.querySelectorAll('img[data-full]').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.src = img.getAttribute('data-full');
      lightbox.classList.add('active');
    });
  });

  projectModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  projectModal.querySelector('.project-modal').scrollTop = 0;
}

function closeProjectModal() {
  projectModal.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('.expand-btn')) return;
    openProjectModal(card);
  });
});

projectModalClose.addEventListener('click', closeProjectModal);

projectModal.addEventListener('click', (e) => {
  if (e.target === projectModal) closeProjectModal();
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.expand-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const imgSrc = btn.getAttribute('data-img');
    lightboxImg.src = imgSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  if (!projectModal.classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (lightbox.classList.contains('active')) {
      closeLightbox();
    } else if (projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  }
});

// ===== SCROLL REVEAL / INTERSECTION OBSERVER =====
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
  observer.observe(item);
});

// Observe roadmap steps with staggered delay
document.querySelectorAll('.roadmap-step').forEach((step, i) => {
  step.style.transitionDelay = `${i * 0.1}s`;
  observer.observe(step);
});

// ===== SKILL CARD TILT EFFECT =====
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== PARALLAX CIRCUIT SVG =====
window.addEventListener('scroll', () => {
  const svg = document.querySelector('.circuit-svg');
  if (svg) {
    const scrolled = window.scrollY;
    svg.style.transform = `translateY(${scrolled * 0.15}px)`;
  }
});
