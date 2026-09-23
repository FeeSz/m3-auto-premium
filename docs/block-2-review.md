# Bloco 2 — catálogo integrado

Status: implementação local concluída, dentro do REBUILD autorizado pelo usuário. Aguardando revisão do bloco; nenhum trabalho do Bloco 3 iniciado.

## Resultado

O catálogo usa barra de busca e ordenação, chips derivados do estoque e filtros avançados expansíveis. No mobile, a barra fixa abre painéis de filtros e ordenação; deixa de cobrir a tela quando o rodapé ocupa sua metade inferior.

- Seis ordenações numéricas, sem alterar o array original. `recommended` mantém o fallback por preço crescente até o Bloco 3.
- Busca por múltiplos termos, acentos e hífens; filtros inclusivos, modelos dependentes da marca e opções somente com variedade. `Sedã` e `Sedan` são equivalentes.
- Preço por dois ranges nativos acessíveis por teclado, com limites do estoque. Filtros ativos podem ser removidos individualmente.
- URL com debounce de 300 ms e replace durante digitação; push em chips/seletores; hidratação, recarga e Voltar/Avançar verificados. Sem reset de scroll imposto pelo catálogo.
- Drawer com foco contido nos dois sentidos, Escape, retorno ao acionador, bloqueio de rolagem de fundo, Limpar e Ver N veículos.
- Estado vazio com limpeza, ampliação para o próximo preço real e link de WhatsApp. Nenhuma mensagem foi enviada.
- Vendidos excluídos; página inicial de até 24 itens, com Carregar mais. Cards, carregamento lazy e aspect-ratio existentes reutilizados.

## Arquivos e classificação

| Arquivo | Classe | Alteração |
|---|---|---|
| `src/components/m3/inventory.tsx` | REBUILD autorizado | Controles e integração da lógica |
| `src/components/m3/inventory.module.css` | NEW | Estilos locais, usando tokens existentes |
| `src/config/catalog.ts` | NEW | Ordenações, fallback, paginação e debounce |
| `src/lib/catalog.ts` | NEW | Seleção, busca, filtros, URL e opções derivadas |
| `tests/catalog.test.mjs` | NEW | 12 testes do Bloco 2 |
| `scripts/block-2-browser.mjs` | NEW | Fluxos reais de interação |
| `scripts/block-2-capture.mjs` | NEW | Capturas e métricas responsivas |
| `scripts/block-2-visual-lint.mjs` | NEW | Verificação dos controles renderizados |
| `docs/block-2-audit.md`, este relatório | NEW | Auditoria, autorização e evidências |

KEEP: Header, Home/Hero, Footer, heading do estoque, VehicleCard/VehicleGrid, tokens, CSS global e fonte de dados. Nenhum REMOVE. O módulo legado `inventory-domain.ts` foi preservado, embora o catálogo passe a consumir `catalog.ts`.

Diff completo local: [block-2.patch](../output/block-2/block-2.patch). Não houve commit, PR remoto ou deploy.

## Validação

- `npm.cmd test`: **28/28**, incluindo os 12 testes do bloco.
- `npm.cmd run typecheck`: aprovado.
- `npm.cmd run lint`: aprovado.
- `npm.cmd run build`: aprovado, 37 páginas geradas.
- Visual lint: **8 estados aprovados**, cobrindo controles recolhidos/expandidos nas quatro larguras.
- **47 verificações de interação** em Edge: busca, ordenação, histórico, debounce com chip, URL compartilhada/recarga, filtros dependentes, faixa de preço via teclado, recuperação do vazio, drawer/foco/Escape e rodapé acessível. Nenhum erro de JavaScript.
- **375 / 768 / 1280 / 1920 px**: Home e estoque HTTP 200, sem overflow horizontal e sem imagens quebradas. Grade mantida em uma coluna nos dois tamanhos menores e duas nos maiores.
- Comparação pareada em **375 px**: zero pixels alterados na Home inteira e nos recortes do Header, heading do estoque e Footer. As outras larguras têm revisão renderizada, não comparação pixel a pixel com uma baseline desta rodada.
- Hashes dos arquivos protegidos confirmam preservação do código fora do escopo. O CSS novo é um CSS Module restrito ao catálogo.

### Evidências

- [Relatório de interações](../output/playwright/block-2/interaction-report.json)
- [Métricas das quatro larguras](../output/playwright/block-2/after/report.json)
- [Comparação das regiões protegidas](../output/playwright/block-2/protected-comparison.json)
- [Visual lint dos controles](../output/playwright/block-2/visual-lint.json)
- [Escopo dos arquivos](../output/block-2/source-scope.json)
- [Mobile 375 px](../output/playwright/block-2/after/stock-375.png)
- [Tablet 768 px](../output/playwright/block-2/after/stock-768.png)
- [Desktop 1280 px](../output/playwright/block-2/after/stock-1280.png)
- [Desktop 1920 px](../output/playwright/block-2/after/stock-1920.png)
- [Drawer mobile](../output/playwright/block-2/after/drawer-375.png)

## Limites da evidência

O estoque atual tem 18 veículos: paginação acima de 24 foi testada com fixtures, sem adicionar veículos fictícios ao site. Datas de entrada desconhecidas continuam desconhecidas e ficam após datas válidas; não foi inferida data de entrada pela data da coleta. Configuração permanece oculta no estoque atual, sem variedade nesse campo.

Filtros e ordenação usam dados locais. O prefetch local de rotas dos Next Links existentes continua funcionando; não é consulta externa de estoque. O teste de rede distingue esses requests locais das chamadas externas/API.

As capturas e interações foram executadas em Edge desktop com viewports responsivos, não em aparelhos físicos. O visual lint verifica overflow, labels, alt text, tamanho de fonte e contraste calculado de texto dos controles; não substitui uma auditoria completa com leitor de tela.

Preview local: http://127.0.0.1:3006/estoque
