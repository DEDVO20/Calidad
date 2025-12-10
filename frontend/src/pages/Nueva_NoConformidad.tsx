import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, X, AlertCircle, AlertTriangle } from "lucide-react";
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

    const getAuthToken = () => {
        return localStorage.getItem("token");
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();

            if (!token) {
                throw new Error("No hay sesión activa");
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const [usuariosRes, areasRes, procesosRes] = await Promise.all([
                fetch(`${API_URL}/usuarios`, { headers }),
                fetch(`${API_URL}/areas`, { headers }),
                fetch(`${API_URL}/procesos`, { headers }),
            ]);

            if (!usuariosRes.ok) throw new Error("Error al cargar usuarios");
            if (!areasRes.ok) throw new Error("Error al cargar áreas");
            if (!procesosRes.ok) throw new Error("Error al cargar procesos");

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
                description: "Código, Tipo y Descripción son requeridos."
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
                description: error.message || "Ocurrió un error inesperado."
            });
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (confirm("¿Estás seguro de cancelar? Se perderán los datos ingresados.")) {
            navigate("/No_conformidades_Abiertas");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
                    <p className="mt-4 text-sm text-gray-500">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-orange-500" />
                        Nueva No Conformidad
                    </h1>
                    <p className="text-gray-500">
                        Registra una nueva no conformidad detectada
                    </p>
                </div>
            </div>

            {error && (
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-amber-800">
                            <AlertCircle className="h-5 w-5" />
                            <div>
                                <p className="font-medium">Error de conexión</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Información de la No Conformidad</CardTitle>
                        <CardDescription>
                            Completa todos los campos marcados con * para registrar la no conformidad
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Código */}
                            <div className="grid gap-2">
                                <Label htmlFor="codigo">Código *</Label>
                                <Input
                                    id="codigo"
                                    placeholder="Ej: NC-2024-001"
                                    value={formData.codigo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, codigo: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            {/* Tipo */}
                            <div className="grid gap-2">
                                <Label htmlFor="tipo">Tipo *</Label>
                                <Select
                                    value={formData.tipo}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, tipo: value })
                                    }
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
                            <div className="grid gap-2">
                                <Label htmlFor="fuente">Fuente</Label>
                                <Select
                                    value={formData.fuente}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, fuente: value })
                                    }
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
                            <div className="grid gap-2">
                                <Label htmlFor="fechaDeteccion">Fecha de Detección *</Label>
                                <Input
                                    id="fechaDeteccion"
                                    type="date"
                                    value={formData.fechaDeteccion}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fechaDeteccion: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            {/* Área */}
                            <div className="grid gap-2">
                                <Label htmlFor="areaId">Área Afectada</Label>
                                <Select
                                    value={formData.areaId}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, areaId: value })
                                    }
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
                            <div className="grid gap-2">
                                <Label htmlFor="procesoId">Proceso Relacionado</Label>
                                <Select
                                    value={formData.procesoId}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, procesoId: value })
                                    }
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
                            <div className="grid gap-2">
                                <Label htmlFor="detectadoPor">Detectado Por</Label>
                                <Select
                                    value={formData.detectadoPor}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, detectadoPor: value })
                                    }
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
                            <div className="grid gap-2">
                                <Label htmlFor="responsableId">Responsable de Tratamiento</Label>
                                <Select
                                    value={formData.responsableId}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, responsableId: value })
                                    }
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
                        <div className="grid gap-2">
                            <Label htmlFor="descripcion">Descripción *</Label>
                            <Textarea
                                id="descripcion"
                                placeholder="Describe la no conformidad detectada..."
                                rows={4}
                                value={formData.descripcion}
                                onChange={(e) =>
                                    setFormData({ ...formData, descripcion: e.target.value })
                                }
                                required
                            />
                        </div>

                        {/* Análisis de Causa */}
                        <div className="grid gap-2">
                            <Label htmlFor="analisisCausa">Análisis de Causa (Opcional)</Label>
                            <Textarea
                                id="analisisCausa"
                                placeholder="Análisis preliminar de las causas..."
                                rows={3}
                                value={formData.analisisCausa}
                                onChange={(e) =>
                                    setFormData({ ...formData, analisisCausa: e.target.value })
                                }
                            />
                        </div>

                        {/* Plan de Acción */}
                        <div className="grid gap-2">
                            <Label htmlFor="planAccion">Plan de Acción (Opcional)</Label>
                            <Textarea
                                id="planAccion"
                                placeholder="Plan de acción propuesto..."
                                rows={3}
                                value={formData.planAccion}
                                onChange={(e) =>
                                    setFormData({ ...formData, planAccion: e.target.value })
                                }
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                disabled={saving}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Crear No Conformidad
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
