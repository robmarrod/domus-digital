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
    default: "Domus Digital – Reviews de Tecnologia para Casa Inteligente",
    template: "%s – Domus Digital",
  },
  description:
    "Reviews e rankings dos melhores produtos de smart home, automação residencial e tecnologia para casa. Comparamos para você decidir melhor.",
  keywords: [
    "smart home",
    "casa inteligente",
    "automação residencial",
    "reviews",
    "melhores produtos",
    "tecnologia para casa",
    "afiliados",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Domus Digital",
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
      <body
        className="min-h-screen font-sans antialiased"
        style={{ backgroundColor: "#F9F5EC" }}
      >
        {children}
      </body>
    </html>
  );
}
