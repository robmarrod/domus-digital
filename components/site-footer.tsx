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
    <footer style={{ backgroundColor: "#006064" }} className="text-white">

      {/* Conteúdo principal */}
      <div className="container py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Marca */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-5 w-fit group">
              {/* Logo inline: DOMUS (vermelho) + DIGITAL (teal) */}
              <div className="flex items-center gap-3">
                {/* Ícone da casa em SVG inline */}
                <svg width="40" height="44" viewBox="0 0 58 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 32 L10 58 Q10 62 14 62 L44 62 Q48 62 48 58 L48 32" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 30 L29 10 L56 30" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="29" cy="53" r="2.8" fill="white"/>
                  <path d="M21 46 Q29 39 37 46" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
                  <path d="M13 40 Q29 29 45 40" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
                  <circle cx="46" cy="18" r="4" fill="white" opacity="0.4"/>
                  <circle cx="46" cy="18" r="2" fill="white" opacity="0.8"/>
                </svg>
                <div className="leading-none">
                  <div className="text-xl font-sans font-black leading-none tracking-wide" style={{ color: "#E84444" }}>
                    DOMUS
                  </div>
                  <div className="text-xl font-sans font-black leading-none tracking-wide" style={{ color: "#00B4C8" }}>
                    DIGITAL
                  </div>
                </div>
              </div>
            </Link>

            <p className="text-sm font-sans leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.65)" }}>
              Reviews e rankings dos melhores produtos de smart home e automação residencial.
              Comparamos para você decidir com segurança.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="text-xs font-sans font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Navegação
            </h3>
            <ul className="space-y-2.5">
              {navCategorias.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-sans hover:text-white hover:underline transition-colors"
                    style={{ color: "#80DEEA" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sobre */}
          <div>
            <h3 className="text-xs font-sans font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Sobre
            </h3>
            <ul className="space-y-2.5">
              {navSobre.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-sans hover:text-white hover:underline transition-colors"
                    style={{ color: "#80DEEA" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Transparência */}
          <div>
            <h3 className="text-xs font-sans font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Legal / Transparência
            </h3>
            <ul className="space-y-2.5 mb-5">
              {navLegal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-sans hover:text-white hover:underline transition-colors"
                    style={{ color: "#80DEEA" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <p className="text-xs font-sans leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                Participamos de programas de afiliados da Shopee, Mercado Livre e Amazon.
                Ao comprar pelos nossos links, podemos receber uma comissão sem custo extra
                para você. Isso não influencia nossa independência editorial.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Faixa accent teal */}
      <div style={{ backgroundColor: "#00B4C8", height: "3px" }} />

      {/* Rodapé inferior */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-sans" style={{ color: "rgba(255,255,255,0.4)" }}>
            © {year} Domus Digital. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-sans font-bold" style={{ color: "#E84444" }}>DOMUS</span>
            <span className="text-xs font-sans font-bold" style={{ color: "#00B4C8" }}>DIGITAL</span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>— Tecnologia inteligente para sua casa</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
