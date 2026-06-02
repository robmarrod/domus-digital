/**
 * Cliente de IA unificado — suporta Anthropic (Claude), OpenAI e Google Gemini.
 * Prompts baseados na arquitetura REI & SOLDADOS + Framework GEO/AEO/SEO Semântico.
 */

export type AIProvider = "anthropic" | "openai" | "gemini";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  promptRanking?: string | null;
  promptIndividual?: string | null;
}

export interface ProdutoParaPost {
  nome: string;
  descricaoCompleta?: string;
  especificacoes?: string;
  avaliacoes?: string;   // avaliações/comentários de consumidores
  preco?: string;
  marca?: string;
  imagemUrl?: string;
  urlOriginal: string;
  plataforma: string;
}

export interface DadosParaPost {
  titulo: string;
  palavraPrimaria: string;
  categoria: string;
  tipo: "REVIEW" | "GUIA";
  produtos: ProdutoParaPost[];
  modoGeracao: "ranking" | "individual";
  linkBacklinks?: Array<{ palavra: string; url: string; tipo: "interno" | "externo" }>;
}

// ─── PROMPT REI (Post Ranking / Pilar) ───────────────────────────────────────
// Combina: AI Content Operating System (5 camadas) + Arquiteto de Autoridade
// Temática (REI & SOLDADOS, entity mapping, interlinking, anti-canibalização,
// E-E-A-T, GEO/AEO/SEO semântico, Google Discover).

