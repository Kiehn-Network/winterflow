import React from "react";
import { Badge } from "@/components/ui/badge";

const priorityConfig = {
  niedrig: { label: "Niedrig", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  normal: { label: "Normal", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  hoch: { label: "Hoch", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  dringend: { label: "Dringend", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export default function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.normal;
  return (
    <Badge variant="outline" className={`${config.color} border font-medium`}>
      {config.label}
    </Badge>
  );
}