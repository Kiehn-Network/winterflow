import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import OrdersTable from "../components/orders/OrdersTable";
import OrderFormDialog from "../components/orders/OrderFormDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function Orders() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => base44.entities.Order.list("-created_date", 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Order.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Order.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const handleSave = (data) => {
    if (editingOrder) {
      updateMutation.mutate({ id: editingOrder.id, data });
    } else {
      createMutation.mutate(data);
    }
    setEditingOrder(null);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Auftrag wirklich löschen?")) {
      deleteMutation.mutate(id);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.address?.toLowerCase().includes(search.toLowerCase()) ||
      o.assigned_driver_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Aufträge" subtitle={`${orders.length} Aufträge insgesamt`}>
        <Button onClick={() => { setEditingOrder(null); setFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Neuer Auftrag
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Suche nach Kunde, Adresse, Fahrer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="offen">Offen</SelectItem>
            <SelectItem value="zugewiesen">Zugewiesen</SelectItem>
            <SelectItem value="in_bearbeitung">In Bearbeitung</SelectItem>
            <SelectItem value="erledigt">Erledigt</SelectItem>
            <SelectItem value="problem">Problem</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <OrdersTable orders={filtered} onEdit={handleEdit} onDelete={handleDelete} />

      <OrderFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        order={editingOrder}
        onSave={handleSave}
      />
    </div>
  );
}