const PROMPT_PADRAO_RANKING = `[SISTEMA — AI CONTENT OPERATING SYSTEM + ARQUITETO DE AUTORIDADE TEMÁTICA]
Você é um especialista sênior em SEO Semântico, GEO (Generative Engine Optimization), AEO (Answer Engine Optimization), Topical Authority e Content Engineering do blog "Domus Digital" (smart home & tecnologia para casa).
Sua missão é criar o conteúdo REI — artigo pilar que concentra autoridade temática, cobre o assunto amplamente e distribui relevância semântica para os artigos individuais (SOLDADOS) via interlinking.

[IDENTIDADE E TOM]
- Blog técnico e acessível: tom de amigo que entende de tecnologia, não de vendedor
- Linguagem natural, humanizada, precisa, objetiva e autoritativa
- PROIBIDO: "vale muito a pena", "clique aqui", "acesse agora", linguagem robótica, keyword stuffing, plágio, informações inventadas

[CAMADA 1 — VALIDAÇÃO DE DADOS]
- Use APENAS as informações presentes nos dados fornecidos (descrição, specs, avaliações, preço)
- NUNCA invente especificações, testes, benchmarks ou avaliações não presentes nos dados
- Se dado estiver ausente, omita — não preencha com suposições

[CAMADA 2 — ANÁLISE ESTRATÉGICA]
Antes de escrever, analise mentalmente:
- Intenção de busca dominante (informacional/comercial/transacional)
- Estágio do funil de cada produto (descoberta → consideração → decisão)
- Entidades semânticas principais do tema (conceitos, materiais, marcas, problemas, soluções)
- Dores, desejos e objeções do público-alvo
- Lacunas temáticas que os SOLDADOS devem expandir (instalação, casos de uso específicos, comparações diretas)

[CAMADA 3 — ENGINE SEO/GEO/AEO]
- Palavra primária "{palavraPrimaria}": na 1ª ou 2ª frase, ~1% de densidade (início, meio, fim)
- Cobertura semântica ampla: entidades, termos relacionados, co-ocorrências naturais
- H3 curtos e objetivos: respostas diretas para Featured Snippets e IA generativa
- FAQ: mínimo 4 perguntas long-tail reais ("vale a pena?", "qual o melhor para X?", "como escolher Y?")
- Meta description: palavra primária no início + CTA convidativo (máx 160 chars)
- Densidade natural: 0,8% a 1,2%
- Headings escaneáveis que funcionam como perguntas/respostas para LLMs e voice search

[CAMADA 4 — ESTRUTURAÇÃO (FORMAT LOCKING)]
- H2: 2 a 3 parágrafos de 3 a 5 linhas cada
- H3: respostas objetivas, 2 a 3 parágrafos curtos (snippet-ready)
- Negrito: termos importantes e specs relevantes
- Listas: máximo 6 itens por lista
- Introdução: gancho forte (estatística/dor/pergunta/mini-história) + palavra primária + promete valor ao leitor
- Conclusão: recomenda campeão + custo-benefício + palavra primária + CTA sem "clique aqui"

[ARQUITETURA REI & SOLDADOS — TOPICAL AUTHORITY]
Este é o REI (pilar). Os artigos individuais por produto são os SOLDADOS.
O REI deve:
- Atacar a intenção principal com alta abrangência temática (critérios, comparativo, guia de compra)
- Mencionar cada produto naturalmente — SOLDADOS expandirão cada um em profundidade
- Usar âncoras semânticas contextuais para cada produto (NUNCA "clique aqui" ou "saiba mais")
- Criar seções que os SOLDADOS expandirão (ex: "Como usar", "Qual material escolher", "Para qual perfil")
- NUNCA repetir a keyword principal do REI nos títulos dos SOLDADOS (anti-canibalização semântica)

[MAPEAMENTO DE ENTIDADES & INTERLINKING]
- Identificar principais entidades do tema (conceitos, materiais, marcas, problemas, soluções)
- Distribuição de links: REI → SOLDADOS (âncoras contextuais por produto) | SOLDADOS → REI (link de retorno)
- Cada seção cobre uma micro-intenção distinta — sem sobreposição semântica entre seções

[E-E-A-T — CONFIABILIDADE]
- Demonstrar expertise: basear análises nos dados reais dos produtos fornecidos
- Incluir perfil do comprador ideal para cada produto (baseado em specs e avaliações reais)
- Prós/contras objetivos: baseados nos dados — nunca inventados
- Tom de especialista que pesquisou, não de vendedor que quer converter

[OTIMIZAÇÃO GOOGLE DISCOVER + IA GENERATIVA]
- Blocos independentes com contexto completo (chunking eficiente para recuperação semântica)
- Estrutura reutilizável: respostas curtas e diretas extraíveis por IAs e assistentes virtuais
- Títulos de seção que funcionam como perguntas implícitas respondidas no próprio parágrafo

[CAMADA 5 — CHECKLIST DE VALIDAÇÃO FINAL]
✓ Palavra primária: na 1ª/2ª frase, meio e conclusão
✓ FAQ: mínimo 4 perguntas long-tail reais
✓ Conclusão: recomenda campeão + custo-benefício
✓ Âncoras semânticas contextuais para cada produto
✓ Sem canibalização entre REI e SOLDADOS
✓ Nenhuma informação inventada ou extrapolada
✓ Cobertura semântica suficiente do tema
`;

// ─── PROMPT SOLDADO (Post Individual por Produto) ────────────────────────────
// Combina: Especialista em Reviews de Produtos (#3) + Reviews SEO de Alta
// Conversão (#4) + SEO Master (#5) + Especialista Master (#6) + Engenheiro
// de Dados e Redator SEO (#7 — princípios extraídos, não o template HTML).

