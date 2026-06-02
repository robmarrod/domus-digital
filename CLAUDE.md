# Achadinhos da Elis — Contexto do Projeto

Blog de reviews de casa & decoração com painel admin, geração de conteúdo via IA e monetização por afiliados.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **Prisma ORM** + SQLite (arquivo `dev.db` local / `achadinhos.db` na Hostinger)
- **Deploy:** Hostinger (Node.js) com CI/CD via GitHub (`robmarrod/achadinhos-da-elis`)

## Estrutura de pastas

```
app/
  (site)/              # Site público
    page.tsx           # Home
    reviews/[slug]/    # Página de review/ranking
    produto/[slug]/    # Página de produto individual
    categoria/[slug]/  # Listagem por categoria
    sobre/ metodologia/ politica-de-privacidade/ termos-de-uso/
  (admin)/admin/       # Painel admin (Basic Auth)
    page.tsx           # Dashboard
    posts/             # CRUD de posts
    produtos/          # CRUD de produtos
    config/afiliados/  # Configurações de afiliado (Amazon/Shopee/ML)
    config/ia/         # Configuração de IA (Claude/OpenAI/Gemini) + prompts
  api/
    posts/             # GET/POST lista | GET/PUT/DELETE por id
    produtos/          # CRUD produtos
    config/afiliados/  # GET/POST afiliados
    config/ia/         # GET/POST/DELETE config de IA
    scrape-produto/    # POST — scraping de URL de produto
    gerar-post/        # POST — gera 1 post ranking com IA
    gerar-posts-lote/  # POST — gera ranking + 1 post individual por produto
    publicar-agendados/ # GET — cron: publica posts com status SCHEDULED
    seed-test/         # GET — cria post de teste (protegido por secret)

lib/
  ai.ts        # Cliente IA unificado (Anthropic/OpenAI/Gemini) com prompts editoriais
  scraper.ts   # Extração de produto por URL (JSON-LD + meta tags + seletores ML/Amazon/Shopee)
  links.ts     # Aplicação de backlinks automáticos no conteúdo
  affiliate.ts # buildAffiliateUrl() para Shopee/ML/Amazon
  prisma.ts    # Singleton do PrismaClient
  types.ts     # CATEGORIAS, ROTULOS_DESTAQUE
  utils.ts     # slugify(), formatDate(), cn()

components/
  site-header.tsx / site-footer.tsx / review-card.tsx
  product-highlight-card.tsx / product-affiliate-buttons.tsx / toc.tsx
  mobile-menu.tsx
  admin/
    sidebar.tsx
    post-form.tsx          # Formulário completo de post (importar URLs + geração IA + backlinks + agendamento)
    geracao-lote-panel.tsx # Painel de geração em lote (ranking + individuais)
    links-panel.tsx        # Painel de backlinks (palavra-âncora → URL)
    ia-config-form.tsx     # Config de IA com prompt customizável
    product-form.tsx
    afiliadoss-form.tsx
```

## Banco de dados (Prisma schema)

### Modelos principais
- **Post** — `id, slug, titulo, resumo, conteudoJson (String JSON), tipo (REVIEW|GUIA), categoria, palavraPrimaria, metaTitle, metaDescription, status, publishedAt, scheduledAt, linksJson, parentPostId`
- **Product** — campos de afiliado: `urlShopee, urlMercadoLivre, urlAmazon, idShopee, idMercadoLivre, idAmazon`
- **PostProduct** — pivot com `posicao, rotuloDestaque, resumoCurto, pros, contras, indicadoPara`
- **AffiliateSettings** — `amazonTag, shopeeParam, mercadoLivreParam`
- **AISettings** — `provider (anthropic|openai|gemini), apiKey, model, ativo, promptRanking, promptIndividual`

### Status de Post
`DRAFT` → `REVIEW` → `PUBLISHED` | `SCHEDULED` | `ARCHIVED`

Posts só aparecem no site público se `status === "PUBLISHED"`.

## Fluxo de geração de posts com IA

1. Admin → Novo post → colar URLs de produtos (ML, Shopee, Amazon)
2. Sistema scrapa cada URL e extrai: nome, descrição completa, especificações, preço, imagem
3. Preencher: título, palavra primária, categoria
4. Opcional: adicionar backlinks (palavra-âncora → URL interno/externo)
5. Clicar "Gerar posts com IA" → cria automaticamente:
   - **1 post ranking** (todos os produtos comparados)
   - **1 post individual** por produto (artigo review exclusivo)
   - Produtos são criados/atualizados no banco automaticamente
6. Posts ficam como DRAFT — editar e publicar ou agendar

## Geração em lote — API

```
POST /api/gerar-posts-lote
Body: { titulo, palavraPrimaria, categoria, tipo, produtos[], backlinks[], status }
Retorna: { ok, totalGerados, totalErros, posts[] }
```

## Agendamento automático

Posts com `status = "SCHEDULED"` são publicados pelo cron:
```
GET https://achadinhosdaelis.com.br/api/publicar-agendados?secret=achadinhos2024
```
Configurar na Hostinger → Avançado → Cron Jobs a cada 15 minutos.

## Backlinks automáticos

Campo `linksJson` no Post armazena array de:
```json
[{ "palavra": "cortina solar", "url": "/reviews/...", "tipo": "interno", "novaAba": false }]
```
A função `aplicarLinks()` em `lib/links.ts` substitui as palavras no conteúdo antes de renderizar.

## Autenticação admin

HTTP Basic Auth via `middleware.ts`.
- Usuário: `ADMIN_USER` (env)
- Senha: `ADMIN_SECRET` (env)
- Padrão local: `elis` / `achadinhos2024`

## Variáveis de ambiente (.env)

```
DATABASE_URL="file:./dev.db"
ADMIN_USER="elis"
ADMIN_SECRET="achadinhos2024"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Achadinhos da Elis"
```

Na Hostinger, `DATABASE_URL` aponta para caminho absoluto:
```
file:/home/u535437239/domains/achadinhosdaelis.com.br/database/achadinhos.db
```

## Comandos úteis

```bash
npm run dev              # Servidor local (http://localhost:3000)
npm run build            # Build de produção
npx prisma studio        # GUI do banco de dados
node_modules/.bin/prisma migrate dev --name "nome"  # Nova migration
node_modules/.bin/ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts  # Seed

git add -A && git commit -m "mensagem" && git push  # Deploy automático via GitHub
```

## Migrations pendentes para rodar na Hostinger

Após o próximo deploy, o `prestart` roda `prisma migrate deploy` automaticamente.
As migrations novas em `prisma/migrations/` serão aplicadas:
- `20260528000001_add_scheduled_ai_settings` — campo `scheduledAt` no Post + tabela `AISettings`
- `20260528000002_links_prompt_fields` — campos `linksJson`, `parentPostId` no Post + `promptRanking`, `promptIndividual` no AISettings

## Deploy

Push para `main` no GitHub dispara deploy automático na Hostinger.
O `prestart` (antes do `npm start`) cria o diretório do banco e roda as migrations.

## Design / Branding

- Cor principal: rosa coral `#F4607B` (brand-500)
- Cor secundária: teal `#187878` (teal-600)
- Fonte: Nunito (Google Fonts)
- Logo: bolsa rosa com sorriso teal (SVG inline no SiteHeader)
