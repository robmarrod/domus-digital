import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpar dados existentes
  await prisma.postProduct.deleteMany();
  await prisma.post.deleteMany();
  await prisma.product.deleteMany();
  await prisma.affiliateSettings.deleteMany();

  // Configurações de afiliado
  await prisma.affiliateSettings.create({
    data: {
      amazonTag: "achadinhosdaelis-20",
      shopeeParam: "af_id=achadinhos",
      mercadoLivreParam: "?matt_tool=achadinhos",
    },
  });

  // Produtos de casa & decoração
  const cortinaSolar = await prisma.product.create({
    data: {
      slug: "cortina-corta-luz-sunset-blackout-wave",
      nome: "Cortina Corta-Luz Sunset Blackout Wave",
      descricaoCurta:
        "Cortina blackout de dupla camada com proteção UV avançada, ideal para varandas expostas ao sol intenso.",
      categoria: "Varanda",
      imagemUrl:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
      marca: "TextilArt",
      precoReferencial: 189.9,
      urlShopee:
        "https://shopee.com.br/Cortina-Corta-Luz-Blackout-i.12345.67890",
      urlMercadoLivre:
        "https://produto.mercadolivre.com.br/MLB-cortina-blackout-varanda",
      urlAmazon: "https://amazon.com.br/dp/B0CORTINA01",
      prosDefault:
        "Bloqueio de 99% da luz solar\nMaterial resistente ao desbotamento UV\nFácil instalação com trilho incluso\nDisponível em 12 cores\nBoa relação qualidade-preço",
      contrasDefault:
        "Lavagem apenas à mão\nPeso um pouco acima da média\nPrazo de entrega pode ser longo",
    },
  });

  const cortinaLinho = await prisma.product.create({
    data: {
      slug: "cortina-linho-premium-natural-varanda",
      nome: "Cortina de Linho Premium Natural",
      descricaoCurta:
        "Cortina em linho natural com trama reforçada, combina elegância e resistência para ambientes externos.",
      categoria: "Varanda",
      imagemUrl:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
      marca: "LinhoMais",
      precoReferencial: 249.9,
      urlShopee:
        "https://shopee.com.br/Cortina-Linho-Natural-Premium-i.98765.43210",
      urlMercadoLivre:
        "https://produto.mercadolivre.com.br/MLB-cortina-linho-varanda",
      prosDefault:
        "Material natural premium\nAparência sofisticada\nTranspira bem em dias quentes\nFácil de lavar (máquina fria)\nDurabilidade comprovada",
      contrasDefault:
        "Proteção UV moderada (não blackout)\nPreço mais elevado\nAmassa com facilidade",
    },
  });

  const cortinaPoliester = await prisma.product.create({
    data: {
      slug: "cortina-poliester-alta-durabilidade-varanda",
      nome: "Cortina Poliéster Alta Durabilidade Sun Shield",
      descricaoCurta:
        "Confeccionada em poliéster texturizado de alta densidade, com tratamento antimofo e resistência a lavagens frequentes.",
      categoria: "Varanda",
      imagemUrl:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
      marca: "SunShield Casa",
      precoReferencial: 129.9,
      urlShopee:
        "https://shopee.com.br/Cortina-Poliester-Sun-Shield-i.55555.11111",
      urlMercadoLivre:
        "https://produto.mercadolivre.com.br/MLB-cortina-poliester-varanda",
      urlAmazon: "https://amazon.com.br/dp/B0POLIESTER1",
      prosDefault:
        "Melhor custo-benefício da categoria\nResistente a fungos e bolor\nLavável na máquina até 60°C\nSecagem rápida\nAmplamente disponível em lojas",
      contrasDefault:
        "Aparência menos sofisticada\nBloqueio de luz parcial (filtro solar, não blackout)\nTende a acumular eletricidade estática",
    },
  });

  // Produtos adicionais para outras categorias
  await prisma.product.create({
    data: {
      slug: "tapete-sala-geometrico-antiderrapante",
      nome: "Tapete Geométrico Sala Antiderrapante 200x140cm",
      descricaoCurta:
        "Tapete de sala com estampa geométrica moderna, base antiderrapante emborrachada e fibras resistentes.",
      categoria: "Sala",
      imagemUrl:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
      marca: "TapisBrasil",
      precoReferencial: 319.9,
      urlShopee: "https://shopee.com.br/Tapete-Geometrico-Sala-i.11111.22222",
      urlMercadoLivre:
        "https://produto.mercadolivre.com.br/MLB-tapete-geometrico-sala",
      prosDefault:
        "Estampa moderna e versátil\nAntiderrapante de série\nFácil limpeza\nBoa densidade de fibras",
      contrasDefault:
        "Não indicado para área úmida\nCores podem variar da foto",
    },
  });

  await prisma.product.create({
    data: {
      slug: "luminaria-pendente-industrial-cozinha",
      nome: "Luminária Pendente Industrial Cobre 30cm",
      descricaoCurta:
        "Luminária estilo industrial em metal com acabamento cobre envelhecido, ideal para bancadas de cozinha e home office.",
      categoria: "Cozinha",
      imagemUrl:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600",
      marca: "IluminaDecor",
      precoReferencial: 159.9,
      urlShopee:
        "https://shopee.com.br/Luminaria-Pendente-Industrial-i.33333.44444",
      urlAmazon: "https://amazon.com.br/dp/B0LUMINARIA1",
      prosDefault:
        "Visual sofisticado\nFácil instalação\nCompatível com LED E27\nRobusta e durável",
      contrasDefault:
        "Cabo de 1m (pode ser curto para pés-direitos altos)\nNão inclui lâmpada",
    },
  });

  // Post de review principal
  const conteudoJson = JSON.stringify({
    introducao: {
      paragrafo1:
        "Se você já ficou sentada na varanda às três da tarde tentando escapar do calor, mas o sol não deixou você em paz mesmo com a cortina fechada, você sabe exatamente o que estamos falando. A cortina de varanda mais durável contra sol é um dos itens mais pesquisados por quem quer transformar esse espaço num refúgio de verdade — e não é à toa. O mercado está cheio de opções que prometem proteger do calor e durar anos, mas que desbotam na primeira estação quente.",
      paragrafo2:
        "Pesquisamos mais de 20 modelos, avaliamos materiais, testamos resistência UV, consultamos especialistas em têxteis e lemos centenas de avaliações reais de consumidores. Neste guia completo você vai descobrir qual cortina de varanda realmente resiste ao sol brasileiro sem perder cor, sem rachar e sem cair aos pedaços depois de um ano.",
      paragrafo3:
        "Selecionamos os três melhores modelos do mercado, com perfis diferentes: a opção premium para quem quer o máximo em proteção e estética, nossa escolha principal que equilibra qualidade e preço, e a alternativa econômica que surpreende pelo custo-benefício. Independentemente do seu orçamento, você vai sair daqui sabendo exatamente qual cortina comprar.",
    },
    criterios: [
      {
        titulo: "Resistência UV",
        descricao:
          "Avaliamos a capacidade do tecido de bloquear raios UV sem desbotar. Materiais com tratamento UV permanente ganham pontos extras, pois costumam durar muito mais que os com tratamento superficial.",
      },
      {
        titulo: "Durabilidade do material",
        descricao:
          "Tecidos como poliéster de alta densidade, linho reforçado e blends sintéticos respondem de forma muito diferente à exposição contínua ao sol e à umidade. Testamos tração, desbotamento e resistência ao mofo.",
      },
      {
        titulo: "Eficiência de bloqueio de luz",
        descricao:
          "Classificamos em três níveis: blackout (99%+), semi-blackout (70-98%) e filtro solar (30-70%). Cada nível atende um perfil de uso diferente — informamos para quem cada opção faz mais sentido.",
      },
      {
        titulo: "Facilidade de instalação e manutenção",
        descricao:
          "Uma cortina que exige ferramentas especializadas ou lavagem exclusivamente a seco perde pontos. Valorizamos soluções práticas, fáceis de colocar e de manter ao longo dos anos.",
      },
      {
        titulo: "Custo-benefício",
        descricao:
          "Analisamos o preço em relação à durabilidade esperada, calculando o custo por ano de uso. Uma cortina mais cara que dura 5 anos pode ser mais econômica que uma barata trocada todo ano.",
      },
    ],
    secoes_complementares: [
      {
        titulo_h2: "Como escolher a cortina de varanda ideal para o seu caso",
        conteudo: [
          "Antes de comprar qualquer cortina de varanda, o primeiro passo é entender a orientação solar do seu ambiente. Varandas voltadas para o oeste recebem o sol mais agressivo da tarde — aquele que esquenta mais, desbota mais e é mais difícil de filtrar. Para essas situações, apenas modelos com proteção UV de nível avançado (acima de UPF 50) vão durar mais de dois anos com aparência satisfatória.",
          "Varandas voltadas para o norte ou leste têm sol mais ameno e permitem o uso de materiais naturais, como linho e algodão tratado, sem tanto sacrifício de durabilidade. Nesses casos, o fator estético pode pesar mais na sua escolha sem comprometer a vida útil do produto.",
          "Outro ponto essencial é a exposição à umidade. Varandas abertas ou semiabertas acumulam umidade mesmo sem chuva direta — neblina, condensação e orvalho são suficientes para criar condições de mofo em tecidos sem tratamento adequado. Prefira sempre materiais com acabamento antimofo ou naturalmente resistentes, como poliéster de alta densidade.",
        ],
      },
      {
        titulo_h2: "Qual tecido dura mais no sol? Comparação completa",
        conteudo: [
          "O poliéster de alta densidade é campeão absoluto em durabilidade quando exposto ao sol constante. Sua estrutura molecular sintética não absorve raios UV da mesma forma que fibras naturais, e os tratamentos de proteção solar aderem melhor ao material. É por isso que a maioria das toldos e cortinas de área externa profissionais são feitos desse material.",
          "O linho natural, apesar de não ter a mesma resistência UV intrínseca do poliéster, ganha pontos pela trama mais aberta, que permite circulação de ar e cria uma aparência muito mais sofisticada. Com tratamento UV profissional aplicado em fábrica (não o caseiro em spray), dura bem mais do que o esperado — especialmente em varandas com exposição parcial ao sol.",
          "Tecidos de algodão puro devem ser evitados em varandas com sol direto. Eles desbotam rapidamente, absorvem umidade com facilidade e criam ambiente propício para fungos. Se você aprecia o aspecto visual do algodão, procure blends com pelo menos 60% de poliéster ou fibras acrílicas.",
        ],
      },
      {
        titulo_h2: "Instalação: trilho, varão ou blackout sob medida?",
        conteudo: [
          "A forma de instalação influencia muito na durabilidade da cortina e na facilidade do dia a dia. O sistema de trilho deslizante é o mais prático: a cortina corre suavemente, não acumula dobras desnecessárias e pode ser trocada sem obra. É a solução preferida para varandas amplas e para quem precisa abrir e fechar com frequência.",
          "O varão simples é mais econômico e funciona bem para varandas menores ou quando a cortina fica permanentemente fechada. O ponto de atenção é que o contato contínuo com o varão pode desgastar o tecido na dobra superior ao longo do tempo — prefira varões com anéis ou presilhas que distribuam o peso uniformemente.",
          "Para varandas com exposição extrema, considere cortinas blackout sob medida com instalação direta na laje ou na estrutura da varanda. Esse sistema é mais robusto, mas exige mão de obra especializada e um investimento maior. No longo prazo, porém, tende a compensar pela durabilidade superior e pela vedação mais eficiente.",
        ],
      },
    ],
    faq: [
      {
        pergunta: "Cortina de linho aguenta o sol de varanda?",
        resposta:
          "Depende muito do nível de exposição. Linho com tratamento UV de fábrica aguenta bem em varandas com sol parcial (até 4 horas diretas por dia). Para varandas com sol intenso o dia todo, especialmente voltadas para o oeste, o poliéster de alta densidade é mais indicado. Se você ama o visual do linho, opte por um modelo premium com acabamento UV permanente e fique atenta à manutenção.",
      },
      {
        pergunta: "Qual a diferença entre cortina blackout e filtro solar?",
        resposta:
          "A cortina blackout bloqueia 99% ou mais da luz — é ideal para quem quer escurecer completamente o ambiente, como quartos e espaços de home theater. A cortina de filtro solar bloqueia parcialmente a luz (entre 30% e 80%), reduzindo o calor e o brilho sem escurecer totalmente o espaço. Para varandas de convivência, o filtro solar costuma ser mais agradável, pois mantém luminosidade com conforto térmico.",
      },
      {
        pergunta: "De quanto em quanto tempo preciso trocar a cortina de varanda?",
        resposta:
          "Com manutenção adequada e material de qualidade, uma cortina de varanda deve durar entre 3 e 7 anos. Modelos premium de poliéster tratado chegam a 8-10 anos em condições normais. O desbotamento é o primeiro sinal de que está na hora de trocar — além de visual, indica que o tecido perdeu proteção UV. Lavagens regulares (a cada 3 meses) prolongam muito a vida útil.",
      },
      {
        pergunta: "Posso lavar cortina de varanda na máquina?",
        resposta:
          "A maioria dos modelos de poliéster pode ser lavada em máquina em ciclo delicado, com água fria a morna. Modelos de linho geralmente precisam de lavagem à mão ou ciclo específico para tecidos delicados. Sempre consulte a etiqueta do fabricante — lavagens inadequadas podem danificar o tratamento UV e reduzir significativamente a vida útil do produto.",
      },
      {
        pergunta: "Cortina de varanda ajuda a reduzir a conta de energia?",
        resposta:
          "Sim! Cortinas de filtro solar bem instaladas podem reduzir a entrada de calor solar em até 70%, diminuindo a necessidade do ar-condicionado. Em residências com exposição solar intensa, o impacto na conta de energia pode ser perceptível já no primeiro verão. É um investimento que se paga ao longo do tempo, especialmente em apartamentos com varandas voltadas para o sol poente.",
      },
    ],
    conclusao: {
      paragrafo1:
        "Encontrar a cortina de varanda mais durável contra sol não precisa ser um processo complicado quando você sabe o que avaliar. Ao longo deste guia, vimos que os fatores que realmente fazem diferença são o tipo de material, o nível de proteção UV, a forma de instalação e a adequação ao perfil da sua varanda.",
      paragrafo2:
        "Nossa escolha principal, a Cortina Corta-Luz Sunset Blackout Wave, se destacou pela proteção UV excepcional e pela durabilidade comprovada. Para quem busca sofisticação com boa resistência, a Cortina de Linho Premium Natural é uma excelente opção. E quem precisa de custo-benefício sem abrir mão da qualidade vai se surpreender com a Sun Shield Poliéster.",
      paragrafo3:
        "Independentemente do modelo que você escolher, lembre-se: a manutenção regular é o que vai garantir que sua cortina dure anos, não meses. Com as informações deste guia, você está mais do que preparada para fazer uma compra consciente e transformar sua varanda no refúgio que ela merece ser.",
    },
    bloco_editorial: {
      titulo: "Sobre a curadoria Achadinhos da Elis",
      texto:
        "Cada produto avaliado aqui passou por um processo criterioso de pesquisa: consultamos dados técnicos dos fabricantes, lemos avaliações reais de consumidores em múltiplas plataformas e consideramos feedback de especialistas em decoração e têxteis. Nosso compromisso é com a sua decisão de compra — não com marcas ou fabricantes. Os links de afiliado presentes nesta página ajudam a manter o site funcionando, mas nunca influenciam nossas recomendações.",
    },
  });

  const reviewPost = await prisma.post.create({
    data: {
      slug: "qual-a-cortina-de-varanda-mais-duravel-contra-sol",
      titulo:
        "Qual a Cortina de Varanda Mais Durável Contra Sol? (Testamos 20 Modelos)",
      resumo:
        "Pesquisamos e testamos mais de 20 modelos para descobrir qual cortina de varanda realmente resiste ao sol brasileiro sem desbotar. Confira nosso ranking completo com prós, contras e dicas de instalação.",
      conteudoJson,
      tipo: "REVIEW",
      categoria: "Varanda",
      palavraPrimaria: "cortina de varanda mais durável contra sol",
      metaTitle:
        "Cortina de Varanda Mais Durável Contra Sol – Achadinhos da Elis",
      metaDescription:
        "cortina de varanda mais durável contra sol: testamos 20 modelos e selecionamos os 3 melhores de 2024. Veja agora qual realmente resiste ao sol brasileiro!",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  // Relacionar produtos ao post
  await prisma.postProduct.create({
    data: {
      postId: reviewPost.id,
      productId: cortinaSolar.id,
      posicao: 1,
      rotuloDestaque: "MAIOR DESEMPENHO",
      resumoCurto:
        "A Sunset Blackout Wave é a opção mais completa: blackout de verdade, proteção UV de nível profissional e trilho incluso. Ideal para quem não quer abrir mão de nada.",
      pros: "Blackout 99% eficiente\nTratamento UV permanente (não desbota)\nTrilho deslizante incluso\nGarantia de 2 anos do fabricante",
      contras:
        "Preço acima da média\nLavagem apenas à mão\nEntrega pode levar 2 semanas",
      indicadoPara:
        "Quem tem varanda com sol intenso o dia todo e quer a solução mais durável e eficiente do mercado, sem comprometer a estética.",
    },
  });

  await prisma.postProduct.create({
    data: {
      postId: reviewPost.id,
      productId: cortinaLinho.id,
      posicao: 2,
      rotuloDestaque: "NOSSA ESCOLHA",
      resumoCurto:
        "O linho premium entrega beleza e resistência em equilíbrio perfeito. Recomendamos para varandas com exposição solar moderada e para quem valoriza estética sofisticada.",
      pros: "Visual natural e elegante\nBoa circulação de ar\nTratamento UV de fábrica\nLavável na máquina (ciclo delicado)",
      contras:
        "Não é blackout\nMais cara que a média\nAmassa com facilidade em dias úmidos",
      indicadoPara:
        "Quem quer uma varanda bonita, bem ventilada, com sol parcial e está disposto a investir um pouco mais em estética.",
    },
  });

  await prisma.postProduct.create({
    data: {
      postId: reviewPost.id,
      productId: cortinaPoliester.id,
      posicao: 3,
      rotuloDestaque: "CUSTO-BENEFÍCIO",
      resumoCurto:
        "A Sun Shield Poliéster é a prova de que não precisa gastar muito para ter qualidade. Resistente, prática e com tratamento antimofo, é perfeita para quem busca durabilidade com economia.",
      pros: "Melhor preço da nossa seleção\nAntimofo de série\nLavável na máquina até 60°C\nAmplamente disponível",
      contras:
        "Não é blackout (filtro solar parcial)\nAparência menos sofisticada\nAcumula eletricidade estática",
      indicadoPara:
        "Quem precisa de uma cortina durável e resistente ao sol, mas tem orçamento mais limitado ou quer uma solução prática sem complicação.",
    },
  });

  console.log("✅ Seed concluído com sucesso!");
  console.log(`   - ${await prisma.product.count()} produtos criados`);
  console.log(`   - ${await prisma.post.count()} posts criados`);
  console.log(
    `   - ${await prisma.postProduct.count()} relações post-produto criadas`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
