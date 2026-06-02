import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { gerarPostComIA, AIConfig, AIProvider, DadosParaPost } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { titulo, palavraPrimaria, categoria, tipo, produtos } = body;

    if (!titulo || !palavraPrimaria || !categoria || !produtos?.length) {
      return NextResponse.json(
        { error: "Campos obrigatórios: titulo, palavraPrimaria, categoria, produtos" },
        { status: 400 }
      );
    }

    // Busca configuração de IA ativa
    const aiConfig = await prisma.aISettings.findFirst({ where: { ativo: true } });
    if (!aiConfig || !aiConfig.apiKey) {
      return NextResponse.json(
        { error: "Nenhum provedor de IA configurado. Acesse Admin → Configurações → IA." },
        { status: 422 }
      );
    }

    const config: AIConfig = {
      provider: aiConfig.provider as AIProvider,
      apiKey: aiConfig.apiKey,
      model: aiConfig.model || "",
    };

    const dados: DadosParaPost = {
      titulo,
      palavraPrimaria,
      categoria,
      tipo: tipo || "REVIEW",
      produtos,
      modoGeracao: "ranking",
    };

    const resultado = await gerarPostComIA(config, dados);
    return NextResponse.json(resultado);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
