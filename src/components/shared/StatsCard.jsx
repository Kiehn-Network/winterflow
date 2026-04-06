import React from "react";
import { Card } from "@/components/ui/card";

export default function StatsCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <Card className="p-5 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${color} opacity-10 transform translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}