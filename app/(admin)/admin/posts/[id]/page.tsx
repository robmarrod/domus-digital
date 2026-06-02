export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostForm } from "@/components/admin/post-form";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: { id: string };
}

async function getPost(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      postProducts: {
        orderBy: { posicao: "asc" },
        include: { product: true },
      },
    },
  });
}

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { nome: "asc" },
    select: { id: true, nome: true, categoria: true },
  });
}

export default async function EditPostPage({ params }: PageProps) {
  const [post, products] = await Promise.all([
    getPost(params.id),
    getProducts(),
  ]);

  if (!post) notFound();

  const defaultValues = {
    titulo: post.titulo ?? "",
    slug: post.slug ?? "",
    palavraPrimaria: post.palavraPrimaria ?? "",
    categoria: post.categoria ?? "",
    tipo: post.tipo ?? "REVIEW",
    metaTitle: post.metaTitle ?? "",
    metaDescription: post.metaDescription ?? "",
    resumo: post.resumo ?? "",
    conteudoJson: post.conteudoJson ?? "{}",
    status: post.status ?? "DRAFT",
    scheduledAt: post.scheduledAt ? post.scheduledAt.toISOString() : undefined,
    linksJson: post.linksJson ?? undefined,
    imagemUrl: post.imagemUrl ?? "",
    urlShopee: post.urlShopee ?? "",
    urlMercadoLivre: post.urlMercadoLivre ?? "",
    urlAmazon: post.urlAmazon ?? "",
    postProducts: (post.postProducts ?? []).map((pp) => ({
      productId: pp.productId ?? "",
      posicao: pp.posicao ?? 1,
      rotuloDestaque: pp.rotuloDestaque ?? "",
      resumoCurto: pp.resumoCurto ?? "",
      pros: pp.pros ?? "",
      contras: pp.contras ?? "",
      indicadoPara: pp.indicadoPara ?? "",
      urlShopee: pp.product?.urlShopee ?? "",
      urlMercadoLivre: pp.product?.urlMercadoLivre ?? "",
      urlAmazon: pp.product?.urlAmazon ?? "",
      imagemUrl: pp.product?.imagemUrl ?? "",
    })),
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/posts">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Editar post</h2>
          <p className="text-gray-500 text-sm font-mono text-xs">
            ID: {params.id}
          </p>
        </div>
        <div className="ml-auto">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/reviews/${post.slug}`} target="_blank">
              Ver no site
            </Link>
          </Button>
        </div>
      </div>
      <PostForm postId={params.id} defaultValues={defaultValues} products={products} />
    </div>
  );
}
