#!/bin/bash
# deploy.sh — rode no VPS para atualizar o site
# Uso: bash deploy.sh

set -e

echo "🔄 Atualizando Achadinhos da Elis..."

cd /var/www/achadinhos

# Puxar alterações do GitHub
git pull origin main

# Instalar novas dependências (se houver)
npm install

# Rodar migrations (seguro — só aplica o que ainda não foi)
node_modules/.bin/prisma migrate deploy

# Build de produção
npm run build

# Reiniciar aplicação
pm2 restart achadinhos

echo "✅ Deploy concluído! Site atualizado."
pm2 status
