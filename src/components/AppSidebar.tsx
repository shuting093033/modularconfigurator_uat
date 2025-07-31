import { NavLink, useLocation } from "react-router-dom";
import { History, Building2, BarChart3, Home, Wrench, Package, Database, TrendingUp, FileText, Brain } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const dashboardItems = [
  { title: "Overview", url: "/", icon: Home, description: "Main dashboard" },
  { title: "Executive Dashboard", url: "/executive-dashboard", icon: TrendingUp, description: "Portfolio metrics and business intelligence" },
  { title: "Analytics", url: "/analytics", icon: BarChart3, description: "Metrics & insights" },
  { title: "Advanced Reporting", url: "/advanced-reporting", icon: FileText, description: "Variance analysis & forecasting" },
];

const builderItems = [
  { title: "AI Estimate Builder", url: "/ai-estimate-builder", icon: Brain, description: "Natural language estimate creation" },
  { title: "Assembly Builder", url: "/assembly-builder", icon: Wrench, description: "Create component assemblies" },
  { title: "Estimate Configurator", url: "/datacenter-builder", icon: Database, description: "Build datacenter estimates" },
  { title: "Component Library", url: "/component-library", icon: Package, description: "Browse components" },
];

const estimateItems = [
  { title: "Saved Estimates", url: "/estimates", icon: History, description: "Manage estimates" },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar 
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar-background/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar-background/60"
    >
      <SidebarHeader className="border-b border-sidebar-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-sidebar-foreground">
              Baseline Estimate
            </span>
            <span className="truncate text-xs text-sidebar-foreground/70">
              Configurator & Analytics
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="group relative rounded-lg transition-all duration-200 hover:bg-sidebar-accent hover:shadow-sm data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm"
                  >
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${
                          isActive 
                            ? "text-sidebar-primary bg-sidebar-accent" 
                            : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{item.title}</div>
                        <div className="truncate text-xs text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70 transition-colors">
                          {item.description}
                        </div>
                      </div>
                      {isActive(item.url) && (
                        <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-3 py-2">
          <Separator />
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {builderItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="group relative rounded-lg transition-all duration-200 hover:bg-sidebar-accent hover:shadow-sm data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm"
                  >
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${
                          isActive 
                            ? "text-sidebar-primary bg-sidebar-accent" 
                            : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{item.title}</div>
                        <div className="truncate text-xs text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70 transition-colors">
                          {item.description}
                        </div>
                      </div>
                      {isActive(item.url) && (
                        <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-3 py-2">
          <Separator />
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {estimateItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="group relative rounded-lg transition-all duration-200 hover:bg-sidebar-accent hover:shadow-sm data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm"
                  >
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${
                          isActive 
                            ? "text-sidebar-primary bg-sidebar-accent" 
                            : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{item.title}</div>
                        <div className="truncate text-xs text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70 transition-colors">
                          {item.description}
                        </div>
                      </div>
                      {isActive(item.url) && (
                        <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}