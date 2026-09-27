# Maria Festinha Ilhabela — Site

Site institucional da **Maria Festinha • WR Recreação** (Ilhabela, SP) — decoração, recreação, casamentos, aniversários, buffet de pizza e espaço para eventos.

Site estático (HTML + CSS + JS puro), sem dependências. Basta abrir `index.html` no navegador ou publicar a pasta em qualquer hospedagem (Vercel, Netlify, GitHub Pages, Hostinger…).

## Estrutura

```
index.html      → página completa
css/style.css   → todo o visual (lilás e dourado)
js/main.js      → brilhos dourados, menu mobile, animações e formulário → WhatsApp
img/logo.png    → (coloque aqui o logo)
img/fotos/      → (coloque aqui as fotos reais)
public/frames/  → 120 frames WebP (1920×1080) da animação do hero
```

## Como inserir as fotos reais

Cada espaço de foto já aponta para um arquivo. Basta salvar a foto em `img/fotos/` **com o nome exato abaixo** — ela aparece automaticamente no lugar do espaço reservado (se o arquivo não existir, o espaço decorado continua sendo exibido).

| Seção | Arquivo | Formato sugerido |
|---|---|---|
| Logo (cabeçalho e rodapé) | `img/logo.png` | quadrado, 300×300 |
| Serviços — Decoração | `img/fotos/servico-decoracao.jpg` | 1200×750 (16:10) |
| Serviços — Recreação | `img/fotos/servico-recreacao.jpg` | 1200×750 |
| Serviços — Casamentos | `img/fotos/servico-casamentos.jpg` | 1200×750 |
| Serviços — Aniversários | `img/fotos/servico-aniversarios.jpg` | 1200×750 |
| Serviços — Buffet de Pizza | `img/fotos/servico-buffet-pizza.jpg` | 1200×750 |
| Serviços — Espaço | `img/fotos/servico-espaco.jpg` | 1200×750 |
| Celebrações — 15 Anos | `img/fotos/celebracao-1.jpg` | 1200×900 (4:3) |
| Celebrações — Chá de Bebê | `img/fotos/celebracao-2.jpg` | 1200×900 |
| Celebrações — Decoração Floral | `img/fotos/celebracao-3.jpg` | 1200×900 |
| Destaques — Casamento | `img/fotos/destaque-casamento.jpg` | 1200×750 |
| Destaques — Chá de Casa Nova | `img/fotos/destaque-cha-casa-nova.jpg` | 1200×750 |
| Destaques — Aniversários | `img/fotos/destaque-aniversarios.jpg` | 1200×750 |
| Destaques — Nosso Espaço | `img/fotos/destaque-espaco.jpg` | 1200×750 |
| Avaliações — clientes 1 a 3 | `img/fotos/cliente-1.jpg` … `cliente-3.jpg` | quadrado, 300×300 |

Os títulos das celebrações (15 Anos, Chá de Bebê, Decoração Floral) vêm dos posts fixados no Instagram; troque-os em `index.html` se usar outras fotos.

## Avaliações

Nenhum depoimento foi inventado. Os três cards da seção **Avaliações** estão preparados para receber depoimentos reais (ver comentário no `index.html`, acima da seção):

1. Troque o `<p class="quote-ph">…</p>` por `<blockquote>texto do cliente</blockquote>`;
2. Troque “Nome do cliente” pelo nome real;
3. Remova a classe `is-empty` do `<article>` (as estrelas ficam preenchidas).

## Contato configurado

- WhatsApp: (12) 99167-4881 — `wa.me/5512991674881`
- Instagram: [@mariafestinhailhabela](https://www.instagram.com/mariafestinhailhabela/)
- Ilhabela, SP

## Animação do hero

O fundo do hero é o vídeo `HEROV1.mp4` convertido em 120 frames WebP (12 fps, 1920×1080 — resolução original —, qualidade 92, ~15 MB no total) em `public/frames/frame-0001.webp` … `frame-0120.webp`.

- O hero ocupa a tela inteira e fica fixo enquanto se rola 3 alturas de tela (`.hero { height: 300vh }` em `css/style.css`). Durante esse trecho, o scroll avança do primeiro ao último frame. No último frame o hero é liberado e a página segue para “Nossos Serviços”.
- `js/main.js` desenha os frames em um `<canvas>`. Os 12 primeiros são pré-carregados; os demais carregam em lotes após o carregamento da página, e o frame necessário é pedido na hora se o usuário rolar mais rápido.
- Para trocar o vídeo, gere novos frames com o mesmo padrão de nome e ajuste `data-frames` no `<canvas>` do `index.html`:

```bash
ffmpeg -i video.mp4 -an -vf fps=12 -c:v libwebp -quality 92 public/frames/frame-%04d.webp
```

## Scroll suave

Lenis 1.3.26 + GSAP 3.15 / ScrollTrigger, salvos em `js/vendor/` (sem depender de CDN).

- O ticker do GSAP comanda o Lenis, e cada passo do Lenis atualiza o ScrollTrigger: animação do hero e entradas das seções andam no mesmo frame do scroll.
- Intensidade da inércia: `lerp` em `js/main.js` (0.07 ≈ 1,4 s de deslize após soltar a roda; 0.06 ≈ 1,7 s; 0.09 ≈ 1,1 s).
- No toque (celular) o scroll é o nativo do aparelho. Com “reduzir movimento” ativado no sistema, o Lenis não é ligado.
- Links do menu deslizam até a seção respeitando a altura do cabeçalho (`scroll-padding-top`).
