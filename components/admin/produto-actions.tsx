"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProdutoActionsProps {
  produtoId: string;
  produtoNome: string;
}

export function ProdutoActions({ produtoId, produtoNome }: ProdutoActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function excluir() {
    if (!confirm(`Excluir permanentemente?\n\n"${produtoNome.slice(0, 80)}"\n\nEsta ação NÃO pode ser desfeita.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/produtos/${produtoId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir produto");
      router.refresh();
    } catch (e) { alert((e as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={excluir}
      disabled={loading}
      title="Excluir produto"
      className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
