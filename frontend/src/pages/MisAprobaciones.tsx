import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCheck, Clock, CheckCircle, X, AlertCircle } from "lucide-react";
import { aprobacionesService, AprobacionesResumen } from "@/services/aprobaciones.service";
import { toast } from "sonner";

export default function MisAprobaciones() {
    const [data, setData] = useState<AprobacionesResumen | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const resumen = await aprobacionesService.getMisAprobaciones();
            setData(resumen);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al cargar mis aprobaciones");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-6 pt-6 w-full">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <FileCheck className="h-7 w-7 text-blue-600" />
                    Mis Aprobaciones
                </h1>
                <p className="text-gray-600 mt-2">
                    Resumen de tus aprobaciones y rechazos de documentos
                </p>
            </div>

            {/* Cards de resumen */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-blue-100">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Pendientes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-blue-600">
                            {data?.pendientes?.total || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-green-100">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Aprobados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-green-600">
                            {data?.aprobados?.total || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-100">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <X className="w-4 h-4" />
                            Rechazados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-red-600">
                            {data?.rechazados?.total || 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="pendientes" className="w-full">
                <TabsList>
                    <TabsTrigger value="pendientes">
                        Pendientes ({data?.pendientes?.total || 0})
                    </TabsTrigger>
                    <TabsTrigger value="aprobados">
                        Aprobados ({data?.aprobados?.total || 0})
                    </TabsTrigger>
                    <TabsTrigger value="rechazados">
                        Rechazados ({data?.rechazados?.total || 0})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pendientes" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            {data?.pendientes?.items.length === 0 ? (
                                <div className="text-center py-8">
                                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
                                    <p className="text-gray-600">No tienes documentos pendientes de aprobar</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {data?.pendientes?.items.map((doc: any) => (
                                        <div key={doc.id} className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col justify-between h-full bg-white shadow-sm transition-all hover:shadow-md">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge>Pendiente</Badge>
                                            </div>
                                            <div>
                                                <p className="font-medium text-lg leading-tight mb-1">{doc.nombreArchivo}</p>
                                                <p className="text-sm text-gray-600">Código: {doc.codigoDocumento || doc.codigo}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="aprobados" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            {data?.aprobados?.items.length === 0 ? (
                                <div className="text-center py-8">
                                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                    <p className="text-gray-600">No has aprobado ningún documento aún</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {data?.aprobados?.items.map((doc: any) => (
                                        <div key={doc.id} className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col justify-between h-full bg-white shadow-sm transition-all hover:shadow-md">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge className="bg-green-100 text-green-700">Aprobado</Badge>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(doc.fechaAprobacion).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-lg leading-tight mb-1">{doc.nombreArchivo}</p>
                                                <p className="text-sm text-gray-600">Código: {doc.codigoDocumento || doc.codigo}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rechazados" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            {data?.rechazados?.items.length === 0 ? (
                                <div className="text-center py-8">
                                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                    <p className="text-gray-600">No has rechazado ningún documento aún</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {data?.rechazados?.items.map((doc: any) => (
                                        <div key={doc.id} className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col justify-between h-full bg-white shadow-sm transition-all hover:shadow-md">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge className="bg-red-100 text-red-700">Rechazado</Badge>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(doc.fechaRechazo).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="mb-3">
                                                <p className="font-medium text-lg leading-tight mb-1">{doc.nombreArchivo}</p>
                                                <p className="text-sm text-gray-600">Código: {doc.codigoDocumento || doc.codigo}</p>
                                            </div>
                                            {doc.comentariosRechazo && (
                                                <div className="mt-auto p-2 bg-red-50 border border-red-100 rounded text-xs">
                                                    <p className="font-medium text-red-900 mb-1">Motivo:</p>
                                                    <p className="text-red-800 line-clamp-2" title={doc.comentariosRechazo}>{doc.comentariosRechazo}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
