import { ChevronRight, type LucideIcon } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
  title,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  title?: string;
}) {
  const location = useLocation();
  const { state, setOpen } = useSidebar();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Determinar qué menús deben estar abiertos basándose en la ruta actual
  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.items) {
        // Verificar si algún subitem coincide con la ruta actual
        const isActive = item.items.some(
          (subItem) => location.pathname === subItem.url
        );
        newOpenMenus[item.title] = isActive;
      }
    });
    setOpenMenus(newOpenMenus);
  }, [location.pathname, items]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleMenuClick = (item: typeof items[0], e: React.MouseEvent) => {
    // Si el sidebar está colapsado y hay subitems, expandir el sidebar
    if (state === "collapsed" && item.items && item.items.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    }
  };

  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) =>
          item.items ? (
            <Collapsible
              key={item.title}
              asChild
              open={openMenus[item.title] || false}
              onOpenChange={() => toggleMenu(item.title)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={(e) => handleMenuClick(item, e)}
                    className="group-data-[collapsible=icon]:justify-center"
                  >
                    {item.icon && <item.icon />}
                    <span className="overflow-hidden">{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link to={subItem.url}>
                            <span className="overflow-hidden">{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                className="group-data-[collapsible=icon]:justify-center"
              >
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span className="overflow-hidden">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
