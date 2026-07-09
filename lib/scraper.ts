/**
 * Scraper de produtos — extrai dados de Shopee, Mercado Livre e Amazon.
 * Mercado Livre: usa API pública oficial (sem autenticação).
 * Shopee/Amazon: extrai de meta tags og: e JSON-LD.
 */

export interface ProdutoScrapado {
  nome: string;
  descricaoCompleta?: string;
  especificacoes?: string;
  imagemUrl?: string;
  imagensAdicionais?: string[];
  preco?: string;
  marca?: string;
  plataforma: string;
  urlOriginal: string;
  erro?: string;
}

function detectarPlataforma(url: string): string {
  if (/mercadolivre|mercadolibre|mlb\.com/i.test(url)) return "Mercado Livre";
  if (/shopee/i.test(url)) return "Shopee";
  if (/amazon/i.test(url)) return "Amazon";
  return "Loja";
}

// ── Helpers HTML ─────────────────────────────────────────────────────────────

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function stripTags(html: string): string {
  return decodeHtml(html.replace(/<[^>]+>/g, " ").replace(/\s{2,}/g, " ").trim());
}

function getMeta(html: string, prop: string): string | undefined {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']{1,2000})["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']{1,2000})["'][^>]+property=["']${prop}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']{1,2000})["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']{1,2000})["'][^>]+name=["']${prop}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]?.trim()) return decodeHtml(m[1].trim());
  }
}

function getTitle(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1] ? decodeHtml(m[1].trim()) : undefined;
}

function getJsonLD(html: string): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      if (Array.isArray(parsed)) results.push(...parsed);
      else results.push(parsed);
    } catch { /* ignore */ }
  }
  return results;
}

const HEADERS_BROWSER = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: HEADERS_BROWSER, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// ── Mercado Livre — API Pública ───────────────────────────────────────────────

function extrairIdML(url: string): string | null {
  const patterns = [
    /\/(MLB[-_]?\d{6,12})/i,
    /MLB[-_]?(\d{6,12})/i,
    /\/([Mm][Ll][Bb]\d{6,12})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1].replace("-", "").toUpperCase();
  }
  return null;
}

