"use client";

import { useState } from "react";
import { Plus, Trash2, ExternalLink, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export interface LinkEntry {
  palavra: string;
  url: string;
  tipo: "interno" | "externo";
  novaAba: boolean;
}

interface LinksPanelProps {
  links: LinkEntry[];
  onChange: (links: LinkEntry[]) => void;
}

export function LinksPanel({ links, onChange }: LinksPanelProps) {
  const [novaPalavra, setNovaPalavra] = useState("");
  const [novaUrl, setNovaUrl] = useState("");
  const [novoTipo, setNovoTipo] = useState<"interno" | "externo">("interno");
  const [novaAba, setNovaAba] = useState(false);

  function adicionar() {
    if (!novaPalavra.trim() || !novaUrl.trim()) return;
    onChange([
      ...links,
      { palavra: novaPalavra.trim(), url: novaUrl.trim(), tipo: novoTipo, novaAba },
    ]);
    setNovaPalavra("");
    setNovaUrl("");
    setNovoTipo("interno");
    setNovaAba(false);
  }

  function remover(index: number) {
    onChange(links.filter((_, i) => i !== index));
  }

  function atualizar(index: number, campo: keyof LinkEntry, valor: string | boolean) {
    onChange(links.map((l, i) => (i === index ? { ...l, [campo]: valor } : l)));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link className="h-4 w-4 text-gray-500" />
          <CardTitle className="text-base">Backlinks (internos e externos)</CardTitle>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Adicione palavras-âncora com links. O sistema substitui automaticamente no conteúdo gerado e publicado.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Links existentes */}
        {links.length > 0 && (
          <div className="space-y-2">
            {links.map((link, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center p-2 border rounded-lg bg-gray-50">
                <div className="col-span-3">
                  <Input
                    value={link.palavra}
                    onChange={(e) => atualizar(i, "palavra", e.target.value)}
                    placeholder="palavra-âncora"
                    className="text-sm h-8"
                  />
                </div>
                <div className="col-span-5">
                  <Input
                    value={link.url}
                    onChange={(e) => atualizar(i, "url", e.target.value)}
                    placeholder="https://..."
                    className="text-sm h-8 font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <Select
                    value={link.tipo}
                    onValueChange={(v) => atualizar(i, "tipo", v)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interno">Interno</SelectItem>
                      <SelectItem value="externo">Externo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={link.novaAba}
                    onChange={(e) => atualizar(i, "novaAba", e.target.checked)}
                    className="accent-brand-500"
                    title="Abrir em nova aba"
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remover(i)}
                    className="text-red-400 hover:text-red-600 p-1 h-8 w-8"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-12 gap-2 px-2">
              <div className="col-span-3 text-xs text-gray-400">Palavra-âncora</div>
              <div className="col-span-5 text-xs text-gray-400">URL</div>
              <div className="col-span-2 text-xs text-gray-400">Tipo</div>
              <div className="col-span-1 text-xs text-gray-400 text-center">Nova aba</div>
              <div className="col-span-1"></div>
            </div>
          </div>
        )}

        {/* Adicionar novo link */}
        <div className="border-t pt-3 space-y-2">
          <Label className="text-xs font-semibold text-gray-600">Adicionar link</Label>
          <div className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-3">
              <Input
                value={novaPalavra}
                onChange={(e) => setNovaPalavra(e.target.value)}
                placeholder="palavra-âncora"
                className="text-sm h-9"
                onKeyDown={(e) => e.key === "Enter" && adicionar()}
              />
            </div>
            <div className="col-span-5">
              <Input
                value={novaUrl}
                onChange={(e) => setNovaUrl(e.target.value)}
                placeholder="https://..."
                className="text-sm h-9 font-mono"
                onKeyDown={(e) => e.key === "Enter" && adicionar()}
              />
            </div>
            <div className="col-span-2">
              <Select value={novoTipo} onValueChange={(v) => setNovoTipo(v as "interno" | "externo")}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 flex items-center justify-center pb-1">
              <input
                type="checkbox"
                checked={novaAba}
                onChange={(e) => setNovaAba(e.target.checked)}
                className="accent-brand-500"
                title="Abrir em nova aba"
              />
            </div>
            <div className="col-span-1">
              <Button
                type="button"
                onClick={adicionar}
                size="sm"
                variant="outline"
                className="h-9 w-full"
                disabled={!novaPalavra.trim() || !novaUrl.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {links.length > 0 && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            Links externos com "novaAba" marcado recebem{" "}
            <code className="bg-gray-100 px-1 rounded">target="_blank" rel="nofollow"</code>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
