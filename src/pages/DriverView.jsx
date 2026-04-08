import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../components/shared/PageHeader";
import DriverOrderCard from "../components/driver/DriverOrderCard";
import OrderDetailSheet from "../components/driver/OrderDetailSheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DriverView() {
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tab, setTab] = useState("aktiv");
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["driver-orders", user?.email],
    queryFn: () => base44.entities.Order.filter({ assigned_driver_email: user.email }, "-created_date", 50),
    enabled: !!user?.email,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["driver-orders", user?.email] }),
  });

  const handleStart = (order) => {
    updateMutation.mutate({
      id: order.id,
      data: { status: "in_bearbeitung", start_time: new Date().toISOString() },
    });
  };

  const handleFinish = (order) => {
    const start = new Date(order.start_time);
    const duration = Math.round((new Date() - start) / 60000);
    updateMutation.mutate({
      id: order.id,
      data: {
        status: "erledigt",
        end_time: new Date().toISOString(),
        duration_minutes: duration,
      },
    });
  };

  const handleProblem = (order) => {
    updateMutation.mutate({
      id: order.id,
      data: { status: "problem" },
    });
  };

  const handleUpdate = (id, data) => {
    updateMutation.mutate({ id, data });
  };

  const activeOrders = orders.filter((o) => ["zugewiesen", "in_bearbeitung"].includes(o.status));
  const doneOrders = orders.filter((o) => o.status === "erledigt");
  const displayOrders = tab === "aktiv" ? activeOrders : doneOrders;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Meine Aufträge" subtitle={`${activeOrders.length} aktive Aufträge`} />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full">
          <TabsTrigger value="aktiv" className="flex-1">
            Aktiv ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="erledigt" className="flex-1">
            Erledigt ({doneOrders.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {displayOrders.map((order) => (
          <DriverOrderCard
            key={order.id}
            order={order}
            onStart={handleStart}
            onFinish={handleFinish}
            onProblem={handleProblem}
            onSelect={setSelectedOrder}
          />
        ))}
        {displayOrders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {tab === "aktiv" ? "Keine aktiven Aufträge" : "Keine erledigten Aufträge"}
          </div>
        )}
      </div>

      <OrderDetailSheet
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        order={selectedOrder}
        onUpdate={handleUpdate}
      />
    </div>
  );
}