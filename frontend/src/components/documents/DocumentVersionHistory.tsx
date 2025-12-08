import { useState, useEffect } from "react";
import {
    versionDocumentoService,
    VersionDocumentoData,
} from "@/services/versionDocumento.service";
import { toast } from "sonner";
import {
    Clock,
    Download,
    RotateCcw,
    FileText,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface DocumentVersionHistoryProps {
    documentoId: string;
    onVersionRestored?: () => void;
}

export function DocumentVersionHistory({
    documentoId,
    onVersionRestored,
}: DocumentVersionHistoryProps) {
    const [versiones, setVersiones] = useState<VersionDocumentoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [restoring, setRestoring] = useState<string | null>(null);

    const fetchVersiones = async () => {
        try {
            setLoading(true);
            const data = await versionDocumentoService.getByDocumento(documentoId);
            setVersiones(data);
        } catch (error) {
            console.error("Error al cargar versiones:", error);
            toast.error(
                error instanceof Error ? error.message : "Error al cargar versiones"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (documentoId) {
            fetchVersiones();
        }
    }, [documentoId]);

    const handleRestore = async (versionId: string, versionString: string) => {
        const confirmed = window.confirm(
            `¿Estás seguro de restaurar la versión ${versionString}? Esto creará una copia de seguridad de la versión actual.`
        );

        if (!confirmed) return;

        try {
            setRestoring(versionId);
            await versionDocumentoService.restore(versionId);
            toast.success(`Versión ${versionString} restaurada correctamente`);
            if (onVersionRestored) {
                onVersionRestored();
            }
            // Recargar versiones
            await fetchVersiones();
        } catch (error) {
            console.error("Error al restaurar versión:", error);
            toast.error(
                error instanceof Error ? error.message : "Error al restaurar versión"
            );
        } finally {
            setRestoring(null);
        }
    };

    const handleDownload = async (versionId: string) => {
        try {
            await versionDocumentoService.download(versionId);
            toast.success("Descarga iniciada");
        } catch (error) {
            console.error("Error al descargar:", error);
            toast.error(
                error instanceof Error ? error.message : "Error al descargar archivo"
            );
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Historial de Versiones</CardTitle>
                    <CardDescription>Cargando versiones...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (versiones.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Historial de Versiones</CardTitle>
                    <CardDescription>
                        No hay versiones históricas para este documento
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mb-3 opacity-50" />
                        <p>Este documento aún no tiene versiones anteriores</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Historial de Versiones</CardTitle>
                <CardDescription>
                    Versiones anteriores de este documento
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {versiones.map((version, index) => (
                        <div
                            key={version.id}
                            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                            {/* Timeline indicator */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${version.estado === "activa"
                                            ? "bg-green-500 text-white"
                                            : "bg-blue-500 text-white"
                                        }`}
                                >
                                    {version.estado === "activa" ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <Clock className="w-5 h-5" />
                                    )}
                                </div>
                                {index < versiones.length - 1 && (
                                    <div className="w-0.5 h-16 bg-border mt-2"></div>
                                )}
                            </div>

                            {/* Version info */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h4 className="font-semibold text-lg">
                                            Versión {version.versionString}
                                            {version.estado === "activa" && (
                                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                    Activa
                                                </span>
                                            )}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(version.subidoEn).toLocaleString("es-ES", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDownload(version.id)}
                                        >
                                            <Download className="w-4 h-4 mr-1" />
                                            Descargar
                                        </Button>
                                        {version.estado !== "activa" && (
                                            <Button
                                                size="sm"
                                                variant="default"
                                                onClick={() =>
                                                    handleRestore(version.id, version.versionString)
                                                }
                                                disabled={restoring === version.id}
                                            >
                                                <RotateCcw className="w-4 h-4 mr-1" />
                                                {restoring === version.id
                                                    ? "Restaurando..."
                                                    : "Restaurar"}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {version.cambios && (
                                    <div className="bg-muted p-3 rounded-md mt-2">
                                        <p className="text-sm">
                                            <strong>Cambios:</strong> {version.cambios}
                                        </p>
                                    </div>
                                )}

                                {version.nombreArchivo && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        <FileText className="w-3 h-3 inline mr-1" />
                                        {version.nombreArchivo}
                                        {version.tamañoBytes && (
                                            <span className="ml-2">
                                                ({(version.tamañoBytes / 1024).toFixed(2)} KB)
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
