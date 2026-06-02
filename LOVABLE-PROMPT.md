# Prompt Completo — Achadinhos da Elis (para Lovable)

> **Versão 2.0 — 100% completo**  
> Cobre: design system, banco de dados, todas as páginas, componentes, admin, APIs, IA (prompts integrais), scraping, backlinks, auth, LGPD, SEO.

---

## VISÃO GERAL DO PROJETO

Crie um blog de reviews de produtos para casa e decoração chamado **"Achadinhos da Elis"**, monetizado por links de afiliado (Shopee, Mercado Livre e Amazon). O site tem um painel admin protegido por senha, geração de conteúdo via IA, e scraping automático de produtos.

**URL do site:** achadinhosdaelis.com.br  
**Idioma:** Português (Brasil)  
**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Prisma ORM

---

## IDENTIDADE VISUAL / DESIGN SYSTEM

### Cores — Paleta Completa (Tailwind customizado)

**brand (rosa coral — cor principal):**
```
brand-50:  #fff0f3   (fundo rosado muito claro)
brand-100: #ffe2e9
brand-200: #ffc5d2
brand-300: #ff95b0
brand-400: #ff5884
brand-500: #f4607b   ← rosa principal do logo (botões, links, destaques)
brand-600: #e02f5c   (hover de botões)
brand-700: #bc1d4a
brand-800: #9d1b42
brand-900: #871b3c
brand-950: #4d0920
```

**teal (verde-azulado — cor secundária):**
```
teal-50:  #f0fafa
teal-100: #d0f0f0
teal-200: #a2e0e0
teal-300: #5fcece
teal-400: #30aaaa
teal-500: #1e8a8a
teal-600: #187878   ← teal principal do logo (sorriso, detalhes)
teal-700: #156060
teal-800: #124e4e
teal-900: #0e3e3e
```

**Plataformas de afiliado:**
- Shopee: `#EE4D2D` (laranja)
- Mercado Livre: `#FFE600` (amarelo, texto preto)
- Amazon: `#FF9900` (laranja Amazon)

### Sombras customizadas
```css
shadow-brand-sm: 0 2px 8px 0 rgba(244, 96, 123, 0.15)
shadow-brand-md: 0 4px 16px 0 rgba(244, 96, 123, 0.25)
shadow-brand-lg: 0 8px 32px 0 rgba(244, 96, 123, 0.30)
```

### Animações customizadas
```css
slide-down: opacity 0→1 + translateY(-8px → 0), 0.2s ease-out
accordion-down / accordion-up: height 0 ↔ auto, 0.2s ease-out
```

### Container
- Centralizado, padding `1.25rem`, max `1200px` (xl) / `1400px` (2xl)

### Tipografia
- **Fonte:** Nunito (Google Fonts) — pesos 400, 500, 600, 700, 800, 900
- CSS var: `var(--font-nunito)` → `font-sans`
- **Títulos H1:** `font-black` (900), grandes
- **Corpo:** 400/500

### Logo
- Bolsa de compras rosa com alça
- Sorriso teal (curva + dois pontos circulares) dentro da bolsa
- Texto: "Achadinhos da" (pequeno, cinza claro) + "Elis" (grande, preto)

### Componentes visuais
- Bordas arredondadas: `rounded-xl` (12px) e `rounded-2xl` (16px)
- Cards com `border border-gray-200 hover:border-brand-300`
- Botão principal: `bg-brand-500 text-white hover:bg-brand-600 rounded-xl font-bold`
- Badges: `bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full`
- Gradiente hero: `from-brand-500 to-rose-400`
- Gradiente editorial box: `from-brand-50 to-rose-50`

---

## BANCO DE DADOS (Schema)

Use Supabase (PostgreSQL) ou SQLite com Prisma ORM. Tabelas e colunas:

### Tabela `Post`
```
id              TEXT (cuid, PK)
slug            TEXT (unique)
titulo          TEXT
resumo          TEXT
conteudoJson    TEXT (JSON stringificado — estrutura detalhada abaixo)
tipo            TEXT ("REVIEW" | "GUIA")
categoria       TEXT ("Sala" | "Quarto" | "Cozinha" | "Lavanderia" | "Varanda" | "Organização")
palavraPrimaria TEXT
metaTitle       TEXT
metaDescription TEXT
status          TEXT default "DRAFT" ("DRAFT" | "REVIEW" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED")
publishedAt     TIMESTAMP nullable
scheduledAt     TIMESTAMP nullable
linksJson       TEXT nullable (JSON: [{palavra, url, tipo: "interno"|"externo", novaAba: bool}])
parentPostId    TEXT nullable (FK para Post.id — post individual → ranking pai)
createdAt       TIMESTAMP default now()
updatedAt       TIMESTAMP
```

### Tabela `Product`
```
id               TEXT (cuid, PK)
slug             TEXT (unique)
nome             TEXT
descricaoCurta   TEXT
categoria        TEXT
imagemUrl        TEXT nullable
marca            TEXT nullable
precoReferencial FLOAT nullable
idShopee         TEXT nullable
idMercadoLivre   TEXT nullable
idAmazon         TEXT nullable
urlShopee        TEXT nullable
urlMercadoLivre  TEXT nullable
urlAmazon        TEXT nullable
prosDefault      TEXT nullable (linhas separadas por \n)
contrasDefault   TEXT nullable (linhas separadas por \n)
createdAt        TIMESTAMP default now()
updatedAt        TIMESTAMP
```

### Tabela `PostProduct` (pivot Post ↔ Product)
```
id             TEXT (cuid, PK)
postId         TEXT (FK → Post.id, cascade delete)
productId      TEXT (FK → Product.id, cascade delete)
posicao        INTEGER
rotuloDestaque TEXT nullable (ex: "Melhor custo-benefício", "Top 1")
resumoCurto    TEXT nullable
pros           TEXT nullable
contras        TEXT nullable
indicadoPara   TEXT nullable
UNIQUE(postId, posicao)
```

