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
import { Search, Eye, Filter, FileText, Layers, Clock, Download } from "lucide-react";
import { documentoService } from "@/services/documento.service";
import { versionDocumentoService, VersionDocumentoData } from "@/services/versionDocumento.service";
import { toast } from "sonner";

/**
 * ControlVersiones (componente con datos reales)
 *
 * - Indicadores arriba (resumen)
 * - Buscador + botón Filtrar (por fecha)
 * - Tabla de documentos con versiones reales
 * - Modal "Ver" con: info básica + historial de versiones real
 */

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
  const [selectedVersion, setSelectedVersion] = useState<VersionDocumentoData | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingVersions, setLoadingVersions] = useState(false);

  // Cargar documentos desde el API
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

  // Cargar versiones cuando se selecciona un documento
  useEffect(() => {
    const fetchVersions = async () => {
      if (selectedDoc && selectedDoc.id) {
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

  // filtros
  const filtrados = useMemo(() => {
    return documentos.filter((doc) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        doc.nombreArchivo.toLowerCase().includes(term) ||
        doc.codigoDocumento?.toLowerCase().includes(term);
      const matchesDate = !filterDate || doc.creadoEn.startsWith(filterDate);
      return matchesSearch && matchesDate;
    });
  }, [documentos, search, filterDate]);

  // indicadores (usados en tarjetas superiores)
  const totalDocumentos = documentos.length;
  const totalVersiones = documentos.reduce((sum, doc) => {
    // Aproximación: cada documento tiene al menos 1 versión
    return sum + 1;
  }, 0);

  const ultimoDocumento = documentos.reduce(
    (last, cur) => (new Date(cur.actualizadoEn) > new Date(last.actualizadoEn) ? cur : last),
    documentos[0]
  );

  const openDoc = (doc: Documento) => {
    setSelectedDoc(doc);
    setSelectedVersion(null);
  };

  const handleDownload = async (versionId: string) => {
    try {
      await versionDocumentoService.download(versionId);
      toast.success("Descarga iniciada");
    } catch (error) {
      toast.error("Error al descargar archivo");
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Control de Versiones</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Control de Versiones</h1>

      {/* Tarjetas resumen con indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Documentos</p>
              <p className="text-2xl font-bold">{totalDocumentos}</p>
            </div>
            <FileText className="h-7 w-7 text-gray-500" />
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Versiones</p>
              <p className="text-2xl font-bold text-purple-600">{totalVersiones}</p>
            </div>
            <Layers className="h-7 w-7 text-purple-600" />
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Último Actualizado</p>
            <p className="text-base font-semibold truncate">
              {ultimoDocumento?.nombreArchivo || "-"}
            </p>
            <p className="text-xs text-gray-400">
              {ultimoDocumento?.actualizadoEn
                ? new Date(ultimoDocumento.actualizadoEn).toLocaleDateString("es-ES")
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Buscador + Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-2/3">
          <Input
            placeholder="Buscar por nombre o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Button variant="outline">
            <Search className="h-4 w-4 mr-1" /> Buscar
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filtrar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3">
              <label className="block text-sm text-gray-600 mb-1">Filtrar por fecha</label>
              <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              <div className="mt-3 flex gap-2">
                <Button variant="secondary" onClick={() => setFilterDate("")} className="w-full">
                  Limpiar
                </Button>
                <Button className="w-full">Aplicar</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Tabla principal */}
      <div className="bg-white rounded-lg shadow-md p-4 border">
        <h2 className="text-lg font-semibold mb-4">Lista de Documentos</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Versión</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.nombreArchivo}</TableCell>
                <TableCell>{doc.codigoDocumento || "-"}</TableCell>
                <TableCell>{doc.version || "1.0"}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${doc.estado === "aprobado"
                      ? "bg-green-100 text-green-800"
                      : doc.estado === "en_revision"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {doc.estado}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(doc.actualizadoEn).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell className="text-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => openDoc(doc)}
                        className="bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500"
                      >
                        <Eye className="h-4 w-4 mr-1" /> Ver
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Detalles del Documento y Versiones</DialogTitle>
                      </DialogHeader>

                      <div className="mt-4 space-y-4">
                        {/* Info básica */}
                        <div className="bg-gray-50 border rounded-lg p-4 grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-gray-500">Nombre</p>
                            <p className="font-semibold">{selectedDoc?.nombreArchivo}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Código</p>
                            <p className="font-semibold">{selectedDoc?.codigoDocumento || "-"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Versión Actual</p>
                            <p className="font-semibold">{selectedDoc?.version || "1.0"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Estado</p>
                            <p className="font-semibold capitalize">{selectedDoc?.estado}</p>
                          </div>
                        </div>

                        {/* Historial de versiones */}
                        <div className="bg-white border rounded-lg p-4">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Historial de versiones
                          </h4>

                          {loadingVersions ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                          ) : selectedDoc?.versiones && selectedDoc.versiones.length > 0 ? (
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="p-2 text-left">Versión</th>
                                  <th className="p-2 text-left">Fecha</th>
                                  <th className="p-2 text-left">Cambios</th>
                                  <th className="p-2 text-center">Acción</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedDoc.versiones.map((v) => (
                                  <tr key={v.id} className="hover:bg-gray-50 border-b">
                                    <td className="p-2 font-medium">{v.versionString}</td>
                                    <td className="p-2">
                                      {new Date(v.subidoEn).toLocaleDateString("es-ES")}
                                    </td>
                                    <td className="p-2 text-gray-600">{v.cambios || "-"}</td>
                                    <td className="p-2 text-center">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDownload(v.id)}
                                      >
                                        <Download className="h-3 w-3 mr-1" />
                                        Descargar
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-center py-8 text-gray-500">
                              No hay versiones históricas disponibles
                            </p>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
            {filtrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No se encontraron documentos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
