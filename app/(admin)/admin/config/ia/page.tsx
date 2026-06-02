export const dynamic = "force-dynamic";

import { IAConfigForm } from "@/components/admin/ia-config-form";

export default function IAConfigPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">IA & Geração de Conteúdo</h2>
        <p className="text-gray-500 text-sm mt-1">
          Configure o provedor de IA para gerar posts automaticamente com seu prompt editorial.
        </p>
      </div>
      <IAConfigForm />
    </div>
  );
}