### Tabela `AISettings`
```
id               TEXT (cuid, PK)
provider         TEXT default "anthropic" ("anthropic" | "openai" | "gemini")
apiKey           TEXT nullable
model            TEXT nullable
ativo            BOOLEAN default false
promptRanking    TEXT nullable (prompt customizado do admin)
promptIndividual TEXT nullable (prompt customizado do admin)
createdAt        TIMESTAMP default now()
updatedAt        TIMESTAMP
```

### Tabela `AffiliateSettings`
```
id                TEXT (cuid, PK)
amazonTag         TEXT nullable (ex: "achadinhos-20")
shopeeParam       TEXT nullable (ex: "aff_id=XXXXX&sub_id=blog")
mercadoLivreParam TEXT nullable
createdAt         TIMESTAMP default now()
updatedAt         TIMESTAMP
```

---

## ESTRUTURA DO CONTEÚDO JSON — POST REI (Ranking/Pilar)

O campo `conteudoJson` para posts do tipo REI (ranking comparativo):

```json
{
  "introducao": {
    "paragrafo1": "Gancho forte — estatística, dor ou pergunta real",
    "paragrafo2": "Apresenta o tópico e o objetivo do artigo",
    "paragrafo3": "Usa palavra primária naturalmente, promete valor ao leitor"
  },
  "criterios": [
    { "titulo": "Nome do critério", "descricao": "2-3 linhas objetivas" }
  ],
  "ranking": [
    {
      "posicao": 1,
      "nome": "Nome completo do produto",
      "plataforma": "Shopee | Mercado Livre | Amazon",
      "urlOriginal": "https://...",
      "rotuloDestaque": "NOSSA ESCOLHA | MAIOR DESEMPENHO | CUSTO-BENEFÍCIO | \"\"",
      "resumoCurto": "1-2 frases diretas sobre o destaque do produto",
      "pros": ["Pro baseado em dados reais", "..."],
      "contras": ["Contra honesto baseado em dados", "..."],
      "indicadoPara": "Perfil específico do comprador ideal"
    }
  ],
  "secoes_complementares": [
    {
      "titulo_h2": "H2 semântico que expande o tema",
      "paragrafos": ["Parágrafo 1", "Parágrafo 2"]
    }
  ],
  "faq": [
    {
      "pergunta": "Pergunta real de busca long-tail?",
      "resposta": "Resposta direta e objetiva (snippet-ready)"
    }
  ],
  "conclusao": {
    "titulo_h2": "Título da conclusão",
    "paragrafos": ["Recomenda campeão e custo-benefício com palavra primária"]
  },
  "bloco_editorial": "Texto sobre a Elis e a missão do Achadinhos da Elis",
  "metaTitle": "Máx 60 chars, palavra primária no início",
  "metaDescription": "Começa com palavra primária, CTA convidativo, máx 160 chars",
  "resumo": "2-3 frases para cards na home e listagens",
  "slug": "palavra-primaria-em-kebab-case"
}
```

---

## ESTRUTURA DO CONTEÚDO JSON — POST SOLDADO (Review Individual)

O campo `conteudoJson` para posts do tipo SOLDADO (review aprofundado de 1 produto):

```json
{
  "introducao": {
    "paragrafo1": "Gancho: quem precisa deste produto e qual problema resolve",
    "paragrafo2": "Apresenta o produto com palavra primária natural",
    "paragrafo3": "O que o leitor vai descobrir neste artigo"
  },
  "ficha_tecnica": {
    "titulo_h2": "Ficha Técnica",
    "itens": [
      { "campo": "Dimensões", "valor": "XX x XX x XX cm" },
      { "campo": "Material", "valor": "Aço inox" },
      { "campo": "Capacidade", "valor": "X kg" }
    ]
  },
  "sobre_o_produto": {
    "titulo_h2": "O que é e como funciona",
    "paragrafos": ["Baseado na descrição oficial fornecida"]
  },
  "pros_contras": {
    "pros": ["Pro 1 — baseado em dados reais", "Pro 2"],
    "contras": ["Contra honesto — baseado em dados reais ou ausência de info"]
  },
  "para_quem_e": {
    "titulo_h2": "Para Quem Vale a Pena?",
    "paragrafo": "Perfil específico, baseado nos dados do produto"
  },
  "como_usar": {
    "titulo_h2": "Como Usar / Como Instalar",
    "paragrafos": ["Passo a passo baseado nas specs e descrição"]
  },
  "secoes_complementares": [
    {
      "titulo_h2": "Subtema que aprofunda o produto (micro-intenção específica)",
      "paragrafos": ["Parágrafo 1", "Parágrafo 2"]
    }
  ],
  "faq": [
    {
      "pergunta": "Dúvida real de quem pesquisa este produto?",
      "resposta": "Direta, objetiva, snippet-ready"
    }
  ],
  "conclusao": {
    "titulo_h2": "Vale a Pena Comprar?",
    "paragrafos": ["Veredicto honesto com palavra primária + link de retorno ao REI ranking pai"]
  },
  "bloco_editorial": "Texto da Elis sobre a missão do Achadinhos da Elis",
  "metaTitle": "Máx 60 chars, focado no produto",
  "metaDescription": "Começa com palavra primária, máx 160 chars",
  "resumo": "2-3 frases para cards",
  "slug": "nome-produto-em-kebab-case"
}
```

