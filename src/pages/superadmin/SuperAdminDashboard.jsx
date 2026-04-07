import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, ClipboardList, Plus, ArrowRight, CheckCircle, XCircle } from "lucide-react";

export default function SuperAdminDashboard() {
  const { data: companies = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ['sa-companies'],
    queryFn: () => base44.entities.Company.list('-created_date', 100),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ['sa-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 200),
  });
  const { data: users = [] } = useQuery({
    queryKey: ['sa-users'],
    queryFn: () => base44.entities.User.list(),
  });

  const stats = [
    { label: "Firmen gesamt", value: companies.length, icon: Building2, color: "text-blue-400" },
    { label: "Aktive Firmen", value: companies.filter(c => c.is_active).length, icon: CheckCircle, color: "text-green-400" },
    { label: "Aufträge gesamt", value: orders.length, icon: ClipboardList, color: "text-orange-400" },
    { label: "Nutzer gesamt", value: users.length, icon: Users, color: "text-purple-400" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin</h1>
          <p className="text-muted-foreground mt-1">Alle Firmen, Aufträge und Nutzer im Überblick</p>
        </div>
        <Button asChild>
          <Link to="/superadmin/companies/new">
            <Plus className="w-4 h-4 mr-2" />
            Firma erstellen
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Companies List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Firmen</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/superadmin/companies">Alle anzeigen <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loadingCompanies ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14" />)}</div>
          ) : companies.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Noch keine Firmen angelegt.</p>
          ) : (
            <div className="space-y-2">
              {companies.slice(0, 8).map(company => (
                <div key={company.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{company.name}</div>
                      <div className="text-xs text-muted-foreground">{company.subdomain}.winterflow.de</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{company.plan || 'starter'}</Badge>
                    {company.is_active
                      ? <Badge className="bg-green-500/10 text-green-500 border-green-500/30 text-xs">Aktiv</Badge>
                      : <Badge className="bg-red-500/10 text-red-500 border-red-500/30 text-xs">Inaktiv</Badge>
                    }
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/superadmin/companies/${company.id}`}><ArrowRight className="w-4 h-4" /></Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}