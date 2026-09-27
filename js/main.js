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

  /* ---------- Texto dobrando (FoldText) ----------
     Cada letra vira um <span> que "desdobra" a partir da borda de cima
     (rotateX -90° → 0°, dobradiça no topo, perspectiva 700px), com sombra
     de vinco (brilho 45% → 100%) e letras em cascata. Palavras não quebram. */
  var FOLD = { duration: 0.65, stagger: 0.045, ease: 'power3.out', perspective: 700, crease: 0.55 };
  var foldOn = !!(gsap && ST && !reduceMotion);

  function splitChars(el) {
    if (el.dataset.split) return el.querySelectorAll('.fold-char');
    el.dataset.split = '1';
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        var word = document.createElement('span');
        word.className = 'fold-word';
        word.setAttribute('aria-hidden', 'true');
        Array.from(part).forEach(function (ch) {
          var c = document.createElement('span');
          c.className = 'fold-char';
          c.textContent = ch;
          word.appendChild(c);
        });
        frag.appendChild(word);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return el.querySelectorAll('.fold-char');
  }

  var foldFrom = { rotationX: -90, transformPerspective: FOLD.perspective, autoAlpha: 0, filter: 'brightness(' + (1 - FOLD.crease) + ')' };
  function foldTo(extra) {
    return Object.assign({ rotationX: 0, autoAlpha: 1, filter: 'brightness(1)', duration: FOLD.duration, stagger: FOLD.stagger, ease: FOLD.ease }, extra);
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

    // desenha no mesmo tick do Lenis/ScrollTrigger: sem atraso entre scroll e frame
    function onUpdate(self) { progress = self.progress; draw(false); }

    if (gsap && ST && !reduceMotion) {
      /* Sequência narrativa: o hero fica fixo (pin) e o scroll (scrub) conduz
         vídeo e textos juntos. Painel 1 sai, painel 2 entra e sai, painel final
         (orçamento) entra e fica um trecho parado antes de liberar a página.
         Rolar para cima reverte tudo. */
      document.documentElement.classList.add('hero-seq');
      gsap.fromTo(splitChars(hero.querySelector('[data-panel="1"] .hero-title')), foldFrom, foldTo({ delay: 0.3 }));
      var parts = function (n) {
        var p = '[data-panel="' + n + '"] ';
        return hero.querySelectorAll(p + '.hero-title > span, ' + p + '.hero-title ~ *');
      };
      var out = { autoAlpha: 0, y: -48, duration: 1, stagger: 0.1, ease: 'power2.in' };
      var from = { autoAlpha: 0, y: 48 };
      var into = { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'power2.out' };
      gsap.timeline({
        defaults: { overwrite: 'auto' },
        scrollTrigger: {
          trigger: hero, pin: true, start: 'top top', end: '+=260%', scrub: true, onUpdate: onUpdate,
          // o hero já tem o botão de orçamento: esconde o WhatsApp flutuante enquanto ele está fixo
          onToggle: function (self) {
            var fab = document.querySelector('.wa-float');
            if (fab) fab.classList.toggle('is-hidden', self.isActive);
          }
        }
      })
        .to(parts(1), out, 1.4)
        .fromTo(parts(2), from, into, 2.7)
        .fromTo(splitChars(hero.querySelector('[data-panel="2"] .hero-title')), foldFrom, foldTo({ duration: 0.6, stagger: 0.03 }), 2.75)
        .to(parts(2), out, 5.2)
        // fotos do celular: leve zoom que assenta ao entrar e cresce ao sair
        .to('[data-panel="1"] .hero-photo img', { scale: 1.1, duration: 1.2, ease: 'power1.in' }, 1.4)
        .fromTo('[data-panel="2"] .hero-photo img', { scale: 1.18 }, { scale: 1, duration: 1.5, ease: 'power2.out' }, 2.7)
        .to('[data-panel="2"] .hero-photo img', { scale: 1.1, duration: 1.2, ease: 'power1.in' }, 5.2)
        .fromTo(parts(3), from, into, 6.5)
        .fromTo(splitChars(hero.querySelector('[data-panel="3"] .hero-title')), foldFrom, foldTo({ duration: 0.6, stagger: 0.03 }), 6.55)
        .to({}, { duration: 1.6 });   // orçamento todo visível antes de soltar a página
    } else if (ST) {
      ST.create({ trigger: hero, start: 'top top', end: 'bottom bottom', onUpdate: onUpdate });
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

  /* ---------- Balão dourado em Celebrações ----------
     Aparece aos poucos embaixo, sobe em zigue-zague acompanhando o scroll e
     some perto do topo da seção. scrub: rolar para cima traz o balão de volta. */
  var balloon = document.querySelector('.balloon');
  if (balloon && gsap && ST && !reduceMotion) {
    var sec = balloon.parentElement;
    var rise = function (f) { return function () { return -sec.offsetHeight * f; }; };
    var step = { duration: 1, ease: 'sine.inOut' };
    gsap.timeline({
      scrollTrigger: { trigger: sec, start: 'top 75%', end: 'bottom 35%', scrub: 1.2, invalidateOnRefresh: true }
    })
      .fromTo(balloon, { autoAlpha: 0, y: 60, x: 0, rotation: -4 },
        { autoAlpha: 1, y: rise(0.14), x: 30, rotation: 5, duration: 1, ease: 'sine.out' })
      .to(balloon, Object.assign({ y: rise(0.32), x: -4, rotation: -5 }, step))
      .to(balloon, Object.assign({ y: rise(0.5), x: 34, rotation: 5 }, step))
      .to(balloon, Object.assign({ y: rise(0.68), x: 0, rotation: -4 }, step))
      .to(balloon, Object.assign({ y: rise(0.86), x: 28, rotation: 4, autoAlpha: 0 }, step));
  }

  if (foldOn) {
    document.querySelectorAll(
      '.section-title h2, .promo-band h2, .promo-gold, .final-cta h2, .final-script, ' +
      '.service-card h3, .celebration-card h3, .venue-card h3, .steps h3, .site-footer h4'
    ).forEach(function (el) {
      gsap.fromTo(splitChars(el), foldFrom, foldTo({
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
      }));
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
