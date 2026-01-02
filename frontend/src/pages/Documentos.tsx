import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { documentoService } from "@/services/documento.service";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Documento {
  id: string;
  nombreArchivo: string;
  tipoDocumento: string;
  codigoDocumento: string;
  version: string;
  estado: string;
  visibilidad: string;
  creadoEn: string;
  actualizadoEn: string;
}

export default function Documentos() {
  const navigate = useNavigate();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = async () => {
    try {
      setLoading(true);
      const data = await documentoService.getAll();
      setDocumentos(data.items || []);
    } catch (error) {
      console.error("Error al cargar documentos:", error);
      toast.error("Error al cargar documentos");
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { bg: string; text: string; icon: React.ReactElement }> = {
      borrador: { bg: "bg-gray-100", text: "text-gray-700", icon: <Clock className="h-3 w-3" /> },
      en_revision: { bg: "bg-[#FFF7ED]", text: "text-[#F59E0B]", icon: <AlertCircle className="h-3 w-3" /> },
      pendiente_aprobacion: { bg: "bg-[#FFF7ED]", text: "text-[#F59E0B]", icon: <Clock className="h-3 w-3" /> },
      aprobado: { bg: "bg-[#ECFDF5]", text: "text-[#22C55E]", icon: <CheckCircle className="h-3 w-3" /> },
      obsoleto: { bg: "bg-[#FEF2F2]", text: "text-[#EF4444]", icon: <XCircle className="h-3 w-3" /> },
    };

    const badge = estados[estado] || estados.borrador;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-[#E5E7EB] ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {estado.replace("_", " ").charAt(0).toUpperCase() + estado.replace("_", " ").slice(1).toLowerCase()}
      </span>
    );
  };

  const getTipoBadge = (tipo: string) => {
    const tipos: Record<string, { bg: string; text: string }> = {
      formato: { bg: "bg-[#E0EDFF]", text: "text-[#2563EB]" },
      procedimiento: { bg: "bg-[#DBEAFE]", text: "text-[#3B82F6]" },
      instructivo: { bg: "bg-[#CFFAFE]", text: "text-[#0891B2]" },
      manual: { bg: "bg-[#E0E7FF]", text: "text-[#6366F1]" },
      politica: { bg: "bg-[#FCE7F3]", text: "text-[#EC4899]" },
      registro: { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
      plan: { bg: "bg-[#FFEDD5]", text: "text-[#F97316]" },
    };

    const badge = tipos[tipo] || { bg: "bg-gray-100", text: "text-gray-700" };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-[#E5E7EB] ${badge.bg} ${badge.text}`}>
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </span>
    );
  };

  const filteredDocumentos = documentos.filter((doc) => {
    const matchSearch =
      doc.nombreArchivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.codigoDocumento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filterTipo === "" || doc.tipoDocumento === filterTipo;
    const matchEstado = filterEstado === "" || doc.estado === filterEstado;

    return matchSearch && matchTipo && matchEstado;
  });

  const handleView = (id: string) => navigate(`/documentos/${id}`);
  const handleEdit = (id: string) => navigate(`/documentos/${id}/editar`);

  const handleDelete = async (docId: string, nombreDocumento: string) => {
    toast.warning(
      <div>
        <p className="font-semibold">¿Eliminar documento?</p>
        <p className="text-sm mt-1">Se eliminará permanentemente "{nombreDocumento}"</p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={async () => {
              try {
                await documentoService.delete(docId);
                toast.success("Documento eliminado correctamente");
                fetchDocumentos();
              } catch (error) {
                toast.error("Error al eliminar documento");
              }
            }}
            className="px-4 py-2 bg-[#EF4444] text-white rounded-md text-sm hover:bg-red-700"
          >
            Eliminar
          </button>
          <button onClick={() => toast.dismiss()} className="px-4 py-2 bg-gray-200 rounded-md text-sm">
            Cancelar
          </button>
        </div>
      </div>,
      { duration: 10000 }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7FA]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
          <p className="mt-4 text-lg font-medium text-[#6B7280]">Cargando documentos...</p>
        </div>
      </div>
    );
  }

  const totalAprobados = documentos.filter(d => d.estado === "aprobado").length;
  const totalEnProceso = documentos.filter(d => ["en_revision", "pendiente_aprobacion"].includes(d.estado)).length;
  const totalBorradores = documentos.filter(d => d.estado === "borrador").length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Profesional */}
        <div className="bg-[#E0EDFF] rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E3A8A] flex items-center gap-3">
                <FileText className="h-9 w-9 text-[#2563EB]" />
                Gestión Documental
              </h1>
              <p className="text-[#6B7280] mt-2 text-lg">
                Administra todos los documentos del sistema de gestión de calidad ISO 9001
              </p>
            </div>
            <Button
              onClick={() => navigate("/documentos/crear")}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm"
            >
              <Plus className="mr-2 h-5 w-5" />
              Nuevo Documento
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
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
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="">Todos los tipos</option>
              <option value="formato">Formato</option>
              <option value="procedimiento">Procedimiento</option>
              <option value="instructivo">Instructivo</option>
              <option value="manual">Manual</option>
              <option value="politica">Política</option>
              <option value="registro">Registro</option>
              <option value="plan">Plan</option>
            </select>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="">Todos los estados</option>
              <option value="borrador">Borrador</option>
              <option value="en_revision">En Revisión</option>
              <option value="pendiente_aprobacion">Pendiente Aprobación</option>
              <option value="aprobado">Aprobado</option>
              <option value="obsoleto">Obsoleto</option>
            </select>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-[#E0EDFF] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Total Documentos</CardTitle>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{documentos.length}</div>
            </CardHeader>
          </Card>
          <Card className="bg-[#ECFDF5] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Aprobados</CardTitle>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{totalAprobados}</div>
            </CardHeader>
          </Card>
          <Card className="bg-[#FFF7ED] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">En Proceso</CardTitle>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{totalEnProceso}</div>
            </CardHeader>
          </Card>
          <Card className="bg-gray-100 border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#1E3A8A]">Borradores</CardTitle>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{totalBorradores}</div>
            </CardHeader>
          </Card>
        </div>

        {/* Grid de Documentos */}
        {filteredDocumentos.length === 0 ? (
          <Card className="shadow-sm p-12 text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-[#6B7280]">
              {searchTerm || filterTipo || filterEstado
                ? "No se encontraron documentos con los filtros aplicados"
                : "Aún no hay documentos registrados"}
            </p>
            {(searchTerm || filterTipo || filterEstado) && (
              <Button variant="outline" onClick={() => { setSearchTerm(""); setFilterTipo(""); setFilterEstado(""); }} className="mt-4">
                Limpiar filtros
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocumentos.map((documento) => (
              <Card key={documento.id} className="shadow-sm hover:shadow-md transition-shadow border-[#E5E7EB]">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                        {documento.nombreArchivo}
                      </h3>
                      <p className="text-sm font-mono text-[#6B7280] mt-1">{documento.codigoDocumento}</p>
                    </div>
                    <FileText className="h-8 w-8 text-[#2563EB] opacity-70" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {getTipoBadge(documento.tipoDocumento)}
                    {getEstadoBadge(documento.estado)}
                  </div>

                  <div className="space-y-2 text-sm text-[#6B7280]">
                    <div className="flex justify-between">
                      <span>Versión</span>
                      <span className="font-medium text-gray-900">{documento.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visibilidad</span>
                      <span className="font-medium text-gray-900 capitalize">{documento.visibilidad}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Actualizado</span>
                      <span className="font-medium text-gray-900">
                        {new Date(documento.actualizadoEn).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                    <Button size="sm" variant="ghost" className="flex-1" onClick={() => handleView(documento.id)}>
                      <Eye className="mr-2 h-4 w-4 text-[#2563EB]" />
                      Ver
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(documento.id)}>
                      <Edit className="h-4 w-4 text-[#4B5563]" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(documento.id, documento.nombreArchivo)}>
                      <Trash2 className="h-4 w-4 text-[#EF4444]" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}