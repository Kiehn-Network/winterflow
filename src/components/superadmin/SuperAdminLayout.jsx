import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Snowflake, LayoutDashboard, Building2, Users, ClipboardList, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";

const navItems = [
  { label: "Dashboard", path: "/superadmin", icon: LayoutDashboard },
  { label: "Firmen", path: "/superadmin/companies", icon: Building2 },
];

export default function SuperAdminLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-60 bg-sidebar flex flex-col shrink-0">
        <div className="p-5 flex items-center gap-2 border-b border-sidebar-border">
          <Snowflake className="w-6 h-6 text-primary" />
          <div>
            <div className="font-bold text-sidebar-foreground text-sm">WinterFlow</div>
            <div className="text-xs text-orange-400 font-semibold">Super Admin</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => {
            const active = pathname === item.path || (item.path !== '/superadmin' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => base44.auth.logout(window.location.href)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent w-full"
          >
            <LogOut className="w-4 h-4" />
            Abmelden
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}