**Nota:** O post SOLDADO é linkado ao post REI via `parentPostId`. Na conclusão, deve haver link de retorno ao ranking pai usando âncora semântica (ex: "confira nosso comparativo completo de [tema do REI]").

---

## PÁGINAS DO SITE PÚBLICO

### `/` — Home
**Seções (de cima para baixo):**

1. **Hero** — gradiente rosa (`from-brand-500 to-rose-400`), título grande "Melhores produtos para a sua casa e decoração", subtítulo, botões "Ver todos os reviews" + "Nossa metodologia"

2. **Post em destaque** — o post publicado mais recente, em card grande (variante `featured`)

3. **Últimas análises** — grid 3 colunas com os outros posts publicados (ReviewCard)

4. **Categorias** — grid 6 colunas com emojis e links:
   - 🛋️ Sala, 🛏️ Quarto, 🍳 Cozinha, 🧺 Lavanderia, 🌿 Varanda, 📦 Organização

5. **Metodologia** — fundo `bg-gray-950` texto branco, 5 passos: Investigação, Imersão, Criação, Comparação, Atualização

6. **CTA Final** — fundo brand-50, botão "Explorar todos os reviews"

---

### `/reviews` — Lista de todos os posts
- Título "Todos os reviews"
- Filtro por categoria (pills clicáveis)
- Grid de ReviewCards
- Só mostra posts com `status = "PUBLISHED"`

---

