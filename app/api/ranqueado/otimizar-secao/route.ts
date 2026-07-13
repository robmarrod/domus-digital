/**
 * Otimiza seções específicas do conteudoJson usando os prompts do Redator Blog FDF (ranqueado).
 * Cada seção tem seu prompt especializado extraído da metodologia do mentor.
 *
 * secao: "introducao" | "faq" | "conclusao" | "guia_decisao" | "ranking" | "meta" | "criterios"
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const maxDuration = 300;

const ANO = new Date().getFullYear();

// ── Prompts por seção — extraídos do redator-blog-fdf e reviewer ranqueado ──────────────────

const PROMPTS: Record<string, (ctx: { titulo: string; kw: string; categoria: string; conteudo: Record<string, unknown> }) => string> = {

  introducao: ({ titulo, kw, conteudo }) => `
Você é o Redator Blog FDF do ranqueado — especialista em reviews de produtos para afiliados.
Reescreva a INTRODUÇÃO deste artigo de review.

CONTEXTO:
- Título do artigo: ${titulo}
- Palavra-chave primária: "${kw}"
- Conteúdo atual da introdução: ${JSON.stringify(conteudo.introducao || {})}
- Produtos no ranking: ${JSON.stringify((conteudo.ranking as unknown[] || []).map((r: unknown) => (r as Record<string,unknown>).nome || (r as Record<string,unknown>).produto))}

REGRAS OBRIGATÓRIAS (redator-blog-fdf):
1. Palavra-chave primária EXATA na 1ª linha do paragrafo1
2. Answer-first: abra já respondendo a pergunta implícita do H1 (não enrole)
3. paragrafo1: 4-5 linhas — KW + destaque principal + quantos produtos foram testados
4. paragrafo2: 4-5 linhas — metodologia breve de seleção + para quem serve este guia
5. paragrafo3 (opcional): 3-4 linhas — dica rápida ou critério decisivo
6. Tom: testador independente que pesquisou e conhece os produtos de verdade
7. Blocos citáveis de 40-60 palavras para aparecer em snippets do Google e respostas de IA
8. Variação de frases: alterne curtas (5-10 palavras) com longas (20+) — sem ritmo robótico
9. PROIBIDO: "no mundo de hoje", "nos dias de hoje", "vale ressaltar", "é importante ressaltar",
   "desvendar", "mergulhar fundo", "verdadeiro divisor de águas", "game-changer", "potencializar",
   "alavancar", "robusto", "abrangente", "multifacetado", "de tirar o fôlego", "imperdível" (genérico)

Retorne APENAS JSON com esta estrutura:
{"paragrafo1": "...", "paragrafo2": "...", "paragrafo3": "..."}
`,

  faq: ({ titulo, kw, conteudo }) => `
Você é o Redator Blog FDF do ranqueado — especialista em SEO GEO/AEO (Google, SGE, ChatGPT).
Gere o FAQ perfeito para este artigo de review.

CONTEXTO:
- Título: ${titulo}
- Palavra-chave primária: "${kw}"
- Produtos: ${JSON.stringify((conteudo.ranking as unknown[] || []).map((r: unknown) => (r as Record<string,unknown>).nome || (r as Record<string,unknown>).produto))}
- FAQ atual: ${JSON.stringify(conteudo.faq || [])}

REGRAS OBRIGATÓRIAS (GEO/AEO + Blog FDF):
1. 5-6 perguntas REAIS que um comprador faria antes de decidir
2. Cada resposta: 2-4 linhas diretas — answer-first (resposta na 1ª linha)
3. Blocos citáveis de 40-60 palavras por resposta (perfeito para snippets e SGE)
4. A KW primária "${kw}" aparece em pelo menos 1 pergunta e 1 resposta
5. Perguntas de cauda longa (ex: "Qual o melhor X para quem tem Y?", "Vale a pena comprar X para Z?")
6. PROIBIDO: perguntas óbvias demais como "O que é X?" — foque em dúvidas de quem está decidindo
7. Inclua: diferença entre os produtos, para quem cada um é melhor, dúvida sobre preço/custo-benefício
8. FAQ é o ÚLTIMO H2 — nada de conteúdo vem depois dele (exceto disclaimer)
9. Respostas sem clichês de IA, diretas como uma especialista amiga responderia

Retorne APENAS JSON array:
[{"pergunta": "...", "resposta": "..."}, ...]
`,

  conclusao: ({ titulo, kw, conteudo }) => `
Você é o Redator Blog FDF do ranqueado.
Reescreva a CONCLUSÃO + GUIA DE DECISÃO deste artigo de review.

CONTEXTO:
- Título: ${titulo}
- Palavra-chave primária: "${kw}"
- Produtos no ranking: ${JSON.stringify((conteudo.ranking as unknown[] || []).map((r: unknown) => {
    const r2 = r as Record<string,unknown>;
    return { nome: r2.nome || r2.produto, rotuloDestaque: r2.rotuloDestaque };
  }))}
- Conclusão atual: ${JSON.stringify(conteudo.conclusao || {})}

REGRAS OBRIGATÓRIAS:
1. paragrafo1: Síntese do que foi testado + critério mais importante para a decisão (4-5 linhas)
2. paragrafo2: Qual produto é melhor para cada perfil — direto e prático (4-5 linhas)
   Ex: "Se o seu orçamento é X, vá de [produto A]. Se precisa de Y, o [produto B] entrega mais."
3. paragrafo3 (opcional): CTA natural (3-4 linhas) — sem pressão de venda, como uma indicação de amigo
   Ex: "Conferir o preço atual na Amazon vale a pena — ele costuma variar bastante."
4. NÃO repetir literalmente o que foi dito na introdução
5. Tom: amigo especialista que testou tudo e está recomendando de verdade
6. Variação de frases, sem clichês de IA
7. A conclusão vem ANTES do FAQ no artigo

Retorne APENAS JSON:
{"paragrafo1": "...", "paragrafo2": "...", "paragrafo3": "..."}
`,

  guia_decisao: ({ titulo, kw, conteudo }) => `
Você é o Redator Blog FDF do ranqueado.
Crie/reescreva o GUIA DE DECISÃO FINAL ("Qual é o certo para você?") deste artigo.

CONTEXTO:
- Título: ${titulo}
- Palavra-chave primária: "${kw}"
- Produtos disponíveis: ${JSON.stringify((conteudo.ranking as unknown[] || []).map((r: unknown) => {
    const r2 = r as Record<string,unknown>;
    return { nome: r2.nome || r2.produto, posicao: r2.posicao, rotuloDestaque: r2.rotuloDestaque };
  }))}

REGRAS OBRIGATÓRIAS:
1. Crie 3-5 perfis de comprador diferentes (budget, mid-range, premium, uso específico, etc.)
2. Para cada perfil: descrição do perfil + produto recomendado + motivo objetivo (1 linha)
3. Perfis realistas — baseados nos tipos de compradores que buscam "${kw}"
4. Linguagem direta: "Se você é X → escolha [produto] porque Y"
5. O guia vem ANTES do FAQ no artigo

Retorne APENAS JSON:
{
  "titulo_h2": "Qual é o melhor ${kw.split(" ").slice(0, 3).join(" ")} para você?",
  "perfis": [
    {"perfil": "...", "produto_recomendado": "...", "motivo": "..."}
  ]
}
`,

  ranking: ({ kw, conteudo }) => `
Você é o Redator Blog FDF do ranqueado — especialista em reviews de produtos.
Melhore os BLOCOS DE PRODUTO do ranking deste artigo de review.

CONTEXTO:
- Palavra-chave primária: "${kw}"
- Ranking atual: ${JSON.stringify(conteudo.ranking || [])}

REGRAS OBRIGATÓRIAS (redator-blog-fdf ETAPA 4):
Para CADA produto no ranking, melhore os seguintes campos:

1. resumoCurto (150-300 palavras):
   - Linha 1: KW primária "${kw}" + destaque principal do produto
   - Para quem é indicado este produto
   - Tecnologias e diferenciais em NEGRITO
   - Que problema específico ele resolve
   - Tom de testador que pesquisou avaliações reais
   - Answer-first: abra com o que mais importa

2. pros (array, 3-5 itens):
   - Diferenciais objetivos e verificáveis
   - Baseados em características reais do produto
   - Específicos, não genéricos (evite "boa qualidade", "vale a pena")
   - Ex: "Motor 1200W — mais rápido que a maioria do segmento", "Silencioso abaixo de 65dB"

3. contras (array, 2-3 itens):
   - Limitações reais do produto
   - Não invente — se não souber, mantenha o que existe ou use limitações óbvias do segmento
   - Ex: "Não tem função de vapor", "Cabo curto (1,2m) dificulta em ambientes grandes"

4. indicadoPara (string, 1-2 linhas):
   - Perfil específico do comprador ideal
   - Ex: "Quem precisa de potência máxima sem preocupar com ruído"

PROIBIDO: inventar especificações, notas ou avaliações
Tom: testador independente e honesto, sem exagero de vendedor

Retorne o array ranking COMPLETO com TODOS os produtos, melhorados:
[{"posicao": 1, "nome": "...", "rotuloDestaque": "...", "resumoCurto": "...", "pros": [...], "contras": [...], "indicadoPara": "..."}]
`,

  criterios: ({ titulo, kw, conteudo }) => `
Você é o Redator Blog FDF do ranqueado.
Reescreva os CRITÉRIOS DE AVALIAÇÃO deste artigo de review.

CONTEXTO:
- Título: ${titulo}
- Palavra-chave primária: "${kw}"
- Critérios atuais: ${JSON.stringify(conteudo.criterios || [])}
- Produtos avaliados: ${JSON.stringify((conteudo.ranking as unknown[] || []).map((r: unknown) => (r as Record<string,unknown>).nome || (r as Record<string,unknown>).produto))}

REGRAS OBRIGATÓRIAS:
1. 4-6 critérios objetivos que realmente importam para quem compra "${kw}"
2. Cada critério: título curto + descrição de 3-5 linhas explicando POR QUE esse critério importa
3. Answer-first: descrição abre com o que mais importa para o comprador
4. Critérios específicos do nicho — não genéricos como "qualidade" sem explicação
5. Mostre autoridade: "Testamos X horas", "Com base em Y avaliações de compradores"
6. Variação de frases, sem clichês de IA

Retorne APENAS JSON array:
[{"titulo": "...", "descricao": "..."}, ...]
`,

  meta: ({ titulo, kw }) => `
Você é um especialista em SEO on-page e meta tags.
Gere meta title e meta description otimizados para este artigo.

CONTEXTO:
- Título completo do artigo: ${titulo}
- Palavra-chave primária: "${kw}"
- Ano atual: ${ANO}

REGRAS OBRIGATÓRIAS:
Meta Title (EXATAMENTE 50-60 caracteres — contar com precisão):
- KW primária "${kw}" preferencialmente no início
- Inclua "${ANO}" se couber naturalmente
- Diferencie do título do artigo — seja mais direto e clicável
- Exemplo de fórmula: "[KW]: Top [N] de ${ANO} | [benefício principal]"

Meta Description (EXATAMENTE 150-160 caracteres — contar com precisão):
- KW primária "${kw}" nos primeiros 30 caracteres
- Benefício concreto + critério de seleção + CTA suave
- CTA ex: "Confira agora", "Veja qual vale mais", "Compare antes de comprar"
- Sem ponto final (o Google corta e fica feio)
- Não repetir literalmente o meta title

Retorne APENAS JSON:
{"metaTitle": "...", "metaDescription": "..."}

IMPORTANTE: Verifique a contagem de caracteres antes de retornar.
metaTitle: entre 50 e 60 chars.
metaDescription: entre 150 e 160 chars.
`,
};

// ── Helper IA (mesmo padrão de lib/ai.ts) ────────────────────────────────────────────────────

async function chamarIA(provider: string, apiKey: string, model: string, prompt: string): Promise<string> {
  if (provider === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: model || "claude-opus-4-8", max_tokens: 4000, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `Anthropic ${res.status}`);
    return data.content?.[0]?.text || "";
  } else if (provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ model: model || "gpt-4o", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `OpenAI ${res.status}`);
    return data.choices?.[0]?.message?.content || "";
  } else {
    const m = model || "gemini-1.5-pro";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `Gemini ${res.status}`);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { postId, secao } = await req.json() as { postId: string; secao: string };

    if (!postId || !secao) {
      return NextResponse.json({ error: "postId e secao são obrigatórios" }, { status: 400 });
    }

    const gerarPrompt = PROMPTS[secao];
    if (!gerarPrompt) {
      return NextResponse.json({ error: `Seção desconhecida: ${secao}` }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });

    const aiConfig = await prisma.aISettings.findFirst({ where: { ativo: true } });
    if (!aiConfig?.apiKey) return NextResponse.json({ error: "Nenhum provedor de IA configurado" }, { status: 422 });

    const conteudo = JSON.parse(post.conteudoJson || "{}") as Record<string, unknown>;
    const prompt = gerarPrompt({ titulo: post.titulo, kw: post.palavraPrimaria, categoria: post.categoria, conteudo });

    const raw = await chamarIA(aiConfig.provider, aiConfig.apiKey, aiConfig.model || "", prompt);

    // extrai o JSON da resposta (a IA pode retornar markdown com ```json)
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || raw.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]).trim() : raw.trim();

    let valor: unknown;
    try {
      valor = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: "IA não retornou JSON válido", raw }, { status: 500 });
    }

    // para seção "meta", retornamos os dois campos separados
    if (secao === "meta") {
      const meta = valor as { metaTitle: string; metaDescription: string };
      return NextResponse.json({ ok: true, secao, metaTitle: meta.metaTitle, metaDescription: meta.metaDescription });
    }

    // para as demais seções, retornamos o campo que deve ser atualizado no conteudoJson
    return NextResponse.json({ ok: true, secao, valor });

  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
