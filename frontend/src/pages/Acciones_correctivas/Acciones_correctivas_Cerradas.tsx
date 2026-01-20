import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NuevasAccionesCorrectivas from "./nuevas";
import { accionCorrectivaService } from "@/services/accionCorrectiva.service";

interface AccionCorrectiva {
  id: number;
  codigo: string;
  tipo: string;
  descripcion: string;
  estado: string;
  gravedad: string;
  fechaDeteccion: string;
  responsable: string;
}

interface AccionCorrectivaAPI {
  id: string;
  codigo: string;
  tipo?: string;
  descripcion?: string;
  estado?: string;
  fechaCompromiso?: string;
  fechaImplementacion?: string;
  responsableId?: string;
  eficaciaVerificada?: boolean;
  noConformidadId: string;
}

export default function AccionesCorrectivasCerradas() {
  const [accionesCorrectivas, setAccionesCorrectivas] = useState<AccionCorrectiva[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAccionesCorrectivasCerradas();
  }, []);

  const fetchAccionesCorrectivasCerradas = async () => {
    try {
      const accionesCerradas = await accionCorrectivaService.getCerradas();

      const transformedData = accionesCerradas.map((ac: AccionCorrectivaAPI, index: number) => {
        let fechaFormateada = "Sin fecha";
        if (ac.fechaCompromiso || ac.fechaImplementacion) {
          const fechaAUsar = ac.fechaImplementacion || ac.fechaCompromiso;
          try {
            const date = new Date(fechaAUsar!);
            fechaFormateada = date.toLocaleDateString("es-CO");
          } catch (e) {
            console.error("Error al formatear fecha:", e);
          }
        }

        return {
          id: index + 1,
          codigo: ac.codigo,
          tipo: ac.tipo || "Correctiva",
          descripcion: ac.descripcion || "Sin descripción",
          estado: "Cerrada",
          gravedad: ac.eficaciaVerificada ? "Verificada" : "Pendiente Verificación",
          fechaDeteccion: fechaFormateada,
          responsable: "Sin asignar",
        };
      });

      setAccionesCorrectivas(transformedData);
      setTotal(transformedData.length);
    } catch (error) {
      console.error("Error:", error);
      const ejemploData: AccionCorrectiva[] = [
        {
          id: 1,
          codigo: "AC-2024-001",
          tipo: "Correctiva",
          descripcion: "Mejora en proceso de validación de documentos",
          estado: "Cerrada",
          gravedad: "Verificada",
          fechaDeteccion: "15/10/2024",
          responsable: "María López",
        },
        {
          id: 2,
          codigo: "AC-2024-002",
          tipo: "Preventiva",
          descripcion: "Actualización de procedimiento de auditoría",
          estado: "Cerrada",
          gravedad: "Verificada",
          fechaDeteccion: "01/09/2024",
          responsable: "Carlos Gómez",
        },
      ];
      setAccionesCorrectivas(ejemploData);
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
            Cargando acciones cerradas...
          </p>
        </div>
      </div>
    );
  }

  const correctivas = accionesCorrectivas.filter(
    (ac) => ac.tipo.toLowerCase() === "correctiva"
  ).length;

  const preventivas = accionesCorrectivas.filter(
    (ac) => ac.tipo.toLowerCase() === "preventiva"
  ).length;

  const verificadas = accionesCorrectivas.filter(
    (ac) => ac.gravedad === "Verificada"
  ).length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Profesional */}
        <div className="bg-[#E0EDFF] rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E3A8A] flex items-center gap-3">
                <CheckCircle className="h-9 w-9 text-[#22C55E]" />
                Acciones Correctivas Cerradas
              </h1>
              <p className="text-[#6B7280] mt-2 text-lg">
                {total} acción{total !== 1 ? "es" : ""} completamente implementada{total !== 1 ? "s" : ""}
              </p>
              <Badge variant="secondary" className="mt-3 bg-white text-[#22C55E]">
                Ciclo completado
              </Badge>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium shadow-sm"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Nueva Acción Correctiva
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-[#1E3A8A]">
                    Registrar Nueva Acción Correctiva
                  </DialogTitle>
                </DialogHeader>
                <NuevasAccionesCorrectivas />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total Cerradas */}
          <Card className="bg-[#E0EDFF] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Total Cerradas</CardTitle>
                <CheckCircle className="h-8 w-8 text-[#2563EB]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{total}</div>
              <p className="text-[#6B7280] text-sm mt-1">Implementación finalizada</p>
            </CardHeader>
          </Card>

          {/* Correctivas */}
          <Card className="bg-[#FFF7ED] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Correctivas</CardTitle>
                <CheckCircle className="h-8 w-8 text-[#F59E0B]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{correctivas}</div>
              <p className="text-[#6B7280] text-sm mt-1">Problemas corregidos</p>
            </CardHeader>
          </Card>

          {/* Preventivas */}
          <Card className="bg-[#E0EDFF] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Preventivas</CardTitle>
                <CheckCircle className="h-8 w-8 text-[#2563EB]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{preventivas}</div>
              <p className="text-[#6B7280] text-sm mt-1">Riesgos evitados</p>
            </CardHeader>
          </Card>

          {/* Eficacia Verificada */}
          <Card className="bg-[#ECFDF5] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Eficacia Verificada</CardTitle>
                <CheckCircle className="h-8 w-8 text-[#22C55E]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{verificadas}</div>
              <p className="text-[#6B7280] text-sm mt-1">Resultados comprobados</p>
            </CardHeader>
          </Card>
        </div>

        {/* Card Informativa */}
        <Card className="shadow-sm">
          <CardHeader className="bg-[#F1F5F9]">
            <CardTitle className="text-2xl text-[#1E3A8A]">
              Información de Registro
            </CardTitle>
            <CardDescription className="text-[#6B7280]">
              Las acciones correctivas cerradas representan el cierre completo del ciclo correctivo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-4 w-4 rounded-full bg-[#22C55E] mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Implementación Completa</p>
                <p className="text-[#6B7280]">Todas las actividades planificadas fueron ejecutadas según lo establecido</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-4 w-4 rounded-full bg-[#2563EB] mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Documentación Completa</p>
                <p className="text-[#6B7280]">Registro detallado de ejecución, resultados y evidencias</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-4 w-4 rounded-full bg-[#4B5563] mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Historial para Análisis</p>
                <p className="text-[#6B7280]">Disponibles para revisión de tendencias y mejora continua del SGC</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-[#F1F5F9]">
            <CardTitle className="text-2xl text-[#1E3A8A] flex items-center gap-3">
              <CheckCircle className="h-7 w-7 text-[#22C55E]" />
              Listado de Acciones Cerradas
            </CardTitle>
            <CardDescription className="text-[#6B7280]">
              Registro histórico de acciones correctivas, preventivas y de mejora finalizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <DataTable data={accionesCorrectivas} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}