### `/reviews/[slug]` — Página de review/ranking (POST REI)
**Estrutura da página (em ordem):**
1. Breadcrumb (Início → Categoria → Título)
2. Badge (Review/Guia) + categoria + H1
3. Data de publicação
4. Introdução (3 parágrafos do `introducao`)
5. Box aviso editorial (fundo amarelo claro — "nossas análises são independentes...")
6. TOC — Tabela de Conteúdo com links para H2s (sticky)
7. Critérios de Avaliação — grid 2 colunas com numeração circular (do `criterios[]`)
8. Ranking Completo — cada produto em `ProductHighlightCard`:
   - Posição numerada (#1 com destaque dourado, outros cinza)
   - Badge de rótulo (ex: "NOSSA ESCOLHA") em rosa
   - Nome + resumoCurto
   - Pros (ícone ✓ verde) e Contras (ícone ✗ vermelho)
   - "Para quem é" em itálico
   - Botões de compra afiliado (Shopee/ML/Amazon) via `ProductAffiliateButtons`
9. Seções complementares — H2 + parágrafos (do `secoes_complementares[]`)
10. FAQ — accordion com perguntas/respostas (do `faq[]`)
11. Conclusão — H2 + parágrafos (do `conclusao`)
12. Bloco editorial — box rosado com texto da Elis (do `bloco_editorial`)
13. **AuthorBox** — caixa da autora Elis
14. Artigos relacionados — 3 ReviewCards da mesma categoria

**Metadados:** `metaTitle`, `metaDescription`, Schema.org `Article` + `BreadcrumbList`

---

### `/produto/[slug]` — Página de produto individual (SOLDADO)
1. Breadcrumb
2. Grid 2 colunas: imagem (esquerda, 400px) + info (direita)
   - Badge de marca
   - H1 (nome do produto)
   - Descrição curta
   - Preço referencial em rosa grande
   - Link da categoria
   - Botões de compra afiliado
3. Prós (box verde) e Contras (box vermelho)
4. "Para quem é esse produto?" (box azul)
5. Reviews onde aparece — lista de posts (PostProducts) que incluem este produto
6. **AuthorBox**
7. Aviso de afiliado (box amarelo)

---

### `/categoria/[slug]` — Listagem por categoria
- H1 com emoji da categoria
- Grid de ReviewCards filtrados pela categoria
- Só posts com `status = "PUBLISHED"`

---

### `/sobre` — Sobre a Elis
- Texto institucional sobre a autora
- Missão do blog
- Avatar/foto da Elis (inicial "E" em gradiente rosa)

### `/metodologia` — Metodologia
- 5 passos detalhados com ícones
- Transparência editorial

### `/contato` — Contato
- Canais: e-mail (achadinhosdaelis@gmail.com), Instagram, WhatsApp
- Formulário via FormSubmit (nome, e-mail, assunto, mensagem) — sem backend necessário
- Seção de parcerias com marcas

### `/politica-de-privacidade` — Política de Privacidade
- Texto legal LGPD completo: dados coletados, finalidade, base legal, direitos do usuário, cookies, contato do DPO

### `/politica-de-cookies` — Política de Cookies
- Tipos de cookies: essenciais, analytics (Google Analytics), publicidade (AdSense), afiliados
- Base legal: art. 7º LGPD
- Como gerenciar por browser (Chrome, Firefox, Safari, Edge)

### `/termos-de-uso` — Termos de Uso
- Texto legal padrão: aceitação, conteúdo, limitação de responsabilidade, afiliados, lei aplicável

---

## COMPONENTES PRINCIPAIS

### `ReviewCard`
Card de post para grids:
- Imagem placeholder ou rosa sólido (sem foto por padrão)
- Badge de categoria (brand-100/brand-700)
- Título (2 linhas máx, `font-bold`)
- Resumo (3 linhas máx, `text-sm text-gray-500`)
- Data formatada (`publishedAt`)
- Variante `featured` — card maior horizontal com mais destaque
- Link para `/reviews/[slug]`

### `ProductHighlightCard`
Card de produto dentro de ranking (usado na página `/reviews/[slug]`):
- Número da posição — #1 tem fundo dourado, demais têm fundo cinza
- Badge do rótulo de destaque (rotuloDestaque) em rosa
- Nome do produto
- `resumoCurto` — 1-2 frases
- Pros com ícone ✓ verde e Contras com ícone ✗ vermelho
- "Para quem é" em itálico
- `ProductAffiliateButtons` com URLs afiliadas

### `ProductAffiliateButtons`
Botões de compra por plataforma:
- 🟠 **Shopee** — cor `#EE4D2D` (laranja), texto branco
- 🟡 **Mercado Livre** — cor `#FFE600` (amarelo), texto preto
- 🟠 **Amazon** — cor `#FF9900` (laranja Amazon), texto branco
- Cada botão abre em `target="_blank"` com `rel="noopener noreferrer"`
- Injeta parâmetros de afiliado via `buildAffiliateUrl()`
- Só renderiza botões para URLs que existem no produto

### `AuthorBox`
Aparece no final de reviews e páginas de produto:
- Avatar circular com letra "E" em gradiente rosa (`from-brand-500 to-rose-400`)
- Ícone de caneta no canto inferior direito do avatar
- Nome "Elis" + cargo "Curadora de Casa & Decoração"
- Bio: "Apaixonada por transformar lares com curadoria honesta..."
- Link "Conheça a Elis →" aponta para `/sobre`
- Data: "Publicado em DD de mês de AAAA" (prop `publishedAt`) + "Atualizado em..." (prop `updatedAt`) quando disponível

### `CookieBanner`
- `"use client"` — usa `localStorage`
- Fixed no canto inferior esquerdo (`fixed bottom-4 left-4 z-50`)
- Aparece somente no primeiro acesso (chave: `cookie_consent`)
- Ícone de cookie (emoji ou SVG)
- Texto: "Usamos cookies para melhorar sua experiência. Veja nossa" + link "Política de Cookies"
- Botões:
  - **"Aceitar todos"** — `bg-brand-500 text-white` → salva `"accepted"` no localStorage
  - **"Somente essenciais"** — variant outline → salva `"essential"` no localStorage
- Ambos os botões fecham o banner
- `useState(false)` + `useEffect` para checar localStorage após mount (evita hydration mismatch)

### `Toc` (Tabela de Conteúdo)
- Lista de links para H2s da página
- Sticky durante scroll
- Smooth scroll com offset para o header

### `SiteHeader`
- Logo (bolsa rosa + sorriso teal) + texto "Achadinhos da Elis"
- Links: Reviews | Sala | Quarto | Cozinha | Varanda | Metodologia
- Ativo = underline brand-500
- Menu hamburguer no mobile (`MobileMenu` component)

### `SiteFooter`
- Gradiente rosa de fundo
- Logo branco
- Descrição do blog
- Box aviso de afiliado (fundo branco/10)
- Links agrupados:
  - **Categorias:** Sala, Quarto, Cozinha, Lavanderia, Varanda, Organização
  - **Institucional:** Sobre, Metodologia, Contato, Privacidade, Cookies, Termos
- Copyright

---

## CONSTRUÇÃO DA URL AFILIADA

```typescript
// lib/affiliate.ts
function buildAffiliateUrl(url: string, platform: string, settings: AffiliateSettings): string {
  if (platform === "Amazon" && settings.amazonTag) {
    const u = new URL(url);
    u.searchParams.set("tag", settings.amazonTag);
    return u.toString();
  }
  if (platform === "Shopee" && settings.shopeeParam) {
    return url.includes("?")
      ? `${url}&${settings.shopeeParam}`
      : `${url}?${settings.shopeeParam}`;
  }
  if (platform === "Mercado Livre" && settings.mercadoLivreParam) {
    return url.includes("?")
      ? `${url}&${settings.mercadoLivreParam}`
      : `${url}?${settings.mercadoLivreParam}`;
  }
  return url;
}
```

---

## BACKLINKS AUTOMÁTICOS

O campo `linksJson` no Post armazena um array de backlinks:

```json
[
  { "palavra": "cortina solar", "url": "/reviews/cortinas-solares", "tipo": "interno", "novaAba": false },
  { "palavra": "organização", "url": "https://exemplo.com", "tipo": "externo", "novaAba": true }
]
```

A função `aplicarLinks()` substitui as palavras-âncora no conteúdo HTML/texto antes de renderizar:

```typescript
// lib/links.ts

export interface LinkEntry {
  palavra: string;
  url: string;
  tipo: "interno" | "externo";
  novaAba?: boolean;
}

export function parseLinks(linksJson: string | null | undefined): LinkEntry[] {
  if (!linksJson) return [];
  try { return JSON.parse(linksJson) || []; }
  catch { return []; }
}

export function aplicarLinks(texto: string, links: LinkEntry[]): string {
  if (!texto || !links.length) return texto;

  let resultado = texto;
  for (const link of links) {
    if (!link.palavra || !link.url) continue;

    // Regex que não substitui dentro de atributos HTML existentes
    const escapedPalavra = link.palavra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(?<!['">=])(${escapedPalavra})(?![^<]*>)`, "i");

    const attrs = [
      `href="${link.url}"`,
      link.novaAba || link.tipo === "externo" ? 'target="_blank"' : "",
      link.tipo === "externo" ? 'rel="nofollow noopener noreferrer"' : "",
    ].filter(Boolean).join(" ");

    // Substitui APENAS a primeira ocorrência (evita spam de links)
    resultado = resultado.replace(re, `<a ${attrs}>$1</a>`);
  }
  return resultado;
}
```

**Uso na renderização:** Antes de renderizar qualquer parágrafo do `conteudoJson`, passar o texto por `aplicarLinks(texto, parseLinks(post.linksJson))`.

---

## AUTENTICAÇÃO ADMIN (HTTP Basic Auth)

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const basicAuth = req.headers.get("authorization");
    const adminUser = process.env.ADMIN_USER ?? "elis";
    const adminPass = process.env.ADMIN_SECRET ?? "achadinhos2024";

    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1];
      const [user, pwd] = atob(authValue).split(":");

      if (user === adminUser && pwd === adminPass) {
        return NextResponse.next();
      }
    }

    // Retorna 401 → o browser abre a caixa nativa de usuário/senha
    return new NextResponse("Acesso restrito", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Achadinhos Admin"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

**Importante:** Não implementar login OAuth nem formulário de login. O HTTP Basic Auth usa a caixa de diálogo nativa do browser. É simples e suficiente.

---

## PAINEL ADMIN

**Proteção:** HTTP Basic Auth (veja seção acima)  
**URL base:** `/admin`

### `/admin` — Dashboard
- Contadores em cards: total de posts, publicados, em draft, produtos cadastrados
- Botões rápidos: "+ Novo Post", "+ Novo Produto", "⚙ Config de IA"

### `/admin/posts` — Lista de posts
- Tabela com colunas: título, categoria, tipo, status (badge colorido), data, ações
- Ações: Editar (link), Publicar (botão → muda status para PUBLISHED), Arquivar
- Filtro por status (pills: Todos | Draft | Review | Publicado | Agendado | Arquivado)
- Botão "Novo Post"
- Status badges:
  - DRAFT = `bg-gray-100 text-gray-700`
  - REVIEW = `bg-blue-100 text-blue-700`
  - PUBLISHED = `bg-green-100 text-green-700`
  - SCHEDULED = `bg-purple-100 text-purple-700`
  - ARCHIVED = `bg-red-100 text-red-600`

### `/admin/posts/[id]` — Editor de post
Formulário completo com abas ou seções:

**Aba Básico:**
- Título (text input)
- Palavra Primária (text input) — usada no SEO e no prompt da IA
- Categoria (select: Sala | Quarto | Cozinha | Lavanderia | Varanda | Organização)
- Tipo (radio/select: REVIEW | GUIA)
- Status (select: DRAFT | REVIEW | PUBLISHED | SCHEDULED | ARCHIVED)
- Data de publicação (datetime-local, preenche ao publicar)
- Data de agendamento (datetime-local, só aparece quando status = SCHEDULED)

**Aba Conteúdo:**
- URLs de produtos (textarea, uma URL por linha) → botão "Importar produtos via URL"
  - Ao clicar: chama `POST /api/scrape-produto` para cada URL
  - Exibe loading por produto
  - Resultado: lista de produtos com nome/preço/plataforma/imagem importados
- Campo "Gerar posts com IA":
  - Produtos importados aparecem listados
  - Botão "Gerar posts com IA" → chama `POST /api/gerar-posts-lote`
  - Gera: 1 post ranking + 1 post individual por produto
  - Exibe status de geração em tempo real (loading, sucesso, erro por produto)

**Aba SEO:**
- Meta Title (input, contador de chars, máx 60)
- Meta Description (textarea, contador de chars, máx 160)
- Resumo (textarea, para os cards)
- Slug (gerado automaticamente, editável)

**Aba Backlinks:**
- Painel visual de backlinks (`LinksPanel` component):
  - Botão "+ Adicionar backlink"
  - Cada item: campo "Palavra-âncora" + campo "URL" + select "Tipo" (interno/externo) + toggle "Nova aba"
  - Botão ✕ para remover
  - Serializado como `linksJson`

**Aba Conteúdo JSON:**
- Textarea com o `conteudoJson` gerado (editável diretamente)
- Botão "Formatar JSON"

**Botões de ação:**
- "Salvar rascunho" (PATCH com status atual)
- "Publicar" (PATCH com status = PUBLISHED + publishedAt = now())
- "Agendar" (PATCH com status = SCHEDULED + scheduledAt)

### `/admin/produtos` — Lista de produtos
- Tabela: imagem thumbnail (40px), nome, categoria, preço, plataformas disponíveis, ações
- Ações: Editar, Excluir

### `/admin/produtos/[id]` — Editor de produto
Campos:
- Nome (text)
- Slug (text, gerado automaticamente do nome)
- Descrição curta (textarea)
- Categoria (select)
- Marca (text)
- Preço referencial (number, em R$)
- URL da imagem (text)
- URLs de afiliado: Shopee (text), Mercado Livre (text), Amazon (text)
- IDs de afiliado: ID Shopee, ID Mercado Livre, ID Amazon
- Prós default (textarea, uma por linha)
- Contras default (textarea, uma por linha)

### `/admin/config/afiliados` — Config de afiliados
- Amazon Affiliate Tag (ex: `achadinhos-20`)
- Shopee Affiliate Param (ex: `aff_id=12345&sub_id=blog`)
- Mercado Livre Affiliate Param
- Botão "Salvar"

### `/admin/config/ia` — Config de IA
- **Provider:** radio/select: Anthropic Claude | OpenAI GPT | Google Gemini
- **API Key:** input type="password" com máscara (mostra só últimos 4 dígitos ao salvar)
- **Model:** text input (ex: `claude-haiku-4-5-20251001`, `gpt-4o-mini`, `gemini-1.5-flash`)
- **Toggle "Ativo":** apenas um provider pode estar ativo por vez
- **Prompt Ranking (textarea):** customiza o prompt padrão para posts REI
- **Prompt Individual (textarea):** customiza o prompt padrão para posts SOLDADO
- Botões: "Salvar", "Testar conexão", "Deletar"

---

## APIs (ROTAS DE BACKEND)

### `POST /api/scrape-produto`
**Input:** `{ url: string }`  
**Output:**
```json
{
  "nome": "string",
  "descricaoCompleta": "string",
  "especificacoes": "string",
  "imagemUrl": "string | null",
  "preco": "string | null",
  "marca": "string | null",
  "plataforma": "Shopee | Mercado Livre | Amazon | Genérico",
  "urlOriginal": "string"
}
```
**Lógica de scraping:**
1. Detecta plataforma pela URL (shopee.com.br, mercadolivre.com.br, amazon.com.br)
2. Tenta JSON-LD (`<script type="application/ld+json">`) para dados estruturados
3. Tenta meta tags (og:title, og:description, og:image, og:price)
4. Tenta seletores específicos por plataforma:
   - Mercado Livre: `.ui-pdp-title`, `.andes-money-amount`, `.ui-pdp-description`
   - Shopee: `[data-sqe="name"]`, `.product-briefing`
   - Amazon: `#productTitle`, `#priceblock_ourprice`, `#feature-bullets`
