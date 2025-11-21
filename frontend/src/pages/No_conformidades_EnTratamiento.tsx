import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PlusIcon, Clock } from "lucide-react";
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

      // Transformar los datos para que coincidan con el formato de la tabla
      const transformedData = data.data.map((nc: NoConformidadAPI) => ({
        id: nc.id,
        codigo: nc.codigo,
        tipo: nc.tipo || "No Conformidad",
        descripcion: nc.descripcion,
        estado: "En Tratamiento",
        gravedad: nc.gravedad
          ? nc.gravedad.charAt(0).toUpperCase() + nc.gravedad.slice(1)
          : "N/A",
        fechaDeteccion: nc.fechaDeteccion,
        responsable: nc.responsable?.nombre
          ? `${nc.responsable.nombre} ${nc.responsable.primerApellido}`
          : "Sin asignar",
      }));

      setNoConformidades(transformedData);
      setTotal(data.total);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFinalizarTratamiento = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/noconformidades/${id}/finalizar-tratamiento`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Error al cambiar estado");
      }

      // Recargar datos
      fetchNoConformidadesEnTratamiento();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  const mayores = noConformidades.filter(
    (nc) => nc.gravedad === "Mayor",
  ).length;
  const menores = noConformidades.filter(
    (nc) => nc.gravedad === "Menor",
  ).length;
  const criticas = noConformidades.filter(
    (nc) => nc.gravedad === "Critica",
  ).length;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="h-6 w-6 text-blue-500" />
            No Conformidades en Tratamiento
          </h1>
          <p className="text-muted-foreground">
            {total} no conformidad{total !== 1 ? "es" : ""} en proceso de
            tratamiento
          </p>
        </div>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nueva No Conformidad
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total en Tratamiento</CardDescription>
            <CardTitle className="text-3xl">{total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              En proceso de análisis y resolución
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gravedad Crítica</CardDescription>
            <CardTitle className="text-3xl text-red-600">{criticas}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant="outline"
              className="bg-red-50 text-red-700 border-red-200"
            >
              Máxima prioridad
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gravedad Mayor</CardDescription>
            <CardTitle className="text-3xl text-orange-600">
              {mayores}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-700 border-orange-200"
            >
              Alta prioridad
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gravedad Menor</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {menores}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200"
            >
              Moderada
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acciones Disponibles</CardTitle>
          <CardDescription>
            Las no conformidades en tratamiento pueden ser:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
            <div>
              <span className="font-medium">Finalizar Tratamiento:</span> Completar
              el análisis y acciones, cambiar el estado a "cerrada"
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
            <div>
              <span className="font-medium">Ver Detalles:</span> Consultar toda la
              información y documentación asociada
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500 mt-1.5" />
            <div>
              <span className="font-medium">Actualizar Progreso:</span> Modificar
              información sobre el avance del tratamiento
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border bg-card">
        <DataTable data={noConformidades} />
      </div>
    </div>
  );
}
