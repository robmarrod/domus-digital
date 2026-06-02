export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  ArrowRight,
  Search, BookOpen, Award, RefreshCw, Layers,
  Sofa, Bed, ChefHat, Shirt, Leaf, Package,
  ShieldCheck, BarChart3, Target,
  ChevronRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

// ─── Dados estáticos ────────────────────────────────────────────────────────

const categorias = [
  { slug: "sala",        label: "Sala",        desc: "Sofás, racks, mesas de centro e iluminação.",              Icon: Sofa    },
  { slug: "quarto",      label: "Quarto",      desc: "Colchões, roupas de cama e organização.",                  Icon: Bed     },
  { slug: "cozinha",     label: "Cozinha",     desc: "Eletroportáteis, panelas e utensílios que duram.",         Icon: ChefHat },
  { slug: "lavanderia",  label: "Lavanderia",  desc: "Varais, cestos, organizadores e produtos de limpeza.",     Icon: Shirt   },
  { slug: "varanda",     label: "Varanda",     desc: "Cortinas, cadeiras, plantas e decoração externa.",         Icon: Leaf    },
  { slug: "organizacao", label: "Organização", desc: "Caixas, prateleiras, cabides e tudo para reduzir a bagunça.", Icon: Package },
];

const porQueConfiar = [
  {
    Icon: Search,
    titulo: "Uso real, não só ficha técnica",
    texto: "Nada de copiar descrição de loja. Testamos produtos na rotina de casa, cruzamos com avaliações reais e só então entram nos achadinhos.",
  },
  {
    Icon: BarChart3,
    titulo: "Comparativos lado a lado",
    texto: "Colocamos produtos da mesma faixa para competir entre si. Você vê prós, contras e para quem é cada modelo antes de clicar no botão de compra.",
  },
  {
    Icon: Target,
    titulo: "Critérios claros e notas honestas",
    texto: "Conforto, durabilidade, material, facilidade de limpar, custo por uso. Cada review segue a mesma régua para você comparar sem confusão.",
  },
  {
    Icon: ShieldCheck,
    titulo: "Independência total",
    texto: "Participamos de programas de afiliados de Amazon, Shopee e Mercado Livre, mas nenhuma marca paga para aparecer aqui. Se for ruim, a gente fala.",
  },
];

const metodologiaSteps = [
  { num: "01", titulo: "Investigação", Icon: Search,    desc: "Começamos pelas dúvidas reais de quem está montando ou melhorando a casa." },
  { num: "02", titulo: "Imersão",      Icon: BookOpen,  desc: "Comparamos ficha técnica, marcas, avaliações de clientes e histórico de qualidade." },
  { num: "03", titulo: "Testes",       Icon: Layers,    desc: "Sempre que possível, testamos no dia a dia: montar, usar, limpar, guardar." },
  { num: "04", titulo: "Comparação",   Icon: Award,     desc: "Colocamos os finalistas na mesma mesa: pontuação por critérios e ranking claro." },
  { num: "05", titulo: "Atualização",  Icon: RefreshCw, desc: "Se o preço muda ou aparece algo melhor, o ranking é revisado. Review aqui não fica abandonado." },
];

const eParaVoce = [
  "Quer montar ou atualizar a casa gastando bem, não só barato.",
  "Gosta de entender o porquê de cada recomendação, não só ver um link de compra.",
  "Odeia perder tempo pulando de vídeo em vídeo e review em review.",
  "Topa pagar um pouco mais quando o produto realmente entrega mais.",
];

const naoEParaVoce = [
  "Só quer o produto mais barato, independente da qualidade.",
  "Prefere anúncios de marcas a reviews independentes.",
  "Não se importa com material, conforto ou durabilidade.",
  "Quer uma resposta mágica sem olhar 3 minutos de análise.",
];

// ─── Dados do banco ──────────────────────────────────────────────────────────

async function getPosts() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 10,
    select: {
      id: true, slug: true, titulo: true, resumo: true,
      categoria: true, tipo: true, publishedAt: true, imagemUrl: true,
    },
  });
}

