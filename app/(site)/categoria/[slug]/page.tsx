export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ReviewCard } from "@/components/review-card";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: { slug: string };
}

function labelFromSlug(slug: string): string {
  const map: Record<string, string> = {
    sala: "Sala",
    quarto: "Quarto",
    cozinha: "Cozinha",
    lavanderia: "Lavanderia",
    varanda: "Varanda",
    organizacao: "Organização",
    banheiro: "Banheiro",
    "home-office": "Home Office",
  };
  return map[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

async function getPostsByCategoria(slug: string) {
  const label = labelFromSlug(slug);
  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      categoria: { equals: label },
    },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true, slug: true, titulo: true, resumo: true,
      categoria: true, tipo: true, publishedAt: true, imagemUrl: true,
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const label = labelFromSlug(params.slug);
  return {
    title: `Reviews de ${label}`,
    description: `Os melhores reviews e rankings de produtos para ${label} selecionados pela Elis.`,
  };
}

export default async function CategoriaPage({ params }: PageProps) {
  const label = labelFromSlug(params.slug);
  const posts = await getPostsByCategoria(params.slug);

  if (!label) notFound();

  return (
    <div className="container py-10">
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Início
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 font-medium">{label}</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          Reviews de {label}
        </h1>
        <p className="text-gray-600">
          {posts.length === 0
            ? "Nenhum review disponível nesta categoria ainda."
            : `${posts.length} ${posts.length === 1 ? "análise" : "análises"} publicadas sobre produtos de ${label}.`}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-cafe-400">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block h-px w-12 bg-nude-300" />
            <span className="block h-2 w-2 rounded-full bg-brand-400" />
            <span className="block h-px w-12 bg-nude-300" />
          </div>
          <p className="text-lg font-serif font-medium text-cafe-600">
            Em breve: reviews de {label}!
          </p>
          <p className="text-sm mt-2">
            <Link href="/" className="text-brand-600 hover:underline">
              Ver outras análises
            </Link>
          </p>
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
