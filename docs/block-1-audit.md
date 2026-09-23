# Bloco 1 — auditoria prévia (21/09/2026)

Escopo autorizado: fonte de verdade, schema, parser, helpers e preparação de escrita. Nenhuma funcionalidade dos blocos 2–7. Aparência congelada no estado encontrado em 21/09.

## Fonte atual

`src/data/vehicles.generated.json` contém snapshot local de 18 anúncios únicos coletados no Usadosbr em 18/09. `src/lib/vehicles.ts` importa o JSON, acrescenta aliases de compatibilidade e exporta o array. Home, estoque, detalhe, artigos, sitemap e Open Graph dependem desse export. O navegador não consulta marketplace. Não existe banco/CMS nem endpoint de escrita. Scripts de pesquisa, normalização e cache são processos manuais separados.

## Classificação antes de código

| Arquivos / componentes | Classe | Escopo |
|---|---|---|
| `src/data/vehicles.generated.json`, `public/**` | KEEP | Não atualizar estoque, preços, fotos ou ordem |
| CSS, configs visuais, Header, Footer, Photo, galeria, formulário | KEEP | Nenhuma edição |
| `src/lib/vehicles.ts` | REFINE | Fachada compatível sobre acesso único; retirar export do array |
| `src/lib/vehicle-format.ts` | REFINE | Helpers centralizados com saída equivalente |
| `src/app/estoque/page.tsx`, `src/app/estoque/[slug]/page.tsx` | REFINE | Buscar dados pela API; markup e comportamento preservados |
| `src/lib/articles.ts`, páginas de blog, sitemap | REFINE | Substituir dependência do array pela camada única |
| Inventory e VehicleCard | REFINE | Apenas referências de tipo; preservar controles e card |
| `src/components/m3/home.tsx` | REFINE autorizado | Usuário autorizou somente ligação dos dados; JSX preservado byte a byte |
| `src/app/opengraph-image.tsx` | REFINE | Acesso pela API e correção não visual da falha preexistente de build |
| Tipos, parser, repository, operações, testes | NOVOS | Domínio independente de UI e de futura persistência |
| `package.json`, lockfile, `tsconfig.json` | REFINE | Declarar Sharp já instalado e permitir imports TS dos testes nativos; sem biblioteca de UI |
| `src/lib/content.ts` e scripts antigos sem uso no site | KEEP | Legado fora do caminho ativo; nenhuma remoção neste bloco |

Nenhum REBUILD/REMOVE será executado. Não há repositório Git local visível; produzir patch contra cópia anterior ao bloco, sem criar commit/PR remoto fictício.

## Lacunas reais

- Não há `listedAt` verificado. Usar `null` com diagnóstico de desenvolvimento; não inventar ISO nem confundir coleta com entrada na loja. A ampliação para `string | null` evita futura falsa recência.
- Não há histórico real de preços ou modificações documentadas. Defaults: `isModified: false`, `priority: 0`, histórico ausente. O boolean padrão não será exibido como prova de originalidade.
- Manter proveniência e metadados de imagens do snapshot. Adaptador de apresentação preservará o formato atual sem perda dos novos campos canônicos.
- As operações de escrita serão puras e validadas; nenhum endpoint/admin/persistência automática será criado.
- Falha anterior: build de `/opengraph-image` com `TypeError: u2 is not iterable`. Investigar antes da validação final; não mudar sua composição.

## Validação planejada

Baseline visual nos tamanhos 375/768/1280/1920; comparar pixels depois do bloco nas mesmas condições. Testes do parser, fonte, operações, formatação e invariância dos dados; lint, typecheck e build. Interromper ao fim do bloco e aguardar aprovação explícita.