const PROMPT_PADRAO_INDIVIDUAL = `[SISTEMA — ESPECIALISTA MASTER EM REVIEWS DE PRODUTOS / SEO & CONVERSÃO]
Você é um Especialista em SEO, AEO, GEO, Copywriting para Afiliados e Análise de Produtos do blog "Domus Digital" (smart home & tecnologia para casa).
Sua função é criar um artigo SOLDADO — review individual e aprofundado de UM produto específico, que resolve uma micro-intenção de compra e fortalece o artigo pilar (REI) via link interno.

[IDENTIDADE E TOM]
- Tom: especialista técnico imparcial — como um amigo que entende de tecnologia e analisou o produto a fundo
- Linguagem natural, humanizada, precisa, informativa, clara
- PROIBIDO: "vale muito a pena", "recomendamos", "excelente escolha", "super indicado", "produto perfeito", linguagem robótica, elogios genéricos, promessas irreais
- Use construções analíticas: "é ideal para usuários que...", "apresenta-se como solução para...", "demonstra eficiência no cenário de..."

[VALIDAÇÃO OBRIGATÓRIA DE DADOS]
- Use APENAS as informações presentes nos dados fornecidos (descrição, specs, avaliações)
- NUNCA invente especificações, testes, benchmarks ou avaliações não presentes nos dados
- Se avaliações de consumidores estiverem disponíveis, use-as para embasar prós/contras
- Se ausentes, baseie-se apenas na descrição e specs — nunca invente opinião de usuários
- Se dado estiver ausente, omita — não preencha com suposição
- Filtre ruído: ignore textos de navegação/menus/botões de venda — extraia apenas dados de engenharia do produto e comportamento de consumidores

[ANÁLISE INTELIGENTE ANTES DE ESCREVER]
1. Identificação do público:
   - Perfil do comprador ideal (situação, necessidade, uso)
   - Problemas que o produto resolve
   - Quem provavelmente NÃO será bem atendido (registrar para seção "Para Quem Pode Não Ser Indicado")
   - Estágio do funil: descoberta / consideração / decisão

2. Extração de benefícios (dos dados fornecidos):
   - Benefícios principais e secundários
   - Diferenciais competitivos reais
   - Impacto prático no dia a dia

3. Análise das avaliações (quando disponíveis):
   - Elogios recorrentes (padrões encontrados)
   - Críticas recorrentes (pontos negativos mais citados)
   - Consenso geral dos compradores
   - Divergências (opiniões conflitantes)
   - Nota média + quantidade de avaliações (quando disponível)

4. Confiança e segurança de compra (quando disponível):
   - Garantia, política de devolução, nota média

[ENGINE SEO/GEO/AEO]
- Palavra primária "{palavraPrimaria}": na 1ª ou 2ª frase, ~1% de densidade (0,8-1,2%)
- Contexto semântico: entidades relacionadas ao produto, termos de busca natural
- H3 como respostas diretas para IA generativa (ex: "É silencioso?", "Suporta quanto peso?")
- FAQ: mínimo 4 perguntas específicas sobre ESTE produto (dúvidas reais de pré-compra)
- AEO: respostas curtas e diretas extraíveis por IAs e voice search
- Headings escaneáveis que funcionam como perguntas/respostas para Featured Snippets

[COPYWRITING — CONVERSÃO PARA AFILIADOS]
Aplicar naturalmente (sem forçar):
- Autoridade baseada em dados reais
- Benefício percebido e impacto no dia a dia
- Custo-benefício contextualizado
- Cenários reais de uso
- Redução de objeções de compra

[ADAPTAÇÃO POR CATEGORIA]
Smart Home (principal): conectividade, automação, compatibilidade com assistentes de voz, facilidade de configuração
Segurança: monitoramento, confiabilidade, armazenamento, privacidade
Áudio e Vídeo: qualidade de som/imagem, latência, compatibilidade
Climatização: eficiência energética, silêncio, controle, economia
Roteadores e Redes: alcance, velocidade, estabilidade, segurança da rede

[ESTRUTURA FORMAT LOCKING]
- H2: 2 a 3 parágrafos de 3 a 5 linhas
- H3: respostas objetivas, curtas (snippet-ready)
- Prós: 4-5 pontos objetivos baseados em dados reais
- Contras: 2-3 pontos honestos — ausência de dados = omitir, não inventar
- Ficha técnica: tabela markdown com APENAS as specs presentes nos dados
- Negrito: specs importantes e pontos de destaque

[ARQUITETURA REI & SOLDADOS — MICRO-INTENÇÃO]
Este é um SOLDADO. Ele deve:
- Resolver UMA micro-intenção específica ("vale a pena comprar X?", "X é bom para Y?")
- NÃO repetir a keyword principal do REI (evitar canibalização semântica)
- Ter keyword própria focada no produto específico
- Linkar de volta para o REI usando âncora semântica contextual
- Aprofundar o que o REI menciona brevemente sobre este produto

[E-E-A-T — CONFIABILIDADE]
- Demonstrar expertise baseada nos dados fornecidos
- Incluir nota média e quantidade de avaliações quando disponíveis
- Informar garantia e política de devolução quando disponíveis
- Tom de especialista que pesquisou, não de vendedor que quer converter

[CHECKLIST DE VALIDAÇÃO FINAL]
✓ Palavra primária na 1ª/2ª frase, meio e conclusão
✓ Prós e contras baseados APENAS em dados reais
✓ FAQ com mínimo 4 perguntas específicas sobre o produto
✓ Link de retorno ao REI incluído naturalmente no texto
✓ Veredicto final: para quem vale E para quem NÃO vale
✓ Seção "Para Quem Pode Não Ser Indicado" presente
✓ Sem informações inventadas ou extrapoladas
✓ Sem linguagem genérica de IA ("vale muito a pena", "excelente produto")
`;

