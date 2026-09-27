(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var WHATSAPP = '5512991674881';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Brilhos dourados (confete, corações e bokeh) ---------- */
  var HEART = '<svg viewBox="0 0 32 30"><use href="#heart"/></svg>';

  function rand(min, max) { return Math.random() * (max - min) + min; }

  document.querySelectorAll('.sparkle-field').forEach(function (field) {
    var total = parseInt(field.getAttribute('data-sparkles'), 10) || 80;
    if (window.innerWidth < 640) total = Math.round(total * 0.55);
    var frag = document.createDocumentFragment();

    for (var i = 0; i < total; i++) {
      var s = document.createElement('span');
      var roll = Math.random();
      var size;

      if (roll < 0.22) {
        s.className = 'sparkle heart';
        s.innerHTML = HEART;
        size = rand(8, 22);
      } else if (roll < 0.34) {
        s.className = 'sparkle bokeh';
        size = rand(14, 38);
      } else {
        s.className = 'sparkle';
        size = rand(2, 9);
      }
      if (!reduceMotion && Math.random() < 0.35) s.className += ' floaty';

      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.left = rand(0, 100) + '%';
      s.style.top = rand(0, 100) + '%';
      s.style.setProperty('--d', rand(2, 5).toFixed(2) + 's');
      s.style.setProperty('--delay', (-rand(0, 5)).toFixed(2) + 's');
      s.style.setProperty('--r', rand(-35, 35).toFixed(0) + 'deg');
      s.style.setProperty('--fd', rand(10, 20).toFixed(1) + 's');
      s.style.setProperty('--dx', rand(-20, 20).toFixed(0) + 'px');
      s.style.setProperty('--dy', rand(-40, 10).toFixed(0) + 'px');
      frag.appendChild(s);
    }
    field.appendChild(frag);
  });

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('menu');

  function closeMenu() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Cabeçalho ao rolar ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Animação de entrada ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el, i) {
      el.style.transitionDelay = ((i % 4) * 0.08) + 's';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Formulário → WhatsApp ---------- */
  var form = document.getElementById('waForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = form.nome.value.trim();
    var festa = form.festa.value.trim();
    var msg = 'Olá, Maria Festinha! Meu nome é ' + nome + '.';
    if (festa) msg += ' Gostaria de um orçamento para: ' + festa + '.';
    else msg += ' Gostaria de um orçamento.';
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  /* ---------- Ano no rodapé ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
