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

// Hero parallax
const heroBg = document.getElementById('hero-bg');
const mobileHeroQuery = window.matchMedia('(max-width: 820px)');

function onScroll() {
  const scrollY = window.scrollY;

  if (heroBg) {
    if (mobileHeroQuery.matches) {
      heroBg.style.transform = '';
    } else {
      heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
    }
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
mobileHeroQuery.addEventListener('change', onScroll);
onScroll();
