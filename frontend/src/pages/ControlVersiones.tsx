// src/pages/ControlVersiones.tsx
import React, { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Eye, Layers, Clock, Download, FileText, Calendar } from "lucide-react";
import { documentoService } from "@/services/documento.service";
import { versionDocumentoService, VersionDocumentoData } from "@/services/versionDocumento.service";
import { toast } from "sonner";

type Documento = {
  id: string;
  nombreArchivo: string;
  codigoDocumento: string;
  version: string;
  estado: string;
  tipoDocumento: string;
  creadoEn: string;
  actualizadoEn: string;
  rutaAlmacenamiento?: string;
  versiones?: VersionDocumentoData[];
};

export default function ControlVersiones() {
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingVersions, setLoadingVersions] = useState(false);

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        setLoading(true);
        const response = await documentoService.getAll();
        setDocumentos(response.items as Documento[]);
      } catch (error) {
        console.error("Error al cargar documentos:", error);
        toast.error("Error al cargar documentos");
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentos();
  }, []);

  useEffect(() => {
    const fetchVersions = async () => {
      if (selectedDoc?.id) {
        try {
          setLoadingVersions(true);
          const versiones = await versionDocumentoService.getByDocumento(selectedDoc.id);
          setSelectedDoc((prev) => (prev ? { ...prev, versiones } : null));
        } catch (error) {
          console.error("Error al cargar versiones:", error);
          toast.error("Error al cargar versiones");
        } finally {
          setLoadingVersions(false);
        }
      }
    };
    fetchVersions();
  }, [selectedDoc?.id]);

  const filtrados = useMemo(() => {
    return documentos.filter((doc) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        doc.nombreArchivo.toLowerCase().includes(term) ||
        doc.codigoDocumento?.toLowerCase().includes(term);
      const matchesDate = !filterDate || doc.actualizadoEn.startsWith(filterDate);
      return matchesSearch && matchesDate;
    });
  }, [documentos, search, filterDate]);

  const totalDocumentos = documentos.length;
  const totalVersiones = documentos.reduce((acc, doc) => acc + (doc.versiones?.length || 1), 0);

  const ultimoDocumento = documentos.reduce(
    (last, cur) => (new Date(cur.actualizadoEn) > new Date(last?.actualizadoEn || "0") ? cur : last),
    documentos[0]
  );

  const openDoc = (doc: Documento) => setSelectedDoc(doc);

  const handleDownload = async (versionId: string) => {
    try {
      await versionDocumentoService.download(versionId);
      toast.success("Descarga iniciada");
    } catch (error) {
      toast.error("Error al descargar archivo");
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "aprobado": return "text-[#22C55E] bg-[#ECFDF5]";
      case "en_revision": return "text-[#F59E0B] bg-[#FFF7ED]";
      case "pendiente_aprobacion": return "text-[#F59E0B] bg-[#FFF7ED]";
      default: return "text-[#6B7280] bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7FA]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
          <p className="mt-4 text-lg font-medium text-[#6B7280]">Cargando control de versiones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Profesional */}
        <div className="bg-[#E0EDFF] rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E3A8A] flex items-center gap-3">
                <Layers className="h-9 w-9 text-[#2563EB]" />
                Control de Versiones
              </h1>
              <p className="text-[#6B7280] mt-2 text-lg">
                Visualiza el historial completo de versiones de cada documento del sistema ISO 9001
              </p>
            </div>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-[#E0EDFF] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Total Documentos</CardTitle>
                <FileText className="h-8 w-8 text-[#2563EB]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{totalDocumentos}</div>
              <p className="text-[#6B7280] text-sm mt-1">Documentos registrados</p>
            </CardHeader>
          </Card>

          <Card className="bg-[#ECFDF5] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Total Versiones</CardTitle>
                <Layers className="h-8 w-8 text-[#22C55E]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{totalVersiones}</div>
              <p className="text-[#6B7280] text-sm mt-1">Historial completo</p>
            </CardHeader>
          </Card>

          <Card className="bg-[#FFF7ED] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Última Actualización</CardTitle>
                <Clock className="h-8 w-8 text-[#F59E0B]" />
              </div>
              <div className="text-lg font-medium text-[#1E3A8A] mt-4 truncate">
                {ultimoDocumento?.nombreArchivo || "Sin documentos"}
              </div>
              <p className="text-[#6B7280] text-sm mt-1">
                {ultimoDocumento
                  ? new Date(ultimoDocumento.actualizadoEn).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </p>
            </CardHeader>
          </Card>
        </div>

        {/* Búsqueda y filtros */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
              <Input
                placeholder="Buscar por nombre o código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Filtrar por fecha
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                  <Button variant="outline" onClick={() => setFilterDate("")} className="w-full">
                    Limpiar filtro
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Tabla de documentos */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
          <div className="bg-[#F1F5F9] px-6 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-xl font-semibold text-[#1E3A8A]">Lista de Documentos</h2>
          </div>
          <Table>
            <TableHeader className="bg-[#F1F5F9]">
              <TableRow>
                <TableHead className="text-[#1E3A8A]">Nombre</TableHead>
                <TableHead className="text-[#1E3A8A]">Código</TableHead>
                <TableHead className="text-[#1E3A8A]">Versión Actual</TableHead>
                <TableHead className="text-[#1E3A8A]">Estado</TableHead>
                <TableHead className="text-[#1E3A8A]">Última Actualización</TableHead>
                <TableHead className="text-[#1E3A8A] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-[#6B7280]">
                    <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    No se encontraron documentos
                  </TableCell>
                </TableRow>
              ) : (
                filtrados.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-[#EFF6FF] transition-colors">
                    <TableCell className="font-medium">{doc.nombreArchivo}</TableCell>
                    <TableCell className="text-[#6B7280]">{doc.codigoDocumento || "-"}</TableCell>
                    <TableCell>{doc.version || "1.0"}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(doc.estado)}`}>
                        {doc.estado.replace("_", " ").charAt(0).toUpperCase() + doc.estado.replace("_", " ").slice(1).toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#6B7280]">
                      {new Date(doc.actualizadoEn).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={() => openDoc(doc)}>
                            <Eye className="h-4 w-4 text-[#2563EB]" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl text-[#1E3A8A] flex items-center gap-3">
                              <Layers className="h-7 w-7 text-[#2563EB]" />
                              Historial de Versiones - {selectedDoc?.nombreArchivo}
                            </DialogTitle>
                          </DialogHeader>

                          <div className="space-y-6 py-4">
                            {/* Información básica */}
                            <div className="bg-[#F1F5F9] rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <p className="text-sm text-[#6B7280]">Código del Documento</p>
                                <p className="font-mono font-semibold text-gray-900">{selectedDoc?.codigoDocumento || "-"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-[#6B7280]">Versión Actual</p>
                                <p className="font-semibold text-gray-900">{selectedDoc?.version || "1.0"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-[#6B7280]">Estado</p>
                                <p className={`font-semibold ${getEstadoColor(selectedDoc?.estado || "")}`}>
                                  {selectedDoc?.estado.replace("_", " ").charAt(0).toUpperCase() + selectedDoc?.estado.replace("_", " ").slice(1).toLowerCase()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-[#6B7280]">Última Actualización</p>
                                <p className="font-semibold text-gray-900">
                                  {selectedDoc && new Date(selectedDoc.actualizadoEn).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}
                                </p>
                              </div>
                            </div>

                            {/* Historial de versiones */}
                            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                              <div className="px-6 py-4 bg-[#F1F5F9] border-b border-[#E5E7EB]">
                                <h3 className="font-semibold text-[#1E3A8A] flex items-center gap-2">
                                  <Clock className="h-5 w-5" />
                                  Historial Completo de Versiones
                                </h3>
                              </div>
                              <div className="p-6">
                                {loadingVersions ? (
                                  <div className="flex justify-center py-12">
                                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
                                  </div>
                                ) : selectedDoc?.versiones && selectedDoc.versiones.length > 0 ? (
                                  <div className="space-y-4">
                                    {selectedDoc.versiones.map((v) => (
                                      <div key={v.id} className="border border-[#E5E7EB] rounded-lg p-4 hover:bg-[#EFF6FF] transition-colors">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="font-semibold text-lg">Versión {v.versionString}</p>
                                            <p className="text-sm text-[#6B7280] mt-1">
                                              Subida el {new Date(v.subidoEn).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                            {v.cambios && (
                                              <p className="text-sm text-[#6B7280] mt-2 italic">"{v.cambios}"</p>
                                            )}
                                          </div>
                                          <Button size="sm" variant="outline" onClick={() => handleDownload(v.id)}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Descargar
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-center py-12 text-[#6B7280]">
                                    No hay historial de versiones disponible para este documento
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}