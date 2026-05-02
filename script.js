const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

// Smooth fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.feature-card, .service-item, .review-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity .45s ease, transform .45s ease';
  observer.observe(el);
});

// Booking calendar
(function () {
  const calEl = document.getElementById('bookingCalendar');
  const hiddenInput = document.getElementById('selectedDate');
  const displayEl = document.getElementById('dateDisplay');
  if (!calEl) return;

  const MONTHS = ['Januar','Februar','Mars','April','Mai','Juni','Juli','August','September','Oktober','November','Desember'];
  const DAYS = ['Man','Tir','Ons','Tor','Fre','Lør','Søn'];

  let now = new Date();
  let viewYear = now.getFullYear();
  let viewMonth = now.getMonth();
  let selectedDate = null;

  function render() {
    const today = new Date(); today.setHours(0,0,0,0);
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const startOffset = (firstWeekday === 0) ? 6 : firstWeekday - 1;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    let html = '<div class="cal__nav">'
      + '<button class="cal__btn" id="calPrev">&#8249;</button>'
      + '<span class="cal__month">' + MONTHS[viewMonth] + ' ' + viewYear + '</span>'
      + '<button class="cal__btn" id="calNext">&#8250;</button>'
      + '</div><div class="cal__grid">';

    DAYS.forEach(d => { html += '<div class="cal__day-name">' + d + '</div>'; });

    for (let i = 0; i < startOffset; i++) html += '<div class="cal__day cal__day--empty"></div>';

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      date.setHours(0,0,0,0);
      const iso = date.toISOString().split('T')[0];
      const past = date < today;
      const sun = date.getDay() === 0;
      const sel = selectedDate && date.getTime() === selectedDate.getTime();
      const tod = date.getTime() === today.getTime();
      let cls = 'cal__day';
      if (past || sun) cls += ' cal__day--disabled';
      if (sel) cls += ' cal__day--selected';
      else if (tod) cls += ' cal__day--today';
      html += '<div class="' + cls + '" data-iso="' + iso + '">' + d + '</div>';
    }

    html += '</div>';
    calEl.innerHTML = html;

    document.getElementById('calPrev').addEventListener('click', function () {
      viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render();
    });
    document.getElementById('calNext').addEventListener('click', function () {
      viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render();
    });

    calEl.querySelectorAll('.cal__day:not(.cal__day--disabled):not(.cal__day--empty)').forEach(function (el) {
      el.addEventListener('click', function () {
        selectedDate = new Date(el.dataset.iso + 'T00:00:00');
        hiddenInput.value = el.dataset.iso;
        const parts = el.dataset.iso.split('-');
        displayEl.textContent = parts[2] + '. ' + MONTHS[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
        render();
      });
    });
  }

  render();

  // Form submission
  const form = document.getElementById('bookingForm');
  const successEl = document.getElementById('bookingSuccess');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(function (field) {
      if (!field.value.trim()) { field.classList.add('invalid'); valid = false; }
      else field.classList.remove('invalid');
    });

    const fnr = document.getElementById('fodselsnummer');
    if (fnr && !/^\d{11}$/.test(fnr.value)) { fnr.classList.add('invalid'); valid = false; }

    const pnr = document.getElementById('postnummer');
    if (pnr && !/^\d{4}$/.test(pnr.value)) { pnr.classList.add('invalid'); valid = false; }

    if (!hiddenInput.value) { displayEl.style.color = '#e05c5c'; displayEl.textContent = 'Vennligst velg en dato'; valid = false; }

    if (!valid) return;

    form.style.display = 'none';
    successEl.classList.add('visible');
  });

  form.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('input', function () { field.classList.remove('invalid'); });
  });
})();
