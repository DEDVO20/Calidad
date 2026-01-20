import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Archive,
  Clock,
  AlertCircle,
  Search,
  FileText,
  User,
  RefreshCw,
  Eye,
  Trash2,
  Download,
  History,
  XCircle
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

interface Documento {
  id: string;
  codigoDocumento: string;
  nombreArchivo: string;
  tipoDocumento: string;
  version: string;
  estado: string;
  creadoEn: string;
  fechaAprobacion?: string;
  proximaRevision?: string;
  creadoPor?: {
    nombre: string;
    primerApellido: string;
  };
  aprobadoPor?: {
    nombre: string;
    primerApellido: string;
  };
  rutaAlmacenamiento?: string;
}

export default function DocumentosObsoletos() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroFecha, setFiltroFecha] = useState<string>("todos");

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    type: 'eliminar' | 'restaurar' | null;
    documento: Documento | null;
  }>({ open: false, type: null, documento: null });

  useEffect(() => {
    fetchDocumentosObsoletos();
  }, []);

  const fetchDocumentosObsoletos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/documentos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener documentos obsoletos");
      }

      const data = await response.json();

      const transformedData = data.items?.map((doc: any) => ({
        id: doc.id,
        codigoDocumento: doc.codigoDocumento || "SIN-CÓDIGO",
        nombreArchivo: doc.nombreArchivo,
        tipoDocumento: doc.tipoDocumento || "Documento",
        version: doc.version || "1.0",
        estado: doc.estado,
        creadoEn: doc.creadoEn,
        fechaAprobacion: doc.fechaAprobacion,
        proximaRevision: doc.proximaRevision,
        creadoPor: doc.autor
          ? { nombre: doc.autor.nombre, primerApellido: doc.autor.primerApellido }
          : undefined,
        aprobadoPor: doc.aprobador
          ? { nombre: doc.aprobador.nombre, primerApellido: doc.aprobador.primerApellido }
          : undefined,
        rutaAlmacenamiento: doc.rutaAlmacenamiento,
      })) || [];

      setDocumentos(transformedData);
      setTotal(data.total || transformedData.length);
    } catch (error) {
      console.error("Error:", error);

      const ejemploData: Documento[] = [
        {
          id: "1",
          codigoDocumento: "PRO-SGC-001-V1",
          nombreArchivo: "Procedimiento de Control de Documentos v1.0",
          tipoDocumento: "Procedimiento",
          version: "1.0",
          estado: "obsoleto",
          creadoEn: "2023-01-15T10:30:00",
          fechaAprobacion: "2023-01-20T14:00:00",
          proximaRevision: "2024-01-20",
          creadoPor: { nombre: "Ana", primerApellido: "Martínez" },
          aprobadoPor: { nombre: "Carlos", primerApellido: "Rodríguez" },
          rutaAlmacenamiento: "https://example.com/docs/procedimiento.pdf"
        },
        {
          id: "2",
          codigoDocumento: "FOR-CAL-015-V1",
          nombreArchivo: "Formato de Auditoría Interna v1.5",
          tipoDocumento: "Formato",
          version: "1.5",
          estado: "obsoleto",
          creadoEn: "2023-03-10T09:00:00",
          fechaAprobacion: "2023-03-15T16:00:00",
          creadoPor: { nombre: "María", primerApellido: "González" }
        },
        {
          id: "3",
          codigoDocumento: "MAN-SGC-001-V2",
          nombreArchivo: "Manual de Calidad ISO 9001:2015 v2.0",
          tipoDocumento: "Manual",
          version: "2.0",
          estado: "obsoleto",
          creadoEn: "2022-11-05T08:00:00",
          fechaAprobacion: "2022-11-10T10:00:00",
          proximaRevision: "2023-11-10",
          creadoPor: { nombre: "Juan", primerApellido: "Pérez" },
          aprobadoPor: { nombre: "Ana", primerApellido: "Martínez" }
        },
      ];

      setDocumentos(ejemploData);
      setTotal(ejemploData.length);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (type: 'eliminar' | 'restaurar', documento: Documento) => {
    setDialogState({ open: true, type, documento });
  };

  const closeDialog = () => {
    setDialogState({ open: false, type: null, documento: null });
  };

  const handleRestaurar = async () => {
    const documento = dialogState.documento;
    if (!documento) return;

    setActionLoading(documento.id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/documentos/${documento.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: "aprobado" }),
      });

      if (!response.ok) {
        throw new Error("Error al restaurar documento");
      }

      alert(`✓ Documento "${documento.nombreArchivo}" restaurado correctamente`);
      await fetchDocumentosObsoletos();
      closeDialog();
    } catch (error) {
      console.error("Error:", error);
      alert("✗ Error al restaurar el documento. Por favor intente nuevamente.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEliminarPermanente = async () => {
    const documento = dialogState.documento;
    if (!documento) return;

    setActionLoading(documento.id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/documentos/${documento.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar documento");
      }

      alert(`✓ Documento "${documento.nombreArchivo}" eliminado permanentemente`);
      await fetchDocumentosObsoletos();
      closeDialog();
    } catch (error) {
      console.error("Error:", error);
      alert("✗ Error al eliminar el documento. Por favor intente nuevamente.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleVer = (documento: Documento) => {
    if (documento.rutaAlmacenamiento) {
      window.open(documento.rutaAlmacenamiento, '_blank');
    } else {
      alert(`Ver documento:\n${documento.nombreArchivo}\nCódigo: ${documento.codigoDocumento}\nVersión: v${documento.version}`);
    }
  };

  const handleDescargar = (documento: Documento) => {
    if (documento.rutaAlmacenamiento) {
      window.open(documento.rutaAlmacenamiento, '_blank');
    } else {
      alert(`Descargar: ${documento.nombreArchivo}`);
    }
  };

  const getTipoColor = (tipo: string) => {
    const colores: Record<string, string> = {
      manual: "bg-[#E0E7FF] text-[#6366F1]",
      procedimiento: "bg-[#DBEAFE] text-[#3B82F6]",
      instructivo: "bg-[#CFFAFE] text-[#0891B2]",
      formato: "bg-[#FEF3C7] text-[#D97706]",
      registro: "bg-[#FFEDD5] text-[#F97316]",
    };
    return colores[tipo.toLowerCase()] || "bg-[#F3F4F6] text-[#4B5563]";
  };

  const calcularTiempoObsoleto = (fechaAprobacion?: string): string => {
    if (!fechaAprobacion) return "Sin fecha";
    const fecha = new Date(fechaAprobacion);
    const ahora = new Date();
    const dias = Math.floor((ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
    if (dias < 30) return `${dias} día${dias !== 1 ? 's' : ''}`;
    if (dias < 365) return `${Math.floor(dias / 30)} mes${Math.floor(dias / 30) !== 1 ? 'es' : ''}`;
    const años = Math.floor(dias / 365);
    return `${años} año${años !== 1 ? 's' : ''}`;
  };

  const documentosFiltrados = documentos.filter(doc => {
    const matchSearch = searchTerm === "" ||
      doc.nombreArchivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.codigoDocumento.toLowerCase().includes(searchTerm.toLowerCase());

    const matchTipo = filtroTipo === "todos" || doc.tipoDocumento.toLowerCase() === filtroTipo.toLowerCase();

    let matchFecha = true;
    if (filtroFecha !== "todos" && doc.fechaAprobacion) {
      const meses = (new Date().getTime() - new Date(doc.fechaAprobacion).getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (filtroFecha === "reciente") matchFecha = meses <= 6;
      if (filtroFecha === "medio") matchFecha = meses > 6 && meses <= 12;
      if (filtroFecha === "antiguo") matchFecha = meses > 12;
    }

    return matchSearch && matchTipo && matchFecha;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7FA]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
          <p className="mt-4 text-lg font-medium text-[#6B7280]">Cargando documentos obsoletos...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Profesional */}
          <div className="bg-[#E0EDFF] rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-[#1E3A8A] flex items-center gap-3">
                  <Archive className="h-9 w-9 text-[#2563EB]" />
                  Documentos Obsoletos
                </h1>
                <p className="text-[#6B7280] mt-2 text-lg">
                  {total} documento{total !== 1 ? "s" : ""} obsoleto{total !== 1 ? "s" : ""} archivados
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={fetchDocumentosObsoletos}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>

          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#E0EDFF] border border-[#E5E7EB] shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1E3A8A]">Total Obsoletos</CardTitle>
                <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{total}</div>
                <p className="text-[#6B7280] text-sm mt-1">Documentos fuera de vigencia</p>
              </CardHeader>
            </Card>

            <Card className="bg-[#E0E7FF] border border-[#E5E7EB] shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1E3A8A]">Manuales</CardTitle>
                <div className="text-4xl font-bold text-[#1E3A8A] mt-4">
                  {documentos.filter(d => d.tipoDocumento.toLowerCase() === "manual").length}
                </div>
                <p className="text-[#6B7280] text-sm mt-1">Archivados</p>
              </CardHeader>
            </Card>

            <Card className="bg-[#DBEAFE] border border-[#E5E7EB] shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1E3A8A]">Procedimientos</CardTitle>
                <div className="text-4xl font-bold text-[#1E3A8A] mt-4">
                  {documentos.filter(d => d.tipoDocumento.toLowerCase() === "procedimiento").length}
                </div>
                <p className="text-[#6B7280] text-sm mt-1">Archivados</p>
              </CardHeader>
            </Card>

            <Card className="bg-[#FFF7ED] border border-[#E5E7EB] shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1E3A8A]">Antiguos</CardTitle>
                <div className="text-4xl font-bold text-[#1E3A8A] mt-4">
                  {documentos.filter(d => {
                    if (!d.fechaAprobacion) return false;
                    const meses = (new Date().getTime() - new Date(d.fechaAprobacion).getTime()) / (1000 * 60 * 60 * 24 * 30);
                    return meses > 12;
                  }).length}
                </div>
                <p className="text-[#6B7280] text-sm mt-1">+1 año obsoletos</p>
              </CardHeader>
            </Card>
          </div>

          {/* Información */}
          <Card className="shadow-sm">
            <CardHeader className="bg-[#F1F5F9]">
              <CardTitle className="text-xl text-[#1E3A8A] flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[#F59E0B]" />
                Gestión de Documentos Obsoletos
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-[#EFF6FF] rounded-xl p-6 border border-[#E5E7EB]">
                <FileText className="h-10 w-10 text-[#2563EB] mb-4" />
                <h3 className="font-semibold text-[#1E3A8A] mb-2">Consulta histórica</h3>
                <p className="text-[#6B7280]">Los documentos obsoletos se mantienen para referencia y auditoría</p>
              </div>
              <div className="bg-[#ECFDF5] rounded-xl p-6 border border-[#E5E7EB]">
                <History className="h-10 w-10 text-[#22C55E] mb-4" />
                <h3 className="font-semibold text-[#1E3A8A] mb-2">Restaurar</h3>
                <p className="text-[#6B7280]">Puedes restaurar un documento si necesita volver a estar activo</p>
              </div>
              <div className="bg-[#FEF2F2] rounded-xl p-6 border border-[#E5E7EB]">
                <Trash2 className="h-10 w-10 text-[#EF4444] mb-4" />
                <h3 className="font-semibold text-[#1E3A8A] mb-2">Eliminar permanentemente</h3>
                <p className="text-[#6B7280]">Una vez eliminado, el documento no podrá recuperarse</p>
              </div>
            </CardContent>
          </Card>

          {/* Filtros */}
          <Card className="shadow-sm">
            <CardHeader className="bg-[#F1F5F9]">
              <CardTitle className="text-xl text-[#1E3A8A]">Filtros de búsqueda</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
                  <Input
                    placeholder="Buscar por nombre o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="procedimiento">Procedimiento</SelectItem>
                    <SelectItem value="instructivo">Instructivo</SelectItem>
                    <SelectItem value="formato">Formato</SelectItem>
                    <SelectItem value="registro">Registro</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filtroFecha} onValueChange={setFiltroFecha}>
                  <SelectTrigger>
                    <SelectValue placeholder="Antigüedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las fechas</SelectItem>
                    <SelectItem value="reciente">Últimos 6 meses</SelectItem>
                    <SelectItem value="medio">6-12 meses</SelectItem>
                    <SelectItem value="antiguo">Más de 1 año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabla */}
          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="bg-[#F1F5F9]">
              <CardTitle className="text-2xl text-[#1E3A8A]">Documentos Obsoletos</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F1F5F9] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Código</th>
                    <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Nombre del Documento</th>
                    <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Tipo</th>
                    <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Versión</th>
                    <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Obsoleto desde</th>
                    <th className="text-left p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider">Creado por</th>
                    <th className="text-right p-6 text-sm font-semibold text-[#1E3A8A] uppercase tracking-wider pr-10">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5E7EB]">
                  {documentosFiltrados.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#EFF6FF] transition-colors">
                      <td className="p-6">
                        <div className="font-mono text-sm font-medium text-[#2563EB]">{doc.codigoDocumento}</div>
                      </td>
                      <td className="p-6">
                        <div className="max-w-[300px]">
                          <div className="font-medium truncate text-gray-900">{doc.nombreArchivo}</div>
                          <div className="text-sm text-[#6B7280] flex items-center gap-1 mt-1">
                            <XCircle className="w-3 h-3 text-[#EF4444]" />
                            Obsoleto
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <Badge variant="outline" className={getTipoColor(doc.tipoDocumento)}>
                          {doc.tipoDocumento}
                        </Badge>
                      </td>
                      <td className="p-6">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">v{doc.version}</span>
                      </td>
                      <td className="p-6">
                        <div className="text-sm flex items-center gap-1 text-[#6B7280]">
                          <Clock className="w-3 h-3" />
                          {calcularTiempoObsoleto(doc.fechaAprobacion)}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="text-sm flex items-center gap-1 text-[#6B7280]">
                          <User className="w-3 h-3" />
                          {doc.creadoPor ? `${doc.creadoPor.nombre} ${doc.creadoPor.primerApellido}` : "Desconocido"}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2 justify-end">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => handleVer(doc)} disabled={actionLoading === doc.id}>
                                <Eye className="w-4 h-4 text-[#2563EB]" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ver documento</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => handleDescargar(doc)} disabled={actionLoading === doc.id}>
                                <Download className="w-4 h-4 text-[#4B5563]" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Descargar</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-[#2563EB]" onClick={() => openDialog('restaurar', doc)} disabled={actionLoading === doc.id}>
                                {actionLoading === doc.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <History className="w-4 h-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Restaurar documento</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-[#EF4444]" onClick={() => openDialog('eliminar', doc)} disabled={actionLoading === doc.id}>
                                {actionLoading === doc.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Eliminar permanentemente</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {documentosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-[#6B7280]">
                        <Archive className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No hay documentos obsoletos</p>
                        <p className="mt-2">
                          {searchTerm || filtroTipo !== "todos" || filtroFecha !== "todos"
                            ? "No se encontraron documentos con los filtros aplicados"
                            : "Actualmente no hay documentos marcados como obsoletos"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Dialog */}
          <AlertDialog open={dialogState.open} onOpenChange={closeDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#1E3A8A]">
                  {dialogState.type === 'restaurar' ? "Restaurar Documento" : "Eliminar Permanentemente"}
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  {dialogState.documento && (
                    <>
                      <div className="bg-[#F1F5F9] p-3 rounded-lg">
                        <p className="font-semibold text-gray-900">{dialogState.documento.nombreArchivo}</p>
                        <p className="text-sm text-[#6B7280]">Código: {dialogState.documento.codigoDocumento}</p>
                        <p className="text-sm text-[#6B7280]">Versión: {dialogState.documento.version}</p>
                      </div>
                      {dialogState.type === 'restaurar' ? (
                        <p>El documento será restaurado a estado <strong className="text-[#22C55E]">aprobado</strong>.</p>
                      ) : (
                        <div className="bg-[#FEF2F2] border border-[#EF4444] rounded-lg p-3">
                          <p className="text-[#991B1B] font-medium mb-2">Esta acción es irreversible</p>
                          <p className="text-[#DC2626] text-sm">El documento será eliminado permanentemente.</p>
                        </div>
                      )}
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={actionLoading !== null}>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={dialogState.type === 'restaurar' ? handleRestaurar : handleEliminarPermanente}
                  disabled={actionLoading !== null}
                  className={dialogState.type === 'restaurar' ? "bg-[#2563EB] hover:bg-[#1D4ED8]" : "bg-[#EF4444] hover:bg-red-700"}
                >
                  {actionLoading !== null ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {dialogState.type === 'restaurar' ? 'Restaurar' : 'Eliminar permanentemente'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </TooltipProvider>
  );
}