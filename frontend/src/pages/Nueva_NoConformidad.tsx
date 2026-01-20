import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, X, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { noConformidadService } from "@/services/noConformidad.service";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

interface Usuario {
  id: string;
  nombre: string;
  primerApellido: string;
}

interface Area {
  id: string;
  nombre: string;
}

interface Proceso {
  id: string;
  nombre: string;
  codigo: string;
}

export default function NuevaNoConformidad() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [procesos, setProcesos] = useState<Proceso[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    codigo: "",
    tipo: "",
    descripcion: "",
    fuente: "",
    procesoId: "",
    areaId: "",
    detectadoPor: "",
    responsableId: "",
    estado: "abierta",
    fechaDeteccion: new Date().toISOString().split("T")[0],
    analisisCausa: "",
    planAccion: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const getAuthToken = () => localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) throw new Error("No hay sesión activa");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [usuariosRes, areasRes, procesosRes] = await Promise.all([
        fetch(`${API_URL}/usuarios`, { headers }),
        fetch(`${API_URL}/areas`, { headers }),
        fetch(`${API_URL}/procesos`, { headers }),
      ]);

      if (!usuariosRes.ok || !areasRes.ok || !procesosRes.ok) {
        throw new Error("Error al cargar datos necesarios");
      }

      const usuariosData = await usuariosRes.json();
      const areasData = await areasRes.json();
      const procesosData = await procesosRes.json();

      setUsuarios(usuariosData);
      setAreas(areasData);
      setProcesos(procesosData);
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codigo || !formData.descripcion || !formData.tipo) {
      toast.error("Por favor completa los campos obligatorios", {
        description: "Código, Tipo y Descripción son requeridos.",
      });
      return;
    }

    try {
      setSaving(true);
      await noConformidadService.create(formData);
      toast.success("No Conformidad creada exitosamente");
      navigate("/No_conformidades_Abiertas");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Error al crear la no conformidad", {
        description: error.message || "Ocurrió un error inesperado.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm("¿Estás seguro de cancelar? Se perderán los datos ingresados.")) {
      navigate("/No_conformidades_Abiertas");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-lg font-medium text-gray-700">
            Cargando formulario...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Profesional */}
        <div className="bg-[#E0EDFF] rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E3A8A] flex items-center gap-3">
                <AlertTriangle className="h-9 w-9 text-[#F59E0B]" />
                Registrar Nueva No Conformidad
              </h1>
              <p className="text-[#6B7280] mt-2 text-lg">
                Completa el formulario para documentar una nueva no conformidad detectada
              </p>
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
                    onClick={fetchData}
                    className="text-sm font-medium underline mt-1"
                  >
                    Reintentar carga de datos
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulario Principal */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-[#F1F5F9]">
            <CardTitle className="text-2xl text-[#1E3A8A]">
              Información Detallada de la No Conformidad
            </CardTitle>
            <CardDescription className="text-[#6B7280]">
              Los campos marcados con * son obligatorios
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Código */}
                <div className="space-y-2">
                  <Label htmlFor="codigo" className="text-base font-medium">
                    Código *
                  </Label>
                  <Input
                    id="codigo"
                    placeholder="Ej: NC-2024-001"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                {/* Tipo */}
                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-base font-medium">
                    Tipo *
                  </Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proceso">Proceso</SelectItem>
                      <SelectItem value="producto">Producto</SelectItem>
                      <SelectItem value="servicio">Servicio</SelectItem>
                      <SelectItem value="sistema">Sistema</SelectItem>
                      <SelectItem value="auditoria">Auditoría</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fuente */}
                <div className="space-y-2">
                  <Label htmlFor="fuente" className="text-base font-medium">
                    Fuente de Detección
                  </Label>
                  <Select
                    value={formData.fuente}
                    onValueChange={(value) => setFormData({ ...formData, fuente: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la fuente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auditoria_interna">Auditoría Interna</SelectItem>
                      <SelectItem value="auditoria_externa">Auditoría Externa</SelectItem>
                      <SelectItem value="queja_cliente">Queja de Cliente</SelectItem>
                      <SelectItem value="inspeccion">Inspección</SelectItem>
                      <SelectItem value="revision_direccion">Revisión por Dirección</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fecha Detección */}
                <div className="space-y-2">
                  <Label htmlFor="fechaDeteccion" className="text-base font-medium">
                    Fecha de Detección *
                  </Label>
                  <Input
                    id="fechaDeteccion"
                    type="date"
                    value={formData.fechaDeteccion}
                    onChange={(e) => setFormData({ ...formData, fechaDeteccion: e.target.value })}
                    required
                  />
                </div>

                {/* Área */}
                <div className="space-y-2">
                  <Label htmlFor="areaId" className="text-base font-medium">
                    Área Afectada
                  </Label>
                  <Select
                    value={formData.areaId}
                    onValueChange={(value) => setFormData({ ...formData, areaId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un área" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Proceso */}
                <div className="space-y-2">
                  <Label htmlFor="procesoId" className="text-base font-medium">
                    Proceso Relacionado
                  </Label>
                  <Select
                    value={formData.procesoId}
                    onValueChange={(value) => setFormData({ ...formData, procesoId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un proceso" />
                    </SelectTrigger>
                    <SelectContent>
                      {procesos.map((proceso) => (
                        <SelectItem key={proceso.id} value={proceso.id}>
                          [{proceso.codigo}] {proceso.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Detectado Por */}
                <div className="space-y-2">
                  <Label htmlFor="detectadoPor" className="text-base font-medium">
                    Detectado Por
                  </Label>
                  <Select
                    value={formData.detectadoPor}
                    onValueChange={(value) => setFormData({ ...formData, detectadoPor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona quien detectó" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.map((usuario) => (
                        <SelectItem key={usuario.id} value={usuario.id}>
                          {usuario.nombre} {usuario.primerApellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Responsable */}
                <div className="space-y-2">
                  <Label htmlFor="responsableId" className="text-base font-medium">
                    Responsable de Tratamiento
                  </Label>
                  <Select
                    value={formData.responsableId}
                    onValueChange={(value) => setFormData({ ...formData, responsableId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.map((usuario) => (
                        <SelectItem key={usuario.id} value={usuario.id}>
                          {usuario.nombre} {usuario.primerApellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-base font-medium">
                  Descripción Detallada *
                </Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe con detalle la no conformidad detectada, incluyendo evidencia y efectos observados..."
                  rows={5}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                  className="resize-none"
                />
              </div>

              {/* Análisis de Causa */}
              <div className="space-y-2">
                <Label htmlFor="analisisCausa" className="text-base font-medium">
                  Análisis Preliminar de Causa (Opcional)
                </Label>
                <Textarea
                  id="analisisCausa"
                  placeholder="Registra un análisis inicial de posibles causas raíz..."
                  rows={4}
                  value={formData.analisisCausa}
                  onChange={(e) => setFormData({ ...formData, analisisCausa: e.target.value })}
                  className="resize-none"
                />
              </div>

              {/* Plan de Acción */}
              <div className="space-y-2">
                <Label htmlFor="planAccion" className="text-base font-medium">
                  Plan de Acción Propuesto (Opcional)
                </Label>
                <Textarea
                  id="planAccion"
                  placeholder="Describe las acciones inmediatas o correctivas propuestas..."
                  rows={4}
                  value={formData.planAccion}
                  onChange={(e) => setFormData({ ...formData, planAccion: e.target.value })}
                  className="resize-none"
                />
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end gap-4 pt-6 border-t border-[#E5E7EB]">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="mr-2 h-5 w-5" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={saving}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium shadow-sm"
                >
                  {saving ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Crear No Conformidad
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}