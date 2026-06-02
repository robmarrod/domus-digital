export const dynamic = "force-dynamic";

import Link from "next/link";
import { FileText, Package, Plus, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

async function getDashboardData() {
  const [postCount, productCount, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.product.count(),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);
  return { postCount, productCount, recentPosts };
}

export default async function AdminDashboard() {
  const { postCount, productCount, recentPosts } = await getDashboardData();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm">Visão geral do Achadinhos da Elis</p>
        </div>
        <Button variant="brand" size="sm" asChild>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo post
          </Link>
        </Button>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total de posts
            </CardDescription>
            <CardTitle className="text-4xl font-bold text-brand-600">
              {postCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/posts"
              className="text-sm text-brand-600 hover:underline flex items-center gap-1"
            >
              Gerenciar posts
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total de produtos
            </CardDescription>
            <CardTitle className="text-4xl font-bold text-brand-600">
              {productCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/produtos"
              className="text-sm text-brand-600 hover:underline flex items-center gap-1"
            >
              Gerenciar produtos
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Últimos posts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Posts recentes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/posts">Ver todos</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhum post criado ainda.</p>
              <Button variant="brand" size="sm" className="mt-4" asChild>
                <Link href="/admin/posts/new">Criar primeiro post</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {post.titulo}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {post.categoria}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          post.status === "PUBLISHED" ? "green" : "secondary"
                        }
                        className="text-xs"
                      >
                        {post.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/posts/${post.id}`}>Editar</Link>
                      </Button>
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