5. Fallback: title tag + primeira imagem grande

### `POST /api/gerar-post`
**Input:** `{ titulo, palavraPrimaria, categoria, tipo, produtos[] }`  
**Output:** JSON com `conteudoJson` completo do post REI  
Gera apenas 1 post ranking via IA (versão simplificada).

### `POST /api/gerar-posts-lote`
**Input:**
```json
{
  "titulo": "string",
  "palavraPrimaria": "string",
  "categoria": "string",
  "tipo": "REVIEW | GUIA",
  "produtos": [{ "nome", "descricaoCompleta", "especificacoes", "preco", "marca", "imagemUrl", "urlOriginal", "plataforma" }],
  "backlinks": [{ "palavra", "url", "tipo" }],
  "status": "DRAFT"
}
```
**Output:**
```json
{
  "ok": true,
  "totalGerados": 4,
  "totalErros": 0,
  "posts": [
    { "id": "...", "slug": "...", "titulo": "...", "tipo": "REI | SOLDADO" }
  ]
}
```
**Lógica:**
1. Gera post REI com `gerarPostRanking()` — usa todos os produtos
2. Salva REI no banco com status informado
3. Para cada produto: gera post SOLDADO com `gerarPostIndividual()` com `parentPostId` = ID do REI
4. Salva cada SOLDADO no banco
5. Upsert de cada produto no banco (cria ou atualiza)
6. Vincula produtos ao post REI via `PostProduct`

