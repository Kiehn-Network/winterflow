import React from "react";
import { Badge } from "@/components/ui/badge";
import { Circle, Clock, CheckCircle2, AlertTriangle, UserCheck } from "lucide-react";

const statusConfig = {
  offen: { label: "Offen", icon: Circle, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  zugewiesen: { label: "Zugewiesen", icon: UserCheck, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  in_bearbeitung: { label: "In Bearbeitung", icon: Clock, color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  erledigt: { label: "Erledigt", icon: CheckCircle2, color: "bg-green-500/20 text-green-400 border-green-500/30" },
  problem: { label: "Problem", icon: AlertTriangle, color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.offen;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.color} border gap-1.5 font-medium`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}