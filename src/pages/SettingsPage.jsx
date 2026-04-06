import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Shield, Truck, Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => base44.entities.User.list(),
  });

  const roleColors = {
    admin: "bg-red-500/20 text-red-400 border-red-500/30",
    dispo: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    fahrer: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Einstellungen" subtitle="System- und Benutzerverwaltung" />

      {/* Dark Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Erscheinungsbild
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Dunkelmodus</Label>
              <p className="text-sm text-muted-foreground">Optimal für Nachtarbeit und Fahrer</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* Users */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Benutzer & Rollen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium">{user.full_name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Badge variant="outline" className={`${roleColors[user.role] || roleColors.fahrer} border capitalize`}>
                  {user.role === "dispo" ? "Disposition" : user.role === "fahrer" ? "Fahrer" : "Admin"}
                </Badge>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-center text-muted-foreground py-4">Keine Benutzer gefunden</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Roles info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Rollen & Berechtigungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border">Admin</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Voller Zugriff auf alle Funktionen, Benutzerverwaltung, Einstellungen und Auswertungen.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">Disposition</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Aufträge erstellen und bearbeiten, Fahrer zuweisen, Dashboard, Kundenverwaltung und Auswertungen.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border">Fahrer</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Zugewiesene Aufträge ansehen, starten und beenden. Fotos und Material erfassen.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}