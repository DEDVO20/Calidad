import { useEffect, useState } from "react";
import { Target, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_URL = "http://localhost:3000/api";

interface Indicador {
  id: string;
  procesoId?: string;
  clave: string;
  descripcion?: string;
  valor?: number;
  periodoInicio?: string;
  periodoFin?: string;
  creadoEn: string;
}

export default function EficaciaIndicadores() {
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIndicadores();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchIndicadores = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error("No hay sesión activa");
      }

      const response = await fetch(`${API_URL}/indicadores`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar indicadores");
      }

      const data = await response.json();
      // Filtrar indicadores de eficacia (puedes ajustar este filtro según tu lógica)
      const indicadoresEficacia = data.filter((ind: Indicador) => 
        ind.clave.toLowerCase().includes('eficacia') || 
        ind.descripcion?.toLowerCase().includes('eficacia') ||
        ind.descripcion?.toLowerCase().includes('objetivo')
      );
      setIndicadores(indicadoresEficacia);
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const promedioEficacia = indicadores.length > 0 
    ? indicadores.reduce((sum, ind) => sum + (ind.valor || 0), 0) / indicadores.length 
    : 0;
  
  const objetivosCumplidos = indicadores.filter(ind => (ind.valor || 0) >= 80).length;
  const objetivosEnRiesgo = indicadores.filter(ind => (ind.valor || 0) < 80 && (ind.valor || 0) >= 50).length;
  const objetivosIncumplidos = indicadores.filter(ind => (ind.valor || 0) < 50).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-sm text-gray-500">Cargando indicadores de eficacia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6 text-sky-500" />
            Eficacia
          </h1>
          <p className="text-gray-500">
            Mida qué tan bien logra sus objetivos
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
                <button 
                  className="text-sm underline mt-1 inline-block"
                  onClick={fetchIndicadores}
                >
                  Intentar nuevamente
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Eficacia Promedio</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{promedioEficacia.toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-1">Del total de objetivos</p>
          </CardHeader>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-800">Objetivos Cumplidos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-700">{objetivosCumplidos}</div>
            <p className="text-xs text-green-600 mt-1">≥ 80% de logro</p>
          </CardHeader>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-amber-800">En Riesgo</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-amber-700">{objetivosEnRiesgo}</div>
            <p className="text-xs text-amber-600 mt-1">50-79% de logro</p>
          </CardHeader>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-red-800">Incumplidos</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
            </div>
            <div className="text-2xl font-bold text-red-700">{objetivosIncumplidos}</div>
            <p className="text-xs text-red-600 mt-1">&lt; 50% de logro</p>
          </CardHeader>
        </Card>
      </div>

      {/* Tabla de indicadores de eficacia */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores de Eficacia</CardTitle>
          <CardDescription>
            Seguimiento del cumplimiento de objetivos organizacionales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Indicador</th>
                    <th className="text-left p-3 text-sm font-medium">Descripción</th>
                    <th className="text-left p-3 text-sm font-medium w-32">Logro</th>
                    <th className="text-left p-3 text-sm font-medium w-32">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {indicadores.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center p-12 text-gray-500">
                        No hay indicadores de eficacia registrados
                      </td>
                    </tr>
                  ) : (
                    indicadores.map((indicador) => {
                      const valor = indicador.valor || 0;
                      let badgeColor = "bg-red-500";
                      let estado = "Incumplido";
                      
                      if (valor >= 80) {
                        badgeColor = "bg-green-500";
                        estado = "Cumplido";
                      } else if (valor >= 50) {
                        badgeColor = "bg-amber-500";
                        estado = "En Riesgo";
                      }

                      return (
                        <tr key={indicador.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{indicador.clave}</td>
                          <td className="p-3">
                            {indicador.descripcion || "Sin descripción"}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${badgeColor}`}
                                  style={{ width: `${Math.min(valor, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold w-12">
                                {valor.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={badgeColor}>{estado}</Badge>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}