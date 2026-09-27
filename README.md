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
