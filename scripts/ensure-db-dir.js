// Garante que o diretório do banco SQLite existe antes do build
const { mkdirSync, existsSync } = require("fs");

const url = process.env.DATABASE_URL || "";
if (!url.startsWith("file:")) {
  console.log("DATABASE_URL não é SQLite, pulando criação de diretório.");
  process.exit(0);
}

const filePath = url.replace("file:", "");
const dir = filePath.substring(0, filePath.lastIndexOf("/"));

if (!dir) {
  console.log("Caminho relativo detectado, pulando criação de diretório.");
  process.exit(0);
}

if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
  console.log(`✓ Diretório do banco criado: ${dir}`);
} else {
  console.log(`✓ Diretório do banco já existe: ${dir}`);
}
