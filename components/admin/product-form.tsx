"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIAS } from "@/lib/types";
import { slugify } from "@/lib/utils";

interface ProductFormProps {
  productId?: string;
  defaultValues?: {
    nome?: string;
    slug?: string;
    categoria?: string;
    marca?: string;
    descricaoCurta?: string;
    imagemUrl?: string;
    precoReferencial?: number | null;
    idShopee?: string;
    idMercadoLivre?: string;
    idAmazon?: string;
    urlShopee?: string;
    urlMercadoLivre?: string;
    urlAmazon?: string;
    prosDefault?: string;
    contrasDefault?: string;
  };
}

export function ProductForm({ productId, defaultValues }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!productId;

  const [nome, setNome] = useState(defaultValues?.nome ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [categoria, setCategoria] = useState(defaultValues?.categoria ?? "");
  const [marca, setMarca] = useState(defaultValues?.marca ?? "");
  const [descricaoCurta, setDescricaoCurta] = useState(
    defaultValues?.descricaoCurta ?? ""
  );
  const [imagemUrl, setImagemUrl] = useState(defaultValues?.imagemUrl ?? "");
  const [precoReferencial, setPrecoReferencial] = useState(
    defaultValues?.precoReferencial?.toString() ?? ""
  );
  const [idShopee, setIdShopee] = useState(defaultValues?.idShopee ?? "");
  const [idMercadoLivre, setIdMercadoLivre] = useState(
    defaultValues?.idMercadoLivre ?? ""
  );
  const [idAmazon, setIdAmazon] = useState(defaultValues?.idAmazon ?? "");
  const [urlShopee, setUrlShopee] = useState(defaultValues?.urlShopee ?? "");
  const [urlMercadoLivre, setUrlMercadoLivre] = useState(
    defaultValues?.urlMercadoLivre ?? ""
  );
  const [urlAmazon, setUrlAmazon] = useState(defaultValues?.urlAmazon ?? "");
  const [prosDefault, setProsDefault] = useState(
    defaultValues?.prosDefault ?? ""
  );
  const [contrasDefault, setContrasDefault] = useState(
    defaultValues?.contrasDefault ?? ""
  );
  const [saving, setSaving] = useState(false);

  function handleNomeChange(val: string) {
    setNome(val);
    if (!isEdit) setSlug(slugify(val));
  }

  async function handleSubmit() {
    if (!nome || !slug || !categoria || !descricaoCurta) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, slug, categoria e descrição curta.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        nome,
        slug,
        categoria,
        marca,
        descricaoCurta,
        imagemUrl: imagemUrl || null,
        precoReferencial: precoReferencial ? parseFloat(precoReferencial) : null,
        idShopee: idShopee || null,
        idMercadoLivre: idMercadoLivre || null,
        idAmazon: idAmazon || null,
        urlShopee: urlShopee || null,
        urlMercadoLivre: urlMercadoLivre || null,
        urlAmazon: urlAmazon || null,
        prosDefault: prosDefault || null,
        contrasDefault: contrasDefault || null,
      };

      const url = isEdit ? `/api/produtos/${productId}` : "/api/produtos";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao salvar");
      }
      toast({ title: "Produto salvo!", variant: "success" as any });
      router.push("/admin/produtos");
      router.refresh();
    } catch (e) {
      toast({
        title: "Erro ao salvar",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome do produto *</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => handleNomeChange(e.target.value)}
                placeholder="Ex.: Cortina Blackout Wave 2.0m"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="cortina-blackout-wave"
                className="font-mono text-sm"
              />
            </div>
            <div>
              <Label>Categoria *</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                placeholder="Ex.: TextilArt"
              />
            </div>
            <div>
              <Label htmlFor="preco">Preço referencial (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={precoReferencial}
                onChange={(e) => setPrecoReferencial(e.target.value)}
                placeholder="189.90"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="descricao">Descrição curta *</Label>
              <Textarea
                id="descricao"
                value={descricaoCurta}
                onChange={(e) => setDescricaoCurta(e.target.value)}
                placeholder="Breve descrição do produto destacando seu principal diferencial..."
                rows={2}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="imagemUrl">URL da imagem</Label>
              <Input
                id="imagemUrl"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Links de afiliado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="idShopee">ID Shopee</Label>
              <Input
                id="idShopee"
                value={idShopee}
                onChange={(e) => setIdShopee(e.target.value)}
                placeholder="12345.67890"
              />
            </div>
            <div>
              <Label htmlFor="urlShopee">URL Shopee</Label>
              <Input
                id="urlShopee"
                value={urlShopee}
                onChange={(e) => setUrlShopee(e.target.value)}
                placeholder="https://shopee.com.br/..."
              />
            </div>
            <div>
              <Label htmlFor="idML">ID Mercado Livre</Label>
              <Input
                id="idML"
                value={idMercadoLivre}
                onChange={(e) => setIdMercadoLivre(e.target.value)}
                placeholder="MLB-1234567"
              />
            </div>
            <div>
              <Label htmlFor="urlML">URL Mercado Livre</Label>
              <Input
                id="urlML"
                value={urlMercadoLivre}
                onChange={(e) => setUrlMercadoLivre(e.target.value)}
                placeholder="https://produto.mercadolivre.com.br/..."
              />
            </div>
            <div>
              <Label htmlFor="idAmazon">ID Amazon (ASIN)</Label>
              <Input
                id="idAmazon"
                value={idAmazon}
                onChange={(e) => setIdAmazon(e.target.value)}
                placeholder="B0EXAMPLE"
              />
            </div>
            <div>
              <Label htmlFor="urlAmazon">URL Amazon</Label>
              <Input
                id="urlAmazon"
                value={urlAmazon}
                onChange={(e) => setUrlAmazon(e.target.value)}
                placeholder="https://amazon.com.br/dp/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Prós e contras padrão</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pros">Prós (uma por linha)</Label>
            <Textarea
              id="pros"
              value={prosDefault}
              onChange={(e) => setProsDefault(e.target.value)}
              placeholder="Pró 1&#10;Pró 2&#10;Pró 3"
              rows={5}
            />
          </div>
          <div>
            <Label htmlFor="contras">Contras (uma por linha)</Label>
            <Textarea
              id="contras"
              value={contrasDefault}
              onChange={(e) => setContrasDefault(e.target.value)}
              placeholder="Contra 1&#10;Contra 2"
              rows={5}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-8">
        <Button variant="brand" onClick={handleSubmit} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Salvando..." : "Salvar produto"}
        </Button>
      </div>
    </div>
  );
}