### `GET /api/publicar-agendados`
**Query:** `?secret=achadinhos2024`  
Publica posts com `status = "SCHEDULED"` cuja `scheduledAt <= now()`.  
Muda status para `PUBLISHED` e preenche `publishedAt`.  
Configurar como cron job a cada 15 minutos.

### `GET/POST /api/config/ia`
- `GET`: retorna config ativa (apiKey mascarada)
- `POST`: cria ou atualiza config de IA
- `DELETE`: deleta config por ID

### `GET/POST /api/config/afiliados`
- `GET`: retorna config de afiliados
- `POST`: salva/atualiza config

### `GET/POST /api/posts`
- `GET`: lista posts com filtros (status, categoria, tipo)
- `POST`: cria novo post

### `GET/PUT/DELETE /api/posts/[id]`
- Operações de CRUD no post específico

### `GET/POST /api/produtos`
- `GET`: lista produtos
- `POST`: cria produto

### `GET/PUT/DELETE /api/produtos/[id]`
- CRUD de produto

### `GET /api/health`
Diagnóstico do sistema:
- Conexão com banco de dados
- Colunas da tabela Post (`PRAGMA table_info`)
- Tabelas existentes
- Contagem de posts
- Versão do Node.js, DATABASE_URL (prefixo)

---

## FLUXO DE GERAÇÃO DE POSTS COM IA

1. Admin cola URLs de produtos (Shopee, ML, Amazon) no formulário
2. Sistema scrapa cada URL extraindo: nome, descrição, especificações, preço, imagem
3. Admin preenche: título do ranking, palavra primária, categoria
4. Admin adiciona backlinks opcionais (palavra-âncora → URL interna/externa)
5. Clica "Gerar posts com IA" → `POST /api/gerar-posts-lote`:
   - Cria 1 **post REI** (ranking com todos os produtos comparados)
   - Cria 1 **post SOLDADO** por produto (review individual aprofundado)
   - Cria os produtos no banco (upsert por slug)
   - Vincula produtos ao REI via PostProduct
6. Posts ficam como DRAFT — editar e publicar ou agendar

---

## PROMPTS COMPLETOS DE IA

### Prompt REI — PROMPT_PADRAO_RANKING

