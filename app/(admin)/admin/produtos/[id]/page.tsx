export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: { id: string };
}

async function getProduct(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export default async function EditProductPage({ params }: PageProps) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/produtos">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Editar produto</h2>
          <p className="text-gray-500 text-sm font-mono text-xs">
            {product.nome}
          </p>
        </div>
        <div className="ml-auto">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/produto/${product.slug}`} target="_blank">
              Ver no site
            </Link>
          </Button>
        </div>
      </div>
      <ProductForm
        productId={params.id}
        defaultValues={{
          nome: product.nome,
          slug: product.slug,
          categoria: product.categoria,
          marca: product.marca ?? undefined,
          descricaoCurta: product.descricaoCurta,
          imagemUrl: product.imagemUrl ?? undefined,
          precoReferencial: product.precoReferencial,
          idShopee: product.idShopee ?? undefined,
          idMercadoLivre: product.idMercadoLivre ?? undefined,
          idAmazon: product.idAmazon ?? undefined,
          urlShopee: product.urlShopee ?? undefined,
          urlMercadoLivre: product.urlMercadoLivre ?? undefined,
          urlAmazon: product.urlAmazon ?? undefined,
          prosDefault: product.prosDefault ?? undefined,
          contrasDefault: product.contrasDefault ?? undefined,
        }}
      />
    </div>
  );
}
