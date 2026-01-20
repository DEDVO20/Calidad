import { useEffect, useState } from "react";
import { ClipboardList, Search, Eye, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const API_URL = "http://localhost:3000/api";

interface AccionCorrectiva {
  id: string;
  codigo: string;
  tipo: string;
  descripcion: string;
  analisisCausaRaiz: string;
  planAccion: string;
  responsableId: string;
  fechaCompromiso: string;
  fechaImplementacion: string;
  estado: string;
  observacion: string;
  creadoEn: string;
}

export default function EnProcesoAccionesCorrectivas() {
  const [acciones, setAcciones] = useState<AccionCorrectiva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedAccion, setSelectedAccion] = useState<AccionCorrectiva | null>(null);

  useEffect(() => {
    fetchAcciones();
  }, []);

  const getAuthToken = () => localStorage.getItem("token");

  const fetchAcciones = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) throw new Error("No hay sesión activa");

      const response = await fetch(`${API_URL}/acciones-correctivas`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al cargar acciones correctivas");

      const data = await response.json();
      const enProceso = data.filter(
        (accion: AccionCorrectiva) =>
          ["en_proceso", "pendiente", "en_ejecucion"].includes(accion.estado)
      );

      setAcciones(enProceso);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (accion: AccionCorrectiva) => {
    setSelectedAccion(accion);
    setShowDialog(true);
  };

  const getEstadoBadge = (estado: string) => {
    const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; bg: string; text: string }> = {
      pendiente: { label: "Pendiente", variant: "secondary", bg: "#FFF7ED", text: "#F59E0B" },
      en_proceso: { label: "En Proceso", variant: "secondary", bg: "#E0EDFF", text: "#2563EB" },
      en_ejecucion: { label: "En Ejecución", variant: "secondary", bg: "#E0EDFF", text: "#2563EB" },
    };

    const fallback = { label: estado.charAt(0).toUpperCase() + estado.slice(1), variant: "secondary" as const, bg: "#F1F5F9", text: "#6B7280" };
    const { label, bg, text } = config[estado] || fallback;

    return <Badge className={`bg-[${bg}] text-[${text}] font-medium`}>{label}</Badge>;
  };

  const getTipoBadge = (tipo: string) => {
    const tipos: Record<string, { label: string; color: string }> = {
      correctiva: { label: "Correctiva", color: "#EF4444" },
      preventiva: { label: "Preventiva", color: "#22C55E" },
      mejora: { label: "Mejora", color: "#2563EB" },
    };
    const { label, color } = tipos[tipo] || { label: tipo, color: "#6B7280" };
    return <span className="font-medium" style={{ color }}>{label}</span>;
  };

  const filteredAcciones = acciones.filter(
    (accion) =>
      accion.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (accion.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      accion.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-lg font-medium text-gray-700">
            Cargando acciones correctivas en proceso...
          </p>
        </div>
      </div>
    );
  }

  const totalEnProceso = acciones.length;
  const porVencer = acciones.filter(a => {
    if (!a.fechaCompromiso) return false;
    const diff = new Date(a.fechaCompromiso).getTime() - Date.now();
    const days = diff / (1000 * 60 * 60 * 24);
    return days <= 7 && days > 0;
  }).length;

  const vencidas = acciones.filter(a => {
    if (!a.fechaCompromiso) return false;
    return new Date(a.fechaCompromiso) < new Date();
  }).length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Profesional */}
        <div className="bg-[#E0EDFF] rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E3A8A] flex items-center gap-3">
                <ClipboardList className="h-9 w-9 text-[#2563EB]" />
                Acciones Correctivas en Proceso
              </h1>
              <p className="text-[#6B7280] mt-2 text-lg">
                {totalEnProceso} {totalEnProceso === 1 ? "acción en proceso" : "acciones en proceso"}
              </p>
              <Badge variant="secondary" className="mt-3 bg-white text-[#2563EB]">
                Seguimiento activo
              </Badge>
            </div>
          </div>
        </div>

        {/* Error Card */}
        {error && (
          <Card className="border-red-200 bg-red-50 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Error de conexión</p>
                  <p className="text-sm">{error}</p>
                  <button
                    onClick={fetchAcciones}
                    className="text-sm font-medium underline mt-1"
                  >
                    Reintentar conexión
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total En Proceso */}
          <Card className="bg-[#E0EDFF] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Total en Proceso</CardTitle>
                <ClipboardList className="h-8 w-8 text-[#2563EB]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{totalEnProceso}</div>
              <p className="text-[#6B7280] text-sm mt-1">Acciones activas</p>
            </CardHeader>
          </Card>

          {/* Por Vencer */}
          <Card className="bg-[#FFF7ED] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Por Vencer</CardTitle>
                <Calendar className="h-8 w-8 text-[#F59E0B]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{porVencer}</div>
              <p className="text-[#6B7280] text-sm mt-1">En los próximos 7 días</p>
            </CardHeader>
          </Card>

          {/* Vencidas */}
          <Card className="bg-[#FEF2F2] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Vencidas</CardTitle>
                <AlertCircle className="h-8 w-8 text-[#EF4444]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{vencidas}</div>
              <p className="text-[#6B7280] text-sm mt-1">Requieren atención inmediata</p>
            </CardHeader>
          </Card>
        </div>

        {/* Tabla */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-[#F1F5F9]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl text-[#1E3A8A] flex items-center gap-3">
                  <ClipboardList className="h-7 w-7" />
                  Listado de Acciones en Proceso
                </CardTitle>
                <CardDescription className="text-[#6B7280]">
                  Haz clic en el ícono de ojo para ver detalles completos
                </CardDescription>
              </div>
              <div className="w-full max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-[#6B7280]" />
                  <Input
                    placeholder="Buscar por código, tipo o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F1F5F9] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Código</th>
                    <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Tipo</th>
                    <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Descripción</th>
                    <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Fecha Compromiso</th>
                    <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Estado</th>
                    <th className="text-right p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider pr-10">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5E7EB]">
                  {filteredAcciones.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-[#6B7280]">
                        <div className="flex flex-col items-center">
                          <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-lg">
                            {searchTerm ? "No se encontraron resultados" : "No hay acciones correctivas en proceso"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAcciones.map((accion) => {
                      const isVencida = accion.fechaCompromiso && new Date(accion.fechaCompromiso) < new Date();

                      return (
                        <tr key={accion.id} className="hover:bg-[#EFF6FF] transition-colors">
                          <td className="p-6">
                            <Badge className="bg-[#E0EDFF] text-[#2563EB] font-bold">
                              {accion.codigo}
                            </Badge>
                          </td>
                          <td className="p-6">{getTipoBadge(accion.tipo)}</td>
                          <td className="p-6 text-[#6B7280] max-w-md">
                            {accion.descripcion || <span className="italic text-gray-400">Sin descripción</span>}
                          </td>
                          <td className="p-6">
                            {accion.fechaCompromiso ? (
                              <div className="flex items-center gap-2">
                                {isVencida && <AlertCircle className="h-4 w-4 text-[#EF4444]" />}
                                <span className={isVencida ? "text-[#EF4444] font-medium" : "text-[#6B7280]"}>
                                  {new Date(accion.fechaCompromiso).toLocaleDateString("es-CO")}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm italic text-gray-400">No definida</span>
                            )}
                          </td>
                          <td className="p-6">{getEstadoBadge(accion.estado)}</td>
                          <td className="p-6">
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleView(accion)}
                              >
                                <Eye className="h-4 w-4 text-[#2563EB]" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog de Detalles */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#1E3A8A] flex items-center gap-3">
                <ClipboardList className="h-7 w-7 text-[#2563EB]" />
                Detalles de la Acción Correctiva
              </DialogTitle>
            </DialogHeader>

            {selectedAccion && (
              <div className="grid gap-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[#6B7280]">Código</Label>
                    <p className="text-2xl font-bold text-[#1E3A8A] mt-1">{selectedAccion.codigo}</p>
                  </div>
                  <div>{getEstadoBadge(selectedAccion.estado)}</div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-[#6B7280]">Tipo de Acción</Label>
                    <p className="font-medium mt-1 text-lg">{getTipoBadge(selectedAccion.tipo)}</p>
                  </div>
                  <div>
                    <Label className="text-[#6B7280]">Fecha Compromiso</Label>
                    <p className="font-medium mt-1">
                      {selectedAccion.fechaCompromiso
                        ? new Date(selectedAccion.fechaCompromiso).toLocaleDateString("es-CO")
                        : "No definida"}
                    </p>
                  </div>
                </div>

                {selectedAccion.descripcion && (
                  <div>
                    <Label className="text-[#6B7280]">Descripción</Label>
                    <p className="mt-2 text-[#6B7280] leading-relaxed whitespace-pre-wrap">{selectedAccion.descripcion}</p>
                  </div>
                )}

                {selectedAccion.analisisCausaRaiz && (
                  <div>
                    <Label className="text-[#6B7280]">Análisis de Causa Raíz</Label>
                    <p className="mt-2 text-[#6B7280] leading-relaxed whitespace-pre-wrap">{selectedAccion.analisisCausaRaiz}</p>
                  </div>
                )}

                {selectedAccion.planAccion && (
                  <div>
                    <Label className="text-[#6B7280]">Plan de Acción</Label>
                    <p className="mt-2 text-[#6B7280] leading-relaxed whitespace-pre-wrap">{selectedAccion.planAccion}</p>
                  </div>
                )}

                {selectedAccion.observacion && (
                  <div>
                    <Label className="text-[#6B7280]">Observaciones</Label>
                    <p className="mt-2 text-[#6B7280] leading-relaxed whitespace-pre-wrap">{selectedAccion.observacion}</p>
                  </div>
                )}

                <div className="bg-[#F1F5F9] rounded-lg p-4 space-y-2 border border-[#E5E7EB]">
                  <div className="flex justify-between">
                    <span className="font-medium text-[#6B7280]">Creada el:</span>
                    <span className="font-mono">{new Date(selectedAccion.creadoEn).toLocaleString("es-CO")}</span>
                  </div>
                  {selectedAccion.fechaImplementacion && (
                    <div className="flex justify-between">
                      <span className="font-medium text-[#6B7280]">Fecha de Implementación:</span>
                      <span className="font-mono">{new Date(selectedAccion.fechaImplementacion).toLocaleDateString("es-CO")}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}