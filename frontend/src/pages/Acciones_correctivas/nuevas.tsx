import { useState, useEffect } from "react";
import { Save, X, AlertCircle, FileText } from "lucide-react";
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
import { accionCorrectivaService } from "@/services/accionCorrectiva.service";
import { noConformidadService } from "@/services/noConformidad.service";

const API_URL = "http://localhost:3000/api";

interface NoConformidad {
  id: string;
  codigo: string;
  descripcion: string;
}

interface Usuario {
  id: string;
  nombre: string;
  primerApellido: string;
}

export default function NuevasAccionesCorrectivas() {
  const [noConformidades, setNoConformidades] = useState<NoConformidad[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    noConformidadId: "",
    codigo: "",
    tipo: "",
    descripcion: "",
    analisisCausaRaiz: "",
    planAccion: "",
    responsableId: "",
    fechaCompromiso: "",
    fechaImplementacion: "",
    estado: "pendiente",
    observacion: "",
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

      const noConformidadesData = await noConformidadService.getAll();
      const noConformidadesFormatted = noConformidadesData.map((nc: any) => ({
        id: nc.id.toString(),
        codigo: nc.codigo,
        descripcion: nc.descripcion,
      }));

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const usuariosRes = await fetch(`${API_URL}/usuarios`, { headers });
      if (!usuariosRes.ok) throw new Error("Error al cargar usuarios");
      const usuariosData = await usuariosRes.json();

      setNoConformidades(noConformidadesFormatted);
      setUsuarios(usuariosData);
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.noConformidadId || !formData.codigo || !formData.tipo) {
      alert("Por favor completa los campos obligatorios: No Conformidad, Código y Tipo");
      return;
    }

    try {
      setSaving(true);
      await accionCorrectivaService.create(formData);
      alert("Acción correctiva creada exitosamente");

      // Limpiar formulario
      setFormData({
        noConformidadId: "",
        codigo: "",
        tipo: "",
        descripcion: "",
        analisisCausaRaiz: "",
        planAccion: "",
        responsableId: "",
        fechaCompromiso: "",
        fechaImplementacion: "",
        estado: "pendiente",
        observacion: "",
      });
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Error al crear acción correctiva");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm("¿Estás seguro de cancelar? Se perderán los datos ingresados.")) {
      setFormData({
        noConformidadId: "",
        codigo: "",
        tipo: "",
        descripcion: "",
        analisisCausaRaiz: "",
        planAccion: "",
        responsableId: "",
        fechaCompromiso: "",
        fechaImplementacion: "",
        estado: "pendiente",
        observacion: "",
      });
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
                <FileText className="h-9 w-9 text-[#2563EB]" />
                Registrar Nueva Acción Correctiva
              </h1>
              <p className="text-[#6B7280] mt-2 text-lg">
                Define una acción correctiva, preventiva o de mejora asociada a una no conformidad
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
              Detalles de la Acción Correctiva
            </CardTitle>
            <CardDescription className="text-[#6B7280]">
              Los campos marcados con * son obligatorios
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">

              <div className="grid gap-6 md:grid-cols-2">
                {/* No Conformidad Asociada */}
                <div className="space-y-2">
                  <Label htmlFor="noConformidadId" className="text-base font-medium">
                    No Conformidad Asociada *
                  </Label>
                  <Select
                    value={formData.noConformidadId}
                    onValueChange={(value) => setFormData({ ...formData, noConformidadId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una no conformidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {noConformidades.map((nc) => (
                        <SelectItem key={nc.id} value={nc.id}>
                          [{nc.codigo}] {nc.descripcion.length > 60 ? nc.descripcion.substring(0, 60) + "..." : nc.descripcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Código */}
                <div className="space-y-2">
                  <Label htmlFor="codigo" className="text-base font-medium">
                    Código *
                  </Label>
                  <Input
                    id="codigo"
                    placeholder="Ej: AC-2024-001"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                {/* Tipo */}
                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-base font-medium">
                    Tipo de Acción *
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
                      <SelectItem value="correctiva">Correctiva</SelectItem>
                      <SelectItem value="preventiva">Preventiva</SelectItem>
                      <SelectItem value="mejora">Mejora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Responsable */}
                <div className="space-y-2">
                  <Label htmlFor="responsableId" className="text-base font-medium">
                    Responsable de Ejecución
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

                {/* Fecha Compromiso */}
                <div className="space-y-2">
                  <Label htmlFor="fechaCompromiso" className="text-base font-medium">
                    Fecha Compromiso
                  </Label>
                  <Input
                    id="fechaCompromiso"
                    type="date"
                    value={formData.fechaCompromiso}
                    onChange={(e) => setFormData({ ...formData, fechaCompromiso: e.target.value })}
                  />
                </div>

                {/* Fecha Implementación */}
                <div className="space-y-2">
                  <Label htmlFor="fechaImplementacion" className="text-base font-medium">
                    Fecha Prev. Implementación
                  </Label>
                  <Input
                    id="fechaImplementacion"
                    type="date"
                    value={formData.fechaImplementacion}
                    onChange={(e) => setFormData({ ...formData, fechaImplementacion: e.target.value })}
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-base font-medium">
                  Descripción de la Acción
                </Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe claramente qué se va a hacer para corregir/prevenir/mejorar..."
                  rows={4}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="resize-none"
                />
              </div>

              {/* Análisis de Causa Raíz */}
              <div className="space-y-2">
                <Label htmlFor="analisisCausaRaiz" className="text-base font-medium">
                  Análisis de Causa Raíz
                </Label>
                <Textarea
                  id="analisisCausaRaiz"
                  placeholder="Explica las causas raíz identificadas (5 Porqués, Ishikawa, etc.)..."
                  rows={5}
                  value={formData.analisisCausaRaiz}
                  onChange={(e) => setFormData({ ...formData, analisisCausaRaiz: e.target.value })}
                  className="resize-none"
                />
              </div>

              {/* Plan de Acción */}
              <div className="space-y-2">
                <Label htmlFor="planAccion" className="text-base font-medium">
                  Plan de Acción Detallado
                </Label>
                <Textarea
                  id="planAccion"
                  placeholder="Detalla paso a paso las actividades, recursos necesarios y responsables..."
                  rows={5}
                  value={formData.planAccion}
                  onChange={(e) => setFormData({ ...formData, planAccion: e.target.value })}
                  className="resize-none"
                />
              </div>

              {/* Observaciones */}
              <div className="space-y-2">
                <Label htmlFor="observacion" className="text-base font-medium">
                  Observaciones Adicionales
                </Label>
                <Textarea
                  id="observacion"
                  placeholder="Comentarios, riesgos identificados, dependencias, etc..."
                  rows={4}
                  value={formData.observacion}
                  onChange={(e) => setFormData({ ...formData, observacion: e.target.value })}
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
                      Crear Acción Correctiva
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