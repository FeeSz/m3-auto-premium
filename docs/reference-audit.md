# Auditoria da referência — M3 Auto Premium

Data: 2026-09-15. Fase A executada antes de alterações à interface.

Fontes: https://car-dealership.framer.website/ e https://www.framer.com/marketplace/templates/car-dealer/. Navegador real: Microsoft Edge via Playwright, contexto novo sem credenciais, deviceScaleFactor 1. Nenhum formulário da referência foi enviado.

## Método e limites

OBSERVED = DOM, getComputedStyle ou captura renderizada. INFERRED = aproximação explicitada. Capturas após percorrer a página para acionar reveals. Os JSON guardam tipografia, retângulos, campos, imagens, fontes carregadas e regras @media/@font-face. Captura inicial sem scroll apresentou seções vazias; foi substituída nas evidências principais por captura após scroll.

- Todas as famílias de rotas foram navegadas em 1440, 1280, 768 e 390 px, altura 1000 px.
- Home adicional em 375, 430, 1024 e 1920 px. Menu em 390×844.
- Oito registros de veículos e quatro artigos foram navegados; registros adicionais documentados em extra-audit.json. Duas páginas de artigo e um veículo receberam a matriz completa.
- Link de remix descoberto: https://framer.com/remix/uKV4MVKCNtphF6a3ZljL. Não foi possível inspecionar o editor pelo acesso público; nenhum projeto Framer foi duplicado.
- Duração exata e curvas das animações JS não puderam ser extraídas pelo computed style. Valores de reprodução serão INFERRED, sujeitos à comparação visual.

## Composição e comportamento

OBSERVED: header fixo, 70 px, wrapper z-index 3; conteúdo centralizado até 1480 px. Hero Home full-bleed com margem 8 px, raio 16 px, imagem cover centralizada, overlay preto 50%. Texto desktop em x=40/y=102; busca superior direita; texto e CTA inferiores à esquerda; métricas empilhadas inferiores à direita. Mobile reposiciona descrição e CTA abaixo do título, métricas inferiores à esquerda e esconde busca.

OBSERVED: Home em ordem hero → destaques (3 cards) → serviços (texto e mosaico de 5 slots) → depoimentos e métricas escalonadas → equipe (2 retratos com alturas diferentes) → blog (texto e 2 cards) → CTA fotográfico → FAQ → footer. Intervalo principal desktop 144 px, tablet 128 px, mobile 96 px.

OBSERVED: Inventory apresenta hero claro de 800 px incluindo header, grande área vazia intencional, filtros laterais de 250 px, gap 80 px até grid de duas colunas, tabs de carroceria. Campos nativos de marca, condição, ano e km; controles de preço.

OBSERVED: veículo em duas colunas no topo (texto 486 px e imagem 810×387 em 1440); galeria inferior de 648×500 e ficha de especificações; CTA fotográfico e relacionados em três colunas. Carrossel, indicadores e cópia de identificadores presentes.

OBSERVED: Trade-in e Financing compartilham hero claro, passos em três colunas, argumentos em grade, painel de formulário de duas colunas, FAQ e footer. About usa hero claro, manifesto, métricas e equipe em grade. Contact tem texto à esquerda e formulário à direita desde o topo, seguido por mapa/showroom e FAQ. Blog tem hero claro e grade de artigos. Artigo e legal usam coluna de título à esquerda e conteúdo à direita.

OBSERVED: menu mobile ocupa a tela, links centralizados empilhados, ícones de mapa/telefone e CTA. FAQ expande resposta no clique. Header permanece no topo durante scroll. Cards possuem setas em recortes de canto, hover e transições de imagem. Seções usam fade/translate no aparecimento.

## Identidade e dados

Usuário confirmou WhatsApp (11) 93005-5771 e Rua Manoel de Castilho, 404 — Itaim Paulista, São Paulo/SP. Confirmou autorização do template e fotografias. Origem individual em asset-manifest.json. Não se transferem estatísticas, nomes de equipe, depoimentos ou reputação Google do template à M3. Slots comerciais sem dados serão identificados; inventário será demonstração centralizada até receber fichas reais.

