/**
 * Scraper de produtos — extrai dados completos via JSON-LD, meta tags e seletores HTML.
 * Suporte: Mercado Livre, Amazon, Shopee e lojas genéricas.
 */

export interface ProdutoScrapado {
  nome: string;
  descricaoCompleta?: string;   // descrição longa / corpo do produto
  especificacoes?: string;      // especificações técnicas como texto
  imagemUrl?: string;
  imagensAdicionais?: string[]; // galeria de imagens
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

// ---- Helpers de HTML ----

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function stripTags(html: string): string {
  return decodeHtmlEntities(
    html.replace(/<[^>]+>/g, " ").replace(/\s{2,}/g, " ").trim()
  );
}

function getMeta(html: string, property: string): string | undefined {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']{1,2000})["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']{1,2000})["'][^>]+property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']{1,2000})["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']{1,2000})["'][^>]+name=["']${property}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]?.trim()) return decodeHtmlEntities(m[1].trim());
  }
  return undefined;
}

function getTitle(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1] ? decodeHtmlEntities(m[1].trim()) : undefined;
}

/** Extrai todos os JSON-LD da página */
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

/** Extrai o primeiro bloco de texto de um seletor CSS simples (classe ou id) */
function getByClass(html: string, className: string, tag = "\\w+"): string | undefined {
  const re = new RegExp(`<${tag}[^>]+class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]{1,5000}?)<\\/${tag}>`, "i");
  const m = html.match(re);
  return m?.[1] ? stripTags(m[1]).slice(0, 3000) : undefined;
}

function getById(html: string, id: string, tag = "\\w+"): string | undefined {
  const re = new RegExp(`<${tag}[^>]+id=["']${id}["'][^>]*>([\\s\\S]{1,5000}?)<\\/${tag}>`, "i");
  const m = html.match(re);
  return m?.[1] ? stripTags(m[1]).slice(0, 3000) : undefined;
}

/** Extrai lista de itens de um bloco HTML (li, span etc.) */
function getListItems(html: string, containerClass: string): string[] {
  const containerRe = new RegExp(`class=["'][^"']*${containerClass}[^"']*["'][^>]*>([\\s\\S]{1,8000}?)</\\w+>`, "i");
  const containerM = html.match(containerRe);
  if (!containerM) return [];
  const items: string[] = [];
  const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m: RegExpExecArray | null;
  while ((m = liRe.exec(containerM[1])) !== null) {
    const text = stripTags(m[1]).trim();
    if (text.length > 2) items.push(text);
  }
  return items.slice(0, 20);
}

// ---- Extratores por plataforma ----

