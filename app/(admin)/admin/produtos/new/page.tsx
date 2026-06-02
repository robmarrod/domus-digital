export const dynamic = "force-dynamic";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
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
          <h2 className="text-2xl font-bold text-gray-900">Novo produto</h2>
          <p className="text-gray-500 text-sm">Cadastre um novo produto</p>
        </div>
      </div>
      <ProductForm />
    </div>
  );
}
