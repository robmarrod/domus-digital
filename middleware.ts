import { NextRequest, NextResponse } from "next/server";

// Rotas de API que precisam ficar acessíveis SEM Basic Auth:
// - imagem-proxy: chamada anonimamente pelo <img> do site público
// - publicar-agendados: chamada pelo cron da Hostinger, que não manda header
//   de Basic Auth — já tem sua própria checagem por ?secret=
const API_PUBLICAS = ["/api/imagem-proxy", "/api/publicar-agendados"];

// Cookie de sessão pós-login. Necessário porque o Basic Auth do browser fica
// preso ao DIRETÓRIO onde a credencial foi digitada (/admin/) e não se
// propaga sozinho para fetch()s em /api/ — sem esse cookie, a página do
// admin carrega mas toda chamada fetch("/api/...") dela toma 401.
const COOKIE_NAME = "admin_session";

async function sha256Hex(texto: string): Promise<string> {
  const dados = new TextEncoder().encode(texto);
  const hash = await crypto.subtle.digest("SHA-256", dados);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Todo o resto de /api/* só é consumido pelas páginas dentro de /admin (que já
// exigem login) — sem isso, qualquer um na internet podia chamar rotas que
// disparam geração de IA (custo real em dinheiro) ou reescrevem/apagam posts
// e produtos direto no banco, sem autenticação nenhuma.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const precisaAuth =
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/api/") && !API_PUBLICAS.some((p) => pathname === p || pathname.startsWith(p + "/")));

  if (!precisaAuth) return NextResponse.next();

  // Sem valor padrão de propósito: este repo é público, então uma senha
  // fallback no código seria uma senha conhecida. Sem as envs, ninguém entra.
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_SECRET;
  if (!adminUser || !adminPass) {
    return NextResponse.json({ error: "Admin não configurado (ADMIN_USER/ADMIN_SECRET)" }, { status: 503 });
  }
  const sessionEsperada = await sha256Hex(`${adminUser}:${adminPass}`);

  // 1. Cookie de sessão já validado nesta origem — cobre /admin e /api juntos.
  if (req.cookies.get(COOKIE_NAME)?.value === sessionEsperada) {
    return NextResponse.next();
  }

  // 2. Basic Auth (prompt nativo do browser em /admin, ou header explícito
  // vindo de uma ferramenta/script batendo direto na API).
  const basicAuth = req.headers.get("authorization");
  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1] ?? "";
    const [user, pwd] = atob(authValue).split(":");

    if (user === adminUser && pwd === adminPass) {
      const res = NextResponse.next();
      res.cookies.set(COOKIE_NAME, sessionEsperada, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
      return res;
    }
  }

  // Para rotas de API, um 401 JSON é mais útil pro fetch() do que a caixa
  // nativa de login do browser (que só faz sentido navegando /admin).
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Retorna 401 → o browser abre a caixa nativa de usuário/senha
  return new NextResponse("Acesso restrito", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Domus Admin"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