async function scrapeML(url: string): Promise<Partial<ProdutoScrapado>> {
  // 1. Tenta API oficial do Mercado Livre (mais confiável)
  const itemId = extrairIdML(url);
  if (itemId) {
    try {
      const [itemRes, descRes] = await Promise.all([
        fetch(`https://api.mercadolibre.com/items/${itemId}`, { signal: AbortSignal.timeout(10000) }),
        fetch(`https://api.mercadolibre.com/items/${itemId}/description`, { signal: AbortSignal.timeout(10000) }),
      ]);
      if (itemRes.ok) {
        const item = await itemRes.json();
        const desc = descRes.ok ? await descRes.json() : null;

        const nome = item.title || "";
        const preco = item.price ? `R$ ${Number(item.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : undefined;
        const imagemUrl: string | undefined = item.thumbnail?.replace("-I.jpg", "-O.jpg") || item.thumbnail;
        const imagensAdicionais: string[] = (item.pictures || []).map((p: Record<string, string>) => p.url || p.secure_url).filter(Boolean).slice(0, 5);
        const marca = item.attributes?.find((a: Record<string, string>) => a.id === "BRAND")?.value_name;

        const specs = (item.attributes || [])
          .filter((a: Record<string, string>) => a.value_name && a.name)
          .map((a: Record<string, string>) => `${a.name}: ${a.value_name}`)
          .join("\n");

        const descricaoCompleta = [
          desc?.plain_text || "",
          specs ? `\nEspecificações:\n${specs}` : "",
        ].filter(Boolean).join("\n\n").trim();

        return { nome, preco, imagemUrl, imagensAdicionais, marca, descricaoCompleta, especificacoes: specs || undefined };
      }
    } catch { /* cai no fallback HTML */ }
  }

  // 2. Fallback: scraping HTML
  try {
    const html = await fetchHtml(url);
    const jsonLDs = getJsonLD(html);
    const product = jsonLDs.find((j) => j["@type"] === "Product") as Record<string, unknown> | undefined;

    let nome = (product?.name as string) || getMeta(html, "og:title") || getTitle(html) || "";
    nome = nome.replace(/\s*[-|]\s*Mercado (Livre|Libre).*$/i, "").replace(/\s*\|\s*Mercado.*$/i, "").trim();
    if (/^mercado\s*(livre|libre)$/i.test(nome)) nome = "";

    const offers = product?.offers as Record<string, unknown> | undefined;
    const preco = offers?.price ? `R$ ${Number(offers.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : undefined;
    const imagemUrl: string | undefined = (Array.isArray(product?.image) ? (product!.image as string[])[0] : product?.image as string) || getMeta(html, "og:image");
    const descricaoCompleta = (product?.description as string) || getMeta(html, "og:description");
    return { nome, preco, imagemUrl, descricaoCompleta };
  } catch {
    return { nome: "" };
  }
}

// ── Shopee ────────────────────────────────────────────────────────────────────

async function scrapeShopee(url: string): Promise<Partial<ProdutoScrapado>> {
  try {
    const html = await fetchHtml(url);
    const jsonLDs = getJsonLD(html);
    const product = jsonLDs.find((j) => j["@type"] === "Product") as Record<string, unknown> | undefined;

    let nome = (product?.name as string) || getMeta(html, "og:title") || getTitle(html) || "";
    nome = nome.replace(/\s*[-|]\s*(Shopee|Brasil|Shopping).*$/i, "").trim();
    if (nome.includes("|")) nome = nome.split("|")[0].trim();

    const imagemUrl = getMeta(html, "og:image") || (product?.image as string);
    const descricaoCompleta = (product?.description as string) || getMeta(html, "og:description");

    const offers = product?.offers as Record<string, unknown> | undefined;
    let preco: string | undefined;
    if (offers?.price && Number(offers.price) > 0) {
      preco = `R$ ${Number(offers.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    } else if (offers?.lowPrice) {
      preco = `R$ ${Number(offers.lowPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    }

    const marca = (product?.brand as Record<string, string>)?.name;
    return { nome, imagemUrl, descricaoCompleta, preco, marca };
  } catch {
    return { nome: "" };
  }
}

// ── Amazon ────────────────────────────────────────────────────────────────────

async function scrapeAmazon(url: string): Promise<Partial<ProdutoScrapado>> {
  try {
    const html = await fetchHtml(url);
    const jsonLDs = getJsonLD(html);
    const product = jsonLDs.find((j) => j["@type"] === "Product") as Record<string, unknown> | undefined;

    let nome = (product?.name as string) || getMeta(html, "og:title") || getTitle(html) || "";
    nome = nome.replace(/\s*[-|–:]\s*Amazon.*$/i, "").replace(/\s*:\s*Amazon\.com\.br.*$/i, "").trim();
    if (nome.includes("|")) nome = nome.split("|")[0].trim();
    if (/^amazon(\.com\.br)?$/i.test(nome.trim())) nome = "";

    const imagemUrl = getMeta(html, "og:image") || (product?.image as string);
    const marca = (product?.brand as Record<string, string>)?.name || getMeta(html, "og:site_name");

    const precoM = html.match(/class=["'][^"']*a-price-whole["'][^>]*>(\d[\d.,]+)/i);
    const preco = precoM ? `R$ ${precoM[1].trim()}` : undefined;

    const bulletsMatch = html.match(/id=["']feature-bullets["'][^>]*>([\s\S]{1,8000}?)<\/div>/i);
    const bullets: string[] = [];
    if (bulletsMatch) {
      const liRe = /<li[^>]*><span[^>]*>([^<]{10,500})<\/span>/gi;
      let m: RegExpExecArray | null;
      while ((m = liRe.exec(bulletsMatch[1])) !== null) {
        const t = m[1].trim();
        if (t && !t.toLowerCase().includes("make sure")) bullets.push(t);
      }
    }

    let descricaoCompleta = (product?.description as string) || getMeta(html, "og:description") || "";
    if (bullets.length > 0) {
      descricaoCompleta = (descricaoCompleta ? descricaoCompleta + "\n\n" : "") + bullets.join("\n");
    }

    return { nome, imagemUrl, marca, preco, descricaoCompleta };
  } catch {
    return { nome: "" };
  }
}

// ── Genérico ──────────────────────────────────────────────────────────────────

async function scrapeGenerico(url: string): Promise<Partial<ProdutoScrapado>> {
  try {
    const html = await fetchHtml(url);
    const jsonLDs = getJsonLD(html);
    const product = jsonLDs.find((j) => j["@type"] === "Product") as Record<string, unknown> | undefined;

    const nome = (product?.name as string) || getMeta(html, "og:title") || getTitle(html) || "";
    const imagemUrl = getMeta(html, "og:image") || (product?.image as string);
    const descricaoCompleta = (product?.description as string) || getMeta(html, "og:description");
    const offers = product?.offers as Record<string, unknown> | undefined;
    const preco = offers?.price && Number(offers.price) > 0
      ? `R$ ${Number(offers.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      : undefined;
    const marca = (product?.brand as Record<string, string>)?.name;
    return { nome, imagemUrl, descricaoCompleta, preco, marca };
  } catch {
    return { nome: "" };
  }
}

// ── Função principal ──────────────────────────────────────────────────────────

export async function scrapeProduto(url: string): Promise<ProdutoScrapado> {
  const plataforma = detectarPlataforma(url);

  let dados: Partial<ProdutoScrapado> = {};

  if (plataforma === "Mercado Livre") {
    dados = await scrapeML(url);
  } else if (plataforma === "Shopee") {
    dados = await scrapeShopee(url);
  } else if (plataforma === "Amazon") {
    dados = await scrapeAmazon(url);
  } else {
    dados = await scrapeGenerico(url);
  }

  // Rejeita nomes que são apenas o nome da plataforma
  const NOMES_PLATAFORMA = ["amazon.com.br", "amazon", "mercado livre", "mercado libre", "shopee", "shopee brasil"];
  if (dados.nome && NOMES_PLATAFORMA.includes(dados.nome.toLowerCase().trim())) {
    dados.nome = "";
  }

  // Fallback de nome: tenta extrair do path da URL
  if (!dados.nome || dados.nome.length < 3) {
    try {
      const path = decodeURIComponent(new URL(url).pathname);
      const segments = path.split("/").filter(Boolean);
      const lastSegment = segments.sort((a, b) => b.length - a.length)[0] || "";
      const nomeFromUrl = lastSegment
        .replace(/[-_]/g, " ")
        .replace(/\b(MLB|mlb)\d+\b/gi, "")
        .replace(/\b\d{5,}\b/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (nomeFromUrl.length > 5) {
        dados.nome = nomeFromUrl.charAt(0).toUpperCase() + nomeFromUrl.slice(1);
      }
    } catch { /* ignora */ }
  }

  return {
    plataforma,
    urlOriginal: url,
    nome: dados.nome || "Produto sem nome",
    descricaoCompleta: dados.descricaoCompleta,
    especificacoes: dados.especificacoes,
    imagemUrl: dados.imagemUrl,
    imagensAdicionais: dados.imagensAdicionais,
    preco: dados.preco,
    marca: dados.marca,
  };
}