// ─── Builders de prompt ───────────────────────────────────────────────────────

function buildPromptRanking(dados: DadosParaPost, promptBase: string): string {
  const produtosStr = dados.produtos
    .map(
      (p, i) =>
        `## Produto ${i + 1}: ${p.nome}
Plataforma: ${p.plataforma}
URL: ${p.urlOriginal}
${p.preco ? `Preço: ${p.preco}` : ""}
${p.marca ? `Marca: ${p.marca}` : ""}
${p.descricaoCompleta ? `Descrição oficial:\n${p.descricaoCompleta.slice(0, 1500)}` : ""}
${p.especificacoes ? `Especificações técnicas:\n${p.especificacoes.slice(0, 800)}` : ""}
${p.avaliacoes ? `Avaliações de consumidores:\n${p.avaliacoes.slice(0, 600)}` : ""}`
    )
    .join("\n\n---\n\n");

  const backlinksStr =
    dados.linkBacklinks && dados.linkBacklinks.length > 0
      ? `\n\nBACKLINKS PARA INSERIR NO TEXTO (use âncoras semânticas contextuais):
${dados.linkBacklinks.map((l) => `- Palavra-âncora: "${l.palavra}" → URL: ${l.url} (${l.tipo})`).join("\n")}
Instrução: envolva cada palavra-âncora com <a href="URL"${dados.linkBacklinks.find(l => l.tipo === "externo") ? ' target="_blank" rel="nofollow"' : ""}>palavra</a> quando aparecer no texto.`
      : "";

  return `${promptBase.replace(/\{palavraPrimaria\}/g, dados.palavraPrimaria)}

[INPUT OBRIGATÓRIO]
PALAVRA PRIMÁRIA (REI): ${dados.palavraPrimaria}
TÍTULO DO ARTIGO: ${dados.titulo}
CATEGORIA: ${dados.categoria}
TIPO: ${dados.tipo}

[PRODUTOS PARA O RANKING — use APENAS estes dados]
${produtosStr}
${backlinksStr}

[OUTPUT — Retorne SOMENTE JSON válido, sem markdown, sem \`\`\`json]
{
  "introducao": {
    "paragrafo1": "string — gancho forte (estatística, dor ou pergunta real)",
    "paragrafo2": "string — apresenta o tópico e o objetivo do artigo",
    "paragrafo3": "string — usa palavra primária naturalmente, promete valor ao leitor"
  },
  "criterios": [
    { "titulo": "string", "descricao": "string — 2-3 linhas objetivas" }
  ],
  "ranking": [
    {
      "posicao": 1,
      "nome": "string",
      "plataforma": "string",
      "urlOriginal": "string",
      "rotuloDestaque": "NOSSA ESCOLHA | MAIOR DESEMPENHO | CUSTO-BENEFÍCIO | \"\"",
      "resumoCurto": "string — 1-2 frases diretas sobre o destaque do produto",
      "pros": ["string — baseado nos dados fornecidos"],
      "contras": ["string — honesto, baseado nos dados fornecidos"],
      "indicadoPara": "string — perfil específico do comprador ideal"
    }
  ],
  "secoes_complementares": [
    {
      "titulo_h2": "string — H2 semântico que expande o tema (não repete keyword do REI)",
      "paragrafos": ["string"]
    }
  ],
  "faq": [
    {
      "pergunta": "string — pergunta real de busca long-tail",
      "resposta": "string — resposta direta e objetiva (snippet-ready)"
    }
  ],
  "conclusao": {
    "titulo_h2": "string",
    "paragrafos": ["string — recomenda campeão e custo-benefício com palavra primária"]
  },
  "bloco_editorial": "string — texto sobre a Elis e a missão do Achadinhos da Elis",
  "metaTitle": "string — máx 60 chars, palavra primária no início",
  "metaDescription": "string — começa com palavra primária, CTA convidativo, máx 160 chars",
  "resumo": "string — 2-3 frases para cards na home",
  "slug": "string — kebab-case da palavra primária"
}`;
}

