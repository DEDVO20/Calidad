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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ControlVersiones() {
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const documentos = [
    {
      id: 1,
      nombre: "Manual de Calidad",
      version: "3.1",
      fecha: "2025-09-15",
      usuario: "Administrador",
      versionesVigentes: 3,
      url: "/docs/manual_calidad.pdf",
    },
    {
      id: 2,
      nombre: "Procedimiento de Auditoría",
      version: "2.0",
      fecha: "2025-08-10",
      usuario: "Coordinador de Calidad",
      versionesVigentes: 2,
      url: "/docs/auditoria.pdf",
    },
    {
      id: 3,
      nombre: "Política de Seguridad",
      version: "1.0",
      fecha: "2025-10-28",
      usuario: "Seguridad Industrial",
      versionesVigentes: 1,
      url: "/docs/politica_seguridad.pdf",
    },
  ];

  const filtrados = documentos.filter((doc) =>
    doc.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const dataGrafico = documentos.map((d) => ({
    nombre: d.nombre,
    versiones: d.versionesVigentes,
  }));

  return (
    <div className="p-6 space-y-6">
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Control de Versiones de Documentos
          </CardTitle>
        </CardHeader>

        {/* Búsqueda */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2 w-full sm:w-1/2">
            <Input
              placeholder="Buscar documento por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline">
              <Search className="h-4 w-4 mr-1" /> Buscar
            </Button>
          </div>
        </div>  

        {/* Tabla */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Versión</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Usuario / Área</TableHead>
              <TableHead>Versiones Vigentes</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.id}</TableCell>
                <TableCell>{doc.nombre}</TableCell>
                <TableCell>{doc.version}</TableCell>
                <TableCell>{doc.fecha}</TableCell>
                <TableCell>{doc.usuario}</TableCell>
                <TableCell>{doc.versionesVigentes}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> Ver
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>
                          Vista previa - {selectedDoc?.nombre}
                        </DialogTitle>
                      </DialogHeader>
                      <iframe
                        src={selectedDoc?.url}
                        className="w-full h-[500px] border rounded-md"
                      ></iframe>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Gráfico opcional */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Versiones vigentes por documento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dataGrafico}>
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="versiones" fill="#04080eff" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Card>
    </div>
  );
}
