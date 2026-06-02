export interface ConteudoJsonIntroducao {
  paragrafo1: string;
  paragrafo2: string;
  paragrafo3?: string;
}

export interface ConteudoCriterio {
  titulo: string;
  descricao: string;
}

export interface ConteudoSecao {
  titulo_h2: string;
  conteudo: string[];
}

export interface ConteudoFaq {
  pergunta: string;
  resposta: string;
}

export interface ConteudoConclusao {
  paragrafo1: string;
  paragrafo2: string;
  paragrafo3?: string;
}

export interface ConteudoBlocoEditorial {
  titulo: string;
  texto: string;
}

export interface ConteudoJson {
  introducao?: ConteudoJsonIntroducao;
  criterios?: ConteudoCriterio[];
  secoes_complementares?: ConteudoSecao[];
  faq?: ConteudoFaq[];
  conclusao?: ConteudoConclusao;
  bloco_editorial?: ConteudoBlocoEditorial;
}

export interface PostWithProducts {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  conteudoJson: string;
  tipo: string;
  categoria: string;
  palavraPrimaria: string;
  metaTitle: string;
  metaDescription: string;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  postProducts: PostProductWithProduct[];
}

export interface PostProductWithProduct {
  id: string;
  postId: string;
  productId: string;
  posicao: number;
  rotuloDestaque: string | null;
  resumoCurto: string | null;
  pros: string | null;
  contras: string | null;
  indicadoPara: string | null;
  product: ProductData;
}

export interface ProductData {
  id: string;
  slug: string;
  nome: string;
  descricaoCurta: string;
  categoria: string;
  imagemUrl: string | null;
  marca: string | null;
  precoReferencial: number | null;
  idShopee: string | null;
  idMercadoLivre: string | null;
  idAmazon: string | null;
  urlShopee: string | null;
  urlMercadoLivre: string | null;
  urlAmazon: string | null;
  prosDefault: string | null;
  contrasDefault: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const CATEGORIAS = [
  "Smart Home",
  "Iluminação",
  "Segurança",
  "Áudio e Vídeo",
  "Climatização",
  "Eletrodomésticos",
  "Roteadores e Redes",
  "Acessórios",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export const ROTULOS_DESTAQUE = [
  "MAIOR DESEMPENHO",
  "NOSSA ESCOLHA",
  "CUSTO-BENEFÍCIO",
  "MAIS POPULAR",
  "MELHOR PARA INICIANTES",
] as const;
