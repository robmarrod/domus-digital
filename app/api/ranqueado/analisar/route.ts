import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PROMPT_ANALISAR = `Você é um revisor SEO especialista que analisa artigos de blog de review/afiliado.

Analise o artigo abaixo e pontue nas 5 categorias da rubrica (total 100 pts):

**1. Qualidade do Conteúdo (30 pts)**
- Clareza, profundidade, utilidade prática
- Ausência de clichês de IA ("vale ressaltar", "no mundo de hoje", "de tirar o fôlego", etc.)
- Variação de tamanho de frases (burstiness — texto humano mistura frases curtas e longas)
- Experiência real demonstrada, não paráfrase genérica

**2. Otimização SEO (25 pts)**
- Palavra-chave primária no H1, nos primeiros 100 palavras e distribuída naturalmente (0,5-1%)
- Palavras-chave secundárias presentes
- Meta title (50-60 chars) e meta description (150-160 chars) otimizados
- Hierarquia de headings correta (H1 único, H2 para seções principais, H3 para subseções)

**3. GEO + AEO (20 pts)**
- FAQ presente como último H2 com perguntas naturais que usuários fariam
- Respostas diretas no início dos parágrafos (para snippets)
- Citação implícita ou explícita de fontes (marcas, estudos, dados)
- Schema markup sugerido

**4. Monetização (15 pts)**
- CTAs de afiliado presentes e naturais (não forçados)
- Comparativo com prós/contras
- Botões de compra ou links de afiliado
- Transparência sobre comissão (disclaimer)

**5. Técnico (10 pts)**
- Alt text em imagens
- Links internos presentes
- Sem erros de formatação
- Tempo de leitura adequado (1000-2500 palavras para reviews)

**Detecção de IA (penaliza Categoria 1):**
Frases proibidas PT-BR: "no mundo de hoje", "nos dias de hoje", "vale ressaltar", "é importante ressaltar", "em suma", "desvendar", "mergulhar fundo", "verdadeiro divisor de águas", "game-changer", "potencializar", "alavancar", "robusto", "abrangente", "multifacetado", "não é segredo que", "sem sombra de dúvidas", "de tirar o fôlego", "imperdível" (genérico vazio)

**Gate bloqueante:** score < 90 ou qualquer problema P0 = reprovado.

**Problemas P0 (bloqueantes):**
- Copiar/parafrasear diretamente concorrente
- KW stuffing (densidade > 2%)
- H1 ausente ou duplicado
- Sem FAQ
- Forte presença de padrões de IA

Retorne APENAS JSON com esta estrutura exata:
{
  "score": 78,
  "aprovado": false,
  "categorias": {
    "qualidade": { "pontos": 22, "max": 30, "observacoes": "..." },
    "seo": { "pontos": 20, "max": 25, "observacoes": "..." },
    "geo_aeo": { "pontos": 14, "max": 20, "observacoes": "..." },
    "monetizacao": { "pontos": 12, "max": 15, "observacoes": "..." },
    "tecnico": { "pontos": 10, "max": 10, "observacoes": "..." }
  },
  "problemas_p0": [],
  "frases_ia_encontradas": [],
  "burstiness": "ok",
  "recomendacoes": ["ação 1", "ação 2"]
}`;

async function chamarIA(provider: string, apiKey: string, model: string, prompt: string): Promise<string> {
  if (provider === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: model || "claude-opus-4-8", max_tokens: 2000, messages: [{ role: "user", content: prompt }] }),
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
    const userMessage = `${PROMPT_ANALISAR}

---

Título: ${post.titulo}
Palavra-chave primária: ${post.palavraPrimaria}
Meta Title: ${post.metaTitle || ""}
Meta Description: ${post.metaDescription || ""}

CONTEÚDO:
${JSON.stringify(conteudo, null, 2)}`;

    const resultado = await chamarIA(aiConfig.provider, aiConfig.apiKey, aiConfig.model || "", userMessage);
    const jsonMatch = resultado.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: "IA não retornou JSON válido", raw: resultado }, { status: 500 });
    const analise = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ ok: true, analise });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
