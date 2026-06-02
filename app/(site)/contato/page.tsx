import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Instagram, MessageCircle, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contato – Achadinhos da Elis",
  description:
    "Entre em contato com a Elis. Dúvidas, sugestões de produtos, parcerias ou qualquer assunto — respondemos com carinho.",
};

export default function ContatoPage() {
  return (
    <div className="bg-nude-200 py-12">
      <div className="container max-w-3xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-cafe-500 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Início
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-cafe-800 font-medium">Contato</span>
        </nav>

        <header className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-cafe-800 mb-4">
            Entre em Contato
          </h1>
          <p className="font-sans text-cafe-600 text-lg leading-relaxed">
            Olá! Sou a Elis e adoro ouvir de você. Seja para sugestão de produto,
            dúvida sobre uma recomendação, proposta de parceria ou só para bater
            um papo sobre casa e decoração — estou aqui.
          </p>
        </header>

        {/* Canais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <a
            href="mailto:contato@achadinhosdaelis.com.br"
            className="group flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-nude-400 bg-white hover:border-brand-300 hover:bg-brand-50 transition-all"
          >
            <div className="h-12 w-12 rounded-xl bg-brand-100 flex items-center justify-center group-hover:bg-brand-200 transition-colors">
              <Mail className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <p className="font-sans font-semibold text-cafe-800 mb-1">E-mail</p>
              <p className="text-xs font-sans text-cafe-500 break-all">
                contato@achadinhosdaelis.com.br
              </p>
            </div>
          </a>

          <a
            href="https://www.instagram.com/achadinhosdaelis"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-nude-400 bg-white hover:border-brand-300 hover:bg-brand-50 transition-all"
          >
            <div className="h-12 w-12 rounded-xl bg-brand-100 flex items-center justify-center group-hover:bg-brand-200 transition-colors">
              <Instagram className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <p className="font-sans font-semibold text-cafe-800 mb-1">Instagram</p>
              <p className="text-xs font-sans text-cafe-500">@achadinhosdaelis</p>
            </div>
          </a>

          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-nude-400 bg-white hover:border-brand-300 hover:bg-brand-50 transition-all"
          >
            <div className="h-12 w-12 rounded-xl bg-brand-100 flex items-center justify-center group-hover:bg-brand-200 transition-colors">
              <MessageCircle className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <p className="font-sans font-semibold text-cafe-800 mb-1">WhatsApp</p>
              <p className="text-xs font-sans text-cafe-500">Clique para enviar mensagem</p>
            </div>
          </a>
        </div>

        {/* Formulário */}
        <section className="bg-white border border-nude-400 rounded-2xl p-8 mb-10 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-cafe-800 mb-6">
            Mande uma mensagem
          </h2>
          <form
            action="https://formsubmit.co/contato@achadinhosdaelis.com.br"
            method="POST"
            className="space-y-5"
          >
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_subject" value="Contato pelo site – Achadinhos da Elis" />
            <input type="hidden" name="_next" value="https://achadinhosdaelis.com.br/contato?enviado=1" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="nome" className="block text-sm font-sans font-medium text-cafe-700 mb-1.5">
                  Seu nome
                </label>
                <input
                  id="nome" name="nome" type="text" required placeholder="Maria Silva"
                  className="w-full rounded-lg border border-nude-400 bg-nude-100 px-4 py-2.5 text-sm font-sans text-cafe-800 placeholder:text-cafe-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-sans font-medium text-cafe-700 mb-1.5">
                  E-mail
                </label>
                <input
                  id="email" name="email" type="email" required placeholder="maria@email.com"
                  className="w-full rounded-lg border border-nude-400 bg-nude-100 px-4 py-2.5 text-sm font-sans text-cafe-800 placeholder:text-cafe-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="assunto" className="block text-sm font-sans font-medium text-cafe-700 mb-1.5">
                Assunto
              </label>
              <select
                id="assunto" name="assunto"
                className="w-full rounded-lg border border-nude-400 bg-nude-100 px-4 py-2.5 text-sm font-sans text-cafe-800 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition"
              >
                <option value="sugestao">Sugestão de produto</option>
                <option value="parceria">Proposta de parceria</option>
                <option value="duvida">Dúvida sobre recomendação</option>
                <option value="imprensa">Imprensa</option>
                <option value="outro">Outro assunto</option>
              </select>
            </div>

            <div>
              <label htmlFor="mensagem" className="block text-sm font-sans font-medium text-cafe-700 mb-1.5">
                Mensagem
              </label>
              <textarea
                id="mensagem" name="mensagem" rows={5} required
                placeholder="Escreva sua mensagem aqui..."
                className="w-full rounded-lg border border-nude-400 bg-nude-100 px-4 py-2.5 text-sm font-sans text-cafe-800 placeholder:text-cafe-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-brand-500 text-white font-sans font-semibold text-sm hover:bg-brand-600 active:scale-[0.98] transition-all"
            >
              Enviar mensagem
            </button>
          </form>
        </section>

        {/* Parcerias */}
        <section className="border-l-4 border-brand-300 pl-6">
          <h2 className="font-serif text-lg font-bold text-cafe-800 mb-2">
            Parcerias e assessoria de imprensa
          </h2>
          <p className="text-sm font-sans text-cafe-600 leading-relaxed">
            Trabalho com marcas de casa &amp; decoração que compartilham meu
            compromisso com qualidade e honestidade. Se tiver interesse em
            colaboração, envie um e-mail para{" "}
            <a
              href="mailto:parcerias@achadinhosdaelis.com.br"
              className="text-brand-600 font-medium hover:underline"
            >
              parcerias@achadinhosdaelis.com.br
            </a>{" "}
            com o assunto "Parceria" e apresente sua marca.
          </p>
        </section>

      </div>
    </div>
  );
}
