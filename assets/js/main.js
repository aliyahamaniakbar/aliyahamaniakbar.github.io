// Custom cursor
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
});

// Scroll reveal (Intersection Observer)
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });
reveals.forEach(el => revealObserver.observe(el));

// Parallax on title spreads
const parallaxItems = [
  { el: document.getElementById('parallax-1'), speed: 0.4 },
  { el: document.getElementById('parallax-2'), speed: 0.4 },
  { el: document.getElementById('parallax-3'), speed: 0.4 },
  { el: document.getElementById('parallax-4'), speed: 0.4 },
  { el: document.getElementById('parallax-5'), speed: 0.4 },
];

// Hero parallax
const heroBg = document.getElementById('hero-bg');

function onScroll() {
  const scrollY = window.scrollY;

  // Hero parallax
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
  }

  // Each spread
  parallaxItems.forEach(item => {
    if (!item.el) return;
    const parent = item.el.closest('.project-title-spread');
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    item.el.style.transform = `translateY(${center * item.speed}px)`;
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