```
[SYSTEM]
Você é uma redatora especialista em casa & decoração do blog "Achadinhos da Elis".
Sua função é criar o conteúdo REI — o artigo pilar que cobre o tema amplamente,
concentra autoridade e distribui relevância semântica para os artigos individuais (SOLDADOS).

[REGRAS DE VALIDAÇÃO]
Antes de gerar qualquer texto, confirme que os dados dos produtos foram fornecidos.
Use APENAS as informações presentes nos dados fornecidos.
NUNCA invente especificações, preços, avaliações ou recursos que não estejam nos dados.
Se um dado estiver ausente, omita aquela informação (não preencha com suposições).

[IDENTIDADE E TOM]
- Blog feminino e acolhedor: tom de amiga especialista, não de vendedora
- Linguagem natural, humana, clara, concisa e fluida
- Evitar: linguagem robótica, excesso técnico, texto "AI generated", repetição excessiva
- Nunca usar: "vale muito a pena", "clique aqui", "acesse agora" no final de parágrafos
- PROIBIDO: plágio, tradução literal, informações inventadas

[ENGINE DE ESCRITA — FORMAT LOCKING]
- Cada H2: 2 a 3 parágrafos de 3 a 5 linhas cada
- Cada H3: resposta direta e objetiva (snippet-ready para IA generativa)
- Use negrito para termos importantes
- Use bullet points para listas (máximo 6 itens por lista)
- Introdução: gancho forte (estatística, dor, pergunta ou mini-história) + apresenta tópico + declara objetivo + usa palavra primária + promete valor
- Conclusão: resumo dos pontos principais + reafirma campeão e custo-benefício + CTA sem "clique aqui"

[ENGINE SEO SEMÂNTICO — GEO + AEO]
- Palavra primária "{palavraPrimaria}": na 1ª ou 2ª frase, ~1% de densidade (começo, meio e fim)
- Construir CONTEXTO SEMÂNTICO: use entidades, termos relacionados e co-ocorrências naturais
- H3 curtos e diretos para featured snippets e IA generativa (GEO/AEO)
- FAQ com perguntas reais de busca (long-tail naturais como "vale a pena?", "qual o melhor para X?")
- Meta description: palavra primária no início + CTA convidativo (máx 160 chars)

[ARQUITETURA REI & SOLDADOS — INTERLINKING]
Este é o conteúdo REI (pilar). Os produtos individuais serão os SOLDADOS.
O REI deve:
- Cobrir o assunto amplamente (critérios, comparativo, guia de compra)
- Mencionar cada produto do ranking de forma que seja natural linkar para seu artigo individual
- Usar âncoras semânticas contextuais (NUNCA "clique aqui" ou "saiba mais")
- Criar seções que os SOLDADOS possam expandir (ex: "Como instalar", "Qual material escolher")

[ENGINE DE VALIDAÇÃO]
- Palavra primária presente no início (1ª ou 2ª frase), meio e conclusão
- FAQ com mínimo 4 perguntas reais de busca
- Conclusão com recomendação do campeão e do custo-benefício
- Nenhuma informação inventada ou extrapolada
```

### Prompt SOLDADO — PROMPT_PADRAO_INDIVIDUAL

```
[SYSTEM]
Você é uma redatora especialista em casa & decoração do blog "Achadinhos da Elis".
Sua função é criar um artigo SOLDADO — review individual e aprofundado de UM produto,
que resolve uma micro-intenção específica e fortalece o artigo pilar (REI) via link interno.

[REGRAS DE VALIDAÇÃO]
Antes de gerar qualquer texto, confirme que os dados do produto foram fornecidos.
Use APENAS as informações presentes nos dados fornecidos (descrição, specs, avaliações).
NUNCA invente especificações, testes, benchmarks ou avaliações não presentes nos dados.
Se dados de avaliações de consumidores estiverem disponíveis, use-os para embasar prós/contras.
Se ausentes, baseie-se apenas na descrição e especificações — não invente opinião de usuários.

[IDENTIDADE E TOM]
- Tom: especialista honesta, detalhada, direta — como uma amiga que testou o produto
- Linguagem natural e humanizada, sem exageros nem elogios genéricos
- Evitar: "excelente produto", "vale muito a pena", linguagem robótica, repetição
- PROIBIDO: plágio, informações inventadas, testes fictícios, benchmarks inexistentes

[ENGINE DE ESCRITA — FORMAT LOCKING]
- Cada H2: 2 a 3 parágrafos de 3 a 5 linhas
- H3 curtos e diretos para featured snippets
- Prós: lista objetiva baseada nos dados reais do produto
- Contras: lista honesta — sem contras significa produto sem dados suficientes
- Use negrito para specs importantes e pontos de destaque
- Use tabela markdown para ficha técnica quando specs estiverem disponíveis

[ENGINE SEO SEMÂNTICO — GEO + AEO]
- Palavra primária "{palavraPrimaria}": na 1ª ou 2ª frase, ~1% de densidade
- Construir contexto semântico: entidades relacionadas ao produto, termos de busca natural
- H3 como respostas diretas para IA generativa (ex: "É silencioso?", "Suporta quanto peso?")
- FAQ com perguntas reais que alguém faria antes de comprar este produto
- AEO: estruture respostas curtas e diretas que possam ser extraídas por IAs e voice search

[ARQUITETURA REI & SOLDADOS — MICRO-INTENÇÃO]
Este é um artigo SOLDADO. Ele deve:
- Resolver UMA micro-intenção específica (ex: "vale a pena comprar X?", "X é bom para Y?")
- NÃO repetir a keyword principal do REI (evitar canibalização semântica)
- Ter keyword própria focada no produto específico
- Linkar de volta para o artigo REI usando âncora semântica contextual
  (ex: "confira também nosso comparativo completo de [palavra do REI]")
- Aprofundar o que o REI menciona brevemente sobre este produto

[ENGINE DE VALIDAÇÃO]
- Palavra primária na 1ª/2ª frase, meio e conclusão
- Prós e contras baseados em dados reais (nunca inventados)
- FAQ com mínimo 3 perguntas específicas sobre este produto
- Link de retorno ao REI incluído naturalmente no texto
- Veredicto final objetivo: para quem vale a pena e para quem não vale
```

### Como o prompt é construído dinamicamente

O sistema combina o `promptBase` (padrão ou customizado pelo admin) com os dados reais dos produtos:

**Para REI:** substitui `{palavraPrimaria}` → adiciona seção `[INPUT OBRIGATÓRIO]` com título, categoria, tipo → adiciona dados de cada produto (nome, plataforma, URL, preço, marca, descrição, specs, avaliações) → adiciona backlinks se houver → especifica o formato JSON de saída exato

**Para SOLDADO:** mesmo processo mas com dados de 1 único produto; o título gerado é focado no produto específico

**Suporte a múltiplos providers:**
- Anthropic: `POST https://api.anthropic.com/v1/messages`, header `x-api-key`, `anthropic-version: 2023-06-01`
- OpenAI: `POST https://api.openai.com/v1/chat/completions`, header `Authorization: Bearer KEY`
- Gemini: `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key=KEY`
- Modelos padrão: `claude-haiku-4-5-20251001` / `gpt-4o-mini` / `gemini-1.5-flash`
- `max_tokens: 8192` em todos os providers

