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
import { getCurrentUser } from "@/services/auth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = getCurrentUser();

  const data = {
    user: {
      name: user ? `${user.nombre} ${user.primerApellido}` : "Usuario",
      email: user?.correoElectronico || "usuario@example.com",
      avatar: "/avatars/user.jpg",
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
            url: "#",
          },
          {
            title: "Asignar Responsables",
            url: "#",
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
            url: "#",
          },
          {
            title: "Nuevo Usuario",
            url: "#",
          },
          {
            title: "Roles y Permisos",
            url: "#",
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
            url: "#",
          },
          {
            title: "Control de Versiones",
            url: "#",
          },
          {
            title: "Aprobaciones Pendientes",
            url: "#",
          },
          {
            title: "Documentos Obsoletos",
            url: "#",
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
            url: "#",
          },
          {
            title: "En Proceso",
            url: "#",
          },
          {
            title: "Cerradas",
            url: "#",
          },
          {
            title: "Verificadas",
            url: "#",
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
          {
            title: "Historial Completo",
            url: "/No_conformidades_HistorialCompleto",
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
            url: "#",
          },
          {
            title: "En Curso",
            url: "#",
          },
          {
            title: "Completadas",
            url: "#",
          },
          {
            title: "Hallazgos",
            url: "#",
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
            url: "#",
          },
          {
            title: "Seguimiento",
            url: "#",
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
