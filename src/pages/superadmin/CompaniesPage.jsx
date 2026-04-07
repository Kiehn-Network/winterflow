import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Plus, Search, ArrowRight, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import CompanyFormDialog from "@/components/superadmin/CompanyFormDialog";

export default function CompaniesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['sa-companies'],
    queryFn: () => base44.entities.Company.list('-created_date', 200),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => data.id
      ? base44.entities.Company.update(data.id, data)
      : base44.entities.Company.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sa-companies'] }); setDialogOpen(false); setEditingCompany(null); }
  });

  const toggleMutation = useMutation({
    mutationFn: (company) => base44.entities.Company.update(company.id, { is_active: !company.is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sa-companies'] })
  });

  const filtered = companies.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.subdomain?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditingCompany(null); setDialogOpen(true); };
  const openEdit = (c) => { setEditingCompany(c); setDialogOpen(true); };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Firmen</h1>
          <p className="text-muted-foreground mt-1">{companies.length} Firmen registriert</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Firma erstellen</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Firma suchen..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-20" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">Keine Firmen gefunden.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(company => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{company.name}</div>
                    <div className="text-sm text-muted-foreground">{company.subdomain}.winterflow.de</div>
                    {company.contact_email && (
                      <div className="text-xs text-muted-foreground">{company.contact_email}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs capitalize">{company.plan || 'starter'}</Badge>
                  {company.is_active
                    ? <Badge className="bg-green-500/10 text-green-500 border-green-500/30 text-xs">Aktiv</Badge>
                    : <Badge className="bg-red-500/10 text-red-500 border-red-500/30 text-xs">Inaktiv</Badge>
                  }
                  <Button variant="ghost" size="icon" onClick={() => toggleMutation.mutate(company)}>
                    {company.is_active ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(company)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/superadmin/companies/${company.id}`}><ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CompanyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        company={editingCompany}
        onSave={(data) => saveMutation.mutate(data)}
        isSaving={saveMutation.isPending}
      />
    </div>
  );
}