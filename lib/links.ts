/**
 * Substitui palavras-âncora do linksJson por tags <a> no conteúdo HTML/texto.
 * Cada palavra é substituída apenas na primeira ocorrência por parágrafo.
 */

export interface LinkEntry {
  palavra: string;
  url: string;
  tipo: "interno" | "externo";
  novaAba?: boolean;
}

export function parseLinks(linksJson: string | null | undefined): LinkEntry[] {
  if (!linksJson) return [];
  try { return JSON.parse(linksJson) || []; }
  catch { return []; }
}

/**
 * Aplica os links em um bloco de texto/HTML.
 * Retorna o texto com as palavras substituídas por tags <a>.
 * Seguro: cada palavra é substituída no máximo 1 vez por chamada (evita loops).
 */
export function aplicarLinks(texto: string, links: LinkEntry[]): string {
  if (!texto || !links.length) return texto;

  let resultado = texto;
  for (const link of links) {
    if (!link.palavra || !link.url) continue;

    const escapedPalavra = link.palavra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(?<!['">=])(${escapedPalavra})(?![^<]*>)`, "i");

    const attrs = [
      `href="${link.url}"`,
      link.novaAba || link.tipo === "externo" ? 'target="_blank"' : "",
      link.tipo === "externo" ? 'rel="nofollow noopener noreferrer"' : "",
    ]
      .filter(Boolean)
      .join(" ");

    resultado = resultado.replace(re, `<a ${attrs}>$1</a>`);
  }
  return resultado;
}
