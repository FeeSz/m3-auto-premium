# Auditoria M3 — 18/09/2026

## Evidência e estado atual

Inspeção de código e navegador: `output/research/m3/current.*`, `reference.*`, `usadosbr.*`, `instagram.*`. A auditoria anterior de 56 capturas permanece em `reference-audit.md`. Next 16.3.5, React 19.3, TypeScript 7, App Router, CSS próprio, Space Grotesk local, Lucide. Sem backend/CMS ou variáveis de ambiente configuradas. Build anterior passou; não equivale à validação da nova entrega.

## Comparação visual

A composição existente preserva proporções, header de 70px, hero de margem estreita, espaçamento editorial e tipografia da referência. Falta identidade real: wordmark textual, ações pretas e supercarro ilustrativo. A nova direção mantém o ritmo e introduz logo fornecida, azul em ações e fotografia real.

## Classificação antes das alterações

| Parte | Decisão | Motivo |
|---|---|---|
| Stack, rotas e fontes locais | KEEP | Estrutura adequada e tipografia fiel |
| Espaçamento, grid, botões e superfícies | REFINE | Incorporar tokens da marca e responsividade |
| Header e footer | REFINE | Logo oficial, Instagram e contatos centralizados |
| Hero | REBUILD | Veículo real e direção de arte própria |
| Estoque e detalhe | REBUILD | Dados reais, proveniência, filtros persistentes e ordenação |
| Galeria e mapa sob demanda | REFINE | Preservar acessibilidade; usar fotos documentais |
| Formulários | REFINE | Validação, estados claros e adapter de contato |
| Equipe e depoimentos ilustrativos | REMOVE | Nenhuma pessoa ou avaliação fictícia |
| Serviços e institucional | REFINE | Limitar afirmações à operação verificada |
| SEO e testes | REFINE | Metadados reais e validação da versão final |
| Componentes legados sem uso | REMOVE | Evitar conteúdo contraditório e manutenção duplicada |

## Problemas identificados

Dados demonstrativos em oito veículos; falta de ordenação e sincronização completa de filtros com URL; imagens de galeria sem relação com o veículo; retratos ilustrativos; formulário sem integração persistente; ausência de lint configurado. Performance e acessibilidade da revisão nova ainda precisam de medição. A adaptação mobile deve ser verificada nos dez viewports exigidos, principalmente hero, filtros e galeria.

## Ações

Consolidar anúncios atuais, registrar divergências, manter dados locais independentes do marketplace, substituir conteúdo fictício, aplicar marca e finalizar com build, lint, testes críticos, navegador real e Lighthouse.
