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
import { Eye, Search } from "lucide-react";

export default function InstanciasActivas() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  // Datos simulados
  const instancias = [
    { id: 1, proceso: "Planificaciòn Estrategica", responsable: "Juan Carlos", estado: "En Ejecución", avance: "65%" },
    { id: 2, proceso: "Gestión Comercial", responsable: "Maria Gómez", estado: "Pendiente", avance: "0%" },
    { id: 3, proceso: "Talento Humano", responsable: "Carlos Castro", estado: "Finalizada", avance: "100%" },
    { id: 4, proceso: "Plan de Mejoras", responsable: "Juanita López", estado: "En Ejecución", avance: "45%" },
  ];

  // Filtrado
  const filtered = instancias.filter(
    (item) =>
      (filter === "todos" || item.estado === filter) &&
      item.proceso.toLowerCase().includes(search.toLowerCase())
  );

  // Colores del estado
  const colorEstado = (estado: string) => {
    if (estado === "Finalizada") return "text-green-600 font-semibold";
    if (estado === "En Ejecución") return "text-orange-500 font-semibold";
    if (estado === "Pendiente") return "text-gray-500 font-semibold";
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold text-center">Instancias Activas</h1>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <Input
            placeholder="Buscar instancia por proceso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Button variant="default">
            <Search className="h-4 w-4 mr-1" /> Buscar
          </Button>
        </div>

        <div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="En Ejecución">🟠 En Ejecución</SelectItem>
              <SelectItem value="Pendiente">⚪ Pendiente</SelectItem>
              <SelectItem value="Finalizada">🟢 Finalizada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proceso</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Avance</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.proceso}</TableCell>
                <TableCell>{item.responsable}</TableCell>
                <TableCell className={colorEstado(item.estado)}>
                  {item.estado}
                </TableCell>
                <TableCell>{item.avance}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelected(item);
                      setOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" /> Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle de la Instancia</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-3">
              <p><strong>Proceso:</strong> {selected.proceso}</p>
              <p><strong>Responsable:</strong> {selected.responsable}</p>
              <p>
                <strong>Estado:</strong>{" "}
                <span className={colorEstado(selected.estado)}>
                  {selected.estado}
                </span>
              </p>
              <p><strong>Avance:</strong> {selected.avance}</p>

              <div className="border-t pt-3">
                <p className="font-semibold mb-2">📌 Trazabilidad:</p>
                <ul className="text-sm space-y-1">
                  <li>📄 Instancia creada</li>
                  <li>🔧 Actividades en ejecución</li>
                  {selected.estado === "Finalizada" && <li>✅ Proceso completado</li>}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
