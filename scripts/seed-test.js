// Script para criar post de teste (sem apagar dados existentes)
// Executar: node scripts/seed-test.js
"use strict";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Criando post de teste...");

  // Produto 1 — Cortina Solar Blackout (Mercado Livre)
  const produto1 = await prisma.product.upsert({
    where: { slug: "cortina-solar-blackout-blackout-varanda-ml" },
    update: {},
    create: {
      slug: "cortina-solar-blackout-blackout-varanda-ml",
      nome: "Cortina Solar Blackout para Varanda",
      descricaoCurta:
        "Cortina com tecido blackout e proteção solar, ideal para varandas com incidência forte de luz. Bloqueia até 99% da luminosidade e reduz o calor.",
      categoria: "varanda",
      imagemUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      marca: "TextilArt",
      precoReferencial: 159.9,
      urlMercadoLivre:
        "https://www.mercadolivre.com.br/p/MLBU3721770783",
      prosDefault:
        "Bloqueio de até 99% da luz\nReduz calor e protege móveis do sol\nFácil instalação\nBom custo-benefício\nDisponível em várias cores",
      contrasDefault:
        "Lavagem apenas à mão\nNão acompanha trilho",
    },
  });

  // Produto 2 — Cortina Oxford (Amazon)
  const produto2 = await prisma.product.upsert({
    where: { slug: "cortina-oxford-varanda-amazon" },
    update: {},
    create: {
      slug: "cortina-oxford-varanda-amazon",
      nome: "Cortina Oxford Blackout para Varanda",
      descricaoCurta:
        "Confeccionada em tecido Oxford de alta resistência, com forro blackout que protege do sol e chuva. Excelente durabilidade para áreas externas.",
      categoria: "varanda",
      imagemUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
      marca: "HomeTex",
      precoReferencial: 189.9,
      urlAmazon: "https://www.amazon.com.br/dp/B0GSZW3ZR6",
      prosDefault:
        "Tecido Oxford muito resistente\nForro blackout duplo\nResiste a chuva leve\nBom acabamento\nGarante privacidade total",
      contrasDefault:
        "Preço um pouco acima da média\nOpções de cor limitadas",
    },
  });

  const conteudoJson = JSON.stringify({
    introducao: {
      paragrafo1:
        "Se você tem uma varanda, já sabe que o sol intenso pode transformar o espaço em uma estufa — especialmente no verão. A cortina certa não só protege do calor e da luminosidade como também garante privacidade e dá um toque estético ao ambiente.",
      paragrafo2:
        "Testamos e comparamos as principais opções disponíveis no mercado brasileiro, levando em conta materiais, proteção solar, durabilidade, facilidade de instalação e custo-benefício. O resultado? Um ranking honesto para você escolher sem arrependimento.",
      paragrafo3:
        "Spoiler: tanto a opção do Mercado Livre quanto a da Amazon entregam muito pela faixa de preço — mas cada uma tem seu perfil de comprador. Continue lendo para descobrir qual combina mais com a sua varanda.",
    },
    criterios: [
      {
        titulo: "Proteção Solar (UV)",
        descricao:
          "Avaliamos o percentual de bloqueio da luz solar e a proteção contra raios UV, fundamental para preservar móveis e garantir conforto térmico.",
      },
      {
        titulo: "Material e Durabilidade",
        descricao:
          "Analisamos a qualidade do tecido, resistência ao desbotamento e capacidade de aguentar a exposição constante ao sol sem perder forma.",
      },
      {
        titulo: "Facilidade de Instalação",
        descricao:
          "Verificamos se a cortina acompanha acessórios, a facilidade de fixação e se é possível instalar sem ajuda profissional.",
      },
      {
        titulo: "Custo-Benefício",
        descricao:
          "Comparamos preço com entrega, qualidade percebida e durabilidade estimada para saber qual oferece mais pelo dinheiro investido.",
      },
    ],
    secoes_complementares: [
      {
        titulo_h2: "Como escolher a cortina certa para a sua varanda?",
        conteudo: [
          "O primeiro passo é medir o espaço corretamente. Cortinas muito curtas ficam estranhas visualmente e não cumprem a função de proteção. O ideal é que a cortina tenha ao menos 10 cm a mais que a altura do vão, e largura suficiente para cobrir bem mesmo quando fechada.",
          "Depois, pense no nível de proteção que você precisa. Varandas com incidência direta do sol da tarde precisam de tecidos mais densos, como o blackout. Já varandas mais sombreadas podem se beneficiar de tecidos mais leves, que filtram a luz sem escurecer completamente.",
          "Por fim, considere a manutenção. Tecidos que só podem ser lavados à mão dão mais trabalho — especialmente em varandas, onde a sujeira e o pó acumulam com mais facilidade. Verifique sempre as instruções antes de comprar.",
        ],
      },
      {
        titulo_h2: "Cortina blackout vale a pena para varanda?",
        conteudo: [
          "Sim, especialmente se a varanda recebe sol direto em algum período do dia. O tecido blackout bloqueia a entrada de luz, reduz significativamente a temperatura do ambiente e ainda garante privacidade total — algo que as cortinas tradicionais não entregam.",
          "A desvantagem é que, quando totalmente fechadas, elas escurecem muito o espaço. Por isso, muitas pessoas optam por modelos com camada dupla: um lado blackout (para proteção total quando necessário) e outro semitransparente (para dias mais amenos, quando você quer claridade sem sol direto).",
        ],
      },
    ],
    faq: [
      {
        pergunta: "Qual é a melhor cortina para varanda com sol da tarde?",
        resposta:
          "Para sol da tarde, o ideal é uma cortina blackout com tecido de alta densidade — como a Cortina Solar Blackout do Mercado Livre, que bloqueia até 99% da luminosidade. O sol da tarde costuma ser mais intenso e quente, então um tecido mais leve não vai resolver o problema.",
      },
      {
        pergunta: "Cortina de varanda aguenta chuva?",
        resposta:
          "Depende do material. Cortinas de tecido Oxford (como a opção da Amazon) têm boa resistência à umidade e aguentam respingos de chuva. Já as cortinas comuns de poliéster não foram feitas para contato direto com água — podem encolher ou perder a forma. Prefira tecidos impermeabilizados para varandas abertas.",
      },
      {
        pergunta: "Como instalar cortina de varanda sem fazer furos?",
        resposta:
          "Existem trilhos com sistema de pressão que se fixam entre paredes sem a necessidade de parafusos — ideais para quem mora em apartamento e não pode fazer furos. Outra opção são os varões com abraçadeiras adesivas de alta resistência. Confirme o peso da cortina antes de escolher o método de fixação.",
      },
      {
        pergunta: "Qual a diferença entre cortina solar e cortina blackout?",
        resposta:
          "A cortina solar filtra a luz sem escurecer completamente o ambiente — ideal para manter a claridade enquanto reduz o calor e os raios UV. Já a cortina blackout bloqueia praticamente toda a luz, garantindo escuridão total. Para varanda, a escolha depende do quanto de sol você quer bloquear e do efeito visual desejado.",
      },
    ],
    conclusao: {
      paragrafo1:
        "As duas opções analisadas cumprem bem o que prometem: a Cortina Solar Blackout do Mercado Livre brilha no custo-benefício e na praticidade para varandas com sol intenso. Já a Cortina Oxford da Amazon leva vantagem na durabilidade do tecido e na resistência à chuva.",
      paragrafo2:
        "Se você está buscando o melhor custo-benefício e prioriza o bloqueio solar, vá de Mercado Livre. Se sua varanda é mais exposta e você precisa de um tecido mais resistente que aguente umidade, a opção da Amazon vale o investimento a mais.",
      paragrafo3:
        "Independente da escolha, instalar uma boa cortina na varanda transforma completamente o espaço — mais conforto, mais privacidade e muito mais estilo.",
    },
    bloco_editorial: {
      titulo: "Nossa recomendação",
      texto:
        "Para a maioria das varandas brasileiras, a Cortina Solar Blackout do Mercado Livre é a escolha mais inteligente: entrega proteção real do sol, instalação simples e preço acessível. Se você tem uma varanda mais exposta ou precisa de maior durabilidade, a Cortina Oxford da Amazon é o upgrade certo.",
    },
  });

  // Criar (ou atualizar) o post de teste
  const post = await prisma.post.upsert({
    where: { slug: "cortina-varanda-contra-sol-melhor-opcao" },
    update: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
    create: {
      slug: "cortina-varanda-contra-sol-melhor-opcao",
      titulo: "Melhor Cortina de Varanda Contra Sol: Comparamos as Top 2 do Mercado",
      resumo:
        "Testamos as cortinas mais vendidas para varanda com sol forte. Blackout do Mercado Livre vs Oxford da Amazon: veja qual oferece mais proteção, durabilidade e custo-benefício para a sua casa.",
      conteudoJson,
      tipo: "REVIEW",
      categoria: "varanda",
      palavraPrimaria: "melhor cortina de varanda contra sol",
      metaTitle: "Melhor Cortina de Varanda Contra Sol 2024 – Achadinhos da Elis",
      metaDescription:
        "Testamos as cortinas blackout mais vendidas para varanda. Descubra qual protege mais do sol, aguenta mais tempo e vale cada centavo. Review completo.",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  // Vincular produtos ao post
  await prisma.postProduct.deleteMany({ where: { postId: post.id } });
  await prisma.postProduct.createMany({
    data: [
      {
        postId: post.id,
        productId: produto1.id,
        posicao: 1,
        rotuloDestaque: "Melhor custo-benefício",
        resumoCurto:
          "A opção mais acessível com bloqueio de 99% da luz. Ideal para varandas com sol direto e forte.",
        pros: "Bloqueia 99% da luz\nReduz calor e UV\nFácil de instalar\nBom preço",
        contras: "Lavagem à mão\nSem trilho incluído",
        indicadoPara:
          "Quem busca proteção solar máxima com ótimo custo-benefício.",
      },
      {
        postId: post.id,
        productId: produto2.id,
        posicao: 2,
        rotuloDestaque: "Mais durável",
        resumoCurto:
          "Tecido Oxford resistente à chuva e ao sol. Excelente para varandas mais expostas.",
        pros: "Tecido Oxford robusto\nResiste à chuva leve\nBlackout duplo\nBom acabamento",
        contras: "Preço mais alto\nPoucas opções de cor",
        indicadoPara:
          "Quem precisa de maior durabilidade e tem varanda mais exposta às intempéries.",
      },
    ],
  });

  console.log(`✅ Post criado: /reviews/${post.slug}`);
  console.log(`✅ Produto 1: ${produto1.nome}`);
  console.log(`✅ Produto 2: ${produto2.nome}`);
  console.log("\n🎉 Pronto! Acesse /reviews/cortina-varanda-contra-sol-melhor-opcao para ver o post.");
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
