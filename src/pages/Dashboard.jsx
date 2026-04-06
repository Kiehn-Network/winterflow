import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/shared/PageHeader";
import StatusOverview from "../components/dashboard/StatusOverview";
import LiveMap from "../components/dashboard/LiveMap";
import RecentOrders from "../components/dashboard/RecentOrders";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => base44.entities.Order.list("-created_date", 50),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Übersicht aller Winterdienst-Einsätze" />
      <StatusOverview orders={orders} />
      <div className="grid lg:grid-cols-2 gap-6">
        <LiveMap orders={orders} />
        <RecentOrders orders={orders} />
      </div>
    </div>
  );
}