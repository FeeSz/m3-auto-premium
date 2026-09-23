# Validação local — 14/09/2026

## Confirmado

- Build de produção: passou; Next.js 16.3.5, páginas estáticas `/`, `/_not-found`, `/icon.svg` e `/opengraph-image`.
- TypeScript: passou no build final; `npm.cmd run typecheck` também passou antes dos últimos ajustes.
- Edge headless: capturas desktop 1440 × 1000 e mobile 390 × 844, revisadas visualmente.
- Capturas finais: zero eventos de console e zero falhas de requisição registradas durante a captura inicial.
- Testes na versão de produção: abrir/fechar menu mobile, navegação para estoque, filtro SUV=3, Sedan=1, Hatch=2, Todos=6, destino correto de WhatsApp, zero elementos de vídeo enquanto mídia desativada, sem overflow horizontal a 390 px e sem erros JavaScript.
- Nenhuma mensagem de WhatsApp foi enviada; somente o destino do link foi inspecionado.

## Revisão visual

O lint inicial encontrou contraste presumido incorreto no cabeçalho transparente, textos auxiliares pequenos e contraste do logo no rodapé. Cabeçalho ganhou base antracite explícita, textos foram ampliados e logo do rodapé usa azul-aço escuro. A segunda execução conservou apenas dois alertas de overflow no desenho inclinado da marca. A captura ampliada mostra a marca inteira; o elemento possui overflow visível. São alertas aceitos do desenho tipográfico, não corte de conteúdo.

O teste inicial de interação durante recompilação do servidor de desenvolvimento expirou. A repetição no build estável com espera pela hidratação passou. Isso não é apresentado como um teste aprovado no servidor em recompilação.

## Evidências

- `output/playwright/final-desktop/screenshot.png`
- `output/playwright/final-mobile/screenshot.png`
- `output/playwright/interactions.json`
- `output/playwright/visual-lint-final.json`
- `output/playwright/location.png`

## Pendente ou não comprovado

- Geração, compressão, continuidade do loop e reprodução dos cinco clipes reais: bloqueadas pelo plano Higgsfield. A integração de vídeo está implementada, mas não foi testada com arquivos gerados.
- Fotos e fichas reais, logo original, CNPJ, razão social, horários e atualidade da reputação.
- Validação completa WCAG/tecnologias assistivas e Web Vitals em dispositivo real. Lint visual não comprova conformidade integral AA.
- Publicação, CDN e domínio de produção não foram executados.
- O mapa depende de carregamento externo do Google; capturas de página inteira antes de rolar mostram o placeholder lazy-load. O endereço e o botão de rota independem do iframe.

Os scripts `capture-page.mjs`, `visual-lint.mjs` e `check-ui.mjs` usam o runtime de navegador deste ambiente Codex. São ferramentas locais de evidência, não dependências da aplicação nem uma suíte portátil para CI.

Na captura após rolagem, o iframe mostrou somente o link Abrir no Maps sobre fundo cinza. A renderização dos mapas/tiles não foi confirmada neste ambiente; o botão Traçar rota aponta para a busca com o endereço completo.
