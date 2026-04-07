import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Users, ClipboardList, Mail, Building2, ExternalLink, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function CompanyDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("driver");

  const { data: company, isLoading } = useQuery({
    queryKey: ['sa-company', id],
    queryFn: async () => {
      const list = await base44.entities.Company.filter({ id });
      return list[0];
    }
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['sa-company-orders', id],
    queryFn: () => base44.entities.Order.filter({ company_id: id }),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['sa-company-customers', id],
    queryFn: () => base44.entities.Customer.filter({ company_id: id }),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['sa-company-users', id],
    queryFn: () => base44.entities.User.filter({ company_id: id }),
  });

  const inviteMutation = useMutation({
    mutationFn: async ({ email, role }) => {
      await base44.users.inviteUser(email, role);
      // After inviting, we'd update the user's company_id but that requires the user to exist first
    },
    onSuccess: () => {
      toast({ title: "Einladung gesendet", description: `${inviteEmail} wurde eingeladen.` });
      setInviteEmail("");
      qc.invalidateQueries({ queryKey: ['sa-company-users', id] });
    }
  });

  const copySubdomain = () => {
    navigator.clipboard.writeText(`${company?.subdomain}.winterflow.de`);
    toast({ title: "Kopiert!", description: "Subdomain wurde kopiert." });
  };

  if (isLoading) return <div className="p-6"><Skeleton className="h-64" /></div>;
  if (!company) return <div className="p-6 text-muted-foreground">Firma nicht gefunden.</div>;

  const statusColor = { offen: "bg-yellow-500/20 text-yellow-400", zugewiesen: "bg-blue-500/20 text-blue-400", in_bearbeitung: "bg-cyan-500/20 text-cyan-400", erledigt: "bg-green-500/20 text-green-400", problem: "bg-red-500/20 text-red-400" };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/superadmin/companies"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-muted-foreground text-sm">{company.plan} · {company.is_active ? 'Aktiv' : 'Inaktiv'}</p>
        </div>
      </div>

      {/* Info + Subdomain */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Firmendaten</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {company.address && <div><span className="text-muted-foreground">Adresse: </span>{company.address}</div>}
            {company.contact_email && <div><span className="text-muted-foreground">E-Mail: </span>{company.contact_email}</div>}
            {company.contact_phone && <div><span className="text-muted-foreground">Telefon: </span>{company.contact_phone}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Subdomain</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="font-mono text-sm flex-1">{company.subdomain}.winterflow.de</span>
              <Button variant="ghost" size="icon" onClick={copySubdomain}><Copy className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={`https://${company.subdomain}.winterflow.de`} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">DNS-Eintrag: <span className="font-mono">{company.subdomain}.winterflow.de → CNAME → winterflow.de</span></p>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Aufträge", value: orders.length, icon: ClipboardList },
          { label: "Kunden", value: customers.length, icon: Building2 },
          { label: "Nutzer", value: users.length, icon: Users },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invite User */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Mail className="w-4 h-4" /> Nutzer einladen</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="E-Mail-Adresse"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value)}
              className="border border-input rounded-md px-3 py-2 text-sm bg-background"
            >
              <option value="admin">Admin</option>
              <option value="dispatcher">Disponent</option>
              <option value="driver">Fahrer</option>
            </select>
            <Button
              onClick={() => inviteMutation.mutate({ email: inviteEmail, role: inviteRole })}
              disabled={!inviteEmail || inviteMutation.isPending}
            >
              Einladen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users */}
      <Card>
        <CardHeader><CardTitle className="text-base">Nutzer ({users.length})</CardTitle></CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-muted-foreground text-sm">Noch keine Nutzer dieser Firma.</p>
          ) : (
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <div className="text-sm font-medium">{u.full_name || u.email}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">{u.role}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader><CardTitle className="text-base">Aufträge ({orders.length})</CardTitle></CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-sm">Keine Aufträge vorhanden.</p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 10).map(o => (
                <div key={o.id} className="flex items-center justify-between p-2 rounded border text-sm">
                  <div>
                    <span className="font-medium">{o.customer_name}</span>
                    <span className="text-muted-foreground ml-2">{o.address}</span>
                  </div>
                  <Badge className={`text-xs ${statusColor[o.status] || ''}`}>{o.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}