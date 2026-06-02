"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // TODO: integrar com ConvertKit / Mailchimp / Brevo
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 800);
  }

  if (status === "success") {
    return (
      <div className="rounded-xl px-6 py-5 bg-white/15 text-center">
        <p className="font-sans font-semibold text-white text-base">
          Perfeito! Você vai receber os próximos achadinhos da Elis.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Seu melhor e-mail"
        required
        className="flex-1 px-4 py-3.5 rounded-lg text-sm font-sans outline-none border-0"
        style={{ backgroundColor: "#fff", color: "#1f2933" }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3.5 rounded-lg font-sans font-semibold text-sm whitespace-nowrap transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-70"
        style={{ backgroundColor: "#F9F5EC", color: "#2F5F4F" }}
      >
        {status === "loading" ? "Enviando..." : "Quero receber os achadinhos"}
      </button>
    </form>
  );
}
