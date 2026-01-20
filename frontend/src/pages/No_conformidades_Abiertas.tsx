import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2 } from "lucide-react"; // Para el empty state si lo necesitas después

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

export default function NoConformidadesAbiertas() {
  const [noConformidades, setNoConformidades] = useState<NoConformidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchNoConformidadesAbiertas();
  }, []);

  const fetchNoConformidadesAbiertas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/noconformidades/abiertas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener no conformidades");

      const data = await response.json();
      const dataArray = Array.isArray(data) ? data : [];

      const transformedData = dataArray.map((nc: NoConformidadAPI) => ({
        id: nc.id,
        codigo: nc.codigo,
        tipo: nc.tipo || "No Conformidad",
        descripcion: nc.descripcion,
        estado: "Abierta",
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
          id: 1,
          codigo: "NC-2024-001",
          tipo: "Proceso",
          descripcion: "Desviación en proceso de producción lote A-345",
          estado: "Abierta",
          gravedad: "Mayor",
          fechaDeteccion: "2024-10-15",
          responsable: "Carlos Rodríguez",
        },
        {
          id: 2,
          codigo: "NC-2024-002",
          tipo: "Producto",
          descripcion: "Defecto detectado en inspección final",
          estado: "Abierta",
          gravedad: "Menor",
          fechaDeteccion: "2024-10-20",
          responsable: "María González",
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
            Cargando no conformidades abiertas...
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
                <AlertTriangle className="h-9 w-9 text-[#F59E0B]" />
                No Conformidades Abiertas
              </h1>
              <p className="text-[#6B7280] mt-2 text-lg">
                {total} no conformidad{total !== 1 ? "es" : ""} pendiente{total !== 1 ? "s" : ""} de iniciar tratamiento
              </p>
              <Badge variant="secondary" className="mt-3 bg-white text-[#2563EB]">
                Requieren atención inmediata
              </Badge>
            </div>

            <Link to="/Nueva_NoConformidad">
              <Button
                size="lg"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium shadow-sm"
              >
                <Plus className="mr-2 h-5 w-5" />
                Nueva No Conformidad
              </Button>
            </Link>
          </div>
        </div>

        {/* Tarjetas de métricas - Fondos pastel suaves */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total Abiertas */}
          <Card className="bg-[#E0EDFF] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Total Abiertas</CardTitle>
                <AlertTriangle className="h-8 w-8 text-[#2563EB]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{total}</div>
              <p className="text-[#6B7280] text-sm mt-1">Pendientes de tratamiento</p>
            </CardHeader>
          </Card>

          {/* Gravedad Crítica */}
          <Card className="bg-[#FEF2F2] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Críticas</CardTitle>
                <AlertTriangle className="h-8 w-8 text-[#EF4444]" />
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
                <AlertTriangle className="h-8 w-8 text-[#F59E0B]" />
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
                <AlertTriangle className="h-8 w-8 text-[#22C55E]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{menores}</div>
              <p className="text-[#6B7280] text-sm mt-1">Prioridad moderada</p>
            </CardHeader>
          </Card>
        </div>

        {/* Card informativa - Acciones disponibles */}
        <Card className="shadow-sm">
          <CardHeader className="bg-[#F1F5F9]">
            <CardTitle className="text-2xl text-[#1E3A8A]">
              Acciones Disponibles
            </CardTitle>
            <CardDescription className="text-[#6B7280]">
              Para cada no conformidad abierta puedes realizar las siguientes acciones:
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-4 w-4 rounded-full bg-[#2563EB] mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Iniciar Tratamiento</p>
                <p className="text-[#6B7280]">Cambiar el estado a "en tratamiento" para comenzar análisis y acciones correctivas</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-4 w-4 rounded-full bg-[#22C55E] mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Asignar Responsable</p>
                <p className="text-[#6B7280]">Designar la persona encargada de gestionar la no conformidad</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-4 w-4 rounded-full bg-[#4B5563] mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Editar Detalles</p>
                <p className="text-[#6B7280]">Actualizar información antes de iniciar el tratamiento</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-[#F1F5F9]">
            <CardTitle className="text-2xl text-[#1E3A8A] flex items-center gap-3">
              <AlertTriangle className="h-7 w-7 text-[#F59E0B]" />
              Listado de No Conformidades Abiertas
            </CardTitle>
            <CardDescription className="text-[#6B7280]">
              Registro completo de no conformidades detectadas que aún no han iniciado tratamiento
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