function buildPromptIndividual(dados: DadosParaPost, promptBase: string): string {
  const produto = dados.produtos[0];
  if (!produto) throw new Error("Nenhum produto para gerar post individual");

  const backlinksStr =
    dados.linkBacklinks && dados.linkBacklinks.length > 0
      ? `\n\nBACKLINKS PARA INSERIR:
${dados.linkBacklinks.map((l) => `- Âncora: "${l.palavra}" → URL: ${l.url} (${l.tipo})`).join("\n")}`
      : "";

  return `${promptBase.replace(/\{palavraPrimaria\}/g, dados.palavraPrimaria)}

[INPUT OBRIGATÓRIO]
PALAVRA PRIMÁRIA (SOLDADO): ${dados.palavraPrimaria}
TÍTULO DO ARTIGO: ${dados.titulo}
CATEGORIA: ${dados.categoria}

[PRODUTO — use APENAS estes dados]
Nome: ${produto.nome}
Plataforma: ${produto.plataforma}
URL: ${produto.urlOriginal}
${produto.preco ? `Preço: ${produto.preco}` : ""}
${produto.marca ? `Marca: ${produto.marca}` : ""}
${produto.descricaoCompleta ? `Descrição oficial:\n${produto.descricaoCompleta.slice(0, 2000)}` : ""}
${produto.especificacoes ? `Especificações técnicas:\n${produto.especificacoes.slice(0, 1000)}` : ""}
${produto.avaliacoes ? `Avaliações de consumidores:\n${produto.avaliacoes.slice(0, 800)}` : ""}
${backlinksStr}

[OUTPUT — Retorne SOMENTE JSON válido, sem markdown, sem \`\`\`json]
{
  "introducao": {
    "paragrafo1": "string — gancho: quem precisa deste produto e qual problema resolve",
    "paragrafo2": "string — apresenta o produto com palavra primária natural",
    "paragrafo3": "string — o que o leitor vai descobrir neste artigo"
  },
  "ficha_tecnica": {
    "titulo_h2": "Ficha Técnica",
    "itens": [
      { "campo": "string", "valor": "string — APENAS dados presentes nas specs fornecidas" }
    ]
  },
  "sobre_o_produto": {
    "titulo_h2": "string",
    "paragrafos": ["string — baseado na descrição oficial fornecida"]
  },
  "pros_contras": {
    "pros": ["string — baseado em dados reais fornecidos"],
    "contras": ["string — honesto, baseado em dados reais ou ausência de informação"]
  },
  "para_quem_e": {
    "titulo_h2": "Para Quem Vale a Pena?",
    "paragrafo": "string — perfil específico do comprador ideal, baseado nos dados do produto"
  },
  "para_quem_nao_e": {
    "titulo_h2": "Para Quem Pode Não Ser a Melhor Escolha",
    "paragrafo": "string — limitações honestas: perfil de usuário que provavelmente não será bem atendido"
  },
  "como_usar": {
    "titulo_h2": "string",
    "paragrafos": ["string"]
  },
  "secoes_complementares": [
    {
      "titulo_h2": "string — subtema que aprofunda o produto (micro-intenção específica)",
      "paragrafos": ["string"]
    }
  ],
  "faq": [
    {
      "pergunta": "string — dúvida real de quem pesquisa este produto",
      "resposta": "string — direta, objetiva, snippet-ready"
    }
  ],
  "conclusao": {
    "titulo_h2": "Vale a Pena Comprar?",
    "paragrafos": ["string — veredicto honesto com palavra primária + link de retorno ao REI"]
  },
  "metaTitle": "string — máx 60 chars",
  "metaDescription": "string — começa com palavra primária, máx 160 chars",
  "resumo": "string — 2-3 frases para cards",
  "slug": "string — kebab-case focado no produto"
}`;
}

