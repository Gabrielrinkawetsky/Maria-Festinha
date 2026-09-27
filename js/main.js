(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var WHATSAPP = '5512991674881';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll suave: Lenis + GSAP ScrollTrigger ----------
     Lenis move o scroll nativo da janela com inércia; o ticker do GSAP
     comanda o raf do Lenis, e cada passo do Lenis atualiza o ScrollTrigger,
     então tudo anda no mesmo frame. No toque (celular) o scroll é o nativo. */
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  var lenis = null;
  if (gsap && ST) {
    gsap.registerPlugin(ST);
    ST.config({ ignoreMobileResize: true });
    document.documentElement.classList.add('gsap-on');
    if (window.Lenis && !reduceMotion) {
      lenis = new window.Lenis({
        lerp: 0.07,           // inércia: ~1,4 s de deslize após soltar a roda. Menor = desliza mais
        smoothWheel: true,
        wheelMultiplier: 1,
        anchors: true,        // links #secao deslizam (respeita scroll-padding-top)
        autoRaf: false
      });
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

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

  /* ---------- Hero: frames do vídeo controlados pelo scroll ---------- */
  (function () {
    var hero = document.getElementById('hero');
    var canvas = hero && hero.querySelector('.hero-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var total = parseInt(canvas.getAttribute('data-frames'), 10);
    var base = canvas.getAttribute('data-src');
    var PRELOAD = 12;          // frames carregados de imediato
    var BATCH = 6;             // frames carregados por vez no restante
    var frames = new Array(total);
    var current = -1;
    var queued = false;

    function src(i) { return base + String(i + 1).padStart(4, '0') + '.webp'; }

    function load(i) {
      if (i < 0 || i >= total || frames[i]) return frames[i];
      var img = new Image();
      img.decoding = 'async';
      img.src = src(i);
      // decodifica fora do scroll: o drawImage não trava decodificando o WebP
      img.decode().then(function () {
        img.ready = true;
        if (i === targetFrame()) draw(true);
      }, function () {});
      frames[i] = img;
      return img;
    }

    var progress = 0;
    function targetFrame() { return Math.round(progress * (total - 1)); }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw(true);
    }

    function draw(force) {
      queued = false;
      var i = targetFrame();
      // pede o frame certo e os vizinhos à frente, caso o usuário role rápido
      for (var k = 0; k < 4; k++) load(i + k);
      // se o frame ainda não chegou, usa o mais próximo já carregado antes dele
      var j = i;
      while (j > 0 && !(frames[j] && frames[j].ready)) j--;
      var img = frames[j];
      if (!img || !img.ready || (j === current && !force)) return;
      current = j;

      // equivalente a object-fit: cover
      var cw = canvas.width, ch = canvas.height;
      var s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      var w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }

    // sem GSAP (falha ao carregar): calcula o progresso pelo scroll nativo
    function onScroll() {
      var range = hero.offsetHeight - window.innerHeight;
      progress = range > 0 ? Math.min(1, Math.max(0, (window.scrollY - hero.offsetTop) / range)) : 0;
      if (!queued) { queued = true; requestAnimationFrame(function () { draw(false); }); }
    }

    // carrega o restante aos poucos, sem travar a página
    var next = PRELOAD;
    function loadRest() {
      for (var n = 0; n < BATCH && next < total; n++) load(next++);
      if (next < total) setTimeout(loadRest, 150);
    }

    for (var i = 0; i < PRELOAD; i++) load(i);
    if (ST) {
      // desenha no mesmo tick do Lenis/ScrollTrigger: sem atraso entre scroll e frame
      ST.create({
        trigger: hero, start: 'top top', end: 'bottom bottom',
        onUpdate: function (self) { progress = self.progress; draw(false); }
      });
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    window.addEventListener('resize', resize);
    window.addEventListener('load', function () { setTimeout(loadRest, 300); });
    resize();
  })();

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
  function done(el) {
    // devolve o elemento ao CSS normal (hover dos cards volta a funcionar)
    el.classList.remove('reveal');
    el.style.opacity = el.style.transform = el.style.transition = '';
  }
  if (gsap && ST && !reduceMotion) {
    var show = function (batch) {
      gsap.to(batch, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', overwrite: true,
        stagger: Math.min(0.08, 0.4 / batch.length), // lote grande não demora mais que 0,4 s
        onComplete: function () { batch.forEach(done); }
      });
    };
    // onLeave cobre saltos (link, tecla End) que passam do elemento sem "entrar" nele
    ST.batch('.reveal', { start: 'top 88%', once: true, onEnter: show, onLeave: show });
  } else {
    document.querySelectorAll('.reveal').forEach(done);
  }

  /* ---------- Flores desabrochando com o scroll ----------
     Começam fechadas no canto (invisíveis, pequenas e giradas) e se abrem
     conforme a seção entra na tela: o buquê cresce a partir do canto e
     "desenrola" a rotação. Sem recorte: só o PNG transparente aparece.
     scrub amarra o progresso ao scroll: rolar para cima fecha de novo. */
  if (gsap && ST && !reduceMotion) {
    document.querySelectorAll('.bloom').forEach(function (el) {
      var img = el.querySelector('img');
      var o = el.getAttribute('data-origin');
      var dir = o.indexOf('100%') === 0 ? -1 : 1;   // lado direito gira ao contrário
      gsap.set([el, img], { transformOrigin: o });
      gsap.timeline({
        scrollTrigger: { trigger: el.parentElement, start: 'top 92%', end: 'center 50%', scrub: 1 }
      })
        .fromTo(el,
          { scale: 0.2, rotation: -15 * dir, autoAlpha: 0 },
          { scale: 1, rotation: 0, autoAlpha: 1, ease: 'power2.out', duration: 1 })
        .fromTo(img,
          { rotation: 20 * dir, scale: 0.8 },
          { rotation: 0, scale: 1, ease: 'back.out(1.4)', duration: 1 }, 0);
    });
  }

  /* ---------- Brilhos só animam quando a seção está na tela ---------- */
  if (ST) {
    document.querySelectorAll('.sparkle-field').forEach(function (field) {
      ST.create({
        trigger: field.parentElement, start: 'top bottom', end: 'bottom top',
        onToggle: function (self) { field.classList.toggle('off', !self.isActive); }
      });
    });
  }

  window.addEventListener('load', function () { if (ST) ST.refresh(); });

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
