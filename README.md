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

