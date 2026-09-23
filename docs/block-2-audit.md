# Bloco 2 — auditoria e escopo autorizado

## Autorização registrada

Após a rodada de proposta, o usuário autorizou: “substituir apenas os controles do catálogo por barra de busca/ordenação, chips e drawer mobile, com CSS local usando os tokens existentes”. O REBUILD abaixo foi executado nessa rodada posterior. As referências a “aguardar aprovação” na classificação original registram o gate já atendido.

Classificação final: `inventory.tsx` — REBUILD autorizado; `inventory.module.css`, `config/catalog.ts`, `lib/catalog.ts`, testes, scripts de verificação e documentos — NEW no Bloco 2. Header, Home/Hero, Footer, heading do estoque, cards, grade, dados, tokens e CSS global — KEEP. Nenhum REMOVE.

## Classificação antes de código

| Arquivo/componente | Classe | Escopo |
|---|---|---|
| Header, Home/Hero, Footer, VehicleCard, VehicleGrid | KEEP | Não alterar |
| `src/data/vehicles.generated.json`, fotos, camada de acesso | KEEP | Fonte e dados preservados |
| `src/app/estoque/page.tsx` | KEEP nesta rodada | Heading e composição preservados |
| `src/lib/inventory-domain.ts` | KEEP nesta rodada | Comportamento atual preservado até integração aprovada |
| `src/config/catalog.ts`, `src/lib/catalog.ts`, testes | NEW | Lógica pura do Bloco 2, ainda sem conectar à UI |
| `src/components/m3/inventory.tsx` | REBUILD proposto | Substituir sidebar por controles e drawer; aguardar aprovação |
| CSS global e tokens | KEEP | Nenhum token/escala/paleta alterado |
| Estilos locais do catálogo | NEW proposto, aguardar aprovação | Layout e posicionamento do drawer usando tokens atuais |

## Por que a integração visual aguarda

O plano de sete blocos proíbe REBUILD na mesma rodada em que é proposto e exige aprovação para editar CSS global ou equivalente. O componente atual usa uma sidebar de 250px, com filtros expandidos no desktop e painel inline no mobile. Não existe drawer reutilizável. A transformação pedida não é um ajuste imperceptível.

## Proposta concreta de escopo visual

- Preservar heading, margens, espaçamento entre seções, card e número de colunas da grid (2 desktop, 1 mobile conforme classes atuais do catálogo).
- Substituir somente o bloco de controles: busca e ordenação em linha; chips existentes (`body-tabs`) abaixo; botão para filtros avançados.
- Desktop: filtros avançados expansíveis, sem sidebar permanente.
- Mobile: barra discreta com `Filtrar (N)` e `Ordenar`; dialog/drawer com foco contido, Escape e retorno ao acionador, usando cores, bordas, radius e botões atuais.
- CSS local restrito ao componente para posição, distribuição e rolagem; nenhum token novo e nenhuma edição de Header/Hero/Footer.
- Aprovação solicitada para essa substituição localizada e estilos de funcionamento do drawer. Nenhum Bloco 3 antecipado.

## Trabalho independente autorizado

Preparar e testar módulo puro com seis ordenações, recomendados com fallback por preço, filtros inclusivos, busca AND, estado de URL validado, chips derivados do estoque, opções com variedade suficiente, exclusão de vendidos, recuperação de faixa de preço e paginação de 24 itens. Datas `listedAt` desconhecidas permanecem desconhecidas e vão após datas válidas. Não publicar selo de originalidade a partir de um default.
