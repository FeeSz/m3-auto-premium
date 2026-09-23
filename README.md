# M3 Auto Premium

Site institucional local em Next.js, TypeScript, Tailwind CSS e Motion (sucessor do Framer Motion). Conteúdo em português, sem backend ou formulário que armazene dados.

## Rodar localmente

Requer Node.js 20.9 ou superior e npm. No PowerShell:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abra http://127.0.0.1:3000. Para verificar a versão de produção:

```powershell
npm.cmd run build
npm.cmd run typecheck
npm.cmd start
```

## Estrutura

```text
src/
  app/
    globals.css           Tokens e layout responsivo
    layout.tsx            Idioma, SEO e metadados sociais
    page.tsx              Home e schema AutoDealer
    opengraph-image.tsx   Imagem social PNG 1200 × 630
  components/home.tsx     Seções, filtros, menu, motion e vídeo
  lib/content.ts          Contatos, modelos de exemplo e configuração de mídia
public/
  showroom.svg            Ilustração conceitual de fallback, não foto da loja
docs/
  media-manifest.md        Lista exata de clipes e requisitos de integração
  design.md               Direção visual e revisão de antipadrões
CHANGELOG.md              Entrega por seção
```

## Conteúdo a confirmar

Os modelos são exemplos fornecidos pelo cliente, não um estoque ativo verificado. Não foram criados preços, anos, quilometragens ou relatos individuais. Faltam fotos reais, fichas dos veículos, horário, CNPJ, razão social, arquivo original do logo e atualização da nota/quantidade de avaliações. O logotipo atual é uma composição tipográfica provisória.

A nota 5,0/107 é atribuída ao briefing e não integra o schema de avaliação. Os três relatos são sínteses identificadas dos padrões fornecidos, sem nomes ou aspas. Financiamento está sujeito à análise. Tempo de mercado não foi inventado.

## Vídeos

A solicitação ao Higgsfield retornou `Requires plus plan or higher.` Nenhum job foi criado e nenhum clipe foi entregue pelo serviço. A home usa uma ilustração SVG leve, claramente identificada. Consulte `docs/media-manifest.md`. Não habilite `media.enabled` antes de fornecer os arquivos.

O componente considera redução de movimento, economia de dados e redes 2G; evita autoplay nesses casos e conserva o poster. Inclui botão de pausa. O mapa é incorporado com lazy loading e depende do Google; o link de rota continua disponível separadamente.

## Publicação

Defina `NEXT_PUBLIC_SITE_URL` com o domínio HTTPS definitivo antes do build. Sem essa variável o site usa `noindex`, evitando indexação do protótipo. Metadados Open Graph e Twitter e JSON-LD AutoDealer estão presentes. Não há domínio presumido nem deployment nesta entrega. Para CDN, altere `media.base` para a origem aprovada, mantendo nomes e MIME types corretos.

SEO, contraste automatizado ou build não substituem revisão editorial e acessibilidade manual. A confirmação visual e os resultados locais ficam em `docs/validation.md` quando executados.
