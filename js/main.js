(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  /* ---------- Recarregar (F5) sempre volta ao topo ----------
     Sem isso o navegador restaura a posição anterior e as animações de
     entrada (cabeçalho, hero, títulos) aparecem já terminadas ou pela metade. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  window.scrollTo(0, 0);
  // Safari/iOS às vezes ignora o 'manual': zera também ao sair da página
  window.addEventListener('pagehide', function () { window.scrollTo(0, 0); });

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
    ST.clearScrollMemory('manual');   // ScrollTrigger também não restaura posição
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
    el.classList.add('is-split');
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
    // um só invólucro: em títulos flex (com as linhas laterais) o texto continua quebrando linha
    if (getComputedStyle(el).display.indexOf('flex') !== -1) {
      var inner = document.createElement('span');
      inner.className = 'fold-inner';
      while (el.firstChild) inner.appendChild(el.firstChild);
      el.appendChild(inner);
    }
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
    if (window.innerWidth < 640) total = Math.round(total * 0.35);   // celular: menos brilhos animados
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

  /* ---------- Borda neon nas fotos do hero ----------
     Versão em JS puro do componente "Neon Border" (Originkit), mesmos valores:
     cor #CC9149, espessura 6, arco de 50%, brilho 100, movimento contínuo,
     velocidade 16. Dois arcos opostos percorrem o contorno deslizando de canto
     a canto; cada arco é um conic-gradient recalculado a cada quadro (--arc)
     numa faixa recortada por máscara, mais 3 camadas de brilho desfocado.
     A opacidade do .neon é controlada pela timeline do hero (some na troca). */
  var NEON = { color: '#CC9149', thickness: 2.5, borderSize: 50, glow: 100, speed: 18 };  // linha 2.5px (mais fina); velocidade 18: volta em ~6,7 s
  // A 3ª camada do original (desfoque de 57px, 18%) repintada a cada quadro
  // custava ~35 ms/quadro; virou a aura fixa .neon (box-shadow no CSS).
  var NEON_GLOW = [
    { blur: 8, opacity: 0.5, reach: 0.3 },
    { blur: 15, opacity: 0.3, reach: 0.6 }
  ];
  var NEON_REACH = 14, NEON_SAMPLES = 24;  // brilho mais contido (original: 36)

  function rgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')';
  }
  function perimeterPoint(u, w, h) {
    var d = (((u % 1) + 1) % 1) * 2 * (w + h);
    if (d < w) return [d, 0];
    if (d < w + h) return [w, d - w];
    if (d < w * 2 + h) return [w - (d - w - h), h];
    return [0, h - (d - w * 2 - h)];
  }
  function perimeterAngle(u, w, h) {
    var p = perimeterPoint(u, w, h);
    return Math.atan2(p[0] - w / 2, h / 2 - p[1]) * 180 / Math.PI;
  }
  function cornerLap(k, w, h) {
    var per = 2 * (w + h), at = [0, w / per, (w + h) / per, (w * 2 + h) / per];
    return Math.floor(k / 4) + at[((k % 4) + 4) % 4];
  }
  function buildArc(lap, w, h) {
    var len = NEON.borderSize, span = Math.max(0.015, (len / 100) * 0.5), solid = len / 100;
    var stops = [], base = 0, prev = 0, acc = 0;
    for (var i = 0; i <= NEON_SAMPLES; i++) {
      var f = i / NEON_SAMPLES, ang = perimeterAngle(lap + (f - 0.5) * span, w, h);
      if (i === 0) base = ang;
      else { var d = ang - prev; while (d > 180) d -= 360; while (d < -180) d += 360; acc += d; }
      prev = ang;
      var t = Math.abs(f - 0.5) * 2, k = t <= solid ? 1 : 1 - (t - solid) / (1 - solid);
      stops.push(rgba(NEON.color, k * k * (3 - 2 * k)) + ' ' + acc.toFixed(2) + 'deg');
    }
    stops.push(rgba(NEON.color, 0) + ' ' + acc.toFixed(2) + 'deg', rgba(NEON.color, 0) + ' 360deg');
    return 'conic-gradient(from ' + base.toFixed(2) + 'deg at 50% 50%, ' + stops.join(', ') + ')';
  }
  function bezier(x1, y1, x2, y2) {     // cubic-bezier(.65, 0, .35, 1) do original
    var b = function (a, c, t) { var u = 1 - t; return 3 * u * u * t * a + 3 * u * t * t * c + t * t * t; };
    return function (x) {
      var s = x;
      for (var i = 0; i < 8; i++) {
        var u = 1 - s, dx = 3 * u * u * x1 + 6 * u * s * (x2 - x1) + 3 * s * s * (1 - x2);
        if (Math.abs(dx) < 1e-6) break;
        s = Math.max(0, Math.min(1, s - (b(x1, x2, s) - x) / dx));
      }
      return b(y1, y2, s);
    };
  }
  var glide = bezier(0.65, 0, 0.35, 1);

  function buildNeon(photo) {
    var thick = NEON.thickness, amount = NEON.glow / 100;
    var radius = parseFloat(getComputedStyle(photo).borderTopLeftRadius) || 0;
    var neon = document.createElement('div');
    neon.className = 'neon';
    neon.setAttribute('aria-hidden', 'true');
    var band = function (r, offset) {
      var el = document.createElement('div');
      el.className = 'neon-band';
      el.style.cssText = 'inset:' + (offset - r) + 'px;padding:' + r + 'px;border-radius:' + (radius + r) + 'px';
      return el;
    };
    var groups = [0, 0.5].map(function () {
      var g = document.createElement('div');
      g.className = 'neon-group';
      // celular: só a linha e a aura fixa; as camadas desfocadas repintadas a cada quadro pesam
      if (window.innerWidth > 640) NEON_GLOW.forEach(function (l) {
        var r = thick + amount * NEON_REACH * l.reach;
        var glowOuter = Math.ceil(r + l.blur * 2 + 4);   // área só do tamanho do brilho
        var gl = document.createElement('div');
        gl.className = 'neon-glow';
        gl.style.cssText = 'inset:' + (-glowOuter) + 'px;padding:' + glowOuter + 'px;border-radius:' + (radius + glowOuter) +
          'px;opacity:' + l.opacity + ';filter:blur(' + l.blur + 'px)';
        gl.appendChild(band(r, glowOuter));
        g.appendChild(gl);
      });
      g.appendChild(band(thick, 0));
      g.appendChild(band(thick, 0));
      neon.appendChild(g);
      return g;
    });
    photo.appendChild(neon);
    return { el: neon, photo: photo, groups: groups };
  }

  function runNeons(list) {
    document.documentElement.classList.add('neon-on');
    var cycle = 30 + (4 - 30) * (NEON.speed - 1) / 19;   // segundos por volta
    var beat = cycle / 4, stepT = 0, corner = 0, last = performance.now();
    // tamanho das fotos medido só quando a tela muda, não a cada quadro (0 = foto oculta)
    function measure() {
      list.forEach(function (n) { n.w = n.photo.offsetParent ? n.photo.offsetWidth : 0; n.h = n.photo.offsetHeight; });
    }
    measure();
    window.addEventListener('resize', measure);
    function paint(now) {
      var dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      stepT += dt / beat;
      while (stepT >= 1) { stepT -= 1; corner += 1; }
      list.forEach(function (n) {
        // só desenha foto visível (economiza bateria durante o resto do site)
        // lê só o estilo inline que o GSAP escreve (sem forçar recálculo de layout)
        var op = n.el.style.opacity;
        if (!n.w || (op !== '' && +op < 0.01)) return;
        var w = n.w, h = n.h;
        var from = cornerLap(corner, w, h), to = cornerLap(corner + 1, w, h);
        var lap = from + (to - from) * glide(stepT);
        n.groups[0].style.setProperty('--arc', buildArc(lap, w, h));
        n.groups[1].style.setProperty('--arc', buildArc(lap + 0.5, w, h));
      });
      requestAnimationFrame(paint);
    }
    requestAnimationFrame(paint);
  }

  /* ---------- Hero: frames do vídeo controlados pelo scroll ---------- */
  (function () {
    var hero = document.getElementById('hero');
    var canvas = hero && hero.querySelector('.hero-canvas');
    if (!canvas) return;

    // no celular em pé só a faixa central do vídeo aparece: usa os frames recortados
    // celular em pé ou deitado (tela baixa): frames leves
    var mobile = window.matchMedia('(max-width: 640px), (orientation: landscape) and (max-height: 500px)').matches;
    var total = parseInt(canvas.getAttribute(mobile ? 'data-frames-m' : 'data-frames'), 10);
    var base = canvas.getAttribute(mobile ? 'data-src-m' : 'data-src');
    // canvas opaco (sem mistura com o fundo) e sem esperar o compositor: desenho mais barato
    var ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    var frames = new Array(total);
    // celular: 60 frames leves (~1 MB) -> baixa e decodifica todos logo de cara;
    // computador: 12 na hora e o resto em lotes depois do carregamento
    var PRELOAD = mobile ? total : 12;
    var BATCH = 8;

    /* Motor de reprodução
       - O scroll só define o ALVO (target, 0..1); não desenha nada.
       - Um laço requestAnimationFrame aproxima a posição mostrada (pos, em
         frames e fracionária) do alvo com amortecimento exponencial
         independente da taxa de quadros.
       - Em posições fracionárias o canvas mistura o frame atual com o próximo
         (globalAlpha), então avançar 1 ou 2 frames vira uma transição contínua
         em vez de um salto.
       - O laço para sozinho quando alcança o alvo: parado, não desenha nada. */
    var TAU = mobile ? 0.11 : 0.05;   // s; no celular o scroll nativo chega aos saltos, suaviza mais
    var target = 0, pos = 0, shown = -1;
    var running = false, dirty = true, last = 0, painted = false;
    var cw = 0, ch = 0, fit = null;

    function src(i) { return base + String(i + 1).padStart(4, '0') + '.webp'; }

    function load(i) {
      if (i < 0 || i >= total || frames[i]) return;
      var img = new Image();
      img.decoding = 'async';
      img.src = src(i);
      // decodifica antes de usar: o drawImage não trava decodificando o WebP
      var done = function () { if (img.ready) return; img.ready = true; dirty = true; kick(); };
      // decode() às vezes rejeita no Safari/iOS; nesse caso usa o load normal
      img.decode().then(done, function () { if (img.complete && img.naturalWidth) done(); else img.onload = done; });
      frames[i] = img;
    }

    function ready(i) { return i >= 0 && i < total && frames[i] && frames[i].ready; }
    function nearestReady(i) {
      for (var d = 0; d < total; d++) {
        if (ready(i - d)) return i - d;
        if (ready(i + d)) return i + d;
      }
      return -1;
    }

    // equivalente a object-fit: cover, calculado uma vez por tamanho de canvas
    function cover(img) {
      if (!fit || fit.nw !== img.naturalWidth) {
        var sc = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
        fit = { nw: img.naturalWidth, w: img.naturalWidth * sc, h: img.naturalHeight * sc };
        fit.x = (cw - fit.w) / 2; fit.y = (ch - fit.h) / 2;
      }
      return fit;
    }

    function paint(p) {
      var a = Math.floor(p), t = p - a;
      var ia = ready(a) ? a : nearestReady(a);
      if (ia < 0) return false;
      var f = cover(frames[ia]);
      ctx.globalAlpha = 1;
      ctx.drawImage(frames[ia], f.x, f.y, f.w, f.h);
      // mistura com o próximo frame proporcional à fração: sem "pulo" entre frames
      if (ia === a && t > 0.02 && ready(a + 1)) {
        ctx.globalAlpha = t;
        ctx.drawImage(frames[a + 1], f.x, f.y, f.w, f.h);
        ctx.globalAlpha = 1;
      }
      if (!painted) { painted = true; canvas.style.opacity = 1; }
      return true;
    }

    function tick(now) {
      var dt = Math.min(0.1, Math.max(0.001, (now - last) / 1000));
      last = now;
      var goal = target * (total - 1);
      pos += (goal - pos) * (1 - Math.exp(-dt / TAU));
      if (Math.abs(goal - pos) < 0.003) pos = goal;
      // garante os vizinhos carregados (no computador, se o usuário rolar rápido)
      var i = Math.round(pos);
      for (var k = -2; k <= 3; k++) load(i + k);
      if ((dirty || Math.abs(pos - shown) > 0.002) && paint(pos)) { shown = pos; dirty = false; }
      if (pos !== goal || dirty) requestAnimationFrame(tick);
      else running = false;
    }

    function kick() {
      if (running || !cw) return;
      running = true;
      last = performance.now();
      requestAnimationFrame(tick);
    }

    function setProgress(p) { target = p; kick(); }

    function resize() {
      // DPR limitado: no celular 1.5 (os frames têm 608px de largura; mais que isso
      // só gastaria memória e tempo de desenho), no computador 2
      var dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      var w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (w === canvas.width && h === canvas.height && cw) return;
      canvas.width = cw = w;
      canvas.height = ch = h;
      fit = null;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = mobile ? 'medium' : 'high';  // redefinido após mudar o tamanho
      dirty = true;
      kick();
    }

    // sem GSAP (falha ao carregar): calcula o progresso pelo scroll nativo
    function onScroll() {
      var range = hero.offsetHeight - window.innerHeight;
      setProgress(range > 0 ? Math.min(1, Math.max(0, (window.scrollY - hero.offsetTop) / range)) : 0);
    }

    // carrega o restante aos poucos, sem travar a página
    var next = PRELOAD;
    function loadRest() {
      for (var n = 0; n < BATCH && next < total; n++) load(next++);
      if (next < total) setTimeout(loadRest, 120);
    }

    canvas.style.opacity = 0;   // até o 1º frame: mostra o fundo do CSS (evita flash preto do canvas opaco)
    for (var i = 0; i < PRELOAD; i++) load(i);

    // desenha no mesmo tick do Lenis/ScrollTrigger: sem atraso entre scroll e frame
    // mapa do painel final: só carrega quando a sequência se aproxima dele
    var mapFrame = hero.querySelector('.hero-map iframe');
    function loadMap() { if (mapFrame && !mapFrame.src) mapFrame.src = mapFrame.getAttribute('data-src'); }
    function onUpdate(self) { setProgress(self.progress); if (self.progress > 0.4) loadMap(); }

    if (gsap && ST && !reduceMotion) {
      /* Sequência narrativa: o hero fica fixo (pin) e o scroll (scrub) conduz
         vídeo e textos juntos. Painel 1 sai, painel 2 entra e sai, painel final
         (orçamento) entra e fica um trecho parado antes de liberar a página.
         Rolar para cima reverte tudo. */
      document.documentElement.classList.add('hero-seq');
      var neon1 = buildNeon(hero.querySelector('[data-panel="1"] .hero-photo'));
      var neon2 = buildNeon(hero.querySelector('[data-panel="2"] .hero-photo'));
      var neon3 = buildNeon(hero.querySelector('.hero-map'));
      runNeons([neon1, neon2, neon3]);
      gsap.fromTo(splitChars(hero.querySelector('[data-panel="1"] .hero-title')), foldFrom, foldTo({ delay: 0.3, clearProps: 'transform,filter' }));
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
          // celular: scroll nativo chega aos saltos -> scrub com 0,4 s de suavização
          // (casa com o amortecimento do canvas); computador: o Lenis já suaviza
          trigger: hero, pin: true, start: 'top top', end: '+=260%', scrub: mobile ? 0.4 : true, onUpdate: onUpdate,
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
        // neon: enfraquece enquanto a foto sai e ganha força quando a nova chega
        .to(neon1.el, { opacity: 0, duration: 0.8, ease: 'power2.in' }, 1.3)
        .fromTo(neon2.el, { opacity: 0 }, { opacity: 1, duration: 1.3, ease: 'power2.in' }, 3.0)
        .to(neon2.el, { opacity: 0, duration: 0.8, ease: 'power2.in' }, 5.1)
        .fromTo(parts(3), from, into, 6.5)
        // mapa do painel final: mesmo zoom de entrada e neon das fotos
        .fromTo('.hero-map iframe', { scale: 1.18 }, { scale: 1, duration: 1.5, ease: 'power2.out' }, 6.5)
        .fromTo(neon3.el, { opacity: 0 }, { opacity: 1, duration: 1.3, ease: 'power2.in' }, 6.8)
        .fromTo(splitChars(hero.querySelector('[data-panel="3"] .hero-title')), foldFrom, foldTo({ duration: 0.6, stagger: 0.03 }), 6.55)
        .to({}, { duration: 1.6 });   // orçamento todo visível antes de soltar a página
    } else if (ST) {
      loadMap();   // sem a sequência, o painel final aparece desde o início
      ST.create({ trigger: hero, start: 'top top', end: 'bottom bottom', onUpdate: onUpdate });
    } else {
      loadMap();
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

  /* ---------- Entrada do cabeçalho e da barra de diferenciais ----------
     Ao abrir o site, a barra do cabeçalho e a barra de diferenciais do hero
     desdobram a partir da borda de cima, e os textos delas desdobram letra a
     letra com o mesmo efeito dos títulos. */
  if (foldOn) {
    var bars = [document.querySelector('.header-bar'), document.querySelector('.feature-bar')];
    var barFrom = { rotationX: -70, transformPerspective: 900, transformOrigin: '50% 0%', autoAlpha: 0, filter: 'brightness(' + (1 - FOLD.crease) + ')' };
    var barTo = { rotationX: 0, autoAlpha: 1, filter: 'brightness(1)', duration: 0.9, ease: FOLD.ease, clearProps: 'transform,filter' };
    gsap.fromTo(bars[0], barFrom, Object.assign({ delay: 0.05 }, barTo));
    gsap.fromTo(bars[1], barFrom, Object.assign({ delay: 0.45 }, barTo));
    var charsOf = function (sel) {
      var list = [];
      document.querySelectorAll(sel).forEach(function (el) { list.push.apply(list, splitChars(el)); });
      return list;
    };
    gsap.fromTo(document.querySelectorAll('.header-bar .brand-logo, .menu-toggle'),
      { autoAlpha: 0, scale: 0.6, rotation: -12, transition: 'none' },   // sem a transição de hover do CSS no meio
      { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.8, delay: 0.25, ease: 'back.out(1.7)', clearProps: 'transform,transition' });
    gsap.fromTo(charsOf('.main-nav a, .header-cta'), foldFrom,
      foldTo({ delay: 0.3, stagger: 0.012, clearProps: 'transform,filter' }));
    gsap.fromTo(charsOf('.feature-bar strong, .feature-bar span'), foldFrom,
      foldTo({ delay: 0.7, stagger: 0.012, clearProps: 'transform,filter' }));
  }

  if (foldOn) {
    document.querySelectorAll(
      '.section-title h2, .promo-band h2, .promo-gold, .final-cta h2, .final-script, ' +
      '.service-card h3, .celebration-card h3, .venue-card h3, .steps h3, .site-footer h4'
    ).forEach(function (el) {
      gsap.fromTo(splitChars(el), foldFrom, foldTo({
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        clearProps: 'transform,filter'
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
