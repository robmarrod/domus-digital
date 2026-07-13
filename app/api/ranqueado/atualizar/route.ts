import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const maxDuration = 300;

const ANO_ATUAL = new Date().getFullYear();

const PROMPT_ATUALIZAR = `Você é um editor de conteúdo SEO especialista em manter artigos de blog atualizados e relevantes.

Sua tarefa é atualizar o artigo para ${ANO_ATUAL}, tornando-o mais atual e competitivo nas buscas.

**O QUE ATUALIZAR:**
1. Substituir referências a anos anteriores por "${ANO_ATUAL}"
2. Atualizar o H1/título para incluir "${ANO_ATUAL}" se ainda não tiver
3. Tornar a introdução mais atual (sem inventar dados novos — diga "em ${ANO_ATUAL}")
4. Melhorar o FAQ com perguntas mais relevantes para o momento atual
5. Adicionar ou atualizar a conclusão com perspectiva atual
6. Manter TODOS os links de afiliado existentes intactos

**REGRAS:**
- Não invente preços, dados ou especificações que não estavam no original
- Mantenha o mesmo tom e estrutura
- NUNCA use clichês de IA
- Mantenha a palavra-chave primária com densidade 0,5-1%

Retorne APENAS o JSON atualizado com a mesma estrutura do conteudoJson original, sem texto adicional.`;

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
    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ error: "postId obrigatório" }, { status: 400 });

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });

    const aiConfig = await prisma.aISettings.findFirst({ where: { ativo: true } });
    if (!aiConfig?.apiKey) return NextResponse.json({ error: "Nenhum provedor de IA configurado" }, { status: 422 });

    const conteudo = JSON.parse(post.conteudoJson || "{}");
    const userMessage = `${PROMPT_ATUALIZAR}

Título atual: ${post.titulo}
Palavra-chave primária: ${post.palavraPrimaria}

CONTEÚDO ATUAL (JSON):
${JSON.stringify(conteudo, null, 2)}`;

    const resultado = await chamarIA(aiConfig.provider, aiConfig.apiKey, aiConfig.model || "", userMessage);
    const jsonMatch = resultado.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: "IA não retornou JSON válido", raw: resultado }, { status: 500 });
    const novoConteudo = JSON.parse(jsonMatch[0]);

    let novoTitulo = post.titulo;
    if (!novoTitulo.includes(String(ANO_ATUAL))) {
      novoTitulo = novoTitulo.replace(/\b20\d{2}\b/, String(ANO_ATUAL));
      if (!novoTitulo.includes(String(ANO_ATUAL))) {
        novoTitulo = `${novoTitulo} (${ANO_ATUAL})`;
      }
    }

    return NextResponse.json({ ok: true, conteudoJson: JSON.stringify(novoConteudo), titulo: novoTitulo });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
