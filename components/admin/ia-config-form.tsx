"use client";

import { useState, useEffect } from "react";
import { Bot, Check, Trash2, Zap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const PROVIDERS = [
  {
    id: "anthropic",
    nome: "Anthropic (Claude)",
    modelos: ["claude-haiku-4-5-20251001", "claude-sonnet-4-6", "claude-opus-4-6"],
    link: "https://console.anthropic.com/settings/keys",
    desc: "Melhor qualidade editorial. Recomendado.",
  },
  {
    id: "openai",
    nome: "OpenAI (ChatGPT)",
    modelos: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"],
    link: "https://platform.openai.com/api-keys",
    desc: "Amplamente usado. Boa relação custo/qualidade.",
  },
  {
    id: "gemini",
    nome: "Google Gemini",
    modelos: ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"],
    link: "https://aistudio.google.com/app/apikey",
    desc: "Generoso na camada gratuita.",
  },
];

interface ConfigSalva {
  id: string;
  provider: string;
  model: string | null;
  ativo: boolean;
  apiKeyMasked: string | null;
  updatedAt: string;
}

export function IAConfigForm() {
  const { toast } = useToast();
  const [configs, setConfigs] = useState<ConfigSalva[]>([]);
  const [provider, setProvider] = useState("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [promptRanking, setPromptRanking] = useState("");
  const [promptIndividual, setPromptIndividual] = useState("");
  const [savingPrompts, setSavingPrompts] = useState(false);

  const providerInfo = PROVIDERS.find((p) => p.id === provider)!;

  useEffect(() => {
    fetch("/api/config/ia")
      .then((r) => r.json())
      .then((data) => {
        setConfigs(data);
        setLoading(false);
      });
  }, []);

  async function handleSalvar() {
    if (!apiKey.trim()) {
      toast({ title: "Informe a API Key", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/config/ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider, apiKey: apiKey.trim(), model: model || undefined, ativo,
          promptRanking: promptRanking || undefined,
          promptIndividual: promptIndividual || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast({ title: "Configuração salva!" });
      setApiKey("");
      // Recarregar configs
      const updated = await fetch("/api/config/ia").then((r) => r.json());
      setConfigs(updated);
    } catch (e) {
      toast({ title: "Erro", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover esta configuração?")) return;
    await fetch("/api/config/ia", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setConfigs((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Removido!" });
  }

  async function handleAtivar(id: string) {
    const config = configs.find((c) => c.id === id);
    if (!config) return;
    // Reaproveitamos POST para ativar — mas precisamos da key (não a temos em mãos)
    // Por isso mostramos uma mensagem orientando
    toast({
      title: "Para ativar outro provedor",
      description: "Salve novamente as configurações do provedor desejado marcando 'Definir como ativo'.",
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Configs salvas */}
      {!loading && configs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Provedores configurados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {configs.map((c) => {
              const info = PROVIDERS.find((p) => p.id === c.provider);
              return (
                <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bot className="h-5 w-5 text-brand-500" />
                    <div>
                      <p className="text-sm font-semibold">{info?.nome ?? c.provider}</p>
                      <p className="text-xs text-gray-400">
                        {c.model || "modelo padrão"} · key: {c.apiKeyMasked}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.ativo ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" /> Ativo
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAtivar(c.id)}
                        className="text-xs text-gray-500 hover:text-brand-500 underline"
                      >
                        Ativar
                      </button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(c.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Formulário de nova config */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Adicionar / Atualizar provedor</CardTitle>
          <CardDescription>
            Escolha o provedor e cole sua API key. Ela fica salva no banco de dados do site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seletor de provedor */}
          <div className="grid grid-cols-3 gap-3">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setProvider(p.id);
                  setModel("");
                }}
                className={`p-3 border-2 rounded-xl text-left transition-all ${
                  provider === p.id
                    ? "border-brand-500 bg-brand-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="text-sm font-semibold text-gray-800">{p.nome.split(" ")[0]}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
              </button>
            ))}
          </div>

          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label>API Key do {providerInfo.nome}</Label>
              <a
                href={providerInfo.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-500 hover:underline"
              >
                Gerar chave →
              </a>
            </div>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Cole sua API key aqui..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              A key é armazenada no banco de dados do site, não no código.
            </p>
          </div>

          {/* Modelo */}
          <div>
            <Label>Modelo (opcional)</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder={`Padrão: ${providerInfo.modelos[0]}`} />
              </SelectTrigger>
              <SelectContent>
                {providerInfo.modelos.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ativo */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="accent-brand-500 h-4 w-4"
            />
            <span className="text-sm text-gray-700">
              Definir como provedor ativo (desativa os demais)
            </span>
          </label>

          <Button
            onClick={handleSalvar}
            disabled={saving}
            className="w-full"
            variant="brand"
          >
            <Zap className="h-4 w-4 mr-2" />
            {saving ? "Salvando..." : "Salvar configuração"}
          </Button>
        </CardContent>
      </Card>

      {/* Prompts customizados */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-base">Prompts editoriais customizados</CardTitle>
          </div>
          <CardDescription>
            Cole aqui seus prompts personalizados. Se deixar em branco, o sistema usa o prompt padrão do Achadinhos da Elis.
            Use <code className="bg-gray-100 px-1 rounded text-xs">{"{palavraPrimaria}"}</code> para inserir a palavra-chave dinamicamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Prompt para post RANKING (comparativo de múltiplos produtos)</Label>
            <Textarea
              value={promptRanking}
              onChange={(e) => setPromptRanking(e.target.value)}
              placeholder="Você é um redator especialista... (deixe em branco para usar o padrão)"
              rows={8}
              className="font-mono text-xs mt-1"
            />
            <p className="text-xs text-gray-400 mt-1">
              Este prompt é usado quando você gera o post ranking com todos os produtos.
            </p>
          </div>
          <div>
            <Label>Prompt para post INDIVIDUAL (1 produto por artigo)</Label>
            <Textarea
              value={promptIndividual}
              onChange={(e) => setPromptIndividual(e.target.value)}
              placeholder="Você é um redator especialista... (deixe em branco para usar o padrão)"
              rows={8}
              className="font-mono text-xs mt-1"
            />
            <p className="text-xs text-gray-400 mt-1">
              Este prompt é usado para cada artigo individual de produto gerado automaticamente.
            </p>
          </div>
          <Button
            onClick={async () => {
              setSavingPrompts(true);
              try {
                const activeConfig = configs.find((c) => c.ativo);
                if (!activeConfig) { alert("Salve primeiro um provedor ativo antes de salvar prompts."); return; }
                await fetch("/api/config/ia", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    provider: activeConfig.provider,
                    apiKey: "MANTER",
                    ativo: true,
                    promptRanking: promptRanking || undefined,
                    promptIndividual: promptIndividual || undefined,
                  }),
                });
                alert("Prompts salvos!");
              } finally {
                setSavingPrompts(false);
              }
            }}
            disabled={savingPrompts}
            variant="outline"
            className="w-full"
          >
            {savingPrompts ? "Salvando prompts..." : "Salvar prompts"}
          </Button>
        </CardContent>
      </Card>

      {/* Info de agendamento */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-4">
          <p className="text-sm font-semibold text-amber-800 mb-1">⏰ Agendamento automático</p>
          <p className="text-xs text-amber-700">
            Para que posts agendados publiquem sozinhos, configure um cron job na Hostinger
            (ou qualquer serviço) para chamar a cada 15 minutos:
          </p>
          <code className="block mt-2 text-xs bg-amber-100 text-amber-900 rounded p-2 break-all">
            GET https://achadinhosdaelis.com.br/api/publicar-agendados?secret=achadinhos2024
          </code>
          <p className="text-xs text-amber-600 mt-1">
            No hPanel → Avançado → Cron Jobs → adicione o URL acima com frequência de 15 min.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
