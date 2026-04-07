import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const slugify = (str) =>
  str.toLowerCase().replace(/[äöüß]/g, c => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c] || c))
     .replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

export default function CompanyFormDialog({ open, onOpenChange, company, onSave, isSaving }) {
  const [form, setForm] = useState({ name: '', subdomain: '', contact_email: '', contact_phone: '', address: '', plan: 'starter', is_active: true });
  const [subdomainManuallyEdited, setSubdomainManuallyEdited] = useState(false);

  useEffect(() => {
    if (company) {
      setForm({ name: company.name || '', subdomain: company.subdomain || '', contact_email: company.contact_email || '', contact_phone: company.contact_phone || '', address: company.address || '', plan: company.plan || 'starter', is_active: company.is_active !== false });
      setSubdomainManuallyEdited(true);
    } else {
      setForm({ name: '', subdomain: '', contact_email: '', contact_phone: '', address: '', plan: 'starter', is_active: true });
      setSubdomainManuallyEdited(false);
    }
  }, [company, open]);

  const handleNameChange = (val) => {
    setForm(f => ({
      ...f,
      name: val,
      subdomain: subdomainManuallyEdited ? f.subdomain : slugify(val)
    }));
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    onSave({ ...(company?.id ? { id: company.id } : {}), ...form });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{company ? 'Firma bearbeiten' : 'Neue Firma erstellen'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Firmenname *</Label>
            <Input value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="Mustermann Winterdienst GmbH" />
          </div>

          <div className="space-y-1">
            <Label>Subdomain *</Label>
            <div className="flex items-center gap-1">
              <Input
                value={form.subdomain}
                onChange={e => { setSubdomainManuallyEdited(true); set('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); }}
                placeholder="mustermann"
                className="flex-1"
              />
              <span className="text-muted-foreground text-sm whitespace-nowrap">.winterflow.de</span>
            </div>
            <p className="text-xs text-muted-foreground">Nur Kleinbuchstaben, Zahlen und Bindestriche</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>E-Mail</Label>
              <Input value={form.contact_email} onChange={e => set('contact_email', e.target.value)} placeholder="info@firma.de" type="email" />
            </div>
            <div className="space-y-1">
              <Label>Telefon</Label>
              <Input value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} placeholder="+49 89 ..." />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Adresse</Label>
            <Input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Musterstr. 1, 80001 München" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Tarifplan</Label>
              <Select value={form.plan} onValueChange={v => set('plan', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.is_active ? 'active' : 'inactive'} onValueChange={v => set('is_active', v === 'active')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={handleSubmit} disabled={!form.name || !form.subdomain || isSaving}>
            {isSaving ? 'Speichern...' : company ? 'Aktualisieren' : 'Firma erstellen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}