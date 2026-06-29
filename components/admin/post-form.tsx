"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, Save, Globe, Clock, Archive,
  Link as LinkIcon, X, ChevronDown, ChevronUp, Calendar,
  Image as ImageIcon, RefreshCw, Camera, FileText, Sparkles, Upload, ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIAS, ROTULOS_DESTAQUE } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { LinksPanel, LinkEntry } from "./links-panel";
import { GeracaoLotePanel, ProdutoImportado } from "./geracao-lote-panel";

interface ProductOption {
  id: string;
  nome: string;
  categoria: string;
}

interface PostProductEntry {
  productId: string;
  posicao: number;
  rotuloDestaque: string;
  resumoCurto: string;
  pros: string;
  contras: string;
  indicadoPara: string;
  urlShopee: string;
  urlMercadoLivre: string;
  urlAmazon: string;
  imagemUrl: string;
}

interface PostFormProps {
  postId?: string;
  defaultValues?: {
    titulo?: string;
    slug?: string;
    palavraPrimaria?: string;
    categoria?: string;
    tipo?: string;
    metaTitle?: string;
    metaDescription?: string;
    resumo?: string;
    conteudoJson?: string;
    status?: string;
    scheduledAt?: string;
    linksJson?: string;
    imagemUrl?: string;
    urlShopee?: string;
    urlMercadoLivre?: string;
    urlAmazon?: string;
    postProducts?: PostProductEntry[];
  };
  products: ProductOption[];
}

