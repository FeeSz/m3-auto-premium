# Design tokens extraídos

Fonte de verdade: JSON e screenshots em output/playwright/reference.

## Tipografia — OBSERVED

Space Grotesk, arquivos Fontshare do CDN Framer; pesos 400, 500, 600 e 700. Arquivos locais em public/fonts; font-display: swap. Inter/Fragment Mono/Poppins declaradas no documento, mas não usadas como fonte principal nos elementos medidos.

| Papel | Desktop ≥1200 | Tablet 810–1199 | Mobile ≤809 | Peso | Tracking |
|---|---|---|---|---|---|
| H1 | 56/56 | 56/56 | 40/40 | 700 | -.03em |
| H2 | 48/52.8 | 44/48.4 | 36/43.2 | 700 | -.03em |
| H3 / filtro | 26/31.2 | 26/31.2 | 26/31.2 | 500 | normal |
| Corpo / CTA | 16/24 | 16/24 | 16/24 | 500 | normal |
| Navegação | 14/21 | 14/21 | 14/21 | 500 | normal |
| Card | 20/28 | 20/28 | 20/28 | 500 | normal |
| Métrica compacta | 24/33.6 | 24/33.6 | 24/33.6 | 500 | normal |

## Cores — OBSERVED

Background #F2F2F2; superfícies #FAFAFA/#FFFFFF; texto #000000; secundário #4D4D4D; divisórias #D9D9D9; CTA preto e branco. Overlay hero rgba(0,0,0,.5). Sem cor de destaque adicional.

## Containers e espaçamento — OBSERVED

Container máximo desktop 1480 px; tablet 1200 px; mobile 600 px. Gutter 32/24/20 px; frame externo 8 px; header 70 px. Hero home desktop 100vh incluindo header; mobile 96vh observado em 390×1000 e 390×844. Hero interno desktop 800 px incluindo header. Intervalos entre seções 144/128/96 px. Gaps recorrentes 8,16,24,32,48,64,80 px. Cards grid desktop 24 px. H1 max-width 550 px; H2 480 px; parágrafo 480 px.

## Superfícies — OBSERVED

Radius principal 16 px; ícone interno CTA 12 px; métrica 20 px. CTA 54 px de altura, padding 4 px, ícone 46 px, label com padding horizontal 16 px. Sombra interna de CTA escuro: inset -10px -10px 20px rgba(255,255,255,.25). Cards veículo: imagem com 282 px de altura no desktop; informação abaixo em superfície branca. Serviço: alturas de 306 px na primeira coluna e 196 px na segunda. Blog card: 384 px.

## Motion

OBSERVED: reveals ao scroll, header fixo, menu mobile, carrossel, accordion e hover de setas/imagens. INFERRED: reveal de 600 ms com translateY 24 px e cubic-bezier(.22,1,.36,1), hover 250 ms, accordion 250 ms. Não alegar curvas idênticas ao original. Reduced motion remove transições e deslocamentos. z-index header 3 observado; camada menu de implementação 30 e foco 50 são adaptações de acessibilidade.

## Imagens

Cover centralizado na maior parte dos slots; serviço de inspeção object-position 50% 100%; hero centralizado com recorte estreito no mobile. Manifesto de origem e autorização em output/playwright/reference/asset-manifest.json. Retratos e fotografias ilustrativas não representam pessoas ou estoque real da M3.
