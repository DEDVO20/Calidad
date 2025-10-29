import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/services/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";

interface NoConformidad {
  id: number;
  codigo: string;
  tipo: string;
  descripcion: string;
  estado: string;
  gravedad: string;
  fechaDeteccion: string;
  responsable: string;
}

export default function NoConformidadesEnTratamiento() {
  const navigate = useNavigate();
  const [noConformidades, setNoConformidades] = useState<NoConformidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchNoConformidadesEnTratamiento();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const normalizeGravedad = (raw?: string) => {
    if (!raw) return "N/A";
    const g = String(raw).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (g === "critica") return "Crítica";
    if (g === "mayor") return "Mayor";
    if (g === "menor") return "Menor";
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  };

  const fetchNoConformidadesEnTratamiento = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch("http://localhost:3000/api/noconformidades/en-tratamiento", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resp.ok) throw new Error("Error al obtener no conformidades en tratamiento");

      const data = await resp.json();
      const items = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

      const transformed = items.map((nc: any) => ({
        id: nc.id,
        codigo: nc.codigo,
        tipo: nc.tipo || "No Conformidad",
        descripcion: nc.descripcion,
        estado: "En Tratamiento",
        gravedad: normalizeGravedad(nc.gravedad),
        fechaDeteccion: nc.fechaDeteccion?.split?.("T")?.[0] ?? nc.fechaDeteccion ?? "—",
        responsable: nc.responsable?.nombre
          ? `${nc.responsable.nombre} ${nc.responsable.primerApellido || ""}`.trim()
          : "Sin asignar",
      }));

      setNoConformidades(transformed);
      setTotal(typeof data.total === "number" ? data.total : transformed.length);
    } catch (error) {
      console.error("Error:", error);
      const ejemploData: NoConformidad[] = [
        {
          id: 10,
          codigo: "NC-2025-010",
          tipo: "Proceso",
          descripcion: "Tratamiento en curso para desviación lote B-123",
          estado: "En Tratamiento",
          gravedad: "Mayor",
          fechaDeteccion: "2025-10-01",
          responsable: "Luis Pérez",
        },
        {
          id: 11,
          codigo: "NC-2025-011",
          tipo: "Producto",
          descripcion: "Acciones en ejecución por defecto detectado",
          estado: "En Tratamiento",
          gravedad: "Menor",
          fechaDeteccion: "2025-10-10",
          responsable: "Ana Ruiz",
        },
      ];
      setNoConformidades(ejemploData);
      setTotal(ejemploData.length);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarTratamiento = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`http://localhost:3000/api/noconformidades/${id}/finalizar-tratamiento`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) throw new Error("Error al finalizar tratamiento");

      fetchNoConformidadesEnTratamiento();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  const mayores = noConformidades.filter((nc) => normalizeGravedad(nc.gravedad).toLowerCase() === "mayor").length;
  const menores = noConformidades.filter((nc) => normalizeGravedad(nc.gravedad).toLowerCase() === "menor").length;
  const criticas = noConformidades.filter((nc) => {
    const g = normalizeGravedad(nc.gravedad).toLowerCase();
    return g === "crítica" || g === "critica";
  }).length;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
          <SiteHeader />

          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">No Conformidades — En Tratamiento</h1>
              <p className="text-sm text-muted-foreground">{total} resultados</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/noconformidades")} variant="secondary" size="sm">
                <PlusIcon className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </div>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Críticas</CardTitle>
                <CardDescription>Casos en tratamiento críticos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{criticas}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mayores</CardTitle>
                <CardDescription>Casos en tratamiento mayores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mayores}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Menores</CardTitle>
                <CardDescription>Casos en tratamiento menores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{menores}</div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-4 bg-white rounded shadow overflow-auto">
            <div className="rounded-xl border bg-card p-4">
              <DataTable data={noConformidades}>
                {noConformidades.length === 0 ? (
                  <div className="p-6 flex flex-col items-center justify-center text-muted-foreground">
                    <p>No hay no conformidades en tratamiento.</p>
                  </div>
                ) : (
                  <table className="w-full table-auto">
                    <thead className="text-left">
                      <tr>
                        <th className="p-3">Código</th>
                        <th className="p-3">Tipo</th>
                        <th className="p-3">Descripción</th>
                        <th className="p-3">Gravedad</th>
                        <th className="p-3">Fecha</th>
                        <th className="p-3">Responsable</th>
                        <th className="p-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {noConformidades.map((nc) => (
                        <tr key={nc.id} className="border-t">
                          <td className="p-3">{nc.codigo}</td>
                          <td className="p-3">{nc.tipo}</td>
                          <td className="p-3">{nc.descripcion}</td>
                          <td className="p-3">
                            <Badge variant="secondary">{nc.gravedad}</Badge>
                          </td>
                          <td className="p-3">{nc.fechaDeteccion}</td>
                          <td className="p-3">{nc.responsable}</td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button size="sm" variant="default" onClick={() => handleFinalizarTratamiento(nc.id)}>
                                Finalizar
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => navigate(`/noconformidades/${nc.id}`)}>
                                Ver
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </DataTable>
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
