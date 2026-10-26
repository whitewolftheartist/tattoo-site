// Menu code goes here
const menu = document.getElementById('menu');
const openBtn = document.querySelector('.menu-btn');
const closeBtn = document.querySelector('.menu-close');

function openMenu() {
  menu.classList.add('open');
  openBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  menu.classList.remove('open');
  openBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

openBtn.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });


// ===== ROTATING HEADLINE (Home page only) =====
const rotator = document.querySelector('.rotator');
if (rotator) {
  const lines = rotator.querySelectorAll('span');
  let current = 0;

  setInterval(() => {
    const oldLine = lines[current];
    current = (current + 1) % lines.length;   // go to the next one, then back to the first
    const newLine = lines[current];

    oldLine.classList.remove('is-active');
    oldLine.classList.add('is-leaving');      // slide out right
    newLine.classList.add('is-active');       // slide in

    // after it slides away, send it back to the left to wait its turn
    setTimeout(() => oldLine.classList.remove('is-leaving'), 700);
  }, 3000); // 3000 = 3 seconds. Make it bigger to show each one longer.
}


// ===== CAROUSEL ARROWS + AUTO-SWITCH =====
const CAROUSEL_SPEED = 3000;   // 3000 = 3 seconds per photo
const calmMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.carousel-wrap').forEach((wrap) => {
  const track = wrap.querySelector('.carousel');
  const photos = track.querySelectorAll('img');
  const prev = wrap.querySelector('.car-prev');
  const next = wrap.querySelector('.car-next');
  let index = 0;

  // go to one exact photo, centered (same way the Reviews carousel works)
  function goTo(i) {
    index = (i + photos.length) % photos.length;   // wraps around forever
    const photo = photos[index];
    track.scrollTo({
      left: photo.offsetLeft - (track.clientWidth - photo.offsetWidth) / 2,
      behavior: calmMotion ? 'auto' : 'smooth'
    });
  }

  // when someone swipes, figure out which photo is in the middle now
  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const middle = track.scrollLeft + track.clientWidth / 2;
      let closest = 0, best = Infinity;
      photos.forEach((p, i) => {
        const d = Math.abs(p.offsetLeft + p.offsetWidth / 2 - middle);
        if (d < best) { best = d; closest = i; }
      });
      index = closest;
    }, 120);
  }, { passive: true });

  // pause for a little while when someone is using it
  let paused = false;
  let resumeTimer;
  function pauseForAWhile() {
    paused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { paused = false; }, 5000);   // starts again after 5 seconds
  }

  // arrows
  next.addEventListener('click', () => { goTo(index + 1); pauseForAWhile(); });
  prev.addEventListener('click', () => { goTo(index - 1); pauseForAWhile(); });

  // touching pauses it for a bit
  track.addEventListener('touchstart', pauseForAWhile, { passive: true });

  // hovering pauses it, but ONLY with a real mouse (not a finger tap on a phone)
  wrap.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') paused = true; });
  wrap.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') paused = false; });

  // auto-switch forever
  if (!calmMotion) {
    setInterval(() => {
      if (!paused && !document.hidden) goTo(index + 1);
    }, CAROUSEL_SPEED);
  }
});
