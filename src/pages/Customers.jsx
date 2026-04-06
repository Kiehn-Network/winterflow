import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2, Phone, Mail, MapPin, Building2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PageHeader from "../components/shared/PageHeader";
import CustomerFormDialog from "../components/customers/CustomerFormDialog";
import CustomerTypeBadge from "../components/shared/CustomerTypeBadge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Customers() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => base44.entities.Customer.list("-created_date", 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Customer.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Customer.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Customer.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  const handleSave = (data) => {
    if (editingCustomer) {
      updateMutation.mutate({ id: editingCustomer.id, data });
    } else {
      createMutation.mutate(data);
    }
    setEditingCustomer(null);
  };

  const filtered = customers.filter((c) =>
    !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.address?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Kunden" subtitle={`${customers.length} Kunden insgesamt`}>
        <Button onClick={() => { setEditingCustomer(null); setFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Neuer Kunde
        </Button>
      </PageHeader>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Kunden suchen..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                  <CustomerTypeBadge type={customer.type} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingCustomer(customer); setFormOpen(true); }}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => window.confirm("Kunde löschen?") && deleteMutation.mutate(customer.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> <span className="truncate">{customer.address}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> {customer.phone}
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> {customer.email}
                  </div>
                )}
              </div>
              {customer.sla_priority !== "standard" && (
                <Badge variant="outline" className="mt-3 text-xs capitalize bg-orange-500/10 text-orange-400 border-orange-500/30">
                  SLA: {customer.sla_priority}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">Keine Kunden gefunden</div>
      )}

      <CustomerFormDialog open={formOpen} onOpenChange={setFormOpen} customer={editingCustomer} onSave={handleSave} />
    </div>
  );
}