// Garante que o diretório do banco SQLite existe antes do build
const { mkdirSync, existsSync } = require("fs");
const path = require("path");

const url = process.env.DATABASE_URL || "";
if (!url.startsWith("file:")) {
  console.log("DATABASE_URL não é SQLite, pulando criação de diretório.");
  process.exit(0);
}

// Resolve caminho relativo (./dev.db) para absoluto
let filePath = url.replace("file:", "");
if (!path.isAbsolute(filePath)) {
  filePath = path.resolve(process.cwd(), filePath);
}

const dir = path.dirname(filePath);

if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
  console.log(`✓ Diretório do banco criado: ${dir}`);
} else {
  console.log(`✓ Diretório do banco já existe: ${dir}`);
}

// Testa se o diretório é gravável tentando criar o arquivo do banco
const { openSync, closeSync } = require("fs");
try {
  const fd = openSync(filePath, "a");
  closeSync(fd);
  console.log(`✓ Arquivo do banco acessível: ${filePath}`);
} catch (e) {
  console.error(`✗ ERRO: Não foi possível acessar o banco em: ${filePath}`);
  console.error(`  Verifique as permissões do diretório ou configure DATABASE_URL com um caminho absoluto gravável.`);
  console.error(`  Exemplo: file:/home/u535437239/domains/domusdigital.com.br/database/domus.db`);
  // Não aborta — deixa o prisma migrate tentar e logar o erro específico
}
