import React from "react";
import StatsCard from "../shared/StatsCard";
import { ClipboardList, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

export default function StatusOverview({ orders }) {
  const counts = {
    offen: orders.filter((o) => o.status === "offen" || o.status === "zugewiesen").length,
    in_bearbeitung: orders.filter((o) => o.status === "in_bearbeitung").length,
    erledigt: orders.filter((o) => o.status === "erledigt").length,
    problem: orders.filter((o) => o.status === "problem").length,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="Offen" value={counts.offen} icon={ClipboardList} color="bg-yellow-500" subtitle="Warten auf Bearbeitung" />
      <StatsCard title="In Bearbeitung" value={counts.in_bearbeitung} icon={Clock} color="bg-cyan-500" subtitle="Gerade im Einsatz" />
      <StatsCard title="Erledigt" value={counts.erledigt} icon={CheckCircle2} color="bg-green-500" subtitle="Heute abgeschlossen" />
      <StatsCard title="Probleme" value={counts.problem} icon={AlertTriangle} color="bg-red-500" subtitle="Benötigt Aufmerksamkeit" />
    </div>
  );
}