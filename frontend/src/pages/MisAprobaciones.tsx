import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCheck, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7FA]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
          <p className="mt-4 text-lg font-medium text-[#6B7280]">Cargando mis aprobaciones...</p>
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
                <FileCheck className="h-9 w-9 text-[#2563EB]" />
                Mis Aprobaciones
              </h1>
              <p className="text-[#6B7280] mt-2 text-lg">
                Resumen completo de los documentos que has revisado y aprobado
              </p>
            </div>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#EFF6FF] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Pendientes</CardTitle>
                <Clock className="h-8 w-8 text-[#2563EB]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">
                {data?.pendientes?.total || 0}
              </div>
              <p className="text-[#6B7280] text-sm mt-1">Requieren tu aprobación</p>
            </CardHeader>
          </Card>

          <Card className="bg-[#ECFDF5] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Aprobados</CardTitle>
                <CheckCircle className="h-8 w-8 text-[#22C55E]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">
                {data?.aprobados?.total || 0}
              </div>
              <p className="text-[#6B7280] text-sm mt-1">Documentos aprobados por ti</p>
            </CardHeader>
          </Card>

          <Card className="bg-[#FEF2F2] border border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1E3A8A]">Rechazados</CardTitle>
                <XCircle className="h-8 w-8 text-[#EF4444]" />
              </div>
              <div className="text-4xl font-bold text-[#1E3A8A] mt-4">
                {data?.rechazados?.total || 0}
              </div>
              <p className="text-[#6B7280] text-sm mt-1">Documentos rechazados por ti</p>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs con documentos */}
        <Tabs defaultValue="pendientes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-[#F1F5F9]">
            <TabsTrigger value="pendientes" className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white">
              Pendientes ({data?.pendientes?.total || 0})
            </TabsTrigger>
            <TabsTrigger value="aprobados" className="data-[state=active]:bg-[#22C55E] data-[state=active]:text-white">
              Aprobados ({data?.aprobados?.total || 0})
            </TabsTrigger>
            <TabsTrigger value="rechazados" className="data-[state=active]:bg-[#EF4444] data-[state=active]:text-white">
              Rechazados ({data?.rechazados?.total || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pendientes">
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                {data?.pendientes?.items.length === 0 ? (
                  <div className="text-center py-16">
                    <CheckCircle className="mx-auto h-16 w-16 text-[#22C55E] mb-4" />
                    <p className="text-xl font-medium text-[#1E3A8A]">¡Todo al día!</p>
                    <p className="text-[#6B7280] mt-2">No tienes documentos pendientes de aprobar</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.pendientes?.items.map((doc: any) => (
                      <Card key={doc.id} className="hover:shadow-md transition-shadow border-[#E5E7EB]">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-[#EFF6FF] text-[#2563EB]">Pendiente</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="font-semibold text-lg text-gray-900 line-clamp-2">{doc.nombreArchivo}</p>
                          <p className="text-sm text-[#6B7280] mt-2">Código: {doc.codigoDocumento || doc.codigo}</p>
                          <p className="text-sm text-[#6B7280] mt-1">Versión: v{doc.version || "1.0"}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aprobados">
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                {data?.aprobados?.items.length === 0 ? (
                  <div className="text-center py-16">
                    <AlertCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-[#6B7280]">Aún no has aprobado documentos</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.aprobados?.items.map((doc: any) => (
                      <Card key={doc.id} className="hover:shadow-md transition-shadow border-[#E5E7EB]">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-[#ECFDF5] text-[#22C55E]">Aprobado</Badge>
                            <span className="text-xs text-[#6B7280]">
                              {new Date(doc.fechaAprobacion).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="font-semibold text-lg text-gray-900 line-clamp-2">{doc.nombreArchivo}</p>
                          <p className="text-sm text-[#6B7280] mt-2">Código: {doc.codigoDocumento || doc.codigo}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rechazados">
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                {data?.rechazados?.items.length === 0 ? (
                  <div className="text-center py-16">
                    <AlertCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-[#6B7280]">Aún no has rechazado documentos</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.rechazados?.items.map((doc: any) => (
                      <Card key={doc.id} className="hover:shadow-md transition-shadow border-[#E5E7EB]">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-[#FEF2F2] text-[#EF4444]">Rechazado</Badge>
                            <span className="text-xs text-[#6B7280]">
                              {new Date(doc.fechaRechazo).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="font-semibold text-lg text-gray-900 line-clamp-2">{doc.nombreArchivo}</p>
                            <p className="text-sm text-[#6B7280] mt-2">Código: {doc.codigoDocumento || doc.codigo}</p>
                          </div>
                          {doc.comentariosRechazo && (
                            <div className="bg-[#FEF2F2] border border-[#EF4444] rounded-lg p-3">
                              <p className="text-sm font-medium text-[#991B1B]">Motivo del rechazo:</p>
                              <p className="text-sm text-[#DC2626] mt-1">{doc.comentariosRechazo}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}