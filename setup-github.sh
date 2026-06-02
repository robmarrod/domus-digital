#!/bin/bash
# =============================================================
# setup-github.sh — Conecta o projeto ao GitHub automaticamente
# Uso: bash setup-github.sh
# =============================================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Achadinhos da Elis → GitHub Setup      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# ---------- 1. Verificar pré-requisitos ----------
echo -e "${YELLOW}[1/6] Verificando pré-requisitos...${NC}"

if ! command -v git &> /dev/null; then
  echo -e "${RED}❌ git não encontrado. Instale via: xcode-select --install${NC}"
  exit 1
fi

if ! command -v gh &> /dev/null; then
  echo -e "${RED}❌ GitHub CLI (gh) não encontrado.${NC}"
  echo "   Instale com: brew install gh"
  echo "   Depois rode este script novamente."
  exit 1
fi

echo -e "${GREEN}✓ git e gh encontrados${NC}"

# ---------- 2. Configurar git ----------
echo ""
echo -e "${YELLOW}[2/6] Configurando git...${NC}"

CURRENT_NAME=$(git config --global user.name 2>/dev/null || echo "")
CURRENT_EMAIL=$(git config --global user.email 2>/dev/null || echo "")

if [ -z "$CURRENT_NAME" ]; then
  read -p "   Seu nome completo (para o git): " GIT_NAME
  git config --global user.name "$GIT_NAME"
fi

if [ -z "$CURRENT_EMAIL" ]; then
  read -p "   Seu e-mail do GitHub: " GIT_EMAIL
  git config --global user.email "$GIT_EMAIL"
fi

echo -e "${GREEN}✓ git configurado: $(git config --global user.name) <$(git config --global user.email)>${NC}"

# ---------- 3. Autenticar no GitHub ----------
echo ""
echo -e "${YELLOW}[3/6] Autenticando no GitHub...${NC}"

if ! gh auth status &> /dev/null; then
  echo "   Abrindo browser para login no GitHub..."
  gh auth login --web --git-protocol https
else
  echo -e "${GREEN}✓ Já autenticado no GitHub${NC}"
fi

# ---------- 4. Inicializar repositório local ----------
echo ""
echo -e "${YELLOW}[4/6] Inicializando repositório local...${NC}"

if [ ! -d ".git" ]; then
  git init
  git branch -M main
  echo -e "${GREEN}✓ Repositório inicializado${NC}"
else
  echo -e "${GREEN}✓ Repositório já existe${NC}"
fi

# ---------- 5. Criar repositório no GitHub ----------
echo ""
echo -e "${YELLOW}[5/6] Criando repositório no GitHub...${NC}"

read -p "   Nome do repositório [achadinhos-da-elis]: " REPO_NAME
REPO_NAME=${REPO_NAME:-achadinhos-da-elis}

read -p "   Visibilidade? [private/public] (Enter = private): " VISIBILITY
VISIBILITY=${VISIBILITY:-private}

if gh repo view "$REPO_NAME" &> /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Repositório já existe, conectando...${NC}"
  GITHUB_USER=$(gh api user --jq '.login')
  git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git" 2>/dev/null || \
    git remote set-url origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
else
  gh repo create "$REPO_NAME" --"$VISIBILITY" --source=. --remote=origin --push=false
  echo -e "${GREEN}✓ Repositório criado: $(gh repo view $REPO_NAME --json url -q .url)${NC}"
fi

# ---------- 6. Primeiro commit e push ----------
echo ""
echo -e "${YELLOW}[6/6] Fazendo commit e push...${NC}"

git add .
git commit -m "🏡 feat: projeto inicial Achadinhos da Elis

- Next.js 14 App Router + TypeScript + Tailwind CSS
- Prisma ORM + SQLite (MVP)
- Site público: home, reviews, produtos, categorias, institucionais
- Painel admin: posts, produtos, configurações de afiliados
- APIs REST com validação Zod
- GitHub Actions: CI + Deploy automático para VPS
- Helper de afiliados: Shopee, Mercado Livre, Amazon"

git push -u origin main

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Projeto no GitHub com sucesso!       ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
GITHUB_USER=$(gh api user --jq '.login')
echo -e "🔗 Repositório: ${BLUE}https://github.com/$GITHUB_USER/$REPO_NAME${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos para deploy automático:${NC}"
echo "   1. Abra: https://github.com/$GITHUB_USER/$REPO_NAME/settings/secrets/actions"
echo "   2. Adicione os secrets do VPS (veja README.md → seção Deploy)"
echo "   3. Todo push na branch 'main' fará deploy automático!"
echo ""
