export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { formatDate } from "@/lib/utils";
import { PostActions } from "@/components/admin/post-actions";

async function getPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
          <p className="text-gray-500 text-sm">
            {posts.length} {posts.length === 1 ? "post" : "posts"} cadastrados
          </p>
        </div>
        <Button variant="brand" asChild>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Todos os posts</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="mb-3">Nenhum post criado ainda.</p>
              <Button variant="brand" size="sm" asChild>
                <Link href="/admin/posts/new">Criar primeiro post</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{post.titulo}</div>
                      <div className="text-xs text-gray-400 mt-0.5 font-mono">
                        /{post.slug}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {post.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {post.categoria}
                    </TableCell>
                    <TableCell>
                      {post.status === "PUBLISHED" && (
                        <Badge variant="green" className="text-xs">Publicado</Badge>
                      )}
                      {post.status === "REVIEW" && (
                        <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Em revisão</Badge>
                      )}
                      {post.status === "ARCHIVED" && (
                        <Badge variant="secondary" className="text-xs text-gray-500">Arquivado</Badge>
                      )}
                      {post.status === "SCHEDULED" && (
                        <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">Agendado</Badge>
                      )}
                      {post.status === "DRAFT" && (
                        <Badge variant="secondary" className="text-xs">Rascunho</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/reviews/${post.slug}`} target="_blank">
                            Ver
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/posts/${post.id}`}>Editar</Link>
                        </Button>
                        <PostActions
                          postId={post.id}
                          postTitulo={post.titulo}
                          postStatus={post.status}
                        />
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