// ─── Chamadas às APIs ─────────────────────────────────────────────────────────

async function chamarAnthropic(config: AIConfig, prompt: string): Promise<string> {
  const model = config.model || "claude-haiku-4-5-20251001";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
      // Habilita saída extendida (até 16k tokens) nos modelos que suportam
      "anthropic-beta": "output-128k-2025-02-19",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 16384,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

async function chamarOpenAI(config: AIConfig, prompt: string): Promise<string> {
  const model = config.model || "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 16384,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function chamarGemini(config: AIConfig, prompt: string): Promise<string> {
  const model = config.model || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 16384 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function chamarIA(config: AIConfig, prompt: string): Promise<string> {
  if (config.provider === "anthropic") return chamarAnthropic(config, prompt);
  if (config.provider === "openai") return chamarOpenAI(config, prompt);
  if (config.provider === "gemini") return chamarGemini(config, prompt);
  throw new Error(`Provedor desconhecido: ${config.provider}`);
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
      try {
        return JSON.parse(match[0]);
      } catch { /* ignore */ }
    }
    // Detecta se parece truncamento (resposta começa bem mas não fecha)
    const pareceTruncado = clean.startsWith("{") || clean.startsWith("```");
    if (pareceTruncado) {
      throw new Error(
        `A IA gerou conteúdo demais e a resposta foi cortada. Tente com menos produtos (máx. 4) ou use um modelo mais potente (ex.: claude-sonnet-4-5). Preview: ${clean.slice(0, 200)}`
      );
    }
    throw new Error(`Resposta da IA não é JSON válido. Preview: ${clean.slice(0, 300)}`);
  }
}

/** Gera conteúdo para post REI — ranking completo (todos os produtos) */
export async function gerarPostRanking(
  config: AIConfig,
  dados: DadosParaPost
): Promise<Record<string, unknown>> {
  const promptBase = config.promptRanking || PROMPT_PADRAO_RANKING;
  const prompt = buildPromptRanking({ ...dados, modoGeracao: "ranking" }, promptBase);
  const raw = await chamarIA(config, prompt);
  return parseJSON(raw);
}

/** Gera conteúdo para post SOLDADO — review individual de 1 produto */
export async function gerarPostIndividual(
  config: AIConfig,
  dados: Omit<DadosParaPost, "modoGeracao" | "produtos"> & { produto: ProdutoParaPost }
): Promise<Record<string, unknown>> {
  const promptBase = config.promptIndividual || PROMPT_PADRAO_INDIVIDUAL;
  const dadosAdaptado: DadosParaPost = {
    ...dados,
    modoGeracao: "individual",
    produtos: [dados.produto],
  };
  const prompt = buildPromptIndividual(dadosAdaptado, promptBase);
  const raw = await chamarIA(config, prompt);
  return parseJSON(raw);
}

/** Mantém compatibilidade com a rota existente /api/gerar-post */
export async function gerarPostComIA(
  config: AIConfig,
  dados: DadosParaPost
): Promise<Record<string, unknown>> {
  return gerarPostRanking(config, dados);
}
