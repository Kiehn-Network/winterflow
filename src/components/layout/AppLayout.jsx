import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useTenant } from "@/lib/TenantContext";
import { Button } from "@/components/ui/button";
import { LogOut, Building2 } from "lucide-react";

export default function AppLayout() {
  const { impersonating, company, logoutFromCompany } = useTenant();
  const navigate = useNavigate();

  const handleExitImpersonation = () => {
    logoutFromCompany();
    navigate("/superadmin/companies");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {impersonating && company && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <Building2 className="w-4 h-4" />
              <span>Du siehst die App als <strong>{company.name}</strong></span>
            </div>
            <Button size="sm" variant="outline" onClick={handleExitImpersonation} className="gap-2 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10">
              <LogOut className="w-3.5 h-3.5" />
              Zurück zum Super-Admin
            </Button>
          </div>
        )}
        <div className="p-4 lg:p-6 pt-16 lg:pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}