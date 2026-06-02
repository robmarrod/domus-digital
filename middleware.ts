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
