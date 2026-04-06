import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X } from "lucide-react";

export default function CustomerFormDialog({ open, onOpenChange, customer, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "privat",
    address: "",
    contact_person: "",
    phone: "",
    email: "",
    notes: "",
    sla_priority: "standard",
    contract_active: true,
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        type: customer.type || "privat",
        address: customer.address || "",
        contact_person: customer.contact_person || "",
        phone: customer.phone || "",
        email: customer.email || "",
        notes: customer.notes || "",
        sla_priority: customer.sla_priority || "standard",
        contract_active: customer.contract_active !== false,
      });
    } else {
      setFormData({
        name: "", type: "privat", address: "", contact_person: "",
        phone: "", email: "", notes: "", sla_priority: "standard", contract_active: true,
      });
    }
  }, [customer, open]);

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{customer ? "Kunde bearbeiten" : "Neuer Kunde"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label>Name *</Label>
              <Input value={formData.name} onChange={(e) => update("name", e.target.value)} placeholder="Firmenname oder Name" />
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label>Typ *</Label>
              <Select value={formData.type} onValueChange={(v) => update("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="privat">Privat</SelectItem>
                  <SelectItem value="gewerblich">Gewerblich</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Adresse *</Label>
            <Input value={formData.address} onChange={(e) => update("address", e.target.value)} placeholder="Straße, PLZ Ort" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ansprechpartner</Label>
              <Input value={formData.contact_person} onChange={(e) => update("contact_person", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input value={formData.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>E-Mail</Label>
              <Input value={formData.email} onChange={(e) => update("email", e.target.value)} type="email" />
            </div>
            <div className="space-y-2">
              <Label>SLA-Priorität</Label>
              <Select value={formData.sla_priority} onValueChange={(v) => update("sla_priority", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Anmerkungen</Label>
            <Textarea value={formData.notes} onChange={(e) => update("notes", e.target.value)} rows={3} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}><X className="w-4 h-4 mr-2" /> Abbrechen</Button>
            <Button onClick={handleSubmit}><Save className="w-4 h-4 mr-2" /> Speichern</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}