function extrairMercadoLivre(html: string, url: string): Partial<ProdutoScrapado> {
  // JSON-LD Product
  const jsonLDs = getJsonLD(html);
  const product = jsonLDs.find((j) => j["@type"] === "Product") as Record<string, unknown> | undefined;

  let nome = (product?.name as string) || getMeta(html, "og:title") || getTitle(html) || "";
  nome = nome.replace(/\s*[-|]\s*Mercado Livre.*$/i, "").trim();

  // Preço via JSON-LD offers
  let preco: string | undefined;
  const offers = product?.offers as Record<string, unknown> | undefined;
  if (offers?.price) {
    preco = `R$ ${offers.price}`;
  } else {
    const m = html.match(/itemprop=["']price["'][^>]+content=["']([^"']+)["']/i);
    if (m) preco = `R$ ${m[1]}`;
  }

  // Imagem
  let imagemUrl = (product?.image as string) || getMeta(html, "og:image");
  // ML coloca array às vezes
  if (Array.isArray(product?.image)) imagemUrl = (product!.image as string[])[0];

  // Marca
  const marca = (product?.brand as Record<string, string>)?.name || getMeta(html, "product:brand");

  // Descrição via JSON-LD
  let descricaoCompleta = (product?.description as string) || getMeta(html, "og:description");

  // Fallback: bloco de descrição no HTML
  if (!descricaoCompleta || descricaoCompleta.length < 50) {
    descricaoCompleta =
      getByClass(html, "ui-pdp-description__content", "p") ||
      getByClass(html, "item-description__text", "p") ||
      descricaoCompleta;
  }

  // Especificações técnicas (tabela de atributos)
  const specItems = getListItems(html, "ui-pdp-specs__table");
  const especificacoes = specItems.length > 0 ? specItems.join("\n") : undefined;

  // Galeria de imagens
  const imgRe = /https:\/\/http2\.mlstatic\.com\/D_NQ_NP[^"'\s]+\.jpg/gi;
  const imagensAdicionais = Array.from(new Set(html.match(imgRe) || [])).slice(0, 5);

  return { nome, preco, imagemUrl, imagensAdicionais, marca, descricaoCompleta, especificacoes };
}

function extrairAmazon(html: string, url: string): Partial<ProdutoScrapado> {
  const jsonLDs = getJsonLD(html);
  const product = jsonLDs.find((j) => j["@type"] === "Product") as Record<string, unknown> | undefined;

  let nome = (product?.name as string) || getMeta(html, "og:title") || getTitle(html) || "";
  nome = nome.replace(/\s*[-|–]\s*Amazon.*$/i, "").trim();

  const imagemUrl = getMeta(html, "og:image") || (product?.image as string);
  const marca = getMeta(html, "og:site_name") || (product?.brand as Record<string, string>)?.name;

  // Preço (Amazon renderiza via JS, mas às vezes está no HTML)
  const precoM = html.match(/class=["'][^"']*a-price-whole["'][^>]*>([^<]+)</i);
  const preco = precoM ? `R$ ${precoM[1].replace(/\D+$/, "").trim()}` : undefined;

  // Feature bullets
  const bulletsRaw = getById(html, "feature-bullets", "div") || getById(html, "productFeatures", "div");
  const bullets: string[] = [];
  if (bulletsRaw) {
    const liRe = /<li[^>]*><span[^>]*>([^<]{5,500})<\/span>/gi;
    let m: RegExpExecArray | null;
    while ((m = liRe.exec(bulletsRaw)) !== null) {
      const t = m[1].trim();
      if (t && !t.toLowerCase().includes("make sure")) bullets.push(t);
    }
  }

  // Descrição do produto
  let descricaoCompleta: string | undefined = (product?.description as string | undefined);
  if (!descricaoCompleta || descricaoCompleta.length < 30) {
    descricaoCompleta = getById(html, "productDescription", "div") || getMeta(html, "og:description");
  }
  if (bullets.length > 0) {
    descricaoCompleta = (descricaoCompleta ? descricaoCompleta + "\n\n" : "") + bullets.join("\n");
  }

  // Especificações
  const especificacoes = getById(html, "productDetails_techSpec_section_1", "table")
    || getById(html, "tech-spec-section", "div");

  return { nome, preco, imagemUrl, marca, descricaoCompleta, especificacoes };
}

function extrairShopee(html: string, url: string): Partial<ProdutoScrapado> {
  // Shopee é JS-rendered — extraímos o que conseguimos das meta tags e JSON-LD
  const jsonLDs = getJsonLD(html);
  const product = jsonLDs.find((j) => j["@type"] === "Product") as Record<string, unknown> | undefined;

  let nome = (product?.name as string) || getMeta(html, "og:title") || getTitle(html) || "";
  nome = nome.replace(/\s*[-|]\s*(Shopee|Brasil).*$/i, "").trim();

  const imagemUrl = getMeta(html, "og:image") || (product?.image as string);
  const descricaoCompleta = (product?.description as string) || getMeta(html, "og:description");

  const offers = product?.offers as Record<string, unknown> | undefined;
  const preco = offers?.price ? `R$ ${offers.price}` : undefined;
  const marca = (product?.brand as Record<string, string>)?.name;

  return { nome, imagemUrl, descricaoCompleta, preco, marca };
}

function extrairGenerico(html: string): Partial<ProdutoScrapado> {
  const jsonLDs = getJsonLD(html);
  const product = jsonLDs.find((j) => j["@type"] === "Product") as Record<string, unknown> | undefined;

  const nome = (product?.name as string) || getMeta(html, "og:title") || getTitle(html) || "Produto";
  const imagemUrl = getMeta(html, "og:image") || (product?.image as string);
  const descricaoCompleta = (product?.description as string) || getMeta(html, "og:description");
  const offers = product?.offers as Record<string, unknown> | undefined;
  const preco = offers?.price ? `R$ ${offers.price}` : undefined;
  const marca = (product?.brand as Record<string, string>)?.name;

  return { nome, imagemUrl, descricaoCompleta, preco, marca };
}

// ---- Função principal ----

export async function scrapeProduto(url: string): Promise<ProdutoScrapado> {
  const plataforma = detectarPlataforma(url);

  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (e) {
    throw new Error(`Não foi possível acessar a URL: ${(e as Error).message}`);
  }

  let dados: Partial<ProdutoScrapado> = {};

  if (plataforma === "Mercado Livre") {
    dados = extrairMercadoLivre(html, url);
  } else if (plataforma === "Amazon") {
    dados = extrairAmazon(html, url);
  } else if (plataforma === "Shopee") {
    dados = extrairShopee(html, url);
  } else {
    dados = extrairGenerico(html);
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
