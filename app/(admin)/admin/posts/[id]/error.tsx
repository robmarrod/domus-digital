"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[Admin Posts Error]", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border border-red-200 rounded-xl bg-red-50">
      <h2 className="text-lg font-bold text-red-700 mb-2">Erro ao carregar o editor de post</h2>
      <p className="text-sm text-red-600 mb-4">
        Ocorreu um erro inesperado. Por favor, copie a mensagem abaixo e envie para o suporte.
      </p>
      <pre className="bg-white border border-red-200 rounded-lg p-3 text-xs text-red-800 overflow-auto mb-4 max-h-40">
        {error?.message || "Erro desconhecido"}
        {error?.stack ? "\n\n" + error.stack : ""}
      </pre>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={reset}>
          Tentar novamente
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.location.href = "/admin/posts"}>
          Voltar para posts
        </Button>
      </div>
    </div>
  );
}
