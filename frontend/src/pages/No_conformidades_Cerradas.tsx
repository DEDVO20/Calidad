import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/services/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PlusIcon, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function NoConformidadesCerradas() {
  const navigate = useNavigate();
  const [noConformidades, setNoConformidades] = useState<NoConformidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchNoConformidadesCerradas();
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

  const fetchNoConformidadesCerradas = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch("http://localhost:3000/api/noconformidades/cerradas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resp.ok) throw new Error("Error al obtener no conformidades cerradas");

      const data = await resp.json();
      const items = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

      const transformed = items.map((nc: any) => ({
        id: nc.id,
        codigo: nc.codigo,
        tipo: nc.tipo || "No Conformidad",
        descripcion: nc.descripcion,
        estado: nc.estado || "Cerrada",
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
          id: 21,
          codigo: "NC-2025-021",
          tipo: "Proceso",
          descripcion: "No conformidad cerrada - acción verificada",
          estado: "Cerrada",
          gravedad: "Menor",
          fechaDeteccion: "2025-09-12",
          responsable: "María López",
        },
        {
          id: 22,
          codigo: "NC-2025-022",
          tipo: "Producto",
          descripcion: "No conformidad cerrada - seguimiento completado",
          estado: "Cerrada",
          gravedad: "Mayor",
          fechaDeteccion: "2025-08-30",
          responsable: "Carlos Gómez",
        },
      ];
      setNoConformidades(ejemploData);
      setTotal(ejemploData.length);
    } finally {
      setLoading(false);
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

          <header className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">No Conformidades — Cerradas</h1>
              <p className="text-sm text-muted-foreground">{total} resultados</p>
            </div>
            <Button onClick={() => navigate("/noconformidades")} variant="secondary" size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Críticas</CardTitle>
                <CardDescription>Casos cerrados críticos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{criticas}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mayores</CardTitle>
                <CardDescription>Casos cerrados mayores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mayores}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Menores</CardTitle>
                <CardDescription>Casos cerrados menores</CardDescription>
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
                    <AlertTriangle className="mb-2 h-6 w-6" />
                    <p>No hay no conformidades cerradas.</p>
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
                        <tr key={nc.id} className="border-t hover:bg-muted/40">
                          <td className="p-3">{nc.codigo}</td>
                          <td className="p-3">{nc.tipo}</td>
                          <td className="p-3">{nc.descripcion}</td>
                          <td className="p-3">
                            <Badge variant="secondary">{nc.gravedad}</Badge>
                          </td>
                          <td className="p-3">{nc.fechaDeteccion}</td>
                          <td className="p-3">{nc.responsable}</td>
                          <td className="p-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/noconformidades/${nc.id}`)}
                            >
                              Ver
                            </Button>
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
