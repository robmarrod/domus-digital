export type AffiliateSource = "amazon" | "shopee" | "mercado_livre";

export interface AffiliateSettingsData {
  amazonTag?: string | null;
  shopeeParam?: string | null;
  mercadoLivreParam?: string | null;
}

export function buildAffiliateUrl(
  source: AffiliateSource,
  rawUrl: string,
  settings: AffiliateSettingsData
): string {
  if (!rawUrl) return "";

  try {
    const url = new URL(rawUrl);

    if (source === "amazon" && settings.amazonTag) {
      url.searchParams.set("tag", settings.amazonTag);
      return url.toString();
    }

    if (source === "shopee" && settings.shopeeParam) {
      const [key, value] = settings.shopeeParam.split("=");
      if (key && value) url.searchParams.set(key, value);
      return url.toString();
    }

    if (source === "mercado_livre" && settings.mercadoLivreParam) {
      const param = settings.mercadoLivreParam.replace(/^\?/, "");
      const [key, value] = param.split("=");
      if (key && value) url.searchParams.set(key, value);
      return url.toString();
    }

    return rawUrl;
  } catch {
    return rawUrl;
  }
}

export function getAffiliateSettings(): AffiliateSettingsData {
  return {
    amazonTag: process.env.AMAZON_TAG ?? null,
    shopeeParam: process.env.SHOPEE_PARAM ?? null,
    mercadoLivreParam: process.env.MERCADOLIVRE_PARAM ?? null,
  };
}
