export const dynamic = "force-dynamic";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostForm } from "@/components/admin/post-form";
import { prisma } from "@/lib/prisma";

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { nome: "asc" },
    select: { id: true, nome: true, categoria: true },
  });
}

export default async function NewPostPage() {
  const products = await getProducts();

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
          <h2 className="text-2xl font-bold text-gray-900">Novo post</h2>
          <p className="text-gray-500 text-sm">Crie um novo review ou guia</p>
        </div>
      </div>
      <PostForm products={products} />
    </div>
  );
}
