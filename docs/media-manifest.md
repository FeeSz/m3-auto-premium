# Manifesto de mídia

Estado: geração bloqueada pelo plano do Higgsfield (`Requires plus plan or higher.`). Não foram criados jobs. Os arquivos abaixo são esperados, não arquivos gerados.

| Nome base | Master solicitado | Duração | Entrega web |
|---|---|---|---|
| hero-loop | 3840 × 2160, 16:9 | 10 s | 1920 × 1080, WebM VP9 e MP4 H.265 |
| body-detail | 3840 × 2160, 16:9 | 6 s | 1920 × 1080, WebM VP9 e MP4 H.265 |
| delivery | 3840 × 2160, 16:9 | 8 s | 1920 × 1080, WebM VP9 e MP4 H.265 |
| hero-loop-mobile | 2160 × 3840, 9:16 | 10 s | 720 × 1280, WebM VP9 |
| delivery-mobile | 2160 × 3840, 9:16 | 8 s | 720 × 1280, WebM VP9 |

Arquivos em `public/media/` (ou a mesma estrutura na CDN):

```text
hero-loop.webm
hero-loop.mp4
hero-loop-poster.webp
hero-loop-mobile.webm
hero-loop-mobile-poster.webp
body-detail.webm
body-detail.mp4
body-detail-poster.webp
delivery.webm
delivery.mp4
delivery-poster.webp
delivery-mobile.webm
delivery-mobile-poster.webp
```

Posters: um frame de cada clipe, nas respectivas dimensões web, idealmente abaixo de 200 KB. Cada hero deve ficar abaixo de 8 MB. Vídeos sem áudio, marcas d'água, textos, placas legíveis ou logos de montadoras. Rostos fora de quadro ou desfocados. Confirmar loop visualmente, codec real, duração, dimensões e tamanho antes de ativar. Pedir 4K no prompt não comprova que o modelo exporte 4K.

Direção: showroom antracite, LEDs lineares brancos, reflexos azul-aço, ciano discreto e um hatch vermelho; câmera lenta e estável. Carros sem marcas. Todo material gerado é ilustrativo, nunca prova do estoque ou da loja real. Hero: dolly-in suave, SUV/sedan/hatch. Detalhe: farol/roda/lataria com profundidade de campo rasa. Entrega: mãos com chave e entrada no veículo, sem rosto identificável. Verticais devem ter composição própria.

H.265 é fallback para navegadores compatíveis; WebM VP9 é a primeira fonte. Otimização/transcodificação ainda pendente junto com os clipes. O código não baixa masters 4K.
