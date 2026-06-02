import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Cookies – Achadinhos da Elis",
  description:
    "Saiba quais cookies utilizamos no site Achadinhos da Elis, para que servem e como você pode gerenciá-los conforme a LGPD.",
};

export default function PoliticaDeCookiesPage() {
  return (
    <div className="bg-nude-200 min-h-screen">
    <div className="container py-12 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-cafe-500 mb-8">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Início
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-cafe-800 font-medium">Política de Cookies</span>
      </nav>

      <header className="mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-cafe-800 mb-4">
          Política de Cookies
        </h1>
        <p className="text-cafe-500 text-sm">
          Última atualização: maio de 2025
        </p>
      </header>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

        <section>
          <h2 className="font-serif text-xl font-bold text-cafe-800 mb-3">
            1. O que são cookies?
          </h2>
          <p>
            Cookies são pequenos arquivos de texto que um site salva no seu
            navegador quando você o visita. Eles permitem que o site "lembre" de
            suas preferências ou ações durante um período de tempo, para que
            você não precise reinformá-las cada vez que voltar ao site.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-cafe-800 mb-3">
            2. Como usamos os cookies
          </h2>
          <p>
            O site <strong>Achadinhos da Elis</strong> (achadinhosdaelis.com.br)
            utiliza cookies para melhorar sua experiência de navegação e para
            fins analíticos. Abaixo detalhamos cada categoria:
          </p>

          <h3 className="font-semibold text-cafe-800 mt-5 mb-2">
            2.1 Cookies estritamente necessários
          </h3>
          <p>
            Esses cookies são indispensáveis para o funcionamento do site. Sem
            eles, serviços básicos como segurança e preferências de sessão não
            funcionariam corretamente. Não é possível desativá-los.
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
            <li>
              <strong>cookie_consent</strong> — Armazena sua escolha sobre
              cookies (aceito/recusado). Duração: 1 ano.
            </li>
          </ul>

          <h3 className="font-semibold text-cafe-800 mt-5 mb-2">
            2.2 Cookies analíticos e de desempenho
          </h3>
          <p>
            Usamos o <strong>Google Analytics</strong> para entender como os
            visitantes interagem com o site (páginas mais acessadas, tempo de
            permanência, origem do tráfego). Esses dados são anonimizados e nos
            ajudam a melhorar o conteúdo.
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
            <li>
              <strong>_ga</strong> — Identifica sessões únicas. Duração: 2 anos.
            </li>
            <li>
              <strong>_gid</strong> — Distingue usuários. Duração: 24 horas.
            </li>
            <li>
              <strong>_gat</strong> — Controla a taxa de requisições. Duração:
              1 minuto.
            </li>
          </ul>

          <h3 className="font-semibold text-cafe-800 mt-5 mb-2">
            2.3 Cookies de publicidade (Google AdSense)
          </h3>
          <p>
            Utilizamos o <strong>Google AdSense</strong> para exibir anúncios
            relevantes. O Google pode usar cookies para personalizar os anúncios
            com base no histórico de navegação.
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
            <li>
              <strong>IDE</strong> — Cookie do Google DoubleClick para anúncios.
              Duração: 1 ano.
            </li>
            <li>
              <strong>DSID</strong> — Identifica usuário autenticado. Duração:
              2 semanas.
            </li>
          </ul>
          <p className="mt-2 text-sm">
            Para optar por não receber anúncios personalizados do Google, acesse{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              adssettings.google.com
            </a>
            .
          </p>

          <h3 className="font-semibold text-cafe-800 mt-5 mb-2">
            2.4 Cookies de afiliados
          </h3>
          <p>
            Quando você clica em links de afiliado (Shopee, Mercado Livre,
            Amazon), esses sites podem instalar seus próprios cookies para
            rastrear a conversão e creditar nossa comissão. Esses cookies são
            regidos pelas políticas de privacidade de cada plataforma:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
            <li>
              <a
                href="https://www.amazon.com.br/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline"
              >
                Política de Privacidade da Amazon
              </a>
            </li>
            <li>
              <a
                href="https://shopee.com.br/legaldoc/privacypolicy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline"
              >
                Política de Privacidade da Shopee
              </a>
            </li>
            <li>
              <a
                href="https://www.mercadolivre.com.br/privacidade"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline"
              >
                Política de Privacidade do Mercado Livre
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-cafe-800 mb-3">
            3. Como gerenciar ou desativar cookies
          </h2>
          <p>
            Você pode a qualquer momento alterar suas preferências de cookies
            pelo banner de consentimento que aparece na primeira visita ao site.
          </p>
          <p className="mt-3">
            Além disso, todos os navegadores modernos permitem gerenciar cookies
            diretamente:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
            <li>
              <strong>Chrome:</strong> Configurações → Privacidade e segurança →
              Cookies e outros dados de sites
            </li>
            <li>
              <strong>Firefox:</strong> Preferências → Privacidade e segurança →
              Cookies e dados de sites
            </li>
            <li>
              <strong>Safari:</strong> Preferências → Privacidade → Gerenciar
              dados de sites
            </li>
            <li>
              <strong>Edge:</strong> Configurações → Cookies e permissões do
              site
            </li>
          </ul>
          <p className="mt-3 text-sm text-cafe-500">
            Atenção: desativar cookies pode afetar o funcionamento de algumas
            partes do site.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-cafe-800 mb-3">
            4. Base legal (LGPD)
          </h2>
          <p>
            O uso de cookies analíticos e publicitários é realizado com base no
            seu <strong>consentimento</strong> (art. 7º, I da Lei 13.709/2018 —
            LGPD). Você pode retirar seu consentimento a qualquer momento,
            conforme descrito na seção anterior.
          </p>
          <p className="mt-3">
            Cookies estritamente necessários são utilizados com base no
            interesse legítimo para garantir o funcionamento do site (art. 7º,
            IX da LGPD).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-cafe-800 mb-3">
            5. Contato
          </h2>
          <p>
            Dúvidas sobre nossa Política de Cookies? Entre em contato pelo
            e-mail{" "}
            <a
              href="mailto:contato@achadinhosdaelis.com.br"
              className="text-brand-600 font-medium hover:underline"
            >
              contato@achadinhosdaelis.com.br
            </a>{" "}
            ou acesse nossa{" "}
            <Link href="/contato" className="text-brand-600 hover:underline">
              página de contato
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-cafe-800 mb-3">
            6. Alterações nesta política
          </h2>
          <p>
            Podemos atualizar esta Política de Cookies periodicamente.
            Notificaremos mudanças relevantes por meio de banner no site ou
            atualização da data de revisão no topo desta página. Recomendamos
            que você consulte esta página regularmente.
          </p>
        </section>

        <div className="pt-4 border-t border-nude-400 text-sm text-cafe-500">
          Ver também:{" "}
          <Link
            href="/politica-de-privacidade"
            className="text-brand-600 hover:underline mr-3"
          >
            Política de Privacidade
          </Link>
          <Link href="/termos-de-uso" className="text-brand-600 hover:underline">
            Termos de Uso
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
