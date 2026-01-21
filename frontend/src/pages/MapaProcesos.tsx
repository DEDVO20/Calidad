import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {
  Crown,
  Rocket,
  Wrench,
  Layers,
  Search,
  Eye,
  User,
  ListChecks,
} from "lucide-react";

export default function MapaProcesos() {
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("todos");
  const [open, setOpen] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState<any>(null);

  // Datos simulados de procesos
  const procesos = [
    // Estratégicos
    {
      id: 1,
      nombre: "Planeación Estratégica",
      responsable: "Dirección General",
      categoria: "estrategico",
      actividades: 8,
    },
    {
      id: 2,
      nombre: "Gestión de Riesgos",
      responsable: "Oficina de Calidad",
      categoria: "estrategico",
      actividades: 5,
    },

    // Misionales
    {
      id: 3,
      nombre: "Producción de Servicios",
      responsable: "Coordinación Operativa",
      categoria: "misional",
      actividades: 12,
    },
    {
      id: 4,
      nombre: "Atención al Cliente",
      responsable: "Servicio al Cliente",
      categoria: "misional",
      actividades: 6,
    },

    // Apoyo
    {
      id: 5,
      nombre: "Gestión de Talento Humano",
      responsable: "Recursos Humanos",
      categoria: "apoyo",
      actividades: 4,
    },
    {
      id: 6,
      nombre: "Infraestructura TI",
      responsable: "Tecnología",
      categoria: "apoyo",
      actividades: 7,
    },
  ];

  const categorias = {
    estrategico: "Procesos Estratégicos",
    misional: "Procesos Misionales",
    apoyo: "Procesos de Apoyo",
  };

  const icons: any = {
    estrategico: Crown,
    misional: Rocket,
    apoyo: Wrench,
  };

  // Filtro principal
  const procesosFiltrados = procesos.filter((p) => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(search.toLowerCase());
    const coincideCategoria = categoria === "todos" || p.categoria === categoria;
    return coincideBusqueda && coincideCategoria;
  });

  // KPIs por categoría
  const kpi = {
    estrategico: procesos.filter((p) => p.categoria === "estrategico").length,
    misional: procesos.filter((p) => p.categoria === "misional").length,
    apoyo: procesos.filter((p) => p.categoria === "apoyo").length,
    total: procesos.length,
  };

  return (
    <div className="p-6 space-y-8">

      {/* Título */}
      <h1 className="text-3xl font-bold text-center">Mapa de Procesos</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-500">
              <Crown className="h-5 w-5" /> Estratégicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{kpi.estrategico}</p>
          </CardContent>
        </Card>

        <Card className="border-green-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Rocket className="h-5 w-5" /> Misionales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{kpi.misional}</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <Wrench className="h-5 w-5" /> Apoyo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{kpi.apoyo}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <Layers className="h-5 w-5" /> Total Procesos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{kpi.total}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 w-full md:w-1/2">
          <Input
            placeholder="Buscar proceso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button>
            <Search className="h-4 w-4 mr-1" /> Buscar
          </Button>
        </div>

        <Select value={categoria} onValueChange={setCategoria}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="estrategico">Estratégicos</SelectItem>
            <SelectItem value="misional">Misionales</SelectItem>
            <SelectItem value="apoyo">Apoyo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Render de tarjetas por categoría */}
      {Object.keys(categorias).map((cat) => {
        const items = procesosFiltrados.filter((p) => p.categoria === cat);
        if (items.length === 0) return null;

        const Icon = icons[cat];

        return (
          <div key={cat} className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Icon className="h-5 w-5" /> {categorias[cat]}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {items.map((p) => (
                <Card
                  key={p.id}
                  className="hover:shadow-lg transition-all cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" /> {p.nombre}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <p className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" /> <strong>Responsable:</strong> {p.responsable}
                    </p>

                    <p className="flex items-center gap-2 text-sm">
                      <ListChecks className="h-4 w-4" /> <strong>Actividades:</strong>{" "}
                      {p.actividades}
                    </p>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        setSelectedProceso(p);
                        setOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Ver más
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Modal de detalles */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalles del Proceso</DialogTitle>
          </DialogHeader>

          {selectedProceso && (
            <div className="space-y-3">
              <p>
                <strong>Nombre:</strong> {selectedProceso.nombre}
              </p>

              <p>
                <strong>Responsable:</strong> {selectedProceso.responsable}
              </p>

              <p>
                <strong>Actividades:</strong> {selectedProceso.actividades}
              </p>

              <div className="border-t pt-3">
                <p className="font-semibold mb-2">📌 Fases del proceso:</p>
                <ul className="text-sm space-y-1">
                  <li>📍 Entrada</li>
                  <li>⚙️ Transformación</li>
                  <li>📤 Salida</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
