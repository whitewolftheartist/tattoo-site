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
