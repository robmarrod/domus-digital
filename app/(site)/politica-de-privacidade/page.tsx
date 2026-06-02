import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Entenda como o Achadinhos da Elis coleta, usa e protege suas informações pessoais.",
};

export default function PoliticaPrivacidadePage() {
  return (
    <div className="bg-nude-200 min-h-screen">
    <div className="container max-w-3xl py-12">
      <h1 className="font-serif text-3xl font-bold text-cafe-800 mb-2">
        Política de Privacidade
      </h1>
      <p className="text-sm font-sans text-cafe-500 mb-8">
        Última atualização: maio de 2025
      </p>

      <div className="prose-editorial space-y-8">
        <section>
          <h2>Quem somos</h2>
          <p>
            O <strong>Achadinhos da Elis</strong> é um blog editorial
            especializado em reviews e curadoria de produtos para casa e
            decoração. Nosso objetivo é ajudar consumidores brasileiros a tomar
            decisões de compra mais informadas, por meio de análises
            independentes e transparentes.
          </p>
        </section>

        <section>
          <h2>Quais dados coletamos</h2>
          <p>
            Coletamos apenas as informações necessárias para o funcionamento do
            site e para entendermos como podemos melhorar nossa experiência:
          </p>
          <ul>
            <li>
              <strong>Dados de navegação:</strong> páginas visitadas, tempo de
              permanência, origem do acesso e dispositivo utilizado — coletados
              de forma anônima via ferramentas de análise.
            </li>
            <li>
              <strong>Cookies:</strong> utilizamos cookies técnicos essenciais
              para o funcionamento do site e cookies analíticos para entender o
              comportamento de navegação.
            </li>
            <li>
              <strong>Dados de formulário:</strong> caso você entre em contato
              por algum formulário ou e-mail, coletamos apenas as informações
              fornecidas voluntariamente.
            </li>
          </ul>
        </section>

        <section>
          <h2>Links de afiliado e terceiros</h2>
          <p>
            Este site contém links de afiliado para Shopee, Mercado Livre e
            Amazon. Ao clicar nesses links, você será redirecionado para as
            plataformas parceiras, que possuem suas próprias políticas de
            privacidade e cookies. O Achadinhos da Elis não tem controle sobre
            as práticas de privacidade dessas plataformas.
          </p>
          <p>
            Quando você realiza uma compra por um link de afiliado, podemos
            receber uma comissão — sem custo adicional para você. Isso não
            influencia nossas recomendações editoriais.
          </p>
        </section>

        <section>
          <h2>Como usamos suas informações</h2>
          <p>
            As informações coletadas são usadas exclusivamente para:
          </p>
          <ul>
            <li>Melhorar a experiência de navegação no site</li>
            <li>Entender quais conteúdos são mais úteis para nossa audiência</li>
            <li>Responder a solicitações de contato</li>
            <li>
              Análise estatística anônima de acesso, sem identificação pessoal
            </li>
          </ul>
          <p>
            Não vendemos, alugamos nem compartilhamos seus dados pessoais com
            terceiros para fins comerciais.
          </p>
        </section>

        <section>
          <h2>Seus direitos (LGPD)</h2>
          <p>
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº
            13.709/2018), você tem o direito de:
          </p>
          <ul>
            <li>Saber quais dados seus são armazenados</li>
            <li>Solicitar a correção de dados incorretos</li>
            <li>Solicitar a exclusão de seus dados pessoais</li>
            <li>Revogar consentimentos dados anteriormente</li>
          </ul>
          <p>
            Para exercer esses direitos, entre em contato pelo e-mail
            indicado na seção de contato deste site.
          </p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>
            Utilizamos cookies para melhorar sua experiência de navegação. Ao
            continuar navegando no site, você concorda com o uso de cookies nos
            termos desta política. Você pode configurar seu navegador para
            recusar cookies, mas isso pode afetar algumas funcionalidades do
            site.
          </p>
        </section>

        <section>
          <h2>Alterações nesta política</h2>
          <p>
            Podemos atualizar esta política de privacidade periodicamente. Em
            caso de alterações significativas, publicaremos um aviso no site.
            Recomendamos que você revise esta página regularmente.
          </p>
        </section>

        <section>
          <h2>Contato</h2>
          <p>
            Dúvidas sobre esta política ou sobre o tratamento de seus dados?
            Entre em contato pelo e-mail:{" "}
            <strong>contato@achadinhosdaelis.com.br</strong>
          </p>
        </section>
      </div>
    </div>
    </div>
  );
}
