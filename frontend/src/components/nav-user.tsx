import { useEffect, useMemo, useState } from "react";

import {
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
  Settings,
  Shield,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { logout } from "@/services/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
    foto_url?: string;
  };
}) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      navigate("/login");
    }
  };

  // Generar iniciales del nombre para el fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userInitials = getInitials(user.name);
  // Sanitizar y resolver foto_url con fallback
  const sanitizedFoto = useMemo(() => {
    const raw = user.foto_url ?? "";
    const v = typeof raw === "string" ? raw.trim() : "";
    if (
      v.startsWith("http://") ||
      v.startsWith("https://") ||
      v.startsWith("/")
    )
      return v;
    return "";
  }, [user.foto_url]);
  const [photoSrc, setPhotoSrc] = useState<string>(
    sanitizedFoto || user.avatar,
  );
  // Forzar re-render cuando cambie la fuente
  useEffect(() => {
    setPhotoSrc(sanitizedFoto || user.avatar);
  }, [sanitizedFoto, user.avatar]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  key={photoSrc}
                  src={photoSrc}
                  alt={user.name}
                  onError={() => {
                    if (photoSrc !== user.avatar) setPhotoSrc(user.avatar);
                  }}
                />

                <AvatarFallback className="rounded-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    key={photoSrc + "-menu"}
                    src={photoSrc}
                    alt={user.name}
                    onError={() => {
                      if (photoSrc !== user.avatar) setPhotoSrc(user.avatar);
                    }}
                  />

                  <AvatarFallback className="rounded-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/perfil")}>
                <UserCircleIcon />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield />
                Seguridad
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
