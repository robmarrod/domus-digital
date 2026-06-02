import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PROMPT_EXTRACAO = `Você é um extrator especializado em dados de produtos de e-commerce.
Analise o conteúdo fornecido (screenshot ou texto de uma página de produto) e extraia as informações.

REGRAS IMPORTANTES:
- Extraia APENAS informações que estão CLARAMENTE visíveis/presentes no conteúdo
- NUNCA invente dados, especificações ou preços
- Se um campo não estiver presente, deixe vazio ("")
- Para "plataforma", identifique: "Mercado Livre", "Shopee", "Amazon" ou "Outro"
- Para "especificacoes", extraia tabelas de specs, ficha técnica, dimensões, material, etc.
- Para "descricaoCompleta", extraia a descrição completa do produto, título + subtítulos + benefícios

Retorne SOMENTE um JSON válido, sem markdown, sem \`\`\`json:
{
  "nome": "Nome completo do produto como aparece na página",
  "marca": "Marca/fabricante se disponível",
  "preco": "Preço como aparece na página (ex: R$ 89,90) ou vazio",
  "descricaoCompleta": "Descrição completa do produto extraída da página",
  "especificacoes": "Especificações técnicas, ficha técnica, tabela de specs",
  "imagemUrl": "URL da imagem principal do produto se visível, senão vazio",
  "plataforma": "Mercado Livre | Shopee | Amazon | Outro"
}`;

type AIProvider = "anthropic" | "openai" | "gemini";

interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

async function extrairComAnthropic(
  config: AIConfig,
  tipo: "imagem" | "texto",
  imagem?: string,
  mimeType?: string,
  texto?: string
): Promise<string> {
  // Use vision model for images
  const model =
    tipo === "imagem"
      ? config.model.includes("claude-3") || config.model.includes("claude-opus") || config.model.includes("claude-sonnet") || config.model.includes("claude-haiku")
        ? config.model
        : "claude-opus-4-5"
      : config.model || "claude-haiku-4-5-20251001";

  const content =
    tipo === "imagem" && imagem
      ? [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType || "image/jpeg",
              data: imagem,
            },
          },
          { type: "text", text: PROMPT_EXTRACAO },
        ]
      : PROMPT_EXTRACAO + "\n\n[CONTEÚDO DA PÁGINA]\n" + (texto ?? "");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      messages: [{ role: "user", content }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

async function extrairComOpenAI(
  config: AIConfig,
  tipo: "imagem" | "texto",
  imagem?: string,
  mimeType?: string,
  texto?: string
): Promise<string> {
  const model = tipo === "imagem" ? "gpt-4o" : config.model || "gpt-4o-mini";

  const content =
    tipo === "imagem" && imagem
      ? [
          {
            type: "image_url",
            image_url: { url: `data:${mimeType || "image/jpeg"};base64,${imagem}` },
          },
          { type: "text", text: PROMPT_EXTRACAO },
        ]
      : PROMPT_EXTRACAO + "\n\n[CONTEÚDO DA PÁGINA]\n" + (texto ?? "");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content }],
      max_tokens: 2048,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function extrairComGemini(
  config: AIConfig,
  tipo: "imagem" | "texto",
  imagem?: string,
  mimeType?: string,
  texto?: string
): Promise<string> {
  const model = config.model || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

  const parts =
    tipo === "imagem" && imagem
      ? [
          { inline_data: { mime_type: mimeType || "image/jpeg", data: imagem } },
          { text: PROMPT_EXTRACAO },
        ]
      : [{ text: PROMPT_EXTRACAO + "\n\n[CONTEÚDO DA PÁGINA]\n" + (texto ?? "") }];

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { maxOutputTokens: 2048 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

function parseJSON(rawText: string): Record<string, unknown> {
  const clean = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* ignore */ }
    }
    throw new Error("IA não retornou JSON válido. Tente novamente ou use texto.");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo, imagem, mimeType, texto } = body as {
      tipo: "imagem" | "texto";
      imagem?: string;
      mimeType?: string;
      texto?: string;
    };

    if (tipo === "imagem" && !imagem) {
      return NextResponse.json({ error: "Imagem é obrigatória" }, { status: 400 });
    }
    if (tipo === "texto" && (!texto || texto.trim().length < 20)) {
      return NextResponse.json({ error: "Texto muito curto. Cole o conteúdo completo da página." }, { status: 400 });
    }

    // Busca config de IA ativa
    const aiConfig = await prisma.aISettings.findFirst({ where: { ativo: true } });
    if (!aiConfig) {
      return NextResponse.json({ error: "Nenhuma configuração de IA ativa. Configure em Admin → Config → IA." }, { status: 400 });
    }

    if (!aiConfig.apiKey) {
      return NextResponse.json({ error: "API Key não configurada. Configure em Admin → Config → IA." }, { status: 400 });
    }

    const config: AIConfig = {
      provider: aiConfig.provider as AIProvider,
      apiKey: aiConfig.apiKey,
      model: aiConfig.model ?? "claude-haiku-4-5-20251001",
    };

    let rawText = "";
    if (config.provider === "anthropic") {
      rawText = await extrairComAnthropic(config, tipo, imagem, mimeType, texto);
    } else if (config.provider === "openai") {
      rawText = await extrairComOpenAI(config, tipo, imagem, mimeType, texto);
    } else if (config.provider === "gemini") {
      rawText = await extrairComGemini(config, tipo, imagem, mimeType, texto);
    } else {
      return NextResponse.json({ error: `Provedor desconhecido: ${config.provider}` }, { status: 400 });
    }

    const extracted = parseJSON(rawText);

    // Normaliza e retorna no formato ProdutoImportado
    return NextResponse.json({
      nome: String(extracted.nome || "Produto sem nome"),
      marca: String(extracted.marca || ""),
      preco: String(extracted.preco || ""),
      descricaoCompleta: String(extracted.descricaoCompleta || ""),
      especificacoes: String(extracted.especificacoes || ""),
      imagemUrl: String(extracted.imagemUrl || ""),
      plataforma: String(extracted.plataforma || "Outro"),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
