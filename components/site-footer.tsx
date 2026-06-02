import Link from "next/link";

const navCategorias = [
  { href: "/reviews",                     label: "Reviews"       },
  { href: "/categoria/smart-home",        label: "Smart Home"    },
  { href: "/categoria/iluminacao",        label: "Iluminação"    },
  { href: "/categoria/seguranca",         label: "Segurança"     },
  { href: "/categoria/audio-e-video",     label: "Áudio e Vídeo" },
  { href: "/categoria/climatizacao",      label: "Climatização"  },
];

const navSobre = [
  { href: "/sobre",        label: "Sobre o Domus" },
  { href: "/metodologia",  label: "Metodologia"   },
  { href: "/contato",      label: "Contato"       },
];

const navLegal = [
  { href: "/politica-de-privacidade", label: "Política de Privacidade" },
  { href: "/politica-de-cookies",     label: "Política de Cookies"     },
  { href: "/termos-de-uso",           label: "Termos de Uso"           },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-800 text-white">

      {/* Conteúdo principal */}
      <div className="container py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Marca */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5 w-fit group">
              <div className="leading-none">
                <div className="text-2xl font-serif font-bold text-white leading-none tracking-wide">
                  Domus Digital
                </div>
                <div className="text-[9px] font-sans text-white/35 tracking-[0.18em] uppercase mt-1">
                  Tecnologia inteligente para sua casa
                </div>
              </div>
            </Link>

            <p className="text-sm font-sans leading-relaxed text-white/65 mb-5">
              Reviews e rankings dos melhores produtos de smart home e automação residencial.
              Comparamos para você decidir com segurança.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-white/35 mb-4">
              Navegação
            </h3>
            <ul className="space-y-2.5">
              {navCategorias.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-sans text-brand-200 hover:text-white hover:underline transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sobre */}
          <div>
            <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-white/35 mb-4">
              Sobre
            </h3>
            <ul className="space-y-2.5">
              {navSobre.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-sans text-brand-200 hover:text-white hover:underline transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Transparência */}
          <div>
            <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-white/35 mb-4">
              Legal / Transparência
            </h3>
            <ul className="space-y-2.5 mb-5">
              {navLegal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-sans text-brand-200 hover:text-white hover:underline transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="rounded-xl p-4 bg-white/8 border border-white/10">
              <p className="text-xs font-sans text-white/55 leading-relaxed">
                Participamos de programas de afiliados da Shopee, Mercado Livre e Amazon.
                Ao comprar pelos nossos links, podemos receber uma comissão sem custo extra
                para você. Isso não influencia nossa independência editorial.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Rodapé inferior */}
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-sans text-white/40">
            © {year} Domus Digital. Todos os direitos reservados.
          </p>
          <p className="text-xs font-sans text-white/40">
            Tecnologia inteligente para sua casa
          </p>
        </div>
      </div>

    </footer>
  );
}
