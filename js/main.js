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
  const prev = wrap.querySelector('.car-prev');
  const next = wrap.querySelector('.car-next');

  // how far to move = one photo + the gap between photos
  const step = () => {
    const photo = track.querySelector('img');
    return photo ? photo.offsetWidth + 12 : track.clientWidth;
  };
  const atStart = () => track.scrollLeft <= 5;
  const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;

  function goNext() {
    if (atEnd()) track.scrollTo({ left: 0, behavior: 'smooth' });   // last photo? back to first
    else track.scrollBy({ left: step(), behavior: 'smooth' });
  }
  function goPrev() {
    if (atStart()) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });   // first photo? jump to last
    else track.scrollBy({ left: -step(), behavior: 'smooth' });
  }

  // pause for a little while when someone is using it
  let paused = false;
  let resumeTimer;
  function pauseForAWhile() {
    paused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { paused = false; }, 5000);   // starts again after 5 seconds
  }

  // arrows
  next.addEventListener('click', () => { goNext(); pauseForAWhile(); });
  prev.addEventListener('click', () => { goPrev(); pauseForAWhile(); });

  // touching or hovering pauses it
  track.addEventListener('touchstart', pauseForAWhile, { passive: true });
  wrap.addEventListener('mouseenter', () => { paused = true; });
  wrap.addEventListener('mouseleave', () => { paused = false; });

  // auto-switch forever
  if (!calmMotion) {
    setInterval(() => {
      if (!paused && !document.hidden) goNext();
    }, CAROUSEL_SPEED);
  }
});