## Matriz medida

| Rota | Largura | Altura total | H1 | Overflow documento |
|---|---:|---:|---:|---|
| /about-us | 1280 | 5217 | 56px | não |
| /about-us | 1440 | 5274 | 56px | não |
| /about-us | 390 | 8315 | 40px | não |
| /about-us | 768 | 7960 | 40px | não |
| /blog | 1280 | 2543 | 56px | não |
| /blog | 1440 | 2567 | 56px | não |
| /blog | 390 | 3277 | 40px | não |
| /blog | 768 | 3200 | 40px | não |
| /blog/leasing-vs-buying-a-luxury-car-which-is-right-for-you-in-2024 | 1280 | 6108 | 56px | não |
| /blog/leasing-vs-buying-a-luxury-car-which-is-right-for-you-in-2024 | 1440 | 6133 | 56px | não |
| /blog/leasing-vs-buying-a-luxury-car-which-is-right-for-you-in-2024 | 390 | 7805 | 40px | não |
| /blog/leasing-vs-buying-a-luxury-car-which-is-right-for-you-in-2024 | 768 | 6893 | 40px | não |
| /blog/the-new-lamborghini-urus-performante-has-arrived%E2%80%94and-it-s-everything-we-hoped-for | 1280 | 5660 | 56px | não |
| /blog/the-new-lamborghini-urus-performante-has-arrived%E2%80%94and-it-s-everything-we-hoped-for | 1440 | 5684 | 56px | não |
| /blog/the-new-lamborghini-urus-performante-has-arrived%E2%80%94and-it-s-everything-we-hoped-for | 390 | 7436 | 40px | não |
| /blog/the-new-lamborghini-urus-performante-has-arrived%E2%80%94and-it-s-everything-we-hoped-for | 768 | 6420 | 40px | não |
| /contact | 1280 | 2619 | 56px | não |
| /contact | 1440 | 2643 | 56px | não |
| /contact | 390 | 4141 | 40px | não |
| /contact | 768 | 3848 | 40px | não |
| /financing | 1280 | 4459 | 56px | não |
| /financing | 1440 | 4483 | 56px | não |
| /financing | 390 | 6072 | 40px | não |
| /financing | 768 | 5598 | 40px | não |
| / | 1280 | 6494 | 56px | não |
| / | 1440 | 6519 | 56px | não |
| / | 390 | 10539 | 40px | não |
| / | 768 | 10202 | 40px | não |
| /inventory | 1280 | 4078 | 56px | não |
| /inventory | 1440 | 4103 | 56px | não |
| /inventory | 390 | 6043 | 40px | não |
| /inventory | 768 | 5942 | 40px | não |
| /inventory/krynox-zr_9 | 1280 | 3576 | 56px | não |
| /inventory/krynox-zr_9 | 1440 | 3577 | 56px | não |
| /inventory/krynox-zr_9 | 390 | 5083 | 40px | não |
| /inventory/krynox-zr_9 | 768 | 4974 | 40px | não |
| /legal-pages/cookie-policy | 1280 | 4650 | 56px | não |
| /legal-pages/cookie-policy | 1440 | 4675 | 56px | não |
| /legal-pages/cookie-policy | 390 | 5521 | 40px | não |
| /legal-pages/cookie-policy | 768 | 4956 | 40px | não |
| /legal-pages/privacy-policy | 1280 | 7346 | 56px | não |
| /legal-pages/privacy-policy | 1440 | 7371 | 56px | não |
| /legal-pages/privacy-policy | 390 | 8937 | 40px | não |
| /legal-pages/privacy-policy | 768 | 7652 | 40px | não |
| /legal-pages/terms-conditions | 1280 | 9240 | 56px | não |
| /legal-pages/terms-conditions | 1440 | 9264 | 56px | não |
| /legal-pages/terms-conditions | 390 | 11358 | 40px | não |
| /legal-pages/terms-conditions | 768 | 9546 | 40px | não |
| /not-a-real-page | 1280 | 1663 | 56px | não |
| /not-a-real-page | 1440 | 1687 | 56px | não |
| /not-a-real-page | 390 | 1885 | 40px | não |
| /not-a-real-page | 768 | 1848 | 40px | não |
| /trade-in | 1280 | 4725 | 56px | não |
| /trade-in | 1440 | 4749 | 56px | não |
| /trade-in | 390 | 6428 | 40px | não |
| /trade-in | 768 | 5952 | 40px | não |

