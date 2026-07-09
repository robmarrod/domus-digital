export function proxyImg(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("/") || url.startsWith("data:")) return url;
  return `/api/imagem-proxy?url=${encodeURIComponent(url)}`;
}
