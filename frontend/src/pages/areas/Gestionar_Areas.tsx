import { useEffect, useState } from "react";
import { AlertTriangle, Plus, Users, UserCheck, UserX, AlertCircle, Edit, Eye, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} 
from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Area {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  creadoEn: string;
  actualizadoEn: string;
}

const API_URL = "http://localhost:3000/api";

export default function AreasResponsables() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchAreas = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error("No hay sesión activa. Por favor, inicia sesión.");
      }

      const response = await fetch(`${API_URL}/areas`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        throw new Error(`Error al obtener áreas: ${response.status}`);
      }

      const data: Area[] = await response.json();
      setAreas(data);
    } catch (error: any) {
      console.error("Error al cargar áreas:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setDialogMode('create');
    setFormData({ codigo: '', nombre: '', descripcion: '' });
    setSelectedArea(null);
    setShowDialog(true);
  };

  const handleEdit = (area: Area) => {
    setDialogMode('edit');
    setFormData({
      codigo: area.codigo,
      nombre: area.nombre,
      descripcion: area.descripcion || ''
    });
    setSelectedArea(area);
    setShowDialog(true);
  };

  const handleView = (area: Area) => {
    setDialogMode('view');
    setSelectedArea(area);
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = getAuthToken();

      if (!token) {
        throw new Error("No hay sesión activa");
      }

      if (!formData.codigo.trim() || !formData.nombre.trim()) {
        alert("El código y nombre son obligatorios");
        return;
      }

      const url = dialogMode === 'create' 
        ? `${API_URL}/areas`
        : `${API_URL}/areas/${selectedArea?.id}`;

      const method = dialogMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al guardar área');
      }

      await fetchAreas();
      setShowDialog(false);
      alert(dialogMode === 'create' ? 'Área creada exitosamente' : 'Área actualizada exitosamente');
    } catch (error: any) {
      console.error('Error al guardar:', error);
      alert(error.message || "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (area: Area) => {
    if (!confirm(`¿Estás seguro de eliminar el área "${area.nombre}"?`)) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No hay sesión activa");
      }

      const response = await fetch(`${API_URL}/areas/${area.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar área');
      }

      await fetchAreas();
      alert('Área eliminada exitosamente');
    } catch (error: any) {
      console.error('Error al eliminar:', error);
      alert(error.message || "Error al eliminar");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-sm text-gray-500">Cargando áreas...</p>
        </div>
      </div>
    );
  }

  const total = areas.length;
  const asignadas = 0;
  const sinAsignar = total;
  const conIncidencias = 0;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-sky-500" />
            Gestionar Areas
          </h1>
          <p className="text-gray-500">
            {total} {total === 1 ? "área registrada" : "áreas registradas"}
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Área
        </Button>
      </div>

      {error && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Error de conexión</p>
                <p className="text-sm">{error}</p>
                <button 
                  className="text-sm underline mt-1 inline-block"
                  onClick={fetchAreas}
                >
                  Intentar nuevamente
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">{total}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Asignadas</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{asignadas}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Sin Asignar</CardTitle>
              <UserX className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold">{sinAsignar}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Incidencias</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold">{conIncidencias}</div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Áreas</CardTitle>
          <CardDescription>Administra todas las áreas responsables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium w-24">Código</th>
                    <th className="text-left p-3 text-sm font-medium">Nombre</th>
                    <th className="text-left p-3 text-sm font-medium">Descripción</th>
                    <th className="text-left p-3 text-sm font-medium w-32">Fecha</th>
                    <th className="text-right p-3 text-sm font-medium w-36">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {areas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-12 text-gray-500">
                        No hay áreas registradas
                      </td>
                    </tr>
                  ) : (
                    areas.map((area) => (
                      <tr key={area.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{area.codigo}</td>
                        <td className="p-3 font-medium">{area.nombre}</td>
                        <td className="p-3 text-gray-500 max-w-xs truncate">
                          {area.descripcion || 'Sin descripción'}
                        </td>
                        <td className="p-3 text-sm text-gray-500">
                          {new Date(area.creadoEn).toLocaleDateString('es-CO')}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleView(area)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(area)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(area)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' && 'Nueva Área'}
              {dialogMode === 'edit' && 'Editar Área'}
              {dialogMode === 'view' && 'Detalles del Área'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' && 'Ingresa los datos del área responsable.'}
              {dialogMode === 'edit' && 'Modifica los datos del área.'}
              {dialogMode === 'view' && 'Información completa del área.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={dialogMode === 'view' ? selectedArea?.codigo ?? '' : formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                placeholder="CAL, SIS, RRHH"
                disabled={dialogMode === 'view'}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={dialogMode === 'view' ? selectedArea?.nombre ?? '' : formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Gestión de Calidad"
                disabled={dialogMode === 'view'}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={dialogMode === 'view' ? selectedArea?.descripcion ?? '' : formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción detallada del área"
                rows={3}
                disabled={dialogMode === 'view'}
              />
            </div>

            {dialogMode === 'view' && selectedArea && (
              <div className="grid gap-2 pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Creado:</span>
                  <span>{new Date(selectedArea.creadoEn).toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Actualizado:</span>
                  <span>{new Date(selectedArea.actualizadoEn).toLocaleString('es-CO')}</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {dialogMode === 'view' ? (
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                <X className="mr-2 h-4 w-4" />
                Cerrar
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}