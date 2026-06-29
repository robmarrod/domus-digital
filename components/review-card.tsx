import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ReviewCardProps {
  slug: string;
  titulo: string;
  resumo: string;
  categoria: string;
  tipo: string;
  publishedAt: Date | string | null;
  imagemUrl?: string | null;
  featured?: boolean;
}

// Gradientes por categoria — paleta verde + bege
const categoryGradients: Record<string, string> = {
  sala:       "from-nude-300 to-nude-100",
  quarto:     "from-brand-100 to-nude-100",
  cozinha:    "from-amber-100 to-nude-100",
  lavanderia: "from-sky-100   to-nude-100",
  varanda:    "from-brand-100 to-nude-100",
  organizacao:"from-nude-300  to-nude-100",
  organização:"from-nude-300  to-nude-100",
  decoracao:  "from-nude-300  to-nude-100",
  decoração:  "from-nude-300  to-nude-100",
};

function normalizeKey(str: string) {
  return str
    .toLowerCase()
    .replace(/[áàãâ]/g, "a")
    .replace(/[éêè]/g, "e")
    .replace(/[óôõ]/g, "o")
    .replace(/[ç]/g, "c");
}

function getGradient(categoria: string) {
  const key = normalizeKey(categoria);
  return categoryGradients[key] ?? categoryGradients[categoria.toLowerCase()] ?? "from-nude-100 to-nude-50";
}

/** Placeholder elegante quando não há foto — gradiente + nome da categoria */
function ImagePlaceholder({
  categoria,
  gradient,
  height,
}: {
  categoria: string;
  gradient: string;
  height: string;
}) {
  return (
    <div className={`${height} bg-gradient-to-br ${gradient} relative overflow-hidden flex items-center justify-center`}>
      {/* Cantos decorativos */}
      <span className="absolute top-3 left-3 block w-4 h-4 border-l border-t border-cafe-400/20" />
      <span className="absolute top-3 right-3 block w-4 h-4 border-r border-t border-cafe-400/20" />
      <span className="absolute bottom-3 left-3 block w-4 h-4 border-l border-b border-cafe-400/20" />
      <span className="absolute bottom-3 right-3 block w-4 h-4 border-r border-b border-cafe-400/20" />
      {/* Categoria como watermark */}
      <span className="font-serif text-2xl font-light tracking-[0.25em] text-cafe-500/20 uppercase select-none pointer-events-none">
        {categoria}
      </span>
    </div>
  );
}

export function ReviewCard({
  slug,
  titulo,
  resumo,
  categoria,
  tipo,
  publishedAt,
  imagemUrl,
  featured = false,
}: ReviewCardProps) {
  const gradient  = getGradient(categoria);
  const tipoLabel = tipo === "PRODUTO" ? "Produto" : tipo === "REVIEW" ? "Review" : "Guia";

  if (featured) {
    return (
      <Link href={`/reviews/${slug}`} className="group block">
        <article className="bg-white rounded-2xl border border-nude-200 shadow-sm hover:shadow-brand-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">

          {/* Imagem ou placeholder */}
          <div className="relative">
            {imagemUrl ? (
              <img
                src={imagemUrl}
                alt={titulo}
                className="h-52 w-full object-cover"
                loading="lazy"
              />
            ) : (
              <ImagePlaceholder categoria={categoria} gradient={gradient} height="h-52" />
            )}
            {/* Badges sobrepostos */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-bold bg-brand-500 text-white uppercase tracking-wide shadow-sm">
                {tipoLabel}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-semibold bg-white/85 text-teal-700 border border-teal-200 capitalize">
                {categoria}
              </span>
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-xl font-serif font-semibold text-cafe-800 group-hover:text-brand-600 transition-colors leading-snug mb-3 line-clamp-2">
              {titulo}
            </h3>
            <p className="text-sm font-sans text-cafe-500 leading-relaxed line-clamp-3 mb-5">
              {resumo}
            </p>
            <div className="flex items-center justify-between">
              {publishedAt && (
                <div className="flex items-center gap-1.5 text-xs font-sans text-cafe-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(publishedAt)}</span>
                </div>
              )}
              <span className="inline-flex items-center gap-1 text-sm font-sans font-semibold text-brand-500 group-hover:gap-2 transition-all">
                Ler análise <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/reviews/${slug}`} className="group block">
      <article className="bg-white rounded-2xl border border-nude-100 shadow-sm hover:shadow-brand-md transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col">

        {/* Imagem ou placeholder */}
        <div className="relative">
          {imagemUrl ? (
            <img
              src={imagemUrl}
              alt={titulo}
              className="h-36 w-full object-cover"
              loading="lazy"
            />
          ) : (
            <ImagePlaceholder categoria={categoria} gradient={gradient} height="h-36" />
          )}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-sans font-bold bg-brand-500 text-white uppercase tracking-wide">
              {tipoLabel}
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <span className="text-xs font-sans font-semibold text-teal-600 capitalize mb-1.5">
            {categoria}
          </span>
          <h3 className="font-serif font-semibold text-cafe-800 group-hover:text-brand-600 transition-colors leading-snug line-clamp-2 mb-2 flex-1">
            {titulo}
          </h3>
          <p className="text-xs font-sans text-cafe-400 leading-relaxed line-clamp-2 mb-4">
            {resumo}
          </p>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-nude-100">
            {publishedAt && (
              <div className="flex items-center gap-1 text-xs font-sans text-cafe-400">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(publishedAt)}</span>
              </div>
            )}
            <span className="text-xs font-sans font-semibold text-brand-500 flex items-center gap-1 group-hover:gap-1.5 transition-all">
              Ler <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
