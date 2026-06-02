import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Search, Star, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre – Quem é a Elis e o que é o Achadinhos",
  description:
    "Conheça a história por trás do Achadinhos da Elis: uma curadoria honesta e apaixonada de produtos para tornar sua casa mais bonita e funcional.",
};

const valores = [
  {
    Icon: Search,
    titulo: "Pesquisa aprofundada",
    descricao:
      "Cada produto analisado aqui passou por horas de pesquisa em especificações técnicas, avaliações de consumidores e consulta a especialistas. Não publicamos sem nos sentir seguras da recomendação.",
  },
  {
    Icon: Shield,
    titulo: "Independência editorial",
    descricao:
      "Nenhuma marca paga para ser recomendada aqui. Nossas escolhas são guiadas exclusivamente pelo que realmente funciona para quem vai usar em casa.",
  },
  {
    Icon: Heart,
    titulo: "Paixão pelo lar",
    descricao:
      "A casa é onde a vida acontece. Acreditamos que o ambiente onde você vive impacta diretamente como você se sente, e queremos ajudar você a criar um espaço que realmente te represente.",
  },
  {
    Icon: Star,
    titulo: "Honestidade acima de tudo",
    descricao:
      "Se um produto tem limitações, falamos. Se outro não vale o preço, dizemos. A confiança da nossa leitora é mais importante do que qualquer comissão de afiliado.",
  },
];

export default function SobrePage() {
  return (
    <div className="bg-nude-200 py-12">

      {/* Hero */}
      <div className="bg-brand-800 text-white py-16 mb-12">
        <div className="container max-w-3xl text-center">
          <span className="text-xs font-sans font-bold text-brand-200 uppercase tracking-widest">
            Nossa história
          </span>
          <h1 className="font-serif text-4xl font-bold mt-2 mb-6 leading-tight text-white">
            Achadinhos da Elis: curadoria com carinho para o seu lar
          </h1>
          <p className="text-lg font-sans text-white/75 leading-relaxed">
            Nascemos da frustração de quem já perdeu tempo e dinheiro comprando
            produtos que não entregavam o que prometiam. Aqui, fazemos o trabalho
            pesado de pesquisa para que você chegue na loja — física ou virtual —
            sabendo exatamente o que quer.
          </p>
        </div>
      </div>

      <div className="container max-w-3xl">

        {/* Missão */}
        <section className="mb-10 bg-white rounded-2xl p-8 border border-nude-400 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-cafe-800 mb-4">
            Nossa missão
          </h2>
          <p className="font-sans text-cafe-700 leading-relaxed mb-4">
            A missão do Achadinhos da Elis é simples:{" "}
            <strong className="text-cafe-800">
              ajudar você a tomar decisões de compra mais inteligentes para a sua casa
            </strong>
            . Num mercado onde existem centenas de opções para cada produto —
            tapetes, cortinas, luminárias, organizadores, sofás — é fácil se perder
            entre promessas de fabricantes e reviews patrocinados que não dizem a verdade.
          </p>
          <p className="font-sans text-cafe-700 leading-relaxed mb-4">
            Nós fazemos o trabalho pesado: pesquisamos, comparamos, avaliamos prós e
            contras e selecionamos os melhores produtos de cada categoria. Tudo para
            que você gaste menos tempo pesquisando e mais tempo aproveitando a sua casa.
          </p>
          <p className="font-sans text-cafe-700 leading-relaxed">
            Cada artigo publicado aqui segue um processo editorial rigoroso: investigamos
            o mercado, mergulhamos nas especificações técnicas, lemos avaliações reais de
            consumidores e criamos conteúdo original que vai muito além do que você encontra
            na primeira página do Google.
          </p>
        </section>

        {/* Valores */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-cafe-800 mb-6">
            O que nos guia
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {valores.map(({ Icon, titulo, descricao }) => (
              <div
                key={titulo}
                className="p-6 bg-white border border-nude-400 rounded-2xl hover:border-brand-300 hover:bg-brand-50 transition-colors"
              >
                <div className="h-11 w-11 rounded-xl bg-brand-100 flex items-center justify-center mb-3">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="font-sans font-semibold text-cafe-800 mb-2">{titulo}</h3>
                <p className="text-sm font-sans text-cafe-500 leading-relaxed">{descricao}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Afiliados */}
        <section className="mb-10 bg-brand-50 border border-brand-200 rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold text-brand-800 mb-3">
            Sobre os links de afiliado
          </h2>
          <p className="font-sans text-brand-700 text-sm leading-relaxed mb-3">
            O Achadinhos da Elis participa de programas de afiliados da Shopee,
            Mercado Livre e Amazon. Quando você compra por um dos nossos links,
            recebemos uma comissão — sem nenhum custo adicional para você.
          </p>
          <p className="font-sans text-brand-700 text-sm leading-relaxed">
            Essa receita é o que nos permite manter o site funcionando e continuar
            produzindo conteúdo de qualidade. Mas nossa promessa é clara:{" "}
            <strong>a comissão nunca influencia nossas recomendações</strong>.
            Se um produto não for bom, não recomendamos, simples assim.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/metodologia"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-500 text-white font-sans font-semibold rounded-lg hover:bg-brand-600 transition-colors"
          >
            Conheça nossa metodologia
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
