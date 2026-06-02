"use client";

import { useState, useEffect } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  id: string;
  label: string;
  indent?: boolean;
  posicao?: number;
}

export function RankingSidebar({ items }: { items: SidebarItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pega o último elemento visível (mais próximo do topo)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="bg-white border border-nude-400 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-nude-200 px-4 py-3 border-b border-nude-400">
        <p className="text-xs font-bold text-cafe-600 uppercase tracking-widest flex items-center gap-2">
          <List className="h-3.5 w-3.5" />
          Lista de conteúdos
        </p>
      </div>
      <ul className="p-2 space-y-0.5">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-all",
                  item.indent ? "pl-4" : "",
                  isActive
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "text-cafe-600 hover:bg-nude-100 hover:text-cafe-800"
                )}
              >
                {item.posicao !== undefined && (
                  <span
                    className={cn(
                      "flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center",
                      isActive
                        ? "bg-brand-500 text-white"
                        : "bg-nude-300 text-cafe-500"
                    )}
                  >
                    {item.posicao}
                  </span>
                )}
                <span className={cn("leading-snug", item.indent ? "text-xs" : "text-sm")}>
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
