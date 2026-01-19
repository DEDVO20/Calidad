import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function InstanciasActivas() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Placeholder: si existe un endpoint para instancias, aquí se consumiría
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <div className="p-8">Cargando instancias...</div>;

  return (
    <div className="min-h-screen p-6 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1E3A8A]">Instancias Activas</h1>
          <div className="text-sm text-[#6B7280]">Vista de instancias activas de procesos (placeholder)</div>
        </div>

        <Card>
          <CardHeader className="bg-[#F1F5F9]"><CardTitle>Instancias</CardTitle></CardHeader>
          <CardContent>
            <div className="text-[#6B7280]">Aún no hay implementación de instancias activas. Puedes conectar un endpoint o pedir que lo implemente.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
