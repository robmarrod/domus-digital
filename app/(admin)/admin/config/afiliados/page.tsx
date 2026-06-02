export const dynamic = "force-dynamic";

import { AfiliadosForm } from "@/components/admin/afiliados-form";
import { prisma } from "@/lib/prisma";

async function getSettings() {
  return prisma.affiliateSettings.findFirst();
}

export default async function AfiliadosPage() {
  const settings = await getSettings();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Configurações de Afiliados
        </h2>
        <p className="text-gray-500 text-sm">
          Configure os parâmetros de rastreamento para cada plataforma de
          afiliado.
        </p>
      </div>
      <AfiliadosForm
        defaultValues={{
          amazonTag: settings?.amazonTag ?? "",
          shopeeParam: settings?.shopeeParam ?? "",
          mercadoLivreParam: settings?.mercadoLivreParam ?? "",
        }}
      />
    </div>
  );
}
