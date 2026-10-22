# Maria Festinha Ilhabela — Site

Site institucional da **Maria Festinha • WR Recreação** (Ilhabela, SP) — decoração, recreação infantil, casamentos, aniversários, buffet de pizza e espaço para eventos.

Site estático (HTML + CSS + JS puro), sem dependências. Basta abrir `index.html` no navegador ou publicar a pasta em qualquer hospedagem (Vercel, Netlify, GitHub Pages, Hostinger…).

## Estrutura

```
index.html      → página completa
css/style.css   → todo o visual (lilás e dourado)
js/main.js      → brilhos dourados, menu mobile, animações e formulário → WhatsApp
img/logo.webp   → logo (cabeçalho e rodapé); img/favicon.png e apple-touch-icon.png → ícones da aba
img/fotos/      → (coloque aqui as fotos reais)
public/frames/  → 477 frames WebP (1600×900) da animação do hero
public/hero-m.mp4 → vídeo vertical em loop do hero no celular (public/hero-m-poster.webp: 1º quadro)
```

## Como inserir as fotos reais

Cada espaço de foto já aponta para um arquivo. Basta salvar a foto em `img/fotos/` **com o nome exato abaixo** — ela aparece automaticamente no lugar do espaço reservado (se o arquivo não existir, o espaço decorado continua sendo exibido).

Todos os espaços de foto dos cards são **quadrados** (como no Instagram). Salve a foto já quadrada, 900×900: se a original não for quadrada, deixe-a inteira no centro e preencha as sobras com ela mesma desfocada, assim nada fica cortado no site.

As fotos ficam em **WebP**, em dois tamanhos: `nome.webp` (900×900, qualidade 80) e `nome-480.webp` (480×480). O `<img>` tem `srcset` com os dois e o navegador baixa só o que a tela precisa (computador: o de 480; celular de tela densa: o de 900). Foto nova: gere os dois arquivos (por exemplo em squoosh.app) e copie a linha `src`/`srcset`/`sizes` de outro card.

| Seção | Arquivo | Origem no Instagram |
|---|---|---|
| Serviços — Decoração | `img/fotos/servico-decoracao.webp` | post DadP1Ijumnu |
| Serviços — Recreação infantil | `img/fotos/servico-recreacao.webp` | post CU_ZrMwtB59 (castelo inflável) |
| Serviços — Casamentos | `img/fotos/servico-casamentos.webp` | post CtsDSsJufzj, foto 10 |
| Serviços — Aniversários | `img/fotos/servico-aniversarios.webp` | post Dc6sjHCgzOs |
| Serviços — Buffet de Pizza | `img/fotos/servico-buffet-pizza.webp` | post DXV2zymAeeq de @flordelotuspizzariaa (Calabresa Especial) |
| Serviços — Espaço | `img/fotos/servico-espaco.webp` | post Dans_dklnPD, foto 3 |
| Serviços — Infláveis | `img/fotos/servico-inflaveis.webp` | post CdvuVOwO1uk (pula-pula inflável) |
| Serviços — Pipoca e Algodão-doce | `img/fotos/servico-pipoca-algodao-doce.webp` | imagem gerada por IA (`dev-web/output/imagegen/pipoca-e-algodao-doce.png`, 1254→900) |
| Serviços — Decoração Minimalista | `img/fotos/servico-minimalista.webp` | post CkHQ1uuujUP |
| Celebrações — 15 Anos | `img/fotos/celebracao-1.webp` | post fixado DbtH_bLuvBM |
| Celebrações — Chá de Bebê | `img/fotos/celebracao-2.webp` | post fixado DBbcdnxOX5M |
| Celebrações — Chá Revelação | `img/fotos/celebracao-cha-revelacao.webp` | post Ck_zRcsOEsY (legenda “a festa mais procurada e vendida por aqui”) |
| Celebrações — Chá Revelação na Praia | `img/fotos/celebracao-cha-revelacao-praia.webp` | post DHL-4zyOSMq |
| Celebrações — Batizado | `img/fotos/celebracao-batizado.webp` | post C9-S1UcOKsp, foto 1 |
| Celebrações — Decoração Floral | `img/fotos/celebracao-3.webp` | post fixado CkoPRhHOTe9, foto 7 |
| Celebrações — Minimalista | `img/fotos/celebracao-minimalista.webp` | post DeezLPHxnlW (14/10/2026) |
| Celebrações — Bolofofos | `img/fotos/celebracao-bolofofos.webp` | post Ccx39n4OZgv, foto 3 |
| Celebrações — Bob Esponja | `img/fotos/celebracao-bob-esponja.webp` | post CbTARkNO0dw, foto 2 |
| Celebrações — Sereia | `img/fotos/celebracao-sereia.webp` | post Cb_DyzvO4n5 |
| Celebrações — GTA | `img/fotos/celebracao-gta.webp` | post Cb_DaBIuKIO |
| Celebrações — Masha e o Urso | `img/fotos/celebracao-masha.webp` | destaque “Marcha e urso” (story) |
| Destaques — Casamento | `img/fotos/destaque-casamento.webp` | post Cle9N9JOUWx |
| Destaques — Chá de Casa Nova | `img/fotos/destaque-cha-casa-nova.webp` | post ChAtRz0Ow2u, foto 8 |
| Destaques — Aniversários | `img/fotos/destaque-aniversarios.webp` | post DYxG5B3OaO4 |
| Destaques — Flor de Lótus | `img/fotos/destaque-espaco.webp` | post Dans_dklnPD, foto 1 |
| Quem Somos — foto grande | `img/fotos/sobre-mesa.webp` | post fixado CkoPRhHOTe9, foto 5 (original 854×1068, sem corte) |
| Quem Somos — foto menor | `img/fotos/sobre-bolo.webp` | post fixado CkoPRhHOTe9, foto 3 (original 1280×854, sem corte) |
| Avaliações — clientes | `img/fotos/cliente-1.jpg`, `cliente-2.jpg`… | quadrado, 300×300 |

