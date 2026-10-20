# Maria Festinha Ilhabela — Site

Site institucional da **Maria Festinha • WR Recreação** (Ilhabela, SP) — decoração, recreação, casamentos, aniversários, buffet de pizza e espaço para eventos.

Site estático (HTML + CSS + JS puro), sem dependências. Basta abrir `index.html` no navegador ou publicar a pasta em qualquer hospedagem (Vercel, Netlify, GitHub Pages, Hostinger…).

## Estrutura

```
index.html      → página completa
css/style.css   → todo o visual (lilás e dourado)
js/main.js      → brilhos dourados, menu mobile, animações e formulário → WhatsApp
img/logo.webp   → logo (cabeçalho e rodapé); img/favicon.png e apple-touch-icon.png → ícones da aba
img/fotos/      → (coloque aqui as fotos reais)
public/frames/  → 477 frames WebP (1600×900) da animação do hero
public/frames-m/ → 473 frames WebP (608×1080, vídeo vertical) usados no celular
```

## Como inserir as fotos reais

Cada espaço de foto já aponta para um arquivo. Basta salvar a foto em `img/fotos/` **com o nome exato abaixo** — ela aparece automaticamente no lugar do espaço reservado (se o arquivo não existir, o espaço decorado continua sendo exibido).

Todos os espaços de foto dos cards são **quadrados** (como no Instagram). Salve a foto já quadrada, 900×900: se a original não for quadrada, deixe-a inteira no centro e preencha as sobras com ela mesma desfocada, assim nada fica cortado no site.

| Seção | Arquivo | Origem no Instagram |
|---|---|---|
| Serviços — Decoração | `img/fotos/servico-decoracao.jpg` | post DadP1Ijumnu |
| Serviços — Recreação | `img/fotos/servico-recreacao.jpg` | post CU_ZrMwtB59 (castelo inflável) |
| Serviços — Casamentos | `img/fotos/servico-casamentos.jpg` | post CtsDSsJufzj, foto 10 |
| Serviços — Aniversários | `img/fotos/servico-aniversarios.jpg` | post Dc6sjHCgzOs |
| Serviços — Buffet de Pizza | `img/fotos/servico-buffet-pizza.jpg` | post DXV2zymAeeq de @flordelotuspizzariaa (Calabresa Especial) |
| Serviços — Espaço | `img/fotos/servico-espaco.jpg` | post Dans_dklnPD, foto 3 |
| Celebrações — 15 Anos | `img/fotos/celebracao-1.jpg` | post fixado DbtH_bLuvBM |
| Celebrações — Chá de Bebê | `img/fotos/celebracao-2.jpg` | post fixado DBbcdnxOX5M |
| Celebrações — Decoração Floral | `img/fotos/celebracao-3.jpg` | post fixado CkoPRhHOTe9, foto 7 |
| Destaques — Casamento | `img/fotos/destaque-casamento.jpg` | post Cle9N9JOUWx |
| Destaques — Chá de Casa Nova | `img/fotos/destaque-cha-casa-nova.jpg` | post ChAtRz0Ow2u, foto 8 |
| Destaques — Aniversários | `img/fotos/destaque-aniversarios.jpg` | post DYxG5B3OaO4 |
| Destaques — Nosso Espaço | `img/fotos/destaque-espaco.jpg` | post Dans_dklnPD, foto 1 |
| Avaliações — clientes 1 a 3 | `img/fotos/cliente-1.jpg` … `cliente-3.jpg` | quadrado, 300×300 |

Os títulos das celebrações (15 Anos, Chá de Bebê, Decoração Floral) vêm dos posts fixados no Instagram; troque-os em `index.html` se usar outras fotos. Para ver um post: `instagram.com/p/<código>/`.

## Avaliações

Nenhum depoimento foi inventado. Os três cards da seção **Avaliações** estão preparados para receber depoimentos reais (ver comentário no `index.html`, acima da seção):

1. Troque o `<p class="quote-ph">…</p>` por `<blockquote>texto do cliente</blockquote>`;
2. Troque “Nome do cliente” pelo nome real;
3. Remova a classe `is-empty` do `<article>` (as estrelas ficam preenchidas).

