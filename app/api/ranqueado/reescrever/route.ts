import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PROMPT_REESCREVER = `Você é um redator SEO especialista em reviews de produtos para blogs de afiliado (Blog FDF).

Você receberá um artigo com score baixo ou problemas identificados. Sua tarefa é reescrever as seções fracas mantendo a estrutura geral.

**REGRAS OBRIGATÓRIAS:**
- NUNCA use clichês de IA: "vale ressaltar", "no mundo de hoje", "de tirar o fôlego", "verdadeiro divisor de águas", "potencializar", "alavancar", "robusto", "abrangente", "multifacetado", "desvendar", "mergulhar fundo"
- Varie o tamanho das frases (misture curtas de 5-10 palavras com longas de 20+)
- Mantenha a palavra-chave primária entre 0,5% e 1% de densidade
- FAQ obrigatório como último H2 com 4-6 perguntas naturais
- Inclua CTAs de afiliado naturais (não forçados)
- Tom: próximo, prático, como uma amiga que testou o produto

Retorne APENAS o JSON melhorado com a mesma estrutura do conteudoJson original, sem texto adicional.`;

async function chamarIA(provider: string, apiKey: string, model: string, prompt: string): Promise<string> {
  if (provider === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: model || "claude-opus-4-8", max_tokens: 8000, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "";
  } else if (provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ model: model || "gpt-4o", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  } else {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model || "gemini-1.5-pro"}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { postId, secoes } = await req.json();
    if (!postId) return NextResponse.json({ error: "postId obrigatório" }, { status: 400 });

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });

    const aiConfig = await prisma.aISettings.findFirst({ where: { ativo: true } });
    if (!aiConfig?.apiKey) return NextResponse.json({ error: "Nenhum provedor de IA configurado" }, { status: 422 });

    const conteudo = JSON.parse(post.conteudoJson || "{}");
    const userMessage = `${PROMPT_REESCREVER}

Título: ${post.titulo}
Palavra-chave primária: ${post.palavraPrimaria}
Categoria: ${post.categoria}
${secoes ? `Seções a melhorar especificamente: ${secoes}` : "Melhore as seções com menor qualidade SEO e de conteúdo."}

CONTEÚDO ATUAL (JSON):
${JSON.stringify(conteudo, null, 2)}`;

    const resultado = await chamarIA(aiConfig.provider, aiConfig.apiKey, aiConfig.model || "", userMessage);
    const jsonMatch = resultado.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: "IA não retornou JSON válido", raw: resultado }, { status: 500 });
    const novoConteudo = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ ok: true, conteudoJson: JSON.stringify(novoConteudo) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
