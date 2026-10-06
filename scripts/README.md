# Scripts de manutenção

Os scripts mantidos aqui se dividem em duas categorias:

- `cache-stock-images.mjs` e `normalize-stock.mjs`: preparação explícita dos dados e imagens do estoque. Eles não fazem parte do build e só devem ser executados quando a fonte do inventário for revisada.
- `block-2-*.mjs` e `verify-m3.mjs`: verificações manuais no navegador. Elas geram evidências em `output/` e pressupõem o servidor local indicado no próprio comando.

Scripts pontuais que geravam ou reescreviam componentes foram removidos depois de confirmada a ausência de chamadas no projeto. O histórico continua disponível no Git.
