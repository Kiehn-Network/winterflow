import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  Users,
  BarChart3,
  Settings,
  Snowflake,
  Menu,
  X,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const allNavItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "dispatcher", "dispo"] },
  { path: "/orders", label: "Aufträge", icon: ClipboardList, roles: ["admin", "dispatcher", "dispo"] },
  { path: "/driver", label: "Meine Aufträge", icon: Truck, roles: ["driver", "fahrer"] },
  { path: "/customers", label: "Kunden", icon: Users, roles: ["admin", "dispatcher", "dispo"] },
  { path: "/reports", label: "Auswertung", icon: BarChart3, roles: ["admin", "dispatcher", "dispo"] },
  { path: "/settings", label: "Einstellungen", icon: Settings, roles: ["admin"] },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const role = user?.role || "driver";
  const navItems = allNavItems.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    base44.auth.logout();
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Snowflake className="w-6 h-6 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="font-bold text-sidebar-foreground text-lg truncate">WinterFlow</h1>
            <p className="text-xs text-sidebar-foreground/50 truncate">Winterdienst</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t border-sidebar-border">
        {user && !collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.full_name}</p>
            <p className="text-xs text-sidebar-foreground/50 capitalize">{role}</p>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Abmelden</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-card shadow-lg border"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transform transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <NavContent />
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-card border shadow-sm hover:bg-accent z-10"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={`w-3 h-3 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </Button>
      </aside>
    </>
  );
}