import { NextRequest, NextResponse } from "next/server";
import { scrapeProduto } from "@/lib/scraper";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 });
    }

    // Validação básica de URL
    try { new URL(url); } catch {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    const produto = await scrapeProduto(url);
    return NextResponse.json(produto);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