Os títulos das celebrações vêm dos posts e destaques do Instagram citados acima; troque-os em `index.html` se usar outras fotos. O tema futebol já aparece na foto do card “Aniversários” (Serviços), por isso não entrou de novo na galeria. Para ver um post: `instagram.com/p/<código>/`.

## Avaliações

Nenhum depoimento foi inventado. Aparece só o card da Waleska; os cards de teste (Maria Eduarda e João, sem texto) foram tirados. Com um card só, ele fica centralizado e mais largo. Para acrescentar um depoimento real:

1. Copie o `<article class="card testimonial-card">` da Waleska e troque a inicial, as estrelas, o texto do `<blockquote>` e o nome;
2. Se tiver foto, salve em `img/fotos/cliente-X.jpg` e coloque `<img src="img/fotos/cliente-X.jpg" alt="">` dentro do `<figure class="avatar">`, antes da inicial (sem foto aparece a inicial do nome; o `<img>` só entra quando a foto existe, para o navegador não procurar um arquivo que não está lá).

As estrelas ficam douradas; com a classe `is-empty` no `<article>` ficam só no contorno. A frase embaixo da seção leva ao Instagram (o antigo destaque “⭐ Avaliações” não existe mais).

## Contato configurado

- WhatsApp: (12) 99167-4881 — `wa.me/5512991674881`
- Instagram: [@mariafestinhailhabela](https://www.instagram.com/mariafestinhailhabela/)
- Endereço: Av. São Paulo, 1057 – Barra Velha, Ilhabela – SP (rodapé, com link para o Google Maps, e mapa no fim do hero)
- Os botões “Ver no Instagram” dos **Destaques** abrem o post de onde veio a foto de cada card (ver a tabela de fotos acima).

## Google (busca)

- `robots.txt` libera o site todo e aponta para o `sitemap.xml` (que lista a página principal).
- `<link rel="canonical">` no `<head>`: diz ao Google o endereço oficial, para as cópias de teste da Vercel e links com `?fbclid=…` não contarem como sites diferentes.
- Ficha da empresa (dados estruturados `LocalBusiness`, bloco `<script type="application/ld+json">` no `<head>`): nome, endereço, telefone, Instagram, ano de fundação e serviços. Mantenha igual ao que o site mostra. Horário (`openingHoursSpecification`) e cidades atendidas (`areaServed`) ainda não entraram: faltam os dados. Para conferir: search.google.com/test/rich-results.
- Título e descrição falam em “decoração de festas em Ilhabela”, que é o que as pessoas pesquisam.
- Com domínio próprio, troque `maria-festinha.vercel.app` no `<head>`, no `robots.txt` e no `sitemap.xml`.
- Fora do código (precisa da conta Google da empresa): cadastrar o site no Google Search Console e enviar o sitemap; criar/atualizar o Perfil da Empresa no Google com o link do site.

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
- **Assistência de rolagem (snap):** só age depois da troca de foto e letras. Descendo, se a pessoa já passou do ponto em que o painel novo começa a entrar (um pouquinho além dele) e para no meio da entrada, a página completa sozinha até o painel novo inteiro; subindo, o mesmo ao contrário. Antes do ponto de troca nada acontece (um giro da roda não dispara nada). Na roda do mouse o deslize do Lenis é redirecionado no mesmo embalo; no toque, espera o embalo do dedo acabar e desliza em ~0,9 s. Os pontos de troca são os inícios da entrada dos painéis 2 e 3 (`snapPanels(seq, [2.7, 6.5])` em `js/main.js`: se mudar essas posições na timeline, mude ali também); o fim de cada trecho é lido da própria timeline.
- `js/main.js` desenha os frames em um `<canvas>`, no ticker do GSAP logo depois do Lenis (vídeo e textos andam no mesmo quadro do scroll):
  - **Download:** ao abrir, só o começo da Hero inteiro (40 frames), o último e 1 a cada 16: ~68 frames, ~3 MB dos ~21 MB. O resto (1 a cada 8, 4, 2 e todos, do grosso para o fino) começa 4,5 s depois de a página carregar (se a aba estiver visível, sem economia de dados e sem internet 2G) ou antes, assim que a pessoa rola dentro da Hero (`fillAll()`): quem fica uns segundos no site já rola com tudo baixado, e quem abre e sai logo, ou pula a Hero pelo menu, não baixa os ~21 MB. No celular nada disso roda (o fundo é o vídeo). Com parte baixada a animação já anda e vai ficando mais fina sozinha, e o que o scroll vai mostrar em seguida é sempre pedido na hora, com prioridade.
  - **Decodificação:** `createImageBitmap` fora da thread principal, já recortado e no tamanho exato do canvas (desenhar vira uma cópia, sem redimensionar). Só decodifica o caminho entre a posição atual e onde o scroll vai parar (destino do deslize do Lenis; no toque, a velocidade projetada). Rolando rápido pega 1 a cada 2, 4, 8… frames do caminho (a tela só mostra 60 por segundo); ao desacelerar, completa os que faltam. No máximo 40 frames decodificados no computador e 44 no celular.
  - **Desenho:** um frame inteiro por quadro, sem mistura; se o exato ainda não está pronto, mostra o pronto mais perto dele entre o que está na tela e ele (nunca congela esperando, nunca passa do alvo nem volta).
  - **Resolução:** o canvas usa a densidade da tela, mas nunca mais pixels que os frames têm. Quando a resolução muda (modo leve ~2 s após abrir, janela redimensionada, girar a tela), a imagem atual é redesenhada no tamanho novo até o frame certo decodificar: o canvas não pisca preto nem mostra o 1º frame do fundo.
  - **Topo ao abrir:** F5 abre no topo (`scrollRestoration` manual já no `<head>`), mas quem começa a rolar antes do `js/main.js` carregar não é puxado de volta.
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

No celular (até 640px de largura, ou deitado com até 500px de altura) a troca dos painéis do hero é a mesma do computador (rolagem, ScrollTrigger), mas o fundo **não anda com o scroll**: é o vídeo `public/hero-m.mp4` em loop infinito. O motor de frames não roda no celular e os frames do computador não são baixados.

- Vídeo: 608×1080, 30 fps, 14,3 s, H.264 Baseline (toca em qualquer celular, inclusive iPhone antigo), ~1,4 MB (1,6 Mbit/s), com o índice (`moov`) no começo para tocar enquanto baixa. Mudo e `playsinline`: o iPhone só deixa tocar sozinho assim.
- Loop sem emenda: o vídeo saiu dos 473 frames verticais que o hero do celular usava antes (60 frames do vídeo vertical interpolados 8× com o RIFE). O último 1,5 s se dissolve no começo, então o fim já é o 1º quadro e a volta não "pula".
- `public/hero-m-poster.webp` é o 1º quadro: aparece enquanto o vídeo carrega e quando o iPhone está em economia de energia (aí o 1º toque na página inicia o vídeo).
- O `<head>` liga `.hero-vid` com a mesma consulta do `js/main.js`; o `src` do vídeo só entra no celular (o computador não baixa o vídeo). Fora da tela o vídeo pausa. Com "reduzir movimento" fica parado no 1º quadro.
- Com "reduzir movimento" (sem a sequência), a Hero fica presa por uma tela enquanto o resto da página sobe por cima.

Também no celular: menos brilhos animados e sem halo, borda neon sem as camadas desfocadas (fica a linha e a aura), e menos desfoque de fundo no cabeçalho e na barra de diferenciais.

Para refazer o vídeo: grave os frames em sequência num `<canvas>` 608×1080 com `MediaRecorder` (`video/mp4;codecs=avc1.42E01F`, ~1,6 Mbit/s, 30 fps), desenhando por cima, no último 1,5 s, os primeiros frames com opacidade crescente.

## Publicação (Vercel) e cache

`vercel.json` troca `__V__` no `index.html` pelo commit publicado (`?v=<commit>` no CSS e em todos os JS, inclusive os de `js/vendor/`), então cada publicação muda o endereço deles e os navegadores baixam os novos.

- HTML: sempre revalidado (`max-age=0, must-revalidate`).
- `css/` e `js/`: 1 ano em cache, sem revalidar (`immutable`). Por isso todo `<link>`/`<script>` deles precisa do `?v=__V__`.
- `img/`, `fonts/` e `public/`: 7 dias em cache e, depois disso, até 30 dias servindo o guardado enquanto confere a versão nova por trás (`stale-while-revalidate`). Trocar uma foto mantendo o mesmo nome pode levar até 7 dias para aparecer para quem já visitou; para valer na hora, salve com outro nome.
- O `<head>` pede com prioridade alta o fundo do hero (maior elemento da 1ª tela, o LCP): `public/frames/frame-0001.webp` acima de 640px e `public/hero-m-poster.webp` até 640px, a mesma regra do `.hero-sticky` no CSS.

## Segurança

Cabeçalhos mandados pela Vercel em todas as respostas (`vercel.json`):

- `Content-Security-Policy`: o site só carrega script, CSS, imagem, vídeo, fonte e `fetch` dele mesmo; iframe só do Google Maps; nada de `<object>`; ninguém pode exibir o site dentro de um quadro (`frame-ancestors 'none'`); tudo em HTTPS.
- `X-Frame-Options: DENY` (o mesmo bloqueio de quadro, para navegadores antigos), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (sem câmera, microfone, localização, pagamento, USB) e `Cross-Origin-Opener-Policy: same-origin`. O `Strict-Transport-Security` a própria Vercel já manda.

**Scripts escritos dentro do HTML só rodam se a impressão digital (sha256) deles estiver na CSP.** Hoje são dois: o `<script>` do `<head>` (liga `.hero-seq`/`.hero-vid`) e o `onerror="this.hidden=true"` das fotos. A CSP tem o sha256 do script com quebras de linha LF (o que a Vercel serve) e com CRLF (cópia local no Windows). Mudou o texto de um deles, ou criou outro script/`onclick` no HTML? Calcule o novo sha256 e troque no `vercel.json`, senão o navegador bloqueia em silêncio (só aparece no console). Para calcular (Node): `crypto.createHash('sha256').update(textoExatoDoScript, 'utf8').digest('base64')`.

Para testar a CSP antes de publicar, sirva a pasta com os cabeçalhos do `vercel.json` (o `http-server` não aplica) e veja no console se aparece "Refused to ... Content Security Policy". Em teste local por `http`, tire o `upgrade-insecure-requests`, senão o navegador tenta buscar tudo em `https`.

Scan estático: `semgrep --config auto .` (0 achados; o `nosemgrep` no `<link rel="canonical">` é falso positivo: canonical não baixa nada, `integrity` só vale para script/CSS externos).
