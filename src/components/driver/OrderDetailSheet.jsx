import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Camera, Plus, Trash2, Save } from "lucide-react";

const MATERIALS = [
  { name: "Salz", unit: "kg" },
  { name: "Splitt", unit: "kg" },
  { name: "Sand", unit: "kg" },
  { name: "Enteiser", unit: "l" },
];

export default function OrderDetailSheet({ open, onOpenChange, order, onUpdate }) {
  const [notes, setNotes] = useState(order?.driver_notes || "");
  const [materials, setMaterials] = useState(order?.materials_used || []);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const field = type === "before" ? "photo_before_url" : "photo_after_url";
      await onUpdate(order.id, { [field]: file_url });
      setUploading(false);
    };
    input.click();
  };

  const addMaterial = () => {
    setMaterials([...materials, { material: "Salz", amount: 0, unit: "kg" }]);
  };

  const removeMaterial = (index) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index, field, value) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "material") {
      const mat = MATERIALS.find((m) => m.name === value);
      if (mat) updated[index].unit = mat.unit;
    }
    setMaterials(updated);
  };

  const handleSave = () => {
    onUpdate(order.id, {
      driver_notes: notes,
      materials_used: materials,
    });
    onOpenChange(false);
  };

  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Auftragsdetails</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Photos */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Fotos</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Button
                  variant="outline"
                  className="w-full h-24 flex-col gap-2"
                  onClick={() => handlePhotoUpload("before")}
                  disabled={uploading}
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-xs">Foto vorher</span>
                </Button>
                {order.photo_before_url && (
                  <img src={order.photo_before_url} alt="Vorher" className="mt-2 rounded-lg w-full h-24 object-cover" />
                )}
              </div>
              <div>
                <Button
                  variant="outline"
                  className="w-full h-24 flex-col gap-2"
                  onClick={() => handlePhotoUpload("after")}
                  disabled={uploading}
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-xs">Foto nachher</span>
                </Button>
                {order.photo_after_url && (
                  <img src={order.photo_after_url} alt="Nachher" className="mt-2 rounded-lg w-full h-24 object-cover" />
                )}
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Materialverbrauch</Label>
              <Button variant="outline" size="sm" onClick={addMaterial}>
                <Plus className="w-4 h-4 mr-1" /> Hinzufügen
              </Button>
            </div>
            {materials.map((mat, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Select value={mat.material} onValueChange={(v) => updateMaterial(i, "material", v)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIALS.map((m) => (
                      <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={mat.amount}
                  onChange={(e) => updateMaterial(i, "amount", parseFloat(e.target.value) || 0)}
                  className="w-20"
                  min={0}
                />
                <span className="text-sm text-muted-foreground w-8">{mat.unit}</span>
                <Button variant="ghost" size="icon" onClick={() => removeMaterial(i)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Notizen</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Besonderheiten, Probleme..."
              rows={4}
            />
          </div>

          <Button onClick={handleSave} className="w-full h-12 text-base font-bold">
            <Save className="w-5 h-5 mr-2" /> Speichern
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}