import Link from "next/link";
import { ShoppingBag, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildAffiliateUrl, type AffiliateSettingsData } from "@/lib/affiliate";

interface ProductAffiliateButtonsProps {
  urlShopee?: string | null;
  urlMercadoLivre?: string | null;
  urlAmazon?: string | null;
  settings: AffiliateSettingsData;
  size?: "sm" | "default" | "lg";
}

export function ProductAffiliateButtons({
  urlShopee,
  urlMercadoLivre,
  urlAmazon,
  settings,
  size = "default",
}: ProductAffiliateButtonsProps) {
  const links = [
    {
      url: urlShopee
        ? buildAffiliateUrl("shopee", urlShopee, settings)
        : null,
      label: "Ver na Shopee",
      icon: ShoppingBag,
      className:
        "bg-orange-500 hover:bg-orange-600 text-white border-orange-500",
    },
    {
      url: urlMercadoLivre
        ? buildAffiliateUrl("mercado_livre", urlMercadoLivre, settings)
        : null,
      label: "Ver no Mercado Livre",
      icon: ShoppingCart,
      className: "bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-yellow-400",
    },
    {
      url: urlAmazon
        ? buildAffiliateUrl("amazon", urlAmazon, settings)
        : null,
      label: "Ver na Amazon",
      icon: Package,
      className: "bg-amber-600 hover:bg-amber-700 text-white border-amber-600",
    },
  ].filter((link) => !!link.url);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Button
            key={link.label}
            size={size}
            className={link.className}
            asChild
          >
            <Link
              href={link.url!}
              target="_blank"
              rel="noopener noreferrer sponsored"
            >
              <Icon className="mr-2 h-4 w-4" />
              {link.label}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
