import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  UserPlus,
  ArrowLeft,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Building2,
  Mail,
  User,
  Lock,
  FileText,
  Users,
  Shield,
  Sparkles,
} from "lucide-react";

interface Area {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
}

interface Rol {
  id: string;
  nombre: string;
  clave: string;
  descripcion?: string;
}

interface FormData {
  documento: string;
  nombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  nombreUsuario: string;
  contrasena: string;
  confirmarContrasena: string;
  areaId: string;
  activo: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function NuevosUsuarios() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    documento: "",
    nombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    correoElectronico: "",
    nombreUsuario: "",
    contrasena: "",
    confirmarContrasena: "",
    areaId: "",
    activo: true,
  });

  const [areas, setAreas] = useState<Area[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAreas();
    fetchRoles();
  }, []);

  const fetchAreas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/areas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAreas(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error al obtener áreas:", error);
      setAreas([
        { id: "1", codigo: "CAL", nombre: "Gestión de Calidad" },
        { id: "2", codigo: "SIS", nombre: "Sistemas y Tecnología" },
        { id: "3", codigo: "RRHH", nombre: "Recursos Humanos" },
        { id: "4", codigo: "COM", nombre: "Comercial" },
        { id: "5", codigo: "OPE", nombre: "Operaciones" },
        { id: "6", codigo: "FIN", nombre: "Finanzas" },
      ]);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setRoles(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error al obtener roles:", error);
      setRoles([
        { id: "1", nombre: "Administrador", clave: "ADMIN", descripcion: "Acceso total" },
        { id: "2", nombre: "Coordinador de Calidad", clave: "COORD_CALIDAD" },
        { id: "3", nombre: "Auditor Interno", clave: "AUDITOR" },
        { id: "4", nombre: "Usuario Estándar", clave: "USER" },
      ]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.documento.trim()) newErrors.documento = "El documento es obligatorio";
    else if (!/^\d+$/.test(formData.documento)) newErrors.documento = "El documento debe contener solo números";

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.primerApellido.trim()) newErrors.primerApellido = "El primer apellido es obligatorio";

    if (!formData.correoElectronico.trim()) newErrors.correoElectronico = "El correo electrónico es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoElectronico))
      newErrors.correoElectronico = "El correo electrónico no es válido";

    if (!formData.nombreUsuario.trim()) newErrors.nombreUsuario = "El nombre de usuario es obligatorio";
    else if (formData.nombreUsuario.length < 3) newErrors.nombreUsuario = "El nombre de usuario debe tener al menos 3 caracteres";

    if (!formData.contrasena) newErrors.contrasena = "La contraseña es obligatoria";
    else if (formData.contrasena.length < 6) newErrors.contrasena = "La contraseña debe tener al menos 6 caracteres";

    if (!formData.confirmarContrasena) newErrors.confirmarContrasena = "Debe confirmar la contraseña";
    else if (formData.contrasena !== formData.confirmarContrasena)
      newErrors.confirmarContrasena = "Las contraseñas no coinciden";

    if (!formData.areaId) newErrors.areaId = "Debe seleccionar un área";
    if (selectedRoleIds.length === 0) newErrors.roles = "Debe seleccionar al menos un rol";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const dataToSend = {
        documento: parseInt(formData.documento, 10),
        nombre: formData.nombre.trim(),
        segundoNombre: formData.segundoNombre.trim() || undefined,
        primerApellido: formData.primerApellido.trim(),
        segundoApellido: formData.segundoApellido.trim() || undefined,
        correoElectronico: formData.correoElectronico.trim(),
        nombreUsuario: formData.nombreUsuario.trim(),
        contrasena: formData.contrasena,
        areaId: formData.areaId,
        activo: formData.activo,
        rolIds: selectedRoleIds,
      };

      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Usuario "${formData.nombreUsuario}" creado exitosamente`);
        setFormData({
          documento: "", nombre: "", segundoNombre: "", primerApellido: "", segundoApellido: "",
          correoElectronico: "", nombreUsuario: "", contrasena: "", confirmarContrasena: "", areaId: "", activo: true,
        });
        setSelectedRoleIds([]);
        setTimeout(() => navigate("/usuarios"), 2000);
      } else {
        throw new Error(result.message || "Error al crear el usuario");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al crear el usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("¿Está seguro de que desea cancelar? Se perderán todos los cambios.")) {
      setFormData({
        documento: "", nombre: "", segundoNombre: "", primerApellido: "", segundoApellido: "",
        correoElectronico: "", nombreUsuario: "", contrasena: "", confirmarContrasena: "", areaId: "", activo: true,
      });
      setSelectedRoleIds([]);
      setErrors({});
    }
  };

  const toggleRole = (id: string) => {
    setSelectedRoleIds(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    if (errors.roles) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.roles;
        return newErrors;
      });
    }
  };

  const generarNombreUsuario = () => {
    const nombre = formData.nombre.toLowerCase().trim();
    const apellido = formData.primerApellido.toLowerCase().trim();
    if (nombre && apellido) {
      const username = `${nombre.charAt(0)}${apellido}`.replace(/[^a-z0-9]/g, '');
      setFormData(prev => ({ ...prev, nombreUsuario: username }));
      if (errors.nombreUsuario) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.nombreUsuario;
          return newErrors;
        });
      }
      toast.success(`Nombre de usuario generado: ${username}`);
    } else {
      toast.error("Ingresa nombre y apellido primero");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Profesional */}
        <div className="bg-[#E0EDFF] rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E3A8A] flex items-center gap-3">
                <UserPlus className="h-9 w-9 text-[#2563EB]" />
                Nuevo Usuario
              </h1>
              <p className="text-[#6B7280] mt-2 text-lg">
                Complete el formulario para registrar un nuevo usuario en el sistema de calidad ISO 9001
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="text-[#6B7280] border-[#E5E7EB] hover:bg-[#EFF6FF]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <Card className="shadow-sm border-[#E5E7EB]">
            <CardHeader className="bg-[#F1F5F9] border-b border-[#E5E7EB]">
              <CardTitle className="text-2xl text-[#1E3A8A] flex items-center gap-3">
                <Users className="h-6 w-6 text-[#2563EB]" />
                Información del Usuario
              </CardTitle>
              <CardDescription className="text-[#6B7280]">
                Los campos marcados con <span className="text-red-500">*</span> son obligatorios
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 pt-6">

              {/* Datos Personales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1E3A8A] flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#2563EB]" />
                  Datos Personales
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="documento">
                      Documento <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="documento"
                      name="documento"
                      placeholder="Ej: 12345678"
                      value={formData.documento}
                      onChange={handleInputChange}
                      className={errors.documento ? "border-red-500" : ""}
                    />
                    {errors.documento && (
                      <p className="text-sm text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.documento}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombre">
                      Primer Nombre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      placeholder="Ej: Juan"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={errors.nombre ? "border-red-500" : ""}
                    />
                    {errors.nombre && (
                      <p className="text-sm text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.nombre}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="segundoNombre">Segundo Nombre</Label>
                    <Input
                      id="segundoNombre"
                      name="segundoNombre"
                      placeholder="Ej: Carlos"
                      value={formData.segundoNombre}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primerApellido">
                      Primer Apellido <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="primerApellido"
                      name="primerApellido"
                      placeholder="Ej: Pérez"
                      value={formData.primerApellido}
                      onChange={handleInputChange}
                      className={errors.primerApellido ? "border-red-500" : ""}
                    />
                    {errors.primerApellido && (
                      <p className="text-sm text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.primerApellido}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="segundoApellido">Segundo Apellido</Label>
                    <Input
                      id="segundoApellido"
                      name="segundoApellido"
                      placeholder="Ej: García"
                      value={formData.segundoApellido}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="areaId">
                      Área <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="areaId"
                      name="areaId"
                      value={formData.areaId}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors.areaId ? "border-red-500" : "border-[#E5E7EB]"}`}
                    >
                      <option value="">Seleccione un área</option>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          [{area.codigo}] {area.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.areaId && (
                      <p className="text-sm text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.areaId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Asignación de Roles */}
              <div className="space-y-4 pt-6 border-t border-[#E5E7EB]">
                <h3 className="text-lg font-semibold text-[#1E3A8A] flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#2563EB]" />
                  Asignación de Roles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((rol) => (
                    <div
                      key={rol.id}
                      onClick={() => toggleRole(rol.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedRoleIds.includes(rol.id)
                        ? "bg-[#E0EDFF] border-[#2563EB]"
                        : "bg-white border-[#E5E7EB] hover:bg-[#EFF6FF]"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedRoleIds.includes(rol.id)}
                          onChange={() => toggleRole(rol.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 h-4 w-4 text-[#2563EB] rounded focus:ring-[#2563EB]"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{rol.nombre}</div>
                          <div className="text-sm text-[#6B7280]">{rol.clave}</div>
                          {rol.descripcion && (
                            <div className="text-sm text-[#6B7280] mt-1">{rol.descripcion}</div>
                          )}
                        </div>
                        {selectedRoleIds.includes(rol.id) && (
                          <CheckCircle className="h-5 w-5 text-[#2563EB]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {errors.roles && (
                  <p className="text-sm text-[#EF4444] flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.roles}
                  </p>
                )}

                {selectedRoleIds.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[#6B7280] mb-2">
                      Roles seleccionados ({selectedRoleIds.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoleIds.map((id) => {
                        const rol = roles.find(r => r.id === id);
                        return rol ? (
                          <Badge key={id} className="bg-[#E0EDFF] text-[#2563EB]">
                            {rol.nombre}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Información de Cuenta */}
              <div className="space-y-4 pt-6 border-t border-[#E5E7EB]">
                <h3 className="text-lg font-semibold text-[#1E3A8A] flex items-center gap-2">
                  <User className="h-5 w-5 text-[#2563EB]" />
                  Información de Cuenta
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="correoElectronico">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="correoElectronico"
                      name="correoElectronico"
                      type="email"
                      placeholder="Ej: juan.perez@empresa.com"
                      value={formData.correoElectronico}
                      onChange={handleInputChange}
                      className={errors.correoElectronico ? "border-red-500" : ""}
                    />
                    {errors.correoElectronico && (
                      <p className="text-sm text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.correoElectronico}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombreUsuario">
                      Nombre de Usuario <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="nombreUsuario"
                        name="nombreUsuario"
                        placeholder="Ej: jperez"
                        value={formData.nombreUsuario}
                        onChange={handleInputChange}
                        className={`flex-1 ${errors.nombreUsuario ? "border-red-500" : ""}`}
                      />
                      <Button type="button" variant="outline" onClick={generarNombreUsuario}>
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                    {errors.nombreUsuario && (
                      <p className="text-sm text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.nombreUsuario}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contrasena">
                      Contraseña <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contrasena"
                      name="contrasena"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.contrasena}
                      onChange={handleInputChange}
                      className={errors.contrasena ? "border-red-500" : ""}
                    />
                    {errors.contrasena && (
                      <p className="text-sm text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.contrasena}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmarContrasena">
                      Confirmar Contraseña <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmarContrasena"
                      name="confirmarContrasena"
                      type="password"
                      placeholder="Repita la contraseña"
                      value={formData.confirmarContrasena}
                      onChange={handleInputChange}
                      className={errors.confirmarContrasena ? "border-red-500" : ""}
                    />
                    {errors.confirmarContrasena && (
                      <p className="text-sm text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.confirmarContrasena}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Estado del usuario */}
              <div className="pt-6 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="activo"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-[#2563EB] rounded focus:ring-[#2563EB]"
                  />
                  <Label htmlFor="activo" className="font-medium cursor-pointer">
                    Usuario Activo
                  </Label>
                  <Badge className={formData.activo ? "bg-[#ECFDF5] text-[#22C55E]" : "bg-gray-100 text-gray-600"}>
                    {formData.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <p className="text-sm text-[#6B7280] mt-2">
                  Los usuarios activos pueden iniciar sesión en el sistema
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4 pt-6 border-t border-[#E5E7EB]">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm"
                >
                  {loading ? "Guardando..." : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Guardar Usuario
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 border-[#E5E7EB] hover:bg-[#EFF6FF]"
                >
                  <X className="mr-2 h-5 w-5" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}