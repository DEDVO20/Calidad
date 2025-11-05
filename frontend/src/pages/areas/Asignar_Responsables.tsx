import { useEffect, useState } from "react";
import { UserPlus, Users, Building2, AlertCircle, Eye, Trash2, X, Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Area {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
}

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

interface Asignacion {
  id: string;
  areaId: string;
  usuarioId: string;
  area: Area;
  usuario: Usuario;
  esPrincipal: boolean;
  creadoEn: string;
}

const API_URL = "http://localhost:3000/api";

export default function AsignarResponsables() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'view'>('create');
  const [selectedAsignacion, setSelectedAsignacion] = useState<Asignacion | null>(null);
  const [formData, setFormData] = useState({
    areaId: '',
    usuarioId: '',
    esPrincipal: false
  });
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Cargar datos iniciales
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error("No hay sesión activa. Por favor, inicia sesión.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [asignacionesRes, areasRes, usuariosRes] = await Promise.all([
        fetch(`${API_URL}/asignaciones`, { headers }),
        fetch(`${API_URL}/areas`, { headers }),
        fetch(`${API_URL}/usuarios`, { headers })
      ]);

      if (!asignacionesRes.ok || !areasRes.ok || !usuariosRes.ok) {
        throw new Error("Error al cargar datos");
      }

      const [asignacionesData, areasData, usuariosData] = await Promise.all([
        asignacionesRes.json(),
        areasRes.json(),
        usuariosRes.json()
      ]);

      setAsignaciones(asignacionesData);
      setAreas(areasData);
      setUsuarios(usuariosData);
    } catch (error: any) {
      console.error("Error al cargar datos:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // RECARGAR ÁREAS Y USUARIOS AL ABRIR EL MODAL
  const handleCreate = async () => {
    setDialogMode('create');
    setFormData({ areaId: '', usuarioId: '', esPrincipal: false });
    setSelectedAsignacion(null);

    try {
      const token = getAuthToken();
      if (!token) {
        alert("Sesión no válida");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [areasRes, usuariosRes] = await Promise.all([
        fetch(`${API_URL}/areas`, { headers }),
        fetch(`${API_URL}/usuarios`, { headers })
      ]);

      if (!areasRes.ok || !usuariosRes.ok) {
        throw new Error("No se pudieron cargar los datos actualizados");
      }

      const [areasData, usuariosData] = await Promise.all([
        areasRes.json(),
        usuariosRes.json()
      ]);

      setAreas(areasData);
      setUsuarios(usuariosData);
    } catch (err) {
      console.error("Error al recargar datos:", err);
      alert("Error al cargar áreas/usuarios. Intenta recargar la página.");
    } finally {
      setShowDialog(true);
    }
  };

  const handleView = (asignacion: Asignacion) => {
    setDialogMode('view');
    setSelectedAsignacion(asignacion);
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = getAuthToken();

      if (!token) {
        throw new Error("No hay sesión activa");
      }

      if (!formData.areaId || !formData.usuarioId) {
        alert("Debes seleccionar un área y un usuario");
        return;
      }

      const response = await fetch(`${API_URL}/asignaciones`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear asignación');
      }

      await fetchData(); // Recargar todo
      setShowDialog(false);
      alert('Responsable asignado exitosamente');
    } catch (error: any) {
      console.error('Error al guardar:', error);
      alert(error.message || "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (asignacion: Asignacion) => {
    if (!confirm(`¿Estás seguro de eliminar la asignación de ${asignacion.usuario.nombre} al área ${asignacion.area.nombre}?`)) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No hay sesión activa");
      }

      const response = await fetch(`${API_URL}/asignaciones/${asignacion.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar asignación');
      }

      await fetchData();
      alert('Asignación eliminada exitosamente');
    } catch (error: any) {
      console.error('Error al eliminar:', error);
      alert(error.message || "Error al eliminar");
    }
  };

  const filteredAsignaciones = asignaciones.filter(asig => 
    asig.area.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asig.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asig.area.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cargar datos iniciales
  useEffect(() => {
    fetchData();

    // OPCIONAL: Recargar cada 30 segundos
    // const interval = setInterval(fetchData, 30000);
    // return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-sm text-gray-500">Cargando asignaciones...</p>
        </div>
      </div>
    );
  }

  const totalAsignaciones = asignaciones.length;
  const areasConResponsable = new Set(asignaciones.map(a => a.areaId)).size;
  const areasSinResponsable = areas.length - areasConResponsable;
  const responsablesPrincipales = asignaciones.filter(a => a.esPrincipal).length;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-sky-500" />
            Asignar Responsables
          </h1>
          <p className="text-gray-500">
            {totalAsignaciones} {totalAsignaciones === 1 ? "asignación activa" : "asignaciones activas"}
          </p>
        </div>
        <Button onClick={handleCreate}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nueva Asignación
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
                  onClick={fetchData}
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
              <CardTitle className="text-sm font-medium">Total Asignaciones</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">{totalAsignaciones}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Áreas con Responsable</CardTitle>
              <Building2 className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{areasConResponsable}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Áreas sin Responsable</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold">{areasSinResponsable}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Responsables Principales</CardTitle>
              <UserPlus className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{responsablesPrincipales}</div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Asignaciones de Responsables</CardTitle>
              <CardDescription>Gestiona los responsables asignados a cada área</CardDescription>
            </div>
            <div className="w-72">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por área o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium w-24">Código</th>
                    <th className="text-left p-3 text-sm font-medium">Área</th>
                    <th className="text-left p-3 text-sm font-medium">Responsable</th>
                    <th className="text-left p-3 text-sm font-medium">Email</th>
                    <th className="text-left p-3 text-sm font-medium w-24">Tipo</th>
                    <th className="text-left p-3 text-sm font-medium w-32">Fecha</th>
                    <th className="text-right p-3 text-sm font-medium w-28">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAsignaciones.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-12 text-gray-500">
                        {searchTerm ? 'No se encontraron resultados' : 'No hay asignaciones registradas'}
                      </td>
                    </tr>
                  ) : (
                    filteredAsignaciones.map((asignacion) => (
                      <tr key={asignacion.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{asignacion.area.codigo}</td>
                        <td className="p-3 font-medium">{asignacion.area.nombre}</td>
                        <td className="p-3">{asignacion.usuario.nombre}</td>
                        <td className="p-3 text-sm text-gray-600">{asignacion.usuario.email}</td>
                        <td className="p-3">
                          {asignacion.esPrincipal ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Principal
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Apoyo
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-sm text-gray-500">
                          {new Date(asignacion.creadoEn).toLocaleDateString('es-CO')}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleView(asignacion)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(asignacion)}
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
              {dialogMode === 'create' ? 'Nueva Asignación de Responsable' : 'Detalles de la Asignación'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' 
                ? 'Selecciona un área y asigna un responsable.' 
                : 'Información completa de la asignación.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {dialogMode === 'create' ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="area">Área *</Label>
                  <Select
                    value={formData.areaId}
                    onValueChange={(value) => setFormData({ ...formData, areaId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un área" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No hay áreas disponibles
                        </SelectItem>
                      ) : (
                        areas.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            [{area.codigo}] {area.nombre}
                            {asignaciones.some(a => a.areaId === area.id) && (
                              <span className="ml-2 text-xs text-green-600">asignado</span>
                            )}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="usuario">Responsable *</Label>
                  <Select
                    value={formData.usuarioId}
                    onValueChange={(value) => setFormData({ ...formData, usuarioId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No hay usuarios disponibles
                        </SelectItem>
                      ) : (
                        usuarios.map((usuario) => (
                          <SelectItem key={usuario.id} value={usuario.id}>
                            {usuario.nombre} ({usuario.email})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="esPrincipal"
                    checked={formData.esPrincipal}
                    onChange={(e) => setFormData({ ...formData, esPrincipal: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="esPrincipal" className="cursor-pointer">
                    Marcar como responsable principal
                  </Label>
                </div>
              </>
            ) : selectedAsignacion && (
              <>
                <div className="grid gap-3">
                  <div>
                    <Label className="text-gray-500">Área</Label>
                    <p className="font-medium mt-1">
                      [{selectedAsignacion.area.codigo}] {selectedAsignacion.area.nombre}
                    </p>
                    {selectedAsignacion.area.descripcion && (
                      <p className="text-sm text-gray-600 mt-1">{selectedAsignacion.area.descripcion}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-500">Responsable</Label>
                    <p className="font-medium mt-1">{selectedAsignacion.usuario.nombre}</p>
                    <p className="text-sm text-gray-600">{selectedAsignacion.usuario.email}</p>
                    <p className="text-sm text-gray-600">Rol: {selectedAsignacion.usuario.rol}</p>
                  </div>

                  <div>
                    <Label className="text-gray-500">Tipo de Responsable</Label>
                    <p className="mt-1">
                      {selectedAsignacion.esPrincipal ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Responsable Principal
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Responsable de Apoyo
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Asignado el:</span>
                    <span>{new Date(selectedAsignacion.creadoEn).toLocaleString('es-CO')}</span>
                  </div>
                </div>
              </>
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
                      Asignando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Asignar
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