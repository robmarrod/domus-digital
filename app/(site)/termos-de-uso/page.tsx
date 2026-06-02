import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Leia os Termos de Uso do Achadinhos da Elis e entenda as regras de uso do nosso conteúdo editorial.",
};

export default function TermosUsoPage() {
  return (
    <div className="bg-nude-200 min-h-screen">
    <div className="container max-w-3xl py-12">
      <h1 className="font-serif text-3xl font-bold text-cafe-800 mb-2">
        Termos de Uso
      </h1>
      <p className="text-sm font-sans text-cafe-500 mb-8">
        Última atualização: maio de 2025
      </p>

      <div className="prose-editorial space-y-8">
        <section>
          <h2>Aceitação dos termos</h2>
          <p>
            Ao acessar e utilizar o site Achadinhos da Elis, você concorda com
            os presentes Termos de Uso. Se não concordar com algum dos termos,
            pedimos que não utilize o site.
          </p>
        </section>

        <section>
          <h2>Natureza do conteúdo</h2>
          <p>
            O Achadinhos da Elis é um site editorial de curadoria e reviews de
            produtos para casa e decoração. Todo o conteúdo publicado representa
            a opinião e análise da equipe editorial, com base em pesquisa
            aprofundada, e não deve ser interpretado como endosso obrigatório de
            nenhum produto ou marca específica.
          </p>
          <p>
            As avaliações publicadas são baseadas em informações disponíveis no
            momento da publicação. Preços, disponibilidade e especificações
            técnicas dos produtos podem mudar sem aviso prévio, e a
            responsabilidade por essas informações é dos respectivos vendedores
            e fabricantes.
          </p>
        </section>

        <section>
          <h2>Propriedade intelectual</h2>
          <p>
            Todo o conteúdo produzido pelo Achadinhos da Elis — textos,
            rankings, análises, estrutura editorial e design — é protegido por
            direitos autorais. É expressamente proibido:
          </p>
          <ul>
            <li>
              Reproduzir, copiar ou publicar conteúdo deste site sem autorização
              prévia por escrito
            </li>
            <li>
              Usar nosso conteúdo para fins comerciais sem permissão
            </li>
            <li>
              Remover atribuições ou créditos dos nossos materiais
            </li>
          </ul>
          <p>
            Compartilhamentos de links para nosso conteúdo são sempre
            bem-vindos, desde que acompanhados de atribuição clara ao
            Achadinhos da Elis.
          </p>
        </section>

        <section>
          <h2>Links de afiliado</h2>
          <p>
            Este site participa de programas de afiliados da Shopee, Mercado
            Livre e Amazon. Ao clicar em links de compra, você poderá ser
            redirecionado para essas plataformas. Quaisquer transações realizadas
            nessas plataformas estão sujeitas exclusivamente aos termos e
            condições delas.
          </p>
          <p>
            O Achadinhos da Elis não se responsabiliza por: qualidade dos
            produtos adquiridos, prazo de entrega, serviço de atendimento ao
            cliente das plataformas ou qualquer problema decorrente da compra.
          </p>
        </section>

        <section>
          <h2>Limitação de responsabilidade</h2>
          <p>
            O Achadinhos da Elis emprega esforços para manter as informações
            atualizadas e precisas, mas não garante a completude, exatidão ou
            adequação do conteúdo para finalidades específicas. O uso das
            informações do site é de inteira responsabilidade do usuário.
          </p>
        </section>

        <section>
          <h2>Conduta do usuário</h2>
          <p>
            Ao utilizar este site, você se compromete a não:
          </p>
          <ul>
            <li>Utilizar o site para fins ilegais ou não autorizados</li>
            <li>
              Tentar acessar áreas restritas do site sem autorização
            </li>
            <li>
              Transmitir conteúdo malicioso, spam ou qualquer tipo de vírus
            </li>
            <li>
              Interferir no funcionamento técnico do site
            </li>
          </ul>
        </section>

        <section>
          <h2>Modificações nos termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer
            momento. As alterações entram em vigor imediatamente após a
            publicação no site. O uso continuado do site após alterações
            constitui sua aceitação dos novos termos.
          </p>
        </section>

        <section>
          <h2>Legislação aplicável</h2>
          <p>
            Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer
            disputa será resolvida nos tribunais competentes do Brasil, com foro
            eleito na comarca de São Paulo — SP.
          </p>
        </section>

        <section>
          <h2>Contato</h2>
          <p>
            Dúvidas sobre estes termos? Entre em contato:{" "}
            <strong>contato@achadinhosdaelis.com.br</strong>
          </p>
        </section>
      </div>
    </div>
    </div>
  );
}
