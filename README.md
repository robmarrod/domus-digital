# Achadinhos da Elis

Blog de reviews e curadoria de produtos para **casa e decoração**, construído com Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui e Prisma ORM + SQLite.

---

## Pré-requisitos

- Node.js 18+
- npm 9+

---

## Instalação e primeiros passos

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores:

```bash
cp .env.example .env
```

O arquivo `.env` padrão já está configurado para SQLite local:

```env
DATABASE_URL="file:./dev.db"
ADMIN_SECRET="achadinhos2024"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Achadinhos da Elis"
```

### 3. Criar o banco de dados e rodar as migrações

```bash
npx prisma migrate dev --name init
```

### 4. Popular o banco com dados de exemplo

```bash
npm run db:seed
# ou diretamente:
node_modules/.bin/ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

O seed cria:
- 5 produtos de casa & decoração (cortinas, tapete, luminária)
- 1 post de review completo sobre cortinas de varanda
- Configurações de afiliado de exemplo

### 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse:
- **Site público:** http://localhost:3000
- **Painel admin:** http://localhost:3000/admin

---

## Estrutura do projeto

```
.
├── app/
│   ├── (site)/               # Grupo de rotas do site público
│   │   ├── layout.tsx        # Layout com header + footer
│   │   ├── page.tsx          # Home
│   │   ├── reviews/
│   │   │   ├── page.tsx      # Lista de reviews
│   │   │   └── [slug]/       # Página de review individual
│   │   ├── produto/[slug]/   # Página de produto individual
│   │   ├── categoria/[slug]/ # Listagem por categoria
│   │   ├── sobre/            # Página institucional
│   │   ├── metodologia/      # Página de metodologia
│   │   ├── politica-de-privacidade/
│   │   └── termos-de-uso/
│   ├── (admin)/              # Grupo de rotas do admin
│   │   └── admin/
│   │       ├── layout.tsx    # Layout com sidebar
│   │       ├── page.tsx      # Dashboard
│   │       ├── posts/        # CRUD de posts
│   │       ├── produtos/     # CRUD de produtos
│   │       └── config/afiliados/
│   ├── api/                  # Route handlers
│   │   ├── posts/
│   │   ├── produtos/
│   │   └── config/afiliados/
│   ├── layout.tsx            # Root layout
│   └── globals.css
├── components/
│   ├── ui/                   # Componentes shadcn/ui
│   ├── admin/                # Componentes do painel admin
│   ├── site-header.tsx
│   ├── site-footer.tsx
│   ├── review-card.tsx
│   ├── product-highlight-card.tsx
│   ├── product-affiliate-buttons.tsx
│   └── toc.tsx
├── lib/
│   ├── prisma.ts             # Cliente Prisma singleton
│   ├── affiliate.ts          # Helper de URLs de afiliado
│   ├── utils.ts              # Utilitários gerais
│   └── types.ts              # Tipos TypeScript compartilhados
├── hooks/
│   └── use-toast.ts
├── prisma/
│   ├── schema.prisma         # Schema do banco de dados
│   └── seed.ts               # Dados de exemplo
└── ...config files
```

---

## Banco de dados

### Modelo de dados

| Tabela | Descrição |
|--------|-----------|
| `Post` | Reviews e guias publicados |
| `Product` | Produtos cadastrados com links de afiliado |
| `PostProduct` | Tabela pivot que relaciona posts e produtos (ranking) |
| `AffiliateSettings` | Parâmetros de rastreamento por plataforma |

### Comandos úteis

```bash
# Visualizar banco no Prisma Studio
npm run db:studio

# Criar nova migration após alterar o schema
npx prisma migrate dev --name nome_da_migration

# Resetar banco (apaga todos os dados!)
npx prisma migrate reset

# Gerar client após alterar schema
npx prisma generate
```

### Migrar para PostgreSQL (pós-MVP)

1. Altere o `provider` no `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Atualize a `DATABASE_URL` no `.env` com a string de conexão Postgres
3. Rode `npx prisma migrate dev`

---

## Painel Admin

O admin está disponível em `/admin`. Para o MVP, **não há autenticação complexa** — o acesso é direto.

Para adicionar proteção básica em produção, configure um middleware em `middleware.ts` que valide o `ADMIN_SECRET` via cookie ou header.

### Funcionalidades do admin

