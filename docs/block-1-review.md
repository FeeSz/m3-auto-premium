# PR local — Bloco 1: fonte de verdade e schema

## Problema e resultado

O estoque era consumido por um array exportado de `lib/vehicles.ts`. Agora a fonte JSON existente passa por um parser defensivo e é acessada exclusivamente por `getVehicles()` / `getVehicleBySlug()`. Cada leitura devolve cópia independente, evitando mutações acidentais. A UI continua recebendo a mesma projeção de dados e mantém a aparência anterior.

Implementado somente o Bloco 1. Nenhum REBUILD/REMOVE, alteração de catálogo, oportunidades, modificações visíveis, analytics ou financiamento dos blocos seguintes.

## Contrato e decisões

- `src/domain/vehicle.ts`: schema canônico com status, preparação, prioridade, imagens e histórico. `price` e `mileage` são números.
- `src/data/vehicles.ts`: único módulo ativo que importa o snapshot. Fonte, 18 veículos, preços, ordem e fotos permanecem intactos.
- `src/domain/vehicle-parser.ts`: aceita o formato atual e números brasileiros legados; rejeita dados obrigatórios inválidos e IDs/slugs duplicados. Não fabrica especificações. Registra lacunas somente no console de desenvolvimento.
- `src/lib/vehicles.ts`: adaptador de apresentação, sem acesso à fonte. Mantém `modelYear`, `mileageKm` e legendas para evitar alterar componentes e classes.
- `formatPrice()`, `formatMileage()` e `formatYear()` centralizam apresentação; aliases antigos conservam a saída atual.
- `src/domain/vehicle-operations.ts`: operações puras para adicionar, editar, mudar preço com evento real, marcar vendido, destacar/priorizar, registrar modificação, adicionar imagens e atualizar km. Retornam snapshot validado; não gravam em arquivo/banco. Interface futura de escrita exige revisão esperada para controle de concorrência. Nenhum endpoint público foi criado.
- **Data de entrada desconhecida:** `listedAt: string | null`, em vez de inventar uma data ISO. Os 18 anúncios não fornecem esse dado. A coleta não é usada como entrada na loja. `isModified: false` é default interno, sem selo público de originalidade. Históricos inexistentes continuam ausentes.
- Não existe Supabase/banco neste projeto; não há migração SQL a executar.

## Correção do pré-requisito

O build já falhava em `/opengraph-image` ao decodificar WebP no renderizador. A foto agora é convertida em PNG em memória antes de entrar no mesmo `ImageResponse`. Composição, textos e estilos do OG foram preservados. Sharp 0.35.4, já instalado transitivamente, foi declarado como dependência direta. Não houve inclusão de biblioteca de UI.

## Arquivos e classificação

| Classe | Arquivos |
|---|---|
| REFINE | `src/lib/vehicles.ts`, `src/lib/vehicle-format.ts`, `src/lib/articles.ts` |
| REFINE | `src/app/estoque/page.tsx`, `src/app/estoque/[slug]/page.tsx` |
| REFINE | `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/sitemap.ts` |
| REFINE autorizado | `src/components/m3/home.tsx` — somente import/carga de dados |
| REFINE | `src/app/opengraph-image.tsx`, `package.json`, `package-lock.json`, `tsconfig.json` |
| NEW | `src/domain/vehicle.ts`, `vehicle-parser.ts`, `vehicle-operations.ts`, `src/data/vehicles.ts` |
| NEW | `tests/vehicle-data.test.mjs`, `tests/vehicle-format.test.mjs` |
| NEW, evidência | `docs/block-1-*`, `scripts/block-1-*`, `output/block-1/**` |
| KEEP comprovado | Todo CSS, Header, Footer, snapshot JSON e JSX da Home |

## Evidência visual

28 comparações: Home, estoque, detalhe HR-V, blog, artigo, sobre e contato × 375/768/1280/1920. Todas com **zero pixels alterados**, textos iguais e sem overflow horizontal.

Método: baseline isolado a partir da cópia anterior ao bloco; mesmo Edge, viewport, fontes e reduced-motion. Cache de respostas de imagens compartilhado entre cada par e GPU desativada, para eliminar variações de reamostragem observadas na primeira passagem. Não há máscaras sobre conteúdo, comparação tolerante ou alteração de CSS do produto. Apenas overlay de desenvolvimento, caret, animações e transições são desativados igualmente na captura.

Relatório: `output/block-1/paired/report.json`. Capturas antes/depois no mesmo diretório. Hashes comprovam preservação dos arquivos protegidos; ver `output/block-1/changed-files.json`.

## Validação técnica

- `npm.cmd run build`: passou; 37 páginas geradas, incluindo Open Graph.
- `npm.cmd run lint`: passou sem erros ou avisos.
- `npm.cmd run typecheck`: passou.
- `npm.cmd test`: 16 testes aprovados, incluindo oito testes da camada de dados/operações e um dos formatadores.
- 28 comparações visuais aprovadas nos quatro tamanhos solicitados.
- Servidor de produção local: 23 páginas (incluindo os 18 veículos) e Open Graph responderam 200, sem erros de navegador; `output/block-1/production-smoke.json`.

Logs em `output/block-1/build.log`, `lint.log` e `tests.log`.

## Pendências de dados e publicação

`docs/block-1-data-gaps.json` lista campos não fornecidos. Datas reais de entrada, modificações e histórico precisam vir da M3; nada foi preenchido por suposição. A autorização definitiva das fotos dos anúncios, pedida na etapa anterior, não foi presumida por este bloco. Nenhum deploy realizado.

## Revisão e próximo passo

Patch local: `output/block-1/block-1.patch`. O workspace não possui repositório Git local utilizável; não há PR remoto ou commit criado. Aprovar este diff antes de iniciar o Bloco 2, conforme o plano de sete blocos.