## Contato configurado

- WhatsApp: (12) 99167-4881 — `wa.me/5512991674881`
- Instagram: [@mariafestinhailhabela](https://www.instagram.com/mariafestinhailhabela/)
- Ilhabela, SP

## Prévia do link (WhatsApp, Instagram, Facebook)

Quando alguém compartilha o site, aparece o card montado pelas tags `og:*` no `<head>` do `index.html`, com a imagem `img/og-image.jpg` (1200×630, logo no centro entre fotos de mesas decoradas; o WhatsApp recorta o quadrado do meio na miniatura pequena, por isso logo e texto ficam no centro). Mantenha a imagem abaixo de ~300 KB, senão o WhatsApp não mostra a foto.

- Os endereços das tags são completos (`https://maria-festinha.vercel.app/...`): com domínio próprio, troque nas tags.
- WhatsApp e Facebook guardam a prévia por alguns dias. Para trocar a imagem, salve com outro nome (ex.: `og-image-2.jpg`) e atualize a tag; no Facebook dá para forçar em developers.facebook.com/tools/debug.

## Animação do hero

O fundo do hero é o vídeo `HEROV1.mp4` convertido em frames WebP em `public/frames/frame-0001.webp` … `frame-0477.webp` (1600×900, qualidade 75, ~21 MB no total; ampliado para 1920 fica praticamente igual ao original).

Os frames originais eram 120 (12 fps) no computador e 60 no celular; com tão poucos, cada frame cobria um trecho grande de rolagem e o vídeo andava "aos pulos". Misturar dois frames vizinhos para disfarçar não funciona: as pétalas viram duas cópias meio transparentes e parecem sumir. Os frames foram interpolados com o RIFE (rife-ncnn-vulkan, modelo v4.6), que cria os frames do meio com o movimento de verdade: 4× no computador (477) e 8× no celular (473). Cada frame cobre ~4–5 px de rolagem e o canvas mostra sempre um frame inteiro, sem mistura.

- O hero ocupa a tela inteira e fica fixo por CSS (`position: sticky`) por 2,6 alturas de tela (`.hero-seq .hero { height: calc(100lvh + 260vh) }` em `css/style.css`). O GSAP ScrollTrigger não usa `pin` de propósito: o pin move a Hero no DOM a cada recálculo e isso recarregava o Google Maps. Nesse trecho, o scroll (`scrub`) avança do primeiro ao último frame do vídeo e conduz a sequência de textos:
  1. “Sua Festa. Seu Sonho.”
  2. “Momentos que Encantam.”
  3. “Sua Festa Começa Aqui.” com o botão “Pedir Orçamento” (painel final), que fica um trecho parado antes de a página seguir para “Nossos Serviços”.
  Rolar para cima reverte tudo. Sem JavaScript ou com “reduzir movimento”, aparece só o painel final.
- **Assistência de rolagem (snap):** se a pessoa para de rolar no meio de uma troca de painel (letras e foto pela metade), a página desliza sozinha até o painel completo mais próximo — segue na direção em que ela vinha se a troca já passou de 20%, senão volta. Na roda do mouse o deslize do Lenis é redirecionado no mesmo embalo; no toque, espera o embalo do dedo acabar e desliza em ~0,9 s. Os trechos de troca são lidos da própria timeline (`snapPanels` em `js/main.js`), então mudar tempos/stagger dos textos não quebra a assistência.
- `js/main.js` desenha os frames em um `<canvas>`, no ticker do GSAP logo depois do Lenis (vídeo e textos andam no mesmo quadro do scroll):
  - **Download:** todos os WebP baixam logo, comprimidos, do grosso para o fino (o começo da Hero inteiro, depois 1 a cada 16, 8, 4, 2 e o resto). Com parte baixada a animação já anda e vai ficando mais fina sozinha.
  - **Decodificação:** `createImageBitmap` fora da thread principal, já recortado e no tamanho exato do canvas (desenhar vira uma cópia, sem redimensionar). Só decodifica o caminho entre a posição atual e onde o scroll vai parar (destino do deslize do Lenis; no toque, a velocidade projetada). Rolando rápido pega 1 a cada 2, 4, 8… frames do caminho (a tela só mostra 60 por segundo); ao desacelerar, completa os que faltam. No máximo 40 frames decodificados no computador e 44 no celular.
  - **Desenho:** um frame inteiro por quadro, sem mistura; se o exato ainda não está pronto, mostra o pronto mais próximo (nunca congela esperando).
  - **Resolução:** o canvas usa a densidade da tela, mas nunca mais pixels que os frames têm.
- Para trocar o vídeo, gere novos frames com o mesmo padrão de nome e ajuste `data-frames` (e `data-size`, se mudar o tamanho) no `<canvas>` do `index.html`. Tire os frames a 12 fps e interpole 4× com o RIFE (ou tire a 48 fps direto do vídeo, se ele tiver):

```bash
ffmpeg -i video.mp4 -an -vf fps=12 frames-png/%04d.png
rife-ncnn-vulkan -i frames-png -o interp -m rife-v4.6 -n <4× o número de frames> -f %04d.png
# descarte os últimos PNGs repetidos (4×(n-1)+1 ficam) e converta para WebP 1600×900, qualidade 75
```

## Scroll suave

Lenis 1.3.26 + GSAP 3.15 / ScrollTrigger, salvos em `js/vendor/` (sem depender de CDN).

- O ticker do GSAP comanda o Lenis, e cada passo do Lenis atualiza o ScrollTrigger: animação do hero e entradas das seções andam no mesmo frame do scroll.
- Intensidade da inércia: `lerp` em `js/main.js` (0.07 ≈ 1,4 s de deslize após soltar a roda; 0.06 ≈ 1,7 s; 0.09 ≈ 1,1 s).
- No toque (celular) o scroll é o nativo do aparelho. Com “reduzir movimento” ativado no sistema, o Lenis não é ligado.
- Links do menu deslizam até a seção respeitando a altura do cabeçalho (`scroll-padding-top`).

## “Sua festa em 4 passos” acendendo

Amarrado ao scroll (`scrub`), em `js/main.js`: no computador um feixe dourado corre pela linha pontilhada com um ponto de luz na ponta; ao chegar em cada passo, o anel do círculo carrega (com um ponto de luz girando), o ícone acende com halo, o texto aparece e um lampejo se abre em volta. Até 960px (2 colunas, sem linha) os anéis carregam em sequência. Os elementos de luz são criados pelo JS (sem JS ou com “reduzir movimento”, fica o desenho estático); visual em `css/style.css` (`.step-ring`, `.step-dot`, `.step-glow`, `.step-burst`, `.steps-track`).

## Celular leve

No celular (até 640px) o hero usa `public/frames-m/`: um vídeo vertical próprio em 608×1080 (o canvas do celular não passa de ~600 px de largura; frames maiores só gastam memória e travam o iPhone). Eram 60 frames, com muito movimento entre um e outro (as pétalas andavam 30–60 px); interpolados 8× com o RIFE viraram 473, qualidade 70 — ~11,6 MB no total, contra ~21 MB dos frames do computador. A página em si (sem os frames) fica em ~1,7 MB no celular. Também no celular: menos brilhos animados e sem halo, borda neon sem as camadas desfocadas (fica a linha e a aura), e menos desfoque de fundo no cabeçalho e na barra de diferenciais.

Para regenerar os frames do celular: tire os frames em 608×1080 e interpole 8× com o RIFE (`-n <8× o número de frames>`), descartando os últimos PNGs repetidos (ficam 8×(n-1)+1); converta para WebP qualidade 70.

## Publicação (Vercel) e cache

`vercel.json` troca `__V__` no `index.html` pelo commit publicado (`?v=<commit>` no CSS e no JS), então cada publicação obriga os navegadores a baixar o CSS/JS novos. O HTML, o CSS e o JS são sempre revalidados (`max-age=0, must-revalidate`); os frames em `public/` ficam 1 dia em cache.
