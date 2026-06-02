"use client";

import { useState } from "react";
import { Sparkles, CheckCircle, XCircle, Loader2, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkEntry } from "./links-panel";

export interface ProdutoImportado {
  url: string;
  nome: string;
  descricaoCompleta?: string;
  especificacoes?: string;
  imagemUrl?: string;
  imagensAdicionais?: string[];
  preco?: string;
  marca?: string;
  plataforma: string;
  carregando?: boolean;
  erro?: string;
}

interface ResultadoPost {
  tipo: "ranking" | "individual";
  produtoNome?: string;
  postId: string;
  slug: string;
  titulo: string;
  erro?: string;
}

interface GeracaoLotePanelProps {
  titulo: string;
  palavraPrimaria: string;
  categoria: string;
  tipo: "REVIEW" | "GUIA";
  produtos: ProdutoImportado[];
  backlinks: LinkEntry[];
  onPostsCriados?: (posts: ResultadoPost[]) => void;
}

export function GeracaoLotePanel({
  titulo, palavraPrimaria, categoria, tipo, produtos, backlinks, onPostsCriados,
}: GeracaoLotePanelProps) {
  const [gerando, setGerando] = useState(false);
  const [etapa, setEtapa] = useState<string>("");
  const [resultados, setResultados] = useState<ResultadoPost[]>([]);
  const [concluido, setConcluido] = useState(false);

  const produtosValidos = produtos.filter((p) => !p.erro && !p.carregando && p.nome !== "Carregando...");

  async function gerar(status: "DRAFT" | "PUBLISHED") {
    setGerando(true);
    setConcluido(false);
    setResultados([]);
    setEtapa("Enviando para a IA...");

    try {
      const res = await fetch("/api/gerar-posts-lote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo, palavraPrimaria, categoria, tipo,
          // Garante que urlOriginal existe (produtos via IA usam 'url', via scraper já têm 'urlOriginal')
          produtos: produtosValidos.map((p) => ({
            ...p,
            urlOriginal: (p as unknown as Record<string, unknown>).urlOriginal ?? p.url,
          })),
          backlinks,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResultados(data.posts || []);
      setConcluido(true);
      onPostsCriados?.(data.posts || []);
    } catch (e) {
      setResultados([{
        tipo: "ranking",
        postId: "",
        slug: "",
        titulo: "Erro na geração",
        erro: (e as Error).message,
      }]);
      setConcluido(true);
    } finally {
      setGerando(false);
      setEtapa("");
    }
  }

  const totalPosts = 1 + produtosValidos.length; // 1 ranking + 1 por produto

  return (
    <Card className="border-brand-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-500" />
          <CardTitle className="text-base text-brand-700">Gerar posts com IA</CardTitle>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Serão criados <strong>{totalPosts} posts</strong>:{" "}
          1 post ranking geral + {produtosValidos.length} artigo{produtosValidos.length !== 1 ? "s" : ""} individual{produtosValidos.length !== 1 ? "is" : ""} (um por produto).
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview de o que será gerado */}
        {!concluido && (
          <div className="space-y-1.5 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-400" />
              <span className="font-medium">[RANKING]</span> {titulo || "Post ranking geral"}
            </div>
            {produtosValidos.map((p, i) => (
              <div key={i} className="flex items-center gap-2 pl-6">
                <FileText className="h-3.5 w-3.5 text-teal-400" />
                <span className="font-medium">[INDIVIDUAL]</span> Review: {p.nome.slice(0, 50)}{p.nome.length > 50 ? "..." : ""}
              </div>
            ))}
          </div>
        )}

        {/* Progresso */}
        {gerando && (
          <div className="flex items-center gap-2 text-sm text-brand-600 animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin" />
            {etapa || "Gerando conteúdo... pode levar 1-2 minutos"}
          </div>
        )}

        {/* Resultados */}
        {concluido && resultados.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Posts criados:</p>
            {resultados.map((r, i) => (
              <div key={i} className={`flex items-start gap-2 p-2 rounded-lg text-sm ${r.erro ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"}`}>
                {r.erro
                  ? <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  : <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <span className="font-medium">[{r.tipo === "ranking" ? "RANKING" : "INDIVIDUAL"}]</span>{" "}
                  <span className="truncate">{r.titulo}</span>
                  {r.erro && <p className="text-xs text-red-600 mt-0.5">{r.erro}</p>}
                </div>
                {!r.erro && r.slug && (
                  <a
                    href={`/admin/posts/${r.postId}`}
                    className="shrink-0 text-green-700 hover:text-green-900"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Botões */}
        {!concluido && (
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => gerar("DRAFT")}
              disabled={gerando || produtosValidos.length === 0 || !titulo || !palavraPrimaria}
              className="flex-1"
            >
              {gerando ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Gerar como rascunhos
            </Button>
            <Button
              type="button"
              variant="brand"
              onClick={() => gerar("PUBLISHED")}
              disabled={gerando || produtosValidos.length === 0 || !titulo || !palavraPrimaria}
              className="flex-1"
            >
              {gerando ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Gerar e publicar
            </Button>
          </div>
        )}

        {concluido && (
          <Button
            type="button"
            variant="outline"
            onClick={() => { setConcluido(false); setResultados([]); }}
            className="w-full text-sm"
          >
            Gerar novamente
          </Button>
        )}

        {produtosValidos.length === 0 && (
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
            ⚠️ Importe pelo menos 1 produto antes de gerar.
          </p>
        )}
        {!titulo && (
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
            ⚠️ Preencha o título e a palavra primária antes de gerar.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
