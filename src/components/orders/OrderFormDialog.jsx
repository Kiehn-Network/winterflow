import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Save, X } from "lucide-react";

const TASKS_OPTIONS = [
  "Schnee räumen",
  "Streuen (Salz)",
  "Streuen (Splitt)",
  "Gehweg räumen",
  "Parkplatz räumen",
  "Einfahrt räumen",
  "Dachlast kontrollieren",
  "Eiszapfen entfernen",
];

export default function OrderFormDialog({ open, onOpenChange, order, onSave }) {
  const [formData, setFormData] = useState({
    customer_id: "",
    address: "",
    status: "offen",
    priority: "normal",
    assigned_driver_email: "",
    assigned_driver_name: "",
    tasks: [],
    scheduled_date: new Date().toISOString().split("T")[0],
    dispatcher_notes: "",
    is_recurring: false,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => base44.entities.Customer.list(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => base44.entities.User.list(),
  });

  const drivers = users.filter((u) => u.role === "fahrer" || !u.role);

  useEffect(() => {
    if (order) {
      setFormData({
        customer_id: order.customer_id || "",
        address: order.address || "",
        status: order.status || "offen",
        priority: order.priority || "normal",
        assigned_driver_email: order.assigned_driver_email || "",
        assigned_driver_name: order.assigned_driver_name || "",
        tasks: order.tasks || [],
        scheduled_date: order.scheduled_date || new Date().toISOString().split("T")[0],
        dispatcher_notes: order.dispatcher_notes || "",
        is_recurring: order.is_recurring || false,
      });
    } else {
      setFormData({
        customer_id: "",
        address: "",
        status: "offen",
        priority: "normal",
        assigned_driver_email: "",
        assigned_driver_name: "",
        tasks: [],
        scheduled_date: new Date().toISOString().split("T")[0],
        dispatcher_notes: "",
        is_recurring: false,
      });
    }
  }, [order, open]);

  const handleCustomerChange = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customer_id: customerId,
        address: customer.address,
        customer_name: customer.name,
        customer_type: customer.type,
        latitude: customer.latitude,
        longitude: customer.longitude,
      }));
    }
  };

  const handleDriverChange = (email) => {
    const driver = drivers.find((d) => d.email === email);
    setFormData((prev) => ({
      ...prev,
      assigned_driver_email: email,
      assigned_driver_name: driver?.full_name || "",
      status: email ? "zugewiesen" : prev.status,
    }));
  };

  const toggleTask = (task) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.includes(task)
        ? prev.tasks.filter((t) => t !== task)
        : [...prev.tasks, task],
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order ? "Auftrag bearbeiten" : "Neuer Auftrag"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Kunde */}
          <div className="space-y-2">
            <Label>Kunde *</Label>
            <Select value={formData.customer_id} onValueChange={handleCustomerChange}>
              <SelectTrigger>
                <SelectValue placeholder="Kunde auswählen" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <Label>Adresse *</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Einsatzadresse"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priorität */}
            <div className="space-y-2">
              <Label>Priorität</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData((prev) => ({ ...prev, priority: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="niedrig">Niedrig</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="hoch">Hoch</SelectItem>
                  <SelectItem value="dringend">Dringend</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Datum */}
            <div className="space-y-2">
              <Label>Geplantes Datum</Label>
              <Input
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, scheduled_date: e.target.value }))}
              />
            </div>
          </div>

          {/* Fahrer */}
          <div className="space-y-2">
            <Label>Fahrer zuweisen</Label>
            <Select value={formData.assigned_driver_email} onValueChange={handleDriverChange}>
              <SelectTrigger><SelectValue placeholder="Fahrer auswählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>Nicht zugewiesen</SelectItem>
                {drivers.map((d) => (
                  <SelectItem key={d.email} value={d.email}>
                    {d.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tätigkeiten */}
          <div className="space-y-2">
            <Label>Tätigkeiten</Label>
            <div className="grid grid-cols-2 gap-2">
              {TASKS_OPTIONS.map((task) => (
                <div key={task} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer" onClick={() => toggleTask(task)}>
                  <Checkbox checked={formData.tasks.includes(task)} />
                  <span className="text-sm">{task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notizen */}
          <div className="space-y-2">
            <Label>Notizen</Label>
            <Textarea
              value={formData.dispatcher_notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, dispatcher_notes: e.target.value }))}
              placeholder="Hinweise für den Fahrer..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" /> Abbrechen
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" /> Speichern
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}