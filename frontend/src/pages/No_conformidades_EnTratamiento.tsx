import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { noConformidadService } from "@/services/noConformidad.service";

interface NoConformidad {
  id: number;
  codigo: string;
  tipo: string;
  descripcion: string;
  estado: string;
  gravedad: string;
  fechaDeteccion: string;
  responsable: string;
}

interface NoConformidadAPI {
  id: number;
  codigo: string;
  tipo?: string;
  descripcion: string;
  gravedad?: string;
  fechaDeteccion: string;
  responsable?: {
    nombre: string;
    primerApellido: string;
  };
}

export default function NoConformidadesEnTratamiento() {
  const [noConformidades, setNoConformidades] = useState<NoConformidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchNoConformidadesEnTratamiento();
  }, []);

  const fetchNoConformidadesEnTratamiento = async () => {
    try {
      const data = await noConformidadService.getEnTratamiento();
      const dataArray = Array.isArray(data) ? data : [];

      const transformedData = dataArray.map((nc: NoConformidadAPI) => ({
        id: nc.id,
        codigo: nc.codigo,
        tipo: nc.tipo || "No Conformidad",
        descripcion: nc.descripcion,
        estado: "En Tratamiento",
        gravedad: nc.gravedad
          ? nc.gravedad.charAt(0).toUpperCase() + nc.gravedad.slice(1).toLowerCase()
          : "N/A",
        fechaDeteccion: nc.fechaDeteccion,
        responsable: nc.responsable?.nombre
          ? `${nc.responsable.nombre} ${nc.responsable.primerApellido || ""}`
          : "Sin asignar",
      }));

      setNoConformidades(transformedData);
      setTotal(transformedData.length);
    } catch (error) {
      console.error("Error:", error);
      const ejemploData = [
        {
          id: 10,
          codigo: "NC-2024-010",
          tipo: "Proceso",
          descripcion: "Tratamiento en curso para desviación lote B-123",
          estado: "En Tratamiento",
          gravedad: "Mayor",
          fechaDeteccion: "2024-10-18",
          responsable: "Luis Pérez",
        },
        {
          id: 11,
          codigo: "NC-2024-011",
          tipo: "Producto",
          descripcion: "Acciones en ejecución por defecto detectado",
          estado: "En Tratamiento",
          gravedad: "Menor",
          fechaDeteccion: "2024-10-22",
          responsable: "Ana Ruiz",
        },
      ];
      setNoConformidades(ejemploData);
      setTotal(ejemploData.length);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-lg font-medium text-gray-700">
            Cargando no conformidades en tratamiento...
          </p>
        </div>
      </div>
    );
  }

  const criticas = noConformidades.filter((nc) => nc.gravedad === "Critica").length;
  const mayores = noConformidades.filter((nc) => nc.gravedad === "Mayor").length;
  const menores = noConformidades.filter((nc) => nc.gravedad === "Menor").length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Profesional */}
        <div className="bg-[#E0EDFF] rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E3A8A] flex items-center gap-3">
                <Clock className="h-9 w-9 text-[#2563EB]" />
                No Conformidades en Tratamiento
              </h1>
              <p className="text-[#6B7280] mt-2 text-lg">
                {total} no conformidad{total !== 1 ? "es" : ""} en proceso de análisis y resolución
              </p>
              <Badge variant="secondary" className="mt-3 bg-white text-[#2563EB]">
                En ejecución activa
              </Badge>
            </div>

            <Button
              size="lg"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium shadow-sm"
            >
              <Plus className="mr-2 h-5 w-5" />
              Nueva No Conformidad
            </Button>
          </div>
        </div>

        {/* Tarjetas de métricas - Fondos pastel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total en Tratamiento */}
          <Card className="bg-[#E0EDFF] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Total en Tratamiento</CardTitle>
                <Clock className="h-8 w-8 text-[#2563EB]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{total}</div>
              <p className="text-[#6B7280] text-sm mt-1">En proceso activo</p>
            </CardHeader>
          </Card>

          {/* Gravedad Crítica */}
          <Card className="bg-[#FEF2F2] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Críticas</CardTitle>
                <Clock className="h-8 w-8 text-[#EF4444]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{criticas}</div>
              <p className="text-[#6B7280] text-sm mt-1">Máxima prioridad</p>
            </CardHeader>
          </Card>

          {/* Gravedad Mayor */}
          <Card className="bg-[#FFF7ED] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Mayores</CardTitle>
                <Clock className="h-8 w-8 text-[#F59E0B]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{mayores}</div>
              <p className="text-[#6B7280] text-sm mt-1">Alta prioridad</p>
            </CardHeader>
          </Card>

          {/* Gravedad Menor */}
          <Card className="bg-[#ECFDF5] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Menores</CardTitle>
                <Clock className="h-8 w-8 text-[#22C55E]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{menores}</div>
              <p className="text-[#6B7280] text-sm mt-1">Prioridad moderada</p>
            </CardHeader>
          </Card>
        </div>

        {/* Card de Acciones Disponibles */}
        <Card className="shadow-sm">
          <CardHeader className="bg-[#F1F5F9]">
            <CardTitle className="text-2xl text-[#1E3A8A]">
              Acciones Disponibles
            </CardTitle>
            <CardDescription className="text-[#6B7280]">
              Para cada no conformidad en tratamiento puedes realizar:
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-4 w-4 rounded-full bg-[#22C55E] mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Finalizar Tratamiento</p>
                <p className="text-[#6B7280]">Completar el análisis y acciones correctivas, cambiar estado a "cerrada"</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-4 w-4 rounded-full bg-[#2563EB] mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Ver Detalles</p>
                <p className="text-[#6B7280]">Consultar toda la información, documentación y avances</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-4 w-4 rounded-full bg-[#4B5563] mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Actualizar Progreso</p>
                <p className="text-[#6B7280]">Modificar información sobre el avance del tratamiento</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-[#F1F5F9]">
            <CardTitle className="text-2xl text-[#1E3A8A] flex items-center gap-3">
              <Clock className="h-7 w-7 text-[#2563EB]" />
              Listado de No Conformidades en Tratamiento
            </CardTitle>
            <CardDescription className="text-[#6B7280]">
              Todas las no conformidades actualmente en fase de análisis y ejecución de acciones
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <DataTable data={noConformidades} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}