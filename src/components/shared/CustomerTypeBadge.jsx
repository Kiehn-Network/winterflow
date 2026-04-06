import React from "react";
import { Badge } from "@/components/ui/badge";
import { Building2, User } from "lucide-react";

export default function CustomerTypeBadge({ type }) {
  const isPrivat = type === "privat";
  return (
    <Badge variant="outline" className={`gap-1.5 font-medium ${
      isPrivat 
        ? "bg-purple-500/20 text-purple-400 border-purple-500/30" 
        : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    }`}>
      {isPrivat ? <User className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
      {isPrivat ? "Privat" : "Gewerblich"}
    </Badge>
  );
}