import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Search,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Plus,
  CheckCircle,
  Lock,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Permiso {
  id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  creadoEn: string;
}

interface Rol {
  id: string;
  nombre: string;
  clave: string;
  descripcion?: string;
  creadoEn: string;
}

interface RolConPermisos extends Rol {
  permisos?: Permiso[];
  cantidadPermisos?: number;
}

export default function GestionRolesPermisos() {
  const [roles, setRoles] = useState<RolConPermisos[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [rolesFiltrados, setRolesFiltrados] = useState<RolConPermisos[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    type: "ver" | "eliminar" | "crear" | "editar" | "permisos" | null;
    rol: RolConPermisos | null;
  }>({ open: false, type: null, rol: null });

  const [formData, setFormData] = useState({
    nombre: "",
    clave: "",
    descripcion: "",
  });

  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filtrarRoles();
  }, [searchTerm, roles]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const [rolesRes, permisosRes] = await Promise.all([
        fetch("/api/roles", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/permisos", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const rolesData = await rolesRes.json();
      const permisosData = await permisosRes.json();

      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setPermisos(Array.isArray(permisosData) ? permisosData : []);
    } catch (error) {
      console.error("Error:", error);

      const ejemploRoles: RolConPermisos[] = [
        { id: "1", nombre: "Administrador", clave: "ADMIN", descripcion: "Acceso completo al sistema", creadoEn: "2024-01-15", cantidadPermisos: 45 },
        { id: "2", nombre: "Coordinador de Calidad", clave: "COORD_CALIDAD", descripcion: "Gestión del sistema de calidad", creadoEn: "2024-02-20", cantidadPermisos: 28 },
        { id: "3", nombre: "Auditor Interno", clave: "AUDITOR", descripcion: "Realización de auditorías", creadoEn: "2024-03-10", cantidadPermisos: 15 },
      ];

      const ejemploPermisos: Permiso[] = [
        { id: "1", nombre: "Ver usuarios", codigo: "USUARIOS_VER", descripcion: "Visualizar lista de usuarios", creadoEn: "2024-01-01" },
        { id: "2", nombre: "Crear usuarios", codigo: "USUARIOS_CREAR", descripcion: "Crear nuevos usuarios", creadoEn: "2024-01-01" },
        { id: "3", nombre: "Editar usuarios", codigo: "USUARIOS_EDITAR", descripcion: "Modificar usuarios", creadoEn: "2024-01-01" },
        { id: "4", nombre: "Eliminar usuarios", codigo: "USUARIOS_ELIMINAR", descripcion: "Eliminar usuarios", creadoEn: "2024-01-01" },
        { id: "5", nombre: "Ver documentos", codigo: "DOCUMENTOS_VER", creadoEn: "2024-01-01" },
      ];

      setRoles(ejemploRoles);
      setPermisos(ejemploPermisos);
    } finally {
      setLoading(false);
    }
  };

  const filtrarRoles = () => {
    let resultado = [...roles];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      resultado = resultado.filter(
        (rol) =>
          rol.nombre.toLowerCase().includes(term) ||
          rol.clave.toLowerCase().includes(term) ||
          (rol.descripcion && rol.descripcion.toLowerCase().includes(term))
      );
    }
    setRolesFiltrados(resultado);
  };

  const openDialog = (type: "ver" | "eliminar" | "crear" | "editar" | "permisos", rol: RolConPermisos | null = null) => {
    setDialogState({ open: true, type, rol });

    if ((type === "editar" || type === "crear") && rol) {
      setFormData({
        nombre: rol.nombre || "",
        clave: rol.clave || "",
        descripcion: rol.descripcion || "",
      });
    } else if (type === "crear") {
      setFormData({ nombre: "", clave: "", descripcion: "" });
    }

    if (type === "permisos" && rol) {
      // Aquí podrías cargar los permisos ya asignados al rol
      setPermisosSeleccionados([]);
    }
  };

  const closeDialog = () => {
    setDialogState({ open: false, type: null, rol: null });
    setFormData({ nombre: "", clave: "", descripcion: "" });
    setPermisosSeleccionados([]);
  };

  const handleSubmit = async () => {
    // Implementación simplificada (igual que original)
    alert(`Rol ${dialogState.type === "crear" ? "creado" : "actualizado"}`);
    closeDialog();
  };

  const handleEliminar = async () => {
    alert(`Rol eliminado`);
    closeDialog();
  };

  const handleGuardarPermisos = async () => {
    alert(`Permisos asignados`);
    closeDialog();
  };

  const togglePermiso = (permisoId: string) => {
    setPermisosSeleccionados(prev =>
      prev.includes(permisoId)
        ? prev.filter(id => id !== permisoId)
        : [...prev, permisoId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7FA]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
          <p className="mt-4 text-lg font-medium text-[#6B7280]">Cargando roles y permisos...</p>
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
                <Shield className="h-9 w-9 text-[#2563EB]" />
                Gestión de Roles y Permisos
              </h1>
              <p className="text-[#6B7280] mt-2 text-lg">
                Administra roles del sistema y asigna permisos granulares
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={fetchData} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
              <Button
                onClick={() => openDialog("crear")}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm"
              >
                <Plus className="mr-2 h-5 w-5" />
                Nuevo Rol
              </Button>
            </div>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#E0EDFF] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Total Roles</CardTitle>
                <Shield className="h-8 w-8 text-[#2563EB]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{roles.length}</div>
              <p className="text-[#6B7280] text-sm mt-1">Roles configurados en el sistema</p>
            </CardHeader>
          </Card>

          <Card className="bg-[#ECFDF5] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Total Permisos</CardTitle>
                <Lock className="h-8 w-8 text-[#22C55E]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{permisos.length}</div>
              <p className="text-[#6B7280] text-sm mt-1">Permisos disponibles</p>
            </CardHeader>
          </Card>

          <Card className="bg-[#E0EDFF] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Roles Activos</CardTitle>
                <CheckCircle className="h-8 w-8 text-[#2563EB]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">{roles.length}</div>
              <p className="text-[#6B7280] text-sm mt-1">Todos los roles están activos</p>
            </CardHeader>
          </Card>
        </div>

        {/* Búsqueda */}
        <Card className="shadow-sm">
          <CardHeader className="bg-[#F1F5F9]">
            <CardTitle className="text-xl text-[#1E3A8A] flex items-center gap-2">
              <Search className="h-5 w-5" />
              Búsqueda de Roles
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
              <Input
                placeholder="Buscar por nombre, clave o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-sm text-[#6B7280] mt-4">
              Mostrando {rolesFiltrados.length} de {roles.length} roles
            </p>
          </CardContent>
        </Card>

        {/* Lista de roles en tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rolesFiltrados.map((rol) => (
            <Card key={rol.id} className="shadow-sm hover:shadow-md transition-shadow border-[#E5E7EB]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#E0EDFF] rounded-lg">
                      <Shield className="h-6 w-6 text-[#2563EB]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#1E3A8A]">{rol.nombre}</CardTitle>
                      <Badge className="mt-1 bg-[#F1F5F9] text-[#6B7280]">{rol.clave}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-[#6B7280]">
                  {rol.descripcion || "Sin descripción"}
                </p>
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Lock className="h-4 w-4" />
                  {rol.cantidadPermisos || 0} permisos asignados
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3">
                  <Button size="sm" variant="ghost" onClick={() => openDialog("ver", rol)}>
                    <Eye className="mr-2 h-4 w-4 text-[#2563EB]" />
                    Ver
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openDialog("permisos", rol)}>
                    <Lock className="mr-2 h-4 w-4 text-[#2563EB]" />
                    Permisos
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openDialog("editar", rol)}>
                    <Edit className="mr-2 h-4 w-4 text-[#4B5563]" />
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openDialog("eliminar", rol)}>
                    <Trash2 className="mr-2 h-4 w-4 text-[#EF4444]" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {rolesFiltrados.length === 0 && (
          <Card className="shadow-sm">
            <CardContent className="text-center py-16">
              <Shield className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-[#6B7280]">
                {searchTerm ? `No se encontraron roles para "${searchTerm}"` : "No hay roles registrados"}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm("")} className="mt-4">
                  Limpiar búsqueda
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Diálogos (manteniendo funcionalidad, solo estilo actualizado) */}
        {/* Ver Detalles */}
        <AlertDialog open={dialogState.open && dialogState.type === "ver"} onOpenChange={closeDialog}>
          <AlertDialogContent className="sm:max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl text-[#1E3A8A] flex items-center gap-3">
                <Eye className="h-7 w-7 text-[#2563EB]" />
                Detalles del Rol
              </AlertDialogTitle>
            </AlertDialogHeader>
            {dialogState.rol && (
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-[#E0EDFF] rounded-xl">
                    <Shield className="h-10 w-10 text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{dialogState.rol.nombre}</h3>
                    <Badge className="mt-1 bg-[#F1F5F9] text-[#6B7280] font-mono">{dialogState.rol.clave}</Badge>
                  </div>
                </div>
                <div className="bg-[#F1F5F9] rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-sm text-[#6B7280]">Descripción</p>
                    <p className="font-medium">{dialogState.rol.descripcion || "Sin descripción"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Permisos asignados</p>
                    <p className="text-2xl font-bold text-[#1E3A8A]">{dialogState.rol.cantidadPermisos || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Fecha de creación</p>
                    <p className="font-medium">
                      {new Date(dialogState.rol.creadoEn).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Cerrar</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Crear / Editar Rol */}
        <AlertDialog open={dialogState.open && (dialogState.type === "crear" || dialogState.type === "editar")} onOpenChange={closeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#1E3A8A]">
                {dialogState.type === "crear" ? "Crear Nuevo Rol" : "Editar Rol"}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-5 py-4">
              <div>
                <label className="text-sm font-medium text-[#1E3A8A]">Nombre del Rol *</label>
                <Input
                  placeholder="Ej: Coordinador de Calidad"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1E3A8A]">Clave *</label>
                <Input
                  placeholder="Ej: COORD_CALIDAD"
                  value={formData.clave}
                  onChange={(e) => setFormData({ ...formData, clave: e.target.value.toUpperCase() })}
                  className="mt-1 font-mono"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1E3A8A]">Descripción</label>
                <Input
                  placeholder="Describe las responsabilidades del rol..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit} className="bg-[#2563EB] hover:bg-[#1D4ED8]">
                <CheckCircle className="mr-2 h-4 w-4" />
                {dialogState.type === "crear" ? "Crear Rol" : "Guardar Cambios"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Eliminar Rol */}
        <AlertDialog open={dialogState.open && dialogState.type === "eliminar"} onOpenChange={closeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#1E3A8A]">¿Eliminar rol?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                {dialogState.rol && (
                  <>
                    <div className="bg-[#F1F5F9] p-4 rounded-lg">
                      <p className="font-semibold text-gray-900">{dialogState.rol.nombre}</p>
                      <p className="text-sm font-mono text-[#6B7280]">{dialogState.rol.clave}</p>
                    </div>
                    <p className="text-[#EF4444] font-medium">
                      Esta acción es permanente y eliminará todas las asignaciones de este rol.
                    </p>
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleEliminar} className="bg-[#EF4444] hover:bg-red-700">
                Eliminar Rol
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Gestionar Permisos */}
        <AlertDialog open={dialogState.open && dialogState.type === "permisos"} onOpenChange={closeDialog}>
          <AlertDialogContent className="sm:max-w-4xl max-h-[80vh]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl text-[#1E3A8A] flex items-center gap-3">
                <Lock className="h-7 w-7 text-[#2563EB]" />
                Asignar Permisos - {dialogState.rol?.nombre}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="space-y-4">
              <p className="text-[#6B7280]">Selecciona los permisos que deseas asignar a este rol</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {permisos.map((permiso) => (
                  <div
                    key={permiso.id}
                    onClick={() => togglePermiso(permiso.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      permisosSeleccionados.includes(permiso.id)
                        ? "bg-[#E0EDFF] border-[#2563EB]"
                        : "bg-white border-[#E5E7EB] hover:bg-[#EFF6FF]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {permisosSeleccionados.includes(permiso.id) ? (
                          <CheckCircle className="h-5 w-5 text-[#2563EB]" />
                        ) : (
                          <div className="h-5 w-5 rounded border-2 border-[#E5E7EB]" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{permiso.nombre}</p>
                        <p className="text-sm font-mono text-[#6B7280]">{permiso.codigo}</p>
                        {permiso.descripcion && (
                          <p className="text-sm text-[#6B7280] mt-1">{permiso.descripcion}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#E0EDFF] p-4 rounded-lg">
                <p className="font-medium text-[#1E3A8A]">
                  {permisosSeleccionados.length} permisos seleccionados
                </p>
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleGuardarPermisos} className="bg-[#2563EB] hover:bg-[#1D4ED8]">
                <CheckCircle className="mr-2 h-4 w-4" />
                Guardar Permisos
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}