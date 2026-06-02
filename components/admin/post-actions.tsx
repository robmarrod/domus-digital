"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostActionsProps {
  postId: string;
  postTitulo: string;
  postStatus: string;
}

export function PostActions({ postId, postTitulo, postStatus }: PostActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"archive" | "delete" | null>(null);

  async function arquivar() {
    if (!confirm(`Arquivar este post?\n\n"${postTitulo.slice(0, 80)}"\n\nFicará oculto do site mas poderá ser restaurado.`)) return;
    setLoading("archive");
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ARCHIVED" }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Erro ao arquivar"); }
      router.refresh();
    } catch (e) { alert((e as Error).message); }
    finally { setLoading(null); }
  }

  async function excluir() {
    if (!confirm(`Excluir permanentemente?\n\n"${postTitulo.slice(0, 80)}"\n\nEsta ação NÃO pode ser desfeita.`)) return;
    setLoading("delete");
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");
      router.refresh();
    } catch (e) { alert((e as Error).message); }
    finally { setLoading(null); }
  }

  return (
    <div className="flex items-center gap-1">
      {postStatus !== "ARCHIVED" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={arquivar}
          disabled={!!loading}
          title="Arquivar post"
          className="h-8 w-8 p-0 text-amber-500 hover:text-amber-700 hover:bg-amber-50"
        >
          <Archive className="h-3.5 w-3.5" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={excluir}
        disabled={!!loading}
        title="Excluir post"
        className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
