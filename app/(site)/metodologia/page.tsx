import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, BookOpen, PenLine, BarChart3, RefreshCw, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Nossa Metodologia",
  description:
    "Entenda como o Achadinhos da Elis seleciona e avalia os melhores produtos para casa e decoração com rigor, transparência e independência editorial.",
};

const passos = [
  {
    num: "01",
    titulo: "Investigação",
    Icon: Search,
    descricao:
      "Tudo começa com as perguntas reais das pessoas. Analisamos as buscas mais frequentes no Google, monitoramos fóruns e comunidades de decoração e identificamos quais dúvidas sobre produtos para casa ainda ficam sem resposta satisfatória.",
    detalhes: [
      "Mapeamos palavras-chave com volume de busca real",
      "Lemos avaliações e dúvidas em grupos de decoração",
      "Identificamos gaps de conteúdo nos primeiros resultados do Google",
      "Priorizamos temas com maior potencial de ajudar nossa leitora",
    ],
  },
  {
    num: "02",
    titulo: "Imersão",
    Icon: BookOpen,
    descricao:
      "Antes de escrever uma única linha, mergulhamos profundamente no assunto. Isso significa consultar especificações técnicas dos fabricantes, ler estudos de materiais, comparar marcas lado a lado e coletar avaliações de compradores reais em Shopee, Mercado Livre, Amazon e fóruns especializados.",
    detalhes: [
      "Leitura de especificações técnicas dos fabricantes",
      "Coleta e análise de avaliações verificadas de consumidores",
      "Comparação de materiais, acabamentos e garantias",
      "Consulta a especialistas em design de interiores e têxteis quando relevante",
    ],
  },
  {
    num: "03",
    titulo: "Criação",
    Icon: PenLine,
    descricao:
      "Com toda a pesquisa em mãos, criamos conteúdo 100% original — nunca copiamos, nunca traduzimos literalmente de outros sites. Cada artigo tem estrutura clara com critérios de avaliação explícitos, ranking fundamentado e seções complementares que enriquecem a decisão de compra.",
    detalhes: [
      "Conteúdo original, nunca copiado de outras fontes",
      "Estrutura com introdução, critérios, ranking, FAQ e conclusão",
      "Linguagem clara e direta, sem jargões desnecessários",
      "Palavra-chave distribuída naturalmente ao longo do texto",
    ],
  },
  {
    num: "04",
    titulo: "Comparação",
    Icon: BarChart3,
    descricao:
      "O coração de cada review é a comparação criteriosa. Definimos critérios objetivos antes de avaliar qualquer produto — como resistência UV para cortinas externas ou densidade de fibra para tapetes — e aplicamos os mesmos parâmetros a todos os candidatos do ranking.",
    detalhes: [
      "Critérios de avaliação definidos antes da análise dos produtos",
      "Mesmos parâmetros aplicados a todos os produtos comparados",
      "Rótulos honestos: Maior Desempenho, Nossa Escolha, Custo-Benefício",
      "Prós e contras reais, não apenas propaganda do fabricante",
    ],
  },
  {
    num: "05",
    titulo: "Atualização",
    Icon: RefreshCw,
    descricao:
      "O mercado de produtos para casa muda constantemente: novos modelos surgem, preços flutuam, marcas descontinuam produtos. Por isso, revisamos regularmente nosso conteúdo para garantir que as informações continuem precisas e úteis para quem chegar ao artigo meses ou anos depois.",
    detalhes: [
      "Revisões periódicas de preços e disponibilidade",
      "Atualização do ranking quando novos produtos relevantes entram no mercado",
      "Correção imediata de informações desatualizadas quando identificadas",
      "Data de atualização exibida claramente em cada artigo",
    ],
  },
];

export default function MetodologiaPage() {
  return (
    <div className="bg-nude-200">

      {/* Hero */}
      <div className="bg-brand-800 text-white py-16 mb-12">
        <div className="container max-w-3xl text-center">
          <span className="text-xs font-sans font-bold text-brand-200 uppercase tracking-widest">
            Transparência total
          </span>
          <h1 className="font-serif text-4xl font-bold mt-2 mb-6 leading-tight text-white">
            Como selecionamos os melhores produtos para a sua casa
          </h1>
          <p className="text-lg font-sans text-white/75 leading-relaxed">
            Nossa metodologia foi desenvolvida para garantir que cada recomendação
            seja resultado de pesquisa séria — não de opinião aleatória, conteúdo
            patrocinado ou cópia de outras fontes.
          </p>
        </div>
      </div>

      <div className="container max-w-3xl pb-16">
        <div className="space-y-8">
          {passos.map(({ num, titulo, Icon, descricao, detalhes }) => (
            <section
              key={num}
              className="bg-white rounded-2xl p-6 md:p-8 border border-nude-400 shadow-sm"
            >
              <div className="flex items-start gap-5">
                {/* Ícone + número */}
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-xl bg-brand-100 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-brand-600" />
                  </div>
                  <span className="text-xs font-sans font-bold text-brand-400">{num}</span>
                </div>

                {/* Conteúdo */}
                <div className="flex-1">
                  <h2 className="font-serif text-xl font-bold text-cafe-800 mb-3">
                    {titulo}
                  </h2>
                  <p className="font-sans text-cafe-600 leading-relaxed mb-4">{descricao}</p>
                  <ul className="space-y-2">
                    {detalhes.map((detalhe, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm font-sans text-cafe-700">
                        <CheckCircle className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                        {detalhe}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Aviso editorial */}
        <div className="mt-10 bg-brand-50 border border-brand-200 rounded-2xl p-6 text-center">
          <h2 className="font-serif text-xl font-bold text-brand-800 mb-3">
            Independência editorial com transparência financeira
          </h2>
          <p className="font-sans text-brand-700 text-sm leading-relaxed mb-5">
            O Achadinhos da Elis é sustentado por programas de afiliados. Isso significa que
            quando você compra por um dos nossos links, recebemos uma comissão. Mas nossa
            metodologia existe justamente para garantir que essa relação financeira nunca
            comprometa a qualidade ou a honestidade das nossas recomendações.
          </p>
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-500 text-white font-sans font-semibold rounded-lg hover:bg-brand-600 transition-colors"
          >
            Ver nossas análises
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
