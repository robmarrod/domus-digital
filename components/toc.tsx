"use client";

import { useState } from "react";
import { ChevronDown, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConteudoJson } from "@/lib/types";

interface TocItem {
  id: string;
  label: string;
}

function buildTocItems(conteudo: ConteudoJson): TocItem[] {
  const items: TocItem[] = [];

  if (conteudo.criterios?.length) {
    items.push({ id: "criterios", label: "Critérios de Avaliação" });
  }
  items.push({ id: "ranking", label: "Ranking Completo" });
  if (conteudo.secoes_complementares?.length) {
    conteudo.secoes_complementares.forEach((secao, i) => {
      items.push({
        id: `secao-${i}`,
        label: secao.titulo_h2,
      });
    });
  }
  if (conteudo.faq?.length) {
    items.push({ id: "faq", label: "Perguntas Frequentes" });
  }
  if (conteudo.conclusao) {
    items.push({ id: "conclusao", label: "Conclusão" });
  }

  return items;
}

interface TocProps {
  conteudo: ConteudoJson;
}

export function Toc({ conteudo }: TocProps) {
  const [open, setOpen] = useState(true);
  const items = buildTocItems(conteudo);

  if (items.length === 0) return null;

  return (
    <nav className="border border-brand-200 rounded-lg overflow-hidden bg-brand-50 mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 font-semibold text-brand-800 hover:bg-brand-100 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm">
          <List className="h-4 w-4" />
          Conteúdo deste artigo
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open ? "rotate-180" : ""
          )}
        />
      </button>

      {open && (
        <ol className="px-4 pb-4 space-y-1">
          {items.map((item, index) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="flex items-center gap-2 text-sm text-brand-700 hover:text-brand-900 hover:underline py-1 transition-colors"
              >
                <span className="text-xs text-brand-400 font-mono w-5 text-right flex-shrink-0">
                  {index + 1}.
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
