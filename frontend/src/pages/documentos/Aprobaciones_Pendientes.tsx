import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FileCheck,
  CheckCircle,
  X,
  Eye,
  FileText,
  Calendar,
  User,
  RefreshCw,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { aprobacionesService } from "@/services/aprobaciones.service";
import { toast } from "sonner";

interface Documento {
  id: string;
  codigo: string;
  nombreArchivo: string;
  tipo: string;
  version: string;
  estado: string;
  fechaSolicitud: string;
  solicitadoPor: string;
  prioridad: string;
}

interface DocumentoAPI {
  id: string;
  codigoDocumento: string;
  nombreArchivo: string;
  tipoDocumento?: string;
  version: string;
  estado: string;
  creadoEn: string;
  creadoPor?: {
    nombre: string;
    primerApellido: string;
  };
}

export default function AprobacionesPendientes() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string>("todos");
  const [comentarios, setComentarios] = useState("");
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    type: 'aprobar' | 'rechazar' | null;
    documento: Documento | null;
  }>({ open: false, type: null, documento: null });

  useEffect(() => {
    fetchAprobacionesPendientes();
  }, []);

  const fetchAprobacionesPendientes = async () => {
    setLoading(true);
    try {
      const data = await aprobacionesService.getPendientes();

      const transformedData = data.items?.map((doc: DocumentoAPI) => ({
        id: doc.id,
        codigo: doc.codigoDocumento || "SIN-CÓDIGO",
        nombreArchivo: doc.nombreArchivo,
        tipo: doc.tipoDocumento || "Documento",
        version: doc.version || "1.0",
        estado: "Pendiente de Aprobación",
        fechaSolicitud: doc.creadoEn,
        solicitadoPor: doc.creadoPor
          ? `${doc.creadoPor.nombre} ${doc.creadoPor.primerApellido}`
          : "Usuario desconocido",
        prioridad: calcularPrioridad(doc.creadoEn),
      })) || [];

      setDocumentos(transformedData);
      setTotal(data.total || transformedData.length);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar documentos pendientes");
      setDocumentos([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const calcularPrioridad = (fecha: string): string => {
    const diasTranscurridos = Math.floor(
      (Date.now() - new Date(fecha).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diasTranscurridos > 7) return "Urgente";
    if (diasTranscurridos > 3) return "Alta";
    return "Media";
  };

  const openDialog = (type: 'aprobar' | 'rechazar', documento: Documento) => {
    setDialogState({ open: true, type, documento });
    setComentarios("");
  };

  const closeDialog = () => {
    setDialogState({ open: false, type: null, documento: null });
  };

  const handleAprobar = async () => {
    const documento = dialogState.documento;
    if (!documento) return;

    setActionLoading(documento.id);
    try {
      await aprobacionesService.aprobar(documento.id);
      toast.success(`Documento "${documento.nombreArchivo}" aprobado correctamente`);
      await fetchAprobacionesPendientes();
      closeDialog();
    } catch (error) {
      toast.error("Error al aprobar el documento");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRechazar = async () => {
    const documento = dialogState.documento;
    if (!documento) return;

    if (!comentarios || comentarios.trim().length < 10) {
      toast.error("Los comentarios deben tener al menos 10 caracteres");
      return;
    }

    setActionLoading(documento.id);
    try {
      await aprobacionesService.rechazar(documento.id, comentarios);
      toast.success(`Documento "${documento.nombreArchivo}" rechazado`);
      await fetchAprobacionesPendientes();
      closeDialog();
    } catch (error) {
      toast.error("Error al rechazar el documento");
    } finally {
      setActionLoading(null);
    }
  };

  const handleVer = (documento: Documento) => {
    toast.info(`Vista previa del documento: ${documento.nombreArchivo}`);
  };

  const documentosFiltrados = documentos.filter(doc => {
    if (filtro === "todos") return true;
    return doc.prioridad.toLowerCase() === filtro.toLowerCase();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7FA]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
          <p className="mt-4 text-lg font-medium text-[#6B7280]">Cargando aprobaciones pendientes...</p>
        </div>
      </div>
    );
  }

  const urgentes = documentos.filter(d => d.prioridad === "Urgente").length;
  const altas = documentos.filter(d => d.prioridad === "Alta").length;
  const medias = documentos.filter(d => d.prioridad === "Media").length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Profesional */}
        <div className="bg-[#E0EDFF] rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E3A8A] flex items-center gap-3">
                <FileCheck className="h-9 w-9 text-[#2563EB]" />
                Aprobaciones Pendientes
              </h1>
              <p className="text-[#6B7280] mt-2 text-lg">
                {total} documento{total !== 1 ? "s" : ""} pendiente{total !== 1 ? "s" : ""} de aprobación
              </p>
            </div>
            <Button
              variant="outline"
              onClick={fetchAprobacionesPendientes}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-5 w-5 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-[#E0EDFF] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Total Pendientes</CardTitle>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{total}</div>
              <p className="text-[#6B7280] text-sm mt-1">Requieren revisión</p>
            </CardHeader>
          </Card>

          <Card className="bg-[#FEF2F2] border border-[#EF4444] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Urgente</CardTitle>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{urgentes}</div>
              <p className="text-[#6B7280] text-sm mt-1">Más de 7 días</p>
            </CardHeader>
          </Card>

          <Card className="bg-[#FFF7ED] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Alta</CardTitle>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{altas}</div>
              <p className="text-[#6B7280] text-sm mt-1">3-7 días</p>
            </CardHeader>
          </Card>

          <Card className="bg-[#FEFCE8] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Media</CardTitle>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{medias}</div>
              <p className="text-[#6B7280] text-sm mt-1">Menos de 3 días</p>
            </CardHeader>
          </Card>
        </div>

        {/* Información del proceso */}
        <Card className="shadow-sm">
          <CardHeader className="bg-[#F1F5F9]">
            <CardTitle className="text-xl text-[#1E3A8A]">Proceso de Aprobación</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="bg-[#ECFDF5] rounded-xl p-6 border border-[#E5E7EB]">
              <CheckCircle className="h-10 w-10 text-[#22C55E] mb-4" />
              <h3 className="font-semibold text-[#1E3A8A] mb-2">Aprobar</h3>
              <p className="text-[#6B7280]">El documento cumple con los requisitos y será publicado</p>
            </div>
            <div className="bg-[#FEF2F2] rounded-xl p-6 border border-[#E5E7EB]">
              <X className="h-10 w-10 text-[#EF4444] mb-4" />
              <h3 className="font-semibold text-[#1E3A8A] mb-2">Rechazar</h3>
              <p className="text-[#6B7280]">Requiere correcciones. Se devuelve a borrador</p>
            </div>
            <div className="bg-[#EFF6FF] rounded-xl p-6 border border-[#E5E7EB]">
              <Eye className="h-10 w-10 text-[#2563EB] mb-4" />
              <h3 className="font-semibold text-[#1E3A8A] mb-2">Revisar</h3>
              <p className="text-[#6B7280]">Visualizar contenido antes de decidir</p>
            </div>
          </CardContent>
        </Card>

        {/* Filtros por prioridad */}
        <Card className="shadow-sm">
          <CardHeader className="bg-[#F1F5F9]">
            <CardTitle className="text-xl text-[#1E3A8A]">Filtrar por Prioridad</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              {["todos", "urgente", "alta", "media"].map((f) => (
                <Button
                  key={f}
                  variant={filtro === f ? "default" : "outline"}
                  onClick={() => setFiltro(f)}
                  className={filtro === f ? "bg-[#2563EB] hover:bg-[#1D4ED8]" : ""}
                >
                  {f === "todos" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
                  {f !== "todos" && (
                    <Badge className="ml-2 bg-white text-[#2563EB]">
                      {f === "urgente" ? urgentes : f === "alta" ? altas : medias}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabla de documentos pendientes */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-[#F1F5F9]">
            <CardTitle className="text-2xl text-[#1E3A8A]">Documentos Pendientes de Aprobación</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F1F5F9] border-b border-[#E5E7EB]">
                <tr>
                  <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Código</th>
                  <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Nombre</th>
                  <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Tipo</th>
                  <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Versión</th>
                  <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Prioridad</th>
                  <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Fecha Solicitud</th>
                  <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Solicitado Por</th>
                  <th className="text-right p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider pr-10">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E5E7EB]">
                {documentosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-[#6B7280]">
                      <CheckCircle className="mx-auto h-16 w-16 text-[#22C55E] mb-4" />
                      <p className="text-lg font-medium">
                        ¡No hay documentos pendientes!
                      </p>
                      <p className="mt-2">
                        {filtro !== "todos" ? `No hay documentos con prioridad "${filtro}"` : "Todos los documentos han sido aprobados"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  documentosFiltrados.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#EFF6FF] transition-colors">
                      <td className="p-6">
                        <span className="font-mono font-medium text-[#2563EB]">{doc.codigo}</span>
                      </td>
                      <td className="p-6">
                        <div className="max-w-xs">
                          <p className="font-medium text-gray-900 truncate">{doc.nombreArchivo}</p>
                          <p className="text-sm text-[#6B7280] mt-1">Pendiente de aprobación</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <Badge className="bg-[#E0EDFF] text-[#2563EB]">{doc.tipo}</Badge>
                      </td>
                      <td className="p-6">
                        <span className="font-mono bg-gray-100 px-3 py-1 rounded">v{doc.version}</span>
                      </td>
                      <td className="p-6">
                        <Badge className={
                          doc.prioridad === "Urgente" ? "bg-[#FEF2F2] text-[#EF4444]" :
                          doc.prioridad === "Alta" ? "bg-[#FFF7ED] text-[#F59E0B]" :
                          "bg-[#FEFCE8] text-[#CA8A04]"
                        }>
                          {doc.prioridad === "Urgente" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {doc.prioridad === "Alta" && <Clock className="h-3 w-3 mr-1" />}
                          {doc.prioridad}
                        </Badge>
                      </td>
                      <td className="p-6 text-[#6B7280]">
                        {new Date(doc.fechaSolicitud).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="p-6 text-[#6B7280]">{doc.solicitadoPor}</td>
                      <td className="p-6">
                        <div className="flex items-center justify-end gap-3">
                          <Button size="sm" variant="ghost" onClick={() => handleVer(doc)}>
                            <Eye className="h-4 w-4 text-[#2563EB]" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#22C55E] hover:bg-green-700 text-white"
                            onClick={() => openDialog('aprobar', doc)}
                            disabled={actionLoading === doc.id}
                          >
                            {actionLoading === doc.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#EF4444] hover:bg-red-700 text-white"
                            onClick={() => openDialog('rechazar', doc)}
                            disabled={actionLoading === doc.id}
                          >
                            {actionLoading === doc.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Diálogo de confirmación */}
        <AlertDialog open={dialogState.open} onOpenChange={closeDialog}>
          <AlertDialogContent className="sm:max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl text-[#1E3A8A]">
                {dialogState.type === 'aprobar' ? "Aprobar Documento" : "Rechazar Documento"}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="space-y-6">
              {dialogState.documento && (
                <>
                  <div className="bg-[#F1F5F9] rounded-xl p-6">
                    <p className="font-semibold text-lg text-gray-900">{dialogState.documento.nombreArchivo}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-[#6B7280]">Código</p>
                        <p className="font-mono font-medium">{dialogState.documento.codigo}</p>
                      </div>
                      <div>
                        <p className="text-[#6B7280]">Versión</p>
                        <p className="font-medium">v{dialogState.documento.version}</p>
                      </div>
                      <div>
                        <p className="text-[#6B7280]">Prioridad</p>
                        <p className="font-medium">{dialogState.documento.prioridad}</p>
                      </div>
                      <div>
                        <p className="text-[#6B7280]">Solicitado por</p>
                        <p className="font-medium">{dialogState.documento.solicitadoPor}</p>
                      </div>
                    </div>
                  </div>

                  {dialogState.type === 'rechazar' && (
                    <div className="space-y-3">
                      <label className="font-medium text-[#1E3A8A]">
                        Motivo del rechazo <span className="text-[#EF4444]">*</span>
                      </label>
                      <Textarea
                        placeholder="Explica detalladamente las correcciones necesarias (mínimo 10 caracteres)..."
                        value={comentarios}
                        onChange={(e) => setComentarios(e.target.value)}
                        className="min-h-32"
                        disabled={actionLoading !== null}
                      />
                      <p className={`text-sm ${comentarios.length < 10 ? "text-[#EF4444]" : "text-[#6B7280]"}`}>
                        {comentarios.length} / 10 caracteres mínimo
                      </p>
                    </div>
                  )}

                  <div className={dialogState.type === 'aprobar' ? "bg-[#ECFDF5] border border-[#22C55E]" : "bg-[#FEF2F2] border border-[#EF4444]"} 
                       className="rounded-xl p-4">
                    <p className="font-medium">
                      {dialogState.type === 'aprobar'
                        ? "El documento será marcado como APROBADO y estará disponible para todos los usuarios."
                        : "El documento volverá a estado BORRADOR y el solicitante deberá realizar las correcciones indicadas."}
                    </p>
                  </div>
                </>
              )}
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={actionLoading !== null}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={dialogState.type === 'aprobar' ? handleAprobar : handleRechazar}
                disabled={actionLoading !== null || (dialogState.type === 'rechazar' && comentarios.length < 10)}
                className={dialogState.type === 'aprobar' ? "bg-[#22C55E] hover:bg-green-700" : "bg-[#EF4444] hover:bg-red-700"}
              >
                {actionLoading !== null ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {dialogState.type === 'aprobar' ? "Aprobar Documento" : "Rechazar Documento"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}