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

// Contact form (Web3Forms AJAX)
const contactForm = document.getElementById('contact-form');
const contactSubmit = document.getElementById('contact-submit');
const contactFormStatus = document.getElementById('contact-form-status');
const contactSubmitDefaultLabel = contactSubmit ? contactSubmit.textContent.trim() : 'Submit';
const contactSubmitResetDelayMs = 2500;
let contactSubmitInFlight = false;

function setContactSubmitState({ label, busy, submitting, submitted, disabled }) {
  if (!contactSubmit) return;

  contactSubmit.textContent = label;
  contactSubmit.disabled = disabled;
  contactSubmit.setAttribute('aria-busy', busy ? 'true' : 'false');
  contactSubmit.classList.toggle('is-submitting', submitting);
  contactSubmit.classList.toggle('is-submitted', submitted);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (contactForm && contactSubmit) {
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (contactSubmitInFlight) return;
    if (!contactForm.reportValidity()) return;

    contactSubmitInFlight = true;
    if (contactFormStatus) contactFormStatus.textContent = '';

    setContactSubmitState({
      label: 'Sending…',
      busy: true,
      submitting: true,
      submitted: false,
      disabled: true,
    });

    const payload = Object.fromEntries(new FormData(contactForm));

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setContactSubmitState({
          label: 'Submitted',
          busy: false,
          submitting: false,
          submitted: true,
          disabled: true,
        });
        if (contactFormStatus) {
          contactFormStatus.textContent = 'Message sent successfully.';
        }
        contactForm.reset();
        await wait(contactSubmitResetDelayMs);
        if (contactFormStatus) contactFormStatus.textContent = '';
        setContactSubmitState({
          label: contactSubmitDefaultLabel,
          busy: false,
          submitting: false,
          submitted: false,
          disabled: false,
        });
      } else {
        const errorMessage = data.message || 'Something went wrong. Please try again.';
        if (contactFormStatus) contactFormStatus.textContent = errorMessage;
        setContactSubmitState({
          label: 'Try again',
          busy: false,
          submitting: false,
          submitted: false,
          disabled: false,
        });
      }
    } catch {
      if (contactFormStatus) {
        contactFormStatus.textContent = 'Something went wrong. Please try again.';
      }
      setContactSubmitState({
        label: 'Try again',
        busy: false,
        submitting: false,
        submitted: false,
        disabled: false,
      });
    } finally {
      contactSubmitInFlight = false;
    }
  });
}