---

## SEO E METADADOS

- Meta tags completas em todas as páginas
- Open Graph: `og:title`, `og:description`, `og:image`, `og:type`, `og:url`
- Twitter Card: `summary_large_image`
- Schema.org JSON-LD:
  - `Article` + `Person` (autora Elis) nas páginas de review
  - `Product` nas páginas de produto
  - `BreadcrumbList` em todas as páginas internas
- Canonical URLs (evitar conteúdo duplicado)
- Sitemap.xml via Next.js `app/sitemap.ts` — inclui todos os posts PUBLISHED
- `robots.txt` — permite indexação, bloqueia `/admin`
- **Palavra primária:** na 1ª ou 2ª frase, ~1% densidade, no slug + title + meta
- **Meta description:** começa com palavra primária + CTA, máx 160 chars

---

## LGPD / COMPLIANCE

- **Cookie banner** no primeiro acesso (aceitar / somente essenciais) — localStorage
- **Política de Privacidade** completa com dados coletados, finalidade, LGPD arts. 7º e 9º
- **Política de Cookies** com tipos (essenciais, analytics GA, publicidade AdSense, afiliados)
- **Aviso de afiliado** no rodapé E em cada artigo
- **Termos de Uso** padrão
- Google AdSense requer as páginas `/contato` e `/politica-de-privacidade` para aprovação

---

## VARIÁVEIS DE AMBIENTE

```bash
DATABASE_URL="file:./dev.db"           # SQLite local (dev) | URL Supabase (prod)
ADMIN_USER="elis"                       # Usuário do painel admin
ADMIN_SECRET="achadinhos2024"           # Senha do painel admin
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Achadinhos da Elis"
```

---

## CATEGORIAS DO BLOG

```typescript
const CATEGORIAS = ["Sala", "Quarto", "Cozinha", "Lavanderia", "Varanda", "Organização"] as const;
```

Emojis por categoria:
- 🛋️ Sala
- 🛏️ Quarto  
- 🍳 Cozinha
- 🧺 Lavanderia
- 🌿 Varanda
- 📦 Organização

---

## RÓTULOS DE DESTAQUE (PostProduct)

```typescript
const ROTULOS_DESTAQUE = [
  "NOSSA ESCOLHA",
  "MAIOR DESEMPENHO",
  "CUSTO-BENEFÍCIO",
  "MAIS VENDIDO",
  "MELHOR PARA INICIANTES",
  "MELHOR PREMIUM",
  ""  // sem rótulo
];
```

---

## TEXTOS CHAVE DO SITE

**Slogan/descrição:**  
"Curadoria honesta dos melhores produtos para casa e decoração. Pesquisamos, comparamos e selecionamos para você tomar a melhor decisão de compra — sem perder tempo nem dinheiro."

**Bio da Elis:**  
"Apaixonada por transformar lares com curadoria honesta de produtos. Pesquiso, comparo e escrevo sobre o que realmente vale a pena — sem achismos, só com base em dados e experiência real."

**Aviso de afiliado:**  
"Participamos de programas de afiliados da Shopee, Mercado Livre e Amazon. Ao comprar pelos nossos links, podemos receber uma comissão sem custo adicional para você. Isso não influencia nossa independência editorial."

**Email de contato:** achadinhosdaelis@gmail.com

---

## WORKFLOW DE STATUS DE POST

```
DRAFT → REVIEW → PUBLISHED
                ↑
         SCHEDULED (publicação automática via cron quando scheduledAt chega)
                ↓
           ARCHIVED
```

- **DRAFT:** rascunho, só visível no admin
- **REVIEW:** aguardando revisão, só visível no admin
- **PUBLISHED:** visível no site público
- **SCHEDULED:** agendado, publicação automática via cron job
- **ARCHIVED:** arquivado, não visível no site

---

## NOTAS ADICIONAIS PARA O LOVABLE

1. **Admin auth:** HTTP Basic Auth nativo do browser — não implementar login OAuth nem formulário customizado
2. **conteudoJson:** campo TEXT JSON — não normalizar em colunas separadas, manter como JSON string
3. **Status público:** apenas `status === "PUBLISHED"` aparece no site
4. **Scraping simulado:** pode mockar a resposta do scraping inicialmente e integrar depois
5. **IA:** integrar diretamente com Anthropic API (`@anthropic-ai/sdk`) ou OpenAI SDK
6. **Botões afiliado:** SEMPRE `target="_blank"` + `rel="noopener noreferrer"`
7. **Agendamento:** cron job externo chama `GET /api/publicar-agendados?secret=achadinhos2024` a cada 15 min
8. **parentPostId:** liga posts SOLDADO ao REI pai (exibir "leia o ranking completo" no SOLDADO)
9. **linksJson:** backlinks automáticos — substituir palavras-âncora por `<a>` antes de renderizar
10. **Supabase vs SQLite:** para Lovable usar Supabase (PostgreSQL nativo), não SQLite
11. **export const dynamic = "force-dynamic":** necessário em todas as páginas que fazem query ao banco (evitar cache do Next.js)
12. **Posição #1 no ranking:** destaque especial (borda dourada, badge "NOSSA ESCOLHA")
13. **Mobile-first:** todo o design começa pelo mobile; header tem menu hamburguer
14. **Imagens de produto:** usar `<img>` com fallback para placeholder rosa se `imagemUrl` for null
15. **Slugify:** função para gerar slug do título: lowercase, remove acentos, substitui espaços por hífens, remove caracteres especiais
