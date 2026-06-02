"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Check } from "lucide-react";

const CONSENT_KEY = "cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_KEY);
      if (!saved) setVisible(true);
    } catch {
      // localStorage indisponível (modo privativo em alguns browsers)
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch { /* noop */ }
    setVisible(false);
  }

  function decline() {
    try {
      localStorage.setItem(CONSENT_KEY, "declined");
    } catch { /* noop */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 md:bottom-6 md:left-6 md:right-auto md:max-w-md"
    >
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-black/10 p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Cookie className="h-5 w-5 text-brand-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm mb-1">
              Cookies &amp; Privacidade
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Usamos cookies para melhorar sua experiência, analisar o tráfego
              e exibir anúncios relevantes. Você pode aceitar ou recusar os
              cookies não essenciais.{" "}
              <Link
                href="/politica-de-cookies"
                className="text-brand-600 underline underline-offset-2 hover:text-brand-700"
              >
                Saiba mais
              </Link>
              .
            </p>
          </div>
          <button
            onClick={decline}
            aria-label="Fechar"
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={accept}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 active:scale-95 transition-all"
          >
            <Check className="h-4 w-4" />
            Aceitar todos
          </button>
          <button
            onClick={decline}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all"
          >
            Somente essenciais
          </button>
        </div>
      </div>
    </div>
  );
}
