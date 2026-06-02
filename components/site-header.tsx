import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";

const navLinks = [
  { href: "/",                            label: "Home"          },
  { href: "/reviews",                     label: "Reviews"       },
  { href: "/categoria/smart-home",        label: "Smart Home"    },
  { href: "/categoria/iluminacao",        label: "Iluminação"    },
  { href: "/categoria/seguranca",         label: "Segurança"     },
  { href: "/categoria/audio-e-video",     label: "Áudio e Vídeo" },
  { href: "/categoria/climatizacao",      label: "Climatização"  },
  { href: "/metodologia",                 label: "Metodologia"   },
  { href: "/contato",                     label: "Contato"       },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full">

      {/* ── Barra superior ──────────────────────────────────── */}
      <div style={{ backgroundColor: "#00B4C8" }} className="text-white py-1.5 text-center text-xs font-sans hidden md:block font-medium tracking-wide">
        Reviews imparciais de tecnologia para casa inteligente — Smart Home, automação e muito mais.
      </div>

      {/* ── Navegação principal ─────────────────────────────── */}
      <div className="bg-white border-b shadow-sm" style={{ borderColor: "#E0F7FA" }}>
        <div className="container flex h-[72px] items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="shrink-0 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-domus-horizontal.png"
              alt="Domus Digital"
              className="h-12 w-auto transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* Nav desktop (lg+) */}
          <nav className="hidden lg:flex items-center gap-0 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2.5 py-2 text-sm font-sans font-medium text-gray-600 rounded-lg transition-colors"
                style={{
                  // hover handled via Tailwind below — using inline only for base
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile menu */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/reviews"
              className="hidden lg:inline-flex items-center px-5 py-2 text-sm font-sans font-bold text-white rounded-lg transition-colors"
              style={{ backgroundColor: "#00B4C8" }}
            >
              Ver reviews
            </Link>
            <MobileMenu />
          </div>

        </div>
      </div>

    </header>
  );
}
