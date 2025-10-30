import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PlusIcon, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

      if (!response.ok) {
        throw new Error("Error al obtener no conformidades");
      }

      const data = await response.json();

      // Transformar los datos para que coincidan con el formato de la tabla
      const transformedData = data.data.map((nc: NoConformidadAPI) => ({
        id: nc.id,
        codigo: nc.codigo,
        tipo: nc.tipo || "No Conformidad",
        descripcion: nc.descripcion,
        estado: "Abierta", // Estado fijo para esta vista
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
      // Datos de ejemplo para desarrollo
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleIniciarTratamiento = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/noconformidades/${id}/iniciar-tratamiento`,
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
      fetchNoConformidadesAbiertas();
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
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            No Conformidades Abiertas
          </h1>
          <p className="text-muted-foreground">
            {total} no conformidad{total !== 1 ? "es" : ""} pendiente
            {total !== 1 ? "s" : ""} de iniciar tratamiento
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
            <CardDescription>Total Abiertas</CardDescription>
            <CardTitle className="text-3xl">{total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Requieren atención inmediata
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
            Las no conformidades abiertas pueden ser:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
            <div>
              <span className="font-medium">Iniciar Tratamiento:</span> Cambiar
              el estado a "en tratamiento" para comenzar el análisis y acciones
              correctivas
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
            <div>
              <span className="font-medium">Asignar Responsable:</span> Designar
              la persona encargada de gestionar la no conformidad
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500 mt-1.5" />
            <div>
              <span className="font-medium">Editar Detalles:</span> Actualizar
              información antes de iniciar el tratamiento
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