## Auditoria por página

### /about-us

OBSERVED: We're the #1 Luxury Car Dealership in Washington → A Dealership Built on a Philosophy → A team of expert, tailored for you. → We're Way More Than a Dealership → Everything You Need Here → Ready to test your dream car?.

- H1: caixa (32, 104, 550, 168), 56px/56px, peso 700.
- H2: caixa (32, 1000, 1376, 53), 48px/52.8px, peso 700.
- H2: caixa (760, 1836, 648, 106), 48px/52.8px, peso 700.
- H2: caixa (26, 3316, 480, 106), 48px/52.8px, peso 700.
- H2: caixa (32, 4112, 432, 106), 48px/52.8px, peso 700.
- H2: caixa (40, 4627, 711, 53), 48px/52.8px, peso 700.

Controles: nenhum campo visível.

Evidências: [screenshot](../output/playwright/reference/about-us-1440.png) · [medidas](../output/playwright/reference/about-us-1440.json).

### /blog

OBSERVED: Insights, Updates, and the Stories Behind the Cars. → Ready to test your dream car?.

- H1: caixa (32, 104, 550, 168), 56px/56px, peso 700.
- H2: caixa (40, 1920, 711, 53), 48px/52.8px, peso 700.

Controles: nenhum campo visível.

Evidências: [screenshot](../output/playwright/reference/blog-1440.png) · [medidas](../output/playwright/reference/blog-1440.json).

### /blog/leasing-vs-buying-a-luxury-car-which-is-right-for-you-in-2024

OBSERVED: Leasing vs Buying a Luxury Car: Which Is Right for You in 2024? → Other Post You May Like → Ready to Experience Your Dream Car? → Ready to test your dream car?.

- H1: caixa (32, 142, 550, 224), 56px/56px, peso 700.
- H2: caixa (32, 4159, 550, 53), 48px/52.8px, peso 700.
- H2: caixa (480, 4930, 480, 106), 48px/52.8px, peso 700.
- H2: caixa (40, 5485, 711, 53), 48px/52.8px, peso 700.

Controles: nenhum campo visível.

Evidências: [screenshot](../output/playwright/reference/blog_leasing-vs-buying-a-luxury-car-which-is-right-for-you-in-2024-1440.png) · [medidas](../output/playwright/reference/blog_leasing-vs-buying-a-luxury-car-which-is-right-for-you-in-2024-1440.json).

### /blog/the-new-lamborghini-urus-performante-has-arrived%E2%80%94and-it-s-everything-we-hoped-for

OBSERVED: The New Lamborghini Urus Performante Has Arrived—And It's Everything We Hoped For → Other Post You May Like → Ready to Experience Your Dream Car? → Ready to test your dream car?.

- H1: caixa (32, 142, 550, 280), 56px/56px, peso 700.
- H2: caixa (32, 3710, 550, 53), 48px/52.8px, peso 700.
- H2: caixa (480, 4481, 480, 106), 48px/52.8px, peso 700.
- H2: caixa (40, 5037, 711, 53), 48px/52.8px, peso 700.

Controles: nenhum campo visível.

Evidências: [screenshot](../output/playwright/reference/blog_the-new-lamborghini-urus-performante-has-arrived%E2%80%94and-it-s-everything-we-hoped-for-1440.png) · [medidas](../output/playwright/reference/blog_the-new-lamborghini-urus-performante-has-arrived%E2%80%94and-it-s-everything-we-hoped-for-1440.json).

