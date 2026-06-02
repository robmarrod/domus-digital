import Link from "next/link";
import { PenLine } from "lucide-react";

interface AuthorBoxProps {
  publishedAt?: Date | null;
  updatedAt?: Date | null;
}

export function AuthorBox({ publishedAt, updatedAt }: AuthorBoxProps) {
  const displayDate = updatedAt ?? publishedAt;
  const dateStr = displayDate
    ? new Intl.DateTimeFormat("pt-BR", {
        day:   "2-digit",
        month: "long",
        year:  "numeric",
      }).format(new Date(displayDate))
    : null;

  return (
    <aside className="flex items-start gap-4 p-5 rounded-2xl border border-nude-200 bg-nude-50 my-10">

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="h-14 w-14 rounded-full flex items-center justify-center text-white text-2xl font-serif font-semibold select-none"
          style={{ background: "linear-gradient(135deg, #6f7350 0%, #a97a55 100%)" }}
          aria-hidden="true"
        >
          E
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-brand-500 border-2 border-nude-50 flex items-center justify-center">
          <PenLine className="h-2.5 w-2.5 text-white" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
          <p className="font-serif font-semibold text-cafe-800 text-sm">Elis</p>
          <span className="text-xs text-cafe-300">·</span>
          <span className="text-xs font-sans text-cafe-500 font-medium">
            Curadora de Casa &amp; Decoração
          </span>
        </div>
        <p className="text-xs font-sans text-cafe-600 leading-relaxed mb-2">
          Apaixonada por transformar lares com curadoria honesta de produtos.
          Pesquiso, comparo e escrevo sobre o que realmente vale a pena —{" "}
          sem achismos, só com base em dados e experiência real.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/sobre"
            className="text-xs font-sans text-brand-600 font-semibold hover:text-brand-700 hover:underline transition-colors"
          >
            Conheça a Elis →
          </Link>
          {dateStr && (
            <span className="text-xs font-sans text-cafe-400">
              Publicado em {dateStr}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
