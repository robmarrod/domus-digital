import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, XCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductAffiliateButtons } from "@/components/product-affiliate-buttons";
import { parseLines } from "@/lib/utils";
import type { PostProductWithProduct } from "@/lib/types";
import type { AffiliateSettingsData } from "@/lib/affiliate";

interface ProductHighlightCardProps {
  postProduct: PostProductWithProduct;
  settings: AffiliateSettingsData;
}

const ROTULO_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "MAIOR DESEMPENHO": {
    bg: "bg-yellow-400",
    text: "text-yellow-900",
    border: "border-yellow-300",
  },
  "NOSSA ESCOLHA": {
    bg: "bg-brand-500",
    text: "text-white",
    border: "border-brand-400",
  },
  "CUSTO-BENEFÍCIO": {
    bg: "bg-emerald-500",
    text: "text-white",
    border: "border-emerald-400",
  },
  "MAIS POPULAR": {
    bg: "bg-blue-500",
    text: "text-white",
    border: "border-blue-400",
  },
};

export function ProductHighlightCard({
  postProduct,
  settings,
}: ProductHighlightCardProps) {
  const { product, posicao, rotuloDestaque, resumoCurto, pros, contras, indicadoPara } =
    postProduct;
  const rotuloStyle =
    rotuloDestaque && ROTULO_STYLES[rotuloDestaque]
      ? ROTULO_STYLES[rotuloDestaque]
      : { bg: "bg-gray-500", text: "text-white", border: "border-gray-400" };

  const prosList = parseLines(pros || product.prosDefault);
  const contrasList = parseLines(contras || product.contrasDefault);

  return (
    <Card
      id={`produto-${posicao}`}
      className="overflow-hidden border-2 border-gray-200 hover:border-brand-200 transition-colors"
    >
      {rotuloDestaque && (
        <div
          className={`${rotuloStyle.bg} ${rotuloStyle.text} text-center py-2 text-xs font-bold uppercase tracking-widest`}
        >
          {rotuloDestaque}
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="relative w-full md:w-40 h-40 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {product.imagemUrl ? (
                <Image
                  src={product.imagemUrl}
                  alt={product.nome}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 160px"
                />
              ) : (
                <span className="text-5xl">🏠</span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-300">
                #{posicao}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <Link
              href={`/produto/${product.slug}`}
              className="hover:text-brand-600 transition-colors"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-1 leading-snug">
                {product.nome}
              </h3>
            </Link>

            {product.marca && (
              <p className="text-sm text-gray-500 mb-2">
                Marca: <strong>{product.marca}</strong>
              </p>
            )}

            {resumoCurto && (
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {resumoCurto}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {prosList.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Prós
                  </h4>
                  <ul className="space-y-1">
                    {prosList.map((pro, i) => (
                      <li
                        key={i}
                        className="text-xs text-gray-700 flex items-start gap-1.5"
                      >
                        <span className="text-emerald-500 mt-0.5 flex-shrink-0">
                          ✓
                        </span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {contrasList.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <XCircle className="h-3.5 w-3.5" />
                    Contras
                  </h4>
                  <ul className="space-y-1">
                    {contrasList.map((contra, i) => (
                      <li
                        key={i}
                        className="text-xs text-gray-700 flex items-start gap-1.5"
                      >
                        <span className="text-red-400 mt-0.5 flex-shrink-0">
                          ✗
                        </span>
                        {contra}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {indicadoPara && (
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-800 mb-0.5">
                      Para quem é esse produto?
                    </p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      {indicadoPara}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <ProductAffiliateButtons
              urlShopee={product.urlShopee}
              urlMercadoLivre={product.urlMercadoLivre}
              urlAmazon={product.urlAmazon}
              settings={settings}
              size="sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