### /contact

OBSERVED: Get in Touch, We'll Respond Within Hours → Visit Our Showroom → Everything You Need Here → Ready to test your dream car?.

- H1: caixa (32, 104, 550, 168), 56px/56px, peso 700.
- H2: caixa (688, 984, 480, 53), 48px/52.8px, peso 700.
- H2: caixa (32, 1481, 432, 106), 48px/52.8px, peso 700.
- H2: caixa (40, 1996, 711, 53), 48px/52.8px, peso 700.

Controles: INPUT text: Jane; INPUT email: jane@framer.com; INPUT tel: +1234567890; TEXTAREA textarea: Your Text.

Evidências: [screenshot](../output/playwright/reference/contact-1440.png) · [medidas](../output/playwright/reference/contact-1440.json).

### /financing

OBSERVED: Flexible Financing to Match Your Lifestyle and Budget → Get Pre-Approved in Three Simple Steps → Why Finance With Us → Ready to Get Pre-Approved for Financing? → Everything You Need Here → Ready to test your dream car?.

- H1: caixa (32, 104, 550, 168), 56px/56px, peso 700.
- H2: caixa (32, 984, 480, 106), 48px/52.8px, peso 700.
- H2: caixa (32, 1563, 480, 53), 48px/52.8px, peso 700.
- H2: caixa (40, 2384, 480, 158), 48px/52.8px, peso 700.
- H2: caixa (32, 3321, 432, 106), 48px/52.8px, peso 700.
- H2: caixa (40, 3836, 711, 53), 48px/52.8px, peso 700.

Controles: INPUT text: Jane; INPUT text: Smith; INPUT email: jane@framer.com; INPUT tel: +1234567890; TEXTAREA textarea: Your Text.

Evidências: [screenshot](../output/playwright/reference/financing-1440.png) · [medidas](../output/playwright/reference/financing-1440.json).

### /

OBSERVED: Washington's Premier Luxury Dealership → Performance Meets Prestige → We're Way More Than a Dealership → Great Numbers, Happy Owners. → Meet The Experts. → Insights & Expertise Now → Ready to Experience Your Dream Car? → Everything You Need Here → Ready to test your dream car?.

- H1: caixa (40, 102, 550, 168), 56px/56px, peso 700.
- H2: caixa (32, 1184, 480, 106), 48px/52.8px, peso 700.
- H2: caixa (26, 1924, 480, 106), 48px/52.8px, peso 700.
- H2: caixa (32, 2703, 480, 106), 48px/52.8px, peso 700.
- H2: caixa (922, 3715, 480, 53), 48px/52.8px, peso 700.
- H2: caixa (32, 4189, 432, 106), 48px/52.8px, peso 700.
- H2: caixa (480, 4801, 480, 106), 48px/52.8px, peso 700.
- H2: caixa (32, 5356, 432, 106), 48px/52.8px, peso 700.
- H2: caixa (40, 5871, 711, 53), 48px/52.8px, peso 700.

Controles: INPUT text: Search….

Evidências: [screenshot](../output/playwright/reference/home-1440.png) · [medidas](../output/playwright/reference/home-1440.json).

### /inventory

OBSERVED: Find Your Perfect Car Today, Drive It Tomorrow → Filters → Ready to Experience Your Dream Car? → Ready to test your dream car?.

- H1: caixa (32, 104, 550, 168), 56px/56px, peso 700.
- H3: caixa (32, 944, 70, 31), 26px/31.2px, peso 500.
- H2: caixa (480, 2900, 480, 106), 48px/52.8px, peso 700.
- H2: caixa (40, 3456, 711, 53), 48px/52.8px, peso 700.

Controles: INPUT text: Search Car...; INPUT text: Year...; INPUT number: Max....

Evidências: [screenshot](../output/playwright/reference/inventory-1440.png) · [medidas](../output/playwright/reference/inventory-1440.json).

### /inventory/krynox-zr_9

