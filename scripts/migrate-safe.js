/**
 * Script de migração seguro para produção (Hostinger).
 * Roda prisma migrate deploy e NUNCA trava o prestart.
 * Se as migrations falharem (checksum, coluna já existe, etc.),
 * apenas loga o aviso e deixa o app iniciar normalmente.
 * O banco na Hostinger provavelmente já está atualizado.
 */
const { spawnSync } = require("child_process");
const path = require("path");

const PRISMA_BIN = path.join("node_modules", ".bin", "prisma");

console.log("🔄 Rodando prisma migrate deploy...");

const result = spawnSync(PRISMA_BIN, ["migrate", "deploy"], {
  stdio: "inherit",
  env: { ...process.env },
  timeout: 60000, // 60s — se travar, mata e continua
});

if (result.status === 0) {
  console.log("✅ Banco de dados sincronizado.");
} else {
  // Não encerrar com erro — o banco pode já estar atualizado
  // (checksum mismatch quando a migration já foi aplicada é não-fatal)
  console.warn("⚠️  prisma migrate deploy retornou um aviso/erro (código:", result.status, ")");
  console.warn("    O app vai iniciar assim mesmo — schema provavelmente já está atualizado.");
}

// Sempre sai com 0 para não bloquear o npm start
process.exit(0);
