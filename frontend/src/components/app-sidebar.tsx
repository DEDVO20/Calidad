import * as React from "react";
import {
  Building2,
  Users,
  FileText,
  AlertTriangle,
  ClipboardCheck,
  FolderOpen,
  BarChart3,
  LayoutDashboard,
  Shield,
  Target,
  GraduationCap,
  TrendingUp,
  FileCheck,
  BookOpen,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getCurrentUser, getToken } from "@/services/auth";
import axios from "axios";

const API_URL = "/api";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState(getCurrentUser());

  // Cargar perfil completo del usuario al montar
  React.useEffect(() => {
    const cargarPerfilCompleto = async () => {
      const currentUser = getCurrentUser();
      const token = getToken();
      if (currentUser?.id && token) {
        try {
          const res = await axios.get(`${API_URL}/usuarios/${currentUser.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // Actualizar localStorage con datos frescos (solo fotoUrl en camelCase)
          const updatedUser = {
            ...currentUser,
            ...res.data,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        } catch (error) {
          console.error("Error cargando perfil completo:", error);
        }
      }
    };

    cargarPerfilCompleto();
  }, []);

  // Actualizar usuario cuando cambie en localStorage
  React.useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };

    // Escuchar cambios en localStorage
    window.addEventListener("storage", handleStorageChange);

    // Polling para detectar cambios internos (mismo tab)
    const interval = setInterval(() => {
      const updatedUser = getCurrentUser();
      if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {
        setUser(updatedUser);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  const data = {
    user: {
      name: user ? `${user.nombre} ${user.primerApellido}` : "Usuario",
      email: user?.correoElectronico || "usuario@example.com",
      avatar: "/avatars/user.jpg",
      fotoUrl: user?.fotoUrl || "",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Áreas",
        url: "#",
        icon: Building2,
        items: [
          {
            title: "Gestionar Áreas",
            url: "/gestionar_areas",
          },
          {
            title: "Asignar Responsables",
            url: "/Asignar_Responsables",
          },
        ],
      },
      {
        title: "Usuarios",
        url: "#",
        icon: Users,
        items: [
          {
            title: "Lista de Usuarios",
            url: "/ListaDeUsuarios",
          },
          {
            title: "Nuevo Usuario",
            url: "/NuevoUsuario",
          },
          {
            title: "Roles y Permisos",
            url: "/Roles_y_Permisos",
          },
        ],
      },
      {
        title: "Documentos",
        url: "#",
        icon: FileText,
        items: [
          {
            title: "Gestión Documental",
            url: "/documentos",
          },
          {
            title: "Control de Versiones",
            url: "/control-versiones",
            
          },
          {
            title: "Aprobaciones Pendientes",
            url: "/Aprobaciones_Pendientes",
          },
          {
            title: "Documentos Obsoletos",
            url: "/Documentos_Obsoletos",
          },
        ],
      },
      {
        title: "Procesos",
        url: "#",
        icon: FolderOpen,
        items: [
          {
            title: "Mapa de Procesos",
            url: "#",
          },
          {
            title: "Gestionar Procesos",
            url: "#",
          },
          {
            title: "Instancias Activas",
            url: "#",
          },
        ],
      },
    ],
    navQuality: [
      {
        title: "Acciones Correctivas",
        icon: AlertTriangle,
        url: "#",
        items: [
          {
            title: "Nuevas",
            url: "/Acciones_correctivas_Nuevas",
          },
          {
            title: "En Proceso",
            url: "/Acciones_correctivas_EnProceso",
          },
          {
            title: "Cerradas",
            url: "/Acciones_correctivas_Cerradas",
          },
          {
            title: "Verificadas",
            url: "/Acciones_correctivas_Verificadas",
          },
        ],
      },
      {
        title: "No Conformidades",
        icon: ClipboardCheck,
        url: "#",
        items: [
          {
            title: "Abiertas",
            url: "/No_conformidades_Abiertas",
          },
          {
            title: "En Tratamiento",
            url: "/No_conformidades_EnTratamiento",
          },
          {
            title: "Cerradas",
            url: "/No_conformidades_Cerradas",
          },
        ],
      },
      {
        title: "Auditorías",
        icon: FileCheck,
        url: "#",
        items: [
          {
            title: "Planificación",
            url: "/AuditoriasPlanificacion",
          },
          {
            title: "En Curso",
            url: "/AuditoriasEnCurso",
          },
          {
            title: "Completadas",
            url: "/AuditoriasCompletas",
          },
          {
            title: "Hallazgos",
            url: "/AuditoriasHallazgosView",
          },
        ],
      },
      {
        title: "Riesgos",
        icon: Shield,
        url: "#",
        items: [
          {
            title: "Matriz de Riesgos",
            url: "#",
          },
          {
            title: "Controles",
            url: "#",
          },
          {
            title: "Tratamiento",
            url: "#",
          },
        ],
      },
      {
        title: "Objetivos de Calidad",
        icon: Target,
        url: "#",
        items: [
          {
            title: "Objetivos Activos",
            url: "/Activos",
          },
          {
            title: "Seguimiento",
            url: "/Seguimiento",
          },
          {
            title: "Historial",
            url: "#",
          },
        ],
      },
      {
        title: "Indicadores",
        icon: TrendingUp,
        url: "#",
        items: [
          {
            title: "Tablero de Indicadores",
            url: "#",
          },
          {
            title: "Eficacia",
            url: "#",
          },
          {
            title: "Eficiencia",
            url: "#",
          },
          {
            title: "Cumplimiento",
            url: "#",
          },
        ],
      },
      {
        title: "Capacitaciones",
        icon: GraduationCap,
        url: "#",
        items: [
          {
            title: "Programadas",
            url: "#",
          },
          {
            title: "Historial",
            url: "#",
          },
          {
            title: "Asistencias",
            url: "#",
          },
          {
            title: "Competencias",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Reportes",
        url: "#",
        icon: BarChart3,
      },
      {
        title: "Manual de Usuario",
        url: "#",
        icon: BookOpen,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SGC ISO 9001</span>
                  <span className="truncate text-xs">Sistema de Calidad</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} title="Gestión" />
        <NavMain items={data.navQuality} title="Calidad" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
