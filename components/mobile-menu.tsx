"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/",                      label: "Home"        },
  { href: "/reviews",               label: "Reviews"     },
  { href: "/produtos",              label: "Produtos"    },
  { href: "/categoria/sala",        label: "Sala"        },
  { href: "/categoria/quarto",      label: "Quarto"      },
  { href: "/categoria/cozinha",     label: "Cozinha"     },
  { href: "/categoria/varanda",     label: "Varanda"     },
  { href: "/categoria/organizacao", label: "Organização" },
  { href: "/metodologia",           label: "Metodologia" },
  { href: "/contato",               label: "Contato"     },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-brand-600 hover:bg-brand-100 transition-colors"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-[76px] left-0 right-0 bottom-0 z-50 bg-nude-200 lg:hidden transition-all duration-300 ease-out ${
          open ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible pointer-events-none"
        }`}
      >
        <nav className="flex flex-col p-4 gap-1 overflow-y-auto max-h-full">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-3.5 text-base font-sans font-semibold rounded-xl transition-colors ${
                pathname === link.href
                  ? "bg-brand-100 text-brand-600"
                  : "text-cafe-700 hover:bg-brand-100 hover:text-brand-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-nude-400">
            <Link
              href="/reviews"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-full py-3.5 px-6 bg-brand-500 text-white font-sans font-bold rounded-xl hover:bg-brand-600 transition-colors"
            >
              Ver reviews de hoje
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