- **Dashboard:** métricas de posts e produtos + últimos posts
- **Posts:** criar, listar, editar (com JSON de conteúdo gerado por IA)
- **Produtos:** cadastrar produtos com links Shopee, ML e Amazon
- **Afiliados:** configurar parâmetros de rastreamento por plataforma

---

## Sistema de conteúdo

### Estrutura do `conteudoJson`

O campo `conteudoJson` de cada post aceita a seguinte estrutura JSON:

```json
{
  "introducao": {
    "paragrafo1": "Texto...",
    "paragrafo2": "Texto...",
    "paragrafo3": "Texto (opcional)..."
  },
  "criterios": [
    { "titulo": "Resistência UV", "descricao": "Texto..." }
  ],
  "secoes_complementares": [
    {
      "titulo_h2": "Como escolher...",
      "conteudo": ["Parágrafo 1...", "Parágrafo 2..."]
    }
  ],
  "faq": [
    { "pergunta": "Pergunta?", "resposta": "Resposta..." }
  ],
  "conclusao": {
    "paragrafo1": "Texto...",
    "paragrafo2": "Texto...",
    "paragrafo3": "Texto (opcional)..."
  },
  "bloco_editorial": {
    "titulo": "Sobre a curadoria...",
    "texto": "Texto..."
  }
}
```

### Helper de afiliados (`lib/affiliate.ts`)

```typescript
import { buildAffiliateUrl } from "@/lib/affiliate";

const url = buildAffiliateUrl("amazon", rawUrl, {
  amazonTag: "seutag-20",
  shopeeParam: "af_id=seusite",
  mercadoLivreParam: "matt_tool=seusite",
});
```

---

## Deploy

### Render (recomendado para MVP)

1. Crie um novo Web Service no Render apontando para o repositório
2. Configure as variáveis de ambiente
3. Build command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
4. Start command: `npm start`

### Hostinger (Node.js)

1. Configure Node.js 18+ no painel
2. Faça upload dos arquivos ou conecte via Git
3. Rode `npm install && npx prisma generate && npx prisma migrate deploy`
4. Inicie com `npm start` ou via PM2

> **Nota:** Para produção, migre para PostgreSQL. SQLite não é recomendado para múltiplas instâncias.

---

## GitHub + Deploy Automático (CI/CD)

### Subir o projeto no GitHub pela primeira vez

```bash
# Instale o GitHub CLI (se ainda não tiver)
brew install gh

# Rode o script de setup interativo
bash setup-github.sh
```

O script faz tudo automaticamente:
- Configura seu nome/e-mail no git
- Autentica no GitHub via browser
- Cria o repositório (privado por padrão)
- Faz o primeiro commit e push

---

### GitHub Actions — Secrets necessários

Após criar o repositório, acesse:
**`github.com/SEU_USUARIO/achadinhos-da-elis/settings/secrets/actions`**

Adicione estes secrets para o deploy automático funcionar:

| Secret | Descrição | Exemplo |
|--------|-----------|---------|
| `VPS_HOST` | IP do seu VPS Hostinger | `123.456.789.10` |
| `VPS_USER` | Usuário SSH (geralmente `root`) | `root` |
| `VPS_SSH_KEY` | Chave SSH privada completa | `-----BEGIN OPENSSH...` |
| `VPS_PORT` | Porta SSH (padrão 22) | `22` |
| `NEXT_PUBLIC_SITE_URL` | URL do site em produção | `https://seudominio.com.br` |

### Gerar chave SSH para o GitHub Actions

```bash
# No seu Mac — gerar par de chaves
ssh-keygen -t ed25519 -C "github-actions-achadinhos" -f ~/.ssh/achadinhos_deploy

# Copiar a chave PÚBLICA para o VPS
ssh-copy-id -i ~/.ssh/achadinhos_deploy.pub root@IP_DO_VPS

# Ver a chave PRIVADA (colar no secret VPS_SSH_KEY do GitHub)
cat ~/.ssh/achadinhos_deploy
```

### Como funciona o deploy automático

```
Você edita código no Mac
       ↓
git push origin main
       ↓
GitHub Actions detecta o push
       ↓
Roda npm build para verificar
       ↓
Conecta no VPS via SSH
       ↓
git pull + npm build + pm2 restart
       ↓
✅ Site atualizado em ~2 minutos!
```

---

## Licença

Projeto privado — todos os direitos reservados.