// ─── Página ──────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;
  const rankings = posts.filter((p) => p.tipo === "REVIEW").slice(0, 5);
  const ultimos  = rest.slice(0, 3);

  return (
    <>

      {/* ══════════════════════════════════════════════════════
          SEÇÃO 1 — HERO
      ══════════════════════════════════════════════════════ */}
      <section className="bg-nude-200 py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Coluna texto */}
            <div>
              <span className="inline-block text-xs font-sans font-bold text-brand-600 uppercase tracking-widest mb-5">
                Blog de reviews para casa &amp; decoração
              </span>

              <h1 className="font-serif font-bold text-cafe-800 leading-[1.15] mb-5">
                Achadinhos testados e explicados: os melhores produtos para sua casa em 2026.
              </h1>

              <p className="text-base md:text-lg font-sans text-cafe-600 leading-relaxed mb-8 max-w-lg">
                Comparativos detalhados, reviews honestos e links com desconto em Amazon,
                Shopee e Mercado Livre para você não errar na compra.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link
                  href="/reviews"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-sans font-semibold text-white text-base bg-brand-500 hover:bg-brand-600 transition-colors active:scale-[0.98]"
                >
                  Ver reviews por cômodo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/reviews"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-sans font-semibold text-base border-2 border-brand-500 text-brand-600 hover:bg-brand-100 transition-colors"
                >
                  Explorar achadinhos de hoje
                </Link>
              </div>

              <p className="text-xs font-sans text-cafe-500">
                Curadoria da Elis, baseada em testes reais, centenas de reviews de
                clientes e pesquisa de preço diária.
              </p>

              {/* Imagem WhatsApp — visível só no mobile, logo abaixo dos botões */}
              <a
                href="https://chat.whatsapp.com/DmZDfPASkJdCZo67uke9gv"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-8 lg:hidden max-w-xs mx-auto hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/grupo-whatsapp.png"
                  alt="Entrar para o grupo VIP de achadinhos no WhatsApp"
                  className="w-full rounded-2xl shadow-brand-md"
                />
              </a>
            </div>

            {/* Coluna direita — imagem WhatsApp clicável (desktop) */}
            <div className="hidden lg:flex items-center justify-center">
              <a
                href="https://chat.whatsapp.com/DmZDfPASkJdCZo67uke9gv"
                target="_blank"
                rel="noopener noreferrer"
                className="block max-w-sm w-full hover:opacity-90 transition-opacity hover:-translate-y-1 duration-300 active:scale-[0.98]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/grupo-whatsapp.png"
                  alt="Entrar para o grupo VIP de achadinhos no WhatsApp"
                  className="w-full rounded-2xl shadow-brand-lg"
                />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SEÇÃO 2 — CATEGORIAS
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="container">
          <div className="text-center mb-9">
            <span className="text-xs font-sans font-bold text-brand-600 uppercase tracking-widest">
              Explore por tema
            </span>
            <h2 className="font-serif font-bold text-cafe-800 mt-2">
              Navegue pelos melhores achadinhos.
            </h2>
            <p className="text-sm font-sans text-cafe-500 mt-2 max-w-md mx-auto">
              Escolha por cômodo e veja só o que realmente vale a pena comprar.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {categorias.map(({ slug, label, Icon }) => (
              <Link
                key={slug}
                href={`/categoria/${slug}`}
                className="group relative overflow-hidden rounded-2xl border border-nude-400 shadow-sm hover:-translate-y-1 hover:shadow-brand-md transition-all duration-300"
                style={{ aspectRatio: "3/4" }}
              >
                {/* Foto de fundo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/categorias/${slug}.jpg`}
                  alt={label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Fallback quando sem foto */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center -z-10">
                  <Icon className="h-10 w-10 text-brand-400 opacity-40" />
                </div>

                {/* Sombra para legibilidade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

                {/* Texto */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <div className="text-sm font-sans font-bold text-white leading-tight drop-shadow-sm">
                    {label}
                  </div>
                  <span className="text-[11px] font-sans font-medium text-white/75 group-hover:text-white transition-colors mt-0.5 block">
                    Ver reviews →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SEÇÃO 3 — POR QUE CONFIAR
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-brand-100">
        <div className="container">
          <div className="text-center mb-11">
            <span className="text-xs font-sans font-bold text-brand-600 uppercase tracking-widest">
              Nossa promessa
            </span>
            <h2 className="font-serif font-bold text-cafe-800 mt-2">
              Por que você pode confiar nos achadinhos da Elis.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {porQueConfiar.map(({ Icon, titulo, texto }) => (
              <div
                key={titulo}
                className="bg-white rounded-2xl p-6 border border-brand-200 shadow-sm"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 mb-4">
                  <Icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="font-serif font-semibold text-cafe-800 mb-2 text-base leading-snug">
                  {titulo}
                </h3>
                <p className="text-sm font-sans text-cafe-500 leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SEÇÃO 4 — RANKINGS + ÚLTIMOS REVIEWS
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <span className="text-xs font-sans font-bold text-brand-600 uppercase tracking-widest">
              Conteúdo recente
            </span>
            <h2 className="font-serif font-bold text-cafe-800 mt-2">
              Confira as últimas análises e guias.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Coluna esquerda — Rankings */}
            <div>
              <h3 className="font-serif font-semibold text-cafe-700 text-lg mb-5 pb-3 border-b border-nude-400">
                Rankings mais buscados
              </h3>

              {rankings.length > 0 ? (
                <ul className="space-y-4">
                  {rankings.map((p, i) => (
                    <li key={p.id}>
                      <Link href={`/reviews/${p.slug}`} className="flex items-start gap-4 group">
                        <span className="text-2xl font-serif font-bold text-brand-200 shrink-0 leading-none mt-0.5 w-9">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <span className="text-sm font-sans font-medium text-cafe-800 group-hover:text-brand-600 transition-colors leading-snug block">
                            {p.titulo}
                          </span>
                          <span className="text-xs font-sans font-semibold text-brand-500 group-hover:underline mt-0.5 block">
                            Ver ranking completo
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm font-sans text-cafe-400">Rankings chegando em breve.</p>
              )}
            </div>

            {/* Coluna direita — Últimos reviews */}
            <div>
              <h3 className="font-serif font-semibold text-cafe-700 text-lg mb-5 pb-3 border-b border-nude-400">
                Últimos reviews
              </h3>

              {ultimos.length > 0 ? (
                <div className="space-y-5">
                  {ultimos.map((p) => (
                    <Link key={p.id} href={`/reviews/${p.slug}`} className="group flex gap-4 items-start">
                      <div className="shrink-0 h-16 w-16 rounded-xl overflow-hidden border border-nude-400 bg-nude-100">
                        {p.imagemUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.imagemUrl}
                            alt={p.titulo}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-brand-100 flex items-center justify-center">
                            <span className="text-[9px] font-sans text-brand-400 text-center uppercase leading-tight px-1">
                              {p.categoria}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-nude-200 text-brand-600 mb-1">
                          {p.categoria}
                        </span>
                        <h4 className="text-sm font-sans font-semibold text-cafe-800 group-hover:text-brand-600 transition-colors leading-snug line-clamp-2">
                          {p.titulo}
                        </h4>
                        <span className="text-xs font-sans text-cafe-400 group-hover:text-brand-600 mt-0.5 block">
                          Ler review
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-sans text-cafe-400">Reviews chegando em breve.</p>
              )}

              <div className="mt-6">
                <Link
                  href="/reviews"
                  className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-brand-600 hover:text-brand-700"
                >
                  Ver todos os reviews <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SEÇÃO 5 — METODOLOGIA (teaser)
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-nude-300">
        <div className="container">
          <div className="text-center mb-11">
            <span className="text-xs font-sans font-bold text-brand-600 uppercase tracking-widest">
              Transparência total
            </span>
            <h2 className="font-serif font-bold text-cafe-800 mt-2">
              Como escolhemos o que entra nos achadinhos.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {metodologiaSteps.map(({ num, titulo, Icon, desc }) => (
              <div
                key={num}
                className="bg-white rounded-2xl p-5 text-center border border-nude-400 shadow-sm"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 mb-3">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <div className="text-xs font-sans font-bold text-brand-500 mb-1">{num}</div>
                <h3 className="font-serif font-semibold text-cafe-800 text-sm mb-2">{titulo}</h3>
                <p className="text-[11px] font-sans text-cafe-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/metodologia"
              className="text-sm font-sans font-semibold text-brand-600 hover:text-brand-700 hover:underline"
            >
              Ver metodologia completa →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SEÇÃO 6 — É PRA VOCÊ SE
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <span className="text-xs font-sans font-bold text-brand-600 uppercase tracking-widest">
              Feito para você?
            </span>
            <h2 className="font-serif font-bold text-cafe-800 mt-2">
              Pra quem o Achadinhos da Elis foi pensado.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

            {/* É pra você */}
            <div className="rounded-2xl p-7 border-2 border-brand-200 bg-brand-50">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-7 w-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  ✓
                </div>
                <h3 className="font-serif font-semibold text-brand-700 text-base">
                  É pra você se:
                </h3>
              </div>
              <ul className="space-y-3">
                {eParaVoce.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <ChevronRight className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-sans text-cafe-700 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Não é pra você */}
            <div className="rounded-2xl p-7 border border-nude-400 bg-nude-100">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-7 w-7 rounded-full bg-cafe-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  ×
                </div>
                <h3 className="font-serif font-semibold text-cafe-600 text-base">
                  Não é pra você se:
                </h3>
              </div>
              <ul className="space-y-3">
                {naoEParaVoce.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <ChevronRight className="h-4 w-4 text-cafe-400 shrink-0 mt-0.5" />
                    <span className="text-sm font-sans text-cafe-500 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SEÇÃO 7 — GRUPO WHATSAPP
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-brand-500">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <span className="text-xs font-sans font-bold text-brand-100 uppercase tracking-widest mb-4 block">
              Grupo secreto de promoções
            </span>
            <h2 className="font-serif font-bold text-white mb-3">
              Receba só os achadinhos que valem a pena, sem spam.
            </h2>
            <p className="text-sm font-sans text-white/80 mb-8">
              Receba diversas promoções e cupons em um grupo exclusivo do WhatsApp.
            </p>

            <a
              href="https://chat.whatsapp.com/DmZDfPASkJdCZo67uke9gv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-brand-700 font-sans font-bold text-base hover:bg-brand-50 active:scale-[0.98] transition-all shadow-md"
            >
              Entrar para o grupo de achadinhos
            </a>

            <p className="text-xs font-sans text-white/60 mt-5">
              Não fazemos spam. Divulgamos as melhores ofertas em um grupo privado,
              respeitando sua privacidade conforme a LGPD.
            </p>
          </div>
        </div>
      </section>

    </>
  );
}
