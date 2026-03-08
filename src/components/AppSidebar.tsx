import { useLocation, Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { useState } from "react";
import { tools, categories } from "@/config/tools";
import { NavLink } from "@/components/NavLink";
import { Input } from "@/components/ui/input";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [search, setSearch] = useState("");
  const location = useLocation();

  const filtered = tools.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end activeClassName="bg-sidebar-accent text-primary font-medium">
                    <Home className="h-4 w-4" />
                    {!collapsed && <span>Home</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs bg-sidebar-accent border-sidebar-border"
              />
            </div>
          </div>
        )}

        {categories.map(cat => {
          const catTools = filtered.filter(t => t.category === cat.id);
          if (catTools.length === 0) return null;
          return (
            <SidebarGroup key={cat.id} defaultOpen>
              <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                {!collapsed ? cat.label : ""}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {catTools.map(tool => (
                    <SidebarMenuItem key={tool.id}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={tool.path}
                          end
                          className="text-sm"
                          activeClassName="bg-sidebar-accent text-primary font-medium"
                        >
                          <tool.icon className="h-4 w-4" />
                          {!collapsed && <span>{tool.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
