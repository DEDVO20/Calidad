import { useState } from "react";
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
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Search, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function Gestion_Documental() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("todos");
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [open, setOpen] = useState(false);

  // Datos simulados de documentos
  const documentos = [
    { id: 1, nombre: "Manual de Calidad", version: "3.2", responsable: "Juan Pérez", estado: "Vigente" },
    { id: 2, nombre: "Procedimiento de Auditoría", version: "1.1", responsable: "Ana Gómez", estado: "En Revisión" },
    { id: 3, nombre: "Registro de Cambios", version: "2.0", responsable: "Carlos Ruiz", estado: "Finalizado" },
    { id: 4, nombre: "Plan de Mejora", version: "1.0", responsable: "María López", estado: "Vigente" },
  ];

  const filteredDocs = documentos.filter(
    (doc) =>
      (filter === "todos" || doc.estado === filter) &&
      doc.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Datos para la gráfica
  const data = [
    { name: "Vigente", cantidad: documentos.filter((d) => d.estado === "Vigente").length },
    { name: "En Revisión", cantidad: documentos.filter((d) => d.estado === "En Revisión").length },
    { name: "Finalizado", cantidad: documentos.filter((d) => d.estado === "Finalizado").length },
  ];

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
                Controla y administra todos los documentos del sistema de calidad ISO 9001
              </p>
            </div>
          </div>
        </div>

        {/* Búsqueda y filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
            <Input
              placeholder="Buscar documento por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los documentos</SelectItem>
              <SelectItem value="Vigente">Vigente</SelectItem>
              <SelectItem value="En Revisión">En Revisión</SelectItem>
              <SelectItem value="Finalizado">Finalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabla de documentos */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
          <div className="bg-[#F1F5F9] px-6 py-4">
            <h2 className="text-xl font-semibold text-[#1E3A8A]">Listado de Documentos</h2>
          </div>
          <Table>
            <TableHeader className="bg-[#F1F5F9]">
              <TableRow>
                <TableHead className="text-[#1E3A8A]">Nombre</TableHead>
                <TableHead className="text-[#1E3A8A]">Versión</TableHead>
                <TableHead className="text-[#1E3A8A]">Responsable</TableHead>
                <TableHead className="text-[#1E3A8A]">Estado</TableHead>
                <TableHead className="text-[#1E3A8A] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-[#6B7280]">
                    No se encontraron documentos
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocs.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-[#EFF6FF] transition-colors">
                    <TableCell className="font-medium">{doc.nombre}</TableCell>
                    <TableCell>{doc.version}</TableCell>
                    <TableCell className="text-[#6B7280]">{doc.responsable}</TableCell>
                    <TableCell>
                      <span className={
                        doc.estado === "Vigente" ? "text-[#22C55E] font-medium" :
                        doc.estado === "En Revisión" ? "text-[#F59E0B] font-medium" :
                        "text-[#EF4444] font-medium"
                      }>
                        {doc.estado}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedDoc(doc);
                          setOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 text-[#2563EB]" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Gráfica de barras */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
          <h2 className="text-2xl font-semibold text-[#1E3A8A] mb-6">Resumen de Estados de Documentos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: "#6B7280" }} />
              <YAxis tick={{ fill: "#6B7280" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                labelStyle={{ color: "#1E3A8A" }}
              />
              <Bar dataKey="cantidad" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Modal de trazabilidad */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#1E3A8A] flex items-center gap-3">
                <FileText className="h-7 w-7 text-[#2563EB]" />
                Trazabilidad del Documento
              </DialogTitle>
            </DialogHeader>
            {selectedDoc && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#6B7280]">Nombre</p>
                    <p className="font-semibold text-gray-900">{selectedDoc.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Versión</p>
                    <p className="font-semibold text-gray-900">{selectedDoc.version}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Responsable</p>
                    <p className="font-semibold text-gray-900">{selectedDoc.responsable}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Estado actual</p>
                    <p className={
                      selectedDoc.estado === "Vigente" ? "text-[#22C55E] font-semibold" :
                      selectedDoc.estado === "En Revisión" ? "text-[#F59E0B] font-semibold" :
                      "text-[#EF4444] font-semibold"
                    }>
                      {selectedDoc.estado}
                    </p>
                  </div>
                </div>

                <div className="bg-[#F1F5F9] rounded-lg p-6">
                  <p className="font-semibold text-[#1E3A8A] mb-3">Historial de Cambios</p>
                  <ul className="space-y-2 text-[#6B7280]">
                    <li className="flex items-center gap-2">
                      <span className="text-[#22C55E]">✓</span> Documento creado
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#F59E0B]">↻</span> En revisión por el área de calidad
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#22C55E]">✓</span> Aprobado y vigente
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}