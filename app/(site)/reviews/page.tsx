export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ReviewCard } from "@/components/review-card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Todos os Reviews",
  description:
    "Todos os reviews e rankings de produtos para casa e decoração do Achadinhos da Elis.",
};

async function getAllPosts() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true, slug: true, titulo: true, resumo: true,
      categoria: true, tipo: true, publishedAt: true, imagemUrl: true,
    },
  });
}

export default async function ReviewsPage() {
  const posts = await getAllPosts();

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          Todos os Reviews
        </h1>
        <p className="text-gray-600">
          {posts.length}{" "}
          {posts.length === 1 ? "análise publicada" : "análises publicadas"} —
          sempre atualizadas com os melhores produtos do mercado.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-cafe-400">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block h-px w-12 bg-nude-300" />
            <span className="block h-2 w-2 rounded-full bg-brand-400" />
            <span className="block h-px w-12 bg-nude-300" />
          </div>
          <p className="text-lg font-serif font-medium text-cafe-600">Nenhum review publicado ainda.</p>
          <p className="text-sm font-sans mt-2">Volte em breve!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ReviewCard
              key={post.id}
              slug={post.slug}
              titulo={post.titulo}
              resumo={post.resumo}
              categoria={post.categoria}
              tipo={post.tipo}
              publishedAt={post.publishedAt}
              imagemUrl={post.imagemUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
