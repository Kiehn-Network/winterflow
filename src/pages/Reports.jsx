import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/shared/PageHeader";
import StatsCard from "../components/shared/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Clock, ClipboardList, Package, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTenant } from "@/lib/TenantContext";

const COLORS = ["hsl(213, 94%, 55%)", "hsl(187, 85%, 48%)", "hsl(152, 69%, 46%)", "hsl(38, 92%, 55%)", "hsl(0, 72%, 55%)"];

export default function Reports() {
  const { companyId } = useTenant();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", companyId],
    queryFn: () => companyId
      ? base44.entities.Order.filter({ company_id: companyId }, "-created_date", 200)
      : base44.entities.Order.list("-created_date", 200),
  });

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "erledigt");
  const totalDuration = completedOrders.reduce((sum, o) => sum + (o.duration_minutes || 0), 0);
  const avgDuration = completedOrders.length > 0 ? Math.round(totalDuration / completedOrders.length) : 0;

  // Status distribution
  const statusData = [
    { name: "Offen", value: orders.filter((o) => o.status === "offen").length },
    { name: "Zugewiesen", value: orders.filter((o) => o.status === "zugewiesen").length },
    { name: "In Bearbeitung", value: orders.filter((o) => o.status === "in_bearbeitung").length },
    { name: "Erledigt", value: orders.filter((o) => o.status === "erledigt").length },
    { name: "Problem", value: orders.filter((o) => o.status === "problem").length },
  ].filter((d) => d.value > 0);

  // Material usage
  const materialMap = {};
  orders.forEach((o) => {
    (o.materials_used || []).forEach((m) => {
      materialMap[m.material] = (materialMap[m.material] || 0) + (m.amount || 0);
    });
  });
  const materialData = Object.entries(materialMap).map(([name, value]) => ({ name, value: Math.round(value) }));

  // Driver workload
  const driverMap = {};
  completedOrders.forEach((o) => {
    if (o.assigned_driver_name) {
      if (!driverMap[o.assigned_driver_name]) {
        driverMap[o.assigned_driver_name] = { orders: 0, minutes: 0 };
      }
      driverMap[o.assigned_driver_name].orders++;
      driverMap[o.assigned_driver_name].minutes += o.duration_minutes || 0;
    }
  });
  const driverData = Object.entries(driverMap).map(([name, data]) => ({
    name,
    auftraege: data.orders,
    minuten: data.minutes,
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Auswertung" subtitle="Statistiken und Berichte" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Aufträge gesamt" value={totalOrders} icon={ClipboardList} color="bg-blue-500" />
        <StatsCard title="Erledigt" value={completedOrders.length} icon={ClipboardList} color="bg-green-500" />
        <StatsCard title="Ø Dauer (Min.)" value={avgDuration} icon={Clock} color="bg-cyan-500" />
        <StatsCard title="Gesamtzeit (Std.)" value={Math.round(totalDuration / 60)} icon={Clock} color="bg-orange-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Auftragsverteilung</CardTitle></CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">Keine Daten</p>
            )}
          </CardContent>
        </Card>

        {/* Material Usage */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Materialverbrauch</CardTitle></CardHeader>
          <CardContent>
            {materialData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={materialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">Keine Materialien erfasst</p>
            )}
          </CardContent>
        </Card>

        {/* Driver Workload */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Arbeitszeit pro Fahrer</CardTitle></CardHeader>
          <CardContent>
            {driverData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={driverData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="auftraege" name="Aufträge" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="minuten" name="Minuten" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">Keine Fahrerdaten</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}