export function PostForm({ postId, defaultValues, products }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!postId;

  // Campos básicos
  const [titulo, setTitulo] = useState(defaultValues?.titulo ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [palavraPrimaria, setPalavraPrimaria] = useState(defaultValues?.palavraPrimaria ?? "");
  const [categoria, setCategoria] = useState(defaultValues?.categoria ?? "");
  const [tipo, setTipo] = useState<"REVIEW" | "GUIA">((defaultValues?.tipo as "REVIEW" | "GUIA") ?? "REVIEW");
  const [metaTitle, setMetaTitle] = useState(defaultValues?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(defaultValues?.metaDescription ?? "");
  const [resumo, setResumo] = useState(defaultValues?.resumo ?? "");
  const [imagemUrl, setImagemUrl] = useState(defaultValues?.imagemUrl ?? "");
  const [imagemUrlError, setImagemUrlError] = useState(false);
  const [uploadandoCapa, setUploadandoCapa] = useState(false);

  async function handleUploadCapa(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadandoCapa(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('tipo', 'posts')
    try {
      const res = await fetch('/api/upload-imagem', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.ok) {
        setImagemUrl(data.url)
        setImagemUrlError(false)
        toast({ title: '✅ Imagem de capa enviada!' })
      } else {
        toast({ title: '❌ Erro ao enviar imagem', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: '❌ Falha no upload', variant: 'destructive' })
    } finally {
      setUploadandoCapa(false)
      e.target.value = ''
    }
  }

  const [urlShopee, setUrlShopee] = useState(defaultValues?.urlShopee ?? "");
  const [urlMercadoLivre, setUrlMercadoLivre] = useState(defaultValues?.urlMercadoLivre ?? "");
  const [urlAmazon, setUrlAmazon] = useState(defaultValues?.urlAmazon ?? "");
  const [conteudoJson, setConteudoJson] = useState(defaultValues?.conteudoJson ?? "{}");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [postProducts, setPostProducts] = useState<PostProductEntry[]>(defaultValues?.postProducts ?? []);
  const [saving, setSaving] = useState(false);

  // Agendamento
  const [agendarPublicacao, setAgendarPublicacao] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(defaultValues?.scheduledAt?.slice(0, 16) ?? "");

  // Backlinks
  const [links, setLinks] = useState<LinkEntry[]>(() => {
    try { return JSON.parse(defaultValues?.linksJson ?? "[]") || []; }
    catch { return []; }
  });

  // Importação de produtos por URL
  const [mostrarImportador, setMostrarImportador] = useState(true);
  const [urlInput, setUrlInput] = useState("");
  const [produtosImportados, setProdutosImportados] = useState<ProdutoImportado[]>([]);

  // Importação por print/texto (IA)
  const [mostrarImportadorIA, setMostrarImportadorIA] = useState(false);
  const [slotsIA, setSlotsIA] = useState<SlotIA[]>(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      modo: "texto" as "imagem" | "texto",
      texto: "",
      imagemBase64: "",
      imagemNome: "",
      mimeType: "image/jpeg",
      status: "idle" as SlotStatus,
      erro: "",
    }))
  );

  function handleTituloChange(val: string) {
    setTitulo(val);
    if (!isEdit) {
      setSlug(slugify(val));
      setMetaTitle(val + " – Achadinhos da Elis");
    }
  }

  function validateJson(value: string): boolean {
    try { JSON.parse(value); setJsonError(null); return true; }
    catch (e) { setJsonError("JSON inválido: " + (e as Error).message); return false; }
  }

  // ---- Importação de produto por URL ----
  async function importarProduto() {
    const url = urlInput.trim();
    if (!url) return;
    if (produtosImportados.some((p) => p.url === url)) {
      toast({ title: "URL já adicionada", variant: "destructive" });
      return;
    }

    const placeholder: ProdutoImportado = { url, nome: "Carregando...", plataforma: "", carregando: true };
    setProdutosImportados((prev) => [...prev, placeholder]);
    setUrlInput("");

    try {
      const res = await fetch("/api/scrape-produto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProdutosImportados((prev) =>
        prev.map((p) => p.url === url ? { ...data, url, carregando: false } : p)
      );
    } catch (e) {
      setProdutosImportados((prev) =>
        prev.map((p) =>
          p.url === url ? { ...p, nome: "Erro ao importar", erro: (e as Error).message, carregando: false } : p
        )
      );
    }
  }

  function removerProduto(url: string) {
    setProdutosImportados((prev) => prev.filter((p) => p.url !== url));
  }

  function trocarImagem(url: string, novaImagem: string) {
    setProdutosImportados((prev) =>
      prev.map((p) => p.url === url ? { ...p, imagemUrl: novaImagem } : p)
    );
  }

  // ---- Importação por IA (print/texto) ----
  function atualizarSlot(id: number, changes: Partial<SlotIA>) {
    setSlotsIA((prev) => prev.map((s) => s.id === id ? { ...s, ...changes } : s));
  }

  async function extrairSlot(slot: SlotIA) {
    if (slot.status === "carregando") return;
    if (slot.modo === "imagem" && !slot.imagemBase64) {
      atualizarSlot(slot.id, { erro: "Selecione uma imagem primeiro.", status: "erro" });
      return;
    }
    if (slot.modo === "texto" && slot.texto.trim().length < 20) {
      atualizarSlot(slot.id, { erro: "Cole o conteúdo da página (mínimo 20 caracteres).", status: "erro" });
      return;
    }

    atualizarSlot(slot.id, { status: "carregando", erro: "" });

    try {
      const body =
        slot.modo === "imagem"
          ? { tipo: "imagem", imagem: slot.imagemBase64, mimeType: slot.mimeType }
          : { tipo: "texto", texto: slot.texto };

      const res = await fetch("/api/scrape-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Gera id único para o produto importado via IA
      const uid = `ia-${Date.now()}-${slot.id}`;
      const novoProduto: ProdutoImportado = {
        ...data,
        url: uid,
        carregando: false,
      };

      setProdutosImportados((prev) => [...prev, novoProduto]);
      atualizarSlot(slot.id, { status: "sucesso" });
      toast({ title: `Produto extraído: ${data.nome?.slice(0, 50)}` });
    } catch (e) {
      atualizarSlot(slot.id, { status: "erro", erro: (e as Error).message });
    }
  }

  // ---- Produtos do ranking (manual) ----
  function addProductEntry() {
    setPostProducts((prev) => [
      ...prev,
      { productId: "", posicao: prev.length + 1, rotuloDestaque: "", resumoCurto: "", pros: "", contras: "", indicadoPara: "", urlShopee: "", urlMercadoLivre: "", urlAmazon: "", imagemUrl: "" },
    ]);
  }

  function removeProductEntry(index: number) {
    setPostProducts((prev) =>
      prev.filter((_, i) => i !== index).map((pp, i) => ({ ...pp, posicao: i + 1 }))
    );
  }

  function updateProductEntry(index: number, field: keyof PostProductEntry, value: string | number) {
    setPostProducts((prev) => prev.map((pp, i) => (i === index ? { ...pp, [field]: value } : pp)));
  }

  // ---- Salvar post manualmente ----
  async function handleSubmit(publishStatus: "DRAFT" | "REVIEW" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED") {
    if (!validateJson(conteudoJson)) return;
    if (!titulo || !slug || !categoria) {
      toast({ title: "Campos obrigatórios", description: "Preencha título, slug e categoria.", variant: "destructive" });
      return;
    }
    if (publishStatus === "SCHEDULED" && !scheduledAt) {
      toast({ title: "Escolha a data e hora de publicação", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        titulo, slug, palavraPrimaria, categoria, tipo,
        metaTitle, metaDescription, resumo, conteudoJson,
        status: publishStatus,
        imagemUrl: imagemUrl.trim() || null,
        urlShopee: urlShopee.trim() || null,
        urlMercadoLivre: urlMercadoLivre.trim() || null,
        urlAmazon: urlAmazon.trim() || null,
        linksJson: links.length > 0 ? JSON.stringify(links) : null,
        postProducts: postProducts.filter((pp) => pp.productId),
      };
      if (publishStatus === "SCHEDULED" && scheduledAt) {
        payload.scheduledAt = new Date(scheduledAt).toISOString();
      }

      const url = isEdit ? `/api/posts/${postId}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao salvar");
      }

      // Atualiza URLs de afiliado em cada produto individualmente
      const produtosComId = postProducts.filter((pp) => pp.productId);
      await Promise.all(
        produtosComId.map((pp) =>
          fetch(`/api/produtos/${pp.productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              urlShopee: pp.urlShopee.trim() || null,
              urlMercadoLivre: pp.urlMercadoLivre.trim() || null,
              urlAmazon: pp.urlAmazon.trim() || null,
              imagemUrl: pp.imagemUrl.trim() || null,
            }),
          })
        )
      );

      const statusLabels: Record<string, string> = {
        PUBLISHED: "Post publicado!", SCHEDULED: "Post agendado!",
        REVIEW: "Enviado para revisão!", ARCHIVED: "Post arquivado!", DRAFT: "Rascunho salvo!",
      };
      toast({ title: statusLabels[publishStatus] ?? "Salvo!" });
      router.push("/admin/posts");
      router.refresh();
    } catch (e) {
      toast({ title: "Erro ao salvar", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* ---- IMPORTADOR DE PRODUTOS ---- */}
      <Card className="border-brand-200 bg-gradient-to-br from-brand-50 to-white">
        <CardHeader>
          <button
            type="button"
            onClick={() => setMostrarImportador(!mostrarImportador)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-brand-500" />
              <CardTitle className="text-base text-brand-700">
                Importar produtos por URL ({produtosImportados.length} produto{produtosImportados.length !== 1 ? "s" : ""})
              </CardTitle>
            </div>
            {mostrarImportador ? <ChevronUp className="h-4 w-4 text-brand-400" /> : <ChevronDown className="h-4 w-4 text-brand-400" />}
          </button>
        </CardHeader>

        {mostrarImportador && (
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Cole URLs do Mercado Livre, Shopee ou Amazon. O sistema extrai título, descrição, preço e imagem automaticamente.
              Você pode importar de <strong>3 a 10 produtos</strong> de plataformas diferentes.
            </p>

            {/* Input de URL */}
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), importarProduto())}
                placeholder="https://www.mercadolivre.com.br/... ou amazon.com.br ou shopee.com.br"
                className="flex-1 text-sm"
              />
              <Button type="button" variant="outline" onClick={importarProduto} className="shrink-0">
                <Plus className="h-4 w-4 mr-1" />
                Importar
              </Button>
            </div>

            {/* Produtos importados */}
            {produtosImportados.map((p, idx) => (
              <ProdutoCard key={p.url} produto={p} index={idx}
                onRemover={() => removerProduto(p.url)}
                onTrocarImagem={(nova) => trocarImagem(p.url, nova)}
              />
            ))}
          </CardContent>
        )}
      </Card>

      {/* ---- IMPORTADOR POR PRINT / TEXTO (IA) ---- */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader>
          <button
            type="button"
            onClick={() => setMostrarImportadorIA(!mostrarImportadorIA)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-base text-purple-700">
                Importar por Print / Texto (IA)
              </CardTitle>
            </div>
            {mostrarImportadorIA ? <ChevronUp className="h-4 w-4 text-purple-400" /> : <ChevronDown className="h-4 w-4 text-purple-400" />}
          </button>
        </CardHeader>

        {mostrarImportadorIA && (
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Tire um print da página do produto (Shopee, ML, Amazon…) ou cole o texto completo da página.
              A IA extrai nome, preço, descrição e especificações automaticamente.
              Até <strong>5 produtos</strong> por vez.
            </p>

            <div className="space-y-3">
              {slotsIA.map((slot) => (
                <SlotImportacaoIA
                  key={slot.id}
                  slot={slot}
                  onUpdate={(changes) => atualizarSlot(slot.id, changes)}
                  onExtrair={() => extrairSlot(slot)}
                />
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* ---- GERAÇÃO EM LOTE ---- */}
      {produtosImportados.some((p) => !p.erro && !p.carregando) && (
        <GeracaoLotePanel
          titulo={titulo}
          palavraPrimaria={palavraPrimaria}
          categoria={categoria}
          tipo={tipo}
          produtos={produtosImportados}
          backlinks={links}
          onPostsCriados={() => router.refresh()}
        />
      )}

      {/* ---- INFO BÁSICA ---- */}
      <Card>
        <CardHeader><CardTitle className="text-base">Informações básicas</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="titulo">Título (H1) *</Label>
              <Input id="titulo" value={titulo} onChange={(e) => handleTituloChange(e.target.value)}
                placeholder="Ex.: Melhores Cortinas de Varanda para Proteger do Sol" />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)}
                placeholder="melhores-cortinas-de-varanda" className="font-mono text-sm" />
            </div>
            <div>
              <Label htmlFor="palavraPrimaria">Palavra primária</Label>
              <Input id="palavraPrimaria" value={palavraPrimaria} onChange={(e) => setPalavraPrimaria(e.target.value)}
                placeholder="cortina de varanda mais durável contra sol" />
            </div>
            <div>
              <Label>Categoria *</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as "REVIEW" | "GUIA")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="REVIEW">Review / Ranking</SelectItem>
                  <SelectItem value="GUIA">Guia Completo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---- SEO ---- */}
      <Card>
        <CardHeader><CardTitle className="text-base">SEO</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Título para mecanismos de busca" />
            <p className="text-xs text-gray-400 mt-1">{metaTitle.length}/60 caracteres</p>
          </div>
          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea id="metaDescription" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Começa com a palavra primária. CTA convidativo." rows={2} />
            <p className="text-xs text-gray-400 mt-1">{metaDescription.length}/160 caracteres</p>
          </div>
          <div>
            <Label htmlFor="resumo">Resumo (cards/home)</Label>
            <Textarea id="resumo" value={resumo} onChange={(e) => setResumo(e.target.value)}
              placeholder="Breve descrição para exibir nos cards..." rows={2} />
          </div>
          <div>
            <Label htmlFor="imagemUrl">Imagem de capa</Label>
            <div className="flex gap-2 items-start mt-1">
              {imagemUrl && !imagemUrlError && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagemUrl}
                  alt="Capa"
                  className="h-16 w-16 object-cover rounded-lg border bg-gray-50 flex-shrink-0"
                  onError={() => setImagemUrlError(true)}
                />
              )}
              <div className="flex-1 space-y-1">
                <div className="flex gap-2">
                  <Input
                    id="imagemUrl"
                    value={imagemUrl}
                    onChange={(e) => { setImagemUrl(e.target.value); setImagemUrlError(false); }}
                    placeholder="https://... ou use o botão para subir"
                  />
                  <label className={`cursor-pointer shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap ${uploadandoCapa ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'}`}>
                    {uploadandoCapa ? '⏳' : '📷'} {uploadandoCapa ? 'Enviando...' : 'Subir imagem'}
                    <input type="file" accept="image/*" className="hidden" disabled={uploadandoCapa} onChange={handleUploadCapa} />
                  </label>
                </div>
                <p className="text-xs text-gray-400">Redimensionada automaticamente para 1200×630 px, formato WebP.</p>
                {imagemUrl && (
                  <button
                    type="button"
                    onClick={() => { setImagemUrl(""); setImagemUrlError(false); }}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Remover imagem
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---- LINKS DE COMPRA (marketplace) ---- */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-green-600" />
            <CardTitle className="text-base text-green-800">Links de compra</CardTitle>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cole os links dos marketplaces. Estes links aparecem como botões de compra no post publicado.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="urlMercadoLivre" className="text-orange-600 font-semibold">🛒 Mercado Livre</Label>
            <Input
              id="urlMercadoLivre"
              value={urlMercadoLivre}
              onChange={(e) => setUrlMercadoLivre(e.target.value)}
              placeholder="https://produto.mercadolivre.com.br/..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="urlShopee" className="text-red-500 font-semibold">🛒 Shopee</Label>
            <Input
              id="urlShopee"
              value={urlShopee}
              onChange={(e) => setUrlShopee(e.target.value)}
              placeholder="https://shopee.com.br/..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="urlAmazon" className="text-yellow-600 font-semibold">🛒 Amazon</Label>
            <Input
              id="urlAmazon"
              value={urlAmazon}
              onChange={(e) => setUrlAmazon(e.target.value)}
              placeholder="https://amazon.com.br/..."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* ---- BACKLINKS ---- */}
      <LinksPanel links={links} onChange={setLinks} />

      {/* ---- CONTEÚDO JSON (manual) ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conteúdo JSON</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 mb-2">
            Gerado automaticamente pela IA (painel acima) ou cole/edite manualmente o JSON do artigo.
          </p>
          <Textarea value={conteudoJson}
            onChange={(e) => { setConteudoJson(e.target.value); validateJson(e.target.value); }}
            className="font-mono text-xs min-h-[250px]"
            placeholder='{"introducao": {...}, "criterios": [...], ...}' />
          {jsonError && <p className="text-xs text-red-500 mt-2 font-mono">{jsonError}</p>}
        </CardContent>
      </Card>

      {/* ---- PRODUTOS DO RANKING (manual) ---- */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Produtos do ranking</CardTitle>
              <p className="text-xs text-gray-400 mt-0.5">Edite os dados e os links de compra de cada produto. Salvo junto com o post.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addProductEntry}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar produto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {postProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Nenhum produto adicionado manualmente.</p>
          ) : postProducts.map((pp, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">Produto #{pp.posicao}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeProductEntry(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Produto</Label>
                  <Select value={pp.productId} onValueChange={(v) => updateProductEntry(index, "productId", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecionar produto..." /></SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (<SelectItem key={p.id} value={p.id}>{p.nome} ({p.categoria})</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rótulo de destaque</Label>
                  <Select
                    value={pp.rotuloDestaque || "__none__"}
                    onValueChange={(v) => updateProductEntry(index, "rotuloDestaque", v === "__none__" ? "" : v)}
                  >
                    <SelectTrigger><SelectValue placeholder="Opcional..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Sem rótulo</SelectItem>
                      {ROTULOS_DESTAQUE.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Resumo curto</Label>
                  <Textarea value={pp.resumoCurto} onChange={(e) => updateProductEntry(index, "resumoCurto", e.target.value)}
                    placeholder="Por que este produto se destaca neste ranking?" rows={2} />
                </div>
                <div>
                  <Label>Prós (uma por linha)</Label>
                  <Textarea value={pp.pros} onChange={(e) => updateProductEntry(index, "pros", e.target.value)}
                    placeholder={"Pró 1\nPró 2"} rows={3} />
                </div>
                <div>
                  <Label>Contras (uma por linha)</Label>
                  <Textarea value={pp.contras} onChange={(e) => updateProductEntry(index, "contras", e.target.value)}
                    placeholder={"Contra 1\nContra 2"} rows={3} />
                </div>
                <div className="md:col-span-2">
                  <Label>Para quem é indicado</Label>
                  <Textarea value={pp.indicadoPara} onChange={(e) => updateProductEntry(index, "indicadoPara", e.target.value)}
                    placeholder="Descreva o perfil do comprador ideal." rows={2} />
                </div>

                {/* Imagem do produto */}
                <div className="md:col-span-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Imagem do produto</span>
                    <span className="text-xs text-gray-400 font-normal">— ideal: quadrado 800×800px, JPEG/PNG</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    {pp.imagemUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={pp.imagemUrl}
                        alt="Produto"
                        className="h-16 w-16 object-cover rounded-lg border bg-gray-50 flex-shrink-0"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                    <div className="flex-1 space-y-1">
                      <Input
                        value={pp.imagemUrl}
                        onChange={(e) => updateProductEntry(index, "imagemUrl", e.target.value)}
                        placeholder="https://... (URL da imagem — quadrado 800×800px)"
                        className="text-xs h-8"
                      />
                      {pp.imagemUrl && (
                        <button
                          type="button"
                          onClick={() => updateProductEntry(index, "imagemUrl", "")}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          Remover imagem
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Links de compra */}
                <div className="md:col-span-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Links de compra (afiliado)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs text-orange-600">Mercado Livre</Label>
                      <Input
                        value={pp.urlMercadoLivre}
                        onChange={(e) => updateProductEntry(index, "urlMercadoLivre", e.target.value)}
                        placeholder="https://mercadolivre.com/..."
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-red-500">Shopee</Label>
                      <Input
                        value={pp.urlShopee}
                        onChange={(e) => updateProductEntry(index, "urlShopee", e.target.value)}
                        placeholder="https://shopee.com.br/..."
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-yellow-600">Amazon</Label>
                      <Input
                        value={pp.urlAmazon}
                        onChange={(e) => updateProductEntry(index, "urlAmazon", e.target.value)}
                        placeholder="https://amazon.com.br/..."
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ---- AGENDAMENTO ---- */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-base">Agendamento</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input type="checkbox" checked={agendarPublicacao} onChange={(e) => setAgendarPublicacao(e.target.checked)} className="accent-brand-500 h-4 w-4" />
            <span className="text-sm text-gray-700">Publicar automaticamente em data/hora específica</span>
          </label>
          {agendarPublicacao && (
            <div>
              <Label>Data e hora de publicação</Label>
              <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)} className="max-w-xs"
                suppressHydrationWarning />
              <p className="text-xs text-gray-400 mt-1">Requer cron job configurado na Hostinger.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ---- BOTÕES (salvar post manual) ---- */}
      <Card className="border-gray-200">
        <CardContent className="pt-4">
          <p className="text-xs text-gray-500 mb-3">
            Use os botões abaixo para salvar <em>este formulário</em> como um único post. Para gerar ranking + individuais automaticamente, use o painel "Gerar posts com IA" acima.
          </p>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button variant="outline" onClick={() => handleSubmit("DRAFT")} disabled={saving || !!jsonError} className="text-gray-600">
              <Save className="h-4 w-4 mr-2" /> Salvar rascunho
            </Button>
            <Button variant="outline" onClick={() => handleSubmit("ARCHIVED")} disabled={saving || !!jsonError} className="text-gray-500 border-gray-300 hover:bg-gray-100">
              <Archive className="h-4 w-4 mr-2" /> Arquivar
            </Button>
            <Button variant="outline" onClick={() => handleSubmit("REVIEW")} disabled={saving || !!jsonError} className="text-amber-600 border-amber-300 hover:bg-amber-50">
              <Clock className="h-4 w-4 mr-2" /> Enviar para revisão
            </Button>
            {agendarPublicacao ? (
              <Button variant="brand" onClick={() => handleSubmit("SCHEDULED")} disabled={saving || !!jsonError || !scheduledAt}>
                <Calendar className="h-4 w-4 mr-2" /> Agendar
              </Button>
            ) : (
              <Button variant="brand" onClick={() => handleSubmit("PUBLISHED")} disabled={saving || !!jsonError}>
                <Globe className="h-4 w-4 mr-2" /> Publicar agora
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Tipos para o importador IA ----
type SlotStatus = "idle" | "carregando" | "sucesso" | "erro";

interface SlotIA {
  id: number;
  modo: "imagem" | "texto";
  texto: string;
  imagemBase64: string;
  imagemNome: string;
  mimeType: string;
  status: SlotStatus;
  erro: string;
}

// ---- Componente de slot de importação por IA ----
function SlotImportacaoIA({
  slot,
  onUpdate,
  onExtrair,
}: {
  slot: SlotIA;
  onUpdate: (changes: Partial<SlotIA>) => void;
  onExtrair: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        onUpdate({ erro: "Selecione apenas imagens (JPG, PNG, WebP).", status: "erro" });
        return;
      }

      // Redimensiona a imagem para no máximo 1568px em qualquer dimensão
      // (limite recomendado pela Anthropic; max absoluto é 8000px)
      const MAX_PX = 1568;

      const bitmap = await createImageBitmap(file);
      const { width, height } = bitmap;
      const scale = Math.min(1, MAX_PX / Math.max(width, height));
      const outW = Math.round(width * scale);
      const outH = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bitmap, 0, 0, outW, outH);
      bitmap.close();

      // Exporta como JPEG (qualidade 0.88) — reduz tamanho sem perda visível
      const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
      const base64 = dataUrl.split(",")[1];

      onUpdate({
        imagemBase64: base64,
        imagemNome: file.name,
        mimeType: "image/jpeg",
        status: "idle",
        erro: "",
      });
    },
    [onUpdate]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const statusColors: Record<SlotStatus, string> = {
    idle: "border-gray-200 bg-white",
    carregando: "border-purple-200 bg-purple-50 animate-pulse",
    sucesso: "border-green-200 bg-green-50",
    erro: "border-red-200 bg-red-50",
  };

  return (
    <div className={`border rounded-xl p-3 transition-colors ${statusColors[slot.status]}`}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-gray-500">Produto {slot.id}</span>

        {/* Toggle modo */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onUpdate({ modo: "imagem", status: "idle", erro: "" })}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              slot.modo === "imagem"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Camera className="h-3 w-3" /> Print
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ modo: "texto", status: "idle", erro: "" })}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              slot.modo === "texto"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText className="h-3 w-3" /> Texto
          </button>
        </div>
      </div>

      {/* Área de input */}
      {slot.modo === "imagem" ? (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {slot.imagemBase64 ? (
            <div className="flex items-center gap-2 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:${slot.mimeType};base64,${slot.imagemBase64}`}
                alt="Preview"
                className="h-16 w-16 object-cover rounded-lg border bg-white"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700 font-medium truncate">{slot.imagemNome}</p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-xs text-purple-600 hover:underline mt-0.5"
                >
                  Trocar imagem
                </button>
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
              onClick={() => fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="h-5 w-5 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">
                Arraste ou <span className="text-purple-600 font-medium">clique para selecionar</span>
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">JPG, PNG, WebP — máx 5 MB</p>
            </div>
          )}
        </div>
      ) : (
        <textarea
          value={slot.texto}
          onChange={(e) => onUpdate({ texto: e.target.value, status: "idle", erro: "" })}
          placeholder="Cole aqui o texto completo da página do produto (nome, descrição, especificações, preço...)"
          className="w-full text-xs text-gray-700 border border-gray-200 rounded-lg p-2.5 min-h-[80px] resize-y focus:outline-none focus:ring-1 focus:ring-purple-400"
          rows={4}
        />
      )}

      {/* Erro */}
      {slot.status === "erro" && slot.erro && (
        <p className="text-xs text-red-600 mt-1.5">{slot.erro}</p>
      )}

      {/* Sucesso */}
      {slot.status === "sucesso" && (
        <p className="text-xs text-green-700 font-medium mt-1.5">✓ Produto adicionado à lista abaixo</p>
      )}

      {/* Botão extrair */}
      <div className="mt-2.5 flex justify-end">
        <button
          type="button"
          onClick={onExtrair}
          disabled={slot.status === "carregando"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {slot.status === "carregando" ? "Extraindo..." : "Extrair com IA"}
        </button>
      </div>
    </div>
  );
}

// ---- Componente de card de produto importado ----
function ProdutoCard({
  produto, index, onRemover, onTrocarImagem,
}: {
  produto: ProdutoImportado;
  index: number;
  onRemover: () => void;
  onTrocarImagem: (url: string) => void;
}) {
  const [editandoImagem, setEditandoImagem] = useState(false);
  const [novaImagem, setNovaImagem] = useState(produto.imagemUrl ?? "");
  const [expandido, setExpandido] = useState(false);

  return (
    <div className={`border rounded-xl p-3 space-y-2 ${produto.erro ? "border-red-200 bg-red-50" : produto.carregando ? "border-gray-200 bg-gray-50 animate-pulse" : "border-green-200 bg-white"}`}>
      <div className="flex items-start gap-3">
        {/* Imagem com opção de troca */}
        <div className="relative shrink-0">
          {produto.imagemUrl && !produto.carregando ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={produto.imagemUrl} alt="" className="h-16 w-16 object-contain rounded-lg border bg-white" />
          ) : (
            <div className="h-16 w-16 rounded-lg border bg-gray-100 flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-300" />
            </div>
          )}
          {!produto.carregando && !produto.erro && (
            <button
              onClick={() => setEditandoImagem(!editandoImagem)}
              className="absolute -bottom-1 -right-1 bg-white border rounded-full p-0.5 shadow-sm hover:bg-gray-50"
              title="Trocar imagem"
            >
              <RefreshCw className="h-3 w-3 text-gray-500" />
            </button>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                #{index + 1} · {produto.plataforma}
              </span>
              <p className="text-sm font-medium text-gray-800 mt-1 leading-snug">
                {produto.carregando ? "Importando..." : produto.nome}
              </p>
              {produto.preco && <p className="text-xs text-green-700 font-semibold">{produto.preco}</p>}
              {produto.erro && <p className="text-xs text-red-600 mt-0.5">{produto.erro}</p>}
            </div>
            <button onClick={onRemover} className="text-gray-400 hover:text-red-500 shrink-0 mt-0.5">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Descrição expandível */}
          {produto.descricaoCompleta && !produto.carregando && (
            <div className="mt-1.5">
              <button
                onClick={() => setExpandido(!expandido)}
                className="text-xs text-gray-500 hover:text-brand-600 flex items-center gap-1"
              >
                {expandido ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {expandido ? "Ocultar descrição" : "Ver descrição extraída"}
              </button>
              {expandido && (
                <p className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded-lg max-h-32 overflow-y-auto leading-relaxed">
                  {produto.descricaoCompleta.slice(0, 800)}
                  {produto.descricaoCompleta.length > 800 && "..."}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Troca de imagem */}
      {editandoImagem && (
        <div className="flex gap-2 pt-1">
          <Input
            value={novaImagem}
            onChange={(e) => setNovaImagem(e.target.value)}
            placeholder="Nova URL da imagem..."
            className="text-xs h-8 flex-1"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => { onTrocarImagem(novaImagem); setEditandoImagem(false); }}
          >
            Salvar
          </Button>
          <Button type="button" size="sm" variant="ghost" className="h-8 text-xs"
            onClick={() => setEditandoImagem(false)}>
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}
