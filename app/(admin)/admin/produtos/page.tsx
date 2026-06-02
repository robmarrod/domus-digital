export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";
import { ProdutoActions } from "@/components/admin/produto-actions";

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminProdutosPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
          <p className="text-gray-500 text-sm">
            {products.length} produto(s) cadastrado(s)
          </p>
        </div>
        <Button variant="brand" asChild>
          <Link href="/admin/produtos/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo produto
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Todos os produtos</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="mb-3">Nenhum produto cadastrado.</p>
              <Button variant="brand" size="sm" asChild>
                <Link href="/admin/produtos/new">Cadastrar primeiro produto</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Preço ref.</TableHead>
                  <TableHead>Cadastrado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      <div>{p.nome}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        {p.slug}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {p.categoria}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {p.marca ?? "—"}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {p.precoReferencial
                        ? formatPrice(p.precoReferencial)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">
                      {formatDate(p.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/produto/${p.slug}`} target="_blank">
                            Ver
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/produtos/${p.id}`}>Editar</Link>
                        </Button>
                        <ProdutoActions produtoId={p.id} produtoNome={p.nome} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
