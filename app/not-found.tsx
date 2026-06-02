import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-6">🏠</div>
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-3">
        Página não encontrada
      </h1>
      <p className="text-gray-600 max-w-md mb-8">
        Ops! Esta página não existe ou foi movida. Mas não se preocupe — temos
        muitas outras análises incríveis para você explorar.
      </p>
      <Button variant="brand" size="lg" asChild>
        <Link href="/">Voltar para o início</Link>
      </Button>
    </div>
  );
}
