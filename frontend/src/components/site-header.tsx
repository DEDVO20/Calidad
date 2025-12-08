import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { notificacionesService, Notificacion } from "@/services/notificaciones.service";

export function SiteHeader() {
  const location = useLocation();
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  // Obtener contador de notificaciones no leídas
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await notificacionesService.getNoLeidasCount();
        setNotificacionesCount(count);
      } catch (error) {
        console.error("Error al cargar contador de notificaciones:", error);
      }
    };

    fetchCount();

    // Actualizar cada 30 segundos
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // Cargar lista de notificaciones cuando se abre el dropdown
  const handleOpenNotifications = async () => {
    if (loadingNotifs) return;

    setLoadingNotifs(true);
    try {
      const response = await notificacionesService.getNotificaciones(false); // Solo no leídas
      setNotificaciones(response.items.slice(0, 5)); // Máximo 5 notificaciones
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setLoadingNotifs(false);
    }
  };

  // Marcar notificación como leída
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificacionesService.marcarComoLeida(id);
      // Actualizar contador y lista
      setNotificacionesCount(prev => Math.max(0, prev - 1));
      setNotificaciones(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  // Función para obtener tiempo relativo
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Ahora mismo";
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;

    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  };

  // Obtener el nombre de la página actual desde la ruta
  const getPageName = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path.includes("/perfil")) return "Mi Perfil";
    if (path.includes("/usuarios")) return "Usuarios";
    if (path.includes("/documentos")) return "Documentos";
    if (path.includes("/control-versiones")) return "Control de Versiones";
    if (path.includes("/procesos")) return "Procesos";
    if (path.includes("/auditorias")) return "Auditorías";

    // Gestión de Áreas
    if (path.includes("/gestionar_areas")) return "Gestionar Áreas";
    if (path.includes("/Asignar_Responsables")) return "Asignar Responsables";

    //usuarios 
    if (path.includes("/ListaDeUsuarios")) return "Lista de Usuarios";
    if (path.includes("/NuevoUsuario")) return "Nuevo Usuario";

    // No Conformidades - rutas específicas
    if (path.includes("/No_conformidades_Abiertas"))
      return "No Conformidades Abiertas";
    if (path.includes("/No_conformidades_EnTratamiento"))
      return "No Conformidades en Tratamiento";
    if (path.includes("/No_conformidades_Cerradas"))
      return "No Conformidades Cerradas";
    if (path.includes("/no-conformidades")) return "No Conformidades";

    if (path.includes("/Acciones_correctivas_Cerradas"))
      return "Acciones Correctivas Cerradas";

    if (path.includes("/Acciones_correctivas_Verificadas"))
      return "Acciones Correctivas Verificadas";

    if (path.includes("/acciones-correctivas")) return "Acciones Correctivas";
    if (path.includes("/riesgos")) return "Riesgos";
    if (path.includes("/indicadores")) return "Indicadores";
    if (path.includes("/capacitaciones")) return "Capacitaciones";
    return "Dashboard";
  };
  return (
    <header className="sticky top-0 z-50 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear bg-background">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Breadcrumb dinámico */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link to="/dashboard" className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" />
                  SGC ISO 9001
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">
                {getPageName()}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Barra de búsqueda */}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar documentos, auditorías..."
              className="w-64 pl-8 h-9"
            />
          </div>

          {/* Notificaciones */}
          <DropdownMenu onOpenChange={(open) => open && handleOpenNotifications()}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative h-9 w-9"
              >
                <Bell className="h-4 w-4" />
                {notificacionesCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {notificacionesCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {loadingNotifs ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Cargando...
                </div>
              ) : notificaciones.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No tienes notificaciones nuevas
                </div>
              ) : (
                notificaciones.map((notif, index) => (
                  <div key={notif.id}>
                    {index > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuItem
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <p className="text-sm font-medium">{notif.titulo}</p>
                        <p className="text-xs text-muted-foreground">
                          {notif.mensaje}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getTimeAgo(notif.creadoEn)}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                ))
              )}

              {notificaciones.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-sm cursor-pointer">
                    Marcar todas como leídas
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
