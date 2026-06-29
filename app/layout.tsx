import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

// Poppins — títulos (font-serif no Tailwind, para compatibilidade com componentes)
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Inter — corpo de texto
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Achadinhos da Elis – Melhores Produtos para Casa e Decoração",
    template: "%s – Achadinhos da Elis",
  },
  description:
    "Curadoria imparcial dos melhores produtos para casa e decoração. Reviews completos, rankings e guias para você tomar a melhor decisão de compra.",
  keywords: [
    "produtos para casa",
    "decoração",
    "reviews",
    "melhores produtos",
    "casa e decoração",
    "afiliados",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Achadinhos da Elis",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable}`}>
      {/* GA4: adicionar aqui quando criar a propriedade do Domus Digital no Google Analytics */}
      <body
        className="min-h-screen font-sans antialiased"
        style={{ backgroundColor: "#F9F5EC" }}
      >
        {children}
      </body>
    </html>
  );
}
