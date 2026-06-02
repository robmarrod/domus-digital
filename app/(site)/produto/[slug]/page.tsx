export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CheckCircle2, XCircle, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductAffiliateButtons } from "@/components/product-affiliate-buttons";
import { AuthorBox } from "@/components/author-box";
import { prisma } from "@/lib/prisma";
import { parseLines, formatPrice } from "@/lib/utils";

interface PageProps {
  params: { slug: string };
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      postProducts: {
        include: {
          post: { select: { slug: true, titulo: true, categoria: true, status: true } },
        },
        where: { post: { status: "PUBLISHED" } },
        orderBy: { posicao: "asc" },
      },
    },
  });
}

async function getSettings() {
  return (
    (await prisma.affiliateSettings.findFirst()) ?? {
      amazonTag: null,
      shopeeParam: null,
      mercadoLivreParam: null,
    }
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  return {
    title: `${product.nome} – Review Completo`,
    description: product.descricaoCurta,
  };
}

export default async function ProdutoPage({ params }: PageProps) {
  const [product, settings] = await Promise.all([
    getProduct(params.slug),
    getSettings(),
  ]);

  if (!product) notFound();

  const pros = parseLines(product.prosDefault);
  const contras = parseLines(product.contrasDefault);

  return (
    <div className="container py-10 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Início
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/categoria/${product.categoria.toLowerCase()}`}
          className="hover:text-brand-600 transition-colors"
        >
          {product.categoria}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 font-medium">{product.nome}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Imagem */}
        <div>
          <div className="relative h-80 w-full rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
            {product.imagemUrl ? (
              <Image
                src={product.imagemUrl}
                alt={product.nome}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <span className="text-8xl">🏠</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          {product.marca && (
            <Badge variant="outline" className="mb-3">
              <Tag className="h-3 w-3 mr-1" />
              {product.marca}
            </Badge>
          )}
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3 leading-tight">
            {product.nome}
          </h1>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {product.descricaoCurta}
          </p>

          {product.precoReferencial && (
            <div className="mb-4">
              <span className="text-xs text-gray-400 block mb-1">
                Preço referencial
              </span>
              <span className="text-3xl font-bold text-brand-600">
                {formatPrice(product.precoReferencial)}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                (verifique o preço atual nos links abaixo)
              </span>
            </div>
          )}

          <div className="mb-4">
            <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-2">
              Categoria
            </span>
            <Link
              href={`/categoria/${product.categoria.toLowerCase()}`}
              className="inline-block bg-brand-50 text-brand-700 text-sm px-3 py-1 rounded-md hover:bg-brand-100 transition-colors"
            >
              {product.categoria}
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3 font-medium">
              Onde comprar:
            </p>
            <ProductAffiliateButtons
              urlShopee={product.urlShopee}
              urlMercadoLivre={product.urlMercadoLivre}
              urlAmazon={product.urlAmazon}
              settings={settings}
              size="default"
            />
          </div>
        </div>
      </div>

      {/* Prós e Contras */}
      {(pros.length > 0 || contras.length > 0) && (
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
            Prós e Contras
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pros.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Pontos positivos
                </h3>
                <ul className="space-y-2">
                  {pros.map((pro, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-emerald-900"
                    >
                      <span className="text-emerald-500 mt-1 flex-shrink-0">
                        ✓
                      </span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {contras.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Pontos de atenção
                </h3>
                <ul className="space-y-2">
                  {contras.map((contra, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-red-900"
                    >
                      <span className="text-red-400 mt-1 flex-shrink-0">
                        ✗
                      </span>
                      {contra}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Para quem é */}
      <section className="mb-12 bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h2 className="font-serif text-xl font-bold text-blue-900 mb-3">
          Para quem é esse produto?
        </h2>
        <p className="text-blue-800 leading-relaxed text-sm">
          {pros.length > 0
            ? `O ${product.nome} é ideal para quem busca ${pros.slice(0, 2).join(" e ").toLowerCase()}. ${contras.length > 0 ? `Fique atento a ${contras[0].toLowerCase()} antes de comprar.` : ""}`
            : product.descricaoCurta}
        </p>
      </section>

      {/* Reviews onde aparece */}
      {product.postProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
            Este produto em nossos reviews
          </h2>
          <div className="space-y-3">
            {product.postProducts.map((pp) => (
              <Link
                key={pp.id}
                href={`/reviews/${pp.post.slug}`}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-brand-300 hover:bg-brand-50 transition-all group"
              >
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-brand-700 transition-colors text-sm">
                    {pp.post.titulo}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {pp.post.categoria} ·{" "}
                    {pp.rotuloDestaque && (
                      <span className="font-semibold text-brand-500">
                        {pp.rotuloDestaque}
                      </span>
                    )}
                    {" "}· Posição #{pp.posicao}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-brand-600 transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Caixa da autora */}
      <AuthorBox updatedAt={product.updatedAt} />

      {/* Aviso afiliado */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-800">
        <strong>Aviso:</strong> Os links de compra desta página são links de
        afiliado. Ao comprar, podemos receber uma comissão sem custo adicional
        para você. Os preços e disponibilidade são de responsabilidade dos
        vendedores e podem variar.
      </div>
    </div>
  );
}
