"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AfiliadosFormProps {
  defaultValues: {
    amazonTag: string;
    shopeeParam: string;
    mercadoLivreParam: string;
  };
}

export function AfiliadosForm({ defaultValues }: AfiliadosFormProps) {
  const { toast } = useToast();
  const [amazonTag, setAmazonTag] = useState(defaultValues.amazonTag);
  const [shopeeParam, setShopeeParam] = useState(defaultValues.shopeeParam);
  const [mercadoLivreParam, setMercadoLivreParam] = useState(
    defaultValues.mercadoLivreParam
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/config/afiliados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amazonTag, shopeeParam, mercadoLivreParam }),
      });
      if (!res.ok) throw new Error("Erro ao salvar configurações");
      toast({ title: "Configurações salvas!", variant: "success" as any });
    } catch (e) {
      toast({
        title: "Erro",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-lg">📦</span> Amazon
          </CardTitle>
          <CardDescription>
            Configure sua tag de afiliado da Amazon Associates Brasil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="amazonTag">Tag de afiliado (Associates ID)</Label>
          <Input
            id="amazonTag"
            value={amazonTag}
            onChange={(e) => setAmazonTag(e.target.value)}
            placeholder="seusite-20"
            className="mt-2 font-mono"
          />
          <p className="text-xs text-gray-400 mt-2">
            Será adicionado como <code>?tag=seusite-20</code> nas URLs da Amazon.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-lg">🛍️</span> Shopee
          </CardTitle>
          <CardDescription>
            Configure o parâmetro de rastreamento do programa de afiliados da Shopee.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="shopeeParam">Parâmetro de rastreamento</Label>
          <Input
            id="shopeeParam"
            value={shopeeParam}
            onChange={(e) => setShopeeParam(e.target.value)}
            placeholder="af_id=seusite"
            className="mt-2 font-mono"
          />
          <p className="text-xs text-gray-400 mt-2">
            Exemplo: <code>af_id=seusite</code>. Será adicionado como query string nas URLs.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-lg">🛒</span> Mercado Livre
          </CardTitle>
          <CardDescription>
            Configure o parâmetro de rastreamento do programa de afiliados do Mercado Livre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="mlParam">Parâmetro de rastreamento</Label>
          <Input
            id="mlParam"
            value={mercadoLivreParam}
            onChange={(e) => setMercadoLivreParam(e.target.value)}
            placeholder="matt_tool=seusite"
            className="mt-2 font-mono"
          />
          <p className="text-xs text-gray-400 mt-2">
            Exemplo: <code>matt_tool=seusite</code>. Será adicionado como query string.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="brand" onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Salvando..." : "Salvar configurações"}
        </Button>
      </div>
    </div>
  );
}