OBSERVED: Krynox ZR-9 → Specs → Ready to Experience Your Dream Car? → Cars You May Like → Ready to test your dream car?.

- H1: caixa (32, 144, 486, 56), 56px/56px, peso 700.
- H2: caixa (760, 675, 134, 53), 48px/52.8px, peso 700.
- H2: caixa (480, 1687, 480, 106), 48px/52.8px, peso 700.
- H2: caixa (32, 2243, 550, 53), 48px/52.8px, peso 700.
- H2: caixa (40, 2929, 711, 53), 48px/52.8px, peso 700.

Controles: nenhum campo visível.

Evidências: [screenshot](../output/playwright/reference/inventory_krynox-zr_9-1440.png) · [medidas](../output/playwright/reference/inventory_krynox-zr_9-1440.json).

### /legal-pages/cookie-policy

OBSERVED: Cookie Policy → Ready to test your dream car?.

- H1: caixa (32, 142, 550, 56), 56px/56px, peso 700.
- H2: caixa (40, 4028, 711, 53), 48px/52.8px, peso 700.

Controles: nenhum campo visível.

Evidências: [screenshot](../output/playwright/reference/legal-pages_cookie-policy-1440.png) · [medidas](../output/playwright/reference/legal-pages_cookie-policy-1440.json).

### /legal-pages/privacy-policy

OBSERVED: Privacy Policy → Ready to test your dream car?.

- H1: caixa (32, 142, 550, 56), 56px/56px, peso 700.
- H2: caixa (40, 6724, 711, 53), 48px/52.8px, peso 700.

Controles: nenhum campo visível.

Evidências: [screenshot](../output/playwright/reference/legal-pages_privacy-policy-1440.png) · [medidas](../output/playwright/reference/legal-pages_privacy-policy-1440.json).

### /legal-pages/terms-conditions

OBSERVED: Terms & Conditions → Ready to test your dream car?.

- H1: caixa (32, 142, 550, 56), 56px/56px, peso 700.
- H2: caixa (40, 8617, 711, 53), 48px/52.8px, peso 700.

Controles: nenhum campo visível.

Evidências: [screenshot](../output/playwright/reference/legal-pages_terms-conditions-1440.png) · [medidas](../output/playwright/reference/legal-pages_terms-conditions-1440.json).

### /not-a-real-page

OBSERVED: 404/ Page Not Found → Ready to test your dream car?.

- H1: caixa (40, 102, 550, 56), 56px/56px, peso 700.
- H2: caixa (40, 1040, 711, 53), 48px/52.8px, peso 700.

Controles: INPUT text: Search….

Evidências: [screenshot](../output/playwright/reference/not-a-real-page-1440.png) · [medidas](../output/playwright/reference/not-a-real-page-1440.json).

### /trade-in

OBSERVED: Get top value for your car, fast and hassle-free → Sell, Trade, or Upgrade Your Vehicle → Why sell your car with us → Ready to discover what your car is worth? → Everything You Need Here → Ready to test your dream car?.

- H1: caixa (32, 104, 550, 168), 56px/56px, peso 700.
- H2: caixa (32, 984, 480, 106), 48px/52.8px, peso 700.
- H2: caixa (32, 1563, 480, 106), 48px/52.8px, peso 700.
- H2: caixa (40, 2437, 480, 158), 48px/52.8px, peso 700.
- H2: caixa (32, 3587, 432, 106), 48px/52.8px, peso 700.
- H2: caixa (40, 4102, 711, 53), 48px/52.8px, peso 700.

Controles: INPUT text: Jane; INPUT text: Smith; INPUT email: jane@framer.com; INPUT tel: +1234567890; INPUT text: Aurvane; INPUT text: 2023...; INPUT text: Celeste; INPUT text: RP4; INPUT text: 1000...; INPUT text:  ZFF65LHA9A0175991; TEXTAREA textarea: Your Text.

Evidências: [screenshot](../output/playwright/reference/trade-in-1440.png) · [medidas](../output/playwright/reference/trade-in-1440.json).
